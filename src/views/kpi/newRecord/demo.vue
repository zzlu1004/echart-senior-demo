<template>
  <div class="app-container">
    <div class="container-inner bg-white other-work" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div>
        <span class="inline-block">
          <span v-if="$store.getters.globals.isIE">
            <el-date-picker
              type="month"
              size="small"
              value-format="yyyy-MM"
              v-model="params.startTime"
              :clearable=false
              class="mr1"></el-date-picker>
              -
            <el-date-picker
            type="month"
            size="small"
            value-format="yyyy-MM"
            v-model="params.endTime"
            :clearable=false
            class="ml1"
            ></el-date-picker>
          </span>
          <span v-else>
            <el-date-picker
              type="month"
              size="small"
              value-format="yyyy-MM"
              placeholder="选择日期"
              v-model="params.startTime"
              :clearable=false
              class="mr1"></el-date-picker>
              -
            <el-date-picker
            type="month"
            size="small"
            value-format="yyyy-MM"
            placeholder="选择日期"
            v-model="params.endTime"
            :clearable=false
            class="ml1"
            ></el-date-picker>
          </span>
        </span>
        <el-button class="ml3" type="primary" size="small" @click="refreshAll">查询</el-button>
      </div>
      <div class="relative">
        <div v-show="elements.person">
          <div class="mt2">
            <complex-table
              ref="personOption"
              :tableOpt="personOpt" 
              :rightOpt="rightOpt" 
              :leftOpt="leftOpt" 
              :paginationOpt="paginationOpt"
              v-on:refreshTable="getPersonTotal"></complex-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import fdEchart from 'fd/echarts/echarts'
  import fdTable from 'fd/table'
  import FdPagination from 'fd/pagination/pagination'
  import complexTable from 'fd/complexTable/complexTable'
  import FdDatePickerMonth from 'fd/datePickerMonth/datePickerMonth'
  import { searchByKeyword, downloadTable, countPeg, toLocaleDate, sortByNum2, toStartDate } from '@/api/kpi/newRecord/otherWork'
  export default {
    name: 'otherWork',
    components: {
      fdTable, FdPagination, fdEchart, complexTable, FdDatePickerMonth
    },
    props: {},
    data() {
      return {
        columsObj: {
          'departName': '部门',
          'name': '姓名',
          'total': '汇总',
          'noticeCount': '通知通告'
        },
        personOpt: {
          cellClick: (row, column, cell, event) => {
            this.countPeg(row, column, cell, event)
          },
          sortChange: (column) => {
            this.sortByNum2(column)
          },
          defaultSort: { prop: 'total', order: 'descending' },
          sortable: true,
          ref: 'personOpt',
          stripe: true,
          border: true,
          data: [],
          columns: [
            {
              field: 'departName',
              title: '部门',
              sortable: 'custom',
              minWidth: this.fd.tools.getStringWidth('部门'),
              formatter: (row, value) => {
                return value || '--'
              }
            },
            {
              field: 'name',
              title: '姓名',
              sortable: 'custom',
              minWidth: this.fd.tools.getStringWidth('姓名'),
              formatter: (row, value) => {
                return value || '--'
              }
            },
            {
              field: 'total',
              title: '汇总',
              align: 'right',
              sortable: 'custom',
              minWidth: this.fd.tools.getStringWidth('汇总')
            }, {
              field: 'noticeCount',
              title: '通知通告',
              align: 'right',
              sortable: 'custom',
              formatter: (row, value) => {
                return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              minWidth: this.fd.tools.getStringWidth('通知通告')
            }
          ]
        },
        paginationOpt: {
          total: 0
        },
        rightOpt: {
          btnOpt: [{
            type: 'defined',
            selected: ['departName', 'name', 'total', 'noticeCount'],
            checkbox: [{
              field: 'departName',
              title: '部门'
            }, {
              field: 'name',
              title: '姓名'
            }, {
              field: 'total',
              title: '汇总'
            }, {
              field: 'noticeCount',
              title: '通知通告'
            }],
            change: (val) => {
              this.refreshColumns(val)
            }
          }, {
            type: 'search',
            enter: (val) => { this.searchByKeyword(val) }
          }, {
            type: 'button',
            btnType: '',
            text: '下载',
            iconClass: 'at icon-download',
            click: () => { this.downloadTable() }
          }, {
            type: 'text',
            text: '指标说明',
            iconClass: 'at icon-questioncircle',
            content: '这时候A页面就会被缓存了，同时也丢弃了B页面的缓存，减轻缓存压力。'
          }]
        },
        leftOpt: {
          btnOpt: [{
            type: 'button',
            text: '新增',
            click: () => { this.add() }
          }, {
            type: 'button',
            text: '批量复制',
            iconClass: 'at icon-download',
            click: () => { this.copy() }
          }, {
            type: 'checkbox',
            selected: ['approvalScore', 'score'],
            checkbox: [{
              field: 'approvalScore',
              title: '指标值'
            }, {
              field: 'formulaScore',
              title: '指标初始分'
            }, {
              field: 'score',
              title: '指标分数'
            }],
            change: (val) => {
              this.changeCheckbox(val)
            }
          }]
        },
        isRefresh: false,
        companyName: this.$store.getters.user.companyName,
        courtOtherObj: {},
        typeMap: {
          'depart': '部门',
          'person': '个人'
        },
        pageMap: {
          'other': '其他'
        },
        docMap: {
          'noticeCount': 'notice',
          'businessCount': 'business',
          'carCount': 'car',
          'goodsCount': 'goods',
          'workCardCount': 'workCard',
          'judgeTeamCount': 'judgeTeam',
          'personnelCount': 'personnel',
          'proofCount': 'proof',
          'abroadCount': 'abroad'
        },
        params: {
          startTime: this.toStartDate(new Date(this.fd.tools.getNowTime())),
          endTime: this.toLocaleDate(new Date(this.fd.tools.getNowTime()))
        },
        personParams: {
          type: 'person',
          keyword: '',
          orderField: '',
          orderType: '',
          offset: 0,
          limit: 10
        },
        pickerOptionsStart: {},
        pickerOptionsEnd: {},
        pageSize: 10,
        total: 0,
        val: '',
        val2: '',
        fileName: ''
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.otherWork || {}
      }
    },
    mounted() {
    },
    methods: {
      searchByKeyword, downloadTable, countPeg, toLocaleDate, sortByNum2, toStartDate,
      getPersonTotal(params = {}) {
        this.params.startTime = this.fd.tools.firstDayOfMonth(this.params.startTime)
        this.params.endTime = this.fd.tools.endDayOfMonth(this.params.endTime)
        const data = this.fd.tools.merge(true, {}, this.params, this.personParams, params)
        this.fd.req({
          url: 'api/analysis/others',
          method: 'get',
          data: data
        }).then((d) => {
          const data = d.data || {}
          this.personOpt.data = data.data
          this.paginationOpt.total = data.total
        })
      },
      changeCheckbox(columns) {
        console.log(columns)
      },
      refreshColumns(columns) {
        this.personOpt.columns = []
        let obj = {}
        for (const item of this.rightOpt.btnOpt[0].checkbox) {
          const field = item.field
          if (columns.indexOf(field) > -1) {
            if (field === 'noticeCount') {
              obj = {
                field: field,
                title: this.columsObj[field],
                sortable: 'custom',
                align: 'right',
                formatter: (row, value) => {
                  return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
                },
                minWidth: this.fd.tools.getStringWidth(this.columsObj[field])
              }
            } else {
              obj = {
                field: field,
                title: this.columsObj[field],
                sortable: 'custom',
                align: (field === 'departName' || field === 'name') ? 'left' : 'right',
                minWidth: this.fd.tools.getStringWidth(this.columsObj[field])
              }
            }
            this.personOpt.columns.push(obj)
          }
        }
      },
      refreshCondition() {
        this.personParams.limit = 10
        this.personParams.offset = 0
        this.personParams.keyword = this.val2
        this.personParams.orderField = ''
        this.personParams.orderType = ''
        this.$refs.personOption.$refs.personOpt.$children[0].clearSort()
      },
      refreshAll() {
        this.refreshCondition()
        this.getPersonTotal()
      },
      copy() {
        this.$message({
          type: 'success',
          message: '复制成功'
        })
      },
      add() {
        this.$message({
          type: 'success',
          message: '新增成功'
        })
      }
    },
    watch: {
    }
  }
</script>

<style lang="scss">
.other-work {
 .el-tabs__header{
   margin:0;
 }
 .tab-box{
   top: 0px;
   left:0;
 }
}
.width-356px{
  width:356px;
}
.min-height-div {
  height:320px;
}
.width-260px {
  width:260px;
}
.level-title{
  height: 28px;
  line-height: 28px;
}
.title-hide{
  display: none;
}
</style>
