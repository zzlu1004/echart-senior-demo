<template>
    <div class="clearfix h14 reporting">
        <el-radio-group v-if="show" v-model="type" size="small" class="select-up">
            <el-radio-button label="detail">按细则</el-radio-button>
            <el-radio-button label="people">按人员</el-radio-button>
            <el-radio-button label="plan">按方案</el-radio-button>
        </el-radio-group>
        <div v-show="type==='people'">
            <div class="clearfix pb2">
                <div class="f-right">
                  <fd-search @search="searchByKeyword"
                             v-if="type==='people' && active === checkType && show"
                             v-model="searchVal1"></fd-search>
                </div>
            </div>
            <fd-table
              :loading="loading"
              :option="reportOption[checkType]"
              @cellClick="gotoDetailByName"
            ></fd-table>
            <fd-pagination
                :limit="params.limit"
                :total="total"
                sizes="sizes"
                :offset="params.offset"
                :pageArr="[10,20,30,40,50]"
                :currentChange="currentChange"
                :sizeChange="sizeChange">
            </fd-pagination>
        </div>
        <div v-show="type==='detail'">
            <div class="clearfix pb2">
                <div class="f-right">
                  <fd-search @search="searchByKeyword"
                             v-if="type==='detail'"
                             v-model="searchVal2"></fd-search>
                </div>
            </div>
            <div v-if="cardData.length === 0">
              <FdNoContent style="padding-top:-200px;"></FdNoContent>
            </div>
            <div v-else>
                <kpi-card
                    v-for="(item, index) of cardData"
                    :key="item.schemaId"
                    :index="index"
                    checkType="to_fill"
                    v-on:seeRuleDetail="seeRuleDetail"
                    :option="xzOpt[checkType]"
                    :cardData="item"
                ></kpi-card>
            </div>
        </div>
        <div v-show="type === 'plan'">
          <div class="clearfix pb2">
            <div class="f-right">
              <fd-search @search="searchByKeyword"
                         v-if="type==='plan'"
                         v-model="searchVal3"></fd-search>
            </div>
          </div>
          <div v-if="planData.length === 0">
            <FdNoContent style="padding-top:-200px;"></FdNoContent>
          </div>
          <div v-else>
            <kpi-plan-card
              v-for="(item, index) of planData"
              :key="index"
              :plan-data="item"
              :option="planOpt[checkType]"
            ></kpi-plan-card>
          </div>
        </div>
    </div>
</template>

<script>
    import fdTable from 'fd/table'
    import kpiCard from './kpiCard'
    import kpiPlanCard from './kpiPlanCard'
    import FdNoContent from 'fd/noContent'
    import FdPagination from 'fd/pagination/pagination'
    import { getOtherList, searchByKeyword, reportFill, seeReportDetail, checkFill, seeCheckDetail, getxzList, fillPlan, getPlanList,
      fillXz, checkXz, currentChange, sizeChange, gotoDetailByName, refreshOtherCheck, seeRuleDetail } from '@/api/kpi/onlineCheck/reporting'
    export default {
      name: 'reporting',
      components: {
        fdTable, kpiCard, FdPagination, FdNoContent, kpiPlanCard
      },
      methods: {
        getOtherList, searchByKeyword, reportFill, seeReportDetail, checkFill, seeCheckDetail,
        getxzList, fillXz, checkXz, currentChange, sizeChange, seeRuleDetail,
        gotoDetailByName, refreshOtherCheck, fillPlan, getPlanList
      },
      data() {
        return {
          loading: false,
          pageSize: 10,
          total: 0,
          searchVal1: '',
          searchVal2: '',
          searchVal3: '',
          type: 'detail',
          tableOpt: {},
          checkData: [],
          typesMap: {
            'k10015-01': '综合绩效',
            'k10015-02': '审判绩效',
            'k10015-03': '民主测评',
            'k10015-04': '部门考核'
          },
          params: {
            keyword: '',
            type: '',
            offset: 0,
            limit: 10
          },
          staffId: this.$store.getters.user,
          reportOption: {
            'to_fill': {
              stripe: true,
              data: [],
              border: true,
              columns: [
                {
                  field: 'departName',
                  title: '部门'
                },
                {
                  field: 'staffName',
                  title: '姓名',
                  formatter: (row, value) => {
                    let name = ''
                    if (row.chairName) {
                      name = value + '（' + row.chairName + '）'
                    } else {
                      name = value
                    }
                    return '<span class="color-blue pointer">' + name + '</span>'
                  }
                },
                {
                  field: 'schemaName',
                  title: '所属方案',
                  showOverflowTooltip: true
                },
                {
                  field: '',
                  title: '考核周期',
                  showOverflowTooltip: true,
                  formatter: (row, value) => {
                    return row.startTime + '至' + row.endTime
                  }
                },
                {
                  field: 'deadlineTime',
                  title: '上报截止时间'
                },
                {
                  field: 'schemaBlockType',
                  title: '考核类别',
                  formatter: (row, value) => {
                    return this.typesMap[value]
                  }
                },
                {
                  field: 'blockName',
                  title: '所属细则'
                },
                {
                  field: 'name',
                  title: '待办数量',
                  formatter: (row, value) => {
                    return row.complete + '/' + row.total
                  }
                },
                {
                  field: '',
                  title: '操作',
                  width: '150px',
                  number: [
                    { text: '填报', type: 'text', disabled: 'isFill', click: (d, row) => { this.reportFill(row) } }
                  ]
                }
              ]
            }
          },
          xzOpt: {
            'to_fill': {
              btnTool: [
                { disabled: 'notFill', text: '填报', type: 'text', click: this.fillXz }
              ]
            }
          },
          planOpt: {
            'to_fill': {
              btnTool: [
                { disabled: 'notFill', text: '填报', type: 'text', click: this.fillPlan }
              ]
            }
          },
          cardData: [],
          fillTab: {
            secType: 'detail'
          },
          show: '', // 用来判断searchVal是否被赋值了，因为v-model在渲染到页面之后就不能在改变他的值
          planData: []
        }
      },
      props: {
        checkType: {
          type: String
        },
        getCnt: {
          type: Boolean
        },
        active: {
          type: String
        },
        parentParams: {
          type: Object
        },
        statusId: String
      },
      mounted() {
        this.params = this.fd.tools.merge(true, {}, this.params, this.parentParams)
        this.searchVal1 = this.params.keyword
        this.type = this.params.secType || 'detail'
        // 用来判断searchVal是否被赋值了，因为v-model在渲染到页面之后就不能在改变他的值
        this.$nextTick(() => {
          this.show = true
        })
      },
      activated() {
        this.getOtherList(this.statusId)
        this.getxzList(this.statusId)
        this.getPlanList(this.statusId)
      },
      watch: {
        params: {
          handler(val, oldVal) {
            this.fillTab = this.fd.tools.merge(true, {}, this.fillTab, val)
          },
          deep: true
        },
        type(val) {
          this.fillTab = this.fd.tools.merge(true, {}, this.fillTab, { secType: val })
        }
      }
    }
</script>

<style lang="scss" scoped>

</style>
