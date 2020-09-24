<template>
  <div>
    <div class="px3 case-menus-tab bg-white">
      <el-menu :default-active="page"
               class="el-menu-demo"
               mode="horizontal"
               @select="handleSelect"
               text-color="#666"
               active-text-color="#1b95e7">
        <el-submenu v-if="elements.total" index="total">
          <template slot="title">{{totalMenu}}</template>
          <el-menu-item v-if="elements.writing" index="writing">办文汇总</el-menu-item>
          <el-menu-item v-if="elements.ruleSystem" index="ruleSystem">规章制度</el-menu-item>
          <el-menu-item v-if="elements.specialWork" index="specialWork">专项工作</el-menu-item>
          <el-menu-item v-if="elements.workSummary" index="workSummary">工作总结</el-menu-item>
          <el-menu-item v-if="elements.researchReport" index="researchReport">调研报告</el-menu-item>
          <el-menu-item v-if="elements.runMeeting" index="runMeeting">会议材料</el-menu-item>
          <el-menu-item v-if="elements.typeOther" index="typeOther">其他</el-menu-item>
        </el-submenu>
        <el-submenu v-if="elements.work" index="work">
          <template slot="title">{{handleMenu}}</template>
          <el-menu-item index="judge" v-if="elements.judge">员额法官</el-menu-item>
          <el-menu-item index="assistant" v-if="elements.assistant">法官助理</el-menu-item>
          <el-menu-item index="clerk" v-if="elements.clerk">书记员</el-menu-item>
        </el-submenu>
        <el-menu-item v-if="elements.other" index="other">其他</el-menu-item>
      </el-menu>
    </div>
    <div :class="isComponent?'':'app-container'">
      <div
        class="bg-white work-result"
        :class="isComponent?'pt2':'container-inner'"
        :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
        <div>
        </div>
        <result-writing
          v-show="elements.writing && page === 'writing'"
          parentMenu='total'
          page='writing'
          :elements="elements"
          :active="page === 'writing'"
          :userId="userId"
          :userName="userName"
        >
        </result-writing>
        <resultRuleSystem
          v-show="elements.ruleSystem && page === 'ruleSystem'"
          parentMenu='total'
          page='ruleSystem'
          :elements="elements"
          :active="page"
          :userId="userId"
          :userName="userName">
        </resultRuleSystem>
        <resultRuleSystem
          v-show="elements.specialWork && page === 'specialWork'"
          parentMenu='total'
          page='specialWork'
          :active="page"
          :elements="elements"
          :userId="userId"
          :userName="userName">
        </resultRuleSystem>
        <resultRuleSystem
          v-show="elements.workSummary && page === 'workSummary'"
          parentMenu='total'
          page='workSummary'
          :active="page"
          :elements="elements"
          :userId="userId"
          :userName="userName">
        </resultRuleSystem>
        <resultRuleSystem
          v-show="elements.researchReport && page === 'researchReport'"
          parentMenu='total'
          page='researchReport'
          :active="page"
          :elements="elements"
          :userId="userId"
          :userName="userName">
        </resultRuleSystem>
        <resultRuleSystem
          v-show="elements.runMeeting && page === 'runMeeting'"
          parentMenu='total'
          page='runMeeting'
          :active="page"
          :elements="elements"
          :userId="userId"
          :userName="userName">
        </resultRuleSystem>
        <resultRuleSystem
          v-show="elements.typeOther && page === 'typeOther'"
          parentMenu='total'
          page='typeOther'
          :active="page"
          :elements="elements"
          :userId="userId"
          :userName="userName">
        </resultRuleSystem>
        <result-judge
          v-show="elements.judge && page === 'judge'"
          parentMenu='work'
          page='judge'
          :active="page === 'judge'"
          :elements="elements"
          :userId="userId"
          :userName="userName"
        >
        </result-judge>
        <result-assistant
          v-show="elements.assistant && page === 'assistant'"
          parentMenu='work'
          page='assistant'
          :active="page === 'assistant'"
          :elements="elements"
          :userId="userId"
          :userName="userName"
        >
        </result-assistant>
        <result-assistant
          v-show="elements.clerk && page === 'clerk'"
          parentMenu='work'
          page='clerk'
          :active="page === 'clerk'"
          :elements="elements"
          :userId="userId"
          :userName="userName"
        >
        </result-assistant>
        <div v-show="elements.other && page === 'other'">
          <other
            parentMenu='other'
            page='other'
            :active="page === 'other'"
            :elements="elements"
            :userId="userId"
            :userName="userName"
          >
          </other>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import resultWriting from '../components/workResult/resultWriting.vue'
  import resultRuleSystem from '../components/workResult/resultRuleSystem.vue'
  import resultJudge from '../components/workResult/resultJudge.vue'
  import resultAssistant from '../components/workResult/resultAssistant.vue'
  import other from '../components/workResult/other.vue'
  import { handleSelect } from '@/api/kpi/newRecord/workResult'
  export default {
    name: 'workResult',
    components: {
      resultWriting, resultJudge, other, resultRuleSystem, resultAssistant
    },
    props: {
      isComponent: {
        type: Boolean,
        default: false
      },
      userId: {
        type: String,
        default: ''
      },
      userName: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        page: 'writing',
        totalMenu: '综合工作（ 办文汇总 ）',
        handleMenu: '办案工作（ 员额法官 ）',
        pageMap: {
          'total': '综合工作',
          'work': '办案工作',
          'writing': '办文汇总',
          'ruleSystem': '规章制度',
          'specialWork': '专项工作',
          'workSummary': '工作总结',
          'researchReport': '调研报告',
          'runMeeting': '会议材料',
          'typeOther': '其他',
          'judge': '员额法官',
          'assistant': '法官助理',
          'clerk': '书记员',
          'other': '其他'
        }
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.workResult || {}
      }
    },
    mounted() {
      // 如果没有给这个用户配置
      if (this.elements.total && this.elements.writing) {
        this.page = 'writing'
      } else if (this.elements.total && this.elements.ruleSystem) {
        this.page = 'ruleSystem'
      } else if (this.elements.total && this.elements.specialWork) {
        this.page = 'specialWork'
      } else if (this.elements.total && this.elements.workSummary) {
        this.page = 'workSummary'
      } else if (this.elements.total && this.elements.researchReport) {
        this.page = 'researchReport'
      } else if (this.elements.total && this.elements.runMeeting) {
        this.page = 'runMeeting'
      } else if (this.elements.total && this.elements.typeOther) {
        this.page = 'typeOther'
      } else if (this.elements.work && this.elements.judge) {
        this.page = 'judge'
      } else if (this.elements.work && this.elements.assistant) {
        this.page = 'assistant'
      } else if (this.elements.work && this.elements.clerk) {
        this.page = 'clerk'
      } else if (this.elements.other) {
        this.page = 'other'
      }
      if (this.elements.total && this.elements.writing) {
        this.totalMenu = '综合工作（ 办文汇总 ）'
      } else if (this.elements.total && this.elements.ruleSystem) {
        this.totalMenu = '综合工作（ 规章制度 ）'
      } else if (this.elements.total && this.elements.specialWork) {
        this.totalMenu = '综合工作（ 专项工作 ）'
      } else if (this.elements.total && this.elements.workSummary) {
        this.totalMenu = '综合工作（ 工作总结 ）'
      } else if (this.elements.total && this.elements.researchReport) {
        this.totalMenu = '综合工作（ 调研报告 ）'
      } else if (this.elements.total && this.elements.runMeeting) {
        this.totalMenu = '综合工作（ 会议材料 ）'
      } else if (this.elements.total && this.elements.typeOther) {
        this.totalMenu = '综合工作（ 其他 ）'
      }
      if (this.elements.work && this.elements.judge) {
        this.handleMenu = '办案工作（ 员额法官 ）'
      } else if (this.elements.work && this.elements.assistant) {
        this.handleMenu = '办案工作（ 法官助理 ）'
      } else if (this.elements.work && this.elements.clerk) {
        this.handleMenu = '办案工作（ 书记员 ）'
      }
    },
    methods: {
      handleSelect
    },
    watch: {
      page() {

      }
    }
  }
</script>

<style lang="scss">
.page-inner{
  padding: 24px 0;
}
</style>
