<template>
  <div class=" f-left center-container5" style="width:100%;height: 456px;">
    <div class="bg-white">
      <div class="record-analyze-title bd-bottom">
        <span class="color-title bold">案件类型分布</span>
        <div class="f-right">
          <el-radio-group v-model="types" size="small" @change="typeChange">
            <el-radio-button label="all">案件数</el-radio-button>
            <el-radio-button label="depart">案件工作量</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="px2">
        <div v-show="types === 'all'"  class="py2" >
          <p class="font18 mb2">全院结案数 <span class="font24">{{totalData}}</span> 件</p>
          <fd-echart-table
            :echartOption="describeSun"
            echartHeight="370px"
            :tableOption="describeOption"
          ></fd-echart-table>
        </div>
        <div v-show="types==='depart'" class="py2" >
          <p class="font18">全院案件工作量 <span class="font24">{{totalData2}}</span> </p>
          <fd-echart-table
            :echartOption="describeSun2"
            echartHeight="370px"
            :tableOption="describeOption2"
          ></fd-echart-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import FdPanel from 'fd/panel/panel'
  import { getPortrayalData, getPortrayalData2 } from '@/api/kpi/leaderWork/caseGeneral'
  import FdEchartTable from '../../components/homeCom/echartTable'

  export default {
    name: 'caseType',
    props: {
      pParams: {
        type: Object
      },
      isRefresh: {
        type: Boolean
      },
      type: {
        type: String
      }
    },
    data() {
      return {
        types: 'all',
        totalData: [],
        totalData2: [],
        describeSun: {
          type: 'sunburst',
          chart: {},
          chartOption: {},
          data: [],
          opt: {
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
        describeOption: {
          stripe: false,
          data: [],
          columns: [
            {
              field: 'name',
              title: '分类',
              formatter: (row, value) => {
                return '<span class="circle-dot mr1" style="display: inline-block;width: 8px;height: 8px;border-radius: 50%;vertical-align: 1px;background-color:' + row.color + '"></span>' + value
              }
            },
            {
              field: 'value',
              title: '案件数',
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
        },
        describeSun2: {
          type: 'sunburst',
          chart: {},
          chartOption: {},
          data: [],
          opt: {
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
        describeOption2: {
          stripe: false,
          data: [],
          columns: [
            {
              field: 'name',
              title: '分类',
              formatter: (row, value) => {
                return '<span class="circle-dot mr1" style="display: inline-block;width: 8px;height: 8px;border-radius: 50%;vertical-align: 1px;background-color:' + row.color + '"></span>' + value
              }
            },
            {
              field: 'value',
              title: '案件工作量',
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
    watch: {
      isRefresh() {
        this.getPortrayalData()
        this.getPortrayalData2()
      }
    },
    mounted() {
      this.getPortrayalData()
      this.getPortrayalData2()
    },
    methods: {
      typeChange() {
        this.describeSun2.chart.resize()
      },
      getPortrayalData,
      getPortrayalData2
    },
    components: { FdPanel, FdEchartTable },
    destroyed() {
    }
  }
</script>

<style scoped lang="scss">
  .record-analyze-title{
    height: 50px;
    line-height: 50px;
    font-weight: bold;
    font-size: 16px;
    padding: 0 16px;
  }
  .app-container {
    background-color: transparent;
    padding: 1.5rem;
    min-height: 100%;
    border: none;
  }
  .sun-warp {
    overflow: hidden;
    width: 420px;
    height: 280px;
  }
  .table-warp {
    color: #fff;
    width: 640px;
    height: 280px;
  }
  .table-style {
    overflow: hidden;
    /*overflow-y: auto;*/
    width: 640px;
    height: 280px
  }
  .font18 {
    font-size: 18px;
    float: right;
    padding: 0;
    width: 54%;
    margin-top: 0;
  }
  .font24 {
    font-size: 24px;
    font-weight: bold;
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
