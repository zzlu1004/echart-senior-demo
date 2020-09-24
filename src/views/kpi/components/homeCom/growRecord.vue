<template>
  <div class="bg-white">
    <div class="bd-dashed-bottom title-panel pl3">
      <span class="h16 color-title bold">成长档案</span>
      <span class="sub-panel">（{{new Date(this.fd.tools.getNowTime())|parseTime("{y}年")}}累计）</span>
    </div>
    <div class="p3" style="height:208px;">
      <el-row :gutter="24">
        <el-col class="center" :span="8">
          <div class="pointer" @click="goPage('workReward')">
            <svg-icon class="h92" icon-class="reward" />
            <div class="color-title mb1 mt2 bold">表彰奖励</div>
            <div class="h18 color-title bold">{{growObj.reward || '--'}}次</div>
          </div>
        </el-col>
        <el-col class="center" :span="8">
          <div class="pointer" @click="goPage('studyDevelop')">
            <div class="icon-div">
              <i class="h88 fd-icon icon-tiaoxunpeixun" style="color:#13c2c2;"/>
            </div>
            <div class="color-title my1 bold">调训培训</div>
            <div class="h18 color-title bold">{{growObj.training || '--'}}次</div>
          </div>
        </el-col>
        <el-col class="center" :span="8">
          <div class="pointer" @click="goPage('studyDevelop')">
            <div class="icon-div">
              <i class="h88 fd-icon icon-ganbujianzhi" style="color:#29b6f6"/>
            </div>
            <div class="color-title my1 bold">干部兼职</div>
            <div class="h18 color-title bold">{{growObj.partTimeJob || '--'}}次</div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import { goPage, getGrowRecord } from '@/api/kpi/homeNew'
  export default {
    name: 'growRecord',
    components: {},
    props: {},
    data() {
      return {
        growObj: {}
      }
    },
    computed: {
    },
    mounted() {
      this.getGrowRecord()
    },
    methods: {
      goPage, getGrowRecord
    },
    watch: {
    }
  }
</script>

<style lang="scss">
.h92{
  font-size: 92px;
}
.h88{
  font-size: 88px;
}
.icon-div{
  margin-top: -3px;
}
</style>
