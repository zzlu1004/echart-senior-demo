<template>
  <div class="app-container">
    <div class="container-inner bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="clearfix mb2">
        <span class="f-left align-middle">
            <span v-if="elements.add" class="btn btn-sm btn-primary" @click="addCoefficient">
              <i class="at icon-plus"/>新增系数
            </span>
        </span>
        <span class="f-right height-normal line-height-normal align-middle">
            <span>生效中</span>
            <el-popover
                placement="bottom"
                width="310"
                trigger="hover"
                content="当前所关联的方案正在生效周期中，为了保证考核方案的正常实施，系统暂时不开放对该方案相关的细则、指标、流程以及权重系数等进行编辑或删除操作。">
                <i slot="reference" class="at icon-questioncircle color-d9d9d9 pointer"/>
            </el-popover>
        </span>
        <span class="f-right mr2">
          <fd-search @search="searchByKeyword"
                      v-model="keyword"></fd-search>
        </span>
      </div>
      <div>
        <fd-table :option="tableOpt" v-on:cellClick="cellClick" :loading="tableLoading"></fd-table>
      </div>
      <fd-pagination
        :limit="limit"
        :offset="offset"
        :currentChange="currentChange"
        :sizeChange="sizeChange"
        :sizes=true
        :total= "total"
      ></fd-pagination>
      <!-- <complex-table
              :tableOpt="tableOpt" 
              :rightOpt="rightOpt" 
              :leftOpt="leftOpt" 
              :paginationOpt="paginationOpt"
              v-on:refreshTable="getList"></complex-table> -->
    </div>
     <fd-dialog
      title="新增系数"
      :syncVisible="addCoefficientDialog"
      @beforeClose="addCoefficientDialog = false"
    >
      <div slot="fd-body">
        <el-row>
          <el-col :span="20">
            <el-form :rules="rules"
                     :model="formData"
                     label-position="right"
                     labelWidth="35%"
                     ref="detailForm">
              <el-form-item label="权重系数名称" prop="name">
                <el-input v-model="formData.name"
                          placeholder="请输入权重系数名称">
                </el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
      </div>
      <div slot="fd-footer">
        <el-button size="small" @click="addCoefficientDialog = false">取消</el-button>
	      <el-button size="small" type="primary" @click="saveNewCoefficient">确定</el-button>
      </div>
    </fd-dialog>
    <fd-dialog
      title="启用失败"
      :syncVisible="checkCoefficientDialog"
      @beforeClose="checkCoefficientDialog = false"
    >
      <div slot="fd-body">
        <div class="relative mt1" v-for="(item, index) of checkErrorList" :key="index">
          <el-tooltip class="item" effect="dark" :content="item" placement="top-start">
            <div class="dot-hidden pr8">{{item}}</div>
          </el-tooltip>
          <div class="absolute right-2 top-0 color-red">
            <i class="at icon-closecircle"/>
          </div>
        </div>
      </div>
      <div slot="fd-footer">
        <el-button size="small" type="primary" @click="checkCoefficientDialog = false">确定</el-button>
      </div>
    </fd-dialog>
  </div>
</template>

<script>
  import fdTable from 'fd/table'
  import FdPagination from 'fd/pagination/pagination'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  import complexTable from 'fd/complexTable/complexTable'
  import {
    refreshList,
    currentChange,
    getList,
    sizeChange,
    addCoefficient,
    editCoefficient,
    copyCoefficient,
    showCoefficient,
    deleteCoefficient,
    saveNewCoefficient,
    cellClick,
    startCoefficient,
    cancelCoefficient,
    checkCoefficient,
    searchByKeyword
  } from '@/api/kpi/check/coefficient'
  import { resetForm } from '@/api/common'
  export default {
    name: 'weightCoefficient',
    components: { fdTable, FdPagination, fdDialog, complexTable },
    props: {},
    data() {
      return {
        keyword: '',
        limit: 10,
        offset: 0,
        total: 0,
        forbid: 1,
        addCoefficientDialog: false,
        checkCoefficientDialog: false,
        checkErrorList: [],
        formData: {
          name: ''
        },
        tableOpt: {
          stripe: true,
          border: true,
          cellClick: (row, column, cell, event) => {
            this.cellClick(row, column, cell, event)
          },
          loading: false,
          data: [],
          emptyText: '当前暂无系数，点击左上角添加系数',
          columns: [
            {
              field: 'name',
              title: '权重系数名称',
              showOverflowTooltip: true,
              formatter: (row, value) => {
                return '<span class="color-link pointer">' + value + '</span>'
              }
            },
            {
              field: 'isUse',
              title: '当前状态',
              width: '300px',
              formatter: (row, value) => {
                const map = {
                  '0': '未启用',
                  '1': '已启用',
                  '2': '启用中',
                  '3': '启用失败'
                }
                return map[value] || '未启用'
              }
            },
            {
              field: '',
              title: '操作',
              width: this.fd.tools.getStringWidth('操作3'),
              number: [
                { text: '编辑', type: 'text', show: 'enable_edit', disabled: 'edit', click: (d, row) => { this.editCoefficient(row) } },
                { text: '启用', type: 'text', show: 'enable_enabled', disabled: 'enabled', click: (d, row) => { this.checkCoefficient(row) } },
                { text: '停用', type: 'text', show: 'enable_cancel', disabled: 'cancel', click: (d, row) => { this.cancelCoefficient(row) } },
                { text: '复制', type: 'text', show: 'enable_copy', click: (d, row) => { this.copyCoefficient(row) } },
                { text: '删除', type: 'text', show: 'enable_delete', disabled: 'delete', click: (d, row) => { this.deleteCoefficient(row) } }
              ]
            }
          ]
        },
        paginationOpt: {
          total: 0
        },
        rightOpt: {
          btnOpt: [{
            type: 'search',
            enter: (val) => { this.searchByKeyword(val) }
          }, {
            type: 'text',
            text: '生效中',
            iconClass: 'at icon-questioncircle',
            content: '当前所关联的方案正在生效周期中，为了保证考核方案的正常实施，系统暂时不开放对该方案相关的细则、指标、流程以及权重系数等进行编辑或删除操作。'
          }]
        },
        leftOpt: {
          btnOpt: [{
            type: 'button',
            text: '新增系数',
            iconClass: 'at icon-plus',
            click: () => { this.addCoefficient() }
          }]
        },
        // tableOpt: {
        //   stripe: true,
        //   border: true,
        //   data: [],
        //   emptyText: '当前暂无系数，点击左上角添加系数',
        //   columns: [
        //     {
        //       field: 'name',
        //       title: '权重系数名称',
        //       showOverflowTooltip: true,
        //       formatter: (row, value) => {
        //         return '<span class="color-link pointer">' + value + '</span>'
        //       }
        //     },
        //     {
        //       field: 'isUse',
        //       title: '当前状态',
        //       width: '300px',
        //       formatter: (row, value) => {
        //         const map = {
        //           '0': '未启用',
        //           '1': '已启用',
        //           '2': '启用中',
        //           '3': '启用失败'
        //         }
        //         return map[value] || '未启用'
        //       }
        //     },
        //     {
        //       field: '',
        //       title: '操作',
        //       width: this.fd.tools.getStringWidth('操作3'),
        //       number: [
        //         { text: '编辑', type: 'text', show: 'enable_edit', disabled: 'edit', click: (d, row) => { this.editCoefficient(row) } },
        //         { text: '启用', type: 'text', show: 'enable_enabled', disabled: 'enabled', click: (d, row) => { this.checkCoefficient(row) } },
        //         { text: '停用', type: 'text', show: 'enable_cancel', disabled: 'cancel', click: (d, row) => { this.cancelCoefficient(row) } },
        //         { text: '复制', type: 'text', show: 'enable_copy', click: (d, row) => { this.copyCoefficient(row) } },
        //         { text: '删除', type: 'text', show: 'enable_delete', disabled: 'delete', click: (d, row) => { this.deleteCoefficient(row) } }
        //       ]
        //     }
        //   ]
        // },
        rules: {
          name: [{ required: true, message: '请输入权重系数名称', trigger: 'blur' }]
        },
        loading: null,
        tableLoading: false
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.weightCoefficient || {}
      }
    },
    mounted() {
    },
    activated() {
      this.refreshList()
    },
    methods: {
      refreshList,
      searchByKeyword,
      currentChange,
      getList,
      sizeChange,
      addCoefficient,
      showCoefficient,
      editCoefficient,
      copyCoefficient,
      deleteCoefficient,
      saveNewCoefficient,
      resetForm,
      cellClick,
      startCoefficient,
      cancelCoefficient,
      checkCoefficient
    },
    watch: {}
  }
</script>

<style scoped>
</style>

