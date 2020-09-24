<template>
  <div class="f-left  center-container5" style="width: 100%;height: 408px;">
    <fd-panel :title="['部门人均办案量对比', '部门人员办案工作负荷']">
      <div slot="panel-1" class="center-height ">
        <div class="charts-wrap f-left mt2">
          <fd-echart :option="barOption"  height="382px"></fd-echart>
        </div>
      </div>

      <div slot="panel-2">
        <div class="charts-wrap f-left mt2">
          <fd-echart :option="loadOption"  height="382px"></fd-echart>
        </div>
      </div>

    </fd-panel>
  </div>
</template>

<script>
  import FdPanel from 'fd/panel/panel'
  import { barOption, loadOption, getJudgeTotal2, getJudgeTotal3 } from '@/api/kpi/leaderWork/caseGeneral'
  export default {
    name: 'caseCompared',
    components: { FdPanel },
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
        barOption,
        loadOption,
        typeMap: {
          'yefg': [
            '承办案件数', '参办案件工作量'
          ],
          'fgzl': [
            '法官助理案件数', '法官助理案件工作量'
          ],
          'sjy': [
            '书记员案件数', '书记员案件工作量'
          ]
        }
      }
    },
    watch: {
      isRefresh() {
        this.getJudgeTotal2()
        this.getJudgeTotal3()
      },
      type() {
        this.barOption.opt.series[0].name = this.typeMap[this.type][0]
        this.barOption.opt.series[1].name = this.typeMap[this.type][1]
        this.getJudgeTotal2()
        this.getJudgeTotal3()
      }
    },
    hooks() {
    },
    mounted() {
      this.barOption.opt.series[0].name = this.typeMap[this.type][0]
      this.barOption.opt.series[1].name = this.typeMap[this.type][1]
      this.getJudgeTotal2()
      this.getJudgeTotal3()
    },
    methods: {
      getJudgeTotal2,
      getJudgeTotal3
    }
  }
</script>

<style scoped>
  .charts-wrap{
    width: 100%;
    height: 400px;
  }
</style>
