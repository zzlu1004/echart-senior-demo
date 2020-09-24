<template>
  <div class="app-container checkProject">
    <div class="container-inner bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="search">
        <el-row>
            <div class="f-right">
              <fd-search @search="refreshUSer" v-model="keyword"></fd-search>
            </div>
        </el-row>
      </div>
      <div class="mt2">
        <el-row>
          <el-col :span="24">
            <fd-table
              :loading="loading"
              :option="logDetail"
            ></fd-table>
          </el-col>
        </el-row>
      </div>
      <fd-pagination :limit="limit"
                     :offset="offset"
                     :currentChange="currentChange"
                     :sizeChange="sizeChange"
                     :sizes=true
                     :total= "total"></fd-pagination>
    </div>
  </div>
</template>
<script>
  import fdTable from 'fd/table'
  import FdPagination from 'fd/pagination/pagination'
  export default {
    name: '',
    components: { fdTable, FdPagination },
    data() {
      return {
        total: 0,
        height: window.innerHeight - 60 + 'px',
        limit: 10,
        offset: 0,
        keyword: '',
        loading: false,
        accordion: true,
        logDetail: {
          stripe: true,
          border: true,
          data: [],
          columns: [
            {
              field: 'requestMethod',
              title: '请求方式',
              width: this.fd.tools.getStringWidth('请求方式'),
              showOverflowTooltip: true
            },
            {
              field: 'uri',
              title: '请求地址',
              showOverflowTooltip: true
            },
            {
              field: 'queryParams',
              title: '请求参数',
              showOverflowTooltip: true
            },
            {
              field: 'requestIp',
              title: 'IP',
              width: '130px',
              showOverflowTooltip: true
            },
            {
              field: 'userId',
              title: '操作者',
              width: this.fd.tools.getStringWidth('操作者'),
              showOverflowTooltip: true
            },
            {
              field: 'userAgent',
              title: '操作浏览器版本',
              showOverflowTooltip: true
            },
            {
              field: 'requsetTime',
              title: '请求时间',
              showOverflowTooltip: true
            },
            {
              field: 'reponseTime',
              title: '响应时间',
              showOverflowTooltip: true
            },
            {
              field: 'reponseCode',
              title: '响应结果',
              width: this.fd.tools.getStringWidth('响应结果'),
              showOverflowTooltip: true
            }
          ]
        }
      }
    },
    mounted() {
      this.searchUser()
    },
    computed: {},
    methods: {
      currentChange(page) {
        this.offset = (page - 1) * this.limit
        this.searchUser()
      },
      refreshUSer() {
        this.offset = 0
        this.searchUser()
      },
      sizeChange(limit) {
        this.offset = 0
        this.limit = limit
        this.searchUser()
      },
      searchUser() {
        this.loading = true
        this.fd.req({
          url: '/api/operation/log',
          method: 'get',
          data: {
            keyword: this.keyword,
            offset: this.offset,
            limit: this.limit
          }
        }, 'uaa_url').then((d) => {
          this.logDetail.data = d.data.data
          this.total = d.data.total
          this.loading = false
        })
      }
    }
  }

</script>
