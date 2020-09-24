<template>
  <div>
    <div class="px3 case-menus-tab bg-white">
      <div v-if="elements.allOrg || elements.postJudge ||
        elements.JudgeAssistant || elements.clerks" class="relative menu-panel">
        <el-menu
                 :default-active="page"
                 class="absolute"
                 mode="horizontal"
                 text-color="#666"
                 active-text-color="#1b95e7">
          <el-menu-item v-if="elements.allOrg" index="allOrg" @click="onLink('allOrg')" >全院</el-menu-item>
          <el-menu-item v-if="elements.postJudge" index="postJudge" @click="onLink('postJudge')">员额法官</el-menu-item>
          <el-menu-item v-if="elements.JudgeAssistant" index="JudgeAssistant" @click="onLink('JudgeAssistant')" >法官助理</el-menu-item>
          <el-menu-item v-if="elements.clerks" index="clerks" @click="onLink('clerks')">书记员</el-menu-item>
        </el-menu>
        <div class="time-panel f-right">
          <span v-if="$store.getters.globals.isIE">
            <el-date-picker
              type="month"
              value-format="yyyy-MM"
              size="small"
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
              value-format="yyyy-MM"
              placeholder="选择日期"
              size="small"
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
          <el-button class="ml3" type="primary" size="small" @click="refreshAll">查询</el-button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <div class="bg-gray" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
        <div class="case-overview">

          <!--全院 start-->
          <div v-if="activePanel === 'allOrg' && elements.allOrg">
            <el-row>
              <el-col  :span="9" class="pr2">
                <div class="f-left bg-white layout-top">
                  <case-handle :pParams="params" :isRefresh="isRefresh"></case-handle>
                </div>
              </el-col>
              <el-col  :span="15" >
                <div class="f-left bg-white layout-top">
                  <case-type :pParams="params" :isRefresh="isRefresh"></case-type>
                </div>
              </el-col>
            </el-row>
            <div class="clear"></div>
            <div class="bg-white layout-bottom mt2">
              <team-analysis :pParams="params" :isRefresh="isRefresh"></team-analysis>
            </div>
          </div>
          <!--全院 end-->

          <!--员额法官 start-->
          <div v-else-if="activePanel === 'postJudge' && elements.postJudge">
            <el-row>
              <el-col  :span="13" class="pr2">
                <div class="f-left layout-top bg-white">
                  <case-summary type="yefg" :pParams="params" :titleData="['办案情况汇总']" :isRefresh="isRefresh"></case-summary>
                </div>
              </el-col>
              <el-col  :span="11" >
                <div class="f-left layout-top bg-white" >
                  <case-compared type="yefg" :pParams="params" :isRefresh="isRefresh"></case-compared>
                </div>
              </el-col>
            </el-row>
            <div class="clear"></div>
            <div class="layout-bottom bg-white mt2" >
              <case-details type="yefg" :titleData="['员额法官办案详情']" :pParams="params" :isRefresh="isRefresh"></case-details>
            </div>

          </div>
          <!--员额法官 end-->

          <!--法官助理 start-->
          <div v-else-if="activePanel === 'JudgeAssistant' && elements.JudgeAssistant">
            <el-row>
              <el-col  :span="13" class="pr2">
                <div class="f-left layout-top bg-white" >
                  <case-summary type="fgzl" :pParams="params" :isRefresh="isRefresh"  :titleData="['辅助办案情况汇总']" ></case-summary>
                </div>
              </el-col>
              <el-col  :span="11" >
                <div class="f-left layout-top bg-white">
                  <case-compared type="fgzl" :pParams="params" :isRefresh="isRefresh"></case-compared>
                </div>
              </el-col>
            </el-row>
            <div class="clear"></div>
            <div class="layout-bottom bg-white mt2">
              <case-details type="fgzl" :titleData="['法官助理辅助办案详情']" :pParams="params" :isRefresh="isRefresh"></case-details>
            </div>
          </div>
          <!--法官助理 end-->

          <!--书记员 start-->
          <div v-else-if="activePanel === 'clerks' && elements.clerks">
            <el-row>
              <el-col  :span="13" class="pr2">
                <div class="f-left  layout-top bg-white" >
                  <case-summary type="sjy" :pParams="params" :isRefresh="isRefresh" :titleData="['辅助办案情况汇总']" ></case-summary>
                </div>
              </el-col>
              <el-col  :span="11" >
                <div class=" f-left layout-top bg-white">
                  <case-compared type="sjy" :pParams="params" :isRefresh="isRefresh"></case-compared>
                </div>
              </el-col>
            </el-row>
            <div class="clear"></div>
            <div class="layout-bottom bg-white mt2" >
              <case-details type="sjy" :titleData="['书记员辅助办案详情']" :pParams="params" :isRefresh="isRefresh"></case-details>
            </div>
          </div>
          <!--书记员 end-->
        </div>
      </div>
    </div>
  </div>
 </template>

<script>
  import caseType from './caseOverview/case-type'
  import caseHandle from './caseOverview/case-handle'
  import teamAnalysis from './caseOverview/team-analysis'
  import caseSummary from './caseOverview/caseSummary'
  import caseCompared from './caseOverview/caseCompared'
  import caseDetails from './caseOverview/caseDetails'
  import FdTag from '../components/tag'
  import FdPanel from 'fd/panel/panel'
  import FdEchart from 'fd/echarts/src/echarts-tool'
  import { choosePage, toStartDate, toLocaleDate, refreshAll } from '@/api/kpi/leaderWork/caseGeneral'
  export default {
    name: 'caseGeneral',
    mixins: [],
    components: { FdEchart, FdPanel, FdTag, caseType, teamAnalysis, caseHandle, caseSummary, caseCompared, caseDetails },
    data() {
      return {
        page: 'allOrg',
        params: {
          startTime: this.toStartDate(new Date(this.fd.tools.getNowTime())),
          endTime: this.toLocaleDate(new Date(this.fd.tools.getNowTime()))
        },
        activePanel: 'allOrg',
        type: '',
        isRefresh: false // 用来记录是否点击了查询按钮
      }
    },
    hooks() {
    },
    watch: {
    },
    mounted() {
      if (this.elements.allOrg) {
        this.activePanel = 'allOrg'
      } else if (this.elements.postJudge) {
        this.activePanel = 'postJudge'
      } else if (this.elements.JudgeAssistant) {
        this.activePanel = 'JudgeAssistant'
      } else if (this.elements.clerks) {
        this.activePanel = 'clerks'
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.caseOverview || {}
      }
    },
    methods: {
      refreshAll, toStartDate, toLocaleDate, choosePage,
      onLink(name) {
        this.activePanel = name
      }
    }
  }
</script>

<style lang="scss" scoped>
  .layout-top{
    width: 100%;
    height: 456px;
    overflow: hidden;
  }
  .layout-bottom{
    width: 100%;
    height: 540px;
    overflow: hidden;
  }
  .clear {
    clear: both;
  }

</style>
