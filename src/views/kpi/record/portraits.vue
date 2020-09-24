<template>
  <div :class="isComponent?'portrait':'portrait app-container'">
    <div
      :style="{'min-height': !isComponent? $store.getters.globals.height - 100 + 'px': 0}">
      <div style="margin: 0 auto;width: 1200px;position: relative" :style="{'min-height': $store.getters.globals.height - 130 + 'px'}" >
        <div class="search-con mb2">
          <div class="search-time">
            <span>时间：</span>
            <el-date-picker
              v-model="timePick"
              type="daterange"
              size="small"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间">
            </el-date-picker>
            <el-button @click="timeChange" class="ml3" type="primary" size="small">查询</el-button>
          </div>
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
                    <!--部门-->
                    <el-col :span="4">
                      <div >
                        <svg-icon  icon-class="bm" />
                        <el-tooltip v-if="userInfo.departName && userInfo.departName.length>6"
                                    :open-delay="300" class="item" effect="dark"
                                    :content="userInfo.departName" placement="top-start">
                          <span>{{userInfo.departName.substring(0, 6) + '...'}}</span>
                        </el-tooltip>
                        <span v-else>{{userInfo.departName|noString}}</span>
                      </div>
                    </el-col>
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
                    <el-col :span="4" v-if="isJudge">
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
                    <el-col :span="4" v-if="isJudge">
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
        <!-- 办案数量 -->
        <el-row>
          <el-col :span="24">
            <div class="bg-white  mt2">
              <div class="height-title bd-bottom px2 color-title bold h16 relative">
                {{isJudge ? '' : '辅助'}}办案数量
              </div>
              <div>
                <el-row>
                  <el-col :span="12" class="cases need-line">
                    <div class="cases-title">{{isJudge? '承办' : '法官助理'}}案件数</div>
                    <div class="cases-static">
                      <div class="cases-static-title">{{isJudge? '承办' : '法官助理'}}案件数</div>
                      <div class="cases-static-content">
                        <span class="cases-static-unit">{{caseData.caseCount}}</span><span class="cases-static-unit-word">件</span><span class="cases-static-compare">同比<span class="cases-static-compare-num">{{caseData.caseCountYoy >= 0 ? '+' : ''}}{{caseData.caseCountYoy}}%</span></span>
                      </div>
                    </div>
                    <div class="static-title">案由排名TOP5</div>
                    <fd-echart class="cases-echart" :option="barOptionTop5" height="235px"></fd-echart>
                  </el-col>
                  <el-col :span="12" class="cases">
                    <div class="cases-title">
                      {{isJudge? '承办' : '法官助理'}}案件工作量
                      <el-select class="coefficient" clearable :popper-append-to-body="false" @change="coefficientChange" v-model="coefficientSelected" size="small" placeholder="请选择权重系数">
                        <el-option
                          v-for="item in coefficientOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </div>
                    <el-row>
                      <el-col :span="8">
                        <div class="cases-static">
                          <div class="cases-static-title">{{isJudge? '承办' : '法官助理'}}案件工作量</div>
                          <div class="cases-static-content">
                            <span class="cases-static-unit">{{workloadData.workload}}</span><span class="cases-static-unit-word">件</span><span class="cases-static-compare">同比<span class="cases-static-compare-num">{{workloadData.workloadYoy >= 0 ? '+' : ''}}{{workloadData.workloadYoy}}%</span></span>
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="cases-static">
                          <div class="cases-static-title">部门排名</div>
                          <div class="cases-static-content">
                            <span class="cases-static-ranking">第 <span class="cases-static-ranking-num">{{workloadData.departRank}}</span>/{{workloadData.departCount}} 名</span>
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="cases-static">
                          <div class="cases-static-title">全院排名</div>
                          <div class="cases-static-content">
                            <span class="cases-static-ranking">第 <span class="cases-static-ranking-num">{{workloadData.courtRank}}</span>/{{workloadData.courtCount}} 名</span>
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                    <div class="static-title">个人办案工作量分析</div>
                    <fd-echart class="cases-echart" :option="barOptionPersonal" height="235px"></fd-echart>
                  </el-col>
                </el-row>
                <div class="trend-echart">
                  <div class="static-title">{{isJudge? '' : '辅助'}}办案数量月度趋势图</div>
                  <fd-echart :option="trendOption" height="310px"></fd-echart>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
         <!--办案质效-->
        <el-row v-if="isJudge">
          <el-col :span="24">
            <div class="bg-white mt2" style="height: 420px">
              <div class="height-title bd-bottom px2 color-title bold h16 relative">
                办案质效
                <el-button v-if="elements.chooseTarget" class="choose-btn" size="mini" @click="targetSystem = true">选择指标</el-button>
              </div>
              <div class="p3">
                <div class="effect-wrapper" v-loading="effectLoading">
                  <el-row v-if="effectData.length" class="effect-echart" :gutter="20">
                    <el-col class="effect-echart-col" :span="8" v-for="(item, index) in effectData" :key="index">
                      <span class="effect-detail" @click="showEffectDetail(item.indexId, item.indexName)">查看趋势</span>
                      <fd-echart class="cases-echart" :option="item" height="235px"></fd-echart>
                    </el-col>
                  </el-row>
                  <FdNoContent v-else size="10rem" tip="请选择指标~"></FdNoContent>
                </div>
                <!-- 分页配置 -->
                <fd-pagination
                  class="mb3"
                  v-if="effectDataSelected.length > 1"
                  :limit="3"
                  :total="effectDataSelected.length"
                  :currentChange="currentChange">
                </fd-pagination>
              </div>
            </div>
          </el-col>
        </el-row>
        <!--工作考评-->
        <el-row>
          <el-col :span="24">
            <div class="bg-white  mt2">
              <div class="height-title bd-bottom px2 color-title bold h16 relative">
                工作考评
              </div>
              <div>
                <el-row>
                  <el-col :span="12" class="cases">
                    <div class="cases-title">历次考评结果统计</div>
                    <fd-table
                      :option="tableOpt"
                      :default-sort = "{
                  prop: 'trainTime', order: 'descending'}"
                      :sortable=true
                      :height='235'
                      class="table-width"
                    >
                    </fd-table>
                  </el-col>
                  <el-col :span="12" class="cases">
                    <div class="cases-title">
                      考评各项维度分析
                      <el-select class="coefficient" :popper-append-to-body="false" clearable v-model="radarSelected" @change="getEvaluationDimension" size="small" placeholder="请选择">
                        <el-option
                          v-for="item in tableOpt.data"
                          :key="item.schemeId"
                          :label="item.schemeName"
                          :value="item.schemeId">
                        </el-option>
                      </el-select>
                    </div>
                    <fd-echart class="radar-echart" :option="radarOption" height="320px"></fd-echart>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <!--个人履历-->
          <el-col :span="12">
            <div class="bg-white  mt2" style="height: 514px">
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
          <!--学习拓展 + 表彰奖励-->
          <el-col :span="12">
            <el-row>
              <el-col :span="24">
                <div class="bg-white  mt2" style="height: 223px">
                  <div class="height-title bd-bottom px2 color-title bold h16 relative">
                    学习拓展
                    <el-radio-group v-if="isJudge" class="btn-group" size="small" v-model="studyType" @change="getStudy">
                      <el-radio-button label="train">调训培训</el-radio-button>
                      <el-radio-button label="job">干部兼职</el-radio-button>
                    </el-radio-group>
                  </div>
                  <div v-if="studyData.length" class="m3 auto" style="height: 180px">
                    <div >
                      <div v-for="(item, index) of studyData" :key="item.id" class="relative">
                        <div class="absolute" style="height:100%">
                          <div class="inline-block relative" style="height:100%">
                            <span v-if="index !== studyData.length-1" class="inline-block notice-line absolute"></span>
                            <i class="fd-icon icon-gerenxinxijiedianweidianji ml-5px" style="font-size:12px;"/>
                          </div>
                        </div>
                        <div class="notice-title">
                        <span>
                          <template v-if="studyType === 'train'">
                            <div class="color-title bold pb1">{{parseTime(item.train_start_time,'{y}-{m}')}}至{{parseTime(item.train_end_time,'{y}-{m}')}}</div>
                            <div>{{item.class_name}}</div>
                          </template>
                          <template v-else>
                            <div class="color-title bold pb1">{{parseTime(item.create_time,'{y}-{m}')}}</div>
                            <div>{{item.situation}}</div>
                          </template>
                        </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <FdNoContent v-else size="5rem" :tip="`该法官${isJudge ? '' : '助理'}${studyType === 'train' ? '无调训培训经历' : '无干部兼职经历'}~`"></FdNoContent>
                </div>
              </el-col>
              <el-col :span="24">
                <div class="bg-white  mt2" style="height: 275px">
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
                  <FdNoContent v-else size="5rem" :tip="`该法官${isJudge ? '' : '助理'}无表彰奖励~`"></FdNoContent>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 指标弹框 -->
    <fd-dialog
      title="指标体系"
      :syncVisible="targetSystem"
      @beforeClose="beforeClose"
      maxHeight="450px"
      width="970px"
    >
      <div slot="fd-body">
        <div>
          <fd-target ref="target" v-bind:menus="indexData"></fd-target>
        </div>
      </div>
      <div slot="fd-footer">
        <el-button size="small" @click="cancelTargetSystem">取消</el-button>
        <el-button size="small" type="primary" @click="saveTargetList" :loading="btnLoading">确定</el-button>
      </div>
    </fd-dialog>
    <!--指标月度趋势-->
    <fd-dialog
      title="指标月度趋势"
      :syncVisible="effectDetailDialog"
      @beforeClose="effectDetailDialog = false"
      maxHeight="450px"
      width="970px"
    >
      <div slot="fd-body" v-loading="effectDetailLoading">
        <fd-echart class="cases-echart" :option="trendOptionDetail" height="235px"></fd-echart>
      </div>
      <div slot="fd-footer">
        <el-button size="small" type="primary" @click="effectDetailDialog = false">确定</el-button>
      </div>
    </fd-dialog>
  </div>
</template>

<script>
  import { getBasicInfo, getReward, getStudy, getResume,
    getTag, getWorkload, getIndex, getReason, getUserPhoto, currentNodeClick, getCaseQuantity,
    getCaseWorkload, getTrend, getWeight, getEvaluationList, getEvaluationDimension, getEffectCard, saveTargetList, getTargetSelected, getEffectDetail, getAll } from '@/api/kpi/record/portraits'
  import { getUserDetail, createFilter, querySearch } from '@/api/kpi/record/portraitHome'
  import head from '@/assets/defaultPhoto.png'
  import { parseTime, noString } from '@/utils/filters'
  import fdTable from 'fd/table'
  import fdEchart from 'fd/echarts/echarts'
  import FdTarget from '../components/FdTargetPortraits.vue'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  import FdNoContent from 'fd/noContent'
  import echarts from 'echarts'
  import FdPagination from 'fd/pagination/pagination'
  export default {
    name: 'portraits',
    components: {
      fdTable, fdEchart, FdNoContent, FdTarget, fdDialog, FdPagination
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
      },
      elements() {
        return this.$store.getters.elements.portraits || {}
      }
    },
    data() {
      return {
        isJudge: true,
        timePick: '', // 时间范围
        coefficientSelected: '', // 权重系数
        radarSelected: '', // 考评各项维度分析系数
        coefficientOptions: [], // 权重系数选项
        targetSystem: false,
        effectDetailLoading: false,
        effectLoading: false,
        // 细则配置的指标信息
        indexData: [],
        // 获取最新的目录
        getMenus: true,
        caseData: {}, // 承办案件数统计
        workloadData: {}, // 承办案件工作量统计
        // workloads: [],
        effectPage: 1, // 指标月度趋势页码
        btnLoading: false,
        effectData: [], // 指标月度趋势展示数据
        indexIds: [], // 分页的指标id集合
        effectDataSelected: [], // 已选中的指标
        effectDataOrigin: [
          [
            {
              name: '个人值',
              value: 50
            }, {
              name: '部门值',
              value: 10
            }, {
              name: '全院值',
              value: 110
            }
          ],
          [
            {
              name: '个人值',
              value: 70
            }, {
              name: '部门值',
              value: 10
            }, {
              name: '全院值',
              value: 110
            }
          ],
          [
            {
              name: '个人值',
              value: 90
            }, {
              name: '部门值',
              value: 10
            }, {
              name: '全院值',
              value: 110
            }
          ],
          [
            {
              name: '个人值',
              value: 103
            }, {
              name: '部门值',
              value: 10
            }, {
              name: '全院值',
              value: 110
            }
          ],
          [
            {
              name: '个人值',
              value: 106
            }, {
              name: '部门值',
              value: 10
            }, {
              name: '全院值',
              value: 110
            }
          ]
        ],
        effectDetailDialog: false, // 指标月度趋势弹框 显示与隐藏
        tableOpt: {
          stripe: true,
          border: true,
          height: '300px',
          data: [],
          columns: [
            {
              field: 'index',
              title: '序号',
              width: 80
            },
            {
              field: 'cycle',
              title: '考核周期',
              formatter: (row, value) => {
                return value || '--'
              }
            },
            {
              field: 'schemeName',
              title: '考核方案',
              formatter: (row, value) => {
                return value || '--'
              }
            },
            {
              field: 'grade',
              title: '评档',
              formatter: (row, value) => {
                return value || '--'
              }
            }
          ]
        },
        state: '',
        studyType: 'train',
        params: {
          companyId: this.$store.getters.user.companyCode,
          staffTypes: ['k10003-01', 'k10003-02'],
          pigurePortrait: true
        },
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
        barOptionTop5: {
          data: [],
          type: 'hbar',
          chartOption: {},
          chart: null,
          opt: {
            title: {
              text: '',
              textStyle: {
                fontSize: '14',
                color: '#2e394b'
              },
              top: '0%'
            },
            grid: {
              bottom: 0,
              top: 10,
              left: 0
            },
            yAxis: {
              axisLabel: {
                formatter: function(value) {
                  let back = value
                  if (value && value.length > 10) {
                    back = value.substring(0, 9) + '...'
                  }
                  return back
                }
              }
            },
            series: {
              itemStyle: {
                // emphasis: {
                //   barBorderRadius: 7
                // },
                barBorderRadius: [0, 2, 2, 0],
                color: new echarts.graphic.LinearGradient(
                  0, 0, 1, 0,
                  [
                    { offset: 0, color: '#2266EE' },
                    { offset: 1, color: '#1198FE' }
                  ]
                )
              }
            }
          }
        },
        barOptionPersonal: {
          type: 'vbar',
          data: [],
          // types: [{ type: 'vbar', key: 'value' }, { type: 'line', key: 'count' }],
          chartOption: {},
          chart: null,
          opt: {
            title: {
              text: '',
              textStyle: {
                fontSize: '14'
              },
              top: '0%'
            },
            grid: {
              bottom: 0,
              top: 10,
              left: 0
            },
            yAxis: {
              axisLine: false
            },
            series: {
              type: 'bar',
              itemStyle: {
                barBorderRadius: [2, 2, 0, 0],
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#1198FE' },
                    { offset: 1, color: '#2266EE' }
                  ]
                )
              },
              markLine: {
                symbol: ['none', 'none'], // 去掉箭头
                label: {
                  normal: {
                    formatter: '个人值：200件', // 这儿设置安全基线
                    padding: [-13, -20, 15, -100],
                    position: 'end'
                  }
                },
                itemStyle: {
                  normal: {
                    lineStyle: {
                      type: 'solid',
                      width: 2,
                      color: '#ffaa22'
                    }
                  }
                },
                data: [{
                  name: '个人工作',
                  yAxis: 0
                }]
              }
            }
          }
        },
        trendOption: {
          data: [],
          type: 'mix',
          types: [{ type: 'vbar', key: 'caseCount' }, { type: 'line', key: 'workload' }, { type: 'line', key: 'departAvgWorkload' }, { type: 'line', key: 'courtAvgWorkload' }],
          chartOption: {},
          dataZoom: true,
          chart: null,
          opt: {
            title: {
              text: '',
              textStyle: {
                fontSize: '14',
                color: '#2e394b'
              },
              top: '0%'
            },
            legend: {
              top: 16,
              right: 160
            },
            yAxis: [{
              name: '承办案件数(件)',
              type: 'value',
              interval: 10,
              axisLine: false
            }, {
              name: '承办案件工作量(件)',
              type: 'value',
              interval: 5,
              axisLine: false
            }],
            xAxis: {
              axisLabel: {
                formatter: function(value) {
                  return value
                }
              }
            },
            series: [{
              type: 'bar',
              name: '案件数',
              itemStyle: {
                barBorderRadius: [2, 2, 0, 0],
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#1198FE' },
                    { offset: 1, color: '#2266EE' }
                  ]
                )
              }
            }, {
              type: 'line',
              name: '个人工作量',
              color: '#66ddee',
              symbol: 'circle',
              symbolSize: 8,
              yAxisIndex: 1
            }, {
              type: 'line',
              name: '部门平均工作量',
              color: '#ffa42d',
              symbol: 'circle',
              symbolSize: 8,
              itemStyle: {
                normal: {
                  lineStyle: {
                    type: 'dashed'
                  }
                }
              },
              yAxisIndex: 1
            }, {
              type: 'line',
              name: '全院平均工作量',
              color: '#ff6688',
              symbol: 'circle',
              symbolSize: 8,
              itemStyle: {
                normal: {
                  lineStyle: {
                    type: 'dashed'
                  }
                }
              },
              yAxisIndex: 1
            }],
            grid: {
              top: 50,
              bottom: 35,
              left: 50,
              right: 50
            }
          }
        },
        trendOptionDetail: {
          data: [],
          type: 'mix',
          types: [{ type: 'line', key: 'value' }, { type: 'line', key: 'departValue' }, { type: 'line', key: 'courtValue' }],
          chartOption: {},
          dataZoom: true,
          chart: null,
          opt: {
            title: {
              text: '',
              textStyle: {
                fontSize: '14',
                color: '#2e394b'
              },
              top: '0%'
            },
            yAxis: {
              type: 'value',
              axisLine: false,
              splitLine: {
                show: true,
                lineStyle: {
                  type: 'dashed'
                }
              }
            },
            xAxis: {
              axisLabel: {
                formatter: function(value) {
                  return value
                }
              }
            },
            series: [{
              type: 'line',
              name: '个人值',
              color: '#2266ee',
              symbol: 'circle',
              symbolSize: 8
            }, {
              type: 'line',
              name: '部门值',
              color: '#66ddee',
              symbol: 'circle',
              symbolSize: 8,
              itemStyle: {
                normal: {
                  lineStyle: {
                    type: 'dashed'
                  }
                }
              }
            }, {
              type: 'line',
              name: '全院值',
              color: '#ffa42d',
              symbol: 'circle',
              symbolSize: 8,
              itemStyle: {
                normal: {
                  lineStyle: {
                    type: 'dashed'
                  }
                }
              }
            }],
            grid: {
              top: 50,
              bottom: 0,
              left: 15,
              right: 15
            }
          }
        },
        barOptionEffect: {
          data: [],
          type: 'vbar',
          chartOption: {},
          chart: null,
          opt: {
            title: {
              text: '',
              textStyle: {
                fontSize: '14'
              },
              top: '0%'
            },
            yAxis: {
              axisLine: false
            },
            series: {
              type: 'bar',
              itemStyle: {
                barBorderRadius: [2, 2, 0, 0],
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#1198FE' },
                    { offset: 1, color: '#2266EE' }
                  ]
                )
              }
            },
            grid: {
              top: 50,
              bottom: 0,
              left: 15,
              right: 0
            }
          }
        },
        radarOption: {
          type: 'radar',
          chart: {},
          chartOption: {},
          data: {
            radar: [],
            series: []
          },
          opt: {
            grid: {
              top: 15,
              left: 0,
              bottom: 0,
              right: 0
            },
            legend: {
              orient: 'vertical' // 垂直显示
            },
            radar: {
              axisLine: {
                lineStyle: {
                  opacity: 0.3,
                  color: '#e2e6ec'
                }
              },
              splitLine: {
                lineStyle: {
                  type: 'dashed',
                  // opacity: 0.3,
                  color: '#e2e6ec'
                }
              }
            }
          }
        },
        tagData: [],
        tagData5: [],
        radio3: '上海',
        colorMap: ['#2266EE', '#1199FF', '#22BBEE', '#FFAA22', '#FF7733', '#FF6688', '#BB66CC', '#223273', '#578DC6',
          '#9CCF25', '#AC662E', '#BC2F5C', '#6D7C9D', '#51599D', '#5D71CB', '#304B94']
      }
    },
    mounted() {
      this.homeUserId = this.$route.query.homeUserId
      if (this.homeUserId) {
        this.userDataId = this.homeUserId
      } else {
        this.userDataId = this.userId || this.staffId
      }
      this.getTimeDefault()
      this.getAll()
      // this.getEffectData()
    },
    methods: {
      getBasicInfo, getReward, getStudy, getResume, parseTime,
      getTag, noString, getWorkload, getIndex, getReason, getUserPhoto, getUserDetail,
      currentNodeClick,
      createFilter,
      querySearch, getAll,
      getCaseQuantity,
      getCaseWorkload,
      getTrend,
      getWeight,
      getEvaluationList,
      getEvaluationDimension,
      getEffectCard,
      saveTargetList,
      getTargetSelected,
      getEffectDetail,
      beforeClose() {
        this.targetSystem = false
        if (this.id) {
          // this.getRegulationMenus()
          this.$refs.target.getTargetList()
        }
      },
      cancelTargetSystem() {
        this.targetSystem = false
        if (this.id) {
          // this.getRegulationMenus()
          this.$refs.target.getTargetList()
        }
      },
      // refreshMenus(list) {
      //   this.targetSystem = false
      //   // 获取到指标体系数据，需清空indexDat的校验
      //   // this.$refs['regulationForm'].clearValidate(['indexDat'])
      //   // this.indexData = [...list]
      // },

      // 获取数据
      getEffectData() {
        // debugger
        // 获取分页的id集合
        const indexIds = this.effectDataSelected.filter((v, i) => (
          i >= (this.effectPage - 1) * 3 && i < this.effectPage * 3
        ))
        this.indexIds = indexIds.map(v => (v.id))
        this.getEffectCard()
      },
      currentChange(val) {
        this.effectPage = val
        this.effectData = []
        this.$nextTick(() => {
          this.getEffectData()
        })
      },
      // 获取默认时间范围
      getTimeDefault() {
        // 当时日期是否大月等于3月1日
        const nowTime = new Date()
        const nowMonth = nowTime.getMonth() + 1
        const nowYear = nowTime.getFullYear()
        const nowDate = nowTime.getDate()
        if (nowMonth < 3) {
          this.timePick = [`${nowYear - 1}-01-01`, `${nowYear - 1}-12-31`]
        } else {
          this.timePick = [`${nowYear}-01-01`, `${nowYear}-${nowMonth >= 10 ? nowMonth : '0' + nowMonth}-${nowDate}`]
        }
      },
      // 时间范围改变时
      timeChange() {
        this.getCaseQuantity()
        this.getCaseWorkload()
        this.getTrend()
        this.getEffectData()
      },
      // 权重系统改变
      coefficientChange() {
        this.getCaseWorkload()
        this.getTrend()
      },

      // 查看趋势详情
      showEffectDetail(id, name) {
        this.effectDetailDialog = true
        this.getEffectDetail(id, name)
      }
    },
    watch: {
    }
  }
</script>

<style lang="scss">
  @import 'src/styles/variables.scss';
.portrait {
  padding-top: 0;
  .height-title{
    height: 48px;
    line-height: 48px;
  }
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
    // position: absolute;
    // right: 24px;
    // top: -62px;
    // z-index: 100;
    display: flex;
    padding: 12px 24px 24px 24px;
    justify-content: space-between;
    background-color: #fff;
    .search-time{
      display: flex;
      align-items: center;
      color: #2e394b;
    }
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
  .static-title{
    color: #2e394b;
    margin-top: 24px;
    font-size: 14;
    font-weight: 700;
  }
  .cases{
    padding: 0 20px;
    margin:  20px 0;
    &.need-line:first-child{
      border-right: 1px solid #E2E6EC;
    }
    .cases-title{
      font-size: 14px;
      color: #2e394b;
      font-weight: 700;
      position: relative;
      .coefficient{
        position: absolute;
        width: 200px;
        right: 0;
        top: 0;
        /deep/ .el-select-dropdown__item{
          width: 200px;
        }
      }
    }
    .cases-static{
      margin-top: 30px;
      padding-left: 12px;
      border-left: 4px solid #2e69e7;
      .cases-static-title{
        color: #5d6573;
      }
      .cases-static-content{
        margin-top: 10px;
        display: flex;
        align-items: center;
        .cases-static-unit{
          margin-right: 5px;
          font-size: 24px;
          color: #2e394b;
        }
        .cases-static-unit-word{
          margin-top: 10px;
        }
        .cases-static-compare{
          margin-left: 10px;
          margin-top: 5px;
          font-size: 12px;
          color: #A2A6AF;
          .cases-static-compare-num{
            margin-left: 5px;
            color: #FF5858;
          }
        }
        .cases-static-ranking{
          .cases-static-ranking-num{
            font-size: 24px;
          }
        }
      }
    }
    .cases-echart{
      margin-top: 20px;
    }
  }
  .trend-echart{
    margin-top: 20px;
    padding: 20px;
  }
  .choose-btn{
    position: absolute;
    top: 8px;
    right: 8px;
    border: 1px solid #2266ee;
    color: #2266ee;
  }
  .effect-wrapper{
    height: 275px;
    .effect-echart{
      .cases-echart{
        padding: 18px;
        border: 1px solid #e2e6ec;
        border-radius: 4px;
        box-shadow: 0px 2px 4px 0px rgba(10, 47, 112, 0.1);      
      }
      .effect-echart-col{
        position: relative;
        .effect-detail{
          position: absolute;
          z-index: 100;
          right: 28px;
          top: 18px;
          color: #2266ee;
          cursor: pointer;
        }
      }
    }
  }
  
  .table-width{
    margin-top: 20px;
  }
  .radar-echart {
    margin-top: 50px;
  }
  .btn-group{
    position: absolute;
    top: 8px;
    right: 10px;
    /deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner{
      background-color: #2266EE;
      color: #fff;
    }
  }
}
</style>
