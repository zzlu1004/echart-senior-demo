<template>
  <div class="app-container">
    <div class="container-inner has-fixed-bottom  bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="pb2 bd-dashed-bottom">
        <div v-if="resource==='center_study_develop' || resource==='center_punish_reward'" class="color-title bold h24 pb2">
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
        <fd-table :option="caseOpt" :sortChange="sortByNum" :sortable=true></fd-table>
      </div>
      <fd-pagination
        :limit="cParams.limit"
        :offset="cParams.offset"
        :total="total"
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
    initResult, changeCols, getColumns, sortByNum } from '@/api/kpi/newRecord/study/studyTotalPeg'
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
        checkedCols: [], // 已勾选的表头
        checkbox: [], // 自定义列表的所有表头数据
        checkboxName: [],
        cParams: {
          keyword: '',
          limit: 10,
          offset: 0,
          otherType: ''
        },
        params: {},
        caseOpt: {
          stripe: true,
          border: true,
          data: [],
          columns: []
        },
        pParams: {},
        selfMsg: {},
        page: '',
        id: '',
        resource: '',
        headMap: {
          'train': {
            'applyMan': '申请人',
            'department': '申请部门',
            // 'birthday': '出生日期',
            // 'nation': '民族',
            // 'politics': '政治面貌',
            // 'education': '文化程度',
            // 'workunit': '工作单位名称',
            'job': '职务',
            // 'gender': '性别',
            'type': '类型',
            'className': '参加班次名称',
            'trainStartTime': '培训开始时间',
            'trainEndTime': '培训结束时间',
            'trainOrz': '培训机构',
            'trainSite': '培训地点',
            'lastClassName': '上次参加培训班次名称',
            'lastJudgeClassTime': '上次参加国家法官学院培训时间',
            // 'phone': '手机号码',
            // 'idCard': '身份证号码',
            'remark': '备注',
            'createTime': '创建时间'
          },
          'cadrePartTime': {
            'applyMan': '申请人',
            'department': '申请部门',
            'job': '申请人职务',
            'haveParttime': '是否已有兼职',
            'situation': '兼职情况',
            'reason': '兼职缘由',
            'remark': '备注',
            'createTime': '创建时间'
          },
          'reward': {
            'applyMan': '申请人',
            'department': '申请部门',
            'job': '职务',
            // 'birthday': '出生日期',
            // 'nation': '民族',
            // 'politics': '政治面貌',
            // 'workunit': '工作单位',
            'item': '表彰项目',
            'introduction': '先进事迹简介',
            // 'gender': '性别',
            'remark': '备注',
            'createTime': '创建时间'
          },
          'judgeTrain': {
            'name': '姓名',
            'departName': '部门',
            'typeName': '职务',
            'courseName': '培训班',
            'courseTypeName': '培训班类型',
            'startDate': '培训开始日期',
            'endDate': '培训结束日期',
            'address': '培训地点',
            'content': '培训内容'
          }
        },
        fileName: '',
        url: {},
        userId: '',
        menuMap: {
          'train': '调训培训',
          'cadrePartTime': '干部兼职',
          'reward': '表彰奖励',
          'study': '学习拓展',
          'judgeTrain': '法官培训',
          'rewardPunish': '工作奖惩',
          'punish': '通报批评'
        },
        typeMap: {
          'person': '个人',
          'depart': '部门',
          'year': '年度',
          'month': '月度'
        },
        userName: ''
      }
    },
    computed: {},
    mounted() {
      this.page = this.$route.query.page || ''
      this.type = this.$route.query.type || ''
      this.userName = this.$route.query.userName || this.$store.getters.user.userName
      this.resource = this.$route.query.resource || ''
      this.id = this.$route.query.id || ''
      this.userId = this.$route.query.userId || ''
      this.url = {
        // 学习拓展-调训培训-部门（柱状图）-反查
        'train-depart': {
          'list': 'api/analysis/learn-reward/train/depart/inspection',
          'download': 'api/analysis/learn-reward/train/depart/inspection/download'
        },
        // 学习拓展-调训培训-个人（表格）-反查
        'train-person': {
          'list': 'api/analysis/learn-reward/train/person/inspection',
          'download': 'api/analysis/learn-reward/train/person/inspection/download'
        },
        // 学习拓展-法官培训-部门（柱状图）-反查
        'judgeTrain-depart': {
          'list': 'api/analysis/learn-reward/fgpx/depart/inspection',
          'download': 'api/analysis/learn-reward/fgpx/depart/inspection/download'
        },
        // 学习拓展-法官培训-个人（表格）-反查
        'judgeTrain-person': {
          'list': 'api/analysis/learn-reward/fgpx/person/inspection',
          'download': 'api/analysis/learn-reward/fgpx/person/inspection/download'
        },
        // 学习拓展-干部兼职-部门（柱状图）-反查
        'cadrePartTime-depart': {
          'list': 'api/analysis/learn-reward/job/depart/inspection',
          'download': 'api/analysis/learn-reward/job/depart/inspection/download'
        },
        // 学习拓展-干部兼职-个人（表格）-反查
        'cadrePartTime-person': {
          'list': 'api/analysis/learn-reward/job/person/inspection',
          'download': 'api/analysis/learn-reward/job/person/inspection/download'
        },
        // 工作奖惩-表彰奖励-部门（柱状图）-反查
        'reward-depart': {
          'list': 'api/analysis/learn-reward/reward/depart/inspection',
          'download': 'api/analysis/learn-reward/reward/depart/inspection/download'
        },
        // 工作奖惩-表彰奖励-个人（表格）-反查
        'reward-person': {
          'list': 'api/analysis/learn-reward/reward/person/inspection',
          'download': 'api/analysis/learn-reward/reward/person/inspection/download'
        },
        // 档案查询-学习拓展-反查
        'center_study_develop': {
          'list': 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/learning-development/inspection',
          'download': 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/learning-development/inspection/download'
        },
        // 档案查询-工作奖惩-反查
        'center_punish_reward': {
          'list': 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/reward-punishment/inspection',
          'download': 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/reward-punishment/inspection/download'
        }
      }
      this.pParams = JSON.parse(localStorage.getItem('params'))
      this.selfMsg = this.pParams.selfMsg
      this.params = this.fd.tools.merge(true, {}, this.cParams, this.pParams.params)
      this.initResult()
    },
    methods: {
      searchByKeyword, currentChange, sizeChange, getAllResult, downloadTable, goBack,
      initResult, changeCols, getColumns, sortByNum
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
