<template>
  <div>
    <echart-table
      :echartOption="clerkCaseRateOpt"
      :tableOption="clerkCaseRateOption"
      echartHeight="305px"
      tableClassName="mt2"
      :centerHtml="clerkCenterHtml"
      echartTitle="办理案件案由分布"></echart-table>
  </div>
</template>

<script>
  import { getWorkList } from '@/api/kpi/homeNew'
  import { thousands } from '@/utils/filters'
  import echartTable from './echartTable.vue'
  import { noString } from '@/utils/filters'
  export default {
    name: 'workListClerk',
    components: {
      echartTable
    },
    props: {},
    data() {
      return {
        type: 'clerk',
        clerkCenterHtml: '',
        clerkCaseRateObj: {},
        clerkCaseRateOpt: {
          data: [],
          type: 'pie',
          chartOption: {},
          chart: null,
          opt: {
            legend: {
              show: false
            },
            tooltip: {
              trigger: 'item',
              formatter: (param) => {
                return `${param.marker}${param.name}：</br>案件数${param.value}件</br>占比${param.data.rates}%`
              }
            },
            title: {
              text: '',
              left: 'center',
              top: 'middle',
              textStyle: {
                rich: {
                  a: {
                    color: '#404040',
                    fontSize: 14,
                    fontWeight: 700,
                    height: 25
                  },
                  b: {
                    color: '#404040',
                    fontSize: 30,
                    fontWeight: 700
                  }
                }
              }
            },
            series: {
              radius: ['60%', '90%'],
              center: ['50%', '50%'],
              itemStyle: {
                borderWidth: 1,
                borderColor: '#fff'
              },
              label: {
                normal: {
                  show: false
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              }
            }
          }
        },
        clerkCaseRateOption: {
          stripe: false,
          data: [],
          columns: [
            {
              field: 'name',
              title: '案由名称',
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
              title: '案件数',
              align: 'right',
              formatter: (row, value) => {
                return noString(value)
              }
            }
          ]
        }
      }
    },
    computed: {
    },
    mounted() {
      this.getWorkList()
    },
    methods: {
      getWorkList, thousands, noString
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
