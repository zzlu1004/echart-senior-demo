<!-- by your name -->
<template>
  <div :class = 'className'>
       <el-table
         :ref="refName"
         :data="data"
         :height='height'
         :border="border"
         :empty-text="emptyText"
         :size="size"
         :highlight-current-row="highlightCurrentRow"
         @sort-change="sortChange"
         @select="select"
         @selection-change="selectionChange"
         @row-click="rowClick"
         :stripe="stripe"
         >
        <slot></slot>
       </el-table>
  </div>
</template>

<script>
export default {
  name: 'FdTable',
  data() {
    return {
      tableData: []
    }
  },
  props: {
    data: [Array],
    height: [String, Number],
    sortable: [String, Boolean],
    'sortChange': {
      type: Function,
      default: function() {}
    },
    'select': {
      type: Function,
      default: function() {}
    },
    'rowClick': {
      type: Function,
      default: function() {}
    },
    'selectionChange': {
      type: Function,
      default: function() {}
    },
    size: {
      type: String,
      default: 'mini'
    },
    refName: {
      type: String
    },
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    className: {
      type: String,
      default: 'app-container'
    },
    border: {
      type: Boolean,
      default: true
    },
    stripe: {
      type: Boolean,
      default: true
    },
    'highlightCurrentRow': {
      type: Boolean,
      default: false
    }
  },
  components: {},
  computed: {},
  methods: {}
}

</script>
<style lang='scss' scoped>
  @import '../../../styles/variables.scss';
  .righ-container .el-table__empty-block {
    min-height:60px!important;
  }
  .app-container {
     background-color: transparent;
     /*padding: 0;*/
  }
  // el-table 白色背景删除
  .el-table {
    background-color: transparent;
    /*<!--color: $c-text-bg-->*/
  }
  .el-table--border th, .el-table--border td {
    /*border-right:none;*/
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    /*background: #0c295b;*/
  }
  .el-table--striped .el-table__body tr.el-table__row--striped.current-row td{
    /*background: #0c295b;*/
  }
  .el-table__body tr.current-row > td{
    background: transparent;
  }
  .el-table th.is-leaf {
    /*border-bottom: none;*/
  }
  .el-table td {
    /*border-bottom: none;*/
  }
  .el-table tr{
    background-color: transparent;
  }
  .el-table thead tr{
    background-color: transparent;
  }
  .el-table  tr th{
    padding: 5px 0;
    /*background: #0c295b;*/
  }
  .el-table  tr td{
    padding: 5px 0;
  }
  .el-table tr {
    background-color: transparent;
  }
  .el-table thead{
    /*<!--color: $c-text-bg;-->*/
  }
  .el-table::before {
    height: 0px;
  }
  .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: transparent;
  }
  .el-table th {
    /*text-align: center;*/
  }
  .el-table th.is-leaf {
    /*border: none;*/
  }
  .el-table--group, .el-table--border {
    /*border:none;*/
  }
  .app-container {
    /*border: none;*/
  }
  .el-table--scrollable-y .el-table__body-wrapper {
    overflow: auto;
  }
  .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
    /*display: none;*/
    /*color: #2f91d2;*/
  }
</style>
