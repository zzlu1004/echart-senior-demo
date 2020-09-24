<template>
  <div class="center-container">
    <el-row>
      <el-col :span="14" class="pr2">
        <fd-panel :title="['部门人员分布']" class="mb2">
          <div slot="panel-1" class="p2 center-height">
            <fd-echart :option = departPeople height="254px" ></fd-echart>
          </div>
        </fd-panel>
      </el-col>
      <el-col :span="10">
        <div class="container-chart">
          <fd-panel :title="['人员画像']" class="mb2">
            <div slot="panel-1" class="p2 center-height">
              <fd-echart-table
                :echartOption="describeSun"
                echartHeight="254px"
                :tableOption="describeOption"
              ></fd-echart-table>
            </div>
          </fd-panel>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import FdPanel from 'fd/panel/panel'
  import FdEchart from 'fd/echarts/src/echarts-tool'
  import { getDepartPeople, departPeople, getPortrayalData } from '@/api/kpi/leaderWork/teamGeneral'
  import FdEchartTable from '../../components/homeCom/echartTable'
  export default {
    name: 'showCenter',
    components: { FdEchartTable, FdPanel, FdEchart },
    data() {
      return {
        describeSun: {
          type: 'sunburst',
          chart: {},
          chartOption: {},
          data: [],
          opt: {
            grid: {
              top: 30,
              left: 30,
              bottom: 30,
              right: 30
            },
            radar: {
              axisLine: {
                lineStyle: {
                  opacity: 0.7,
                  color: '#eee'
                }
              },
              splitLine: {
                lineStyle: {
                  opacity: 0.7,
                  color: '#eee'
                }
              }
            },
            radius: ['30%', '90%'],
            tooltip: {
              trigger: 'item',
              formatter: (param) => {
                if (param.name) {
                  return `${param.marker}${param.data.name}: ${param.data.rate}%`
                } else {
                  return '返回上一级'
                }
              }
            }
          }
        },
        departPeople,
        describeOption: {
          stripe: false,
          data: [],
          columns: [
            {
              field: 'seriesName',
              title: '分类',
              formatter: (row, value) => {
                return '<span class="circle-dot mr1" style="background-color:' + row.color + '"></span>' + value
              }
            },
            {
              field: 'name',
              title: '特征',
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
        },
        portrayalData: []
      }
    },
    computed: {},
    mounted() {
      this.getDepartPeople()
      this.getPortrayalData()
    },
    methods: {
      getDepartPeople,
      getPortrayalData
    }
  }
</script>

<style lang="scss" >
  .right-container .el-table__empty-block {
     min-height:60px!important;
  }
  .center-container {
    margin-top: 15px;
    width: 100%;
    height: 334px;
    .right-container {
      float: left;
      /*background-color: rgba(0, 37, 85, 0.8);*/
      box-sizing: border-box;
    }
    .container-chart {
      width: 100%;
      height: 315px;
    }
    .right-container {
      margin-left: 17px;
      width: 40.5%;
      height: 100%;
    }
  }
  .center-container .center-height{
    width: 100%;
    height: 286px;
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
