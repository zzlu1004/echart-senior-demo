<template>
  <div class="center-container2">
    <el-row>
      <el-col :span="9" class="pr2">
        <fd-panel :title="['学历专业分布']" class="">
          <div slot="panel-1" class="p2 center-height">
            <div style="height: 210px;overflow: hidden">
              <fd-echart-table
                :echartOption="educationSun"
                echartHeight="180px"
                :tableOption="educationData"
              ></fd-echart-table>
            </div>
            <fd-echart :option="wordCloudOpt" height="118px" style="width: 100%"></fd-echart>
          </div>
        </fd-panel>
      </el-col>
      <el-col :span="5" class="pr2">
        <fd-panel :title="['性别分布']" class="">
          <div slot="panel-1" class="p2 center-height">
            <fd-echart :option = sexRate height="320px" ></fd-echart>
          </div>
        </fd-panel>
      </el-col>
      <el-col :span="10">
        <fd-panel :title="['年龄结构分布及预测']" class="">
          <div slot="panel-1" class="p2 center-height">
            <age-forecast :data="ageData" width="500" height="300"></age-forecast>
          </div>
        </fd-panel>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import FdPanel from 'fd/panel/panel'
  import FdEchart from 'fd/echarts/src/echarts-tool'
  import { getEducationData, sexRate, getSexRate, getAgeData, wordCloudOpt } from '@/api/kpi/leaderWork/teamGeneral'
  import FdEchartTable from '../../components/homeCom/echartTable'
  import AgeForecast from '../../components/ageForecast'
  export default {
    name: 'showCenter',
    components: { AgeForecast, FdEchartTable, FdPanel, FdEchart },
    data() {
      return {
        sexRate,
        ageData: [],
        wordCloudOpt,
        educationSun: {
          type: 'pie',
          chart: {},
          chartOption: {},
          data: [],
          opt: {
            tooltip: {
              trigger: 'item'
            },
            series: {
              radius: ['50%', '80%'],
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              }
            },
            legend: {
              show: false
            }
          }
        },
        educationData: {
          stripe: false,
          data: [],
          columns: [
            {
              field: 'name',
              title: '学历',
              formatter: (row, value) => {
                return '<span class="circle-dot mr1" style="background-color:' + row.color + '"></span>' + value
              }
            },
            {
              field: 'value',
              title: '人数',
              align: 'right',
              formatter: (row, value) => {
                return value
              }
            },
            {
              field: 'rate',
              title: '占比',
              align: 'right',
              formatter: (row, value) => {
                return `${value}%`
              }
            }
          ]
        }
      }
    },
    mounted() {
      this.getEducationData()
      this.getSexRate()
      this.getAgeData()
    },
    methods: {
      getEducationData,
      getSexRate,
      getAgeData
    }
  }
</script>

<style lang="scss" >
  .righ-container .el-table__empty-block {
    min-height:60px!important;
  }
  .center-container2 {
    margin-top: 8px;
    width: 100%;
    height: 400px;
    center-container2 .container-chart {
      width: 100%;
      height: 370px;
    }
  }
  .center-container2 .center-height{
    width: 100%;
    height: 352px;
  }
</style>
