<template>
  <div class="app-container">
    <div class="container-inner has-fixed-bottom bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="pb2 bd-dashed-bottom">
        <div v-if="resource === 'center_judge'" class="color-title bold h24 pb2">
          {{userName}}
        </div>
        <div v-else class="color-title bold h24 pb2">
          {{selfMsg.departName}}
        </div>
        <div>
          <el-row>
            <el-col :span="8">
              <span>统计时间：</span>
              <span v-if="params.startTime || params.endTime">{{params.startTime+'至'+params.endTime}}</span>
            </el-col>
            <el-col :span="8">
              <span>{{selfMsg.label}}：</span>
              <span>{{selfMsg.value}}</span>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="mt3">
        <el-row>
          <el-col :span="12">
            <div class="h16 color-title pl4">不同案件工作量占比</div>
            <div>
              <fd-echart :option="workRateOpt"></fd-echart>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="h16 color-title pl4">工作量构成</div>
            <div>
              <fd-echart :option="workOpt"></fd-echart>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="h16 color-title pl4">浮动因素得分分布</div>
            <div>
              <fd-echart :option="floatOpt"></fd-echart>
            </div>
          </el-col>
        </el-row>
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
  import fdEchart from 'fd/echarts/echarts'
  import fdTable from 'fd/table'
  import FdPagination from 'fd/pagination/pagination'
  import { goBack } from '@/api/common'
  import { searchByKeyword, currentChange, sizeChange, downloadTable } from '@/api/kpi/performance/caseCountPeg'
  import { getWorkRate, getWorkForm, getFloat, getEchartData, getAllResult, changeCols, getColumns, refreshAllResult,
    sortByNum, getCubePeg } from '@/api/kpi/performance/workloadPeg'
  export default {
    name: '',
    components: {
      fdTable, FdPagination, fdEchart
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
          departId: ''
        },
        params: {
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
        workRateOpt: {
          data: [],
          type: 'vbar',
          chartOption: {},
          chart: null,
          opt: {
            tooltip: {
              show: true,
              formatter: function(a, b) {
                let html = ''
                html = '<div>' + a[0].name + '</div>'
                for (const item of a) {
                  html += '<div>' + item.marker + item.seriesName + ':' + item.value + '%</div>'
                }
                return html
              }
            },
            legend: {
              top: 0,
              left: 'auto',
              right: 16
            },
            grid: {
              bottom: 0
            }
          }
        },
        workOpt: {
          data: [],
          type: 'pie',
          chartOption: {},
          chart: null,
          opt: {
            series: {
              radius: '55%',
              center: ['45%', '50%'],
              label: {
                normal: {
                  show: true,
                  position: 'outside',
                  formatter: '{b}: {d}%'
                },
                emphasis: {
                  show: true,
                  formatter: '{b}: {d}%'
                }
              },
              labelLine: {
                normal: {
                  show: true,
                  length: 15,
                  length2: 5
                }
              }
            },
            tooltip: {
              show: true,
              formatter: '{b}: {d}%'
            },
            legend: {
              show: false
            },
            grid: {
              bottom: 0,
              left: 0
            }
          }
        },
        floatOpt: {
          data: [],
          type: 'pie',
          chartOption: {},
          chart: null,
          opt: {
            series: {
              radius: '55%',
              center: ['45%', '50%'],
              label: {
                normal: {
                  show: true,
                  position: 'outside',
                  formatter: '{b}: {d}%'
                },
                emphasis: {
                  show: true,
                  formatter: '{b}: {d}%'
                }
              },
              labelLine: {
                normal: {
                  show: true,
                  length: 15,
                  length2: 5
                }
              }
            },
            tooltip: {
              show: true,
              formatter: '{b}: {d}%'
            },
            legend: {
              show: false
            },
            grid: {
              bottom: 0,
              left: 0
            }
          }
        },
        columsObj: {
          'depart': {},
          'index': {},
          'judge': {},
          'assistant': {},
          'clerk': {}
        },
        caseOpt: {
          stripe: true,
          border: true,
          data: [],
          columns: []
        },
        pParams: {},
        selfMsg: {},
        type: '',
        exportType: '',
        resource: '',
        fileName: '',
        from: ''
      }
    },
    computed: {},
    mounted() {
      this.type = this.$route.query.type || ''
      // 判断是从数魔方跳转过来还是从绩效跳转过来
      this.from = this.$route.query.from || ''
      // resource === center_judge 表示是从我的档案 或者是档案查询 办案工作-法官-工作量反查 标题显示为人名
      this.resource = this.$route.query.resource || ''
      if (this.type === 'judge') { // 办案工作-员额法官-工作量反查页面
        this.exportType = 'analysis-judge-workload'
        this.cParams = {
          judgeId: this.$route.query.id || ''
        }
        this.params = {
          keyword: '',
          limit: 10,
          offset: 0,
          judgeId: this.$route.query.id || ''
        }
      } else if (this.type === 'index') { // 权重系数和权重模型页面工作量反查页面
        this.exportType = ''
      } else if (this.type === 'assistant') { // 办案工作-法官助理-工作量反查页面
        this.exportType = 'analysis-assistant-workload'
        this.cParams = {
          judgeId: this.$route.query.id || ''
        }
        this.params = {
          keyword: '',
          limit: 10,
          offset: 0,
          judgeId: this.$route.query.id || ''
        }
      } else if (this.type === 'clerk') { // 办案工作-书记员-工作量反查页面
        this.exportType = 'analysis-clerk-workload'
        this.cParams = {
          judgeId: this.$route.query.id || ''
        }
        this.params = {
          keyword: '',
          limit: 10,
          offset: 0,
          judgeId: this.$route.query.id || ''
        }
      } else if (this.type === 'depart') { // 办案工作-部门-工作量反查页面
        this.exportType = 'analysis-depart-workload'
        this.cParams.departId = this.$route.query.id || ''
        this.params.departId = this.$route.query.id || ''
      }
      if (this.from) {
        this.pParams = JSON.parse(this.$route.query.params)
      } else {
        this.pParams = JSON.parse(localStorage.getItem('params'))
      }
      console.log(this.pParams)
      this.selfMsg = this.pParams.selfMsg
      this.params = this.fd.tools.merge(true, {}, this.params, this.pParams.params)
      this.userName = this.selfMsg.userName || this.$store.getters.user.userName
      // this.getColumns(this.type) // 获取工作量反查的表头数据
      if (this.from) {
        this.getCubePeg()
      } else {
        this.refreshAllResult()
        this.getEchartData()
      }
    },
    methods: {
      getWorkRate, getWorkForm, getFloat, getEchartData, getAllResult, searchByKeyword, refreshAllResult,
      currentChange, sizeChange, downloadTable, getColumns, changeCols, goBack, sortByNum, getCubePeg
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
