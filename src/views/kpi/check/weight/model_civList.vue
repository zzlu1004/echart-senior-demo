<template>
  <div class="app-container">
    <div class="container-inner has-fixed-bottom  bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="t-center mb2">
        <span class="color-title h20 bold">{{pageName}} </span>
        <span>（指标数量：{{total}}）</span>
      </div>
      <div>
        <div class="h16 bold color-title">表头配置</div>
        <div class="pt2 pb1">
          <el-radio v-model="pageData.headId"
                    v-for="item of heads"
                    :key="item.id"
                    :label="item.id">{{item.name}}</el-radio>
        </div>
        <div class="py2" v-if="headMap[pageData.headId]">
          <span v-for="(item, index) of headMap[pageData.headId].headKpiList"
                :key="item.field" :class="'bd-top bd-right bd-bottom py1 px3 '+(index === 0 ? 'bd-left': '')">{{item.headName}}</span>
        </div>
      </div>
      <div class="pt2">
        <div class="h16 bold color-title">案件分类</div>
        <div class="py2">
          <el-radio v-model="pageData.customType"
                    v-for="item of caseType"
                    :key="item.id"
                    :label="item.id">{{item.name}}</el-radio>
        </div>
        <div v-show="pageData.customType === 'summary'">
          <el-row>
            <el-col :span="12" class="relative">
              <div class="absolute py1">系数可配置层级: </div>
              <div style="margin-left: 115px;width: 300px">
                <el-select v-model="pageData.levelId"
                           size="small"
                           placeholder="请选择适用案件类型">
                  <el-option
                    v-for="item in caseLevel"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="f-right">
                <fd-search v-model="summaryName"></fd-search>
              </div>
            </el-col>
          </el-row>
          <div class="mt2">
            <fd-summary v-bind:summary="summaryData" :filter="summaryName"></fd-summary>
          </div>
          <el-row class="mt2">
            <el-col :span="12" class="relative">
              <div class="absolute py1">其他层级的系数默认相同: </div>
              <div style="margin-left: 175px;width: 300px">
                <el-select v-model="pageData.otherDefault"
                           size="small"
                           placeholder="请选择其他层级的默认系数">
                  <el-option
                    v-for="item in others"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </div>
        <div v-show="pageData.customType === 'userDefined'">
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
              v-if="pageData.customType === 'userDefined' && flag"
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
                  <el-button v-show="edit && elements.edit" type="text" @click="editModelDetail(scope.row)">编辑</el-button>
                  <el-button v-show="edit && elements.delete" type="text" @click="deleteModelList(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </fd-table>
          </div>
        </div>
        <div class="fixed-bottom">
          <div class="fixed-bottom-item" @click="goBack">
            <div class="fixed-bottom-item-text">返回</div>
          </div>
          <div class="fixed-bottom-item" v-show="edit && elements.edit" @click="saveModel">
            <div class="fixed-bottom-item-text">保存</div>
          </div>
        </div>
      </div>
    </div>
    <!--自定义-->
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
        <el-button  size="small" @click="sortDialog = false">取消</el-button>
        <el-button  size="small" type="primary" @click = "saveSort">确定</el-button>
      </div>
    </fd-dialog>
    <!--编辑自定义指标-->
   <!-- <el-dialog
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
                   labelWidth="85px"
                   ref="detailForm">
            <el-form-item label="指标类型" prop="typeId">
              <el-row>
                <el-col :span="12">
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
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item v-if="formData.typeId === 'k10021-01'" label="指标名称" prop="displayName">
              <el-row>
                <el-col :span="12">
                  <el-input v-model="formData.displayName" :readonly="isShow" placeholder="请输入指标名称,不多于50个字"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="指标名称" prop="kpiId" v-else>
              <el-row>
                <el-col :span="12">
                  <el-select v-model="formData.kpiId"
                             filterable
                             :disabled="isShow"
                             @change="selfKpiChange"
                             placeholder="请选择标记指标">
                    <el-option
                      v-for="item in selfs"
                      v-if="canSelectTargets(item.id)"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="指标说明" prop="content">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 20 }"
                :readonly="isShow"
                v-model="formData.content"
                placeholder="请输入指标说明,不多于1000个字"></el-input>
            </el-form-item>
            <el-form-item label="指标规则" prop="ruleId" v-if="formData.typeId !== 'k10021-02'">
              <el-radio v-model="formData.ruleId"
                        v-for="item of ruleType"
                        :key="item.id"
                        :label="item.id">{{item.name}}</el-radio>
            </el-form-item>
            <el-form-item label="" prop="summaries" v-show="formData.typeId !== 'k10021-02' && formData.ruleId == 'k10025-01'">
              <fd-summary v-bind:summary="summaryData"
                          v-on:getSelect="saveType"
                          v-bind:data="formData.summaries"
                          v-bind:getData="getData"
                          :select="!isShow"></fd-summary>
            </el-form-item>
            <el-form-item label="" prop="formula" v-show="formData.typeId !== 'k10021-02' && formData.ruleId == 'k10025-03'">
              <el-input v-model="formData.formula" type="textarea" :autosize="{ minRows: 2, maxRows: 20 }" :readonly="isShow" placeholder="请输入指标规则"></el-input>
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
          <div v-show="!isShow" class="btn btn-primary" @click = "getData = !getData">确定</div>
        </div>
      </div>
    </el-dialog>-->
    <fd-dialog
      :title="title"
      :syncVisible="typeDialog"
      @beforeClose="typeDialog = false"
    >
      <div slot="fd-body">
        <el-form :rules="rules"
                     :model="formData"
                     label-position="right"
                     label-width="100px"
                     ref="detailForm">
              <el-form-item label="指标类型" prop="typeId">
                <el-row>
                  <el-col>
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
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item v-if="formData.typeId === 'k10021-01'" label="指标名称" prop="displayName">
                <el-row>
                  <el-col >
                    <el-input v-model="formData.displayName" :readonly="isShow" placeholder="请输入指标名称,不多于50个字"></el-input>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="指标名称" prop="kpiId" v-else>
                <el-row>
                  <el-col :span="12">
                    <el-select v-model="formData.kpiId"
                               filterable
                               :disabled="isShow"
                               @change="selfKpiChange"
                               placeholder="请选择标记指标">
                      <el-option
                        v-for="item in selfs"
                        v-if="canSelectTargets(item.id)"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="指标说明" prop="content">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 20 }"
                  :readonly="isShow"
                  v-model="formData.content"
                  placeholder="请输入指标说明,不多于1000个字"></el-input>
              </el-form-item>
              <el-form-item label="指标规则" prop="ruleId" v-if="formData.typeId !== 'k10021-02'">
                <el-radio v-model="formData.ruleId"
                          v-for="item of ruleType"
                          :key="item.id"
                          :label="item.id">{{item.name}}</el-radio>
              </el-form-item>
              <el-form-item label="" prop="summaries" v-show="formData.typeId !== 'k10021-02' && formData.ruleId == 'k10025-01'">
                <fd-summary v-bind:summary="summaryData"
                            v-on:getSelect="saveType"
                            v-bind:data="formData.summaries"
                            v-bind:getData="getData"
                            :select="!isShow"></fd-summary>
              </el-form-item>
              <el-form-item label="" prop="formula" v-show="formData.typeId !== 'k10021-02' && formData.ruleId == 'k10025-03'">
                <el-input v-model="formData.formula" type="textarea" :autosize="{ minRows: 2, maxRows: 20 }" :readonly="isShow" placeholder="请输入指标规则"></el-input>
              </el-form-item>
              <el-form-item label="系数规则" prop="expression">
                <el-input
                  :readonly="isShow"
                  v-model="formData.expression"
                  placeholder="请输入系数规则"></el-input>
              </el-form-item>
            </el-form>
      </div>
      <div slot="fd-footer">
        <el-button v-show="!isShow" size="small"  @click="typeDialog = false">取消</el-button>
        <el-button v-show="isShow" size="small"  @click="typeDialog = false">关闭</el-button>
        <el-button v-show="!isShow" size="small"  @click = "getData = !getData" type="primary">确定</el-button>
      </div>
    </fd-dialog>
  </div>
</template>

<script>
  import {
    getHeads,
    getCount,
    searchSummary,
    getSummary,
    getLevels,
    getAllLevels,
    addModelDetail,
    editModelDetail,
    showModelTargetDetail,
    saveType,
    saveModel,
    getModelMsg
  } from '@/api/kpi/check/weightCommon'
  import {
    goBack, resetForm
  } from '@/api/common'
  import FdSummary from '../../components/summary'
  import {
    pageMap,
    deleteModelList,
    sortList,
    saveSort,
    refreshDetailList,
    getDetailList,
    dragend,
    getSelfTarget,
    selfKpiChange,
    typeChange,
    canSelectTargets,
    searchByKeyword,
    downloadTable
  } from '@/api/kpi/check/weight'
  import FdDraggable from 'fd/drag/draggable'
  import FdTable from 'fd/table/src/fdTable'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  export default {
    name: '',
    components: { FdSummary, FdDraggable, FdTable, fdDialog },
    props: {},
    data() {
      const validateSummaries = (rule, value, callback) => {
        if (this.formData.ruleId === 'k10025-01' && value.length === 0) {
          callback(new Error('请选择案由'))
        } else {
          callback()
        }
      }
      const validateFormula = (rule, value, callback) => {
        if (this.formData.typeId !== 'k10021-02' && this.formData.ruleId === 'k10025-03' && value === '') {
          callback(new Error('请输入指标规则'))
        } else {
          callback()
        }
      }
      return {
        actionUrl: window.config.project_url,
        headMap: {},
        heads: [],
        pageData: {
          id: '',
          headId: '',
          customType: 'summary',
          levelId: '1',
          otherDefault: 'k10024-01'
        },
        loading: false,
        summaryName: '',
        summary: [],
        summaryData: [],
        summaryNames: {},
        summaryIdSubfix: '_',
        caseType: [{ id: 'summary', name: '案由作为分类' },
          { id: 'userDefined', name: '自定义分类' }],
        caseLevel: [{ id: '1', name: '1-1级案由' },
          { id: '2', name: '1-2级案由' },
          { id: '3', name: '1-3级案由' },
          { id: '4', name: '1-4级案由' },
          { id: '5', name: '1-5级案由' },
          { id: '6', name: '1-6级案由' }],
        pageMap,
        list: [],
        oldSorts: [],
        sortData: [],
        newSorts: [],
        sortDialog: false,
        typeMap: this.fd.tools.mapSelects('k10021'), // 指标类型
        title: '新增分类',
        formData: {
          typeId: '',
          name: '',
          kpiId: '',
          displayName: '',
          content: '',
          expression: '权重系数',
          formula: '',
          ruleId: '01',
          summaries: []
        },
        isShow: false,
        rules: {
          typeId: [{ required: true, message: '请选择指标类型', trigger: 'change' }],
          kpiId: [{ required: true, message: '请选择标记指标', trigger: 'change' }],
          expression: [{ required: true, message: '请输入系数规则', trigger: 'blur' }],
          displayName: [{ required: true, message: '请输入指标名称', trigger: 'blur' },
            { max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          ruleId: [{ required: true, message: '请选择指标规则', trigger: 'change' }],
          summaries: [{ validator: validateSummaries, trigger: 'blur' }],
          formula: [{ validator: validateFormula, trigger: 'blur' }],
          content: [{ max: 1000, message: '长度不超过1000个字符', trigger: 'blur' }]
        },
        ruleType: [{
          id: 'k10025-03',
          name: '自定义规则'
        }, {
          id: 'k10025-01',
          name: '案由'
        }],
        // 新增自定义分类弹框
        typeDialog: false,
        getData: true,
        total: 0,
        selfs: [],
        editKpiId: '',
        selfMap: {},
        pageName: '常规因素 — 民事',
        pageName1: '常规因素-民事',
        keywords: '',
        ids: [],
        flag: false
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
        const data = this.$store.getters.selects['k10021']
        return data.slice(0, 2)
      },
      // 其他层级的系数默认同
      others() {
        return this.$store.getters.selects['k10024']
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
      this.pageData.otherDefault = this.others[0].id
      this.getHeads()
      this.getSummary()
      this.getSelfTarget()
      this.getDetailList()
      this.getCount()
    },
    methods: {
      getHeads,
      getModelMsg,
      getCount,
      getSummary,
      searchSummary,
      getLevels,
      getAllLevels,
      addModelDetail,
      editModelDetail,
      deleteModelList,
      sortList,
      saveSort,
      getDetailList,
      refreshDetailList,
      showModelTargetDetail,
      dragend,
      goBack,
      resetForm,
      saveType,
      saveModel,
      getSelfTarget,
      selfKpiChange,
      typeChange,
      canSelectTargets,
      searchByKeyword,
      downloadTable,
      handerSuccess() {
        this.$message({
          type: 'success',
          message: '“指标规则”列导入时默认为“自定义规则”，若不符合实际情况，请手动修改'
        })
        this.getDetailList()
      }
    },
    watch: {
      summary(data) {
        this.summaryData = this.getLevels(data)
        this.caseLevel = this.caseLevel.splice(0, this.summaryData.length)
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
