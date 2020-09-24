<template>
   <div :class="isComponent?'':'app-container'">
    <div
      class="bg-white"
      :class="isComponent?'pt2':'container-inner'"
      :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="tab-box tab-box-mar">
        <el-tabs v-model="type" type="card">
          <el-tab-pane label="年度" name="year">
            <div v-show="type==='year'">
              <div class="clearfix py2 table-search">
                <span class="f-right btn btn-default btn-sm" @click="downloadTable('analysis-depart')">
                    <i class="at icon-download"/>
                    下载
                </span>
                <span class="f-right mr3">
                  <fd-search v-if="type === 'year'" @search="searchByKeyword" v-model="val"></fd-search>
                </span>
              </div>
              <div>
                <fd-table :option="yearOpt" @cellClick="countPeg" :sortChange="sortByNum" :sortable=true></fd-table>
              </div>
              <fd-pagination
                :limit="yearParams.limit"
                :total="yearTotal"
                :offset="yearParams.offset"
                sizes="sizes"
                :pageArr="[10,20,30,40,50]"
                :currentChange="currentChange"
                :sizeChange="sizeChange">
              </fd-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="月度" name="month">
            <div v-show="type==='month'">
              <div class="clearfix py2 table-search">
                <span class="f-right btn btn-default btn-sm" @click="downloadTable">
                    <i class="at icon-download"/>
                    下载
                </span>
                <span class="f-right mr3">
                  <fd-search v-if="type === 'month'" @search="searchByKeyword" v-model="val2"></fd-search>
                </span>
              </div>
              <div>
                <fd-table :option="monthOpt" @cellClick="countPeg" :sortChange="sortByNum" :sortable=true></fd-table>
              </div>
              <fd-pagination
                :limit="monthParams.limit"
                :total="monthTotal"
                :offset="monthParams.offset"
                sizes="sizes"
                :pageArr="[10,20,30,40,50]"
                :currentChange="currentChange"
                :sizeChange="sizeChange">
              </fd-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import fdTable from 'fd/table'
  import FdPagination from 'fd/pagination/pagination'
  import { handleSelect, countPeg, currentChange, sizeChange, searchByKeyword, downloadTable, refreshCondition,
    refreshStudyAll, getMonthTotal, getYearTotal, getColumns, sortByNum } from '@/api/kpi/newRecord/studyDevelop'
  export default {
    name: 'studyDevelop',
    components: {
      fdTable, FdPagination
    },
    props: {
      isComponent: {
        type: Boolean,
        default: false
      },
      userId: {
        type: String,
        default: ''
      },
      userName: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        typeMap: {
          'year': '年度',
          'month': '月度'
        },
        menuMap: {
          'punish': '工作奖惩',
          'study': '学习拓展'
        },
        columsObj: {
          'study': {
            'name': '统计周期',
            'trainCount': '调训培训',
            'fgpxCount': '法官培训',
            'jobCount': '干部兼职'
          }
        },
        type: 'year',
        page: 'study',
        yearParams: {
          type: 'year',
          keyword: '',
          orderField: '',
          orderType: '',
          offset: 0,
          limit: 10
        },
        params: {},
        monthParams: {
          type: 'month',
          keyword: '',
          orderField: '',
          orderType: '',
          offset: 0,
          limit: 10
        },
        monthTotal: 0,
        yearTotal: 0,
        val: '',
        val2: '',
        columnsJudge: [],
        columns: [],
        monthOpt: {
          stripe: true,
          border: true,
          data: [],
          columns: []
        },
        yearOpt: {
          stripe: true,
          border: true,
          data: [],
          columns: []
        }
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.studyDevelop || {}
      }
    },
    mounted() {
      this.refreshStudyAll()
    },
    methods: {
      handleSelect, countPeg, currentChange, sizeChange, searchByKeyword, downloadTable, refreshStudyAll, getMonthTotal,
      getYearTotal, getColumns, sortByNum, refreshCondition
    },
    watch: {
    }
  }
</script>

<style lang="scss">
.page-inner{
  padding: 24px 0;
}
.time-panel{
  top: 16px;
  left: 0;
}
</style>
