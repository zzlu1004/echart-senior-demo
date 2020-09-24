<template>
  <div>
    <div class="clearfix">
      <!-- 左侧配置 -->
      <div class="f-left">
        <slot name="leftOpt">
          <div v-if="leftOpt">
            <head-option :btnOption="leftOpt.btnOpt" type="left"></head-option>
          </div>
        </slot>
      </div>
      <!-- 右侧配置 -->
      <div class="f-right">
        <slot name="rightOpt">
          <div v-if="rightOpt">
            <head-option :btnOption="rightOpt.btnOpt" type="right"></head-option>
          </div>
        </slot>
      </div>
    </div>
    <!-- 表格 -->
    <slot name="tableOpt" class="mt1">
      <div v-if="tableOpt" class="mt1">
        <fd-table :ref="tableOpt.ref" :option="tableOpt"
                  @cellClick="tableOpt.cellClick"
                  :defaultSort="tableOpt.defaultSort"
                  :sortChange="tableOpt.sortChange"
                  :sortable="tableOpt.sortable"></fd-table>
        <!-- 分页配置 -->
        <fd-pagination
          class="mb3"
          v-if="paginationOpt.total"
          :limit="params.limit"
          :total="paginationOpt.total"
          :offset="params.offset"
          sizes="sizes"
          :pageArr="[10,20,30,40,50]"
          :currentChange="currentChange"
          :sizeChange="sizeChange">
        </fd-pagination>
      </div>
    </slot>
  </div>
</template>

<script>
  import FdPagination from 'fd/pagination/pagination'
  import fdTable from 'fd/table'
  import headOption from './headOption'
  export default {
    name: 'complexTable',
    components: {
      fdTable, FdPagination, headOption
    },
    props: {
      // 表格数据配置
      tableOpt: {
        type: Object
      },
      // 左侧配置
      leftOpt: {
        type: Object
      },
      // 右侧配置
      rightOpt: {
        type: Object
      },
      // 分页配置
      paginationOpt: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data() {
      return {
        total: 0,
        params: {
          offset: 0,
          limit: 10
        }
      }
    },
    mounted() {
      if (this.paginationOpt.limit) {
        this.params.limit = this.paginationOpt.limit
      }
    },
    computed: {
      // params() {
      //   return {
      //     offset: 0,
      //     limit: this.paginationOpt.limit ? this.paginationOpt.limit : 10
      //   }
      // }
    },
    methods: {
      currentChange(val) {
        this.params.offset = (val - 1) * this.params.limit
        this.$emit('refreshTable', this.params)
      },
      sizeChange(val) {
        this.params.limit = val
        this.params.offset = 0
        this.$emit('refreshTable', this.params)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
</style>
