<template>
  <el-table-column
    v-if="!data.field"
    prop=''
    :label="data[this.label]?data[this.label]:label"
    align='center'
    :fixed="getDataField(data)"
    :min-width="fd.tools.getStringWidth(data[this.label]?data[this.label]:label)">
    <multi-head
        v-if="data[childKey]"
        v-for="item of data[childKey]"
        :key="item[keyName]"
        :elementsPeg="elementsPeg"
        :data="item"
        :cols="cols"
        :resource="resource"
        v-bind:params="params"
        v-bind:timeRange="timeRange"
        ></multi-head>
      <el-table-column v-if="!data[childKey]&&!data.field"
        v-for="info of cols"
        :key="info.id"
        :prop="'index_' + data.id + '_' + info.id"
        :label="info.name"
        sortable="custom"
        :align="getAlignStyle(info.id)"
        :min-width="fd.tools.getStringWidth(info.name)"
      >
        <template slot-scope="scope">
          <!--特殊标记指标不可反查，isPegging区分,暂时废弃不用
          <div v-if="info.id==='approvalScore' && data.isPegging">-->
          <!--<div v-if="info.id==='approvalScore' && data.isPegging">-->
          <div v-if="info.id==='approvalScore'">
            <el-popover
              placement="top"
              width="300"
              trigger="click"
              @show="showPeg(scope.row, data)"
              >
              <div>
                <div v-for="(it, index) of popoverOpt" :key="it.kpiId"
                class="h12 py1"
                :class="index === popoverOpt.length-1?'':'bd-dashed-bottom'"
                >
                  <div v-if="it.kpiType === 'k10033-00'">
                    {{it.kpiName}} : <span>{{it.approvalScore?it.approvalScore:'--'}}</span>
                  </div>
                  <div v-else class="color-blue pointer" @click="targetPeg(scope.row, it)">
                    {{it.kpiName}} : <span>{{it.approvalScore?it.approvalScore:'--'}}</span>
                  </div>
                </div>
              </div>
              <span slot="reference">
                <span class="color-blue pointer" v-html="getTargetData(scope.row, 'index_' + data.id + '_' + info.id)"></span>
              </span>
            </el-popover>
          </div>
          <div v-else v-html="getTargetData(scope.row, 'index_' + data.id + '_' + info.id)"></div>
        </template>
      </el-table-column>
  </el-table-column>
  <el-table-column
    v-else
    :prop="data.field"
    :label="data[this.label]?data[this.label]:label"
    show-overflow-tooltip
    sortable="custom"
    :align="getAlignStyle(data.field)"
    :fixed="getDataField(data)"
    :min-width='fd.tools.getStringWidth(data[this.label]?data[this.label]:label)'>
    <template slot-scope="scope">
      <div v-if="data.field === 'departName'" class="color-blue pointer" @click="staffNamePeg(scope.row)">{{scope.row.departName}}</div>
      <div v-else-if="data.field === 'gradeName'">{{scope.row.gradeName?scope.row.gradeName: '--'}}</div>
      <div v-else-if="data.field === 'allScore'">{{fd.data.saveFloat(scope.row.allScore, 2)}}</div>
      <div v-else>{{scope.row[data.field]}}</div>
    </template>
    <multi-head
        v-if="data[childKey]"
        v-for="item of data[childKey]"
        :key="item[keyName]"
        :elementsPeg="elementsPeg"
        :data="item"
        :cols="cols"
        :resource="resource"
        v-bind:params="params"
        v-bind:timeRange="timeRange"
        ></multi-head>
  </el-table-column>
</template>

<script>
  import { casePeg, cbrWorkPeg, moralPeg, showPeg, getPegValue, staffNamePeg, sortByNum,
    targetPeg, getAlignStyle, mzIndexDepartPeg } from '@/api/kpi/checkResultDepart/tableDetailDepart'
  export default {
    name: 'multiHead',
    components: {},
    props: {
      data: {
        type: Object,
        default: () => {}
      },
      params: {
        type: Object
      },
      timeRange: {
        type: Object
      },
      childKey: {
        type: String,
        default: 'children'
      },
      id: {
        type: String,
        default: 'firstScore'
      },
      keyName: {
        type: String,
        default: 'id'
      },
      label: {
        type: String,
        default: 'label'
      },
      resource: {
        type: String,
        default: ''
      },
      edit: {
        type: Boolean,
        default: false
      },
      indexs: {
        type: Array
      },
      cols: {
        type: Array
      },
      elementsPeg: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        showEdit: false,
        showId: '',
        popoverOpt: [],
        functionPeg: {
          '1': 'moralPeg',
          '2': 'casePeg'
        }
      }
    },
    computed: {},
    mounted() {
      console.log()
    },
    methods: {
      casePeg, cbrWorkPeg, moralPeg, showPeg, getPegValue, staffNamePeg, sortByNum,
      targetPeg, getAlignStyle, mzIndexDepartPeg,
      getTargetData(row, field) {
        if (row[field]) {
          // return this.fd.data.saveFloat(row[field], 2)
          return row[field]
        } else {
          return '--'
        }
      },
      getDataField(data) {
        return data.id === 'departName' || data.id === 'staffName' || data.id === 'allScore' ||
          data.id === 'rank' || data.id === 'gradeName'
      }
    },
    watch: {
    }
  }
</script>

<style scoped>
</style>

