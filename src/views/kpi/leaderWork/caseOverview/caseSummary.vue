<template>
  <div class="f-left center-container5" style="width: 100%;height: 456px;">
    <fd-panel  :title="titleData" :sub-title="[]">
      <div slot="panel-1" class="center-height m2">
        <fd-tag v-bind:tagData="tagsData" :inline="true" :className="'tag-wrap'" style="overflow: hidden"></fd-tag>
        <div class="chart-wrap">
          <fd-echart :option="lineOption"  height="300px"></fd-echart>
        </div>
      </div>
    </fd-panel>
  </div>
</template>

<script>
  import fdTag from '../../components/tag'
  import FdPanel from 'fd/panel/panel'
  import { lineOption, getJudgeTotal } from '@/api/kpi/leaderWork/caseGeneral'
  export default {
    name: 'caseSummary',
    data() {
      return {
        unitMap: {
          '承办案件数': '件',
          '参办案件工作量': '',
          '人均参办案件工作量': '',
          '人均承办案件数': '件',
          '法官助理案件数': '件',
          '法官助理案件工作量': '',
          '人均案件工作量': '',
          '人均案件数': '件',
          '书记员案件数': '件',
          '书记员案件工作量': ''
        },
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
        },
        lineOption,
        tagsData: []
      }
    },
    props: {
      titleData: {
        type: Array,
        default() {
          return []
        }
      },
      type: {
        type: String
      },
      pParams: {
        type: Object
      },
      isRefresh: {
        type: Boolean
      }
    },
    watch: {
      isRefresh() {
        this.getJudgeTotal()
      },
      type() {
        this.lineOption.opt.series[0].name = this.typeMap[this.type][0]
        this.lineOption.opt.series[1].name = this.typeMap[this.type][1]
        this.getJudgeTotal()
      }
    },
    mounted() {
      this.lineOption.opt.series[0].name = this.typeMap[this.type][0]
      this.lineOption.opt.series[1].name = this.typeMap[this.type][1]
      this.getJudgeTotal()
    },
    methods: {
      getJudgeTotal
    },
    components: { FdPanel, fdTag }
  }
</script>

<style scoped lang="scss">
  .chart-wrap {
    width: 100%;
    height: 290px;
  }
</style>
