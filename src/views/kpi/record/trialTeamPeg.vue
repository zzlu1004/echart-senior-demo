<template>
  <div class="app-container">
    <div class="container-inner has-fixed-bottom bg-white case-count-peg" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="pb2 bd-dashed-bottom">
        <div class="color-title pb3">
          <el-row>
            <el-col :span="8" v-if="selfMsg.judgeNames">
              <div class="h24 bold pb2">合议庭成员</div>
              <div class="h16 bold pr3" style="line-height: 24px;" >{{selfMsg.judgeNames}}</div>
            </el-col>
            <el-col :span="8" v-if="selfMsg.assistantNames">
              <div class="h24 bold pb2">法官助理</div>
              <div class="h16 bold pr3" style="line-height: 24px;" >{{selfMsg.assistantNames}}</div>
            </el-col>
            <el-col :span="8" v-if="selfMsg.clerkNames">
              <div class="h24 bold pb2">书记员</div>
              <div class="h16 bold pr3"  style="line-height: 24px;" >{{selfMsg.clerkNames}}</div>
            </el-col>
          </el-row>
        </div>
        <div>
          <el-row>
            <el-col :span="8">
              <div>
                <span>统计时间：</span>
                <span>{{params.startTime+'至'+params.endTime}}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <span>{{selfMsg.index}}：</span>
                <span>{{selfMsg.value}}</span>
              </div>
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
        <span class="f-right btn btn-default btn-sm" @click="downloadTable()">
            <i class="at icon-download"/>
            下载
        </span>
        <span class="f-right mr3">
          <fd-search @search="searchByKeyword" v-model="val"></fd-search>
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
  import { searchByKeyword, currentChange, sizeChange, getAllResult,
    changeCols, getColumns, downloadTable, sortByNum, refreshAllResult } from '@/api/kpi/record/trialTeamPeg'
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
        checkedCols: [], // 已勾选的表头
        checkbox: [], // 自定义列表的所有表头数据
        checkboxName: [],
        cParams: {
          keyword: '',
          limit: 10,
          offset: 0,
          departId: ''
        },
        typeMap: {
          'year': '年度',
          'month': '月度',
          'depart': '部门',
          'person': '个人',
          'judge': '员额法官',
          'assistant': '法官助理',
          'clerk': '书记员',
          'index': '案件权重系数'
        },
        params: {},
        columsObj: {},
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
        fileName: '',
        loading: false
      }
    },
    computed: {},
    mounted() {
      this.cParams = {
        keyword: '',
        limit: 10,
        offset: 0,
        groupId: this.$route.query.id || ''
      }
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

<style lang="scss">
.width-260px {
  width:260px;
}
.scroll-body{
  max-height:300px;
  overflow-y: auto;
}
</style>
