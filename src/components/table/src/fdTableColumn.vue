<!-- by your name -->
<template>
    <el-table-column
        :prop='prop'
        :label='label'
        :width='width'
        :type='type'
        :fixed= 'fixed'
        :sortable='sortable'
        :resizable='resizable'
        :formatter= 'formatter'
        :align= 'align'
        >
      </el-table-column>
</template>

<script>
export default {
  name: 'FdTableColumn',
  data() {
    return {
    }
  },
  props: {
    prop: [String],
    label: [String],
    width: [String],
    type: [String],
    fixed: [String, Boolean],
    sortable: [Boolean, String],
    resizable: [Boolean],
    formatter: [Function],
    'show-overflow-tooltip': {
      type: Boolean,
      default: false
    },
    align: [String]
  },
  components: {},
  computed: {},
  methods: {}
}

</script>
<style lang='scss' scoped>
</style>