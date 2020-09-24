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
              <span class="f-right btn btn-sm btn-default" @click="downloadTable">
                <i class="at icon-download"/>
                下载
              </span>
              <span class="f-right mr3">
                <fd-search @search="searchByKeyword"
                           v-if="page==='other' && type ==='year'"
                           v-model="val"></fd-search>
              </span>
            </div>
            <div>
              <fd-table :option="yearOpt" @cellClick="countPeg" :sortChange="sortByNum" :sortable=true></fd-table>
            </div>
            <fd-pagination
              :limit="yearParams.limit"
              :offset="yearParams.offset"
              :total="yearTotal"
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
              <span class="f-right mr3">
                <fd-search @search="searchByKeyword"
                           v-if="page==='other' && type ==='month'"
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
  import { handleSelect, countPeg, currentChange, sizeChange, searchByKeyword, downloadTable,
    refreshOtherAll, getMonthTotal, getYearTotal, changeCols, getColumns, sortByNum, refreshCondition } from '@/api/kpi/newRecord/workResult'
  export default {
    name: 'other',
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
          'other': '其他'
        },
        menuMap: {
          'other': '其他'
        },
        typeMap: {
          'year': '年度',
          'month': '月度'
        },
        columsObj: {
          'other': {
            'name': '统计周期',
            'total': '汇总',
            'noticeCount': '通知通告',
            'businessCount': '出差',
            'carCount': '用车',
            'leaveCount': '请假',
            'cancelleaveCount': '销假',
            // 'goodsCount': '物品领用',
            'workCardCount': '工作证申请',
            'judgeTeamCount': '审判团队调整',
            'personnelCount': '人事数据查询',
            'proofCount': '证明材料申请',
            'abroadCount': '出入境查询'
          }
        },
        docMap: {
          'noticeCount': 'notice',
          'businessCount': 'business',
          'carCount': 'car',
          'goodsCount': 'goods',
          'cancelleaveCount': 'cancelleave',
          'leaveCount': 'leave',
          'workCardCount': 'workCard',
          'judgeTeamCount': 'judgeTeam',
          'personnelCount': 'personnel',
          'proofCount': 'proof',
          'abroadCount': 'abroad'
        },
        type: 'year',
        params: {},
        yearParams: {
          type: 'year',
          keyword: '',
          orderField: '',
          orderType: '',
          offset: 0,
          limit: 10
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
      this.getColumns(this.page)
      if (this.active) {
        this.refreshOtherAll()
      }
    },
    methods: {
      handleSelect, countPeg, currentChange, sizeChange, searchByKeyword, downloadTable, refreshOtherAll, getMonthTotal,
      getYearTotal, getColumns, changeCols, sortByNum, refreshCondition
    },
    watch: {
      active(val, oldVal) {
        if (val) {
          this.refreshOtherAll()
        }
      }
    }
  }
</script>

<style lang="scss">
</style>
