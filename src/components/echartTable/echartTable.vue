<template>
  <div class="fd-echart-table">
    <el-row :gutter="20">
      <el-col :span="inline ? 9 : 24">
        <div class="relative">
          <fd-echart :option="echartOpt" :height="height"></fd-echart>
        </div>
      </el-col>
      <el-col :span="inline ? 14 : 24">
        <fd-table :data="tableData"
                  :height="tableHeight"
                  :width="tableWidth"
                  :className="inline? '' : 'mt1'">
          <el-table-column
            label=""
            align="center"
            width="30">
            <template slot-scope="scope">
              <span class="circular-span" :style="{'backgroundColor': scope.row.itemStyle.color}"></span>
            </template>
          </el-table-column>
          <el-table-column
            v-for="item of columns"
            :key="item.prop"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :align="item.align">
            <template slot-scope="scope">
              <span :class="item.className">{{scope.row[item.prop]}}</span>
            </template>
          </el-table-column>
        </fd-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import FdEchart from 'fd/echarts/echarts'
  import FdTable from 'fd/table/src/fdTable2'
  export default {
    name: 'FdEchartTable',
    components: {
      FdEchart, FdTable
    },
    props: {
      // echarts图的配置
      echartOpt: {
        type: Object
      },
      // echarts高度
      height: {
        type: String
      },
      // 表格的高度
      tableHeight: {
        type: [String, Number]
      },
      // 表格的宽度
      tableWidth: {
        type: String
      },
      // 表格列的配置
      columns: {
        type: Array,
        default: function() {
          return []
        }
      },
      // 表格列的配置
      datas: {
        type: Array
      },
      showMax: {
        type: Boolean,
        default: true
      },
      maxKey: {
        type: String,
        default: 'value'
      },
      inline: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        tableData: []
      }
    },
    computed: {
    },
    mounted() {
      this.echartOpt.data = this.datas
      this.tableData = this.getMaxItem(this.datas)
    },
    methods: {
      getMaxItem(data) {
        const colors = ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0', '#3436C7', '#223273', '#578DC6',
          '#9CCF25', '#AC662E', '#BC2F5C', '#6D7C9D', '#51599D', '#5D71CB', '#304B94']
        const max = {}
        const colorMap = {}
        let dataColor = []
        let index = 0
        if (this.echartOpt.type === 'sunburst') {
          data.forEach((item) => {
            const seriesName = item.seriesName
            const colorName = seriesName || item.name
            let color = ''
            if (!colorMap[colorName]) {
              color = colors[index++]
              colorMap[colorName] = color
            }
            item.itemStyle = {
              color: colorMap[colorName]
            }
            if (seriesName) {
              if (!max[seriesName] || max[seriesName][this.maxKey] < item[this.maxKey]) {
                max[seriesName] = item
              }
              item.itemStyle.opacity = 0.4
            } else if (!this.showMax) {
              dataColor.push(item)
            }
          })
          if (this.showMax) {
            for (const key in max) {
              dataColor.push(max[key])
            }
          }
        } else {
          dataColor = data
        }
        dataColor.forEach((item, index) => {
          item.itemStyle = {
            color: colorMap[item.seriesName] || colors[index],
            opacity: (this.echartOpt.type === 'sunburst' && item.seriesName !== '') ? 0.4 : 1
          }
        })
        return dataColor
      }
    },
    watch: {
      datas(data) {
        this.echartOpt.data = data
        this.tableData = this.getMaxItem(data)
      }
    }
  }
</script>

<style lang="scss" scoped>
.fd-echart-table{
  .circular-span{
    width: 10px;
    height: 10px;
    display: inline-block;
    border-radius: 50%;
  }
}
</style>
