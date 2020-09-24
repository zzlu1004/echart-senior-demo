<template>
  <div class="app-container notice">
    <div class="container-inner bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="tab-box tab-box-mar">
        <el-tabs v-model="type" type="card" v-if="elements.all || elements.my">
          <el-tab-pane v-if="elements.all" label="全部" name="all">
            <div v-show="elements.all && type==='all'">
              <div class="my2 hidden">
                <el-button v-if="elements.my" size="small" class="f-right ml2" type="primary" @click="addNotice">发布新公告</el-button>
                <span v-if="elements.all" class="f-right">
                <fd-search v-if="type==='all'" @search="searchByKeyword"
                           v-model="val1"></fd-search>
              </span>
              </div>
              <div>
                <fd-table
                  :option="noticeOption"
                  @cellClick="seeDetail"
                ></fd-table>
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
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="elements.my" label="我的" name="my">
            <div v-show="elements.my && type==='my'">
              <div class="my2 hidden">
                <el-button v-if="elements.my" size="small" class="f-right ml2" type="primary" @click="addNotice">发布新公告</el-button>
                <span v-if="elements.my" class="f-right">
                <fd-search v-if="type==='my'" @search="searchByKeyword"
                           v-model="val2"></fd-search>
              </span>
              </div>
              <div class="mb2">
                <fd-table
                  :option="myOption"
                  @cellClick="seeDetail"
                ></fd-table>
              </div>
              <fd-pagination
                :limit="myParams.limit"
                :total="myTotal"
                :offset="myParams.offset"
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
  import FdTable from 'fd/table'
  import FdPagination from 'fd/pagination/pagination'
  import { getNoticeList, getMyNotice, addNotice, editNotice, deleteNotice, searchByKeyword,
    currentChange, sizeChange, recallNotice, seeDetail } from '@/api/kpi/center/notice'
  export default {
    name: 'notice',
    components: {
      FdTable, FdPagination
    },
    props: {},
    data() {
      return {
        type: 'all',
        params: {
          keyword: '',
          limit: 10,
          offset: 0,
          type: 'bulletin',
          projectCode: 'kpi'
        },
        myParams: {
          keyword: '',
          limit: 10,
          offset: 0,
          type: 'bulletin',
          projectCode: 'kpi'
        },
        schema: {},
        typesMap: {
          'all': '全部',
          'my': '我的'
        },
        tableObj: {
          'all': [],
          'my': []
        },
        pageSize: 10,
        total: 0,
        myTotal: 0,
        fileName: '',
        val1: '',
        val2: '',
        noticeOption: {
          stripe: true,
          border: true,
          data: [],
          columns: [
            {
              field: 'title',
              title: '标题',
              showOverflowTooltip: true,
              formatter: (row, value) => {
                return '<span class="color-blue pointer">' + value + '</span>'
              }
            },
            {
              field: 'releaseDate',
              title: '发布时间'
            },
            {
              field: 'releaseName',
              title: '发布者'
            },
            {
              field: 'attCount',
              title: '附件',
              align: 'right',
              width: '180px'
            },
            {
              field: 'readFlag',
              title: '状态',
              width: '180px',
              formatter: (row, value) => {
                const statusMap = {
                  '1': '已读',
                  '0': '未读'
                }
                return statusMap[value]
              }
            }
          ]
        },
        myOption: {
          stripe: true,
          border: true,
          data: [],
          columns: [
            {
              field: 'title',
              title: '标题',
              showOverflowTooltip: true,
              formatter: (row, value) => {
                return '<span class="color-blue pointer">' + value + '</span>'
              }
            },
            {
              field: 'releaseDate',
              title: '发布时间',
              formatter: (row, value) => {
                return row.status === '4' ? '--' : value
              }
            },
            {
              field: 'attCount',
              title: '附件',
              align: 'right',
              width: '150px'
            },
            {
              field: 'status',
              title: '状态',
              width: '150px',
              formatter: (row, value) => {
                const statusMap = {
                  '0': '未读',
                  '1': '已读',
                  '2': '已删除',
                  '3': '已撤回',
                  '4': '草稿',
                  '5': '待发布',
                  '6': '已发布'
                }
                return statusMap[value]
              }
            },
            {
              field: 'readCount',
              title: '已读',
              align: 'right',
              width: '150px',
              formatter: (row, value) => {
                return row.status === '4' ? '--' : value
              }
            },
            {
              field: '',
              title: '操作',
              width: this.fd.tools.getStringWidth('操作2'),
              number: [
                { text: '编辑', type: 'text', show: 'isedit', click: (d, row) => { this.editNotice(row) } },
                { text: '撤回', type: 'text', show: 'isrecall', click: (d, row) => { this.recallNotice(row) } },
                { text: '删除', type: 'text', show: 'isdelete', click: (d, row) => { this.deleteNotice(row) } }
              ]
            }
          ]
        }
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.notice || {}
      }
    },
    mounted() {
      if (this.elements.all) {
        this.type = 'all'
      } else if (this.elements.my) {
        this.type = 'my'
      }
    },
    activated() {
      this.getNoticeList()
      this.getMyNotice()
    },
    methods: {
      getNoticeList, getMyNotice, addNotice, editNotice, deleteNotice, searchByKeyword, currentChange,
      sizeChange, recallNotice, seeDetail
    },
    watch: {
    }
  }
</script>

<style lang="scss">
</style>
