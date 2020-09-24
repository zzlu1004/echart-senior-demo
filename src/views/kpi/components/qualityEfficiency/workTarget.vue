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
                    <span class="f-right btn btn-default btn-sm" @click="downloadTable('analysis-depart')">
                  <i class="at icon-download"/>
                  下载
              </span>
                    <span class="f-right mr3">
                <fd-search @search="searchByKeyword" v-model="val"></fd-search>
              </span>
            </div>
            <div>
              <fd-table :option="yearOpt" @cellClick="countPeg" :sortChange="sortByNum" :sortable=true :loading="yearLoading"></fd-table>
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
              <span class="f-right mr3">
                <fd-search @search="searchByKeyword" v-model="val2"></fd-search>
              </span>
            </div>
            <div>
              <fd-table :option="monthOpt" @cellClick="countPeg" :sortChange="sortByNum" :sortable=true :loading="monthLoading"></fd-table>
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
          v-model="params.indexId"
          placeholder="请选择"
          clearable
          size="small"
          @change="refreshAll"
        >
            <el-option
              v-for="item in targetOpt"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
      </span>
    </div>
  </div>
</template>

<script>
  import fdTable from 'fd/table'
  import FdPagination from 'fd/pagination/pagination'
  import { countPeg, currentChange, sizeChange, searchByKeyword, downloadTable, refreshCondition,
    getMonthTotal, getYearTotal, refreshAll, changeCols, getColumns, getTargetOpt,
    sortByNum, getWidth } from '@/api/kpi/newRecord/workQE'
  export default {
    name: 'workTarget',
    components: {
      fdTable, FdPagination
    },
    props: {
      isComponent: {
        type: Boolean,
        default: false
      },
      page: {
        type: String,
        default: ''
      },
      active: {
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
          'workQuality': '办案公正',
          'workEfficiency': '办案效率',
          'workEffect': '办案效果',
          'judicialOpen': '司法公开'
        },
        typeIdMap: {
          'workQuality': 'zb002',
          'workEfficiency': 'zb003',
          'workEffect': 'zb004',
          'judicialOpen': 'zb005'
        },
        menuMap: {
          'workQuality': '办案公正',
          'workEfficiency': '办案效率',
          'workEffect': '办案效果',
          'judicialOpen': '司法公开'
        },
        typeMap: {
          'year': '年度',
          'month': '月度'
        },
        yearLoading: false,
        monthLoading: false,
        columsObj: {
          // 办案公正-改判发回重审案件数
          'workQuality-zb002011': {
            name: '统计周期',
            zb002011: '改判发回重审案件数',
            d001016: '上诉案件改判（错误）数',
            d001017: '上诉案件发回重审（错误）数'
          },
          // 办案公正-再审改判发回案件数
          'workQuality-zb002012': {
            name: '统计周期',
            zb002012: '再审改判发回案件数',
            d001018: '本院再审案件改判（错误）数',
            d001019: '上级法院再审案件改判（错误）数',
            d001020: '上级法院再审案件发回重审（错误）数',
            d001021: '本院再审案件发回重审（错误）数'
          },
          // 办案效率-结案率（执结率）
          'workEfficiency-zb003001': {
            name: '统计周期',
            zb003001: '结案率（执结率）',
            d001002: '各类案件结案数',
            d001004: '各类案件旧存数',
            d001003: '各类案件新收数'
          },
          // 办案效率-法定（正常）审限内结案率
          'workEfficiency-zb003002': {
            name: '统计周期',
            zb003002: '法定（正常）审限内结案率',
            d001005: '法定审限内结案数', // todo 法定审限内结案案件数
            d001002: '各类案件结案数（期限内结案数）'
          },
          // 办案效率-超审限案件数
          'workEfficiency-zb003003': {
            name: '统计周期',
            zb003003: '超审限案件数'
          },
          // 办案效率-平均审理时间指数
          'workEfficiency-zb003007': {
            name: '统计周期',
            zb003007: '平均审理时间指数',
            d001015: '审理时间指数',
            d001008: '一审结案数',
            d001010: '二审结案数',
            d001011: '再审案件结案数（排除抗）',
            d001012: '执行案件结案数',
            d001013: '一审简易程序结案数',
            d001014: '不计审限结案数（一审、二审、再审）'
          },
          // 办案效率-长期未结诉讼案件和久押未决案件数
          'workEfficiency-zb003010': {
            name: '统计周期',
            zb003010: '长期未结诉讼案件和久押未决案件数',
            d001022: '长期未结诉讼案件数',
            d001023: '久押未决案件数'
          },
          // 办案效果-调撤率
          'workEffect-zb004001': {
            name: '统计周期',
            zb004001: '调撤率',
            d001007: '调解、和解和撤诉案件数',
            d001035: '可调结案案件数'
          },
          // 办案效果-一审服判息诉率
          'workEffect-zb004002': {
            name: '统计周期',
            zb004002: '一审服判息诉率',
            d001009: '上诉案件收案数',
            d001008: '一审结案数'
          },
          // 司法公开-庭审直播率
          'judicialOpen-zb005004': {
            name: '统计周期',
            zb005004: '庭审直播率',
            m1049: '庭审直播数',
            m1050: '排期开庭数',
            m1051: '不公开庭审数'
          },
          // 司法公开-文书上网率
          'judicialOpen-zb005002': {
            name: '统计周期',
            zb005002: '文书上网率',
            m1045: '公开文书数',
            d001002: '结案案件数',
            m1046: '调解案件数',
            m1047: '离婚纠纷案件数',
            m1048: '涉未成年人案件数'
          }
        },
        type: 'year',
        params: {
          indexId: ''
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
        targetMap: {},
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
        targetOpt: [],
        tabId: ''
      }
    },
    computed: {},
    mounted() {
      if (this.active === this.page) {
        this.getTargetOpt()
      }
    },
    methods: {
      countPeg, currentChange, sizeChange, searchByKeyword, downloadTable, getMonthTotal, refreshCondition,
      getYearTotal, refreshAll, getColumns, changeCols, getTargetOpt, sortByNum, getWidth
    },
    watch: {
      active(val, oldVal) {
        if (val === this.page) {
          this.getTargetOpt()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
