<template>
  <div class="center-container4">
    <el-row>
      <el-col  :span="14" class="pr2">
        <fd-panel :title="['队伍人员动态']" class="mb2">
          <div slot="panel-1" class="p2 center-height">
            <div class="top-con-tagData mb1">
              <fd-tag :tagData="departTags"></fd-tag>
            </div>
            <div class="panel-1-bot">
              <div class="bot-left ">
                <fd-echart :option = enterExit height="200px"></fd-echart>
              </div>
              <div class="bot-right ">
                <fd-table :data='enterReason' :height='195' class="table-width">
                  <el-table-column
                    prop="seriesName"
                    label="进院类型"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="value"
                    label="人数"
                    align="right"
                    width="70"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="rate"
                    label="占比"
                    align="right"
                  >
                    <template slot-scope="scope">
                      <span >{{scope.row.rate}}%</span>
                    </template>
                  </el-table-column>
                </fd-table>
              </div>
            </div>
          </div>
        </fd-panel>
      </el-col>
      <el-col  :span="10" >
        <fd-panel :title="['职级分布']" class="mb2">
          <div slot="panel-1" class="p2 center-height">
            <fd-echart :option = rankData height="319px"></fd-echart>
          </div>
        </fd-panel>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import FdPanel from 'fd/panel/panel'
  import FdTable from 'fd/table/src/fdTable'
  import FdEchart from 'fd/echarts/src/echarts-tool'
  import { enterExit, rankData, getRankData, getDepartTotalData } from '@/api/kpi/leaderWork/teamGeneral'
  import FdTag from '../../components/tag'
  import FdEchartTable from 'fd/echartTable/echartTable'
  export default {
    name: 'teamBuildTop',
    components: { FdEchartTable, FdPanel, FdEchart, FdTag, FdTable },
    data() {
      return {
        enterExit,
        rankData,
        enterReason: [],
        departTags: [],
        unitMap: {
          '标准版安徽省高级人民法院': '人',
          '2019年累计进院': '人'
        },
        columns: [{
          prop: 'name',
          label: '分类',
          align: 'left'
        }, {
          prop: 'value',
          label: '特征',
          align: 'left'
        }, {
          prop: 'rate',
          label: '占比',
          align: 'right',
          className: 'color-link'
        }],
        portrayalData: []
      }
    },
    mounted() {
      this.getRankData()
      this.getDepartTotalData()
    },
    methods: {
      getRankData,
      getDepartTotalData
    }
  }
</script>

<style lang="scss" >
  .right-container .el-table__empty-block {
     min-height:60px!important;
  }
  .center-container4 {
    /*margin-top: 15px;*/
    width: 100%;
    height: 400px;
    .container-chart {
      width: 100%;
      height: 400px;
    }
  }
  .center-container4 .center-height{
    width: 100%;
    height: 351px;
  }
  .table-width{
    width: 100%;
  }
  .top-con-tagData{
    width: 100%;
    height:100px;
  }
  .panel-1-bot{
    width: 100%;
    height: 278px;
  }
  .panel-1-bot>div{
    float: left;
    height: 200px;
  }
  .bot-left{
    width: 65%;
  }
  .bot-right{
    overflow: auto;
    width: 34.5%;
  }
</style>
