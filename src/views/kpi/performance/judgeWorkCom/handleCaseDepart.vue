<template>
  <div>
    <div>
      <el-row>
        <el-col :span="6">
          <div class="bd mr2">
            <div class="bd-bottom bg-gray color-title h16 px2 height-title bold">
              <el-tooltip :open-delay='300' class="item" :content="courtObj.departName || '--'" effect="dark" placement="top-start">
                <div class="dot-hidden">
                  {{courtObj.departName || '--'}}
                </div>
              </el-tooltip>
            </div>
            <div class="px2 pt2 min-height-div">
              <div class="mt2 mb4 level-title">
                <span class="f-left">员额法官数</span>
                <span class="f-right bold h24">{{courtObj.staffCount || 0}}</span>
              </div>
              <div class="mb4 level-title">
                <span class="f-left">承办案件数</span>
                <span class="f-right bold h24">{{courtObj.caseCount || 0}}</span>
              </div>
              <div class="mb4 level-title">
                <span class="f-left">办案工作量</span>
                <span class="f-right bold h24">{{fd.data.saveFloat(courtObj.workload, 2)}}</span>
              </div>
              <div class="mb4 level-title">
                <span class="f-left">平均承办案件数</span>
                <span class="f-right bold h24">{{fd.data.saveFloat(courtObj.avgCaseCount, 2)}}</span>
              </div>
              <div class="level-title">
                <span class="f-left">平均办案工作量</span>
                <span class="f-right bold h24">{{fd.data.saveFloat(courtObj.avgWorkload, 2)}}</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="bd">
            <div class="bd-bottom bg-gray color-title h16 px2 height-title bold">
              各部门人均业绩对比
            </div>
            <div class="px2 pt1 min-height-div">
              <fd-echart :option="vbarOpt" height="312px"></fd-echart>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="clearfix py2 table-search">
      <span class="f-left">
        <el-popover
          placement="right"
          width="226"
          ref="popover"
        >
          <el-checkbox-group v-model="departCheckedCols" @change="changeCols">
            <div class="pb1" v-for="cols of departCheckbox" :key="cols.field">
              <el-checkbox :label="cols.field">{{cols.title}}</el-checkbox>
            </div>
          </el-checkbox-group>
        </el-popover>
        <el-button size="small" v-popover:popover>自定义列表</el-button>
      </span>
      <!-- <span class="f-right btn btn-default btn-sm" @click="printTable">
          <i class="fd-icon icon-dayin"/>
          打印
      </span> -->
      <span class="f-right btn btn-default btn-sm" @click="downloadTable('analysis-depart')">
          <i class="at icon-download"/>
          下载
      </span>
      <span class="f-right mr3">
        <fd-search @search="searchByKeyword" v-model="val"></fd-search>
      </span>
    </div>
    <div id="depart">
      <div class="relative print-title">
        <div class="bold h16 title-hide absolute print-name center" style="width:100%;">{{printTitle}}</div>
        <!-- v-if 用来解决默认排序的时候，父组件的Pparams还没有传递到子组件，造成参数丢失 -->
        <div v-if="isFirst">
          <fd-table class="depart-table" :option="departOpt" @cellClick="countPeg"
          :defaultSort="{prop:'caseCount', order:'descending'}"
          :sortChange="sortByNum" :sortable=true ref="departOpt"></fd-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import fdEchart from 'fd/echarts/echarts'
  import FdPagination from 'fd/pagination/pagination'
  import fdTable from 'fd/table'
  import { searchByKeyword, countPeg, changeCols, downloadTable, getColumns, refreshCondition,
    sortByNum, printTable, getVbarData, getCourtTotal, getDepartTotal } from '@/api/kpi/performance/judgeWork'
  export default {
    name: 'handleCaseDepart',
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
      },
      isFirst: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        fileName: '',
        columsObj: {
          'depart': {
            departName: '承办部门',
            staffCount: '员额法官数',
            caseCount: '承办案件数',
            workload: '办案工作量',
            avgCaseCount: '平均承办案件数',
            avgWorkload: '平均办案工作量'
          }
        },
        typeMap: {
          'depart': '部门',
          'judge': '员额法官',
          'assistant': '法官助理',
          'clerk': '书记员'
        },
        tableOpt: {},
        val: '',
        printTitle: '', // 打印出来的头部标题，页面不显示，但是打印出来要有
        departParams: {
          keyword: '',
          orderField: '',
          orderType: ''
        },
        courtObj: {},
        vbarOpt: {
          data: [],
          type: 'vbar',
          chartOption: {},
          dataZoom: true,
          chart: null,
          opt: {
            xAxis: {
              axisLabel: {
                rotate: 0,
                interval: 'auto'
              }
            },
            legend: {
              top: 0,
              left: 'auto',
              right: 24
            },
            grid: {
              bottom: 40
            }
          }
        },
        departOpt: {
          stripe: true,
          border: true,
          data: [],
          columns: []
        },
        departCheckbox: [],
        departCheckboxName: [],
        departCheckedCols: [],
        params: {}
      }
    },
    computed: {
    },
    mounted() {
      this.getColumns(this.type)
      this.getDepartTotal()
      this.getCourtTotal()
      this.getVbarData()
    },
    methods: {
      searchByKeyword, countPeg, changeCols, downloadTable, getColumns, refreshCondition,
      sortByNum, printTable, getVbarData, getCourtTotal, getDepartTotal
    },
    watch: {
      isRefresh() {
        this.params = this.fd.tools.merge(true, this.departParams, this.Pparams)
        this.refreshCondition()
        this.getDepartTotal()
        this.getCourtTotal()
        this.getVbarData()
      },
      isFirst(val) {
        if (val) {
          this.getCourtTotal()
          this.getVbarData()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.depart-table{
}
</style>
