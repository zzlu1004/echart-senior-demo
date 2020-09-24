<template>
  <echart-table
    :echartOption="workTypeOpt"
    :tableOption="workTypeOption"
    tableClassName="mt4"
    echartHeight="297px"
    echartTitle="工作类型分布"></echart-table>
</template>

<script>
  import { getWorkListOther } from '@/api/kpi/homeNew'
  import { thousands } from '@/utils/filters'
  import echartTable from './echartTable.vue'
  import { noString } from '@/utils/filters'
  export default {
    name: 'workListOther',
    components: {
      echartTable
    },
    props: {},
    data() {
      return {
        type: 'other',
        workTypeOption: {
          stripe: false,
          data: [],
          columns: [
            {
              field: 'name',
              title: '类型名称',
              formatter: (row, value) => {
                return '<span class="circle-dot mr1" style="background-color:' + row.color + '"></span>' + noString(value)
              }
            },
            {
              field: 'rates',
              title: '占比',
              align: 'right',
              formatter: (row, value) => {
                return `${noString(value)}%`
              }
            },
            {
              field: 'counts',
              title: '数量',
              align: 'right',
              formatter: (row, value) => {
                return noString(value)
              }
            }
          ]
        },
        workTypeOpt: {
          data: [],
          type: 'sunburst',
          chartOption: {},
          chart: null,
          opt: {
            series: {
              sort: null,
              center: ['50%', '50%'],
              levels: [
                {}, {
                  r0: '40%',
                  r: '55%'
                }, {
                  r0: '55%',
                  r: '80%'
                }
              ],
              itemStyle: {
                borderWidth: 2
              }
            }
          }
        }
      }
    },
    computed: {
    },
    mounted() {
      this.getWorkListOther()
    },
    methods: {
      getWorkListOther, thousands, noString
    },
    watch: {
    }
  }
</script>

<style lang="scss">
.h26{
  font-size: 26px;
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
