<template>
  <div>
    <div class="tab-box tab-box-mar">
      <el-tabs v-model="type" type="card">
        <el-tab-pane label="年度" name="year">
          <div v-show="type==='year'">
            <div class="clearfix py2 table-search">
              <span class="f-left">
                <el-popover
                  placement="right"
                  width="226"
                  ref="popover1"
                >
                  <el-checkbox-group v-model="checkedCols1" @change="changeCols">
                    <div class="pb1" v-for="cols of checkbox" :key="cols.field">
                      <el-checkbox :label="cols.field">{{cols.title}}</el-checkbox>
                    </div>
                  </el-checkbox-group>
                </el-popover>
                <el-button size="small" v-popover:popover1>自定义列表</el-button>
              </span>
                <span class="f-right btn btn-default btn-sm" @click="downloadTable">
                  <i class="at icon-download"/>
                  下载
              </span>
                <span v-if="active === page && type==='year'" class="f-right mr3">
                <fd-search @search="searchByKeyword"
                           v-model="val"></fd-search>
              </span>
            </div>
            <div v-if="active === page">
              <fd-table :option="yearOpt" @cellClick="countPeg" :sortChange="sortByNum" :sortable=true></fd-table>
            </div>
            <fd-pagination
              :limit="yearParams.limit"
              :total="yearTotal"
              :offset="yearParams.offset"
              sizes="sizes"
              :pageArr="[10,20,30,40,50]"
              :currentChange="currentChange"
              :sizeChange="sizeChange">
            </fd-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="月度" name="month">
          <div v-show="type === 'month'">
            <div class="clearfix py2 table-search">
              <span class="f-left">
                <el-popover
                  placement="right"
                  width="226"
                  ref="popover2"
                >
                  <el-checkbox-group v-model="checkedCols2" @change="changeCols">
                    <div class="pb1" v-for="cols of checkbox" :key="cols.field">
                      <el-checkbox :label="cols.field">{{cols.title}}</el-checkbox>
                    </div>
                  </el-checkbox-group>
                </el-popover>
                <el-button size="small" v-popover:popover2>自定义列表</el-button>
              </span>
              <span class="f-right btn btn-default btn-sm" @click="downloadTable">
                  <i class="at icon-download"/>
                  下载
              </span>
              <span v-if="active === page && type==='month'" class="f-right mr3">
                <fd-search @search="searchByKeyword"
                           v-model="val2"></fd-search>
              </span>
            </div>
            <div v-if="active === page">
              <fd-table :option="monthOpt" @cellClick="countPeg" :sortChange="sortByNum" :sortable=true></fd-table>
            </div>
            <fd-pagination
              :limit="monthParams.limit"
              :total="monthTotal"
              :offset="monthParams.offset"
              sizes="sizes"
              :pageArr="[10,20,30,40,50]"
              :currentChange="currentChange"
              :sizeChange="sizeChange">
            </fd-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>import fdTable from 'fd/table'
  import FdPagination from 'fd/pagination/pagination'
  import { currentChange, sizeChange, searchByKeyword, getColumns } from '@/api/kpi/newRecord/workResult'
  import { downloadTable, countPeg, refreshAll, getMonthTotal, getYearTotal, changeCols, refreshCondition,
    sortByNum } from '@/api/kpi/newRecord/resultRuleSystem'
  export default {
    name: 'resultRuleSystem',
    components: {
      fdTable, FdPagination
    },
    props: {
      isComponent: {
        type: Boolean,
        default: false
      },
      userId: {
        type: String,
        default: ''
      },
      userName: {
        type: String,
        default: ''
      },
      page: {
        type: String,
        default: ''
      },
      parentMenu: {
        type: String,
        default: ''
      },
      active: {
        type: String,
        default: ''
      },
      elements: {
        type: Object
      }
    },
    data() {
      return {
        checkedCols1: [],
        checkedCols2: [],
        checkbox: [],
        checkboxName: [],
        pageMap: {
          'ruleSystem': '规章制度',
          'specialWork': '专项工作',
          'workSummary': '工作总结',
          'researchReport': '调研报告',
          'runMeeting': '会议材料',
          'typeOther': '其他'
        },
        menuMap: {
          'ruleSystem': '综合工作_规章制度',
          'specialWork': '综合工作_专项工作',
          'workSummary': '综合工作_工作总结',
          'researchReport': '综合工作_调研报告',
          'runMeeting': '综合工作_会议材料',
          'typeOther': '综合工作_其他'
        },
        typeMap: {
          'year': '年度',
          'month': '月度'
        },
        columsObj: {
          'writing': {
            name: '统计周期',
            allDoc: '发文总数',
            sendDoc: '已办发文'
          }
        },
        docMap: {
          'allDoc': 'doc',
          'sendDoc': 'send',
          'recDoc': 'rec'
        },
        type: 'year',
        yearParams: {
          type: 'year',
          keyword: '',
          orderField: '',
          orderType: '',
          offset: 0,
          limit: 10
        },
        params: {
          jobType: ''
        },
        monthParams: {
          type: 'month',
          keyword: '',
          orderField: '',
          orderType: '',
          offset: 0,
          limit: 10
        },
        pageSize: 10,
        monthTotal: 0,
        yearTotal: 0,
        val: '',
        val2: '',
        columnsJudge: [],
        columns: [],
        monthOpt: {
          stripe: true,
          border: true,
          data: [],
          columns: []
        },
        yearOpt: {
          stripe: true,
          border: true,
          data: [],
          columns: []
        }
      }
    },
    computed: {},
    mounted() {
      this.params.jobType = this.page
      // 综合工作下面其中分类的表头相同
      // 默认刚打开工作业绩workResult页面，先加载6个表格表头
      this.getColumns('writing')
    },
    methods: {
      countPeg, currentChange, sizeChange, searchByKeyword, downloadTable, refreshAll, getMonthTotal,
      getYearTotal, getColumns, changeCols, refreshCondition, sortByNum
    },
    watch: {
      // 先加载6个表格表头，再获取接口数据，不然一次性获取接口太多，以防页面卡顿
      active(val) {
        if (this.page === val) {
          this.refreshAll()
        }
      }
    }
  }
</script>

<style lang="scss">
</style>
