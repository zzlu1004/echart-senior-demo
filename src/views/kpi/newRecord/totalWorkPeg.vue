<template>
  <div class="app-container">
    <div class="container-inner has-fixed-bottom bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="pb2 bd-dashed-bottom">
        <div v-if="resource==='work_result_writing' ||
          resource==='work_result_ruleSystem' ||
          resource==='work_result_specialWork' ||
          resource==='work_result_workSummary' ||
          resource==='work_result_researchReport' ||
          resource==='work_result_runMeeting' ||
          resource==='work_result_typeOther' ||
          resource==='center_other'" class="color-title bold h24 pb2">
          {{userName}}
        </div>
        <div v-else class="color-title bold h24 pb2">
          {{selfMsg.departName}}
        </div>
        <div>
          <el-row>
            <el-col :span="8">
              <span>统计时间：</span>
              <span v-if="params.startTime || params.endTime">{{params.startTime+'至'+params.endTime}}</span>
            </el-col>
            <el-col :span="8">
              <span>{{selfMsg.index}}：</span>
              <span>{{selfMsg.value}}</span>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="clearfix py2 table-search">
        <span class="f-left">
          <el-popover
              placement="right"
              width="226"
              ref="popover"
            >
            <div class="scroll-body">
              <el-checkbox-group v-model="checkedCols" @change="changeCols">
                <div class="pb1" v-for="cols of checkbox" :key="cols.field">
                  <el-checkbox :label="cols.field">{{cols.title}}</el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
            </el-popover>
            <el-button size="small" v-popover:popover>自定义列表</el-button>
        </span>
        <span class="f-right btn btn-default btn-sm" @click="downloadTable">
            <i class="at icon-download"/>
            下载
        </span>
        <span class="f-right mr3">
          <fd-search @search="searchByKeyword" v-model="val"></fd-search>
        </span>
      </div>
      <div>
        <fd-table :loading="loading" :option="caseOpt" :sortChange="sortByNum" :sortable=true></fd-table>
      </div>
      <fd-pagination
        :limit="cParams.limit"
        :total="total"
        :offset="cParams.offset"
        sizes="sizes"
        :pageArr="[10,20,30,40,50]"
        :currentChange="currentChange"
        :sizeChange="sizeChange">
    </fd-pagination>
      <div class="fixed-bottom">
        <div class="fixed-bottom-item" @click="goBack">
          <div class="fixed-bottom-item-text">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import fdTable from 'fd/table'
  import FdPagination from 'fd/pagination/pagination'
  import { goBack } from '@/api/common'
  import { downloadTable, getAllResult, searchByKeyword, currentChange, sizeChange,
    initResult, changeCols, getColumns, sortByNum } from '@/api/kpi/newRecord/totalWorkPeg'
  export default {
    name: '',
    components: {
      fdTable, FdPagination
    },
    props: {},
    data() {
      return {
        val: '',
        pageSize: 10,
        total: 0,
        loading: false,
        checkedCols: [], // 已勾选的表头
        checkbox: [], // 自定义列表的所有表头数据
        checkboxName: [],
        cParams: {
          keyword: '',
          limit: 10,
          offset: 0
        },
        menuMap: {
          'center_other': '其他',
          'other': '其他',
          'work_result_writing': '综合工作_办文汇总',
          'work_result_ruleSystem': '综合工作_规章制度',
          'work_result_specialWork': '综合工作_专项工作',
          'work_result_workSummary': '综合工作_工作总结',
          'work_result_researchReport': '综合工作_调研报告',
          'work_result_runMeeting': '综合工作_会议材料',
          'work_result_typeOther': '综合工作_其他',
          'total_writing': '综合工作_办文汇总',
          'total_ruleSystem': '综合工作_规章制度',
          'total_specialWork': '综合工作_专项工作',
          'total_workSummary': '综合工作_工作总结',
          'total_researchReport': '综合工作_调研报告',
          'total_runMeeting': '综合工作_会议材料',
          'total_typeOther': '综合工作_其他'
        },
        typeMap: {
          'year': '年度',
          'month': '月度',
          'depart': '部门',
          'person': '个人'
        },
        columnType: 'docType',
        params: {},
        caseOpt: {
          stripe: true,
          border: true,
          data: [],
          columns: []
        },
        pParams: {},
        selfMsg: {},
        type: '',
        id: '',
        resource: '',
        headMap: {
          'doc': {
            'type': '公文类型',
            'title': '发文标题',
            'writer': '拟稿人',
            'writerDepart': '拟稿部门',
            'sendDate': '印发日期',
            'createTime': '创建时间'
          },
          'send': {
            'type': '公文类型',
            'title': '发文标题',
            'writer': '拟稿人',
            'writerDepart': '拟稿部门',
            'sendDate': '印发日期',
            'createTime': '创建时间',
            'checkMan': '审核人',
            'checkDepart': '审核部门',
            'checkTime': '审核时间'
          },
          'rec': {
            'type': '公文类型',
            'title': '发文标题',
            'sendDate': '印发日期',
            'createTime': '创建时间',
            'checkMan': '审核人',
            'checkDepart': '审核部门',
            'checkTime': '审核时间'
          },
          'notice': {
            'title': '标题',
            'type': '类型',
            'sendDepart': '发放部门',
            'writer': '拟稿人',
            'sendDate': '发布时间',
            'createTime': '创建时间'
          },
          'business': {
            'applyMan': '出差申请人',
            'department': '所属部门',
            'reason': '出差原因',
            'location': '出差地点',
            'days': '出差天数',
            'startTime': '开始出差时间',
            'endTime': '结束出差时间',
            'createTime': '创建时间'
          },
          'car': {
            'applyMan': '申请人',
            'department': '所属部门',
            'carUser': '用车人',
            'reason': '用车原因',
            'startTime': '开始用车时间',
            'endTime': '结束用车时间',
            'createTime': '创建时间'
          },
          'goods': {
            'applyMan': '领用人',
            'department': '所属部门',
            'goodUser': '物品使用人',
            'goods': '领用物品',
            'applyTime': '领用时间',
            'createTime': '创建时间'
          },
          'workCard': {
            'applyMan': '申请人',
            'department': '所属部门',
            'type': '类型',
            'applyTime': '申请时间',
            'cardNum': '原证件号码',
            'remark': '备注',
            'createTime': '创建时间'
          },
          'judgeTeam': {
            'applyMan': '申请人',
            'applyDate': '申请日期',
            'departNow': '现部门名称',
            'teamNow': '现审判团队',
            'departChange': '拟调整部门',
            'teamChange': '拟调整审判团队',
            'reason': '申请调整缘由',
            'remark': '备注',
            'createTime': '创建时间'
          },
          'personnel': {
            'applyMan': '申请人',
            'department': '申请部门',
            'queryType': '查询类型',
            'gender': '性别',
            'job': '职务',
            'reason': '查询缘由',
            'content': '查询内容',
            'remark': '备注',
            'createTime': '创建时间'
          },
          'proof': {
            'applyMan': '申请人',
            'department': '所属部门',
            'type': '类型',
            'reason': '申请缘由',
            'remark': '备注',
            'createTime': '创建时间'
          },
          'abroad': {
            'applyMan': '申请人',
            'department': '所属部门',
            'formType': '表单类型',
            'reason': '事由',
            'remark': '备注',
            'createTime': '创建时间'
          },
          'cancelleave': {
            'applyMan': '申请人',
            'department': '申请部门',
            'type': '销假类型',
            'trueEndDate': '实际结束日期',
            'trueDays': '实休天数',
            'cancelObj': '销假对象',
            'remark': '备注',
            'createTime': '创建时间'
          },
          'leave': {
            'applyMan': '申请人',
            'phone': '联系方式',
            'job': '职位',
            'days': '天数',
            'department': '申请部门',
            'type': '请假类型',
            'startDate': '差假开始日期',
            'endDate': '差假结束日期',
            'reason': '事由',
            'remark': '备注',
            'createTime': '创建时间'
          }
        },
        fileName: '',
        url: {},
        userName: '',
        userId: ''
      }
    },
    computed: {},
    mounted() {
      this.type = this.$route.query.type || ''
      this.resource = this.$route.query.resource || ''
      this.id = this.$route.query.id || ''
      this.userId = this.$route.query.userId || ''
      this.url = {
        // 工作业绩-办文-反查接口
        'total_writing': {
          'list': 'api/analysis/doc/inspection',
          'download': 'api/analysis/doc/inspection/download'
        },
        // 工作业绩-规章制度-反查接口
        'total_ruleSystem': {
          'list': 'api/analysis/doc/type/inspection',
          'download': 'api/analysis/doc/type/inspection/download'
        },
        // 工作业绩-专项工作-反查接口
        'total_specialWork': {
          'list': 'api/analysis/doc/type/inspection',
          'download': 'api/analysis/doc/type/inspection/download'
        },
        // 工作业绩-工作总结-反查接口
        'total_workSummary': {
          'list': 'api/analysis/doc/type/inspection',
          'download': 'api/analysis/doc/type/inspection/download'
        },
        // 工作业绩-调研报告-反查接口
        'total_researchReport': {
          'list': 'api/analysis/doc/type/inspection',
          'download': 'api/analysis/doc/type/inspection/download'
        },
        // 工作业绩-会议材料-反查接口
        'total_runMeeting': {
          'list': 'api/analysis/doc/type/inspection',
          'download': 'api/analysis/doc/type/inspection/download'
        },
        // 工作业绩-其他-反查接口
        'total_typeOther': {
          'list': 'api/analysis/doc/type/inspection',
          'download': 'api/analysis/doc/type/inspection/download'
        },
        // 档案中心-工作业绩-办文-反查接口
        'work_result_writing': {
          'list': 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/doc/inspection',
          'download': 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/doc/inspection/download'
        },
        // 档案中心-工作业绩-规章制度-反查接口
        'work_result_ruleSystem': {
          'list': 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/doc/type/inspection',
          'download': 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/doc/type/inspection/download'
        },
        // 档案中心-工作业绩-专项工作-反查接口
        'work_result_specialWork': {
          'list': 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/doc/type/inspection',
          'download': 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/doc/type/inspection/download'
        },
        // 档案中心-工作业绩-工作总结-反查接口
        'work_result_workSummary': {
          'list': 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/doc/type/inspection',
          'download': 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/doc/type/inspection/download'
        },
        // 档案中心-工作业绩-调研报告-反查接口
        'work_result_researchReport': {
          'list': 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/doc/type/inspection',
          'download': 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/doc/type/inspection/download'
        },
        // 档案中心-工作业绩-会议材料-反查接口
        'work_result_runMeeting': {
          'list': 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/doc/type/inspection',
          'download': 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/doc/type/inspection/download'
        },
        // 档案中心-工作业绩-其他-反查接口
        'work_result_typeOther': {
          'list': 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/doc/type/inspection',
          'download': 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/doc/type/inspection/download'
        },
        // 工作业绩-其他-反查接口
        'other': {
          'list': 'api/analysis/other/inspection',
          'download': 'api/analysis/other/inspection/download'
        },
        // 档案中心-工作业绩-其他-反查接口
        'center_other': {
          'list': 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/other/inspection',
          'download': 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/other/inspection/download'
        }
      }
      if (this.resource === 'other' || this.resource === 'center_other') {
        this.columnType = 'otherType'
      }
      this.pParams = JSON.parse(localStorage.getItem('params'))
      this.selfMsg = this.pParams.selfMsg
      this.params = this.fd.tools.merge(true, {}, this.cParams, this.pParams.params)
      this.userName = this.selfMsg.userName || this.$store.getters.user.userName
      this.initResult()
    },
    methods: {
      searchByKeyword, currentChange, sizeChange, getAllResult, downloadTable, goBack, initResult,
      changeCols, getColumns, sortByNum
    },
    watch: {}
  }
</script>

<style lang="scss">
  .width-260px {
    width:260px;
  }
.scroll-body{
  max-height:300px;
  overflow-y: auto;
}
</style>
