<template>
  <div class="app-container">
    <div class="container-inner bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div>
        <span class="inline-block width-356px mr3">
          <el-select
            v-model="params.indexId"
            size="small"
            placeholder="请选择"
          >
            <el-option
              v-for="item in targetOpt"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </span>
        <span v-if="$store.getters.globals.isIE">
          <el-date-picker
            type="date"
            value-format="yyyy-MM-dd"
            size="small"
            v-model="params.startTime"
            :clearable=false
            class="mr1"></el-date-picker>
            -
            <el-date-picker
            type="date"
            value-format="yyyy-MM-dd"
            size="small"
            v-model="params.endTime"
            :clearable=false
            class="ml1"
            ></el-date-picker>
        </span>
        <span v-else>
          <el-date-picker
            type="date"
            value-format="yyyy-MM-dd"
            size="small"
            placeholder="选择日期"
            v-model="params.startTime"
            :clearable=false
            class="mr1"></el-date-picker>
            -
            <el-date-picker
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            size="small"
            v-model="params.endTime"
            :clearable=false
            class="ml1"
            ></el-date-picker>
        </span>
        <el-button class="ml3" type="primary" size="small" @click="refreshAll">查询</el-button>
      </div>
      <div class="my2 tab-box">
        <el-tabs v-if="elements.depart || elements.judge" v-model="type" type="card">
          <el-tab-pane v-if="elements.depart" label="部门" name="depart">
            <!-- 部门 -->
            <div v-show="elements.depart && type === 'depart'">
              <fd-work-table
                type='depart'
                typeId='zb003'
                :active="type"
                :targetDesc="targetDesc"
                :Pparams="params"
                :targetMap="targetMap"
                :elements="elements"
                :isFlag="isFlag"
                :isSuccess="isSuccess"
                :flag="flag"
              ></fd-work-table>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="elements.judge" label="员额法官" name="judge">
            <!-- 员额法官 -->
            <div v-show="elements.judge && type === 'judge'">
              <fd-judge-table
                type='judge'
                typeId='zb003'
                :active="type"
                :targetDesc="targetDesc"
                :targetMap="targetMap"
                :elements="elements"
                :Pparams="params"
                :isFlag="isFlag"
                :isSuccess="isSuccess"
                :flag="flag"
              ></fd-judge-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import fdWorkTable from './fdWorkTable.vue'
  import fdJudgeTable from './fdJudgeTable.vue'
  import { getTargetOpt, refreshAll, toStartDate, toLocaleDate } from '@/api/kpi/qualityEfficiency/workQuality'
  export default {
    name: 'workEfficiency',
    components: {
      fdWorkTable, fdJudgeTable
    },
    props: {},
    data() {
      return {
        flag: 0,
        isSuccess: false,
        typeId: 'zb003',
        targetMap: {},
        targetDesc: {},
        targetOpt: [],
        params: {
          indexId: '',
          startTime: '',
          endTime: ''
        },
        isFlag: false,
        typeMap: {
          'depart': '部门',
          'judge': '员额法官'
        },
        fileName: '',
        pickerOptionsStart: {},
        pickerOptionsEnd: {},
        type: 'depart'
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.workEfficiency || {}
      }
    },
    mounted() {
      if (this.elements.depart) {
        this.type = 'depart'
      } else if (this.elements.judge) {
        this.type = 'judge'
      }
      this.getTargetOpt()
    },
    methods: {
      getTargetOpt, refreshAll, toStartDate, toLocaleDate
    },
    watch: {
    }
  }
</script>

<style lang="scss">
.width-356px{
  width:356px;
}
.min-height-400 {
  min-height:400px;
}
.height51{
  height:51px;
}
.width-260px {
  width:260px;
}
</style>
