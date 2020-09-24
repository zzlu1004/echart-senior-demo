<template>
  <div class="app-container moral">
    <div class="container-inner has-fixed-bottom bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="bd clearfix p3 full-div relative">
        <el-row class="mb2">
          <el-col class="relative" :span="8">
            <div class="absolute">人员类型：</div>
            <div class="except-w4-full">{{userInfo.staffTypeName || '--'}}</div>
          </el-col>
          <el-col class="relative" :span="8">
            <div class="absolute">部门：</div>
            <div class="except-w2-full">{{userInfo.departName || '--'}}</div>
          </el-col>
          <el-col class="relative" :span="8">
            <div class="absolute">部门正副职：</div>
            <div class="except-w5-full">{{userInfo.chairName || '--'}}</div>
          </el-col>
        </el-row>
        <el-row class="mb2">
          <el-col class="relative" :span="8">
            <div class="absolute">方案：</div>
            <div class="except-w2-full">{{schema.schemaName || '--'}}</div>
          </el-col>
          <el-col class="relative" :span="8">
            <div class="absolute">考核周期：</div>
            <div class="except-w4-full">{{(schema.schemaStartTime||'')+'至'+(schema.schemaEndTime||'')}}</div>
          </el-col>
          <el-col class="relative" :span="8">
            <div class="absolute">上报截止时间：</div>
            <div class="except-w6-full">{{schema.schemaDeadlineTime || '--'}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="relative" :span="8">
            <div class="absolute">结束时间：</div>
            <div class="except-w4-full">{{schema.schemaFinishedTime?schema.schemaFinishedTime: '--'}}</div>
          </el-col>
        </el-row>
        <span class="absolute name-box h28 color-title bold">
          {{userInfo.staffName}}
        </span>
        <span class="absolute score-box">
          <span v-if="allScore" class="level-box p2 bg-gray inline-block center mr6">
            <div class="h24 bold color-title">{{fd.data.saveFloat(allScore, 2)}}</div>
            <div class="pt1">总分</div>
          </span>
          <span v-if="grade" class="level-box p2 color-white inline-block center" :class="classObj[grade.gradeId]">
            <div class="h24 bold">{{grade.gradeName}}</div>
            <div class="pt1">评档</div>
          </span>
        </span>
      </div>
      <div>
        <div class="tab-box mt2">
          <el-tabs v-model="type" type="card">
            <el-tab-pane label="综合绩效" name="k10015-01"></el-tab-pane>
            <el-tab-pane label="审判绩效" name="k10015-02"></el-tab-pane>
            <el-tab-pane label="民主测评" name="k10015-03"></el-tab-pane>
            <el-tab-pane label="新民主测评" name="k10015-04"></el-tab-pane>
          </el-tabs>
          <div>
            <div class="clearfix mb2">
              <span class="f-right btn btn-default btn-sm" @click="downloadMyResult">
                <i class="at icon-download"/>
                下载
              </span>
            </div>
            <targetTable id="myResult"
              v-bind:menus="targetMenus"
              v-bind:targetMap="targetMap"
              :staffId="staffId"
              :elements="elements"
              v-bind:timeRange="timeRange"
              v-bind:params="{schemaId: this.$route.query.schemaId,schemaBlockType:type, weightId: this.$route.query.weightId}"
              v-on:emitParentType="emitParentType"
            ></targetTable>
          </div>
        </div>
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
  import { goBack } from '@/api/common'
  import { getTargetList, downloadMyResult, emitParentType } from '@/api/kpi/checkResult/myResult'
  import targetTable from '../components/targetTable.vue'
  export default {
    name: 'staffDetail',
    components: {
      targetTable
    },
    props: {},
    data() {
      return {
        offset: 0,
        limit: 0,
        loading: null,
        targetMenus: [],
        indexData: [],
        targetMap: {},
        schemaId: '',
        type: '',
        staffId: '',
        params: {
          schemaId: '',
          companyId: '',
          schemaBlockType: ''
        },
        userInfo: {},
        schema: {},
        typesMap: {
          'k10015-01': '综合绩效',
          'k10015-02': '审判绩效',
          'k10015-03': '民主测评',
          'k10015-04': '新民主测评'
        },
        classObj: {
          '1': 'A-box',
          '2': 'B-box',
          '3': 'C-box',
          '4': 'D-box'
        },
        fileName: '',
        typeMap: this.fd.tools.mapSelects('k10003'), // 人员类别
        chairMap: this.fd.tools.mapSelects('k10010'), // 部门正副职
        allScore: '',
        grade: {},
        schemaObj: {},
        timeRange: {}
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.myResult || {}
      }
    },
    mounted() {
      this.timeRange = JSON.parse(localStorage.getItem('timeRange'))
      this.staffId = this.$route.query.id || ''
      this.params = {
        schemaId: this.$route.query.schemaId || '',
        companyId: this.$route.query.companyId || '',
        schemaBlockType: this.$route.query.schemaBlockType || ''
      }
      // 手动给type赋值，监听type()变化-触发this.getTargetList()
      this.type = this.$route.query.type || 'k10015-01'
    },
    methods: {
      getTargetList, downloadMyResult, goBack, emitParentType
    },
    watch: {
      indexData(d) {
        const data = this.fd.data.changeListKey(d, { indexId: 'id' })
        this.targetMap = this.fd.data.arrayToObj(data, 'id')
      },
      type(val) {
        this.params.schemaBlockType = val
        this.getTargetList()
      }
    }
  }
</script>

<style lang="scss" scoped>
.width-400px{
  width:400px;
}
.level-box{
  min-width: 98px;
  min-height:74px;
}
.full-div{
  width:100%;
  padding-left:200px;
  padding-right:400px;
}
.score-box{
  top:24px;
  right:24px;
}
.name-box{
  top:24px;
  left:24px;
  width: 108px;
}
.color-d9d9d9{
  color:#d9d9d9;
}
.A-box{
  background-color: #1a95e7;
}
.B-box{
  background-color: #00a853;
}
.C-box{
  background-color: #ffbf00;
}
.D-box{
  background-color: #ef4133;
}
</style>
