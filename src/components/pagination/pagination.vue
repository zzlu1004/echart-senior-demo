<template>
  <div v-show="total > 0" class="fd-pagination pt3 right-align">
    <el-pagination
      :total=total
      :page-size=limit
      :page-sizes=pageArr
      :pager-count=5
      :current-page="current"
      :layout=layout
      @current-change=currentChange
      @size-change=sizeChange>
    </el-pagination>
  </div>
</template>
<script>
  export default {
    name: 'FdPagination',
    props: {
      limit: {
        type: Number,
        default: 10
      },
      offset: {
        type: Number,
        default: 0
      },
      currentChange: {
        type: Function,
        default: function() {}
      },
      sizeChange: {
        type: Function,
        default: function() {}
      },
      sizes: {
        type: Boolean,
        default: false
      },
      total: {
        type: Number,
        default: 0
      },
      pageArr: {
        type: Array,
        default: () => [10, 20, 30, 40, 50]
      }
    },
    computed: {
      current() {
        return Math.floor(this.offset / this.limit) + 1
      }
    },
    data() {
      return {
        layout: 'total, prev, pager, next'
      }
    },
    mounted() {
      if (this.sizes) {
        this.layout += ', sizes'
      }
    },
    method: {
    },
    watch: {
      total() {}
    }
  }
</script>

<style>
  .fd-pagination .el-pagination{
    padding: 0;
  }
  .fd-pagination .el-pagination .el-pagination__sizes{
    margin-right: 0;
  }
  .fd-pagination .el-pagination .el-pagination__sizes .el-select .el-input{
    margin: 0;
  }
  .fd-pagination .el-pagination .el-pager li.active:not(.disabled) {
    border: 1px solid #409eff;
    background-color: #409eff;
    color: #fff;
  }
  .fd-pagination .el-pagination .btn-next,
  .fd-pagination .el-pagination .btn-prev,
  .fd-pagination .el-pagination .el-pager li {
    margin: 0 5px;
    color: #606266;
    min-width: 32px;
    min-height: 32px;
    line-height: 32px;
    border-radius: 2px;
    border: 1px solid #dcdfe6
  }
  .el-pagination .el-select .el-input .el-input__inner {
    height: 32px;
  }
  .fd-pagination .el-pagination .btn-next:not(:disabled):hover,
  .fd-pagination .el-pagination .btn-prev:not(:disabled):hover,
  .fd-pagination .el-pagination .el-pager li:hover {
    border: 1px solid #409eff;
    color: #409eff;
  }
  .fd-pagination .el-pagination .btn-next:disabled,
  .fd-pagination .el-pagination .btn-prev:disabled {
    color: #c0c4cc;
    background-color: #f4f4f5;
  }
  .el-pagination button,
  .el-pagination span:not([class*=suffix]){
    height: 32px;
    line-height: 32px
  }
  .el-pagination .btn-next .el-icon,
  .el-pagination .btn-prev .el-icon{
    position: relative
  }
  .el-pagination .btn-next .el-icon{
    right: 2px;
  }
  .el-pagination .btn-prev .el-icon{
    left: 2px;
  }
</style>
