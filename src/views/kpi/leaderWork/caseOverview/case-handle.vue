<template>
  <div class="f-left center-container5" style="width: 100%;height: 456px;">
    <fd-panel :title="['办案情况汇总']" :sub-title="[]">
      <div slot="panel-1" class="center-height">
        <div class="tag-wrap ml2">
          <fd-tag v-bind:tagData="tags"></fd-tag>
        </div>
        <div class="charts-wrap">
          <fd-echart :option="radarOption" height="300px"></fd-echart>
        </div>
      </div>
    </fd-panel>
  </div>

</template>

<script>
  import fdTag from '../../components/tag'
  import FdPanel from 'fd/panel/panel'
  import { radarOption, getRadarData } from '@/api/kpi/leaderWork/caseGeneral'
  import FdEchart from 'fd/echarts/src/echarts-tool'
  export default {
    name: 'caseHandle',
    components: { fdTag, FdPanel, FdEchart },
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
        radarOption,
        tags: [],
        unitMap: {
          '全院承办案件数': '件',
          '全院办案工作量': ''
        }
      }
    },
    watch: {
      isRefresh() {
        this.getRadarData()
      }
    },
    hooks() {
    },
    computed: {},
    mounted() {
      this.getRadarData()
    },
    methods: {
      getRadarData
    }
  }
</script>

<style scoped lang="scss">
  .fd-panel .panel-body {
    height: 300px;
  }
  .tag-wrap {
    width: 100%;
    height: 100px;
  }
  .charts-wrap {
    width: 100%;
    height: 300px;
  }
</style>

<style>
  .tag-wrap .fd-tag .normal {
    margin-top: 16px;
  }
</style>
