<template>
  <div>
    <div>
      <el-row>
        <el-col :span="6">
          <div class="bd mr2">
            <div class="bd-bottom bg-gray color-title h16 px2 height-title bold">
              <el-tooltip :open-delay='300' class="item" :content="companyName || '--'" effect="dark" placement="top-start">
                <div class="dot-hidden">
                  {{companyName || '--'}}
                </div>
              </el-tooltip>
            </div>
            <div class="px2 pt2 min-height-div">
              <div class="mt2 mb4 level-title">
                <span class="f-left">全院人数</span>
                <span class="f-right bold h24">{{courtObj.total || 0}}</span>
              </div>
              <div class="mb4 level-title">
                <span class="f-left">发文总数</span>
                <span class="f-right bold h24">{{courtObj.allDoc || 0}}</span>
              </div>
              <div class="mb4 level-title">
                <span class="f-left">已办发文</span>
                <span class="f-right bold h24">{{courtObj.sendDoc || 0}}</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="18" v-if="elements.depart">
          <div class="bd">
            <div class="record-analyze-title bd-bottom bg-gray">
              <span class="color-title bold">各部门对比</span>
              <div class="f-right">
                <el-radio-group v-model="typeEchart" size="small" @change="typeChange">
                  <el-radio-button label="total">发文总数</el-radio-button>
                  <el-radio-button label="ready">已办发文</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div>
              <div v-show="typeEchart === 'total'">
                <div class="px2 pt1 min-height-div">
                  <fd-echart :option="vbarOpt" height="312px"></fd-echart>
                </div>
              </div>
              <div v-show="typeEchart==='ready'">
                <div class="px2 pt1 min-height-div">
                  <fd-echart :option="vbarOptTotal" height="312px"></fd-echart>
                </div>
              </div>
            </div>
          </div>
          <!--<div class="bd">-->
          <!--<div class="bd-bottom bg-gray color-title h16 px2 height-title bold">-->
          <!--各部门对比-->
          <!--</div>-->
          <!--<div class="px2 pt1 min-height-div">-->
          <!--<fd-echart :option="vbarOpt" height="312px"></fd-echart>-->
          <!--</div>-->
          <!--</div>-->
        </el-col>
      </el-row>
    </div>
    <div class="relative">
      <div class="tab-box tab-box-mar mt2">
        <el-tabs v-if="elements.depart || elements.person" v-model="type" type="card">
          <el-tab-pane v-if="elements.depart" label="部门" name="depart">
            <div v-show="elements.depart && type==='depart'">
              <div class="clearfix py2 table-search">
                <span class="f-right btn btn-default btn-sm" @click="downloadTable">
                  <i class="at icon-download"/>
                    下载
                </span>
                <span v-if="active === page" class="f-right mr3">
                  <fd-search @search="searchByKeyword"
                             v-model="val"></fd-search>
                </span>
              </div>
              <div v-if="active === page">
                <fd-table :option="departOpt" :defaultSort="{prop:'allDoc', order:'descending'}"
                          @cellClick="countPeg" :isRefresh="isRefresh"
                          :sortChange="sortByNum1" :sortable=true ref="departOpt"></fd-table>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="elements.person" label="个人" name="person">
            <div v-show="elements.person && type === 'person'">
              <div class="clearfix py2 table-search">
                <span class="f-right btn btn-default btn-sm" @click="downloadTable">
                  <i class="at icon-download"/>
                    下载
                </span>
                <span v-if="active === page" class="f-right mr3">
                  <fd-search @search="searchByKeyword"
                             v-model="val2"></fd-search>
                </span>
              </div>
              <div v-if="active === page">
                <fd-table :option="personOpt" :defaultSort="{prop:'allDoc', order:'descending'}"
                          @cellClick="countPeg" :sortChange="sortByNum2" :sortable=true ref="personOpt"></fd-table>
              </div>
              <fd-pagination
                :limit="personParams.limit"
                :offset="personParams.offset"
                :total="total"
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
  </div>
</template>

<script>
  import fdEchart from 'fd/echarts/echarts'
  import fdTable from 'fd/table'
  import FdPagination from 'fd/pagination/pagination'
  import { searchByKeyword, currentChange, sizeChange, toLocaleDate, toStartDate } from '@/api/kpi/newRecord/totalWork'
  import { refreshAll, downloadTable, getVbarData, countPeg, getPersonTotal, getDepartTotal, refreshCondition, getCourtTotal,
    sortByNum1, sortByNum2 } from '@/api/kpi/newRecord/ruleSystem'
  export default {
    name: 'ruleSystem',
    components: {
      fdTable, FdPagination, fdEchart
    },
    props: {
      page: {
        type: String,
        default: ''
      },
      active: {
        type: String,
        default: ''
      },
      elements: {
        type: Object
      },
      isNew: {
        type: Boolean
      },
      timeRange: {
        type: Object
      }
    },
    data() {
      return {
        companyName: this.$store.getters.user.companyName,
        courtObj: {},
        vbarOptTotal: {
          data: [], // 生成图标的数据
          type: 'vbar', // 图标类型
          dataZoom: true, // 显示拖动
          chartOption: {}, // 全量的默认配置
          chart: null, // echart.init后生成的echart对象
          opt: {
            legend: {
              top: 0,
              left: 'auto',
              right: 24
            },
            grid: {
              bottom: '40' // 下边会有拖动轴
            }
          }
        },
        vbarOpt: {
          data: [], // 生成图标的数据
          type: 'vbar', // 图标类型
          dataZoom: true, // 显示拖动
          chartOption: {}, // 全量的默认配置
          chart: null, // echart.init后生成的echart对象
          opt: {
            legend: {
              top: 0,
              left: 'auto',
              right: 24
            },
            grid: {
              bottom: '40' // 下边会有拖动轴
            }
          }
        },
        isRefresh: false,
        pageMap: {
          'writing': '办文汇总',
          'ruleSystem': '规章制度',
          'specialWork': '专项工作',
          'workSummary': '工作总结',
          'researchReport': '调研报告',
          'runMeeting': '会议材料',
          'typeOther': '其他'
        },
        typeMap: {
          'depart': '部门',
          'person': '个人'
        },
        params: {
          jobType: ''
        },
        departParams: {
          type: 'depart',
          keyword: ''
        },
        personParams: {
          type: 'person',
          keyword: '',
          offset: 0,
          limit: 10
        },
        type: 'depart',
        typeEchart: 'total',
        pageSize: 10,
        total: 0,
        val: '',
        val2: '',
        fileName: '',
        // 个人表头
        personOpt: {
          stripe: true,
          border: true,
          data: [],
          columns: [
            {
              field: 'departName',
              title: '部门',
              sortable: 'custom',
              formatter: (row, value) => {
                return value || '--'
              }
            },
            {
              field: 'name',
              title: '姓名',
              formatter: (row, value) => {
                // 合计显示‘--’ todo
                return value || '--'
              },
              sortable: 'custom'
            },
            {
              field: 'allDoc',
              title: '发文总数',
              align: 'right',
              formatter: (row, value) => {
                return this.elements[this.page + 'Peg'] ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              sortable: 'custom'
            },
            {
              field: 'sendDoc',
              title: '已办发文',
              align: 'right',
              formatter: (row, value) => {
                return this.elements[this.page + 'Peg'] ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              sortable: 'custom'
            }
          ]
        },
        // 部门表头
        departOpt: {
          stripe: true,
          border: true,
          data: [],
          columns: [
            {
              field: 'departName',
              title: '部门',
              sortable: 'custom',
              formatter: (row, value) => {
                return value || '--'
              }
            },
            {
              field: 'staffCount',
              title: '部门人数',
              align: 'right',
              minWidth: this.fd.tools.getStringWidth('部门人数'),
              sortable: 'custom'
            },
            {
              field: 'allDoc',
              title: '发文总数',
              align: 'right',
              formatter: (row, value) => {
                return this.elements[this.page + 'Peg'] ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              sortable: 'custom'
            },
            {
              field: 'sendDoc',
              title: '已办发文',
              align: 'right',
              formatter: (row, value) => {
                return this.elements[this.page + 'Peg'] ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              sortable: 'custom'
            }
          ]
        }
      }
    },
    computed: {},
    mounted() {
      this.params = this.fd.tools.merge(true, {}, this.timeRange, this.params)
      this.params.jobType = this.page
      // 默認排序自动调接口
      // 进入页面判断当前active页面
      if (this.page === this.active) {
        this.getCourtTotal()
        this.getVbarData()
      }
      // 如果没有给这个用户配置部门权限，则默认页是部门
      if (this.elements.depart) {
        this.type = 'depart'
      } else if (this.elements.person) {
        this.type = 'person'
      }
    },
    methods: {
      refreshAll, searchByKeyword, downloadTable, countPeg, currentChange, sizeChange,
      getPersonTotal, getDepartTotal, toLocaleDate, toStartDate, refreshCondition, sortByNum1, sortByNum2, getCourtTotal, getVbarData,
      typeChange() {
        this.vbarOptTotal.chart.resize()
        this.vbarOpt.chart.resize()
      }
    },
    watch: {
      isRefresh() {
        this.getCourtTotal()
        this.getVbarData()
      },
      isFirst(val) {
        if (val) {
          this.getCourtTotal()
          this.getVbarData()
        }
      },
      // 先加载6个表格表头，再获取接口数据，不然一次性获取接口太多，以防页面卡顿
      active(val) {
        if (this.page === val) {
          this.params.startTime = this.timeRange.startTime
          this.params.endTime = this.timeRange.endTime
          this.getCourtTotal()
          this.getVbarData()
        }
      },
      isNew() {
        if (this.page === this.active) {
          this.refreshCondition()
          this.params.startTime = this.timeRange.startTime
          this.params.endTime = this.timeRange.endTime
          this.getDepartTotal()
          this.getPersonTotal()
          this.getCourtTotal()
          this.getVbarData()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .total-work {
    .el-tabs__header{
      margin:0;
    }
    .tab-box{
      top: 0px;
      left:0;
    }
    .el-radio-button__inner{
      padding:8px 20px;
    }
    .el-submenu__title i{
      color: #000;
    }
    .menu-panel{
      .el-menu--horizontal>.el-submenu .el-submenu__title, .el-menu--horizontal li.el-menu-item, .el-menu--horizontal li.el-submenu{
        height:40px;
        line-height:40px;
      }
      .el-menu.el-menu--horizontal{
        border-bottom:none;
      }
    }
    .time-panel{
      .el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 150px;
      }
    }
  }
  .width-356px{
    width:356px;
  }
  .min-height-div {
    width: 100%;
    height:320px;
  }
  .width-260px {
    width:260px;
  }
  .level-title{
    height: 28px;
    line-height: 28px;
  }
  .title-hide{
    display: none;
  }
</style>
