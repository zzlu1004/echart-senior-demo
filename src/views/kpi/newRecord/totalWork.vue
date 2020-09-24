<template>
  <div>
    <div class="px3 case-menus-tab bg-white">
      <div v-if="elements.writing || elements.ruleSystem ||
        elements.specialWork || elements.workSummary ||elements.researchReport ||
        elements.runMeeting || elements.typeOther" class=" relative menu-panel">
        <el-menu :default-active="page"
                 @select="choosePage"
                 class="absolute"
                 mode="horizontal"
                 text-color="#666"
                 active-text-color="#1b95e7">
          <el-menu-item v-if="elements.writing" index="writing">办文汇总</el-menu-item>
          <el-menu-item v-if="elements.ruleSystem" index="ruleSystem">规章制度</el-menu-item>
          <el-menu-item v-if="elements.specialWork" index="specialWork">专项工作</el-menu-item>
          <el-menu-item v-if="elements.workSummary" index="workSummary">工作总结</el-menu-item>
          <el-menu-item v-if="elements.researchReport" index="researchReport">调研报告</el-menu-item>
          <el-menu-item v-if="elements.runMeeting" index="runMeeting">会议材料</el-menu-item>
          <el-menu-item v-if="elements.typeOther" index="typeOther">其他</el-menu-item>
        </el-menu>
        <div class="time-panel f-right">
          <span v-if="$store.getters.globals.isIE">
            <el-date-picker
              type="date"
              value-format="yyyy-MM-dd"
              size="small"
              v-model="params.startTime"
              :clearable=false
              class="mr1"></el-date-picker>
              -
            <el-date-picker
            type="date"
            size="small"
            value-format="yyyy-MM-dd"
            v-model="params.endTime"
            :clearable=false
            class="ml1"
          ></el-date-picker>
          </span>
          <span v-else>
            <el-date-picker
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              size="small"
              v-model="params.startTime"
              :clearable=false
              class="mr1"></el-date-picker>
              -
            <el-date-picker
            type="date"
            size="small"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            v-model="params.endTime"
            :clearable=false
            class="ml1"
          ></el-date-picker>
          </span>
          <el-button class="ml3" type="primary" size="small" @click="refreshAll">查询</el-button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <div class="container-inner bg-white total-work" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
        <div v-show="elements.writing && page === 'writing'">
          <div>
            <el-row>
              <el-col :span="6">
                <div class="bd mr2">
                  <div class="bd-bottom bg-gray color-title h16 px2 bold record-analyze-title">
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
                    <div class="mb4 level-title">
                      <span class="f-left">已办收文</span>
                      <span class="f-right bold h24">{{courtObj.recDoc || 0}}</span>
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
                        <el-radio-button label="ready">已办收发文</el-radio-button>
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
            <div class="tab-box-mar tab-box mt2">
              <el-tabs v-if="elements.depart || elements.person" v-model="type" type="card">
                <el-tab-pane v-if="elements.depart" label="部门" name="depart">
                  <div v-show="elements.depart && type==='depart'">
                    <div class="clearfix py2 table-search">
                      <span class="f-right btn btn-default btn-sm" @click="downloadTable">
                          <i class="at icon-download"/>
                          下载
                      </span>
                      <span class="f-right mr3">
                        <fd-search v-if="page === 'writing' && type==='depart'" @search="searchByKeyword" v-model="val"></fd-search>
                      </span>
                    </div>
                    <div>
                      <fd-table :option="departOpt" @cellClick="countPeg" :isRefresh="isRefresh"
                                :defaultSort="{prop:'allDoc', order:'descending'}"
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
                      <span class="f-right mr3">
                        <fd-search v-if="page === 'writing' && type === 'person'" @search="searchByKeyword" v-model="val2"></fd-search>
                      </span>
                    </div>
                    <div>
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
        <rule-system
          v-show="elements.ruleSystem && page === 'ruleSystem'"
          page="ruleSystem"
          :active="page"
          :isNew="isNew"
          :timeRange="timeRange"
          :elements="elements"></rule-system>
        <rule-system
          v-show="elements.specialWork && page === 'specialWork'"
          page="specialWork"
          :active="page"
          :isNew="isNew"
          :timeRange="timeRange"
          :elements="elements"></rule-system>
        <rule-system
          v-show="elements.workSummary && page === 'workSummary'"
          page="workSummary"
          :active="page"
          :isNew="isNew"
          :timeRange="timeRange"
          :elements="elements"></rule-system>
        <rule-system
          v-show="elements.researchReport && page === 'researchReport'"
          page="researchReport"
          :active="page"
          :isNew="isNew"
          :timeRange="timeRange"
          :elements="elements"></rule-system>
        <rule-system
          v-show="elements.runMeeting && page === 'runMeeting'"
          page="runMeeting"
          :active="page"
          :isNew="isNew"
          :timeRange="timeRange"
          :elements="elements"></rule-system>
        <rule-system
          v-show="elements.typeOther && page === 'typeOther'"
          page="typeOther"
          :active="page"
          :isNew="isNew"
          :timeRange="timeRange"
          :elements="elements"></rule-system>
      </div>
    </div>
  </div>
</template>

<script>
  import fdTable from 'fd/table'
  import fdEchart from 'fd/echarts/echarts'
  import FdPagination from 'fd/pagination/pagination'
  import ruleSystem from '../components/totalWorkCom/ruleSystem.vue'
  import { choosePage, refreshAll, searchByKeyword,
    downloadTable, countPeg, currentChange, sizeChange, getPersonTotal, getDepartTotal,
    toLocaleDate, toStartDate, sortByNum1, sortByNum2, refreshCondition, getVbarData, getCourtTotal } from '@/api/kpi/newRecord/totalWork'
  export default {
    name: 'totalWork',
    components: {
      fdTable, FdPagination, ruleSystem, fdEchart
    },
    props: {},
    data() {
      return {
        courtObj: {},
        companyName: this.$store.getters.user.companyName,
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
        page: 'writing',
        isRefresh: false,
        isNew: false,
        timeRange: {}, // 时间选择对象，从父组件传递给子组件
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
          startTime: this.toStartDate(new Date(this.fd.tools.getNowTime())),
          endTime: this.toLocaleDate(new Date(this.fd.tools.getNowTime()))
        },
        departParams: {
          type: 'depart',
          keyword: '',
          orderField: '',
          orderType: ''
        },
        personParams: {
          type: 'person',
          keyword: '',
          orderField: '',
          orderType: '',
          offset: 0,
          limit: 10
        },
        pickerOptionsStart: {},
        pickerOptionsEnd: {},
        type: 'depart',
        typeEchart: 'total',
        pageSize: 10,
        total: 0,
        val: '',
        val2: '',
        fileName: '',
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
              sortable: 'custom',
              formatter: (row, value) => {
                return value || '--'
              }
            },
            {
              field: 'allDoc',
              title: '发文总数',
              align: 'right',
              formatter: (row, value) => {
                return this.elements.writingPeg ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              sortable: 'custom'
            },
            {
              field: 'sendDoc',
              title: '已办发文',
              align: 'right',
              formatter: (row, value) => {
                return this.elements.writingPeg ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              sortable: 'custom'
            },
            {
              field: 'recDoc',
              title: '已办收文',
              align: 'right',
              formatter: (row, value) => {
                return this.elements.writingPeg ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              sortable: 'custom'
            }
          ]
        },
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
                return this.elements.writingPeg ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              sortable: 'custom'
            },
            {
              field: 'sendDoc',
              title: '已办发文',
              align: 'right',
              formatter: (row, value) => {
                return this.elements.writingPeg ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              sortable: 'custom'
            },
            {
              field: 'recDoc',
              title: '已办收文',
              align: 'right',
              formatter: (row, value) => {
                return this.elements.writingPeg ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              sortable: 'custom'
            }
          ]
        }
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.totalWork || {}
      }
    },
    mounted() {
      // 7中分类权限
      if (this.elements.writing) {
        this.page = 'writing'
      } else if (this.elements.ruleSystem) {
        this.page = 'ruleSystem'
      } else if (this.elements.specialWork) {
        this.page = 'specialWork'
      } else if (this.elements.workSummary) {
        this.page = 'workSummary'
      } else if (this.elements.researchReport) {
        this.page = 'researchReport'
      } else if (this.elements.runMeeting) {
        this.page = 'runMeeting'
      } else if (this.elements.typeOther) {
        this.page = 'typeOther'
      }
      // 进入页面判断当前active页面
      this.getCourtTotal()
      this.getVbarData()
      // 如果没有给这个用户配置部门权限，则默认页是个人
      if (this.elements.depart) {
        this.type = 'depart'
      } else if (this.elements.person) {
        this.type = 'person'
      }
      // 刚进页面，默认把当前选中的时间赋值给timeRange，双向绑定六个分类的子组件
      this.$set(this.timeRange, 'startTime', this.params.startTime)
      this.$set(this.timeRange, 'endTime', this.params.endTime)
    },
    methods: {
      choosePage, refreshAll, searchByKeyword, refreshCondition,
      downloadTable, countPeg, currentChange, sizeChange, getPersonTotal, getDepartTotal,
      toLocaleDate, toStartDate, sortByNum1, sortByNum2, getCourtTotal, getVbarData,
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
      },
      page(val) {
        if (val === 'writing') {
          this.getDepartTotal()
          this.getPersonTotal()
          this.getCourtTotal()
          this.getVbarData()
        }
      }
    }
  }
</script>
<style>
  .record-analyze-title{
    height: 40px;
    line-height: 40px;
    font-weight: bold;
    font-size: 16px;
    padding: 0 16px;
  }
  .record-analyze-title .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: white!important;
  }
  .record-analyze-title .el-radio-button--small .el-radio-button__inner {
    padding: 4px 15px!important;
  }
  .record-analyze-title .el-radio-button__inner {
    background: #f6f6f6!important;
  }
</style>
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
