<template>
  <div class="app-container notice">
    <div class="container-inner bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="tab-box tab-box-mar">
        <el-tabs v-model="type" type="card">
          <el-tab-pane label="个人" name="person">
          </el-tab-pane>
          <el-tab-pane label="部门" name="depart">
          </el-tab-pane>
        </el-tabs>
        <div class="pt2">
          <div v-show="type==='person'">
            <div class="clearfix mb2">
              <span class="f-left align-middle">
                  <span v-if="elements.add" class="btn btn-sm btn-primary" @click="addItem">
                    <i class="at icon-plus"/>新增流程
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
                          v-model="val1"></fd-search>
              </span>
            </div>
            <div>
                <fd-table
                :loading="personloading"
                :option="personOpt"
                @cellClick="seeDetail"
                ></fd-table>
            </div>
            <fd-pagination
                :limit="personParams.limit"
                :total="total1"
                :offset="personParams.offset"
                sizes="sizes"
                :pageArr="[10,20,30,40,50]"
                :currentChange="currentChange"
                :sizeChange="sizeChange">
            </fd-pagination>
          </div>
          <div v-show="type==='depart'">
            <div class="clearfix mb2">
              <span class="f-left align-middle">
                  <span v-if="elements.add" class="btn btn-sm btn-primary" @click="addItem">
                    <i class="at icon-plus"/>新增流程
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
                          v-model="val2"></fd-search>
              </span>
            </div>
            <div>
                <fd-table
                :loading="departloading"
                :option="departOpt"
                @cellClick="seeDetail"
                ></fd-table>
            </div>
            <fd-pagination
                :limit="departParams.limit"
                :total="total2"
                :offset="departParams.offset"
                sizes="sizes"
                :pageArr="[10,20,30,40,50]"
                :currentChange="currentChange"
                :sizeChange="sizeChange">
            </fd-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import FdTable from 'fd/table'
  import FdPagination from 'fd/pagination/pagination'
  import { getPersonList, getDepartList, addItem, editItem, deleteItem, searchByKeyword, currentChange,
    sizeChange, seeDetail, copy } from '@/api/kpi/democracy/mzProcess'
  export default {
    name: 'mzProcess',
    components: {
      FdTable, FdPagination
    },
    props: {},
    data() {
      return {
        type: 'person',
        departloading: false,
        personloading: false,
        typesMap: {
          'person': '个人',
          'depart': '部门'
        },
        teamMap: this.fd.tools.mapSelects('k10031'), // 指定团队
        higherLevelMap: this.fd.tools.mapSelects('k10028'), // 直属等级
        pageSize: 10,
        total1: 0,
        total2: 0,
        personParams: {
          limit: 10,
          offset: 0,
          keyword: '',
          type: 'personal',
          paging: true
        },
        departParams: {
          limit: 10,
          offset: 0,
          keyword: '',
          type: 'depart',
          paging: true
        },
        val1: '',
        val2: '',
        personOpt: {
          stripe: true,
          border: true,
          data: [],
          columns: [
            {
              field: 'name',
              title: '流程名称',
              showOverflowTooltip: true,
              formatter: (row, value) => {
                return '<span class="color-blue pointer">' + value + '</span>'
              }
            },
            {
              field: 'remarks',
              title: '详情描述',
              showOverflowTooltip: true
            },
            {
              field: 'nodeDesc',
              title: '流程设置',
              showOverflowTooltip: true
            },
            {
              field: 'active',
              title: '当前状态',
              width: '150px',
              formatter: (row, value) => {
                const statusMap = {
                  'active': '已生效',
                  'inactive': '未生效'
                }
                return statusMap[value]
              }
            },
            {
              field: '',
              title: '操作',
              width: this.fd.tools.getStringWidth('操作3'),
              number: [{ text: '编辑', type: 'text', show: 'hasEdit', disabled: 'isedit', click: (d, row) => { this.editItem(row) } },
                { text: '复制', type: 'text', show: 'hasCopy', click: (d, row) => { this.copy(row) } },
                { text: '删除', type: 'text', show: 'hasDelete', disabled: 'isdelete', click: (d, row) => { this.deleteItem(row) } }
              ]
            }
          ]
        },
        departOpt: {
          stripe: true,
          border: true,
          data: [],
          columns: [
            {
              field: 'name',
              title: '流程名称',
              showOverflowTooltip: true,
              formatter: (row, value) => {
                return '<span class="color-blue pointer">' + value + '</span>'
              }
            },
            {
              field: 'remarks',
              title: '详情描述',
              showOverflowTooltip: true
            },
            {
              field: 'nodeDesc',
              title: '流程设置',
              showOverflowTooltip: true
            },
            {
              field: 'active',
              title: '当前状态',
              width: '150px',
              formatter: (row, value) => {
                const statusMap = {
                  'active': '已生效',
                  'inactive': '未生效'
                }
                return statusMap[value]
              }
            },
            {
              field: '',
              title: '操作',
              width: this.fd.tools.getStringWidth('操作3'),
              number: [{ text: '编辑', type: 'text', show: 'hasEdit', disabled: 'isedit', click: (d, row) => { this.editItem(row) } },
                { text: '复制', type: 'text', show: 'hasCopy', click: (d, row) => { this.copy(row) } },
                { text: '删除', type: 'text', show: 'hasDelete', disabled: 'isdelete', click: (d, row) => { this.deleteItem(row) } }
              ]
            }
          ]
        }
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.mzProcess || {}
      }
    },
    mounted() {
    },
    activated() {
      this.getPersonList()
      this.getDepartList()
    },
    methods: {
      getPersonList, getDepartList, addItem, editItem, deleteItem, searchByKeyword, currentChange,
      sizeChange, seeDetail, copy
    },
    watch: {
    }
  }
</script>

<style lang="scss">
</style>
