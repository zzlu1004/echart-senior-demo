<template>
  <div class="app-container">
    <div class="container-inner bg-white other-work" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div>
        <div>
          <span v-if="$store.getters.globals.isIE">
            <el-date-picker
              type="date"
              size="small"
              value-format="yyyy-MM-dd"
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
              size="small"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
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
        <div class="mt2">
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
                    <span class="f-right bold h24">{{courtOtherObj.count || 0}}</span>
                  </div>
                  <div class="mb4 level-title">
                    <span class="f-left">办公汇总</span>
                    <span class="f-right bold h24">{{courtOtherObj.value || 0}}</span>
                  </div>
                  <div class="mb4 level-title">
                    <span class="f-left">人均办公</span>
                    <span class="f-right bold h24">{{fd.data.saveFloat(courtOtherObj.yoy, 2) || 0.00}}</span>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="18"  v-if="elements.depart">
              <div class="bd">
                <div class="bd-bottom bg-gray color-title h16 px2 height-title bold">
                  各部门对比
                </div>
                <div class="px2 pt1 min-height-div">
                  <fd-echart :option="vbarOtherOpt" height="312px"></fd-echart>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class=" relative">
          <div class="tab-box mt2">
            <el-tabs v-if="elements.depart || elements.person" v-model="type" type="card">
              <el-tab-pane v-if="elements.depart" label="部门" name="depart">
                <div v-show="elements.depart && type==='depart'">
                  <div class="clearfix py2 table-search">
                  <span class="f-right btn btn-default btn-sm" @click="downloadTable">
                    <i class="at icon-download"/>
                    下载
                  </span>
                  <span class="f-right mr3">
                    <fd-search @search="searchByKeyword"
                               v-if="type==='depart'"
                               v-model="val"></fd-search>
                  </span>
                  </div>
                  <div>
                    <fd-table :option="departOpt" @cellClick="countPeg" :isRefresh="isRefresh" :sortable=true
                              :defaultSort="{prop:'total', order:'descending'}"  :sortChange="sortByNum1" ref="departOpt"></fd-table>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane v-if="elements.person" label="个人" name="person">
                <div v-show="elements.person && type === 'person'">
                  <div class="clearfix py2 table-search">
                    <span class="f-right btn btn-default btn-sm" @click="downloadTable('analysis-judge')">
                        <i class="at icon-download"/>
                        下载
                    </span>
                    <span class="f-right mr3">
                      <fd-search @search="searchByKeyword"
                                 v-if="type==='person'"
                                 v-model="val2"></fd-search>
                    </span>
                  </div>
                  <div>
                    <fd-table :option="personOpt" @cellClick="countPeg" :sortChange="sortByNum2" :sortable=true
                              :defaultSort="{prop:'total', order:'descending'}" ref="personOpt"></fd-table>
                  </div>
                  <fd-pagination
                    :limit="personParams.limit"
                    :total="total"
                    :offset="personParams.offset"
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
    </div>
  </div>
</template>

<script>
  import fdEchart from 'fd/echarts/echarts'
  import fdTable from 'fd/table'
  import FdPagination from 'fd/pagination/pagination'
  import { choosePage, refreshAll, searchByKeyword, refreshCondition,
    downloadTable, countPeg, currentChange, sizeChange, getPersonTotal, getDepartTotal,
    toLocaleDate, toStartDate, sortByNum1, sortByNum2, getCourtTotal, getVbarData } from '@/api/kpi/newRecord/otherWork'
  export default {
    name: 'otherWork',
    components: {
      fdTable, FdPagination, fdEchart
    },
    props: {},
    data() {
      return {
        isRefresh: false,
        companyName: this.$store.getters.user.companyName,
        courtOtherObj: {},
        vbarOtherOpt: {
          data: [], // 生成图标的数据
          type: 'mix', // 图标类型
          dataZoom: true,
          types: [{ type: 'vbar', key: 'value' }, { type: 'line', key: 'rate' }],
          chartOption: {}, // 全量的默认配置
          chart: null, // echart.init后生成的echart对象
          opt: {
            legend: {
              top: 0,
              left: 'auto',
              right: 54
            },
            grid: {
              bottom: '40' // 下边会有拖动轴
            },
            yAxis: [{
              name: '',
              type: 'value'
            }, {
              name: '',
              type: 'value'
            }],
            xAxis: {
              axisLabel: {
                rotate: 0
              }
            },
            series: [{
              type: 'bar',
              name: '办公汇总',
              yAxisIndex: 0,
              label: {
                normal: {
                  show: false
                }
              }
            }, {
              type: 'line',
              name: '人均办公',
              yAxisIndex: 1,
              itemStyle: {
                normal: {
                  lineStyle: {
                    width: 2
                  }
                }
              }
            }]
          }
        },
        typeMap: {
          'depart': '部门',
          'person': '个人'
        },
        pageMap: {
          'other': '其他'
        },
        docMap: {
          'noticeCount': 'notice',
          'businessCount': 'business',
          'carCount': 'car',
          'goodsCount': 'goods',
          'workCardCount': 'workCard',
          'judgeTeamCount': 'judgeTeam',
          'personnelCount': 'personnel',
          'proofCount': 'proof',
          'abroadCount': 'abroad',
          'cancelleaveCount': 'cancelleave',
          'leaveCount': 'leave'
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
        page: 'other',
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
              minWidth: this.fd.tools.getStringWidth('部门'),
              formatter: (row, value) => {
                return value || '--'
              }
            },
            {
              field: 'name',
              title: '姓名',
              sortable: 'custom',
              minWidth: this.fd.tools.getStringWidth('姓名'),
              formatter: (row, value) => {
                return value || '--'
              }
            },
            {
              field: 'total',
              title: '汇总',
              align: 'right',
              sortable: 'custom',
              minWidth: this.fd.tools.getStringWidth('汇总')
            },
            {
              field: 'noticeCount',
              title: '通知通告',
              align: 'right',
              sortable: 'custom',
              formatter: (row, value) => {
                return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              minWidth: this.fd.tools.getStringWidth('通知通告')
            },
            {
              field: 'businessCount',
              title: '出差',
              align: 'right',
              sortable: 'custom',
              formatter: (row, value) => {
                return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              minWidth: this.fd.tools.getStringWidth('出差')
            },
            {
              field: 'carCount',
              title: '用车',
              align: 'right',
              sortable: 'custom',
              formatter: (row, value) => {
                return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              minWidth: this.fd.tools.getStringWidth('用车')
            },
            {
              field: 'leaveCount',
              title: '请假',
              align: 'right',
              sortable: 'custom',
              formatter: (row, value) => {
                return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              minWidth: this.fd.tools.getStringWidth('请假')
            },
            {
              field: 'cancelleaveCount',
              title: '销假',
              align: 'right',
              sortable: 'custom',
              formatter: (row, value) => {
                return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              minWidth: this.fd.tools.getStringWidth('销假')
            },
            {
              field: 'workCardCount',
              title: '工作证申请',
              align: 'right',
              sortable: 'custom',
              formatter: (row, value) => {
                return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              minWidth: this.fd.tools.getStringWidth('工作证申请')
            },
            {
              field: 'judgeTeamCount',
              title: '审判团队调整',
              align: 'right',
              sortable: 'custom',
              formatter: (row, value) => {
                return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              minWidth: this.fd.tools.getStringWidth('审判团队调整')
            },
            {
              field: 'personnelCount',
              title: '人事数据查询',
              align: 'right',
              sortable: 'custom',
              formatter: (row, value) => {
                return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              minWidth: this.fd.tools.getStringWidth('人事数据查询')
            },
            {
              field: 'proofCount',
              title: '证明材料申请',
              align: 'right',
              sortable: 'custom',
              formatter: (row, value) => {
                return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              minWidth: this.fd.tools.getStringWidth('证明材料申请')
            },
            {
              field: 'abroadCount',
              title: '出入境查询',
              align: 'right',
              sortable: 'custom',
              formatter: (row, value) => {
                return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              minWidth: this.fd.tools.getStringWidth('出入境查询')
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
              minWidth: this.fd.tools.getStringWidth('部门'),
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
              field: 'total',
              title: '汇总',
              align: 'right',
              sortable: 'custom',
              minWidth: this.fd.tools.getStringWidth('汇总')
            },
            {
              field: 'noticeCount',
              title: '通知通告',
              align: 'right',
              sortable: 'custom',
              formatter: (row, value) => {
                return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              minWidth: this.fd.tools.getStringWidth('通知通告')
            },
            {
              field: 'businessCount',
              title: '出差',
              align: 'right',
              sortable: 'custom',
              formatter: (row, value) => {
                return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              minWidth: this.fd.tools.getStringWidth('出差')
            },
            {
              field: 'carCount',
              title: '用车',
              align: 'right',
              sortable: 'custom',
              formatter: (row, value) => {
                return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              minWidth: this.fd.tools.getStringWidth('用车')
            },
            {
              field: 'leaveCount',
              title: '请假',
              align: 'right',
              sortable: 'custom',
              formatter: (row, value) => {
                return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              minWidth: this.fd.tools.getStringWidth('请假')
            },
            {
              field: 'cancelleaveCount',
              title: '销假',
              align: 'right',
              sortable: 'custom',
              formatter: (row, value) => {
                return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              minWidth: this.fd.tools.getStringWidth('销假')
            },
            {
              field: 'workCardCount',
              title: '工作证申请',
              align: 'right',
              sortable: 'custom',
              formatter: (row, value) => {
                return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              minWidth: this.fd.tools.getStringWidth('工作证申请')
            },
            {
              field: 'judgeTeamCount',
              title: '审判团队调整',
              align: 'right',
              sortable: 'custom',
              formatter: (row, value) => {
                return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              minWidth: this.fd.tools.getStringWidth('审判团队调整')
            },
            {
              field: 'personnelCount',
              title: '人事数据查询',
              align: 'right',
              sortable: 'custom',
              formatter: (row, value) => {
                return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              minWidth: this.fd.tools.getStringWidth('人事数据查询')
            },
            {
              field: 'proofCount',
              title: '证明材料申请',
              align: 'right',
              sortable: 'custom',
              formatter: (row, value) => {
                return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              minWidth: this.fd.tools.getStringWidth('证明材料申请')
            },
            {
              field: 'abroadCount',
              title: '出入境查询',
              align: 'right',
              sortable: 'custom',
              formatter: (row, value) => {
                return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              minWidth: this.fd.tools.getStringWidth('出入境查询')
            }
          ]
        }
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.otherWork || {}
      }
    },
    mounted() {
      this.getVbarData()
      this.getCourtTotal()
      // 如果没有给这个用户配置部门权限，则默认页是个人
      if (this.elements.depart) {
        this.type = 'depart'
      } else if (this.elements.person) {
        this.type = 'person'
      }
      // this.refrehAll()
    },
    methods: {
      choosePage, refreshAll, searchByKeyword, refreshCondition,
      downloadTable, countPeg, currentChange, sizeChange, getPersonTotal, getDepartTotal,
      toLocaleDate, toStartDate, sortByNum1, sortByNum2, getCourtTotal, getVbarData
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
      }
    }
  }
</script>

<style lang="scss">
.other-work {
 .el-tabs__header{
   margin:0;
 }
 .tab-box{
   top: 0px;
   left:0;
 }
}
.width-356px{
  width:356px;
}
.min-height-div {
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
