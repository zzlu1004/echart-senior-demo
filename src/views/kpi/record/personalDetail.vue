<template>
  <div class="app-container">
    <div class="container-inner has-fixed-bottom bg-white" :style="{'min-height': $store.getters.globals.height - 160 + 'px'}">
      <div class="relative">
        <div class="absolute menu-position">
          <fd-menu :option = menuOpt v-on:menuClick = 'goAnchor' className="personal-msg"></fd-menu>
        </div>
        <div class="bd-dashed-left personal-msg auto" :style="{'height': $store.getters.globals.height - 165 + 'px', 'margin-left': '180px' }">
          <!--基本信息-->
          <div ref="basic" v-if="elements.basic && userInfo.id">
            <fd-personal-basic :userMsg="userInfo" v-bind:hasActive="hasActive"></fd-personal-basic>
          </div>
          <!--简历信息-->
          <div class="mt3" ref="resume" v-if="elements.resume && userInfo.id">
            <fd-personal-resume v-bind:userInfo="userInfo" v-bind:hasActive="hasActive"></fd-personal-resume>
          </div>
          <!--教育信息-->
          <div class="mt3" ref="education" v-if="elements.education && userInfo.id">
            <fd-personal-education v-bind:userInfo="userInfo" v-bind:hasActive="hasActive"></fd-personal-education>
          </div>
          <!--家庭信息-->
          <div class="mt3" ref="family" v-if="elements.family && userInfo.id">
            <fd-personal-family v-bind:userInfo="userInfo" v-bind:hasActive="hasActive"></fd-personal-family>
          </div>
          <!--法律职务-->
          <div class="mt3" ref="lawDuty" v-if="elements.lawDuty && userInfo.id">
            <fd-personal-duty v-bind:userInfo="userInfo" v-bind:hasActive="hasActive"></fd-personal-duty>
          </div>
          <!--部门变更-->
          <div class="mt3" ref="changeDepart" v-if="elements.changeDepart && userInfo.id">
            <fd-personal-depart v-bind:userInfo="userInfo" v-bind:hasActive="hasActive"></fd-personal-depart>
          </div>
          <div class="fixed-bottom">
            <div class="fixed-bottom-item" @click="goBack">
              <div class="fixed-bottom-item-text">返回</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import fdMenu from 'fd/menu/fdMenu'
  import { goBack } from '@/api/common'
  import { getActiveSchemas } from '@/api/kpi/record'
  import { goAnchor, getBasicInfo } from '@/api/kpi/record/personalDetail'
  import FdPersonalBasic from '../components/personal/basic'
  import FdPersonalDuty from '../components/personal/duty'
  import FdPersonalDepart from '../components/personal/depart'
  import FdPersonalResume from '../components/personal/resume'
  import FdPersonalFamily from '../components/personal/family'
  import FdPersonalEducation from '../components/personal/education'
  export default {
    name: '',
    components: {
      FdPersonalEducation, FdPersonalFamily, FdPersonalResume, FdPersonalDepart, FdPersonalDuty, FdPersonalBasic, fdMenu
    },
    props: {},
    data() {
      return {
        userInfo: {},
        hasActive: false,
        menuOpt: {
          menuList: [],
          event: 'goAnchor',
          position: 'left'
        }
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.personalDetail || {}
      },
      userId() {
        return this.$route.query.id || this.$store.getters.user.id
      }
    },
    mounted() {
      if (this.elements.basic) {
        this.menuOpt.menuList.push({
          id: 'basic',
          text: '基本信息'
        })
      }
      if (this.elements.resume) {
        this.menuOpt.menuList.push({
          id: 'resume',
          text: '简历信息'
        })
      }
      if (this.elements.education) {
        this.menuOpt.menuList.push({
          id: 'education',
          text: '学习经历'
        })
      }
      if (this.elements.family) {
        this.menuOpt.menuList.push({
          id: 'family',
          text: '家庭信息'
        })
      }
      if (this.elements.lawDuty) {
        this.menuOpt.menuList.push({
          id: 'lawDuty',
          text: '法律职务'
        })
      }
      if (this.elements.changeDepart) {
        this.menuOpt.menuList.push({
          id: 'changeDepart',
          text: '部门变更'
        })
      }
      this.getBasicInfo()
      this.getActiveSchemas()
    },
    methods: {
      goAnchor,
      goBack,
      getBasicInfo,
      getActiveSchemas
    },
    watch: {}
  }
</script>

<style scoped>
  .img-box{
    width:200px;
    height:240px;
  }
  .line-height-27{
    line-height:27px;
  }
  .mr-5px{
    margin-right:5px;
  }
  .step-bottom{
    border-right:1px dashed #ebebeb;
    height: 60px;
    margin-right: 11px;
  }
  .menuList.active{
    color:#409EFF;
  }
  .pr-8px{
    padding-right:8px;
  }
  .menu-position{
    padding-top:14px;
    padding-left: 40px;
  }
</style>

