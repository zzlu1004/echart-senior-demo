<!-- by your name -->
<template>
  <div :class = 'className'>
       <el-table
        v-loading="loading"
        element-loading-text="数据正在加载中"
        :ref="refName"
        :data="data"
        :height='height'
        :border="border"
        :empty-text="emptyText"
        :size="size"
        :default-sort="defaultSort"
        :highlight-current-row="highlightCurrentRow"
        @sort-change="sortChange"
        @select="select"
        @selection-change="selectionChange"
        @row-click="rowClick"
        @cell-click="cellClick"
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
    'cellClick': {
      type: Function,
      default: function() {}
    },
    'selectionChange': {
      type: Function,
      default: function() {}
    },
    size: {
      type: String
    },
    refName: {
      type: String
    },
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    loading: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
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
    },
    defaultSort: Object
  },
  components: {},
  computed: {},
  methods: {}
}

</script>
<style lang='scss'>
  .el-table--scrollable-y .el-table__body-wrapper {
    overflow: auto;
  }
  .con-left-center .el-col-14{
    height: 180px;
  }
</style>
