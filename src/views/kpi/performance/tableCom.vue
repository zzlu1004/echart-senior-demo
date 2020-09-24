<template>
  <div>
    <div class="clearfix mb2">
     <div class="clearfix pb2 table-search">
          <span class="f-left">
            <el-popover
              placement="right"
              width="226"
              ref="popover2"
            >
              <el-checkbox-group v-model="judgeCheckedCols" @change="changeCols">
                <div class="pb1" v-for="cols of judgeCheckbox" :key="cols.field">
                  <el-checkbox :label="cols.field">{{cols.title}}</el-checkbox>
                </div>
              </el-checkbox-group>
            </el-popover>
            <el-button size="small" v-popover:popover2>自定义列表</el-button>
          </span>
          <!-- <span class="f-right btn btn-default btn-sm" @click="printTable">
              <i class="fd-icon icon-dayin"/>
              打印
          </span> -->
          <span class="f-right btn btn-default btn-sm" @click="downloadTable(exportType)">
              <i class="at icon-download"/>
              下载
          </span>
          <span v-if="active === type" class="f-right mr3">
            <fd-search @search="searchByKeyword" v-model="params.keyword"></fd-search>
          </span>
        </div>
        <div v-if="active === type">
          <fd-table :option="judgeOpt" @cellClick="countPeg" :sortChange="sortByNum2" :sortable=true
             :defaultSort="{prop:propMap[type], order:'descending'}" ref="judgeOpt"></fd-table>
          <div v-if="isPrint" :id="type" class="hide">
            <div class="relative print-title">
              <div class="bold h16 title-hide absolute print-name center" style="width:100%;">{{printTitle}}</div>
              <fd-table :option="printOpt"></fd-table>
            </div>
          </div>
        </div>
        <fd-pagination
          :limit="judgeParams.limit"
          :offset="judgeParams.offset"
          :total="total"
          sizes="sizes"
          :pageArr="[10,20,30,40,50]"
          :currentChange="currentChange"
          :sizeChange="sizeChange">
        </fd-pagination>
    </div>
  </div>
</template>

<script>
  import fdEchart from 'fd/echarts/echarts'
  import FdPagination from 'fd/pagination/pagination'
  import fdTable from 'fd/table'
  import { searchByKeyword, countPeg, changeCols, downloadTable, getColumns, refreshCondition,
    getJudgeTotal, currentChange, sizeChange, sortByNum, printTable } from '@/api/kpi/performance/judgeWork'
  export default {
    name: 'tableCom',
    components: {
      fdEchart, fdTable, FdPagination
    },
    props: {
      type: {
        type: String,
        default: ''
      },
      exportType: {
        type: String,
        default: ''
      },
      active: {
        type: String,
        default: ''
      },
      weightMap: {
        type: Object
      },
      Pparams: {
        type: Object
      },
      elements: {
        type: Object
      },
      isFlag: {
        type: Boolean,
        default: false
      },
      flag: {
        type: Number,
        default: 0
      },
      isRefresh: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        pageSize: 10,
        total: 0,
        printTitle: '',
        propMap: {
          'judge': 'cbrCaseNum',
          'assistant': 'caseNum',
          'clerk': 'caseNum'
        },
        judgeParams: {
          keyword: '',
          type: '',
          orderField: '',
          orderType: '',
          limit: 10,
          offset: 0
        },
        params: {},
        typeMap: {
          'depart': '部门',
          'judge': '员额法官',
          'assistant': '法官助理',
          'clerk': '书记员'
        },
        fileName: '',
        columsObj: {
          'depart': {
            departName: '承办部门',
            staffCount: '员额法官数',
            caseCount: '承办案件数',
            workload: '办案工作量',
            avgCaseCount: '平均承办案件数',
            avgWorkload: '平均办案工作量'
          },
          'judge': {
            departName: '所在部门',
            staffName: '法官',
            cbrCaseNum: '承办人案件数',
            chiefCaseNum: '审判长案件数',
            hytCaseNum: '合议庭成员案件数',
            cbrWorkload: '承办人工作量',
            chiefWorkload: '审判长工作量',
            hytWorkload: '合议庭成员工作量',
            totalCaseNum: '合计案件数',
            totalWorkload: '合计工作量',
            avgWorkload: '承办案件平均工作量'
          },
          'assistant': {
            departName: '部门',
            staffName: '姓名',
            caseNum: '法官助理案件数',
            workload: '法官助理办案工作量'
          },
          'clerk': {
            departName: '部门',
            staffName: '姓名',
            caseNum: '书记员案件数',
            workload: '书记员办案工作量'
          }
        },
        judgeCheckedCols: [],
        judgeCheckbox: [],
        judgeCheckboxName: [],
        judgeOpt: {
          stripe: true,
          border: true,
          data: [],
          columns: []
        },
        printOpt: {
          stripe: true,
          border: true,
          data: [],
          columns: []
        },
        isPrint: false,
        tableOpt: {}
      }
    },
    computed: {
    },
    mounted() {
      if (this.type === 'assistant') {
        this.judgeParams.type = 'assistant'
      } else {
        this.judgeParams.type = this.type
      }
      this.getColumns(this.type)
    },
    methods: {
      searchByKeyword, countPeg, changeCols, downloadTable, getColumns, refreshCondition,
      getJudgeTotal, currentChange, sizeChange, sortByNum, printTable
      // , sortByNum2, refreshCondition2
    },
    watch: {
      isRefresh() {
        if (this.active === this.type) {
          if (this.flag) {
            this.refreshCondition2()
          }
          this.params = this.fd.tools.merge(true, this.judgeParams, this.Pparams)
          this.getJudgeTotal(this.type)
        }
      },
      isFlag() {
        if (this.active === this.type) {
          if (this.flag) {
            this.refreshCondition2()
          }
          this.params = this.fd.tools.merge(true, this.judgeParams, this.Pparams)
          // this.getJudgeTotal(this.type)
        }
      }
    }
  }
</script>

<style lang="scss">
</style>
