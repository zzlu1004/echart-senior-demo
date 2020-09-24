<template>
  <div class="bg-white">
    <div class="record-analyze-title bd-bottom">
      <span class="color-title bold">{{options.title}}</span>
      <div class="f-right">
        <el-radio-group v-model="type" size="small" @change="typeChange">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="depart">部门</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="px2">
      <div v-show="type === 'all'" v-if="chart.type">
        <fd-echart :option="chart" height="270px"></fd-echart>
      </div>
      <div v-show="type==='depart'" class="py2" v-if="option.columns.length > 0">
        <fd-table :option="option"></fd-table>
      </div>
    </div>
  </div>
</template>

<script>
  import fdTable from 'fd/table'
  import fdEchart from 'fd/echarts/echarts'
  export default {
    name: 'FdRecordItem',
    components: {
      fdTable, fdEchart
    },
    props: {
      options: {
        type: Object
      }
    },
    data() {
      return {
        type: 'all',
        chart: {
          data: [],
          type: '',
          chartOption: {},
          dataZoom: true,
          chart: null,
          opt: {
            grid: {
              top: 35,
              bottom: 40
            }
          }
        },
        option: {
          stripe: true,
          data: [],
          height: 238,
          border: true,
          columns: []
        }
      }
    },
    computed: {},
    mounted() {
      let series = {}
      let tooltip = {
        formatter: '{b}: {c}'
      }
      if (this.options.type === 'pie') {
        series = {
          label: {
            normal: {
              show: true,
              formatter: (param) => {
                const data = param.data
                let name = data.name
                name = name.length > 8 ? (name.substring(0, 8) + '...') : name
                return `${name}: ${data.rate}%`
              },
              rich: {
                title: {
                  fontWeight: 'bold'
                }
              }
            }
          }
        }
        tooltip = {
          show: true,
          formatter: (param) => {
            const data = param.data
            return `${param.marker}${data.name}:<br/>${data.value}人/占比${data.rate}%`
          }
        }
      }
      this.fd.tools.merge(true, this.chart.opt, this.options.option, {
        series,
        tooltip
      })
      this.chart.type = this.options.type
    },
    methods: {
      typeChange() {}
    },
    watch: {
      'options.allData'(data) {
        this.chart.data = data.echartData
        const header = data.tableHeader || []
        this.option.columns = []
        header.forEach((item, index) => {
          const row = {
            fixed: index === 0,
            field: item.key,
            title: item.name
          }
          if (item.name) {
            row.minWidth = (item.name.length + 2) * 14 + 'px'
          } else {
            row.minWidth = '110px'
          }
          this.option.columns.push(row)
        })
        this.option.data = data.tableData
      }
    }
  }
</script>

<style scoped>
</style>
