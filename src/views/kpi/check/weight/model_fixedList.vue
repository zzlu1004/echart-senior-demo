<template>
  <div class="app-container">
    <div class="container-inner has-fixed-bottom bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <!--<div class="t-center mb2">-->
        <!--<span class="color-title h20 bold">{{pageName}} </span>-->
        <!--<span>（指标数量：{{total}}）</span>-->
      <!--</div>-->
      <div class="clearfix">
        <div class="f-left">
          <span v-show="edit && elements.add" class="btn btn-sm btn-primary mr3" @click="addModelDetail()"><i class="at icon-plus"/>新增指标</span>
          <span v-show="edit && elements.sort" class="btn btn-sm btn-primary" @click="sortList(list)">排序</span>
        </div>
        <div class="f-right">
          <div style="display: inline-block;" v-if="edit">
            <el-upload
              class="upload-demo"
              name="file"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .xls"
              :action="`api${actionUrl}api/weight/model/page/all-kpi/import?pageId=${$route.query.pageId}&weightmodelId=${$route.query.id}`"
              multiple
              :headers="{
                  Authorization: $store.getters.token
              }"
              :on-success="handerSuccess"
              :show-file-list="false">
              <el-button class="btn-ml" size="small">导入</el-button>
            </el-upload>
          </div>
          <el-button class="btn-ml" size="small" v-else :disabled="true">导入</el-button>
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
          emptyText="当前暂无指标，点击左上角添加指标"
          :loading="loading"
          :data="list">
          <el-table-column
            type="index"
            label="序号"
            :width="fd.tools.getStringWidth('序号')">
          </el-table-column>
          <el-table-column
            prop="displayName"
            show-overflow-tooltip
            label="指标名称">
            <template slot-scope="scope">
              <span class="pointer color-link-hover" @click="showModelTargetDetail(scope.row)">{{scope.row.displayName}}</span>
            </template>
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
            prop="formulaName"
            show-overflow-tooltip
            label="指标规则">
          </el-table-column>
          <el-table-column
            prop="expression"
            show-overflow-tooltip
            label="系数规则">
          </el-table-column>
          <el-table-column
            prop=""
            :width="fd.tools.getStringWidth('操作2')"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" v-show="edit && elements.edit" @click="editModelDetail(scope.row)">编辑</el-button>
              <el-button type="text" v-show="edit && elements.delete && scope.row.kpiId !== 'ts001001'" @click="deleteModelList(scope.row)">删除</el-button>
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
              label="displayName"
              group="sortDepart"
              :list="sortData"></fd-draggable>
          </div>
        </div>
      </div>
      <div slot="fd-footer">
        <el-button size="small" @click="sortDialog = false">取消</el-button>
        <el-button size="small" type="primary" @click = "saveSort">确定</el-button>
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
              <el-form-item label="指标类型" prop="typeId">
                <el-select v-model="formData.typeId"
                          filterable
                          @change="typeChange"
                          :disabled="isShow"
                          placeholder="请选择指标类型">
                  <el-option
                    v-for="item in types"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- 指标类型为规则判断的时候 -->
              <el-form-item v-if="formData.typeId === 'k10021-01'" label="指标名称" prop="displayName">
                <el-input v-model="formData.displayName" :readonly="isShow" placeholder="请输入指标名称,不多于50个字"></el-input>
              </el-form-item>
              <!-- 指标类型为预制指标的时候 -->
              <el-form-item v-if="formData.typeId === 'k10021-03'" label="指标名称" prop="kpiId">
                <el-select v-model="formData.kpiId"
                          filterable
                          :disabled="(isShow || formData.name === '未匹配指标的案件')"
                          @change="kpiChange"
                          placeholder="请选择预制指标名称">
                  <el-option
                    v-for="item in targets"
                    :key="item.id"
                    v-if="canSelectReadys(item.id)"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- 指标类型为标记指标的时候 -->
              <el-form-item label="指标名称" prop="kpiId"  v-if="formData.typeId === 'k10021-02'">
                <el-select v-model="formData.kpiId"
                          filterable
                          :disabled="isShow"
                          @change="selfKpiChange"
                          placeholder="请选择标记指标">
                  <el-option
                    v-for="item in selfs"
                    v-if="canSelectTargets(item.id)"
                    :key="item.id"
                    :label="item.name + '('+(item.indexModel === '2'?'普通案件':'系列案件')+')'"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="formData.typeId === 'k10021-03'" label="页面显示名称" prop="displayName">
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
              <el-form-item label="指标规则" prop="formula" v-if="formData.typeId !== 'k10021-02'">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 20 }"
                :readonly="isShow"
                  v-model="formData.formula"></el-input>
              </el-form-item>
              <el-form-item label="系数规则" prop="expression">
                <el-input
                :readonly="isShow"
                  v-model="formData.expression"
                  placeholder="请输入系数规则"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
      </div>
      <div slot="fd-footer">
        <el-button v-show="!isShow" size="small" @click="typeDialog = false">取消</el-button>
        <el-button v-show="!isShow" size="small" type="primary" @click="saveDetailPage">确定</el-button>
        <el-button v-show="isShow" size="small"  @click="typeDialog = false">关闭</el-button>
      </div>
    </fd-dialog>
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
    refreshDetailList,
    dragend,
    saveDetailPage,
    getFixedSelfTarget,
    selfKpiChange,
    typeChange,
    canSelectReadys,
    downloadTable,
    searchByKeyword
  } from '@/api/kpi/check/weight'
  import {
    canSelectTargets,
    kpiChange,
    getDetailList,
    getAllTarget
  } from '@/api/kpi/check/weight_special'
  import FdDraggable from 'fd/drag/draggable'
  import FdTable from 'fd/table/src/fdTable'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  export default {
    name: '',
    components: { FdDraggable, FdTable, fdDialog },
    props: {},
    data() {
      return {
        actionUrl: window.config.project_url,
        pageMap,
        keywords: '',
        loading: false,
        targets: [],
        total: 0,
        list: [],
        pageName: '固定因素',
        pageName1: '固定因素',
        oldSorts: [],
        sortData: [],
        newSorts: [],
        sortDialog: false,
        hasXLA: false,
        typeMap: this.fd.tools.mapSelects('k10021'), // 指标类型
        typeDialog: false,
        formData: {
          id: '',
          typeId: '',
          kpiId: '',
          name: '',
          displayName: '',
          content: '',
          expression: '权重系数',
          formula: ''
        },
        rules: {
          displayName: [{ required: true, message: '请输入指标名称', trigger: 'blur' },
            { max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          kpiId: [{ required: true, message: '请选择标记指标', trigger: 'change' }],
          typeId: [{ required: true, message: '请选择指标类型', trigger: 'change' }],
          expression: [{ required: true, message: '请选择系数规则', trigger: 'change' }],
          formula: [{ required: true, message: '请输入指标规则', trigger: 'blur' }],
          content: [{ max: 1000, message: '长度不超过1000个字符', trigger: 'blur' }]
        },
        isShow: false,
        title: '',
        selfs: [],
        editKpiId: '',
        selfMap: {},
        kpiMap: {},
        ids: []
      }
    },
    computed: {
      modelId() {
        return this.$route.query.id
      },
      pageId() {
        return this.$route.query.pageId
      },
      // 权重系数名称
      mypageName() {
        return this.$route.query.mypageName
      },
      // 指标类型
      types() {
        return this.$store.getters.selects['k10021']
      },
      edit() {
        if (this.$route.query.edit === 'false') {
          return false
        } else if (this.$route.query.edit === 'true') {
          return true
        }
      },
      elements() {
        return this.$store.getters.elements.weightModel || {}
      }
    },
    mounted() {
      this.getDetailList()
      this.getFixedSelfTarget()
    },
    methods: {
      goBack,
      addModelDetail,
      editModelDetail,
      showModelTargetDetail,
      deleteModelList,
      sortList,
      saveSort,
      refreshDetailList,
      getDetailList,
      dragend,
      resetForm,
      saveDetailPage,
      getFixedSelfTarget,
      selfKpiChange,
      typeChange,
      canSelectTargets,
      canSelectReadys,
      downloadTable,
      searchByKeyword,
      kpiChange,
      getAllTarget,
      handleUpload(params) {
        const data = new FormData()
        data.append(params.filename, params.file)
        this.fd.req({
          url: `/api/weight/model/page/all-kpi/import?pageId=${this.$route.query.pageId}&weightmodelId=${this.$route.query.id}`,
          method: 'post',
          data: {
            file: data
          }
        })
      },
      handerSuccess() {
        this.$message({
          type: 'success',
          message: '“指标规则”列导入时默认为“自定义规则”，若不符合实际情况，请手动修改'
        })
        this.getDetailList()
      }
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
