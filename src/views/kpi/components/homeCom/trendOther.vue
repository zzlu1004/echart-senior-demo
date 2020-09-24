<template>
  <div>
    <div>
      <el-row :gutter="24">
        <el-col :span="12">
          <div class="color-title bold mb1">办文汇总</div>
          <div class="color-title bold">
            <span class="h26">{{thousands(otherObj.docCount)}}</span>
            <span>件</span>
          </div>
          <div class="mt1">
            <el-row>
              <el-col :span="24">
                <div class="inline-block">
                  <span class="sub-panel h12">同比</span>
                  <span v-if="parseFloat(otherObj.docCountYoy) === 0" class="h16 bold pl1">{{otherObj.docCountYoy}}</span>
                  <span v-else-if="parseFloat(otherObj.docCountYoy) > 0" class="color-up h16 bold pl1">+{{otherObj.docCountYoy}}%</span>
                  <span v-else-if="parseFloat(otherObj.docCountYoy) < 0" class="color-down h16 bold pl1">{{otherObj.docCountYoy}}%</span>
                  <span v-else class="h16 bold pl1 color-title">--</span>
                </div>
                <div class="inline-block ml2">
                  <span class="sub-panel h12">部门均值</span>
                  <span class="color-title bold pl1">
                    <span>{{thousands(otherObj.departAvgDocCount)}}</span>
                    <span>件</span>
                  </span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="color-title bold mb1">办公汇总</div>
          <div class="color-title bold">
            <span class="h26">{{thousands(otherObj.otherCount)}}</span>
            <span>件</span>
          </div>
          <div class="mt1">
            <el-row>
              <el-col :span="24">
                <div class="inline-block">
                  <span class="sub-panel h12">同比</span>
                  <span v-if="parseFloat(otherObj.otherCountYoy) === 0" class="h16 bold pl1">{{otherObj.otherCountYoy}}</span>
                  <span v-else-if="parseFloat(otherObj.otherCountYoy) > 0" class="color-up h16 bold pl1">+{{otherObj.otherCountYoy}}%</span>
                  <span v-else-if="parseFloat(otherObj.otherCountYoy) < 0" class="color-down h16 bold pl1">{{otherObj.otherCountYoy}}%</span>
                  <span v-else class="h16 bold pl1 color-title">--</span>
                </div>
                <div class="inline-block ml2">
                  <span class="sub-panel h12">部门均值</span>
                  <span class="color-title bold pl1">
                    <span>{{thousands(otherObj.departAvgOtherCount)}}</span>
                    <span>件</span>
                  </span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <fd-echart :option="otherTrendOpt" height="260px"></fd-echart>
  </div>
</template>

<script>
  import { getPerformanceTrend } from '@/api/kpi/homeNew'
  import { thousands } from '@/utils/filters'
  import FdEchart from 'fd/echarts/echarts'
  export default {
    name: 'trendOther',
    components: {
      FdEchart
    },
    props: {},
    data() {
      return {
        type: 'other',
        otherTrendOpt: {
          data: [],
          type: 'line',
          chartOption: {},
          chart: null,
          opt: {
            yAxis: {
              name: '件',
              type: 'value'
            },
            grid: {
              top: 60,
              bottom: 0,
              right: 22,
              left: 22
            },
            legend: {
              top: 25,
              left: 'auto',
              right: 40
            }
          }
        },
        otherObj: {}
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
