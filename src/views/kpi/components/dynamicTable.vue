<template>
  <div>
    <fd-table
      className="mt2"
      emptyText="当前暂无数据"
      height="500px"
      :sortChange="sortChange"
      :data="data">
      <dynamic-table-item
        v-bind:data="item"
        v-bind:isShow="isShow"
        v-bind:weightName="weightName"
        v-bind:weightId="weightId"
        v-bind:weightmodelId="weightmodelId"
        v-bind:timeRange="timeRange"
        v-bind:typeId="typeId"
        v-bind:selectItem="selectItem"
        v-bind:fixed="index === 0"
        v-for="(item, index) of tableHead"
        :key="index">
      </dynamic-table-item>
    </fd-table>
  </div>
</template>

<script>
  import FdTable from 'fd/table/src/fdTable'
  import DynamicTableItem from './dynamicItem.vue'
  export default {
    name: 'FdDynamicTable',
    components: { FdTable, DynamicTableItem },
    props: {
      isShow: {
        type: Boolean,
        default: true
      },
      heads: {
        type: Array
      },
      timeRange: {
        type: Array
      },
      selectItem: {
        type: Object
      },
      data: {
        type: Array,
        default: () => {
          return []
        }
      },
      weightId: { // 左侧树的id
        type: String
      },
      weightName: {
        type: String
      },
      weightmodelId: { // 左侧树的id
        type: String
      },
      typeId: { // 左侧树的id
        type: String
      }
    },
    data() {
      return {
        tableHead: []
      }
    },
    computed: {},
    mounted() {
      this.tableHead = this.heads
    },
    methods: {
      sortChange(column) {
        this.$emit('sort', column)
      }
    },
    watch: {
      heads(data) {
        this.tableHead = data
      }
    }
  }
</script>

<style scoped>
</style>
