<template>
  <div class="app-container">
    <div class="container-inner bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="tab-box mt2">
        <el-tabs v-model="indexModels" type="card"  @tab-click="changeIndexModels">
          <el-tab-pane label="普通标记" name="normal">
            <div v-show="indexModels ==='normal'">
              <div>
                <span v-show="elements.add" class="btn btn-primary btn-sm mr3" @click="addSelfTarget()"><i class="at icon-plus"/>新增标记指标</span>
                <div class="f-right">
                  <fd-search @search="searchByKeyword"
                             v-model="normal.keywords"></fd-search>
                </div>
              </div>
              <div class="mt2">
                <fd-table :option="targetOption" :loading="tableLoading1"></fd-table>
              </div>
              <fd-pagination
                :limit="normal.limit"
                :offset="normal.offset"
                :currentChange="currentChange"
                :sizeChange="sizeChange"
                :sizes=true
                :total= "normal.total"
              ></fd-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="属性标记" name="property">
            <div v-show="indexModels ==='property'">
              <div>
                <div class="f-right mb2">
                  <fd-search @search="searchByKeyword"
                             v-model="property.keywords"></fd-search>
                </div>
              </div>
              <div>
                <fd-table :option="targetPropertyOption" :loading="tableLoading2"></fd-table>
              </div>
              <fd-pagination
                :limit="property.limit"
                :offset="property.offset"
                :currentChange="currentChange"
                :sizeChange="sizeChange"
                :sizes=true
                :total= "property.total"
              ></fd-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="特殊标记" name="special">
            <div v-show="indexModels ==='special'">
              <div>
                <el-button size="small" icon="el-icon-plus" type="primary" @click="addSelfTarget('4')">新增</el-button>
                <div class="f-right mb2">
                  <fd-search @search="searchByKeyword"
                             v-model="specialProperty.keywords"></fd-search>
                </div>
              </div>
              <div>
                <fd-table :option="targetSpecialPropertyOption" :loading="tableLoading3"></fd-table>
              </div>
              <fd-pagination
                :limit="specialProperty.limit"
                :offset="specialProperty.offset"
                :currentChange="currentChange"
                :sizeChange="sizeChange"
                :sizes=true
                :total= "specialProperty.total"
              ></fd-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 隐藏按钮，用于点击导入，触发该按钮的click事件importSelfTarget -->
    <div class="btn btn-default fd-btn-group" v-show=false>
      <vue-upload
        class="pointer"
        ref="upload"
        v-model="fileList"
        :post-action="actionPath"
        :headers="headers"
        @input-file="inputFile"
        @input-filter="inputFilter"
      >
        <span class="inline-block blue-btn px1">添加附件</span>
      </vue-upload>
    </div>
    <fd-dialog
      title="指标排序"
      :syncVisible="sortDialog"
      @beforeClose="sortDialog = false"
    >
      <div slot="fd-body">
        <div v-if="sortData.length > 0">
          <div class="h16 color-forbid mb1"><span class="h14">选中下列指标可上下拖拽进行排序</span></div>
          <div class="auto" style="max-height: 350px">
            <fd-draggable
              v-on:dragend="dragend"
              label="characterName"
              group="sortDepart"
              :list="sortData"></fd-draggable>
          </div>
        </div>
      </div>
      <div slot="fd-footer">
        <el-button size="small" @click="sortDialog = false">取消</el-button>
        <el-button size="small" type="primary" @click="saveSort">确定</el-button>
      </div>
    </fd-dialog>
    <fd-dialog
      :title="title"
      :syncVisible="typeDialog"
      @beforeClose="typeDialog = false"
    >
      <div slot="fd-body">
        <el-row>
          <el-col :span="20">
            <el-form :rules="rules"
                     :model="formData"
                     label-position="right"
                     labelWidth="35%"
                     ref="detailForm">
              <el-form-item :label="indexModels === 'normal' ? '指标类型' : '标记对象'" prop="typeId"  v-show="indexModels !=='property'">
                <el-row>
                  <el-col>
                    <el-select v-model="formData.indexModel"
                               filterable
                               placeholder="请选择指标类型">
                      <el-option
                        v-for="item in indexModel"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="标记指标名称" prop="characterName">
                <el-input v-model="formData.characterName" placeholder="请输入标记指标名称,不多于50个字"></el-input>
              </el-form-item>
              <el-form-item label="页面显示名称" prop="name">
                <el-input v-model="formData.name" placeholder="请输入页面显示名称,不多于50个字"></el-input>
              </el-form-item>
              <el-form-item label="指标说明" prop="content">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 20 }"
                  v-model="formData.content"
                  placeholder="请输入指标说明,不多于1000个字"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
      </div>
      <div slot="fd-footer">
        <el-button size="small" @click="typeDialog = false">取消</el-button>
        <el-button size="small" type="primary" @click="saveSelfTarget">确定</el-button>
      </div>
    </fd-dialog>
    <fd-dialog></fd-dialog>
  </div>
</template>

<script>
  import vueUpload from 'vue-upload-component'
  import FdPagination from 'fd/pagination/pagination'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  import {
    changeIndexModels,
    getPropertyTarget,
    getSpecialPropertyTarget,
    currentChange,
    sizeChange,
    getAllTarget,
    saveSelfTarget,
    addSelfTarget,
    editSelfTarget,
    deleteSelfTarget,
    importSelfTarget,
    exportSelfTarget,
    uploadSuccess,
    uploadError,
    onProgress,
    sortList,
    saveSort,
    dragend,
    inputFile,
    inputFilter,
    searchByKeyword
  } from '@/api/kpi/check/selfTarget'
  import FdDraggable from 'fd/drag/draggable'
  import FdTable from 'fd/table'
  export default {
    name: '',
    components: { FdDraggable, FdTable, vueUpload, FdPagination, fdDialog },
    props: {},
    data() {
      return {
        indexModels: 'normal',
        normal: {
          limit: 10,
          offset: 0,
          total: 0,
          keywords: ''
        },
        property: {
          limit: 10,
          offset: 0,
          total: 0,
          keywords: ''
        },
        specialProperty: {
          limit: 10,
          offset: 0,
          total: 0,
          keywords: ''
        },
        title: '',
        fileList: [],
        oldSorts: [],
        sortData: [],
        newSorts: [],
        loading: null,
        tableLoading1: false,
        tableLoading2: false,
        tableLoading3: false,
        sortDialog: false,
        headers: { 'Authorization': this.$store.getters.token },
        actionPath: '',
        typeMap: {
          '1': '系列案件',
          '2': '普通案件'
        },
        indexModel: [{
          id: '2',
          name: '普通案件'
        }, {
          id: '1',
          name: '系列案件'
        }],
        statusMap: {
          active: '生效中',
          inactive: '未生效'
        },
        typeDialog: false,
        targetOption: {
          stripe: true,
          border: true,
          data: [],
          columns: [
            {
              field: 'index',
              title: '序号',
              width: '60px'
            },
            {
              field: 'characterName',
              title: '标记指标名称',
              showOverflowTooltip: true
            },
            {
              field: 'name',
              title: '页面显示名称',
              showOverflowTooltip: true
            },
            {
              field: 'content',
              title: '指标说明',
              showOverflowTooltip: true
            },
            {
              field: 'indexModel',
              title: '指标类型 ',
              formatter: (row, value) => {
                return this.typeMap[row.indexModel]
              }
            },
            {
              field: 'status',
              title: '指标状态 ',
              formatter: (row, value) => {
                return this.statusMap[row.status]
              }
            },
            {
              field: '',
              title: '操作',
              width: this.fd.tools.getStringWidth('操作3'),
              number: [{ text: '导入', type: 'text', show: 'import', disabled: 'forbid', click: (d, row) => { this.importSelfTarget(row) } },
                { text: '导出', type: 'text', show: 'export', click: (d, row) => { this.exportSelfTarget(row) } },
                { text: '编辑', type: 'text', show: 'edit', disabled: 'forbid', click: (d, row) => { this.editSelfTarget(row) } },
                { text: '删除', type: 'text', show: 'delete', disabled: 'forbid', click: (d, row) => { this.deleteSelfTarget(row) } }
              ]
            }
          ]
        },
        targetPropertyOption: {
          stripe: true,
          border: true,
          data: [],
          columns: [
            {
              field: 'sort',
              title: '序号',
              width: '60px'
            },
            {
              field: 'characterName',
              title: '标记指标名称',
              showOverflowTooltip: true
            },
            {
              field: 'name',
              title: '页面显示名称',
              showOverflowTooltip: true
            },

            {
              field: 'content',
              title: '指标说明',
              showOverflowTooltip: true
            },
            {
              field: 'status',
              title: '指标状态 ',
              formatter: (row, value) => {
                return this.statusMap[row.status]
              }
            },
            {
              field: '',
              title: '操作',
              width: this.fd.tools.getStringWidth('操作3'),
              number: [{ text: '导入', type: 'text', show: 'import', disabled: 'forbid', click: (d, row) => { this.importSelfTarget(row) } },
                { text: '导出', type: 'text', show: 'export', click: (d, row) => { this.exportSelfTarget(row) } },
                { text: '编辑', type: 'text', show: 'edit', disabled: 'forbid', click: (d, row) => { this.editSelfTarget(row) } }
              ]
            }
          ]
        },
        targetSpecialPropertyOption: {
          stripe: true,
          border: true,
          data: [],
          columns: [
            {
              field: 'index',
              title: '序号',
              width: '60px'
            },
            {
              field: 'characterName',
              title: '标记指标名称',
              showOverflowTooltip: true
            },
            {
              field: 'name',
              title: '页面显示名称',
              showOverflowTooltip: true
            },

            {
              field: 'content',
              title: '指标说明',
              showOverflowTooltip: true
            },
            {
              field: 'createUser',
              title: '标记对象',
              showOverflowTooltip: true,
              formatter: (row, value) => {
                return { 4: '人员' }[row.indexModel]
              }
            },
            {
              field: 'status',
              title: '指标状态 ',
              formatter: (row, value) => {
                return this.statusMap[row.status]
              }
            },
            {
              field: '',
              title: '操作',
              width: this.fd.tools.getStringWidth('操作3'),
              number: [{ text: '导入', type: 'text', show: 'import', disabled: 'forbid', click: (d, row) => { this.importSelfTarget(row) } },
                { text: '导出', type: 'text', show: 'export', click: (d, row) => { this.exportSelfTarget(row) } },
                { text: '编辑', type: 'text', show: 'edit', disabled: 'forbid', click: (d, row) => { this.editSelfTarget(row) } },
                { text: '删除', type: 'text', show: 'delete', disabled: 'forbid', click: (d, row) => { this.deleteSelfTarget(row) } }
              ]
            }
          ]
        },
        formData: {
          characterName: '',
          name: '',
          content: '',
          indexModel: '2'
        },
        rules: {
          indexModel: [{ required: true, message: '请选择指标类型', trigger: 'change' }],
          characterName: [{ required: true, message: '请输入标记指标名称', trigger: 'blur' },
            { max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          name: [{ required: true, message: '请输入页面显示名称', trigger: 'blur' },
            { max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          content: [{ max: 1000, message: '长度不超过1000个字符', trigger: 'blur' }]
        }
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.selfTarget || {}
      }
    },
    mounted() {
      this.getAllTarget()
    },
    methods: {
      changeIndexModels,
      getPropertyTarget,
      getSpecialPropertyTarget,
      currentChange,
      sizeChange,
      getAllTarget,
      saveSelfTarget,
      addSelfTarget,
      editSelfTarget,
      deleteSelfTarget,
      importSelfTarget,
      exportSelfTarget,
      uploadError,
      uploadSuccess,
      onProgress,
      sortList,
      saveSort,
      dragend,
      inputFile,
      inputFilter,
      searchByKeyword
    },
    watch: {}
  }
</script>

<style lang="scss">
  .file-uploads.file-uploads-html4 {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 40px;
  }
  .file-uploads.file-uploads-html4 input, .file-uploads.file-uploads-html5 label {
    /* background fix ie  click */
    background: #fff;
    opacity: 0;
    font-size: 20em;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>
