<template>
  <div>
    <div>
      <el-row :gutter="24">
        <el-col :span="12">
          <div class="color-title bold mb1">法官助理案件数</div>
          <div class="color-title bold">
            <span class="h26">{{thousands(assistantObj.caseCount)}}</span>
            <span>件</span>
          </div>
          <div class="mt1">
            <el-row>
              <el-col :span="24">
                <div class="inline-block">
                  <span class="sub-panel h12">同比</span>
                  <span v-if="parseFloat(assistantObj.caseCountYoy) === 0" class="h16 bold pl1">{{assistantObj.caseCountYoy}}</span>
                  <span v-else-if="parseFloat(assistantObj.caseCountYoy) > 0" class="color-up h16 bold pl1">+{{assistantObj.caseCountYoy}}%</span>
                  <span v-else-if="parseFloat(assistantObj.caseCountYoy) < 0" class="color-down h16 bold pl1">{{assistantObj.caseCountYoy}}%</span>
                  <span v-else class="h16 bold pl1 color-title">--</span>
                </div>
                <div class="inline-block ml2">
                  <span class="sub-panel h12">部门均值</span>
                  <span class="color-title bold pl1">
                    <span>{{thousands(assistantObj.departAvgCaseCount)}}</span>
                    <span>件</span>
                  </span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="color-title bold mb1">法官助理案件工作量</div>
          <div>
            <span class="h26 bold color-title">{{thousands(assistantObj.workload)}}</span>
          </div>
          <div class="mt1">
            <el-row>
              <el-col :span="24">
                <div class="inline-block">
                  <span class="sub-panel h12">同比</span>
                  <span v-if="parseFloat(assistantObj.workloadYoy) === 0" class="h16 bold pl1">{{assistantObj.workloadYoy}}</span>
                  <span v-else-if="parseFloat(assistantObj.workloadYoy) > 0" class="color-up h16 bold pl1">+{{assistantObj.workloadYoy}}%</span>
                  <span v-else-if="parseFloat(assistantObj.workloadYoy) < 0" class="color-down h16 bold pl1">{{assistantObj.workloadYoy}}%</span>
                  <span v-else class="h16 bold pl1 color-title">--</span>
                </div>
                <div class="inline-block ml2">
                  <span class="sub-panel h12">部门均值</span>
                  <span class="color-title bold pl1">{{thousands(assistantObj.departAvgWorkload)}}</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <fd-echart :option="assistantTrendOpt" height="260px"></fd-echart>
  </div>
</template>

<script>
  import { getPerformanceTrend } from '@/api/kpi/homeNew'
  import { thousands } from '@/utils/filters'
  import FdEchart from 'fd/echarts/echarts'
  export default {
    name: 'trendAssistant',
    components: {
      FdEchart
    },
    props: {},
    data() {
      return {
        type: 'assistant',
        assistantTrendOpt: {
          data: [{
            id: '1',
            name: ''
          }], // 生成图标的数据
          type: 'mix', // 图标类型
          chartOption: {}, // 全量的默认配置
          chart: null, // echart.init后生成的echart对象
          types: [{ type: 'line', key: 'caseNum' }, { type: 'line', key: 'workload' }],
          opt: {
            color: ['#0770ff', '#00bcd4'],
            grid: {
              top: 60,
              bottom: 0,
              right: 22,
              left: 45
            },
            legend: {
              top: 25,
              left: 'auto',
              right: 90
            },
            yAxis: [{
              name: '案件数（件）',
              type: 'value'
            }, {
              name: '工作量',
              type: 'value'
            }],
            series: [{ type: 'line', name: '法官助理案件数' }, { type: 'line', name: '法官助理案件工作量', yAxisIndex: 1 }]
          }
        },
        assistantObj: {}
      }
    },
    computed: {
    },
    mounted() {
      this.getPerformanceTrend()
    },
    methods: {
      getPerformanceTrend, thousands
    },
    watch: {
    }
  }
</script>

<style lang="scss">
.h26{
  font-size: 26px;
}
</style>
