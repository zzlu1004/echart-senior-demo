<template>
  <div class="app-container">
    <div class="container-inner has-fixed-bottom bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="pb2 bd-dashed-bottom">
        <div v-if="resource === 'center_workQe'" class="color-title bold h24 pb2">
          {{userName}}
        </div>
        <div v-else class="color-title bold h24 pb2">
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
      <div class="clearfix py2 table-search">
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
  import { searchByKeyword, currentChange, sizeChange, getAllResult, refreshAllResult,
    changeCols, getColumns, downloadTable, sortByNum } from '@/api/kpi/qualityEfficiency/workQeTargetPeg'
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
          offset: 0,
          id: ''
        },
        pageMap: {
          'zb002': '办案公正',
          'zb003': '办案效率',
          'zb004': '办案效果',
          'zb005': '司法公开'
        },
        typeMap: {
          'year': '年度',
          'month': '月度',
          'depart': '部门',
          'judge': '员额法官'
        },
        params: {},
        columsObj: {
          'year': {},
          'month': {},
          'depart': {},
          'judge': {}
        },
        exportType: '',
        caseOpt: {
          stripe: true,
          border: true,
          data: [],
          columns: []
        },
        pParams: {},
        selfMsg: {},
        type: '',
        resource: '',
        fileName: ''
      }
    },
    computed: {},
    mounted() {
      this.type = this.$route.query.type || ''
      // resource === center_workQe 表示是从我的档案 或者是档案查询 工作质效反查 标题显示为人名
      this.resource = this.$route.query.resource || ''
      this.pParams = JSON.parse(localStorage.getItem('params'))
      this.selfMsg = this.pParams.selfMsg
      this.cParams.id = this.$route.query.id || ''
      this.params = this.fd.tools.merge(true, {}, this.cParams, this.pParams.params)
      this.userName = this.selfMsg.userName || this.$store.getters.user.userName
      this.refreshAllResult()
    },
    methods: {
      searchByKeyword, currentChange, sizeChange, getAllResult, downloadTable, changeCols, getColumns, goBack,
      sortByNum, refreshAllResult
    },
    watch: {}
  }
</script>

<style lang="scss">
.width-260px {
  width:260px;
}
.scroll-body{
  max-height:300px;
  overflow-y: auto;
}
</style>
