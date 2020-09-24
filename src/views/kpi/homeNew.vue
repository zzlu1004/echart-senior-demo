<template>
  <div class="app-container">
    <div :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <!-- 顶部的个人信息 -->
      <div class="bg-white px3 pt3">
        <el-row :gutter="16">
          <el-col class="person-panel clearfix" :span="13">
            <div class="relative">
              <div class="userPhoto absolute"><img :src="photo"/></div>
              <div class="person-info">
                <div class="home-hour-des bold mb2">
                  <span class="mr2">{{userName}}</span>
                  <span>{{hours}}好!</span>
                </div>
                <div v-if="userInfo.departName || userInfo.typeId || userInfo.grade || userInfo.degree" class="home-time">
                  <span v-if="userInfo.departName">{{userInfo.departName}}</span>
                  <span v-if="userInfo.typeId"> | {{typeMap[userInfo.typeId]}}</span>
                  <span v-if="userInfo.grade"> | {{userInfo.grade}}</span>
                  <span v-if="userInfo.degree"> | {{userInfo.degree}}</span>
                </div>
                <div class="home-time mt1">{{new Date(this.fd.tools.getNowTime())|parseTime("星期{a} {y}年{m}月{d}日")}}</div>
                <div class="home-time mt1">案件数据已同步至{{caseTime}}</div>
              </div>
            </div>
          </el-col>
          <el-col :span="10">
            <el-row :gutter="56">
              <el-col v-if="elements.notice" :span="5">
                <div class="pointer mb3" @click="goPage('notice')">
                  <div class="relative rectangle" :style="{'background-color': colorArr[0]}">
                    <div v-if="todoNotice" class="rectangle-11">{{todoNotice}}</div>
                    <i class="fd-icon icon-tongzhigonggao"/>
                  </div>
                  <div class="text-style">通知公告</div>
                </div>
              </el-col>
              <el-col v-if="elements.onlineCheck" :span="5">
                <div class="pointer mb3" @click="goPage('myCheck')">
                  <div class="relative rectangle" :style="{'background-color': colorArr[1]}">
                    <i class="fd-icon icon-shouyezaixiankaohe"/>
                    <div  v-if="todoOnline" class="rectangle-11">{{todoOnline}}</div>
                  </div>
                  <div class="text-style">在线考核</div>
                </div>
              </el-col>
              <el-col v-if="elements.record" :span="5">
                <div class="pointer mb3" @click="goPage('personalMsg')">
                  <div class="relative rectangle" :style="{'background-color': colorArr[2]}">
                    <svg-icon class="h30" icon-class="my-record" />
                  </div>
                  <div class="text-style">我的档案</div>
                </div>
              </el-col>
              <el-col v-if="elements.workResult" :span="5">
                <div class="pointer mb3" @click="goPage('workResult')">
                  <div class="relative rectangle" :style="{'background-color': colorArr[3]}">
                    <i class="fd-icon icon-gongzuoyeji"/>
                  </div>
                  <div class="text-style">工作业绩</div>
                </div>
              </el-col>
              <el-col v-if="elements.study"  :span="5">
                <div class="pointer mb3" @click="goPage('studyDevelop')">
                  <div class="relative rectangle" :style="{'background-color': colorArr[4]}">
                    <i class="fd-icon icon-xuexi"/>
                  </div>
                  <div class="text-style">学习拓展</div>
                </div>
              </el-col>
              <el-col v-if="elements.quality" :span="5">
                <div class="pointer mb3" @click="goPage('workQE')">
                  <div class="relative rectangle" :style="{'background-color': colorArr[5]}">
                    <i class="fd-icon icon-ccgl-zhiliangshigu-6"/>
                  </div>
                  <div class="text-style">工作质效</div>
                </div>
              </el-col>
              <el-col v-if="elements.reward" :span="5">
                <div class="pointer mb3" @click="goPage('workReward')">
                  <div class="relative rectangle" :style="{'background-color': colorArr[6]}">
                    <i class="fd-icon icon-zhiliangrenzheng"/>
                  </div>
                  <div class="text-style">工作奖惩</div>
                </div>
              </el-col>
              <!-- 在少于七个模块的时候显示。。。 -->
              <el-col v-if="!(elements.notice && elements.onlineCheck && elements.record && elements.workResult
                && elements.study && elements.quality && elements.reward)" :span="5">
                <div class="mb3">
                  <div class="rectangle" style="background-color:#d9d9d9;">
                    <i class="fd-icon icon-gengduo" style="font-size:28px;"/>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="1"></el-col>
        </el-row>
      </div>
      <div class="mt2">
        <el-row :gutter="16">
      <!-- 成长档案 -->
          <el-col v-if="elements.growRecord" :span="10">
            <grow-record></grow-record>
          </el-col>
      <!-- 考核流程 -->
          <el-col v-else :span="10">
            <check-process-home></check-process-home>
          </el-col>
      <!-- 通知公告 -->
          <el-col :span="14">
            <notice-home></notice-home>
          </el-col>
        </el-row>
      </div>
      <!-- 方案信息 -->
      <div v-if="elements.projectInfo && hasActiveProject" class="mt2">
        <el-row>
          <el-col :span="24">
            <project-info v-on:refreshProjectLevel="refreshProjectLevel"></project-info>
          </el-col>
        </el-row>
      </div>
      <div v-if="elements.judge || elements.assistant || elements.clerk || elements.other" class="mt2" >
        <el-row :gutter="16">
      <!-- 业绩趋势 -->
          <el-col :span="10">
            <trend :elements="elements"></trend>
          </el-col>
      <!-- 工作概览 -->
          <el-col :span="14">
            <work-list :elements="elements"></work-list>
          </el-col>
        </el-row>
      </div>
      <!-- 方案信息 -->
      <div v-if="elements.projectInfo && !hasActiveProject" class="mt2">
        <el-row>
          <el-col :span="24">
            <project-info v-on:refreshProjectLevel="refreshProjectLevel"></project-info>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import head from '@/assets/userPhoto.svg'
  import checkProcessHome from './components/homeCom/checkProcessHome.vue'
  import growRecord from './components/homeCom/growRecord.vue'
  import noticeHome from './components/homeCom/noticeHome.vue'
  import trend from './components/homeCom/trend.vue'
  import workList from './components/homeCom/workList.vue'
  import projectInfo from './components/homeCom/projectInfo.vue'
  import { goPage, getBasicInfo, getTotalMsg, getUnreadNotice, refreshProjectLevel, getCaseTime } from '@/api/kpi/homeNew'
  export default {
    name: '',
    components: {
      checkProcessHome, growRecord, noticeHome, projectInfo, workList, trend
    },
    props: {},
    data() {
      return {
        photo: this.$store.getters.user.userPhoto || head,
        hours: this.fd.tools.changeTimeAmOrPm(),
        userName: this.$store.getters.user.userName,
        userId: this.$store.getters.user.id,
        userInfo: {},
        typeMap: this.fd.tools.mapSelects('k10003'),
        colorArr: ['#13c2c2', '#8543E0', '#FFA000', '#29B6F6', '#2FC25B', '#3949AB', '#F04864'],
        todoOnline: 0,
        todoNotice: 0,
        hasActiveProject: false,
        caseTime: ''
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.home || {}
      }
    },
    mounted() {
      this.getBasicInfo()
      // 获取在线考核的数量
      this.getTotalMsg()
      // 获取通知公告未读数量
      this.getUnreadNotice()
      this.getCaseTime()
    },
    methods: {
      goPage, getBasicInfo, getTotalMsg, getUnreadNotice, refreshProjectLevel, getCaseTime
    },
    watch: {
    }
  }
</script>

<style lang="scss">
  .person-panel{
    margin-top: 15px;
  }
  .userPhoto{
    width: 100px;
    height: 140px;
    overflow: hidden;
    top: 0;
    left: 0;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .home-hour-des{
    font-size: 26px;
    color: #3da5eb;
  }
  .home-time {
    min-height: 25px;
    font-size: 18px;
    letter-spacing: 3px;
    color: #999;
  }
  .rectangle {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    text-align: center;
    padding-top: 8px;
    color: #fff;
    margin: 0 auto;
    .fd-icon{
      font-size: 30px;
    }
  }
  .rectangle-11 {
    display: inline-block;
    position: absolute;
    right: -3px;
    top: -7px;
    min-width: 20px;
    padding: 0 3px;
    text-align: center;
    line-height: 20px;
    border-radius: 100px;
    color:#fff;
    background-color: #ff7472;
    z-index: 222;
  }
  .text-style {
    line-height: 24px;
    letter-spacing: 2px;
    text-align: center;
  }
  .h30{
    font-size: 30px;
  }
  .color-down {
    color: #f04864;
  }
  .color-up {
    color: #2fc25b;
  }
  .title-panel{
    height: 48px;
    line-height: 48px;
  }
  .sub-panel{
    color: #999;
  }
  .person-info{
    vertical-align: bottom;
    padding-left:124px;
    min-height: 120px;
    margin-bottom: 24px;
  }
</style>
