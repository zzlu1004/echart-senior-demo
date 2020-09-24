<template>
  <div>
    <div class="tab-box tab-box-mar">
      <el-tabs v-model="type" type="card">
        <el-tab-pane label="年度" name="year">
          <div v-show="type==='year'">
            <div class="clearfix pt2 pb2 table-search">
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
              <span class="f-right btn btn-sm btn-default" @click="downloadTable('analysis-depart')">
                  <i class="at icon-download"/>
                  下载
              </span>
              <span class="f-right mr3">
                <fd-search @search="searchByKeyword"
                           v-if="page==='writing' && type ==='year'"
                           v-model="val"></fd-search>
              </span>
            </div>
            <div>
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
            <div class="clearfix pt2 pb2 table-search">
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
              <span class="f-right fd-search mr3 width-300px">
                <fd-search @search="searchByKeyword"
                           v-if="page==='writing' && type ==='month'"
                           v-model="val2"></fd-search>
              </span>
            </div>
            <div>
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

<script>
  import fdTable from 'fd/table'
  import FdPagination from 'fd/pagination/pagination'
  import { handleSelect, countPeg, currentChange, sizeChange, searchByKeyword, downloadTable, refreshCondition,
    refreshAll, getMonthTotal, getYearTotal, changeCols, getColumns, sortByNum } from '@/api/kpi/newRecord/workResult'
  export default {
    name: 'resultWriting',
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
        type: Boolean,
        default: false
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
          'writing': '办文汇总'
        },
        menuMap: {
          'writing': '综合工作_办文汇总'
        },
        typeMap: {
          'year': '年度',
          'month': '月度'
        },
        columsObj: {
          'writing': {
            name: '统计周期',
            allDoc: '发文总数',
            sendDoc: '已办发文',
            recDoc: '已办收文'
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
        params: {},
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
      this.getColumns(this.page)
      if (this.active) {
        this.refreshAll()
      }
    },
    methods: {
      handleSelect, countPeg, currentChange, sizeChange, searchByKeyword, downloadTable, refreshAll, getMonthTotal,
      getYearTotal, getColumns, changeCols, sortByNum, refreshCondition
    },
    watch: {
      active(val, oldVal) {
        if (val) {
          this.refreshAll()
        }
      }
    }
  }
</script>

<style lang="scss">
</style>
