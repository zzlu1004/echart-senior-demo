<template>
  <div class="app-container">
    <div class="container-inner bg-white judge-work" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div>
        <span class="inline-block width-356px mr3">
          <el-select
            v-model="params.weightId"
            size="small"
            placeholder="请选择"
          >
            <el-option
              v-for="item in weightSchemaOpt"
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
            v-model="params.startTime"
            size="small"
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
            placeholder="选择日期"
            v-model="params.startTime"
            size="small"
            :clearable=false
            class="mr1"></el-date-picker>
            -
            <el-date-picker
            type="date"
            value-format="yyyy-MM-dd"
            size="small"
            placeholder="选择日期"
            v-model="params.endTime"
            :clearable=false
            class="ml1"
            ></el-date-picker>
        </span>
        <el-button class="ml3" type="primary" size="small" @click="refreshAll">查询</el-button>
      </div>
      <div  class="mt2 tab-box">
        <el-tabs v-if="elements.depart || elements.judge || elements.assistant || elements.clerk" v-model="type" type="card"  @tab-click="typeChange">
          <el-tab-pane v-if="elements.depart" label="部门" name="depart">
            <!-- 部门 -->
            <div v-if="elements.depart && type==='depart'">
              <handle-case-depart
                type='depart'
                :active="type"
                :weightMap="weightMap"
                :elements="elements"
                exportType='analysis-judge'
                @refreshType="refreshType"
                :isFlag="isFlag"
                :flag="flag"
                :isRefresh="isRefresh"
                :isFirst="isFirst"
                :Pparams="{ weightId: this.params.weightId, startTime: this.params.startTime, endTime: this.params.endTime }"
              ></handle-case-depart>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="elements.judge" label="员额法官" name="judge">
            <!-- 员额法官 -->
            <div v-if="elements.judge && type === 'judge'">
              <handle-case-judge
                type='judge'
                :defaultSearch="defaultSearch"
                :active="type"
                :weightMap="weightMap"
                :elements="elements"
                exportType='analysis-judge'
                :isFlag="isFlag"
                :flag="flag"
                :isRefresh="isRefresh"
                :isFirst="isFirst"
                :Pparams="{ weightId: this.params.weightId, startTime: this.params.startTime, endTime: this.params.endTime }"
              ></handle-case-judge>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="elements.assistant" label="法官助理" name="assistant">
            <!-- 法官助理 -->
            <div v-if="elements.assistant && type === 'assistant'">
              <handle-case-assistant
                type='assistant'
                :active="type"
                :weightMap="weightMap"
                :elements="elements"
                exportType='analysis-assistant'
                :isFlag="isFlag"
                :flag="flag"
                :isRefresh="isRefresh"
                :isFirst="isFirst"
                :Pparams="{ weightId: this.params.weightId, startTime: this.params.startTime, endTime: this.params.endTime }"
              ></handle-case-assistant>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="elements.clerk" label="书记员" name="clerk">
            <!-- 书记员 -->
            <div v-if="elements.clerk && type === 'clerk'">
              <handle-case-clerk
                type='clerk'
                :active="type"
                :weightMap="weightMap"
                :elements="elements"
                exportType='analysis-clerk'
                :isFlag="isFlag"
                :flag="flag"
                :isRefresh="isRefresh"
                :isFirst="isFirst"
                :Pparams="{ weightId: this.params.weightId, startTime: this.params.startTime, endTime: this.params.endTime }"
              ></handle-case-clerk>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import fdEchart from 'fd/echarts/echarts'
  import FdPagination from 'fd/pagination/pagination'
  import fdTable from 'fd/table'
  import handleCaseDepart from './judgeWorkCom/handleCaseDepart.vue'
  import handleCaseJudge from './judgeWorkCom/handleCaseJudge.vue'
  import handleCaseAssistant from './judgeWorkCom/handleCaseAssistant.vue'
  import handleCaseClerk from './judgeWorkCom/handleCaseClerk.vue'
  import { getWeightOpt, refreshAll, toStartDate, toLocaleDate, typeChange } from '@/api/kpi/performance/judgeWork'
  export default {
    name: 'judeWork',
    components: {
      fdEchart, fdTable, FdPagination, handleCaseDepart, handleCaseJudge, handleCaseAssistant, handleCaseClerk
    },
    props: {},
    data() {
      return {
        weightSchemaOpt: [],
        weightMap: {},
        weightParams: {
          limit: 0,
          offset: 0,
          status: '',
          keyword: ''
        },
        params: {
          weightId: '',
          startTime: '',
          endTime: ''
        },
        flag: 0,
        isFlag: false,
        // 是否是第一次进页面，如果是第一次就只加载部门页签里面的除了表格之外的接口（表格加载数据将通过默认排序defaultSort触发sortByNum方法）
        isFirst: false,
        // 是否是点击了查询按钮，查询之后没有默认排序，需要加载所有的接口
        isRefresh: false,
        pickerOptionsStart: {},
        pickerOptionsEnd: {},
        type: 'depart',
        from: '',
        defaultSearch: ''
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.judeWork || {}
      }
    },
    mounted() {
      if (this.elements.depart) {
        this.type = 'depart'
      } else if (this.elements.judge) {
        this.type = 'judge'
      } else if (this.elements.assistant) {
        this.type = 'assistant'
      } else if (this.elements.clerk) {
        this.type = 'clerk'
      }
      // 判断是否是从数魔方平台跳转过来
      this.from = this.$route.query.from || ''
      if (this.from) {
        this.type = this.$route.query.type
        if (!this.elements[this.type]) {
          this.$message({
            type: 'warning',
            message: '暂无访问权限，请配置相关权限'
          })
        }
      }
      this.getWeightOpt()
    },
    methods: {
      getWeightOpt, refreshAll, toStartDate, toLocaleDate, typeChange,
      refreshType(msg) {
        if (msg) {
          this.type = msg.type
          this.defaultSearch = msg.departName
        } else {
          this.defaultSearch = ''
        }
      }
    },
    watch: {
      // type(val, oldVal) {
      //   this.isFlag = !this.isFlag
      // }
    }
  }
</script>

<style lang="scss">
.width-356px{
  width:356px;
}
.min-height-div {
  min-height:320px;
}
.width-260px {
  width:260px;
}
.level-title{
  height: 28px;
  line-height: 28px;
}
.title-hide{
  display: none;
}
</style>
