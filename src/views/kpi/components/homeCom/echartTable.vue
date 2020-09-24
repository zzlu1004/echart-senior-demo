<template>
  <div>
    <el-row>
      <el-col :span="10">
        <div class="relative">
          <fd-echart :option="echartOption" :height="echartHeight"></fd-echart>
          <!-- 中心位置的总数值 -->
          <div v-if="centerHtml" v-html="getCenterHtml(centerHtml)" class="center absolute center-position">
          </div>
        </div>
        <div v-if="echartTitle" class="color-title bold h16 center">{{echartTitle}}</div>
      </el-col>
      <el-col :span="14">
        <div class="echart-table pl2" :class="tableClassName">
          <fd-table :option="tableOption"></fd-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import FdEchart from 'fd/echarts/echarts'
  import fdTable from 'fd/table/src/main'
  export default {
    name: 'echartTable',
    components: {
      FdEchart, fdTable
    },
    props: {
      // echarts图的标题
      echartTitle: {
        type: String
      },
      // echarts图的高度
      echartHeight: {
        type: String
      },
      // echarts图的配置
      echartOption: {
        type: Object
      },
      // table配置
      tableOption: {
        type: Object
      },
      // tableclass类名
      tableClassName: {
        type: String
      },
      // echarts图的中心数值（暂未用到）
      centerHtml: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
      }
    },
    computed: {
    },
    mounted() {
    },
    methods: {
      getCenterHtml(centerHtml) {
        return centerHtml
      }
    },
    watch: {
    }
  }
</script>

<style lang="scss">
.echart-table{
  .el-table{
    font-size: 12px;
  }
  .el-table td, .el-table th{
    padding: 4px 0;
  }
  .el-table__empty-block{
    min-height: 60px;
  }
}
.center-position{
  top: 50%;
  left: 50%;
}
</style>
