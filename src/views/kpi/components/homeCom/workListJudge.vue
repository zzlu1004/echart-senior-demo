<template>
  <div>
    <div>
      <el-row :gutter="8">
        <el-col :span="8">
          <div class="color-title bold mb1">结案率</div>
          <div class="color-title bold">
            <span class="h26">{{judgeCaseRateObj.closeRate}}</span>
            <span>% </span>
          </div>
          <div class="mt1">
            <el-row>
              <el-col :span="24">
                <div class="inline-block">
                  <span class="sub-panel h12">同比</span>
                  <span v-if="parseFloat(judgeCaseRateObj.closeRateYoy) === 0" class="h16 bold pl1">{{judgeCaseRateObj.closeRateYoy}}</span>
                  <span v-else-if="parseFloat(judgeCaseRateObj.closeRateYoy) > 0" class="color-up h16 bold pl1">+{{judgeCaseRateObj.closeRateYoy}}%</span>
                  <span v-else-if="parseFloat(judgeCaseRateObj.closeRateYoy) < 0" class="color-down h16 bold pl1">{{judgeCaseRateObj.closeRateYoy}}%</span>
                  <span v-else class="h16 bold pl1 color-title">--</span>
                </div>
                <div class="inline-block ml2">
                  <span class="sub-panel h12">部门均值</span>
                  <span class="color-title bold pl1">
                    <span>{{thousands(judgeCaseRateObj.departAvgCloseRate)}}</span>
                  </span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="color-title bold mb1">法定审限内结案率</div>
          <div class="color-title bold">
            <span class="h26">{{judgeCaseRateObj.legalCloseRate}}</span>
            <span>% </span>
          </div>
          <div class="mt1">
            <el-row>
              <el-col :span="24">
                <div class="inline-block">
                  <span class="sub-panel h12">同比</span>
                  <span v-if="parseFloat(judgeCaseRateObj.legalCloseRateYoy) === 0" class="h16 bold pl1">{{judgeCaseRateObj.legalCloseRateYoy}}</span>
                  <span v-else-if="parseFloat(judgeCaseRateObj.legalCloseRateYoy) > 0" class="color-up h16 bold pl1">+{{judgeCaseRateObj.legalCloseRateYoy}}%</span>
                  <span v-else-if="parseFloat(judgeCaseRateObj.legalCloseRateYoy) < 0" class="color-down h16 bold pl1">{{judgeCaseRateObj.legalCloseRateYoy}}%</span>
                  <span v-else class="h16 bold pl1 color-title">--</span>
                </div>
                <div class="inline-block ml2">
                  <span class="sub-panel h12">部门均值</span>
                  <span class="color-title bold pl1">{{thousands(judgeCaseRateObj.departAvgLegalCloseRate)}}</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="color-title bold mb1">超审限案件数</div>
          <div class="color-title bold">
            <span class="h26">{{thousands(judgeCaseRateObj.overLimitCaseCount)}}</span>
            <span>件</span>
          </div>
          <div class="mt1">
            <el-row>
              <el-col :span="24">
                <div class="inline-block">
                  <span class="sub-panel h12">同比</span>
                  <span v-if="judgeCaseRateObj.overLimitCaseCountYoy === 0" class="h16 bold pl1">{{judgeCaseRateObj.overLimitCaseCountYoy}}</span>
                  <span v-if="judgeCaseRateObj.overLimitCaseCountYoy > 0" class="color-up h16 bold pl1">+{{judgeCaseRateObj.overLimitCaseCountYoy}}%</span>
                  <span v-else-if="judgeCaseRateObj.overLimitCaseCountYoy < 0" class="color-down h16 bold pl1">{{judgeCaseRateObj.overLimitCaseCountYoy}}%</span>
                  <span v-else class="h16 bold pl1 color-title">--</span>
                </div>
                <div class="inline-block ml2">
                  <span class="sub-panel h12">部门均值</span>
                  <span class="color-title bold pl1">{{thousands(judgeCaseRateObj.departAvgOverLimitCaseCount)}}</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <echart-table class="mt3"
      :echartOption="judgeCaseRateOpt"
      :tableOption="judgeCaseRateOption"
      echartHeight="217px"
      echartTitle="办理案件案由分布"></echart-table>
  </div>
</template>

<script>
  import { getWorkList } from '@/api/kpi/homeNew'
  import { thousands } from '@/utils/filters'
  import echartTable from './echartTable.vue'
  import { noString } from '@/utils/filters'
  export default {
    name: 'workListJudge',
    components: {
      echartTable
    },
    props: {},
    data() {
      return {
        type: 'judge',
        judgeCenterHtml: '',
        judgeCaseRateObj: {},
        judgeCaseRateOpt: {
          data: [],
          type: 'pie',
          chartOption: {},
          chart: null,
          opt: {
            legend: {
              show: false
            },
            tooltip: {
              trigger: 'item',
              formatter: (param) => {
                return `${param.marker}${param.name}：</br>案件数${param.value}件</br>占比${param.data.rates}%`
              }
            },
            title: {
              text: '',
              left: 'center',
              top: 'middle',
              textStyle: {
                rich: {
                  a: {
                    color: '#404040',
                    fontSize: 14,
                    fontWeight: 700,
                    height: 25
                  },
                  b: {
                    color: '#404040',
                    fontSize: 30,
                    fontWeight: 700
                  }
                }
              }
            },
            series: {
              radius: ['60%', '90%'],
              center: ['50%', '45%'],
              itemStyle: {
                borderWidth: 1,
                borderColor: '#fff'
              },
              label: {
                normal: {
                  show: false
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              }
            }
          }
        },
        judgeCaseRateOption: {
          stripe: false,
          data: [],
          columns: [
            {
              field: 'name',
              title: '案由名称',
              formatter: (row, value) => {
                return '<span class="circle-dot mr1" style="background-color:' + row.color + '"></span>' + noString(value)
              }
            },
            {
              field: 'rates',
              title: '占比',
              align: 'right',
              formatter: (row, value) => {
                return `${noString(value)}%`
              }
            },
            {
              field: 'counts',
              title: '案件数',
              align: 'right',
              formatter: (row, value) => {
                return noString(value)
              }
            }
          ]
        }
      }
    },
    computed: {
    },
    mounted() {
      this.getWorkList()
    },
    methods: {
      getWorkList, thousands, noString
    },
    watch: {
    }
  }
</script>

<style lang="scss">
.h26{
  font-size: 26px;
}
.circle-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #999;
  vertical-align: 1px;
}
</style>
