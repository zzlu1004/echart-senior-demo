<template>
  <div class="bg-white project-info">
    <div class="bd-dashed-bottom title-panel px3">
      <span class="h16 color-title bold">方案信息</span>
      <span class="sub-panel">（{{new Date(this.fd.tools.getNowTime())|parseTime("{y}年")}}累计）</span>
    </div>
    <div class="pt2 pb3 px3">
      <div class="project-panel">
        <div class="project-menu absolute">
          <el-menu
            :default-active="active"
            class="el-menu-vertical-demo"
            @select="selectProject"
            >
            <el-menu-item v-for="item of menuArr" :key="item.id" :index="item.id"
              :disabled="getDisabled(item.id)">
              <span slot="title">
                {{item.name}}
                <span v-if="projectStatus[item.id]" class="inline-block num-circle center">{{projectStatus[item.id]}}</span>
              </span>
            </el-menu-item>
          </el-menu>
        </div>
        <div class="project-content">
          <div v-show="active === 'nonStart'">
            <div class="center pt4">
              <div>
                <img :src="noStart" style="width:300px; height:150px;" />
              </div>
            </div>
            <div class="sub-panel h16 bold center">暂无考核方案…</div>
          </div>
          <div v-show="active === 'active'" class="px3 relative">
            <div v-if="this.projectStatus[this.active + 'Schemas']" class="absolute tab-btn">
              <i v-if="!prevDisabled" class="fd-icon icon-zuoqiehuan color-d9d9d9 pointer"
                style="font-size:32px;" @click="prevProject('active')"></i>
              <i v-if="!nextDisabled" class="fd-icon icon-youqiehuan btn-ml color-d9d9d9 pointer"
                style="font-size:32px;" @click="nextProject('active')"></i>
            </div>
            <div class="h20 corlor-title bold project-name mb2">{{currentProject.name | noString}}</div>
            <div>
              <el-row>
                <el-col class="bd-right pb3" :span="8">
                  <div class="h16 corlor-title bold mb2">
                    方案基本信息
                  </div>
                  <div class="mb6">
                    <el-row :gutter="32">
                      <el-col class="checkDate-min-width" :span="11">
                        <div class="inline-block vertical-top" style="color: #1a95e7;">
                          <i class="fd-icon icon-zhouqixing" style="font-size: 20px;"/>
                        </div>
                        <div class="inline-block ml1">
                          <div class="color-title col-padding bold">{{currentProject.startTime | noString}}至{{currentProject.endTime | noString}}</div>
                          <div class="h12">考核周期</div>
                        </div>
                      </el-col>
                      <el-col :span="11">
                        <div class="inline-block vertical-top" style="color: #ffa000;">
                          <i class="fd-icon icon-jiezhiriqixuanzhong" style="font-size: 20px;"/>
                        </div>
                        <div class="inline-block ml1">
                          <div class="color-title col-padding bold">{{currentProject.deadlineTime | noString}}</div>
                          <div class="h12">上报截止日期</div>
                        </div>
                      </el-col>
                      <el-col :span="2">
                      </el-col>
                    </el-row>
                  </div>
                  <div>
                    <el-row :gutter="32">
                      <el-col :span="11">
                        <div class="h16 bold mb3">
                          考核进度
                        </div>
                        <div v-if="currentProject.rate">
                          <span
                            v-for="item of currentProject.rate+''.split('')" 
                            :key="item" 
                            class="inline-block process-card h32 bold center card-mr">
                            {{item}}
                          </span>
                          <span class="h16 process-unit relative">%</span>
                        </div>
                        <div v-else>
                          <span class="inline-block process-card h32 bold center card-mr">
                            {{currentProject.rate | noString}}
                          </span>
                          <span class="h16 process-unit relative">%</span>
                        </div>
                      </el-col>
                      <el-col :span="11">
                        <div class="h16 bold mb3">
                          考核剩余
                        </div>
                        <div v-if="currentProject.remainingDays">
                          <span 
                            v-for="item of currentProject.remainingDays+''.split('')" 
                            :key="item" 
                            class="inline-block h32 bold center days-card card-mr relative">
                            <svg-icon class="day-style" icon-class="active-day" />
                            <span class="absolute day-num">{{item}}</span>
                          </span>
                          <span class="h16 days-unit">天</span>
                        </div>
                        <div v-else>
                          <span class="inline-block h32 bold center days-card card-mr relative">
                            <svg-icon class="day-style" icon-class="active-day" />
                            <span class="absolute day-num">{{currentProject.remainingDays | noString}}</span>
                          </span>
                          <span class="h16 days-unit">天</span>
                        </div>
                      </el-col>
                      <el-col :span="2"></el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col class="pl4" :span="16">
                  <div class="h16 corlor-title bold mb3">
                    我的考核进度
                  </div>
                  <div>
                    <el-row>
                      <el-col class="bd-right clearfix pr4" :span="14">
                        <el-row :gutter="32">
                          <el-col :span="8">
                            <div class="center">
                              <div class="h22 bold mb2 mt1">剩余待办</div>
                              <div class="h34 bold color-title mb5">
                                {{((currentProject.myFillTotal+ currentProject.otherFillTotal +
                                currentProject.approvalTotal)-(currentProject.myFillComplete +
                                currentProject.otherFillComplete + currentProject.approvalComplete)) | noString}}
                              </div>
                              <div class="inline-block detail-btn pointer" @click="goPage('myCheck')">
                                查看详情
                                <span class="inline-block detail-icon f-right">
                                  <i class="at icon-arrowright" style="color:#fff;"/>
                                </span>
                              </div>
                            </div>
                          </el-col>
                          <el-col :span="16">
                            <div class="mb4 relative clearfix">
                              <div class="inline-block absolute progress-position">
                                <el-progress
                                  :show-text=false
                                  :stroke-width="8"
                                  :percentage="currentProject.myFillProgress"></el-progress>
                              </div>
                              <div class="inline-block pl1 f-right">
                                <div class="mb1 right-align h12 color-title">
                                  <span>填报（我的）</span>：
                                  <span>{{currentProject.myFillTotal | noString}}</span>
                                </div>
                                <div class="right-align h12 color-title">
                                  <span>待填报</span>：
                                  <span>{{(currentProject.myFillTotal - currentProject.myFillComplete) | noString}}</span>
                                </div>
                              </div>
                            </div>
                            <div class="mb4 relative clearfix">
                              <div class="inline-block absolute progress-position">
                                <el-progress
                                  :show-text=false 
                                  :stroke-width="8"
                                  :percentage="currentProject.otherFillProgress"></el-progress>
                              </div>
                              <div class="inline-block pl1 f-right">
                                <div class="mb1 right-align h12 color-title">
                                  <span>填报（其他）</span>：
                                  <span>{{currentProject.otherFillTotal | noString}}</span>
                                </div>
                                <div class="right-align h12 color-title">
                                  <span>待填报</span>：
                                  <span>{{(currentProject.otherFillTotal - currentProject.otherFillComplete) | noString}}</span>
                                </div>
                              </div>
                            </div>
                            <div class="relative clearfix">
                              <div class="inline-block absolute progress-position">
                                <el-progress
                                  :show-text=false 
                                  :stroke-width="8"
                                  :percentage="currentProject.approvalProgress"></el-progress>
                              </div>
                              <div class="inline-block pl1 f-right">
                                <div class="mb1 right-align h12 color-title">
                                  <span>审核（其他）</span>：
                                  <span>{{currentProject.approvalTotal | noString}}</span>
                                </div>
                                <div class="right-align h12">
                                  <span>待审核</span>：
                                  <span>{{(currentProject.approvalTotal - currentProject.approvalComplete) | noString}}</span>
                                </div>
                              </div>
                            </div>
                          </el-col>
                        </el-row>
                      </el-col>
                      <el-col :span="10">
                        <div class="px3">
                          <div class="mb3 center process-circle">
                            <el-progress :width="100" type="circle" :percentage="currentProject.totalProgress" status="text" :stroke-width="8">
                              <div class="h12 color-text mb1">已完成</div>
                              <div v-if="currentProject.totalProgress || currentProject.totalProgress === 0" class="h24 color-title bold">
                                {{currentProject.totalProgress}}%
                              </div>
                              <div v-else class="h24 color-title bold">
                                --
                              </div>
                            </el-progress>
                          </div>
                          <el-row>
                            <el-col :span="8">
                              <div class="text-num h12 center">填报（我的）</div>
                              <div class="h18 bold center">{{currentProject.myFillComplete | noString}}</div>
                            </el-col>
                            <el-col :span="8">
                              <div class="text-num h12 center">填报（其他）</div>
                              <div class="h18 bold center">{{currentProject.otherFillComplete | noString}}</div>
                            </el-col>
                            <el-col :span="8">
                              <div class="text-num h12 center">审核（其他）</div>
                              <div class="h18 bold center">{{currentProject.approvalComplete | noString}}</div>
                            </el-col>
                          </el-row>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <div v-show="active === 'finished'" class="px3 relative">
            <div v-if="this.projectStatus[this.active + 'Schemas']" class="absolute tab-btn">
              <i v-if="!prevDisabled" class="fd-icon icon-zuoqiehuan color-d9d9d9 pointer"
                style="font-size:32px;" @click="prevProject('finished')"></i>
              <i v-if="!nextDisabled" class="fd-icon icon-youqiehuan btn-ml color-d9d9d9 pointer"
                style="font-size:32px;" @click="nextProject('finished')"></i>
            </div>
            <div class="h20 corlor-title bold project-name mb2">{{currentProject.name | noString}}</div>
            <div>
              <el-row>
                <el-col class="bd-right pb3" :span="8">
                  <div class="h16 corlor-title bold mb2">
                    方案基本信息
                  </div>
                  <div class="mb6">
                    <el-row :gutter="32">
                      <el-col class="checkDate-min-width" :span="11">
                        <div class="inline-block vertical-top" style="color: #1a95e7;">
                          <i class="fd-icon icon-zhouqixing" style="font-size: 20px;"/>
                        </div>
                        <div class="inline-block ml1">
                          <div class="color-title col-padding bold">{{currentProject.startTime | noString}}至{{currentProject.endTime | noString}}</div>
                          <div class="h12">考核周期</div>
                        </div>
                      </el-col>
                      <el-col :span="11">
                        <div class="inline-block vertical-top" style="color: #ffa000;">
                          <i class="fd-icon icon-jiezhiriqixuanzhong" style="font-size: 20px;"/>
                        </div>
                        <div class="inline-block ml1">
                          <div class="color-title col-padding bold">{{currentProject.deadlineTime | noString}}</div>
                          <div class="h12">上报截止日期</div>
                        </div>
                      </el-col>
                      <el-col :span="2">
                      </el-col>
                    </el-row>
                  </div>
                  <div>
                    <el-row :gutter="32">
                      <el-col :span="11">
                        <div class="h16 bold mb3">
                          考核进度
                        </div>
                        <div v-if="currentProject.rate">
                          <span
                            v-for="item of currentProject.rate+''.split('')" 
                            :key="item" 
                            class="inline-block process-card bg-forbid h32 bold center card-mr">
                            {{item}}
                          </span>
                          <span class="h16 process-unit text-forbid relative">%</span>
                        </div>
                        <div v-else>
                          <span class="inline-block process-card bg-forbid h32 bold center card-mr">
                            {{currentProject.rate | noString}}
                          </span>
                          <span class="h16 process-unit text-forbid relative">%</span>
                        </div>
                      </el-col>
                      <el-col :span="11">
                        <div class="h16 bold mb3">
                          考核剩余
                        </div>
                        <div v-if="currentProject.remainingDays">
                          <span 
                            v-for="item of currentProject.remainingDays+''.split('')" 
                            :key="item" 
                            class="inline-block h32 bold center days-card card-mr relative">
                            <svg-icon class="day-style" icon-class="gray-day" />
                            <span class="absolute day-num">{{item}}</span>
                          </span>
                          <span class="h16 text-forbid">天</span>
                        </div>
                        <div v-else>
                          <span class="inline-block h32 bold center days-card card-mr relative">
                            <svg-icon class="day-style" icon-class="gray-day" />
                            <span class="absolute day-num">{{currentProject.remainingDays | noString}}</span>
                          </span>
                          <span class="h16 text-forbid">天</span>
                        </div>
                      </el-col>
                      <el-col :span="2"></el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col class="pl4" :span="16">
                  <div class="h16 corlor-title bold mb3">
                    我的考核结果
                  </div>
                  <div>
                    <div class="center">
                      <div>
                        <img style="width:300px; height:150px;" :src="finishedResult"/>
                      </div>
                    </div>
                    <div class="sub-panel h16 bold center">请等待结果公示…</div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <div v-show="active === 'publiced'" class="px3 relative">
            <div v-if="this.projectStatus[this.active + 'Schemas']" class="absolute tab-btn">
              <i v-if="!prevDisabled" class="fd-icon icon-zuoqiehuan color-d9d9d9 pointer"
                style="font-size:32px;" @click="prevProject('publiced')"></i>
              <i v-if="!nextDisabled" class="fd-icon icon-youqiehuan btn-ml color-d9d9d9 pointer"
                style="font-size:32px;" @click="nextProject('publiced')"></i>
            </div>
            <div class="h20 corlor-title bold project-name mb2">{{currentProject.name | noString}}</div>
            <div>
              <el-row>
                <el-col class="bd-right pb3" :span="8">
                  <div class="h16 corlor-title bold mb2">
                    方案基本信息
                  </div>
                  <div class="mb6">
                    <el-row :gutter="32">
                      <el-col class="checkDate-min-width" :span="11">
                        <div class="inline-block vertical-top" style="color: #1a95e7;">
                          <i class="fd-icon icon-zhouqixing" style="font-size: 20px;"/>
                        </div>
                        <div class="inline-block ml1">
                          <div class="color-title col-padding bold">{{currentProject.startTime | noString}}至{{currentProject.endTime | noString}}</div>
                          <div class="h12">考核周期</div>
                        </div>
                      </el-col>
                      <el-col :span="11">
                        <div class="inline-block vertical-top" style="color: #ffa000;">
                          <i class="fd-icon icon-jiezhiriqixuanzhong" style="font-size: 20px;"/>
                        </div>
                        <div class="inline-block ml1">
                          <div class="color-title col-padding bold">{{currentProject.deadlineTime | noString}}</div>
                          <div class="h12">上报截止日期</div>
                        </div>
                      </el-col>
                      <el-col :span="2">
                      </el-col>
                    </el-row>
                  </div>
                  <div>
                    <el-row :gutter="32">
                      <el-col :span="11">
                        <div class="h16 bold mb3">
                          考核进度
                        </div>
                        <div v-if="currentProject.rate">
                          <span
                            v-for="item of currentProject.rate+''.split('')" 
                            :key="item" 
                            class="inline-block process-card bg-forbid h32 bold center card-mr">
                            {{item}}
                          </span>
                          <span class="h16 process-unit text-forbid relative">%</span>
                        </div>
                        <div v-else>
                          <span class="inline-block process-card bg-forbid h32 bold center card-mr">
                            {{currentProject.rate | noString}}
                          </span>
                          <span class="h16 process-unit text-forbid relative">%</span>
                        </div>
                      </el-col>
                      <el-col :span="11">
                        <div class="h16 bold mb3">
                          考核剩余
                        </div>
                        <div v-if="currentProject.remainingDays">
                          <span 
                            v-for="item of currentProject.remainingDays+''.split('')" 
                            :key="item" 
                            class="inline-block h32 bold center days-card card-mr relative">
                            <svg-icon class="day-style" icon-class="gray-day" />
                            <span class="absolute day-num">{{item}}</span>
                          </span>
                          <span class="h16 text-forbid">天</span>
                        </div>
                        <div v-else>
                          <span class="inline-block h32 bold center days-card card-mr relative">
                            <svg-icon class="day-style" icon-class="gray-day" />
                            <span class="absolute day-num">{{currentProject.remainingDays | noString}}</span>
                          </span>
                          <span class="h16 text-forbid">天</span>
                        </div>
                      </el-col>
                      <el-col :span="2"></el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col class="pl4" :span="16">
                  <div class="h16 corlor-title bold mb3">
                    我的考核结果
                  </div>
                  <div>
                    <el-row>
                      <el-col :span="8">
                        <fd-echart :option="scoreOpt" height="180px"></fd-echart>
                      </el-col>
                      <el-col :span="16">
                        <echart-table
                          :echartOption="levelOpt"
                          :tableOption="levelOption"
                          echartHeight="180px"></echart-table>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import finishedResult from '@/assets/home/finished-result.png'
  import noStart from '@/assets/home/noStart.png'
  import { selectProject, getProjectInfo, prevProject, nextProject, refreshProject, goPage, getDisabled,
    refreshPublicedInfo } from '@/api/kpi/homeNew'
  import { noString } from '@/utils/filters'
  import echartTable from './echartTable.vue'
  import FdEchart from 'fd/echarts/echarts'
  export default {
    name: 'projectInfo',
    components: {
      echartTable, FdEchart
    },
    props: {},
    data() {
      return {
        noStart: noStart,
        finishedResult: finishedResult,
        menuArr: [{
          id: 'nonStart',
          name: '考核未开始'
        },
        {
          id: 'active',
          name: '考核进行中'
        },
        {
          id: 'finished',
          name: '考核已结束'
        },
        {
          id: 'publiced',
          name: '结果公示中'
        }],
        active: 'nonStart',
        prevDisabled: false,
        nextDisabled: false,
        nonStartIndex: 0,
        activeIndex: 0,
        finishedIndex: 0,
        publicedIndex: 0,
        projectStatus: {},
        currentProject: {},
        levelOpt: {
          data: [],
          type: 'pie',
          chartOption: {},
          chart: null,
          opt: {
            legend: {
              show: false
            },
            tooltip: {
              trigger: 'item',
              formatter: (param) => {
                return `${param.marker}${param.name}：${param.value}%`
              }
            },
            series: {
              radius: ['60%', '90%'],
              center: ['50%', '45%'],
              itemStyle: {
                borderWidth: 1,
                borderColor: '#fff'
              },
              label: {
                normal: {
                  show: false
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              }
            },
            title: {
              text: '',
              left: 'center',
              top: '30%',
              textStyle: {
                rich: {
                  a: {
                    color: '#666',
                    fontSize: 14,
                    height: 25
                  },
                  b: {
                    color: '#404040',
                    fontSize: 24,
                    fontWeight: 700
                  }
                }
              }
            }
          }
        },
        levelOption: {
          stripe: false,
          data: [],
          maxHeight: '170px',
          columns: [
            {
              field: 'name',
              title: '档位',
              formatter: (row, value) => {
                return '<span class="circle-dot mr1" style="background-color:' + row.color + '"></span>' + noString(value)
              }
            },
            {
              field: 'value',
              title: '占比',
              align: 'right',
              formatter: (row, value) => {
                return `${noString(value)}%`
              }
            }
          ]
        },
        scoreOpt: {
          data: {},
          type: 'gauge',
          chartOption: {},
          chart: null,
          opt: {
            radius: '90%',
            center: ['50%', '45%'],
            detail: {
              offsetCenter: [0, '78%'],
              color: '#404040',
              fontSize: 24,
              fontWeight: 'bold',
              formatter: param => {
                return param + '分'
              }
            },
            axisLabel: {
              formatter: val => {
                const value = val + ''
                return this.fd.data.saveFloat(value, 2)
              }
            },
            title: {
              offsetCenter: [0, '106%'],
              fontSize: 16
            },
            tooltip: {
              formatter: '{c}分'
            },
            grid: {
              top: 20,
              left: 20,
              bottom: 'auto'
            },
            min: 0,
            max: 100,
            splitNumber: 4,
            axisLine: { // 坐标轴线
              show: true,
              lineStyle: {
              }
            }
          }
        }
      }
    },
    computed: {
    },
    mounted() {
      this.getProjectInfo()
    },
    methods: {
      selectProject, getProjectInfo, noString, prevProject, nextProject, refreshProject, goPage, getDisabled,
      refreshPublicedInfo
    },
    watch: {
    }
  }
</script>

<style lang="scss">
.project-info{
  .project-menu{
    width: 140px;
    z-index:999;
    .el-menu {
      border-top: solid 1px #ebebeb;
      border-right: none;
      border-radius: 2px;
    }
    .el-menu-item{
      cursor: pointer;
      font-size: 16px;
      height: 70px;
      line-height: 70px;
      padding: 0 16px;
      border-bottom: solid 1px #ebebeb;
      border-left: solid 1px #ebebeb;
      border-right: solid 1px #ebebeb;
    }
    .el-menu-item:hover {
      background-color:#ecf5ff;
    }
    .el-menu-item.is-active{
      background-color:#1b95e7;
      border-left: solid 1px #1b95e7;
      border-right: solid 1px #1b95e7;
      border-bottom: solid 1px #1b95e7;
      color: #fff;
      .num-circle{
        background-color: #fff;
        color: #1b95e7;
      }
    }
    .el-menu-item.is-disabled{
      color:#999;
      cursor: not-allowed;
      opacity: 1;
    }
  }
  .project-content {
    width: 100%;
    padding-left: 140px;
    .tab-btn{
      top: 0;
      right: 0;
      i.fd-icon:hover{
        color: #1b95e7;
      }
      i.fd-icon.disabled{
        color:#e6e6e6;
        cursor: not-allowed;
      }
    }
  }
  .project-panel{
    height: 281px;
  }
  .num-circle{
    min-width: 20px;
    height: 20px;
    line-height: 20px;
    border-radius: 10px;
    background-color: #d9d9d9;
    color: #fff;
    margin-left: 4px;
  }
  .project-name{
    height: 28px;
    line-height: 28px;
  }
  .vertical-top{
    vertical-align: top;
    padding-top: 2px;
  }
  .col-padding{
    padding: 0 0 4px 0;
  }
  .process-card{
    height: 46px;
    width: 40px;
    line-height: 46px;
    background-color: #13c2c2;
    color: #fff;
    border-radius: 2px;
  }
  .bg-forbid{
    background-color: #d9d9d9;
  }
  .process-unit{
    color: #13c2c2;
    top: 9px;
  }
  .text-forbid{
    color: #d9d9d9;
  }
  .detail-btn{
    width: 104px;
    height: 32px;
    border-radius: 16px;
    background-color:#1b95e7;
    line-height: 32px;
    color: #fff;
    padding: 0 4px 0 12px;
  }
  .detail-icon{
    background-color:#57AEFF;
    height: 26px;
    width: 26px;
    line-height: 26px;
    border-radius: 13px;
    margin-top: 3px;
    i.at {
      color: #fff;
      margin: 2px 0 0 5px;
    }
  }
  .h34{
    font-size: 34px;
  }
  .process-length{
    width: 120px;
  }
  .el-progress-bar__outer{
    background-color: #e5e9f2;
  }
  .text-num{
    margin-bottom: 12px;
  }
  .card-mr{
    margin-right: 4px;
  }
  .days-card{
    color: #fff;
  }
  .days-unit{
    color: #ffa000;
  }
  .day-style{
    width: 40px;
    height: 60px;
    margin-top: -10px;
  }
  .day-num{
    top: 6px;
    left:10px;
  }
  .progress-position{
    width: 100%;
    padding-right:120px;
    top:12px;
    right:0;
  }
  .el-progress--circle .el-progress__text{
    -ms-transform: translate(0,-50%);
  }
  .checkDate-min-width {
    min-width: 185px;
  }
}
</style>
