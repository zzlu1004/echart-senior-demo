<template>
  <div class="app-container">
    <div class="container-inner has-fixed-bottom  bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="t-center mb2">
        <span class="color-title h20 bold">{{pageName}} </span>
        <span>（指标数量：{{total}}）</span>
      </div>
      <div class="clearfix">
        <div class="f-left">
          <span v-show="elements.add && edit" class="btn btn-sm btn-primary mr3" @click="addModelDetail('预制指标')"><i class="at icon-plus"/>新增预制指标</span>
          <span v-show="elements.sort && edit" class="btn btn-sm btn-primary" @click="sortList(list)">排序</span>
        </div>
        <div class="f-right">
          <el-button class="btn-ml" size="small" @click="downloadTable">导出</el-button>
        </div>
        <div class="f-right">
          <fd-search @search="searchByKeyword"
                    v-model="keywords"></fd-search>
        </div>
      </div>
      <div>
        <fd-table
          className="mt2"
          emptyText="当前暂无指标，点击左上角添加预制指标"
          :data="list">
          <el-table-column
            type="index"
            label="序号"
            :width="fd.tools.getStringWidth('序号')">
          </el-table-column>
          <el-table-column
            prop="name"
            show-overflow-tooltip
            label="预制指标名称">
            <template slot-scope="scope">
              <span class="pointer color-link-hover" @click="showModelTargetDetail(scope.row, '预制指标')">{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="displayName"
            show-overflow-tooltip
            label="页面显示名称">
          </el-table-column>
          <el-table-column
            prop="content"
            show-overflow-tooltip
            label="指标说明">
          </el-table-column>
          <el-table-column
            prop="typeId"
            show-overflow-tooltip
            label="指标类型"
            width="150px">
            <template slot-scope="scope">
              <span>{{typeMap[scope.row.typeId]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            v-show="elements.edit && edit"
            :width="fd.tools.getStringWidth('操作2')"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" v-show="edit && elements.edit" @click="editModelDetail(scope.row, '预制指标')">编辑</el-button>
              <el-button type="text" v-show="edit && elements.delete && scope.row.name !== '未匹配指标的案件'" @click="deleteModelList(scope.row, '删除预制指标')">删除</el-button>
            </template>
          </el-table-column>
        </fd-table>
      </div>
      <div class="fixed-bottom">
        <div class="fixed-bottom-item" @click="goBack">
          <div class="fixed-bottom-item-text">返回</div>
        </div>
      </div>
    </div>
    <el-dialog
      title="指标排序"
      :visible.sync="sortDialog"
      :close-on-click-modal=false
      width="575px"
      class="no-padding"
    >
      <div v-if="sortData.length > 0">
        <div class="h16 color-forbid mb1"><span class="h14">选中下列指标可上下拖拽进行排序</span></div>
        <div class="auto" style="max-height: 350px">
          <fd-draggable
            v-on:dragend="dragend"
            label="name"
            group="sortDepart"
            :list="sortData"></fd-draggable>
        </div>
        <div class="t-right py2">
          <div class="btn btn-default color-text mr4" @click="sortDialog = false">取消</div>
          <div class="btn btn-primary"  @click = "saveSort">确定</div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="typeDialog"
      :close-on-click-modal=false
      width="1000px"
      class="no-padding"
    >
      <div>
        <div :style="{'max-height': $store.getters.globals.height - 460 + 'px', overflow: 'auto'}">
          <el-form :rules="rules"
                   :model="formData"
                   label-position="right"
                   labelWidth="115px"
                   ref="detailForm">
            <el-form-item label="指标类型" prop="typeId">
              <el-row>
                <el-col :span="12">
                  <el-select v-model="formData.typeId"
                             @change="changeType"
                             filterable
                             :disabled="(isShow || formData.name === '未匹配指标的案件')"
                             placeholder="请选择指标类型">
                    <el-option
                      v-for="item in types"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="预制指标名称" prop="kpiId">
              <el-row>
                <el-col :span="12">
                  <el-select v-model="formData.kpiId"
                             filterable
                             :disabled="(isShow || formData.name === '未匹配指标的案件')"
                             @change="kpiChange"
                             placeholder="请选择预制指标名称">
                    <el-option
                      v-for="item in targetSelects"
                      :key="item.id"
                      v-if="canSelectTargets(item.id)"
                      :label="(item.name +(formData.typeId === 'k10021-01'?'':('('+(item.indexModel === '2'?'普通案件':'系列案件')+')')))"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="页面显示名称" prop="displayName">
              <el-input v-model="formData.displayName" :readonly="isShow" placeholder="请输入页面显示名称,不多于50个字"></el-input>
            </el-form-item>
            <el-form-item label="指标说明" prop="content">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 20 }"
                :readonly="isShow"
                v-model="formData.content"
                placeholder="请输入指标说明,不多于1000个字"></el-input>
            </el-form-item>
            <el-form-item label="指标规则" prop="formula">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 20 }"
                readonly
                v-model="formData.formula"
                placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="系数规则" prop="expression">
              <el-input
                :readonly="isShow"
                v-model="formData.expression"
                placeholder="请输入系数规则"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="t-right py2">
          <div v-show="!isShow" class="btn btn-default color-text mr4" @click="typeDialog = false">取消</div>
          <div v-show="isShow" class="btn btn-default color-text mr4" @click="typeDialog = false">关闭</div>
          <div v-show="!isShow" class="btn btn-primary" @click = "saveDetailPage">确定</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    goBack, resetForm
  } from '@/api/common'
  import {
    pageMap,
    addModelDetail,
    editModelDetail,
    showModelTargetDetail,
    deleteModelList,
    sortList,
    saveSort,
    getAllTarget,
    refreshDetailList,
    getDetailList,
    saveDetailPage,
    dragend,
    kpiChange,
    getSelfTarget,
    canSelectTargets,
    changeType,
    searchByKeyword,
    downloadTable
  } from '@/api/kpi/check/weight_special'
  import FdDraggable from 'fd/drag/draggable'
  import FdTable from 'fd/table/src/fdTable'
  export default {
    name: '',
    components: { FdDraggable, FdTable },
    props: {},
    data() {
      return {
        pageMap,
        total: 0,
        list: [],
        oldSorts: [],
        sortData: [],
        newSorts: [],
        sortDialog: false,
        typeMap: this.fd.tools.mapSelects('k10021'), // 指标类型
        typeDialog: false,
        hasXLA: false,
        pageName: '特殊因素',
        formData: {
          id: '',
          kpiId: '',
          typeId: '',
          name: '',
          displayName: '',
          content: '',
          expression: '权重系数',
          formula: ''
        },
        keywords: '',
        rules: {
          kpiId: [{ required: true, message: '请选择预制指标名称', trigger: 'change' },
            { max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          displayName: [{ required: true, message: '请输入页面显示名称', trigger: 'blur' },
            { max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          typeId: [{ required: true, message: '请选择指标类型', trigger: 'change' }],
          expression: [{ required: true, message: '请选择系数规则', trigger: 'change' }],
          formula: [{ required: true, message: '请输入指标规则', trigger: 'blur' }],
          content: [{ max: 1000, message: '长度不超过1000个字符', trigger: 'blur' }]
        },
        selfs: [],
        // 当前编辑的指标选中指标信息
        editKpiID: '',
        targetSelects: [],
        isShow: false,
        targets: [],
        kpiMap: {},
        selfMap: {},
        title: '',
        ids: []
      }
    },
    computed: {
      modelId() {
        return this.$route.query.id
      },
      edit() {
        if (this.$route.query.edit === 'false') {
          return false
        } else if (this.$route.query.edit === 'true') {
          return true
        }
      },
      pageId() {
        return this.$route.query.pageId
      },
      // 指标类型
      types() {
        return this.$store.getters.selects['k10021']
      },
      elements() {
        return this.$store.getters.elements.weightModel || {}
      }
    },
    mounted() {
      this.getAllTarget()
      this.getSelfTarget()
      this.getDetailList()
    },
    methods: {
      goBack,
      resetForm,
      addModelDetail,
      editModelDetail,
      showModelTargetDetail,
      deleteModelList,
      sortList,
      saveSort,
      refreshDetailList,
      getDetailList,
      dragend,
      saveDetailPage,
      getAllTarget,
      kpiChange,
      canSelectTargets,
      getSelfTarget,
      changeType,
      searchByKeyword,
      downloadTable
    },
    watch: {
      targets(data) {
        this.kpiMap = this.fd.data.arrayToObj(data, 'id')
      },
      selfs(data) {
        this.selfMap = this.fd.data.arrayToObj(data, 'id')
      },
      list(data) {
        this.ids = this.fd.data.getValuesByKey(data, 'kpiId')
      }
    }
  }
</script>

<style scoped>
</style>
