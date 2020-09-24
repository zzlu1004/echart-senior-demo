<template>
  <div class="app-container checkProject">
    <div :style="{'min-height': $store.getters.globals.height - 100 + 'px'}" class="container-inner bg-white">
      <div class="search">
        <el-row>
          <div class="time-panel f-left">
          <span v-if="$store.getters.globals.isIE">
            <el-date-picker
              :clearable=false
              class="mr1"
              size="small"
              type="date"
              v-model="startTime"
              value-format="yyyy-MM-dd"></el-date-picker>
              -
            <el-date-picker
              :clearable=false
              class="ml1"
              size="small"
              type="date"
              v-model="endTime"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </span>
            <span v-else>
            <el-date-picker
              :clearable=false
              class="mr1"
              placeholder="选择日期"
              size="small"
              type="date"
              v-model="startTime"
              value-format="yyyy-MM-dd"></el-date-picker>
              -
            <el-date-picker
              :clearable=false
              class="ml1"
              placeholder="选择日期"
              size="small"
              type="date"
              v-model="endTime"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </span>
            <el-button @click="refreshAll" class="ml3" size="small" type="primary">查询</el-button>
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
              :option="versionDetail"
            ></fd-table>
          </el-col>
        </el-row>
      </div>
      <fd-pagination :currentChange="currentChange"
                     :limit="limit"
                     :offset="offset"
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
    name: 'sysVersion',
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
        versionDetail: {
          stripe: true,
          border: true,
          data: [],
          columns: [
            {
              field: 'name',
              title: '版本名称',
              width: '150px',
              showOverflowTooltip: true
            },
            {
              field: 'versionNumber',
              title: '版本编号',
              width: '150px',
              showOverflowTooltip: true
            },
            {
              field: 'content',
              title: '版本内容',
              showOverflowTooltip: true
            },
            {
              field: 'createTime',
              title: '创建时间',
              width: '200px',
              showOverflowTooltip: true
            },
            {
              field: 'createUser',
              title: '创建人',
              width: '150px',
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
          url: 'api/sysversion',
          method: 'get',
          data: {
            keyword: this.keyword,
            offset: this.offset,
            limit: this.limit,
            startTime: this.startTime,
            endTime: this.endTime
          }
        }).then((d) => {
          this.versionDetail.data = d.data.data
          this.total = d.data.total
          this.loading = false
        })
      }
    }
  }

</script>
