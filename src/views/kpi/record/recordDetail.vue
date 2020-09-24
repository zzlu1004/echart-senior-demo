<template>
  <div class="app-container">
    <div class="bg-white record-detail">
      <div class="bd-dashed-bottom container-inner">
        <div class="clearfix">
          <span class="card-span-6 f-left px2'"
            v-for="item of menuData"
            v-if="elements[item.id]"
            :key="item.id">
            <div
              class="center p2 pointer card-box"
              :class="'bg-'+item.id+(item.active?' active': '')"
              @click="tabCheck(item)"
            >
              <div>
                <span v-if="item.id === 'info'">
                  <svg-icon v-if="item.active" class="h36" icon-class="my-record-hover" />
                  <svg-icon v-else class="h36" icon-class="my-record" />
                </span>
                <span v-else-if="item.id === 'portrait'">
                  <svg-icon v-if="item.active" class="h36" icon-class="portrait-hover" />
                  <svg-icon v-else class="h36" icon-class="portrait" />
                </span>
                <i v-else
                  class="fd-icon"
                  :class="item.icon"
                  style="font-size:36px;"
                />
              </div>
              <div class="mt2">{{item.name}}</div>
            </div>
          </span>
        </div>
      </div>
     <!-- <div v-if="elements.portrait && tab==='portrait'" class="bg-gray" style="padding: 16px 0">
        <portrait
          :isComponent="true"
          :userName="$route.query.name"
          :userId="$route.query.id"
        ></portrait>
      </div>-->
      <div v-if="elements.info && tab==='info'" style="padding: 0 32px 24px 32px;">
        <personal-msg
          :isComponent="true"
          :userName="$route.query.name"
          :userId="$route.query.id"
        ></personal-msg>
      </div>
      <div v-if="elements.quality && tab==='quality'" style="padding: 0 32px 24px 32px;">
        <work-qE
          :isComponent="true"
          :userName="$route.query.name"
          :userId="$route.query.id"
        ></work-qE>
      </div>
      <div v-if="elements.score && tab==='score'" style="padding: 0 32px 24px 32px;">
        <work-result
          :isComponent="true"
          :userId="$route.query.id"
          :userName="$route.query.name"
        ></work-result>
      </div>
      <div v-if="elements.study && tab==='study'" style="padding: 0 32px 24px 32px;">
        <study-develop
          :isComponent="true"
          :userId="$route.query.id"
          :userName="$route.query.name"
        ></study-develop>
      </div>
      <div v-if="elements.check && tab==='check'" style="padding: 0 32px 24px 32px;">
        <div :style="{'min-height': $store.getters.globals.height - 415 + 'px'}">
          <FdNoContent></FdNoContent>
        </div>
      </div>
      <div v-if="elements.rewardPunish && tab==='rewardPunish'" style="padding: 0 32px 24px 32px;">
        <work-reward
          :isComponent="true"
          :userId="$route.query.id"
          :userName="$route.query.name"
        ></work-reward>
      </div>
      <div class="fixed-bottom">
        <div class="fixed-bottom-item" @click="goBack">
          <div class="fixed-bottom-item-text">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import workResult from '../newRecord/workResult.vue'
  import portrait from './portraits.vue'
  import workQE from '../newRecord/workQE.vue'
  import FdNoContent from 'fd/noContent'
  import studyDevelop from '../newRecord/studyDevelop.vue'
  import workReward from '../newRecord/workReward.vue'
  import personalMsg from '../center/personalMsg.vue'
  import { goBack } from '@/api/common'
  import { tabCheck, getMenus, getUserInfo } from '@/api/kpi/record/recordDetail'
  export default {
    name: 'recordDetail',
    components: {
      workResult, personalMsg, studyDevelop, workReward, workQE, FdNoContent,
      portrait
    },
    props: {},
    data() {
      return {
        tab: 'info',
        menuData: [],
        userId: '',
        userName: '',
        isJudge: false,
        menu1: []
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.recordDetail || {}
      }
    },
    mounted() {
      this.userId = this.$route.query.id || ''
      this.userName = this.$route.query.name || ''
      this.getUserInfo()
    },
    methods: {
      goBack, tabCheck, getMenus, getUserInfo
    },
    watch: {
      tab() {
        // this.getMenus()
      }
    }
  }
</script>

<style lang="scss">
.record-detail{
  .card-span-6{
    width:16.5%;
    padding: 0 16px;
  }
  .card-span-7{
    width:14.2%;
  }
  .card-box{
    border-radius: 2px;
    color:#fff;
    height:115px;
    border: 1px solid transparent;
  }
  .bg-portrait{
    background-color: #5F73F1;
    box-shadow: 0px 1px 3px 1px #5F73F1;
  }
  .bg-portrait.active{
    background-color:transparent;
    color:#5F73F1;
    border-color:#5F73F1;
  }
  .bg-info{
    background-color: #F6D269;
    box-shadow: 0px 1px 3px 1px #F6D269;
  }
  .bg-info.active{
    background-color:transparent;
    color:#F6D269;
    border-color:#F6D269;
  }
  .bg-score{
    background-color: #5AB4F1;
    box-shadow: 0px 1px 3px 1px #5AB4F1;
  }
  .bg-score.active{
    background-color:transparent;
    color:#5AB4F1;
    border-color:#5AB4F1;
  }
  .bg-quality{
    background-color: #4FCEE7;
    box-shadow: 0px 1px 3px 1px #4FCEE7;
  }
  .bg-quality.active{
    background-color:transparent;
    color:#4FCEE7;
    border-color:#4FCEE7;
  }
  .bg-check{
    background-color: #99A1E3;
    box-shadow: 0px 1px 3px 1px #99A1E3;
  }
  .bg-check.active{
    background-color:transparent;
    color:#99A1E3;
    border-color:#99A1E3;
  }
  .bg-study{
    background-color: #A085DA;
    box-shadow: 0px 1px 3px 1px #A085DA;
  }
  .bg-study.active{
    background-color:transparent;
    color:#A085DA;
    border-color:#A085DA;
  }
  .bg-rewardPunish{
    background-color: #F99395;
    box-shadow: 0px 1px 3px 1px #F99395;
  }
  .bg-rewardPunish.active{
    background-color:transparent;
    color:#F99395;
    border-color:#F99395;
  }
}
</style>
