<template>
  <div class="app-container my-result">
    <div class="container-inner bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
        <div class="mb2 clearfix">
          <el-row>
            <el-col class="pl2" :span="8">
              <div class="absolute pr1 py1">状态：</div>
              <div class="except-w4-full">
                <el-select class="full"
                           v-model="schemaStatus"
                           placeholder="请选择"
                           size="small"
                           @change="getSchemas">
                  <el-option
                    v-for="item in statusOpt"
                    v-if="elements[item.id]"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col class="pl2" :span="8">
              <div class="absolute pr1 py1">方案：</div>
              <div class="except-w4-full">
                <el-select size="small" v-model="params.schemaId" placeholder="请选择" @change="getDepart">
                  <el-option
                    v-for="item in schemaOpt"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col class="pl2" :span="8">
              <div class="absolute pr1 py1">考核部门：</div>
              <div class="except-w4-full">
                <el-select size="small" v-model="params.departId" placeholder="请选择">
                  <el-option
                    v-for="item in schemaDepartOpt"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
          <div class="mt2 f-right">
            <el-button type="primary" size="small" @click="refreshAll">查询</el-button>
          </div>
        </div>
        <div v-if="!isnull">
          <div class="bd clearfix p3 full-div relative">
            <el-row class="mb2">
              <el-col class="relative" :span="8">
                <div class="f-left color-title">方案：</div>
                <div class="hidden text-indent0">{{schema.schemaName || '--'}}</div>
              </el-col>
              <el-col class="relative" :span="8">
                <div class="f-left color-title">考核周期：</div>
                <div class="hidden text-indent0">{{(schema.schemaStartTime||'')+'至'+(schema.schemaEndTime||'')}}</div>
              </el-col>
              <el-col class="relative" :span="8">
                <div class="f-left color-title">上报截止时间：</div>
                <div class="hidden text-indent0">{{schema.schemaDeadlineTime || '--'}}</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="relative" :span="8">
                <div class="f-left color-title">结束时间：</div>
                <div class="hidden text-indent0">{{schema.schemaFinishedTime?schema.schemaFinishedTime.substring(0,10):'--'}}</div>
              </el-col>
            </el-row>
            <span class="absolute name-box h32 color-title bold multiple2-hidden" v-bind:title="userInfo.departName">
              {{userInfo.departName}}
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
              <el-tabs v-model="type" type="card"  v-if="elements.total || elements.check" @tab-click="changeType">
                <el-tab-pane label="综合绩效" name="k10015-01" v-if="elements.total"></el-tab-pane>
                <el-tab-pane label="审判绩效" name="k10015-02" v-if="elements.check"></el-tab-pane>
              </el-tabs>
              <div v-if="elements.total || elements.check">
                <div class="clearfix mb2">
                  <span class="f-right btn btn-default btn-sm" @click="downloadMyResult">
                    <i class="at icon-download"/>
                    下载
                  </span>
                </div>
                <targetTable
                  id="myResult"
                  v-bind:menus="targetMenus"
                  v-bind:targetMap="targetMap"
                  :elements="elements"
                  v-bind:timeRange="{ startTime: this.schema.schemaStartTime, endTime: this.schema.schemaEndTime }"
                  :staffId="staffId"
                  v-bind:params="{ schemaBlockType: this.type, schemaId: this.params.schemaId }"
                  v-on:emitParentType="emitParentTypeByMyresult"
                ></targetTable>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <FdNoContent class="mt10"></FdNoContent>
        </div>
    </div>
  </div>
</template>

<script>
  import { getSchemas, getDepart, getTargetList, downloadMyResult, refreshAll, changeType, emitParentTypeByMyresult } from '@/api/kpi/checkResultDepart/myResultDepart'
  import targetTable from '../components/targetTableDepart.vue'
  import FdNoContent from 'fd/noContent'
  export default {
    name: 'myResultDepart',
    components: {
      targetTable, FdNoContent
    },
    props: {},
    data() {
      return {
        statusOpt: [],
        schemaStatus: 'active',
        loading: null,
        isnull: false,
        targetMenus: [],
        indexData: [],
        targetMap: {},
        schemaOpt: [],
        schemaDepartOpt: [],
        type: 'k10015-01',
        typesMap: {
          'k10015-01': '综合绩效',
          'k10015-02': '审判绩效',
          'k10015-04': '部门考核'
        },
        classObj: {
          '1': 'A-box',
          '2': 'B-box',
          '3': 'C-box',
          '4': 'D-box'
        },
        staffId: this.$store.getters.user.id,
        params: {
          companyId: '',
          schemaId: '',
          departId: '',
          schemaBlockType: ''
        },
        userInfo: {},
        schema: {},
        fileName: '',
        typeMap: this.fd.tools.mapSelects('k10003'), // 人员类别
        chairMap: this.fd.tools.mapSelects('k10010'), // 部门正副职
        allScore: '',
        grade: {},
        schemaObj: {}
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.myResultDepart || {}
      }
    },
    mounted() {
      if (this.elements.active) {
        this.schemaStatus = 'active'
      } else if (this.elements.finished) {
        this.schemaStatus = 'finished'
      } else {
        this.schemaStatus = ''
      }
      if (this.elements.active) {
        this.statusOpt.push({
          id: 'active',
          name: '生效中'
        })
      }
      if (this.elements.finished) {
        this.statusOpt.push({
          id: 'finished',
          name: '已结束'
        })
      }
      if (this.elements.check && !this.elements.total) {
        this.type = 'k10015-02'
      }
      this.getSchemas()
      this.schemaObj = this.fd.tools.merge(true, {}, { schemaBlockType: this.type }, this.schema)
    },
    methods: {
      getSchemas, getDepart, getTargetList, downloadMyResult, refreshAll, changeType, emitParentTypeByMyresult
    },
    watch: {
      indexData(d) {
        const data = this.fd.data.changeListKey(d, { indexId: 'id' })
        this.targetMap = this.fd.data.arrayToObj(data, 'id')
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
  top:6px;
  right:24px;
}
.name-box{
  top:24px;
  left:24px;
  width: 112px;
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
