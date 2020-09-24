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
            <fd-search @search="searchByKeyword" v-model="judgeParams.keyword"></fd-search>
          </span>
        </div>
        <div v-if="isFirst">
          <fd-table class="judge-table" :option="judgeOpt" @cellClick="countPeg" :sortChange="sortByNum" :sortable=true
             :defaultSort="{prop:'cbrCaseNum', order:'descending'}" ref="judgeOpt"></fd-table>
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
  import FdPagination from 'fd/pagination/pagination'
  import fdTable from 'fd/table'
  import { searchByKeyword, countPeg, changeCols, downloadTable, getColumns, refreshCondition,
    getJudgeTotal, currentChange, sizeChange, sortByNum, printTable } from '@/api/kpi/performance/judgeWork'
  export default {
    name: 'handleCaseJudge',
    components: {
      fdTable, FdPagination
    },
    props: {
      type: {
        type: String,
        default: ''
      },
      defaultSearch: {
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
      },
      isFirst: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        total: 0,
        printTitle: '',
        judgeParams: {
          keyword: this.defaultSearch || '',
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
      // 刚进入页面，将参数对象的type赋值
      this.judgeParams.type = this.type
      if (this.defaultSearch) {
        this.judgeParams.keyword = this.defaultSearch
      } else {
        this.judgeParams.keyword = ''
      }
      this.getColumns(this.type)
    },
    methods: {
      searchByKeyword, countPeg, changeCols, downloadTable, getColumns, refreshCondition,
      getJudgeTotal, currentChange, sizeChange, sortByNum, printTable
    },
    watch: {
      isRefresh() {
        this.params = this.fd.tools.merge(true, this.judgeParams, this.Pparams)
        this.refreshCondition()
        this.getJudgeTotal(this.type)
      },
      isFirst(val) {
        if (val) {
          this.params = this.fd.tools.merge(true, this.judgeParams, this.Pparams)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.judge-table{
}
</style>
