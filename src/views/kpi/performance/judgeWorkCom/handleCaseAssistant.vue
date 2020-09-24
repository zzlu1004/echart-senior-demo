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
              <el-checkbox-group v-model="assistantCheckedCols" @change="changeCols">
                <div class="pb1" v-for="cols of assistantCheckbox" :key="cols.field">
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
            <fd-search @search="searchByKeyword" v-model="assistantParams.keyword"></fd-search>
          </span>
        </div>
        <div v-if="isFirst">
          <fd-table class="assistant-table" :option="assistantOpt" @cellClick="countPeg" :sortChange="sortByNum" :sortable=true
             :defaultSort="{prop:'caseNum', order:'descending'}" ref="assistantOpt"></fd-table>
          <div v-if="isPrint" :id="type" class="hide">
            <div class="relative print-title">
              <div class="bold h16 title-hide absolute print-name center" style="width:100%;">{{printTitle}}</div>
              <fd-table :option="printOpt"></fd-table>
            </div>
          </div>
        </div>
        <fd-pagination
          :limit="assistantParams.limit"
          :offset="assistantParams.offset"
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
    name: 'handleCaseAssistant',
    components: {
      fdTable, FdPagination
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
        assistantParams: {
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
          'assistant': {
            departName: '部门',
            staffName: '姓名',
            caseNum: '法官助理案件数',
            workload: '法官助理办案工作量'
          }
        },
        assistantCheckedCols: [],
        assistantCheckbox: [],
        assistantCheckboxName: [],
        assistantOpt: {
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
      this.assistantParams.type = this.type
      this.getColumns(this.type)
    },
    methods: {
      searchByKeyword, countPeg, changeCols, downloadTable, getColumns, refreshCondition,
      getJudgeTotal, currentChange, sizeChange, sortByNum, printTable
    },
    watch: {
      isRefresh() {
        this.params = this.fd.tools.merge(true, this.assistantParams, this.Pparams)
        this.refreshCondition()
        this.getJudgeTotal(this.type)
      },
      isFirst(val) {
        if (val) {
          this.params = this.fd.tools.merge(true, this.assistantParams, this.Pparams)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.assistant-table{
}
</style>
