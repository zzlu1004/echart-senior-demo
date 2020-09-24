<template>
  <div class="app-container checkProject">
    <div class="container-inner bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="search">
        <el-row>
          <div class="time-panel f-left">
          <span v-if="$store.getters.globals.isIE">
            <el-date-picker
              type="date"
              value-format="yyyy-MM-dd"
              size="small"
              v-model="startTime"
              :clearable=false
              class="mr1"></el-date-picker>
              -
            <el-date-picker
            type="date"
            size="small"
            value-format="yyyy-MM-dd"
            v-model="endTime"
            :clearable=false
            class="ml1"
          ></el-date-picker>
          </span>
            <span v-else>
            <el-date-picker
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              size="small"
              v-model="startTime"
              :clearable=false
              class="mr1"></el-date-picker>
              -
            <el-date-picker
              type="date"
              size="small"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              v-model="endTime"
              :clearable=false
              class="ml1"
            ></el-date-picker>
          </span>
            <el-button class="ml3" type="primary" size="small" @click="refreshAll">查询</el-button>
          </div>
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
    name: 'loginLog',
    components: { fdTable, FdPagination },
    data() {
      return {
        total: 0,
        height: window.innerHeight - 60 + 'px',
        startTime: this.toStartDate(new Date(this.fd.tools.getNowTime())),
        endTime: this.toLocaleDate(new Date(this.fd.tools.getNowTime())),
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
              field: 'userName',
              title: '登录者',
              showOverflowTooltip: true
            },
            {
              field: 'loginName',
              title: '账号',
              width: '150px',
              showOverflowTooltip: true
            },
            {
              field: 'courtName',
              title: '法院',
              showOverflowTooltip: true
            },
            {
              field: 'createTime',
              title: '登录时间',
              showOverflowTooltip: true
            },
            {
              field: 'userAgent',
              title: '浏览器',
              showOverflowTooltip: true
            }
          ]
        }
      }
    },
    mounted() {
      this.searchLoginMes()
    },
    computed: {},
    methods: {
      toLocaleDate(time) {
        function addZero(num) {
          if (num < 10) {
            return '0' + num
          } else {
            return num
          }
        }
        const aaa = time.getDate() + ''
        if (aaa.length === 1) {
          this.nowDate = '0' + time.getDate()
        } else if (aaa.length === 2) {
          this.nowDate = time.getDate()
        }
        // 按自定义拼接格式返回
        return time.getFullYear() + '-' + addZero(time.getMonth() + 1) + '-' + this.nowDate
      },
      toStartDate(time) {
        return time.getFullYear() + '-01' + '-01'
      },
      refreshAll() {
        this.searchLoginMes()
      },
      currentChange(page) {
        this.offset = (page - 1) * this.limit
        this.searchLoginMes()
      },
      refreshUSer() {
        this.searchLoginMes()
      },
      sizeChange(limit) {
        this.offset = 0
        this.limit = limit
        this.searchLoginMes()
      },
      searchLoginMes() {
        this.loading = true
        this.fd.req({
          url: 'api/login/logs',
          method: 'get',
          data: {
            keyword: this.keyword,
            offset: this.offset,
            limit: this.limit,
            startTime: this.startTime,
            endTime: this.endTime
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
