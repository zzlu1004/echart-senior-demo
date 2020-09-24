<template>
  <div class="app-container home">
    <div :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="relative">
        <div class="absolute bg-white p3" style="width: 495px;height:345px">
          <div class="userPhoto inline-block" @click="noChange=false"><img :src="photo"/></div>
          <div class="inline-block pl3" style="vertical-align: bottom;">
            <div class="home-hour-des mengnafan">{{hours}}好!</div>
            <div class="home-time my2">{{new Date(this.fd.tools.getNowTime())|parseTime("星期{a} {y}年{m}月{d}日")}}</div>
          </div>
          <el-row class="mt7" :gutter="24">
            <el-col :span="8">
              <div class="relative pointer" @click="goPage('notice')" style="background-color:#65D9CC;">
                <div class="rectangle absolute">
                  <i class="fd-icon icon-tongzhigonggao"/>
                </div>
                <div class="text-style">通知公告</div>
                <div v-show="todoNotice>0" class="rectangle-11">{{todoNotice}}</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="relative pointer" @click="goPage('myCheck')" style="background-color:#5C8ACC;">
                <div class="rectangle absolute">
                  <i class="fd-icon icon-shouyezaixiankaohe"/>
                </div>
                <div class="text-style">在线考核</div>
                <div v-show="todoOnline>0" class="rectangle-11">{{todoOnline}}</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="relative pointer" @click="goPage('personalMsg')" style="background-color:#F6D269;">
                <div class="rectangle absolute">
                  <i class="fd-icon icon-gerenzhongxin"/>
                </div>
                <div class="text-style">我的档案</div>
              </div>
            </el-col>
          </el-row>
        </div>
        <!--通知公告-->
        <div class="bg-white" style="margin-left: 511px;height:345px">
          <div class="title-line bd-bottom">
            <div class="f-left color-title h20">通知公告</div>
            <div class="f-right pointer" @click="goPage('notice')"><i class="at icon-doubleright"/></div>
          </div>
          <div class="auto full" style="height: 290px;">
            <div v-if="notices.length > 0" class="content-body px2">
              <div v-for="(item, index) of notices" :key="index">
                <el-row :class="'py2 ' + (index !== 4? 'bd-bottom' : '')">
                  <el-col :span="20">
                    <div class="dot-hidden relative pointer" @click="goPageDetail('noticeDetail', item, 'notice', index)" >
                      <span v-if="item.readFlag !== '1'" class="unread"></span>
                      <span>《{{item.title}}》</span>
                    </div>
                  </el-col>
                  <el-col class="t-right" :span="4">
                    {{item.releaseDate}}
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="content-empty" v-else>
              暂无通知公告
            </div>
          </div>
        </div>
      </div>
      <!--在线考核和绩效方案-->
      <el-row :gutter="16" class="mt2">
        <el-col :span="12">
          <div class="bg-white" style="height:440px">
            <div class="title-line bd-bottom">
              <div class="f-left color-title h20">在线考核</div>
              <div class="f-right pointer" @click="goPage('myCheck')"><i class="at icon-doubleright"/></div>
            </div>
            <div class="auto" style="height: 385px">
              <div v-if="onlines.length > 0" class="content-body">
                <div v-for="(projecs, index) of onlines" :key="index">
                  <div :class="'color-title t-left bold '+(index === 0? '':'pt2')">{{projecs.schemaName}}</div>
                  <div :class="'onlines-item py1 '+(num === 4 && projecs.blocks.length > 5 ? '' : 'bd-bottom')"
                       v-for="(block, num) of projecs.blocks"
                       v-if="num < 5"
                       :key="num">
                    <div class="f-left dot-hidden" style="width: 70%">{{block.blockName}}</div>
                    <div class="f-left t-center" style="width: 15%">{{block.type}}</div>
                    <div class="f-right color-link pointer" style="width: 80px" @click="goPageDetail('', block, 'online', num, projecs.schemaId)">
                      {{block.fillType}}({{block.total - block.complete}})
                    </div>
                  </div>
                  <div class="t-center py1 h20 bold" v-if="projecs.blocks.length > 5">
                    <i class="at icon-ellipsis1"/>
                  </div>
                </div>
              </div>
              <div class="content-empty" v-else>
                暂无考核事项
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="bg-white" style="height:440px">
            <el-row>
              <el-col :span="actives.length > 0?8:0" class="p3">
                <el-carousel trigger="click"
                             height="390px"
                             :autoplay=false
                             @change="carouselChange"
                             arrow="never">
                  <el-carousel-item v-if="index < 3"
                                    v-for="(item, index) in actives"
                                    :key="index">
                    <div class="color-title h20 bold">{{item.name}}</div>
                    <div class="pt3">
                      <div class="inline-block vertical-top" style="color: #1a95e7;"><i class="fd-icon icon-zhouqixing" style="font-size: 18px;"/></div>
                      <div class="inline-block ml1">
                        <div class="color-title col-padding bold h16">{{item.startTime}}至{{item.endTime}}</div>
                        <div>考核周期</div>
                      </div>
                    </div>
                    <div class="pt3">
                      <div class="inline-block vertical-top" style="color: #26bfae;"><i class="fd-icon icon-daishengxiao" style="font-size: 18px;"/></div>
                      <div class="inline-block ml1">
                        <div class="color-title col-padding bold h16">{{item.effectiveDate|parseTime("{y}-{m}-{d}")}}</div>
                        <div>生效日期</div>
                      </div>
                    </div>
                    <div class="pt3">
                      <div class="inline-block vertical-top" style="color: #ff7472;"><i class="fd-icon icon-jiezhiriqixuanzhong" style="font-size: 18px;"/></div>
                      <div class="inline-block ml1">
                        <div class="color-title col-padding bold h16">{{item.deadlineTime}}</div>
                        <div>上报截止日期</div>
                      </div>
                    </div>
                    <div class="mt6 t-center bold" style="color: #1b95e7;"><span class="h36">{{item.pastDay}}/{{item.totalDay}}</span>天</div>
                  </el-carousel-item>
                </el-carousel>
              </el-col>
              <el-col :span="actives.length > 0?16:24">
                <fd-calendar :dateRange="dateRange"></fd-calendar>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <!--考核进度-->
      <div v-if="elements.progress" class="bg-white mt2" style="height:500px">
        <div class="title-line bd-bottom">
          <div class="f-left color-title h20">考核进度</div>
        </div>
        <div style="height: 445px">
          <div class="content-body" v-if="actives.length > 0">
            <el-row>
              <el-col :span="18">
                <el-radio-group v-model="type">
                  <el-radio-button label="depart">考核部门</el-radio-button>
                  <el-radio-button label="block-type">考核类别</el-radio-button>
                </el-radio-group>
              </el-col>
              <el-col :span="6">
                <el-select v-model="schemaId"
                           filterable
                           size="small"
                           placeholder="请选择方案">
                  <el-option
                    v-for="item in actives"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row :gutter="30" class="mt1">
              <el-col :span="12">
                <div class="bold color-title py2">考核对象完成度</div>
                <div class="auto" style="height: 290px">
                  <div class="relative py1" v-for="(item, index) of progress" :key="index">
                    <span class="absolute left-0 t-right top-1 line-height-4 dot-hidden" style="width: 90px">{{item.name}}</span>
                    <div class="mr4" style="margin-left: 100px">
                      <el-progress :stroke-width="16" :percentage="parseFloat(fd.data.fixedFloat(item.complete/item.total*100, 0 ,100, 2))"></el-progress>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="bold color-title py2">待办事项进度</div>
                <div v-if="type === 'depart'" class="todo-table">
                  <fd-table
                    :option="getTodoOption()"
                  ></fd-table>
                </div>
                <div v-else class="todo-table">
                  <fd-table
                    :option="getTodoOption()"
                  ></fd-table>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="content-empty" v-else>
            暂无考核进度
          </div>
        </div>
      </div>
      <!--考核结果-->
      <div v-if="elements.result" class="bg-white mt2" style="height:500px">
        <div class="title-line bd-bottom">
          <div class="f-left color-title h20">考核结果</div>
          <div class="f-right pointer" @click="goPage('tableDetail')"><i class="at icon-doubleright"/></div>
        </div>
        <div style="height: 445px">
          <div class="content-body" v-if="results.length > 0">
            <div class="color-forbid h16 line-height-normal">{{resultSchema.name}}</div>
            <el-row :gutter="30" class="mt2">
              <el-col :span="12">
                <fd-echart v-bind:option="scoreOpt" height="369px"></fd-echart>
              </el-col>
              <el-col :span="12">
                <fd-echart v-bind:option="levelOpt" height="369px"></fd-echart>
              </el-col>
            </el-row>
          </div>
          <div class="content-empty" v-else>
            暂无考核结果
          </div>
        </div>
      </div>
      <!--绩效分析-->
      <div v-if="elements.analyze" class="bg-white mt2" style="height:500px">
        <div class="title-line bd-bottom">
          <div class="f-left color-title h20">绩效分析</div>
          <div class="f-right pointer" @click="goPage('judeWork')"><i class="at icon-doubleright"/></div>
        </div>
        <div style="height: 445px">
          <div class="content-body" v-if="activeModel.length > 0">
            <div class="color-forbid h16">
              <el-row>
                <el-col class="line-height-normal" :span="18">
                  统计日期: {{timeRange.startTime}}至{{timeRange.endTime}}
                </el-col>
                <el-col :span="6">
                  <el-select v-model="modelId"
                             filterable
                             size="small"
                             placeholder="请选择权重系数">
                    <el-option
                      v-for="item in activeModel"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
            </div>
            <el-row :gutter="30" class="mt2">
              <el-col :span="12">
                <fd-echart v-bind:option="workOpt" height="369px"></fd-echart>
              </el-col>
              <el-col :span="12">
                <fd-echart v-bind:option="basicOpt" height="369px"></fd-echart>
              </el-col>
            </el-row>
          </div>
          <div class="content-empty" v-else>
            暂无绩效分析
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getTotalMsg, getActiveSchemas, getEvaluations, getCheckResult,
    getSchemasProgress, getNotice, getUnreadNotice, getWorkCase, dealBasic, getActiveModel } from '@/api/kpi/home'
  import head from '@/assets/userPhoto.svg'
  import fdTable from 'fd/table'
  import FdCalendar from './components/calendar'
  import FdEchart from 'fd/echarts/echarts'
  export default {
    name: '',
    components: { FdEchart, fdTable, FdCalendar },
    props: {},
    data() {
      return {
        photo: this.$store.getters.user.userPhoto || head,
        todoOnline: 0,
        todoNotice: 0,
        type: 'depart',
        todoOption: {
          data: []
        },
        hours: this.fd.tools.changeTimeAmOrPm(),
        showIndex: 0,
        // 通知公告
        notices: [],
        // 在线考核
        onlines: [],
        // 考核进度-对象完成进度
        progress: [],
        // 考核进度-待办事项进度
        todos: [],
        // 考核结果
        results: [],
        // 考核分析结果
        analyze: [1],
        // 已生效方案
        actives: [],
        // 已启用权重系数
        activeModel: [],
        // 考核进度中选择的生效方案
        schemaId: '',
        modelId: '',
        dateRange: [],
        resultSchema: { id: '', name: '' },
        scoreOpt: {
          data: [], // 生成图标的数据
          type: 'line', // 图标类型
          chartOption: {}, // 全量的默认配置
          chart: null, // echart.init后生成的echart对象
          opt: {
            color: ['#ffbf00', '#00b4a0', '#1a95e7', '#6e79d5'],
            title: {
              text: '得分分布',
              left: 0,
              textStyle: {
                fontSize: '14',
                fontWeight: '700'
              }
            },
            tooltip: {
              formatter: (param) => {
                const data = param[0].data || []
                return data[0] + ': ' + data[1]
              }
            },
            grid: {
              top: '80',
              bottom: '60',
              right: '100'
            },
            xAxis: {
              type: 'value',
              name: '分数',
              axisLabel: {
                formatter: function(value) {
                  return Math.floor(value)
                }
              }
            },
            yAxis: {
              name: '人数'
            },
            series: {
              smooth: true,
              symbolSize: 1,
              areaStyle: { normal: { opacity: 0.5 }}
            }
          } // 覆盖默认配置，规则参照echart官网
        },
        levelOpt: {
          data: [], // 生成图标的数据
          type: 'pie', // 图标类型
          chartOption: {}, // 全量的默认配置
          chart: null, // echart.init后生成的echart对象
          opt: {
            color: ['#ffbf00', '#00b4a0', '#1a95e7', '#6e79d5'],
            title: {
              text: '评档结果',
              textStyle: {
                fontSize: '14',
                fontWeight: '700'
              }
            },
            legend: { show: false },
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
                  show: true
                }
              }
            }
          } // 覆盖默认配置，规则参照echart官网
        },
        workOpt: {
          data: [], // 生成图标的数据
          type: 'scatter', // 图标类型
          chartOption: {}, // 全量的默认配置
          chart: null, // echart.init后生成的echart对象
          opt: {
            grid: {
              top: '80',
              bottom: '60',
              right: '100'
            },
            title: {
              text: '法官工作量、案件数分布',
              left: 0,
              textStyle: {
                fontSize: '14',
                fontWeight: '700'
              }
            },
            tooltip: {
              formatter: (param) => {
                const data = param.data || []
                return '姓名: ' + data[3] + ' 承办案件数: ' + data[0] + ' 承办工作量: ' + data[1]
              }
            },
            xAxis: {
              type: 'value',
              name: '承办案件数',
              axisLabel: {
                formatter: function(value) {
                  return Math.floor(value)
                }
              }
            },
            yAxis: {
              type: 'value',
              name: '承办工作量',
              axisLabel: {
                formatter: function(value) {
                  return Math.floor(value)
                }
              }
            }
          }
        },
        basicOpt: {
          data: [], // 生成图标的数据
          type: 'mix', // 图标类型
          types: [{ type: 'vbar', key: 'caseNum' }, { type: 'line', key: 'workload' }],
          chartOption: {}, // 全量的默认配置
          chart: null, // echart.init后生成的echart对象
          opt: {
            color: ['#3ca4eb', '#ffc926'],
            grid: {
              top: '80',
              bottom: '20',
              right: '10'
            },
            title: {
              text: '基础案件因素TOP10',
              textStyle: {
                fontSize: '14',
                fontWeight: '700'
              }
            },
            yAxis: [{
              name: '案件数',
              type: 'value'
            }, {
              name: '工作量',
              type: 'value'
            }],
            xAxis: {
              axisLabel: {
                rotate: 40
              }
            },
            series: [{ type: 'bar', name: '案件数' }, { type: 'line', name: '工作量', yAxisIndex: 1 }]
          }
        }
      }
    },
    computed: {
      timeRange() {
        const global = this.$store.getters.globals
        const month = global.month
        let year = global.lastYear
        let endTime = '12'
        const startTime = '01'
        if (month !== '01') {
          year = global.year
          endTime = global.lastMonth
        }
        return {
          startTime: year + '-' + startTime,
          endTime: year + '-' + endTime
        }
      },
      elements() {
        return this.$store.getters.elements.home || {}
      }
    },
    mounted() {
      // 在线考核数量
      this.getTotalMsg()
      // 生效方案
      this.getActiveSchemas()
      // 获取在线考核
      this.getEvaluations()
      // 未读消息
      this.getUnreadNotice()
      if (this.elements.result) {
        this.getCheckResult()
      }
      // 通知公告
      this.getNotice()
      // 绩效分析
      if (this.elements.analyze) {
        this.getActiveModel()
      }
    },
    methods: {
      getTotalMsg,
      getActiveModel,
      getActiveSchemas,
      getEvaluations,
      getSchemasProgress,
      getNotice,
      getWorkCase,
      dealBasic,
      getCheckResult,
      getUnreadNotice,
      carouselChange(index) {
        const data = this.actives[index]
        this.dateRange = [data.effectiveDate, data.deadlineTime]
      },
      goPage(name) {
        this.$router.push({ name: name })
      },
      goPageDetail(name, data, page, index, schemaId) {
        if (page === 'notice') {
          this.$router.push({ name: name, query: { id: data.id, type: 'all', index: index }})
        } else if (page === 'online') {
          if (data.type === '我的') {
            if (data.fillType === '填报') {
              const obj = {
                isFill: (data.complete < data.total),
                resource: 'report',
                checkType: 'report',
                page: 'edit'
              }
              localStorage.setItem('obj', JSON.stringify(obj))
              this.$router.push({ name: 'reportList', query: {
                schemaId: schemaId, blockId: data.blockId,
                schemaBlockType: data.schemaBlockType }})
            }
          } else {
            if (data.fillType === '填报') {
              const obj = {
                isFill: (data.complete < data.total),
                resource: 'report',
                page: 'edit'
              }
              localStorage.setItem('obj', JSON.stringify(obj))
              this.$router.push({ name: 'ruleReportList', query: {
                schemaId: schemaId, blockId: data.blockId,
                schemaBlockType: data.schemaBlockType }})
            } else {
              const obj = {
                isCheck: (data.complete < data.total),
                type: 'people',
                resource: 'check',
                page: 'edit',
                checkType: 'check',
                operateType: 'check'
              }
              localStorage.setItem('obj', JSON.stringify(obj))
              this.$router.push({ name: 'ruleCheckList', query: {
                schemaId: schemaId, blockId: data.blockId,
                schemaBlockType: data.schemaBlockType }})
            }
          }
        }
      },
      getTodoOption() {
        return {
          stripe: true,
          data: this.todoOption.data,
          height: '287px',
          columns: [
            {
              field: 'name',
              title: this.type !== 'depart' ? '考核类别' : '考核部门',
              width: '300px',
              showOverflowTooltip: true
            },
            {
              field: 'fillComplete',
              title: '已填报',
              formatter: (row, value) => {
                return value + '/' + row.fillTotal
              }
            },
            {
              field: 'approveComplete',
              title: '已审核',
              formatter: (row, value) => {
                return value + '/' + row.approveTotal
              }
            }
          ]
        }
      }
    },
    watch: {
      schemaId() {
        // 考核进度
        if (this.elements.progress) {
          this.getSchemasProgress()
        }
      },
      modelId() {
        // 绩效分析
        if (this.elements.analyze) {
          this.getWorkCase()
        }
      },
      type() {
        // 考核进度
        if (this.elements.progress) {
          this.getSchemasProgress()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .userPhoto{
    width: 100px;
    height: 100px;
    border-radius: 100px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .home-hour-des{
    font-size: 34px;
    color: #3da5eb;
    font-weight: normal;
    font-stretch: normal;
  }
  .home-time {
    height: 26px;
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 3px;
    color: #999;
  }
  .rectangle {
    width: 133px;
    height: 100px;
    border-radius: 2px;
    text-align: center;
    padding-top: 12px;
    color: #fff;
    .fd-icon{
      font-size: 36px;
    }
  }
  .rectangle-11 {
    position: absolute;
    right: -10px;
    top: -13px;
    min-width: 33px;
    text-align: center;
    padding: 8px;
    background-color: #ff7472;
    border-radius: 100px;
    color: #fff;
    z-index: 222;
  }
  .text-style {
    font-size: 20px;
    line-height: 50px;
    font-weight: normal;
    letter-spacing: 2px;
    color: #fff;
    text-align: center;
    padding-top: 50px;
  }
  .title-line{
    padding: 0 24px;
    line-height: 55px;
    height: 55px;
  }
  .content-empty{
    height: 100%;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #cacaca;
    display:flex;
    align-items:center;
    justify-content: center;
  }
  .content-body{
    padding: 20px 24px 0;
  }
  .onlines-item{
    line-height: 40px;
    height: 50px;
    color: #666;
  }
  .vertical-top{
    vertical-align: top;
    padding-top: 2px;
  }
  .col-padding{
    padding: 4px 0;
  }
  .unread{
    position: absolute;
    top: 0;
    left: 0;
    height: 6px;
    width: 6px;
    background-color: #ff7472;
    border-radius: 20px;
  }
</style>
<style>
  .todo-table .el-table__empty-block{
    min-height: 250px;
  }
  .home .bg-white .el-carousel__indicator .el-carousel__button{
    background-color: #d7d7d7;
    height: 8px;
    border-bottom: 2px solid #fff;
    border-radius: 10px;
  }
  .home .bg-white .el-carousel__indicator.is-active .el-carousel__button{
    background-color: #1a95e7;
    height: 10px;
    border-bottom: 2px solid #1a95e7;
  }
  .home .bg-white .el-carousel__indicators{
    width: 100%;
    text-align: center;
  }
</style>
