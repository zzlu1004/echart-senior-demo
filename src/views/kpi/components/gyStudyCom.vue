<template>
  <div>
    <div class="clearfix mb2">
      <div>
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
          <el-button class="ml2" type="primary" size="small" @click="refreshAll">查询</el-button>
        </div>
    </div>
    <div>
      <el-row>
        <el-col :span="6">
          <div class="bd mr2">
            <div class="bd-bottom bg-gray color-title h16 px2 height-title bold">
              <el-tooltip :open-delay='300' class="item" effect="dark" :content="(companyName+'汇总' || '--')" placement="top-start">
                <div class="dot-hidden">
                  {{companyName + '汇总' || '--'}}
                </div>
              </el-tooltip>
            </div>
            <div class="p2 min-height-300">
              <div class="pt3 pb2 clearfix">
                <span class="f-left">全院人数</span>
                <span class="f-right bold h24">{{courtObj.count || 0}}</span>
              </div>
              <div class="pt3 pb2 clearfix">
                <span class="f-left">{{pageMap[page]}}人数</span>
                <span class="f-right bold h24">{{courtObj.value || 0}}</span>
              </div>
              <div class="pt3 pb2 clearfix">
                <span class="f-left">{{pageMap[page]}}占比</span>
                <span class="f-right bold h24">{{fd.data.saveFloat(courtObj.rate, 2)}}%</span>
              </div>
              <div class="pt3 pb2 clearfix">
                <span class="f-left">{{pageMap[page]}}人次</span>
                <span class="f-right bold h24">{{courtObj.yoy}}</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col v-if="elements.depart" :span="18">
          <div class="bd">
            <div class="bd-bottom bg-gray color-title h16 px2 height-title bold">
              各部门{{pageMap[page]}}对比
            </div>
            <div>
              <fd-echart height="300px" :option="vbarOpt"></fd-echart>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="relative">
      <div class="mt2 tab-box tab-box-mar">
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
                <fd-table :option="departOpt"
                          ref="departOpt"
                          @cellClick="countPeg" :isRefresh="isRefresh"
                          :sortChange="sortByNum1" :sortable=true
                          :defaultSort="{prop:'yoy', order:'descending'}"></fd-table>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="elements.person" label="个人" name="person">
            <div v-show="elements.person && type==='person'" >
              <div class="clearfix py2 table-search">
                <span class="f-right btn btn-default btn-sm" @click="downloadTable">
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
                <fd-table :option="personOpt"
                          ref="personOpt"
                          @cellClick="countPeg" :sortChange="sortByNum2" :sortable=true
                          :defaultSort="{prop:'total', order:'descending'}"></fd-table>
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
</template>

<script>
  import fdEchart from 'fd/echarts/echarts'
  import fdTable from 'fd/table'
  import FdPagination from 'fd/pagination/pagination'
  import { countPeg, searchByKeyword, downloadTable, toStartDate, toLocaleDate, sizeChange,
    getPersonTotal, getDepartTotal, getEcharts, refreshAll, currentChange, getColumns,
    getDepartData, getAll, sortByNum1, sortByNum2, refreshCondition } from '@/api/kpi/newRecord/study/gyTrain'
  export default {
    name: 'studyCom',
    components: {
      fdTable, fdEchart, FdPagination
    },
    props: {
      page: {
        type: String,
        default: ''
      },
      elements: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        departData: [],
        companyName: this.$store.getters.user.companyName,
        isRefresh: false,
        courtObj: {},
        pageSize: 10,
        total: 0,
        typeMap: {
          'depart': '部门',
          'person': '个人'
        },
        pageMap: {
          'train': '调训培训',
          'cadrePartTime': '干部兼职',
          'reward': '表彰奖励',
          'judgeTrain': '参加培训'
        },
        type: 'depart',
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
        val: '',
        val2: '',
        vbarOpt: {
          data: [], // 生成图标的数据
          type: 'mix', // 图标类型
          dataZoom: true,
          types: [{ type: 'vbar', key: 'count' }, { type: 'vbar', key: 'value' }, { type: 'line', key: 'yoy' }],
          chartOption: {}, // 全量的默认配置
          chart: null, // echart.init后生成的echart对象
          opt: {
            legend: {
              top: '15',
              right: '50',
              left: 'auto'
            },
            tooltip: {
              formatter: (param) => {
                let html = ''
                const rate = parseFloat(param[0].value) ? this.fd.data.saveFloat((param[1].value / param[0].value) * 100, 2) + '%' : '--'
                param.forEach((item, i) => {
                  if (i === 1) {
                    html += item.marker + item.seriesName + '：' + item.value + '人/占比' + rate + '<br/>'
                  } else if (i === 2) {
                    html += item.marker + item.seriesName + '：' + item.value + '人次<br/>'
                  } else {
                    html += item.marker + item.seriesName + '：' + item.value + '人<br/>'
                  }
                })
                return html
              }
            },
            grid: {
              top: '55',
              bottom: 40,
              right: '10'
            },
            yAxis: [{
              name: '人数',
              type: 'value'
            }, {
              name: '人次',
              type: 'value'
            }],
            xAxis: {
              axisLabel: {
                rotate: 0
              }
            },
            series: []
          }
        },
        columsObj: {
          'depart': {},
          'person': {
            departName: '部门',
            name: '姓名',
            total: '合计'
          }
        },
        departOpt: {
          stripe: true,
          border: true,
          data: [],
          columns: []
        },
        personOpt: {
          stripe: true,
          border: true,
          data: [],
          columns: []
        },
        pickerOptionsStart: {},
        pickerOptionsEnd: {},
        fileName: ''
      }
    },
    computed: {},
    mounted() {
      this.vbarOpt.opt.series = [
        { type: 'bar', name: '部门总人数', stack: '1' },
        { type: 'bar', name: this.pageMap[this.page] + '人数', stack: '1' },
        { type: 'line', name: this.pageMap[this.page] + '人次', yAxisIndex: 1 }
      ]
      // 如果没有给这个用户配置部门权限，则默认页是个人
      if (this.elements.depart) {
        this.type = 'depart'
      } else if (this.elements.person) {
        this.type = 'person'
      }
      this.columsObj.depart = {
        name: '部门',
        count: '部门人数',
        value: this.pageMap[this.page] + '人数',
        rate: this.pageMap[this.page] + '占比',
        yoy: '总人次'
      }
      // this.getDepartData() // 获取部门下拉框
      this.getAll()
    },
    methods: {
      countPeg, searchByKeyword, downloadTable, toStartDate, toLocaleDate, sizeChange,
      getPersonTotal, getDepartTotal, getEcharts, refreshAll, currentChange,
      getColumns, getAll, sortByNum1, sortByNum2, getDepartData, refreshCondition
    },
    watch: {
    }
  }
</script>

<style lang="scss" scoped>
 .tab-box{
   top:0;
   left:0;
 }
 .width-150px{
   width: 150px;
 }
.min-height-300 {
  min-height:300px;
}
</style>
