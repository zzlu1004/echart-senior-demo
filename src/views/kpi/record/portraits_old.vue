<template>
  <div :class="isComponent?'portrait':'portrait app-container'">
    <div
      :style="{'min-height': !isComponent? $store.getters.globals.height - 100 + 'px': 0}">
      <div style="margin: 0 auto;width: 1200px;position: relative" :style="{'min-height': $store.getters.globals.height - 130 + 'px'}" >
        <div class="search-con">
          <el-autocomplete
            class="inline-input autocomplete"
            v-model="state"
            clearable
            prefix-icon="el-icon-search"
            :fetch-suggestions="querySearch"
            placeholder="请输入姓名或部门搜索员额法官"
            @select="currentNodeClick"
          ></el-autocomplete>
        </div>
        <!--人员基本信息-->
        <el-row>
          <el-col :span="24">
            <div class="bg-white relative px3 py3">
              <div class="img-box" :style="{ backgroundImage:'url('+(photoUrl || photo)+')' }"></div>
              <div style="padding-left:144px;">
                <div class="color-title h18 bold mb2">{{userInfo.staffName}}</div>
                <div class="color-subTitle">
                  <el-row class="mb2" :gutter="32">
                    <!--性别-->
                    <el-col :span="4">
                      <div>
                        <svg-icon  icon-class="sex" />
                        <span>{{userInfo.sex|noString}}</span>
                      </div>
                    </el-col>
                    <!--年龄-->
                    <el-col :span="4">
                      <div >
                        <svg-icon  icon-class="age" />
                        <span>{{userInfo.age|noString}}</span>
                      </div>
                    </el-col>
                    <!--籍贯-->
                    <el-col :span="4">
                      <div >
                        <svg-icon  icon-class="where" />
                        <el-tooltip v-if="userInfo.nativePlace && userInfo.nativePlace.length>6"
                                    :open-delay="300" class="item" effect="dark"
                                    :content="userInfo.nativePlace" placement="top-start">
                          <span>{{userInfo.nativePlace.substring(0, 6) + '...'}}</span>
                        </el-tooltip>
                        <span v-else>{{userInfo.nativePlace|noString}}</span>
                      </div>
                    </el-col>
                    <!--政治面貌-->
                    <el-col :span="4">
                      <div >
                        <svg-icon  icon-class="zzmm" />
                        <el-tooltip v-if="userInfo.politicalOutlook && userInfo.politicalOutlook.length>6"
                                    :open-delay="300" class="item" effect="dark"
                                    :content="userInfo.politicalOutlook" placement="top-start">
                          <span>{{userInfo.politicalOutlook.substring(0, 6) + '...'}}</span>
                        </el-tooltip>
                        <span v-else>{{userInfo.politicalOutlook|noString}}</span>
                      </div>
                    </el-col>
                    <!--学位-->
                    <el-col :span="4">
                      <div >
                        <i class="fd-icon icon-xueli"></i>
                        <el-tooltip v-if="userInfo.degree && userInfo.degree.length>6"
                                    :open-delay="300" class="item" effect="dark"
                                    :content="userInfo.degree" placement="top-start">
                          <span>{{userInfo.degree.substring(0, 6) + '...'}}</span>
                        </el-tooltip>
                        <span v-else>{{userInfo.degree|noString}}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="32">
                    <!--职级-->
                    <el-col :span="4">
                      <div >
                        <svg-icon  icon-class="yefg" />
                        <el-tooltip v-if="userInfo.legalPositionName && userInfo.legalPositionName.length>6"
                                    :open-delay="300" class="item" effect="dark"
                                    :content="userInfo.legalPositionName" placement="top-start">
                          <span>{{userInfo.legalPositionName.substring(0, 6) + '...'}}</span>
                        </el-tooltip>
                        <span v-else>{{userInfo.legalPositionName|noString}}</span>
                      </div>
                    </el-col>
                    <!--法官等级-->
                    <el-col :span="4">
                      <div >
                        <svg-icon  style="font-size: 16px" icon-class="zfz" />
                        <el-tooltip v-if="userInfo.chairName && userInfo.chairName.length>6"
                                    :open-delay="300" class="item" effect="dark"
                                    :content="userInfo.chairName" placement="top-start">
                          <span>{{userInfo.chairName.substring(0, 6) + '...'}}</span>
                        </el-tooltip>
                        <span v-else>{{userInfo.chairName|noString}}</span>
                      </div>
                    </el-col>
                    <!--部门正副级-->
                    <el-col :span="4">
                      <div >
                        <svg-icon  icon-class="fgdj" />
                        <el-tooltip v-if="userInfo.judgeLevel && userInfo.judgeLevel.length>6"
                                    :open-delay="300" class="item" effect="dark"
                                    :content="userInfo.judgeLevel" placement="top-start">
                          <span>{{userInfo.judgeLevel.substring(0, 6) + '...'}}</span>
                        </el-tooltip>
                        <span v-else>{{userInfo.judgeLevel|noString}}</span>
                      </div>
                    </el-col>
                    <!--工作年限-->
                    <el-col :span="4">
                      <div >
                        <svg-icon  icon-class="workyear" />
                        <el-tooltip v-if="userInfo.workAge && userInfo.workAge.length>6"
                                    :open-delay="300" class="item" effect="dark"
                                    :content="userInfo.workAge" placement="top-start">
                          <span>{{userInfo.workAge.substring(0, 6) + '...'}}</span>
                        </el-tooltip>
                        <span v-else>{{userInfo.workAge|noString}}</span>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <div>
                  <div class="color-title h14 my2 bold">综合标签</div>
                  <div class="clearfix">
                    <div v-if="!tagData5.length">
                      暂无综合标签~
                    </div>
                    <div v-else class="tag-span" v-for="(item, index) of tagData5" :key="item.id">
                      <div class="center">
                        <div v-if="item.name && item.name.length>6"  style="padding:0 12px 0 0">
                          <span class="aqurt aqurt-left"  :style="{'backgroundColor': colorMap[index]}"></span>
                          <el-tooltip
                            :open-delay="300" class="item" effect="dark"
                            :content="item.name" placement="top-start">
                            <span class="aqurt-center" :style="{'backgroundColor': colorMap[index]}">{{item.name.substring(0, 6) + '...'}}</span>
                          </el-tooltip>
                          <span class="aqurt aqurt-right" :style="{'backgroundColor': colorMap[index]}"></span>
                        </div>
                        <div v-else class="color-title" style="padding:0 12px 0 0">
                          <span class="aqurt aqurt-left" :style="{'backgroundColor': colorMap[index]}"></span>
                          <span class="aqurt-center" :style="{'backgroundColor': colorMap[index]}">{{item.name}}</span>
                          <span class="aqurt aqurt-right" :style="{'backgroundColor': colorMap[index]}"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <!--学习拓展 + 表彰奖励-->
          <el-col :span="12">
            <el-row>
              <el-col :span="24">
                <div class="bg-white  mt2" style="height: 154px">
                  <div class="height-title bd-bottom px2 color-title bold h16 relative">
                    学习拓展
                  </div>
                  <div class="mx3 my4">
                    <el-row>
                      <el-col :span="12">
                        <div class="px1 bd-tag-left f-left">
                          <span class="title mb1">调训培训</span><br>
                          <span class="name">累计次数：</span>
                          <span class="value">{{studyData.trainCount}}</span>
                          <span class="name">次</span>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="px1 bd-tag-left f-left">
                          <span class="title mb1">干部兼职</span><br>
                          <span class="name">累计次数：</span>
                          <span class="value">{{studyData.jobCount}}</span>
                          <span class="name">次</span>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-col>
              <el-col :span="24">
                <div class="bg-white  mt2" style="height: 271px">
                  <div class="height-title bd-bottom px2 color-title bold h16 relative">
                    表彰奖励
                  </div>
                  <div v-if="rewardData.length" class="m3 auto" style="height: 180px">
                    <div >
                      <div v-for="(item, index) of rewardData" :key="item.id" class="relative">
                        <div class="absolute" style="height:100%">
                          <div class="inline-block relative" style="height:100%">
                            <span v-if="index !== rewardData.length-1" class="inline-block notice-line absolute"></span>
                            <i class="fd-icon icon-gerenxinxijiedianweidianji ml-5px" style="font-size:12px;"/>
                          </div>
                        </div>
                        <div class="notice-title">
                        <span>
                          <div class="color-title bold pb1">{{parseTime(item.createTime,'{y}-{m}')}}</div>
                          <div>{{item.workunit+item.item}}</div>
                        </span>
                        </div>
                      </div>
                    </div>

                  </div>
                  <FdNoContent v-else size="5rem"></FdNoContent>
                </div>

              </el-col>
            </el-row>
          </el-col>
          <!--个人履历-->
          <el-col :span="12">
            <div class="bg-white  mt2" style="height: 442px">
              <div class="height-title bd-bottom px2 color-title bold h16 relative">
                个人履历
              </div>
              <div class="m3 auto" style="height: 350px">
                <div v-if="resumeData.length">
                  <div v-for="(item, index) of resumeData" :key="item.id" class="relative">
                    <div class="absolute" style="height:100%">
                      <div class="inline-block relative" style="height:100%">
                        <span v-if="index !== resumeData.length-1" class="inline-block notice-line absolute"></span>
                        <i class="fd-icon icon-gerenxinxijiedianweidianji ml-5px" style="font-size:12px;"/>
                      </div>
                    </div>
                    <div class="notice-title">
                        <span>
                          <div class="color-title bold pb1">{{parseTime(item.startDate,'{y}-{m}')}}至{{parseTime(item.endDate,'{y}-{m}')}}</div>
                          <div>{{item.companyName ? item.companyName : ''}}{{item.departName ? '、' + item.departName: ''}}{{item.position ? '、' + item.position : ''}}{{item.level ? '、' + item.level : ''}}</div>
                        </span>
                    </div>
                  </div>
                </div>
                <FdNoContent v-else size="5rem" class="mt6"></FdNoContent>
              </div>
            </div>
          </el-col>
        </el-row>
        <!--办案数量-->
        <el-row>
          <el-col :span="24">
            <div class="bg-white  mt2">
              <div class="height-title bd-bottom px2 color-title bold h16 relative">
                办案数量
                <el-radio-group v-model="type"
                  size="mini" class="absolute"
                  style="top:6px;right:8px;"
                  @change="changeType">
                  <el-radio-button label="one">本年</el-radio-button>
                  <el-radio-button label="three">近三年</el-radio-button>
                </el-radio-group>
              </div>
              <div class="p3">
                <el-row>
                  <el-col :span="16">
                    <div>
                        <div class="card-img" style="padding: 0 24px;margin-right: 1%">
                         <span class="m2 hidden">
                            <div class="h14">承办案件数</div>
                            <div class="py1 h12">
                              <el-row>
                                <el-col :span="6">
                                  <span class="h20">{{workData.caseCount|noString}}</span>
                                  <span>件</span>
                                </el-col>
                                <el-col :span="6">
                                  <span v-if="type === 'one'">
                                    <span class="h12 pbx inline-block">同比</span><br>
                                    <span v-if="workData.caseCountYoy && workData.caseCountYoy > 0"><i class="color-green el-icon-caret-top"></i>{{fd.data.saveFloat(workData.caseCountYoy, 2)|noString}}%</span>
                                    <span v-else><i class="color-danger el-icon-caret-bottom"></i>{{fd.data.saveFloat(workData.caseCountYoy, 2)|noString}}%</span>
                                  </span>
                                </el-col>
                                <el-col :span="6">
                                  <div class="inline-block">
                                    <span  class="h12 pbx inline-block">部门平均</span><br>
                                    <span>{{fd.data.saveFloat(workData.departAvgCaseCount, 2)|noString}}</span>
                                  </div>
                                </el-col>
                              </el-row>
                            </div>
                          </span>
                        </div>
                        <div class="card-img" style="padding: 0 24px">
                          <span class="m2">
                            <div class="h14">承办案件工作量</div>
                            <div class="py1 h12">
                              <el-row>
                                <el-col :span="6">
                                   <span class="h20">{{fd.data.saveFloat(workData.cbrWorkload, 2)|noString}}</span>
                                </el-col>
                                <el-col :span="6">
                                  <span v-if="type === 'one'">
                                    <span class="h12 pbx inline-block">同比</span><br>
                                    <span v-if="workData.cbrWorkloadYoy && workData.cbrWorkloadYoy > 0"><i class="color-green el-icon-caret-top"></i>{{fd.data.saveFloat(workData.cbrWorkloadYoy, 2)|noString}}%</span>
                                    <span v-else><i class="color-danger el-icon-caret-bottom"></i>{{fd.data.saveFloat(workData.cbrWorkloadYoy, 2)|noString}}%</span>
                                  </span>
                                </el-col>
                                <el-col :span="6">
                                  <div class="inline-block">
                                    <span class="h12 pbx inline-block">部门平均</span><br>
                                    <span>{{fd.data.saveFloat(workData.departAvgWorkload, 2)|noString}}</span>
                                  </div>
                                </el-col>
                              </el-row>
                            </div>
                          </span>
                        </div>
                    </div>
                    <div class="mt2">
                        <div class="card-box mt1" style="padding: 0 24px;margin-right: 24px;margin-left: 5px">
                         <span class="m2 hidden">
                            <div class="h14">参办案件工作量</div>
                            <div class="pt1 h12">
                              <span class="h20">{{workData.workload|noString}}</span>
                            </div>
                         </span>
                        </div>
                        <div class="card-box mt1" style="padding: 0 24px;margin-right: 24px">
                          <span class="m2 hidden">
                            <div class="h14">审判长案件工作量</div>
                            <div class="pt1 h12">
                              <span class="h20">{{workData.spzWorkload|noString}}</span>
                            </div>
                         </span>
                        </div>
                        <div class="card-box mt1" style="padding: 0 24px">
                           <span class="m2 hidden">
                            <div class="h14">合议庭成员案件工作量</div>
                            <div class="pt1 h12">
                              <span class="h20">{{workData.hytWorkload|noString}}</span>
                            </div>
                         </span>
                        </div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <fd-echart :option="pieOption" height="200px"></fd-echart>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="16">
                    <div>
                      <fd-echart :option="barOption" height="235px"></fd-echart>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <fd-table
                      :option="caseOpt"
                      class="table-class"
                      :loading="caseLoading"
                    ></fd-table>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
        <!--办案质效-->
        <el-row>
          <el-col :span="24">
            <div class="bg-white mt2" style="height: 324px">
              <div class="height-title bd-bottom px2 color-title bold h16 relative">
                办案质效
                <el-radio-group v-model="type2"
                                size="mini" class="absolute"
                                style="top:6px;right:8px;"
                                @change="changeType2">
                <el-radio-button label="one">本年</el-radio-button>
                <el-radio-button label="three">近三年</el-radio-button>
              </el-radio-group>
              </div>
              <div class="p3">
                <div>
                  <el-row :gutter="24">
                    <el-col :span="16">
                      <fd-echart :option="vbarOpt" height="245px"></fd-echart>
                    </el-col>
                    <el-col :span="8">
                      <fd-table
                        style="margin-top: 32px"
                        :option="indexOpt"
                        :loading="caseLoading"
                      ></fd-table>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import { getBasicInfo, getReward, getStudy, getResume, getCause,
    getTag, changeType, changeType2, getWorkload, getIndex, getReason, getUserPhoto, currentNodeClick, getAll } from '@/api/kpi/record/portraits'
  import { getUserDetail, createFilter, querySearch } from '@/api/kpi/record/portraitHome'
  import head from '@/assets/defaultPhoto.png'
  import { parseTime, noString } from '@/utils/filters'
  import fdTable from 'fd/table'
  import fdEchart from 'fd/echarts/echarts'
  import FdNoContent from 'fd/noContent'
  export default {
    name: 'portraits',
    components: {
      fdTable, fdEchart, FdNoContent
    },
    props: {
      isComponent: {
        type: Boolean,
        default: false
      },
      userId: {
        type: String,
        default: ''
      }
    },
    computed: {
      staffId() {
        return this.$store.getters.user.id
      }
    },
    data() {
      return {
        workloads: [],
        state: '',
        params: {
          companyId: this.$store.getters.user.companyCode,
          staffTypes: ['k10003-01'],
          pigurePortrait: true
        },
        restaurants: [],
        userDetail: [],
        homeUserId: '',
        userDataId: '',
        photoUrl: '',
        photo: head,
        type: 'one',
        type2: 'one',
        userInfo: {},
        studyData: [],
        resumeData: [],
        rewardData: [],
        activeName: 'first',
        barOption: {
          data: [],
          type: 'vbar',
          chartOption: {},
          chart: null,
          opt: {
            title: {
              text: '案由排名TOP10',
              textStyle: {
                fontSize: '14'
              },
              top: '0%'
            },
            grid: {
              bottom: 0,
              left: 15
            }
          }
        },
        pieOption: {
          data: [], // 生成图标的数据
          type: 'pie', // 图标类型
          chartOption: {}, // 全量的默认配置
          chart: null, // echart.init后生成的echart对象
          opt: {
            title: {
              text: '',
              textStyle: {
                fontSize: '14',
                fontWeight: '700'
              }
            },
            legend: {
              right: '60',
              top: '165',
              show: true,
              textStyle: {
                fontWeight: 'normal'
              }
            },
            tooltip: {
              formatter: (param) => {
                const data = param.data || []
                return data.name + ' : ' + data.value + ' 占比：' + data.rate + '%'
              }
            },
            series: {
              radius: ['45%', '60%'],
              center: ['55%', '35%'],
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
            }
          } // 覆盖默认配置，规则参照echart官网
        },
        caseOpt: {
          stripe: true,
          border: true,
          data: [],
          columns: [{
            field: 'name',
            title: '案由名称'
          }, {
            field: 'count',
            title: '案件数',
            align: 'right'
          }]
        },
        indexOpt: {
          stripe: true,
          border: true,
          data: [],
          columns: [{
            field: 'name',
            title: '指标名称'
          }, {
            field: 'value',
            title: '个人值',
            align: 'right',
            formatter: (row, value) => {
              // 审理时间指数*100
              return row.id === 'zb003007' ? this.fd.data.saveFloat(value * 100, 2) + '%' : this.fd.data.saveFloat(value, 2) + '%'
            }
          }, {
            field: 'departAvgValue',
            title: '部门值',
            align: 'right',
            formatter: (row, value) => {
              // 审理时间指数*100
              return row.id === 'zb003007' ? this.fd.data.saveFloat(value * 100, 2) + '%' : this.fd.data.saveFloat(value, 2) + '%'
            }
          }]
        },
        caseLoading: false,
        tagData: [],
        tagData5: [],
        workData: {},
        colorMap: ['#2266EE', '#1199FF', '#22BBEE', '#FFAA22', '#FF7733', '#FF6688', '#BB66CC', '#223273', '#578DC6',
          '#9CCF25', '#AC662E', '#BC2F5C', '#6D7C9D', '#51599D', '#5D71CB', '#304B94'],
        vbarOpt: {
          data: [],
          type: 'vbar',
          chartOption: {},
          dataZoom: true,
          chart: null,
          opt: {
            xAxis: {
              axisLabel: {
                rotate: 0,
                interval: 'auto'
              }
            },
            yAxis: {
              name: '',
              axisLabel: {
                formatter: param => param + '%'
              }
            },
            tooltip: {
              show: true,
              formatter: (param) => {
                // debugger
                const data = param[0]
                const data2 = param[1]
                return `${data.axisValue}<br/>${data.marker}${data.seriesName}: ${data.value}%<br/>${data2.marker}${data2.seriesName}: ${data2.value}%`
              }
            },
            legend: {
              top: 0,
              left: 'auto',
              right: 24,
              textStyle: {
                fontWeight: 'normal'
              }
            },
            grid: {
              bottom: 10,
              left: 0
            }
          }
        }
      }
    },
    mounted() {
      this.homeUserId = this.$route.query.homeUserId
      if (this.homeUserId) {
        this.userDataId = this.homeUserId
      } else {
        this.userDataId = this.userId || this.staffId
      }
      this.getAll()
    },
    methods: {
      getBasicInfo, getReward, getStudy, getResume, parseTime, getCause,
      getTag, noString, changeType, changeType2, getWorkload, getIndex, getReason, getUserPhoto, getUserDetail,
      currentNodeClick,
      createFilter,
      querySearch, getAll
    },
    watch: {
    }
  }
</script>

<style lang="scss">
  @import 'src/styles/variables.scss';
.portrait {
  .table-class{
    height: 195px;
    overflow: auto;
    margin-top: 32px;
  }
  .card-box{
    float: left;
    width: 230px;
    /*border: 1px solid rgba(10, 47, 112, 0.1);*/
    box-shadow: 0px 2px 4px 0px
    rgba(10, 47, 112, 0.1);
    border-radius: 4px;
  }
  .pbx{
    padding-bottom: 3px;
  }
  .card-img{
    width: 48%;
    float: left;
    color: #fff;
    background-image: url("~@/assets/card.svg");
    background-size: contain;
    background-repeat: no-repeat;
  }
  .bd-tag-left{
    border-left: 4px solid #3ca4eb;
    .name{
      font-size: 14px;
      font-weight: 500;
      color: #5d6573;
    }
    .value{
      font-size: 20px;
      font-weight: bold;
      letter-spacing: 0px;
      color: #5d6573;
    }
    .title{
      font-size: 14px;
      display: inline-block;
      font-weight: normal;
      letter-spacing: 0px;
      color: #2e394b;
    }
  }
  .ml10{
    margin-left: 100px;
  }
  .search-con{
    position: absolute;
    right: 24px;
    top: -62px;
    z-index: 100;
  }
  .autocomplete{
    width: 300px;
    height: 32px;
  }
  .autocomplete .el-input__inner{
    height: 32px;
    line-height: 32px;
  }
  .aqurt {
    float: left;
    display: inline-block;
    /*background-color: #1b95e7;*/
    width: 16px;
    height: 24px;
  }
  .aqurt-center {
    float: left;
    /*background-color: #1b95e7;*/
    color: white;
    font-size: 12px;
    display: inline-block;
    line-height: 24px;
    height: 24px;
  }
  .aqurt-left{
    border-bottom-left-radius: 67%;
  }
  .aqurt-right{
    border-top-right-radius: 67%;
  }
  .dot-icon{
    width: 8px;
    height: 8px;
    border-radius: 4px;
  }
  .dot-icon-unread{
    background-color: #ff7577;
    top: 4px;
    left: -14px;
  }
  .info-pd {
    padding: 3px 4px;
  }
  .notice-line{
    height: 100%;
    width: 2px;
    background-color: #bcbcbc;
    top: 14px;
    right: 5px;
  }
  .notice-date{
    width: 124px;
  }
  .notice-title{
    padding-left: 20px;
    margin-bottom: 9px;
  }
  .icon-gerenxinxijiedianweidianji{
    color: $c-primary;
  }
  .tag-bd{
    border-left: 4px solid $c-primary;
  }
  .img-box{
    left: 24px;
    top: 24px;
    width: 120px;
    height: 160px;
    position: absolute;
    background-color: white;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 2;
  }
  .radius-info {
    border-radius: 40px;
    padding: 4px;
  }
  .tag-span{
    float:left;
  }
  .tag-box{
    display:inline-block;
    width:44px;
    height:44px;
    border-radius: 22px;
    background-color:#13c2c2;
  }
  .color-success{
    color: green;
  }
  .color-danger{
    color: red;
  }
}
</style>
