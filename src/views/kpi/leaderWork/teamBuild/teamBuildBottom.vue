<template>
  <div class="center-container3">
    <el-row>
      <el-col :span="9" class="pr2">
        <div class="bg-white">
          <div class="record-analyze-title bd-bottom">
            <span class="color-title bold">队伍调训培训情况</span>
            <div class="f-right">
              <el-radio-group v-model="type" size="small" @change="typeChange">
                <el-radio-button label="all">本年</el-radio-button>
                <el-radio-button label="depart">近三年</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="px2">
            <div v-show="type === 'all'"  class="py2" >
              <div class="top-con-tagData">
                <fd-tag :tagData="tags"></fd-tag>
              </div>
              <div class="con-left-center">
                <fd-echart-table
                  :echartOption="training"
                  echartHeight="160px"
                  :tableOption="trainingData"
                ></fd-echart-table>
              </div>
              <div class="con-left-bottom">
                <fd-echart :option = personNum height="160px"></fd-echart>
              </div>
            </div>
            <div v-show="type==='depart'" class="py2" >
              <div class="top-con-tagData">
                <fd-tag :tagData="tags32"></fd-tag>
              </div>
              <div class="con-left-center">
                <fd-echart-table
                  :echartOption="training2"
                  echartHeight="160px"
                  :tableOption="trainingData2"
                ></fd-echart-table>
              </div>
              <div class="con-left-bottom">
                <fd-echart :option = personNum2 height="160px" ></fd-echart>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="9" class="pr2">
        <div class="bg-white">
          <div class="record-analyze-title bd-bottom">
            <span class="color-title bold">队伍表彰奖励情况</span>
            <div class="f-right">
              <el-radio-group v-model="type2" size="small" @change="typeChange2">
                <el-radio-button label="all2">本年</el-radio-button>
                <el-radio-button label="depart2">近三年</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="px2">
            <div v-show="type2 === 'all2'"  class="py2" >
              <div class="top-con-tagData">
                <fd-tag :tagData="tags2"></fd-tag>
              </div>
              <div class="con-left-center" >
                <fd-echart :option = rewardRate  height="180px" ></fd-echart>
              </div>
              <div class="con-left-bottom">
                <fd-echart :option = rewardNum height="160px" ></fd-echart>
              </div>
            </div>
            <div v-show="type2==='depart2'" class="py2" >
              <div class="top-con-tagData">
                <fd-tag :tagData="tags42"></fd-tag>
              </div>
              <div class="con-left-center">
                <fd-echart :option = rewardRate2  height="180px"></fd-echart>
              </div>
              <div class="con-left-bottom">
                <fd-echart :option = rewardNum2 height="160px" ></fd-echart>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6" >
        <div class="bg-white">
          <div class="record-analyze-title bd-bottom">
            <span class="color-title bold">个人榜单</span>
            <div class="f-right">
              <el-radio-group v-model="type3" size="small" @change="typeChange3">
                <el-radio-button label="all3">本年</el-radio-button>
                <el-radio-button label="depart3">近三年</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="px2">
            <div v-show="type3 === 'all3'"  class="py2" >
              <fd-table
                :option="tableOpt"
                :default-sort = "{
             prop: 'trainTime', order: 'descending'}"
                :sortable=true
                :sortChange="sortByNum"
                :height='420'
                class="table-width"
              >
              </fd-table>
            </div>
            <div v-show="type3==='depart3'" class="py2" >
              <fd-table
                :option="tableOpt2"
                :default-sort = "{
             prop: 'trainTime', order: 'descending'}"
                :sortable=true
                :sortChange="sortByNum"
                :height='420'
                class="table-width"
              >
              </fd-table>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import FdPanel from 'fd/panel/panel'
  import FdTag from '../../components/tag'
  import FdTable from 'fd/table/src/main'
  import FdEchart from 'fd/echarts/src/echarts-tool'
  import { getTrainingData, getTrainingData2, personNum, personNum2, rewardRate, rewardRate2, rewardNum, getRewardNum, rewardNum2, getRewardNum2, getListNum, getListNum2, sortByNum } from '@/api/kpi/leaderWork/teamGeneral'
  import FdEchartTable from '../../components/homeCom/echartTable'
  export default {
    name: 'teamBuildBottom',
    components: { FdPanel, FdTag, FdEchartTable, FdTable, FdEchart },
    data() {
      return {
        type: 'all',
        type2: 'all2',
        type3: 'all3',
        unitMap: {
          '调训培训': '人次',
          '参与人数': '人',
          '全院参与度': '%',
          '表彰奖励': '人次',
          '全院获奖率': '%',
          '获奖人数': '人'
        },
        params: {},
        tableOpt: {
          stripe: true,
          border: true,
          height: '455px',
          data: [],
          columns: [
            {
              field: 'departName',
              title: '部门',
              formatter: (row, value) => {
                return value || '--'
              }
            },
            {
              field: 'staffName',
              title: '姓名'
            },
            {
              field: 'trainTime',
              title: '调训培训(次)',
              align: 'right',
              sortable: 'custom'
            },
            {
              field: 'rewardTime',
              title: '表彰奖励(次)',
              align: 'right',
              sortable: 'custom'
            }
          ]
        },
        tableOpt2: {
          stripe: true,
          border: true,
          height: '455px',
          data: [],
          columns: [
            {
              field: 'departName',
              title: '部门',
              formatter: (row, value) => {
                return value || '--'
              }
            },
            {
              field: 'staffName',
              title: '姓名'
            },
            {
              field: 'trainTime',
              title: '调训培训(次)',
              align: 'right',
              sortable: 'custom'
            },
            {
              field: 'rewardTime',
              title: '表彰奖励(次)',
              align: 'right',
              sortable: 'custom'
            }
          ]
        },
        training: {
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
        training2: {
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
        personNum,
        personNum2,
        rewardNum,
        rewardNum2,
        rewardRate,
        rewardRate2,
        tags: [],
        tags2: [],
        tags32: [],
        tags42: [],
        listNum: [],
        listNum2: [],
        trainingData: {
          stripe: false,
          data: [],
          columns: [
            {
              field: 'name',
              title: '分类',
              formatter: (row, value) => {
                return '<span class="circle-dot mr1" style="background-color:' + row.color + '"></span>' + value
              }
            },
            {
              field: 'value',
              title: '人次',
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
        trainingData2: {
          stripe: false,
          data: [],
          columns: [
            {
              field: 'name',
              title: '分类',
              formatter: (row, value) => {
                return '<span class="circle-dot mr1" style="background-color:' + row.color + '"></span>' + value
              }
            },
            {
              field: 'value',
              title: '人次',
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
      this.getTrainingData()
      this.getTrainingData2()
      this.getRewardNum()
      this.getRewardNum2()
      this.getListNum()
      this.getListNum2()
    },
    methods: {
      typeChange() {
        this.training2.chart.resize()
        this.personNum2.chart.resize()
      },
      typeChange2() {
        this.rewardRate2.chart.resize()
        this.rewardNum2.chart.resize()
      },
      typeChange3() {
      },
      getRewardNum,
      getRewardNum2,
      getListNum2,
      getListNum,
      getTrainingData,
      getTrainingData2,
      sortByNum
    }
  }
</script>

<style lang="scss" scoped>
  .record-analyze-title{
    height: 50px;
    line-height: 50px;
    font-weight: bold;
    font-size: 16px;
    padding: 0 16px;
  }
  .righ-container .el-table__empty-block {
    min-height:60px!important;
  }
  .center-container3 {
    margin-top: 8px;
    width: 100%;
    height: 543px;
    /*color: #e5f3ff;*/
    .lef-container,.cen-container,
    .righ-container {
      float: left;
      box-sizing: border-box;
    }
    center-container3 .container-chart {
      width: 100%;
      height: 553px;
    }
  }
  .center-container3 .center-height{
    width: 100%;
    height: 500px;
  }
  .con-left-center{
    width: 100%;
    height: 200px;
  }
  .con-left-bottom{
    width: 100%;
    height: 166px;
  }
  .top-con-tagData{
    width: 100%;
    height:90px;
  }
  .table-width{
    height: 455px;
    /*overflow: auto;*/
  }
  .el-table__body-wrapper {
    overflow: auto;
    height: 395px;
    position: relative;
  }
</style>
