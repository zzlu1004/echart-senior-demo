<template>
  <el-table-column 
    v-if="!data.field"
    prop=''
    :label="getLabel()" 
    align='center'>
      <el-table-column
        v-for="info of cols"
        v-if="columns.indexOf(info.id)>-1"
        :key="info.id" 
        :prop="'index_' + data.id + '_' + info.id" 
        :label="info.name"
        sortable="custom"
        :min-width="getWidth(info.name)"
      >
        <template slot-scope="scope">
          <div v-if="info.id==='approvalScore'">
            <el-popover
              v-if="elementsPeg && showId === scope.row.staffId + data.id"
              placement="top"
              width="300"
              v-model="showEdit"
              trigger="click"
              >
              <div>
                <div v-for="(it, index) of popoverOpt" :key="it.kpiId" 
                class="h12 color-blue py1 pointer"
                :class="index === popoverOpt.length-1?'':'bd-dashed-bottom'"
                >
                  <div @click="targetPeg(scope.row, it)">
                    {{it.kpiName}} : <span>{{it.approvalScore?it.approvalScore:'--'}}</span>
                  </div>
                </div>
              </div>
              <span slot="reference"><span  class="color-blue pointer" v-html="getTargetData(scope.row, 'index_' + data.id + '_' + info.id)" @click="showPeg(scope.row, data)"></span></span>
            </el-popover>
            <span v-else :class="elementsPeg ? 'color-blue pointer':''" v-html="getTargetData(scope.row, 'index_' + data.id + '_' + info.id)" @click="showPeg(scope.row, data)"></span>
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
    :fixed="getDataField(data)"
    :min-width="getdefaultWidth(data[this.label])">
    <template slot-scope="scope">
      <div v-if="data.field === 'staffName'" class="color-blue pointer" @click="staffNamePeg(scope.row)">{{scope.row.staffName}}</div>
      <div v-else-if="data.field === 'gradeName'">{{scope.row.gradeName?scope.row.gradeName: '--'}}</div>
      <div v-else-if="data.field === 'allScore'">{{fd.data.saveFloat(scope.row.allScore, 2)}}</div>
      <div v-else>{{scope.row[data.field]}}</div>
    </template>
  </el-table-column>
</template>

<script>
  import { casePeg, cbrWorkPeg, moralPeg, showPeg, getPegValue, staffNamePeg, sortByNum,
    targetPeg } from '@/api/kpi/checkResult/tableDetail'
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
      columns: {
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
    },
    methods: {
      casePeg, cbrWorkPeg, moralPeg, showPeg, getPegValue, staffNamePeg, sortByNum,
      targetPeg,
      getLabel() {
        return this.data.label
      },
      getTargetData(row, field) {
        if (row[field]) {
          return this.fd.data.saveFloat(row[field], 2)
        } else {
          return '--'
        }
      },
      getWidth(name = this.label) {
        const l = 16
        const num = this.cols.length
        if (this.data.label) {
          if (name.length * l - (this.data.label.length * l) / num > 0) {
            return (name.length + 1) * l + 40 // +1是给排序按钮溜空间 40是左右边距
          } else {
            return (this.data.label.length * l) / num + 40 + 16 // 多出的16是给排序按钮溜空间 40是左右边距
          }
        } else {
          return name.length * l + 40 + 16
        }
      },
      getdefaultWidth(name = this.label) {
        const l = 16
        if (name === '部门') {
          return (name.length + 2) * l + 40 + l
        } else {
          return name.length * l + 40 + l
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

