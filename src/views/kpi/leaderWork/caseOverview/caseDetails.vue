<template>
  <div class="details-wrap center-container6">
    <fd-panel :title="titleData" :sub-title="[]">
      <div slot="panel-1" class="center-height ">
        <div class="charts-wrap f-left pt10">
          <fd-echart :option="scatterOpt"  height="460px"></fd-echart>
        </div>
        <div class="f-left table-warp mt2">
          <fd-table
            :option="tableOpt"
            :default-sort = "{
             prop: 'caseCount', order: 'descending'}"
            :sortable=true
            :sortChange="sortByNum">
          </fd-table>
        </div>
      </div>
    </fd-panel>
  </div>
</template>

<script>
  import FdPanel from 'fd/panel/panel'
  import { scatterOpt, getCaseTotal, getCaseTotal2, sortByNum } from '@/api/kpi/leaderWork/caseGeneral'
  import FdTable from 'fd/table/src/main.vue'
  export default {
    name: 'caseDetails',
    components: { FdPanel, FdTable },
    data() {
      return {
        scatterOpt,
        tableData: [],
        params: {
          startTime: '2018-1',
          endTime: '2019-5'
        },
        typeMap: {
          'yefg': [
            '承办案件数', '承办案件工作量', '承办案件平均工作量'
          ],
          'fgzl': [
            '法官助理案件数', '法官助理案件工作量', '案件平均工作量'
          ],
          'sjy': [
            '书记员案件数', '书记员案件工作量', '案件平均工作量'
          ]
        },
        tableOpt: {
          stripe: true,
          border: true,
          height: '440px',
          data: [],
          columns: []
        }
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
    mounted() {
      this.scatterOpt.opt.yAxis.name = this.typeMap[this.type][0]
      this.scatterOpt.opt.xAxis.name = this.typeMap[this.type][1]
      this.tableOpt.columns = [
        {
          field: 'departName',
          title: '部门',
          minWidth: this.fd.tools.getStringWidth('部门'),
          formatter: (row, value) => {
            return value || '--'
          }
        },
        {
          field: 'name',
          title: '姓名',
          minWidth: this.fd.tools.getStringWidth('姓名')
        },
        {
          field: 'caseCount',
          title: this.typeMap[this.type][0],
          align: 'right',
          sortable: 'custom',
          minWidth: this.fd.tools.getStringWidth(this.typeMap[this.type][0])
        },
        {
          field: 'workload',
          title: this.typeMap[this.type][1],
          align: 'right',
          formatter: (row, value) => {
            return this.fd.data.saveFloat(value, 2)
          },
          sortable: 'custom',
          minWidth: this.fd.tools.getStringWidth(this.typeMap[this.type][1])
        },
        {
          field: 'avgWorkload',
          title: this.typeMap[this.type][2],
          formatter: (row, value) => {
            return this.fd.data.saveFloat(value, 2)
          },
          align: 'right',
          sortable: 'custom',
          minWidth: this.fd.tools.getStringWidth(this.typeMap[this.type][2])
        }
      ]
      this.getCaseTotal()
      this.getCaseTotal2()
    },
    methods: {
      getCaseTotal,
      getCaseTotal2,
      sortByNum
    },
    watch: {
      isRefresh() {
        this.getCaseTotal()
        this.getCaseTotal2()
      },
      type() {
        this.scatterOpt.opt.yAxis.name = this.typeMap[this.type][0]
        this.scatterOpt.opt.xAxis.name = this.typeMap[this.type][1]
        this.tableOpt.columns = [
          {
            field: 'departName',
            title: '部门',
            minWidth: this.fd.tools.getStringWidth('部门'),
            formatter: (row, value) => {
              return value || '--'
            }
          },
          {
            field: 'name',
            title: '姓名',
            minWidth: this.fd.tools.getStringWidth('姓名')
          },
          {
            field: 'caseCount',
            title: this.typeMap[this.type][0],
            align: 'right',
            sortable: 'custom',
            minWidth: this.fd.tools.getStringWidth(this.typeMap[this.type][0])
          },
          {
            field: 'workload',
            title: this.typeMap[this.type][1],
            align: 'right',
            sortable: 'custom',
            formatter: (row, value) => {
              return this.fd.data.saveFloat(value, 2) || '0.00'
            },
            minWidth: this.fd.tools.getStringWidth(this.typeMap[this.type][1])
          },
          {
            field: 'avgWorkload',
            title: this.typeMap[this.type][2],
            formatter: (row, value) => {
              return this.fd.data.saveFloat(value, 2) || '0.00'
            },
            align: 'right',
            sortable: 'custom',
            minWidth: this.fd.tools.getStringWidth(this.typeMap[this.type][2])
          }
        ]
        this.getCaseTotal()
        this.getCaseTotal2()
      }
    },
    destroyed() {
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
  .el-table--group, .el-table--border {
    border: 1px solid transparent;
  }
  .details-wrap{
    /*margin-top: 15px;*/
    width: 100%;
    height: 392px;
    /*background: #071d53;*/
    box-sizing: border-box;
  }

  .table-warp {
    /*overflow: hidden;*/
    /*overflow-y: auto;*/
    color: #fff;
    width: 44%;
    height: 337px;
  }
  .pt10 {
    padding-top: 10px;
  }
  .charts-wrap{
    width: 55%;
    height: 400px;
  }
  .el-table__body-wrapper {
    height: 274px;
  }

</style>

