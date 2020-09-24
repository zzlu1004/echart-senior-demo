<template>
  <div>
    <el-row>
      <el-col :span="10">
        <div class="relative line-height-normal">
          <span class="absolute">关联案件权重模型:</span>
          <div style="margin-left: 135px;width: 300px">
            <el-select v-model="weightmodelId"
                       filterable
                       size="small"
                       :disabled="isShow"
                       placeholder="请选择权重模型">
              <el-option
                v-for="item in models"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="relative line-height-normal">
          <span class="absolute">结案数统计时间:</span>

          <div style="margin-left: 120px;">
            <el-date-picker
              type="month"
              value-format="yyyy-MM"
              size="small"
              placeholder="选择日期"
              v-model="timeRange[0]"
              :clearable=false
              @change="getTableData"
              class="mr1"></el-date-picker>
            -
            <el-date-picker
            type="month"
            value-format="yyyy-MM"
            size="small"
            placeholder="选择日期"
            v-model="timeRange[1]"
            :clearable=false
            @change="getTableData"
            class="ml1"
          ></el-date-picker>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="my-border-card relative">
      <el-tabs type="border-card" class="mt2 relative">
        <el-tab-pane>
          <el-row v-if="models.length > 0">
            <el-col :span="4" class="bd-dashed-right pr2">
              <el-tree :data="treeData"
                       :props="treeMap"
                       node-key="id"
                       ref="leftModelTree"
                       :default-expand-all=true
                       :check-on-click-node=true
                       :expand-on-click-node=false
                       :highlight-current=true
                       :accordion="accordion"
                       @current-change="treeSelect">
              </el-tree>
            </el-col>
            <el-col :span="20" class="bd-dashed-left pl3 btn-ml3">
              <el-row>
                <el-col :span="12">
                  <el-popover
                    placement="bottom-start"
                    width="226"
                    ref="popover"
                    v-model="showTableHead"
                  >
                    <el-tree :data="headTree"
                             :props="treeMap"
                             node-key="id"
                             ref="modelTree"
                             show-checkbox
                             :default-checked-keys="defaultKeys"
                             :default-expand-all=true
                             :check-on-click-node=true
                             :expand-on-click-node=false
                             :highlight-current=false
                             :accordion="accordion"
                             @check="handleCheckChange">
                    </el-tree>
                  </el-popover>
                  <el-button size="small" v-popover:popover>自定义列表</el-button>
                  <el-button v-show="elements.export" size="small" @click="exportTable">导出</el-button>
                  <!-- <el-upload
                    ref="upload"
                    v-show="elements.import"
                    style="margin-left: 21px;"
                    class="avatar-uploader inline-block"
                    :action="actionPath"
                    :show-file-list=false
                    :data="uploadData"
                    :headers="headers"
                    :disabled="!(!isShow && selectItemId && weightmodelId)"
                    :on-progress="onProgress"
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    :multiple=false>
                    <el-button size="small" :disabled="this.isShow" @click="beforeUpload">导入</el-button>
                  </el-upload> -->
                  <el-button size="small" :disabled="isShow" @click="beforeUpload">导入</el-button>
                  <vue-upload
                    ref="upload"
                    :disabled="!(!isShow && selectItemId && weightmodelId)"
                    v-show="elements.import"
                    :data="uploadData"
                    style="margin-left: 21px;"
                    class="hide"
                    v-model="fileList"
                    :post-action="actionPath"
                    :headers="headers"
                    @input-file="inputFile"
                    @input-filter="inputFilter"
                  >
                  </vue-upload>
                </el-col>
                <el-col :span=12>
                  <div class="f-right">
                    <fd-search @search="searchTable"
                               v-model="keywords"></fd-search>
                  </div>
                </el-col>
              </el-row>
              <fd-dynamic-table
                ref="dynamicTable"
                id="dynamicTable"
                v-bind:weightName="this.name"
                v-bind:heads="tableTree"
                v-bind:data="tableData"
                v-bind:weightId="id"
                v-bind:weightmodelId="weightmodelId"
                v-bind:typeId="selectItemId"
                v-bind:timeRange="timeRange"
                v-bind:isShow="isShow"
                v-bind:selectItem="selectItem"
                v-on:sort="rowClick"
                v-on:dataRefresh="dataRefresh"></fd-dynamic-table>
              <fd-pagination
                :limit="limit"
                :total="total"
                :offset="offset"
                sizes="sizes"
                :pageArr="[10,20,30,40,50]"
                :currentChange="currentChange"
                :sizeChange="sizeChange">
              </fd-pagination>
            </el-col>
          </el-row>
          <div class="el-table__empty-block mt2" v-else>
        <span class="el-table__empty-text">
          当前暂无权重模型数据, 请前往权重模型页面进行配置
        </span>
          </div>
        </el-tab-pane>
      </el-tabs>
      <span class="absolute px2 pointer" @click="exportAllTable">导出全部</span>
    </div>
  </div>
</template>

<script>
  import vueUpload from 'vue-upload-component'
  import FdPagination from 'fd/pagination/pagination'
  import {
    getWeightModel
  } from '@/api/kpi/check/weight'
  import {
    getModelTree,
    treeSelect,
    getHeads,
    rowClick,
    dataRefresh,
    editCoefficientCase,
    getTableData,
    searchTable,
    exportTable,
    exportAllTable,
    handleCheckChange,
    getTableHead,
    uploadSuccess,
    uploadError,
    onProgress,
    beforeUpload,
    inputFile,
    inputFilter,
    caseSizeChange,
    caseCurrentChange
  } from '@/api/kpi/check/coefficient'
  import FdTable from 'fd/table/src/fdTable'
  import FdDynamicTable from './dynamicTable'
  export default {
    name: 'FdCoeCase',
    components: { FdTable, FdDynamicTable, vueUpload, FdPagination },
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      formData: {
        type: Object
      },
      id: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: ''
      },
      save: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        fileList: [],
        limit: 10,
        offset: 0,
        total: 0,
        keywords: '',
        orderField: '',
        orderType: '',
        models: [],
        timeRange: [this.$store.getters.globals.year + '-01', this.$store.getters.globals.year + '-' + this.$store.getters.globals.month],
        startTime: this.$store.getters.globals.year + '-01',
        endTime: this.$store.getters.globals.year + '-' + this.$store.getters.globals.month,
        treeData: [],
        heads: [],
        allData: [],
        tableData: [],
        accordion: false,
        selectItemId: '',
        selectItem: null,
        showTableHead: false,
        treeMap: {
          children: 'children',
          label: 'label'
        },
        headTree: [],
        tableTree: [],
        defaultKeys: [],
        defaultCheckKeys: [],
        weightmodelId: '',
        headers: { 'Authorization': this.$store.getters.token },
        uploadData: {
          pageId: this.selectItemId,
          weightId: this.id,
          weightmodelId: this.weightmodelId
        },
        loading: null
      }
    },
    computed: {
      actionPath() {
        return process.env.BASE_API + window.config.project_url + 'api/weight/import/kpi?Authorization=' +
          this.$store.getters.token
      },
      elements() {
        return this.$store.getters.elements.weightCoefficient || {}
      }
    },
    mounted() {
      if (this.modelId) {
        this.weightmodelId = this.modelId
      }
      this.getWeightModel({
        limit: 0,
        offset: 0,
        keyword: '',
        isUse: '1'
      })
    },
    methods: {
      getWeightModel,
      getModelTree,
      treeSelect,
      editCoefficientCase,
      getHeads,
      rowClick,
      dataRefresh,
      searchTable,
      getTableData,
      exportTable,
      exportAllTable,
      handleCheckChange,
      getTableHead,
      uploadSuccess,
      uploadError,
      onProgress,
      beforeUpload,
      inputFile,
      inputFilter,
      currentChange: caseCurrentChange,
      sizeChange: caseSizeChange
    },
    watch: {
      models(data) {
        if (!this.weightmodelId && data.length > 0) { // 新增的时候默认选中第一个
          this.weightmodelId = data[0].id
        }
      },
      weightmodelId(modelId) {
        this.uploadData.weightmodelId = modelId
        this.getModelTree(modelId)
      },
      selectItemId(selectItemId) {
        this.uploadData.pageId = selectItemId
      },
      id(id) {
        this.uploadData.weightId = id
      },
      formData: {
        handler(curVal, oldVal) {
          if (curVal.weightmodelId) {
            this.weightmodelId = curVal.weightmodelId
          }
        },
        deep: true
      },
      heads(data) {
        this.headTree = this.fd.data.changeToTree(data, 'id', 'parentId')
        this.defaultKeys = this.fd.data.getValuesByKey(data, 'id')
        this.tableTree = []
        this.$nextTick(() => {
          this.tableTree = this.fd.data.changeToTree(data, 'id', 'parentId')
        })
      },
      save(data) {
        this.editCoefficientCase()
      }
    }
  }
</script>

<style lang="scss">
  .my-border-card .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
    background-color: transparent;
    border-right-color: transparent;
  }
  .my-border-card .absolute {
    display: inline-block;
    top: 9px;
    right: 0;
    font-size: 14px;
    color: #1b95e7;
    font-weight: 500;
  }
  .my-border-card .el-tabs--border-card>.el-tabs__header {
    height: 32px;
    background-color: #fcfcfc;
    border-bottom: 1px solid #ebebeb;
    margin: 0;
  }
  .line-height-40{
    line-height: 40px;
  }
  .btn-import{
    width:56px;
    height:32px;
  }
  .file-uploads {
    vertical-align: bottom;
  }
  .file-uploads.file-uploads-html4 {
    display: inline-block;
    position: relative;
    width: 56px;
    height: 32px;
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
