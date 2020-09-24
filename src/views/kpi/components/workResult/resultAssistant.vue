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
              <span class="f-right btn btn-default btn-sm" @click="downloadTable">
                  <i class="at icon-download"/>
                  下载
              </span>
              <span class="f-right mr3">
                <fd-search @search="searchByKeyword"
                           v-if="active && type ==='year'"
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
              <span class="f-right mr3">
                <fd-search @search="searchByKeyword"
                           v-if="active && type ==='month'"
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
      <span class="select-up f-left width-300px">
        <el-select
          v-model="params.weightId"
          placeholder="请选择"
          size="small"
          clearable
          @change="refreshAssistAll"
        >
            <el-option
              v-for="item in weightSchemaOpt"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
      </span>
    </div>
  </div>
</template>

<script>import fdTable from 'fd/table'
import FdPagination from 'fd/pagination/pagination'
import { countPeg, currentChange, sizeChange, searchByKeyword, downloadTable, refreshCondition,
  getMonthTotal, getYearTotal, refreshAssistAll, changeCols, getColumns, getWeightOpt,
  sortByNum } from '@/api/kpi/newRecord/workResult'
export default {
  name: 'resultAssistant',
  components: {
    fdTable, FdPagination
  },
  props: {
    isComponent: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    },
    page: {
      type: String,
      default: ''
    },
    parentMenu: {
      type: String,
      default: ''
    },
    userId: {
      type: String,
      default: ''
    },
    userName: {
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
        'judge': '员额法官',
        'assistant': '法官助理',
        'clerk': '书记员'
      },
      menuMap: {
        'judge': '办案工作_员额法官',
        'assistant': '办案工作_法官助理',
        'clerk': '办案工作_书记员'
      },
      typeMap: {
        'year': '年度',
        'month': '月度'
      },
      docMap: {
        'cbrCaseNum': 'cbr',
        'chiefCaseNum': 'chief',
        'hytCaseNum': 'hyt',
        'totalCaseNum': '',
        'cbrWorkload': 'cbr',
        'chiefWorkload': 'chief',
        'hytWorkload': 'hyt',
        'totalWorkload': ''
      },
      columsObj: {
        'assistant': {
          staffName: '统计周期',
          caseNum: '法官助理案件数',
          workload: '法官助理工作量'
        },
        'clerk': {
          staffName: '统计周期',
          caseNum: '书记员案件数',
          workload: '书记员工作量'
        }
      },
      type: 'year',
      params: {
        workType: '',
        weightId: ''
      },
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
      weightParams: {
        limit: 0,
        offset: 0,
        status: '',
        keyword: ''
      },
      weightMap: {},
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
      },
      weightSchemaOpt: []
    }
  },
  computed: {},
  mounted() {
    this.getColumns(this.page)
    if (this.active) {
      this.getWeightOpt()
    }
  },
  methods: {
    countPeg, currentChange, sizeChange, searchByKeyword, downloadTable, getMonthTotal, refreshCondition,
    getYearTotal, refreshAssistAll, getColumns, changeCols, getWeightOpt, sortByNum
  },
  watch: {
    active(val, oldVal) {
      if (val) {
        this.getWeightOpt()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
