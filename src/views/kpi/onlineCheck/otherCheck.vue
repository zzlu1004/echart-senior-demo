<template>
<div class="app-container">
  <div class="filters">
    <el-radio-group v-model="statusId" size="mini" @change="handleChange">
      <el-radio-button label="1">已生效</el-radio-button>
      <el-radio-button label="2">已结束</el-radio-button>
    </el-radio-group>
  </div>
    <div class="bg-white container-inner clearfix h14 target" :style="{'min-height': height }">
      <div class="tab-box">
        <el-tabs v-model="params.type" type="card">
          <el-tab-pane :label="'已填报（'+reportCnt+'）'" name="to_fill"></el-tab-pane>
          <el-tab-pane :label="'已审核（'+checkCnt+'）'" name="to_approve"></el-tab-pane>
          <el-tab-pane :label="'民主测评（'+democraticCnt+'）'" name="to_mz"></el-tab-pane>
          <div v-show="params.type ==='to_fill'">
            <reporting ref="reporting" checkType='to_fill' :active="params.type" :parentParams="params.fillTab" :statusId="statusId"></reporting>
          </div>
          <div v-show="params.type ==='to_approve'">
            <checking ref="checking" checkType='to_approve' :active="params.type" :parentParams="params.approveTab" :statusId="statusId"></checking>
          </div>
          <div v-show="params.type ==='to_mz'">
            <mzChecking ref="mzChecking" checkType='to_mz' :active="params.type" :parentParams="params.fillTab" :statusId="statusId"></mzChecking>
          </div>
        </el-tabs>
      </div>
    </div>
</div>
</template>

<script>
    import { getOtherCnt } from '@/api/kpi/onlineCheck/reporting'
    import reporting from '../components/reporting'
    import checking from '../components/onlineCheckCom/checking'
    import mzChecking from '../components/onlineCheckCom/mzChecking'
    export default {
      name: 'otherCheck',
      components: {
        reporting, checking, mzChecking
      },
      methods: {
        getOtherCnt,
        handleChange() {
          this.getOtherCnt()
          this.$refs.reporting.params = {
            offset: 0,
            limit: 10
          }
          this.$refs.checking.params = {
            offset: 0,
            limit: 10
          }
          this.$refs.reporting.getxzList(this.statusId)
          this.$refs.reporting.getOtherList(this.statusId)
          this.$refs.checking.getxzList(this.statusId)
          this.$refs.checking.getOtherList(this.statusId)
          this.$refs.mzChecking.getxzList(this.statusId)
        }
      },
      data() {
        return {
          height: (this.$store.getters.globals.height - 100) + 'px',
          reportCnt: 0,
          checkCnt: 0,
          democraticCnt: 0,
          params: {
            type: 'to_fill',
            keyword: ''
          },
          getCnt: false,
          statusId: '1'
        }
      },
      mounted() {
      },
      activated() {
        this.getOtherCnt()
      },
      watch: {
      }
    }
</script>

<style lang="scss">
  .target {
    .color-d9d9d9{
      color:#d9d9d9;
    }
    .pr-60px{
        padding-right:60px;
    }
  }
  .app-container{
    position: relative;
    .filters{
      position: absolute;
      top: -40px;
      right: 1rem;
    }
  }
</style>
