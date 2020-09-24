<template>
  <div class="team-analysis-container  center-container6">
    <fd-panel :title="['审判团队分析']" :sub-title="[]">
      <div slot="panel-1" style="overflow-y: hidden;height: 500px;" class="center-height ">
        <div class="charts-wrap f-left">
          <p class="font18 m2">审判团队总数 <span class="font24">{{judgeTotal}}</span> 个</p>
          <fd-echart :option="scatterOpt1" height="420px"></fd-echart>
        </div>
        <div class="f-left table-warp mt2">
          <fd-table
            :option="tableOpt"
            :default-sort = "{
             prop: 'caseCount', order: 'descending'}"
            :sortable=true
            :sortChange="sortByNum2"
            >
          </fd-table>
        </div>
      </div>
    </fd-panel>
  </div>
</template>
<script>
  import FdPanel from 'fd/panel/panel'
  import FdTable from 'fd/table/src/main.vue'
  import { scatterOpt1, sortByNum2, getPostJudgeData, getTaleData2 } from '@/api/kpi/leaderWork/caseGeneral'
  export default {
    name: 'teamAnalysis',
    components: { FdPanel, FdTable },
    data() {
      return {
        scatterOpt1,
        judgeTotal: 0,
        tableOpt: {
          stripe: true,
          border: true,
          height: '440px',
          data: [],
          params: [],
          columns: [
            {
              field: 'departName',
              title: '部门',
              fixed: true,
              minWidth: this.fd.tools.getStringWidth('部门')
            },
            {
              field: 'name',
              title: '审判团队名称',
              formatter: (row, value) => {
                return value || '--'
              },
              minWidth: this.fd.tools.getStringWidth('审判团队名称')
            },
            {
              field: 'staffCount',
              title: '人数',
              align: 'right',
              sortable: 'custom',
              minWidth: this.fd.tools.getStringWidth('人数')
            },
            {
              field: 'caseCount',
              title: '办案数量',
              align: 'right',
              sortable: 'custom',
              minWidth: this.fd.tools.getStringWidth('办案数量')
            },
            {
              field: 'workload',
              title: '办案工作量',
              formatter: (row, value) => {
                return this.fd.data.saveFloat(value, 2) || '0.00'
              },
              align: 'right',
              sortable: 'custom',
              minWidth: this.fd.tools.getStringWidth('办案工作量')
            },
            {
              field: 'closeRate',
              title: '结案率',
              formatter: (row, value) => {
                return this.fd.data.saveFloat(value, 2) || '0.00'
              },
              align: 'right',
              sortable: 'custom',
              minWidth: this.fd.tools.getStringWidth('结案率')
            },
            {
              field: 'avgRate',
              title: '平均审理时间指数',
              formatter: (row, value) => {
                return this.fd.data.saveFloat(value, 2) || '0.00'
              },
              align: 'right',
              sortable: 'custom',
              minWidth: this.fd.tools.getStringWidth('平均审理时间指数')
            },
            {
              field: 'againRate',
              title: '再审案件改判率',
              formatter: (row, value) => {
                return this.fd.data.saveFloat(value, 2) || '0.00'
              },
              align: 'right',
              sortable: 'custom',
              minWidth: this.fd.tools.getStringWidth('再审案件改判率')
            },
            {
              field: 'oneRate',
              title: '一审判决改判率',
              formatter: (row, value) => {
                return this.fd.data.saveFloat(value, 2) || '0.00'
              },
              align: 'right',
              sortable: 'custom',
              minWidth: this.fd.tools.getStringWidth('一审判决改判率')
            },
            {
              field: 'transferRate',
              title: '调撤率',
              formatter: (row, value) => {
                return this.fd.data.saveFloat(value, 2) || '0.00'
              },
              align: 'right',
              sortable: 'custom',
              minWidth: this.fd.tools.getStringWidth('调撤率')
            }
          ]
        }
      }
    },
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
    watch: {
      isRefresh() {
        this.getPostJudgeData()
        this.getTaleData2()
      }
    },
    mounted() {
      this.getPostJudgeData()
      this.getTaleData2()
    },
    methods: {
      getPostJudgeData,
      getTaleData2,
      sortByNum2
    }
  }
</script>

<style scoped lang="scss">
  .app-container {
    background-color: transparent;
    padding: 1.5rem;
    min-height: 100%;
    border: none;
  }
  .team-analysis-container {
    margin-top: 16px;
    width: 99%;
    height: 392px;
    /*background: #071d53;*/
    box-sizing: border-box;
  }
  .charts-wrap {
    width: 50%;
    height: 350px;
  }
  .table-warp {
    overflow: hidden;
    width: 50%;
    height: 440px;
  }
  .font18 {
    font-size: 18px;
  }
  .font24 {
    font-size: 24px;
    font-weight: bold;
  }
</style>
