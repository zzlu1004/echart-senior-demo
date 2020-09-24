<template>
  <div class="plan-card">
    <el-card shadow="never">
      <div class="color-title h18 bold pointer" @click="seePlanCheckDetail(planData)">{{planData.schemaName}}</div>
      <div class="mt2 relative">
        <el-row>
          <el-col :span="8">
            <div class="f-left pr1">考核周期：</div>
            <div class="hidden text-indent0">{{planData.startTime}}至{{planData.endTime}}</div>
          </el-col>
          <el-col :span="8">
            <div class="f-left pr1">上报截止时间：</div>
            <div class="hidden text-indent0">{{planData.deadlineTime}}</div>
          </el-col>
          <el-col :span="8">
            <div class="f-left pr1">待填报数量：</div>
            <div class="hidden text-indent0">{{planData.complete}}/{{planData.total}}</div>
          </el-col>
        </el-row>
        <div class="absolute operate-div">
          <el-button
            v-for="it of option.btnTool"
            :key="it.text"
            size="small"
            :type="it.type"
            :show="it.show?planData[it.show]:true"
            :disabled="it.disabled?planData[it.disabled]:false"
            @click="it.click(planData, {schemaId:planData.schemaId})"
          >{{it.text}}</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import { seePlanCheckDetail } from '@/api/kpi/onlineCheck/reporting'
  export default {
    name: 'kpiPlanCard',
    components: {},
    props: {
      planData: Object,
      option: Object
    },
    data() {
      return {}
    },
    methods: {
      seePlanCheckDetail
    },
    mounted() {
    },
    computed: {
    }
  }
</script>

<style scoped lang="scss">
.plan-card{
  margin-top: 10px;
  .color-title:hover{
    color:#1a95e7;
  }
  .operate-div{
    top:-43px;
    right:24px;
  }
}
</style>
