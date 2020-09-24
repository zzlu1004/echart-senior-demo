<template>
  <div class="app-container">
    <div class="container-inner bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <el-row>
        <el-col :span="12">
          <el-button v-if="elements.add" type="primary" size="small" @click="addRegulation"><i class="at icon-plus"/>新增细则</el-button>
          <span>&nbsp;</span>
        </el-col>
        <el-col :span="12" class="t-right">
          <div class="inline-block align-middle fd-search mr2 width-300px">
            <fd-search @search="getList"
                       v-model="blockName"></fd-search>
          </div>
          <div class="inline-block align-middle line-height-normal">
            <span>生效中</span>
            <el-popover
              placement="bottom-end"
              width="310"
              trigger="hover"
              content="当前所关联的方案正在生效周期中，为了保证考核方案的正常实施，系统暂时不开放对该方案相关的细则、指标、流程以及权重系数等进行编辑或删除操作。">
              <i slot="reference" class="at icon-questioncircle color-d9d9d9 pointer"/>
            </el-popover>
          </div>
        </el-col>
      </el-row>
      <fd-table
        className="mt2"
        emptyText="当前暂无细则，点击左上角添加细则"
        :highlightCurrentRow=true
        :loading="loading"
        :rowClick="rowClick"
        :default-sort="{prop: 'createTime', order: 'descending'}"
        :sortChange="handleSortChange"
        :data="lists">
        <el-table-column
          prop="name"
          show-overflow-tooltip
          width="400"
          class-name="pointer"
          label="细则名称">
          <template slot-scope="scope">
            <span class="color-link">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          width="150"
          sortable="custom"
          label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | parseTime("{y}-{m}-{d}")}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          width="150"
          sortable="custom"
          label="更新时间">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime | parseTime("{y}-{m}-{d}")}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          width="120"
          label="当前状态">
          <template slot-scope="scope">
            <span>{{statusName[scope.row.status]||scope.row.status}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="schemas"
          label="关联方案">
          <template slot-scope="scope">
            <div v-html="showSchemas(scope.row.schemas)"></div>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          :width="fd.tools.getStringWidth('操作3')"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click.stop="editRegulation(scope.row)" v-show="elements.edit" :disabled="scope.row.status === forbid">编辑</el-button>
            <el-button type="text" @click.stop="copyRegulation(scope.row)" v-show="elements.copy">复制</el-button>
            <el-button type="text" @click.stop="deleteRegulation(scope.row)" v-show="elements.delete" :disabled="scope.row.status === forbid">删除</el-button>
          </template>
        </el-table-column>
      </fd-table>
      <fd-pagination
        :limit="limit"
        :offset="offset"
        :currentChange="currentChange"
        :sizeChange="sizeChange"
        :sizes=true
        :total= "total"
      ></fd-pagination>
    </div>
  </div>
</template>

<script>
  import FdTable from 'fd/table/src/fdTable'
  import FdPagination from 'fd/pagination/pagination'
  import { statusName, statusColor } from '@/api/kpi/checkDepart/regulationDepart'
  import {
    currentChange,
    sizeChange,
    addRegulation,
    rowClick,
    getRegulationList,
    showSchemas,
    editRegulation,
    copyRegulation,
    refreshList,
    deleteRegulation,
    getList
  } from '@/api/kpi/checkDepart/regulationDepart'
  export default {
    name: 'regulationsDepart',
    components: { FdTable, FdPagination },
    props: {},
    data() {
      return {
        blockName: '',
        limit: 10,
        offset: 0,
        total: 0,
        lists: [],
        statusName,
        statusColor,
        forbid: 'active',
        loading: false,
        sort: 'createTime',
        order: 'descending'
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.regulationsDepart || {}
      }
    },
    mounted() {
    },
    activated() {
      this.refreshList()
    },
    methods: {
      refreshList,
      currentChange,
      sizeChange,
      addRegulation,
      rowClick,
      getRegulationList,
      showSchemas,
      editRegulation,
      copyRegulation,
      deleteRegulation,
      getList,
      handleSortChange({ column, prop, order }) {
        if (order) {
          this.sort = prop
          this.order = order
          this.getRegulationList({ orderField: prop, orderType: order })
        }
      }
    },
    watch: {}
  }
</script>

<style scoped>
</style>

