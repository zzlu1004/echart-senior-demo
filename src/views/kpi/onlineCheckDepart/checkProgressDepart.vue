<template>
  <div class="app-container">
    <div class="bg-white container-inner clearfix h14 level" :style="{'min-height':height}">

      <div class="tab-box">
        <el-tabs v-model="baseParams.type" type="card">
          <el-tab-pane label="考核进度" name="complete">
            <!--考核进度-->
            <div v-if="baseParams.type === 'complete'">
              <div class="clearfix mb2">
                  <span class="f-right btn btn-default btn-sm" @click="downloadTable">
                      <i class="at icon-download"/>
                      下载
                  </span>
                <span class="f-right mr3" v-show="baseParams.type === 'complete'" >
                    <fd-search @search="searchByKeyword" v-if="baseParams.type === 'complete'"
                               v-model="searchVal"></fd-search>
                  </span>
              </div>
              <fd-table
                :loading="loading"
                :option="levelOption"
                :sortChange="sortByNum" :sortable=true
              ></fd-table>
              <fd-pagination
                :limit="params.limit"
                :offset="params.offset"
                :total="total"
                sizes="sizes"
                :currentChange="currentChange"
                :sizeChange="sizeChange">
              </fd-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="待办进度" name="approve">
            <!-- 待办进度 -->
            <div  v-if="baseParams.type === 'approve'">
              <div class="clearfix mb2">
            <span class="f-right btn btn-default btn-sm" @click="downloadTable">
                <i class="at icon-download"/>
                下载
            </span>
                <span class="f-right mr3" v-show="baseParams.type === 'approve'">
              <fd-search @search="searchByKeyword2" v-if="baseParams.type === 'approve'"
                         v-model="searchVal2"></fd-search>
            </span>
              </div>
              <fd-table
                :loading="loading2"
                :option="todoOption"
                :sortChange="sortByNum2" :sortable=true
              ></fd-table>
              <fd-pagination
                :limit="params2.limit"
                :offset="params2.offset"
                :total="total2"
                sizes="sizes"
                :currentChange="currentChange2"
                :sizeChange="sizeChange2">
              </fd-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="select-up">
          <el-row>
            <el-button class="ml3 f-right" size="small" type="primary" @click="getAllTables">查询</el-button>
            <el-col class="pl2 f-right" :span="10">
              <div class="absolute pr1 py1">考核类别：</div>
              <div class="except-w4-full">
                <el-select
                  v-model="baseParams.schemaBlockType"
                  placeholder="请选择"
                  size="small">
                  <el-option
                    v-for="item in schemaBlockTypeOpt"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col class="pl2 f-right" :span="10">
              <div class="absolute pr1 py1">方案：</div>
              <div class="except-w2-full">
                <el-select class="full"
                           size="small"
                           v-model="baseParams.schemaId"
                           placeholder="请选择">
                  <el-option
                    v-for="item in schemaOpt"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import fdTable from 'fd/table'
  import FdPagination from 'fd/pagination/pagination'
  import { searchByKeyword, currentChange, sizeChange, getActiveSchemas, getCompletes, getTodos,
    downloadTable, sortByNum, sortByNum2, currentChange2, sizeChange2, searchByKeyword2,
    getAllTables } from '@/api/kpi/onlineCheckDepart/checkProgressDepart'
  export default {
    name: 'checkProgressDepart',
    data() {
      const completeFields = [
        {
          field: 'departType',
          title: '部门类型'
        },
        {
          field: 'departName',
          title: '部门'
        },
        {
          field: 'schemaBlockTypeName',
          title: '考核类别'
        },
        {
          field: 'blockName',
          title: '考核细则名称'
        },
        {
          field: 'progressRat',
          title: '考核进度',
          sortable: 'custom',
          formatter: (row, value) => {
            return row.progress + '/' + row.progressTotal
          }
        }
      ]
      const todoFields = [
        {
          field: 'departType',
          title: '部门类型'
        },
        {
          field: 'departName',
          title: '部门'
        },
        {
          field: 'staffName',
          title: '姓名'
        },
        {
          field: 'chairName',
          title: '部门正副职'
        },
        {
          field: 'typeName',
          title: '人员类型'
        },
        {
          field: 'schemaBlockTypeName',
          title: '考核类别'
        },
        {
          field: 'blockName',
          title: '考核细则名称'
        },
        {
          field: 'progressRat',
          title: '待办进度',
          sortable: 'custom',
          formatter: (row, value) => {
            return row.progress + '/' + row.progressTotal
          }
        }
      ]
      return {
        height: (this.$store.getters.globals.height - 100) + 'px',
        searchVal: '',
        searchVal2: '',
        loading: false,
        loading2: false,
        total2: 0,
        total: 0,
        baseParams: {
          schemaId: '',
          schemaBlockType: 'k10015-01',
          type: 'complete'
        },
        params: {
          limit: 10,
          offset: 0,
          keyword: '',
          type: 'complete',
          orderField: '',
          orderType: ''
        },
        params2: {
          limit: 10,
          offset: 0,
          keyword: '',
          type: 'approve',
          orderField: '',
          orderType: ''
        },
        schemaOpt: [],
        schemaBlockTypeOpt: [],
        schemaBlockMap: {
          'k10015-01': '综合绩效',
          'k10015-02': '审判绩效',
          'k10015-03': '民主测评',
          'k10015-04': '新民主测评'
        },
        schemaMap: {},
        levelOption: {
          stripe: true,
          border: true,
          data: [],
          columns: completeFields
        },
        todoOption: {
          stripe: true,
          border: true,
          data: [],
          columns: todoFields
        }
      }
    },
    components: {
      fdTable, FdPagination
    },
    methods: {
      searchByKeyword, currentChange, sizeChange, getActiveSchemas, getCompletes, getTodos,
      downloadTable, sortByNum, sortByNum2, currentChange2, sizeChange2, searchByKeyword2, getAllTables
    },
    mounted() {
      // 如果没有给这个用户配置综合绩效 审判绩效
      if (this.elements['k10015-01']) {
        this.baseParams.schemaBlockType = 'k10015-01'
      } else if (this.elements['k10015-02']) {
        this.baseParams.schemaBlockType = 'k10015-02'
      } else if (this.elements['k10015-03']) {
        this.baseParams.schemaBlockType = 'k10015-03'
      } else if (this.elements['k10015-04']) {
        this.baseParams.schemaBlockType = 'k10015-04'
      } else {
        this.baseParams.schemaBlockType = ''
      }
      if (this.elements['k10015-01']) {
        this.schemaBlockTypeOpt.push({
          id: 'k10015-01',
          name: '综合绩效'
        })
      }
      if (this.elements['k10015-02']) {
        this.schemaBlockTypeOpt.push({
          id: 'k10015-02',
          name: '审判绩效'
        })
      }
      if (this.elements['k10015-03']) {
        this.schemaBlockTypeOpt.push({
          id: 'k10015-03',
          name: '民主测评'
        })
      }
      if (this.elements['k10015-04']) {
        this.schemaBlockTypeOpt.push({
          id: 'k10015-04',
          name: '新民主测评'
        })
      }
      this.getActiveSchemas()
    },
    computed: {
      elements() {
        return this.$store.getters.elements.checkProgressDepart || {}
      }
    },
    watch: {
    }
  }
</script>

<style lang="scss">
  .level {
    .el-form-item{
      margin-bottom:0;
    }
  }
</style>
