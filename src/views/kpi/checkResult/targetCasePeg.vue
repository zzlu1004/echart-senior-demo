<template>
  <div class="app-container">
    <div class="container-inner has-fixed-bottom bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="pb2 bd-dashed-bottom">
        <div class="color-title bold h24 pb2">
          {{selfMsg.departName}}
        </div>
        <div>
          <el-row>
            <el-col :span="8">
              <span>统计时间：</span>
              <span>{{params.startTime+'至'+params.endTime}}</span>
            </el-col>
            <el-col :span="8">
              <span>{{selfMsg.index}}：</span>
              <span>{{selfMsg.value}}</span>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="clearfix py2">
        <span class="f-left">
          <el-popover
              placement="right"
              width="226"
              ref="popover"
            >
            <div class="scroll-body">
              <el-checkbox-group v-model="checkedCols" @change="changeCols">
                <div class="pb1" v-for="cols of checkbox" :key="cols.field">
                  <el-checkbox :label="cols.field">{{cols.title}}</el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
            </el-popover>
            <el-button size="small" v-popover:popover>自定义列表</el-button>
        </span>
        <span class="f-right btn btn-default btn-sm" @click="downloadTable(exportType)">
            <i class="at icon-download"/>
            下载
        </span>
        <span class="f-right mr3">
           <fd-search @search="searchByKeyword"
                      v-model="val"></fd-search>
        </span>
      </div>
      <div>
        <fd-table :loading="loading" :option="caseOpt" :sortChange="sortByNum" :sortable=true></fd-table>
      </div>
      <fd-pagination
        :limit="params.limit"
        :total="total"
        :offset="params.offset"
        sizes="sizes"
        :pageArr="[10,20,30,40,50]"
        :currentChange="currentChange"
        :sizeChange="sizeChange">
    </fd-pagination>
      <div class="fixed-bottom">
        <div class="fixed-bottom-item" @click="goBack">
          <div class="fixed-bottom-item-text">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import fdTable from 'fd/table'
  import FdPagination from 'fd/pagination/pagination'
  import { goBack } from '@/api/common'
  import { downloadTable, getAllResult, sortByNum, refreshAllResult } from '@/api/kpi/checkResult/targetCasePeg'
  import { searchByKeyword, currentChange, sizeChange, changeCols, getColumns } from '@/api/kpi/performance/caseCountPeg'
  export default {
    name: '',
    components: {
      fdTable, FdPagination
    },
    props: {},
    data() {
      return {
        val: '',
        pageSize: 10,
        total: 0,
        loading: false,
        checkedCols: [], // 已勾选的表头
        checkbox: [], // 自定义列表的所有表头数据
        checkboxName: [],
        cParams: {
          keyword: '',
          limit: 10,
          offset: 0
        },
        params: {},
        columsObj: {
          'case': {},
          'workload': {}
        },
        caseOpt: {
          stripe: true,
          border: true,
          data: [],
          columns: []
        },
        pParams: {},
        selfMsg: {},
        type: '',
        kpiType: '', // 明细报表新系统测算指标反查
        indexId: ''
      }
    },
    computed: {},
    mounted() {
      this.type = this.$route.query.type || ''
      this.kpiType = this.$route.query.kpiType || ''
      this.indexId = this.$route.query.id || ''
      this.pParams = JSON.parse(localStorage.getItem('params'))
      this.selfMsg = this.pParams.selfMsg
      this.params = this.fd.tools.merge(true, {}, this.cParams, this.pParams.params)
      this.refreshAllResult()
    },
    methods: {
      searchByKeyword, currentChange, sizeChange, getAllResult, downloadTable, changeCols, getColumns, goBack,
      sortByNum, refreshAllResult
    },
    watch: {}
  }
</script>

<style lang="scss" scoped>
.scroll-body{
  max-height:300px;
  overflow-y: auto;
}
</style>
