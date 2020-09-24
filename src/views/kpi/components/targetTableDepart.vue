<template>
  <div class="fd-menu-table">
    <table style="width: 100%;">
      <thead>
        <tr>
          <th :colspan="item.colspan"
            v-for="item of tableHeads"
            :key="item.field"
            :align="item.align || 'left'">
            {{item.label}}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in targetsMsg" :key="key">
          <td v-for="parent of item.parent" :key="parent.label" v-if="getExist(parent)" :rowspan="parent.rowspan">
            <span>{{parent.label}}</span>
          </td>
          <td v-for="headItem of tableHeads"
              :colspan="(headItem.type === 'tree' ? (deep - item.parent.length) : '1')"
              :key="headItem.field"
              :align="headItem.align || 'left'">
            <div v-if="headItem.type !== 'tree'">
              <div v-if="headItem.field === 'approvalScore'">
                <el-popover
                  v-if="elements.peg && showId === item.id"
                  placement="top"
                  width="300"
                  v-model="showEdit"
                  trigger="click"
                  >
                  <div>
                    <div v-for="(it, index) of popoverOpt" :key="it.kpiId"
                    class="h12 py1"
                    :class="index === popoverOpt.length-1?'':'bd-dashed-bottom'"
                    >
                      <!--特殊标记指标不可反查，kpiType === 'k10033-00'区分-->
                      <div v-if="it.kpiType === 'k10033-00'">
                        {{it.kpiName}} : <span>{{it.approvalScore?it.approvalScore:'--'}}</span>
                      </div>
                      <div v-else class="color-blue pointer" @click="stafftargetPeg(item, it)">
                        {{it.kpiName}} : <span>{{it.approvalScore?it.approvalScore:'--'}}</span>
                      </div>
                    </div>
                  </div>
                  <span slot="reference">
                    <span  class="color-blue pointer" v-html="getField(headItem, key)" @click="showPeg(item)"></span>
                  </span>
                </el-popover>
                <span v-else :class="elements.peg ? 'color-blue pointer':''" v-html="getField(headItem, key)" @click="showPeg(item)"></span>
              </div>
              <span v-else v-html="getField(headItem, key)"></span>
            </div>
            <span v-else v-html="getField(headItem, key)"></span>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="menus.length === 0" class="bd-bottom el-table__empty-block" style="width: 100%;"><span class="el-table__empty-text">暂无数据</span></div>
  </div>
</template>

<script>
let exist = {}
import { showPeg, stafftargetPeg } from '@/api/kpi/checkResultDepart/myResultDepart'
import { casePeg, cbrWorkPeg, moralPeg, getPegValue, mzIndexDepartPeg } from '@/api/kpi/checkResultDepart/tableDetailDepart'
export default {
  name: 'targetTable',
  beforeUpdate() {
    exist = {}
  },
  components: {},
  props: {
    menus: {
      type: Array
    },
    targetMap: {
      type: Object
    },
    params: {
      type: Object
    },
    timeRange: {
      type: Object
    },
    elements: {
      type: Object
    },
    edit: {
      type: Boolean,
      default: false
    },
    getTargetMsg: {
      type: Boolean
    },
    departId: {
      type: String
    },
    schemaId: {
      type: String
    },
    schemaBlockType: {
      type: String
    }
  },
  data() {
    return {
      tableHeads: [{
        field: 'label',
        label: '指标类别',
        type: 'tree'
      }, {
        field: 'weight',
        label: ' 权重(%)',
        align: 'right',
        default: ''
      }, {
        field: 'formula',
        label: '分数换算',
        default: ''
      }, {
        field: 'valueMax',
        label: '得分区间',
        default: ''
      }, {
        field: 'approvalScore',
        label: '指标值',
        align: 'right',
        default: ''
      }, {
        field: 'score',
        label: '指标分数',
        align: 'right',
        default: ''
      }],
      showEdit: false,
      targetExplainForm: {},
      indexTypes: [
        { id: 'k10015-01', name: '综合填报' },
        { id: 'k10015-02', name: '系统测算' }],
      typesMap: {
        'k10015-01': '综合填报',
        'k10015-02': '系统测算',
        'k10015-03': '民主测评',
        'k10015-04': '部门考核'
      },
      deep: 1,
      menuMap: {},
      targetsMsg: {},
      formulList: [],
      formulMap: {},
      editKey: '',
      showId: '',
      popoverOpt: []
    }
  },
  computed: {},
  mounted() {
    this.getRegulationData()
  },
  methods: {
    showPeg, casePeg, cbrWorkPeg, moralPeg, getPegValue, stafftargetPeg, mzIndexDepartPeg,
    getExist(parent) {
      let count = exist[parent.id] || 0
      if (count === 0) {
        exist[parent.id] = 1
      } else {
        count = ++exist[parent.id]
      }
      return count === 0
    },
    getField(headItem, key) {
      let obj = {}
      if (headItem.type === 'tree') {
        obj = this.menuMap[key] || {}
      } else {
        obj = this.targetsMsg[key]
      }
      if (headItem.field === 'indexType') {
        return this.typesMap[obj.indexType] || headItem.default
      } else if (headItem.field === 'valueMax') {
        return '[' + (obj.valueMin || 0) + '-' + (obj.valueMax || 100) + ']' +
          (obj.indexSetupValue ? ('或[' + obj.indexSetupValue + ']') : '')
      } else {
        return obj[headItem.field] || headItem.default
      }
    },
    // 将指标目录和指标信息整合
    getRegulationData(menus = this.menus, targetMap = this.targetMap, menuId = 'id', listId = 'departId') {
      const menu = JSON.parse(JSON.stringify(menus))
      this.menuMap = this.fd.data.arrayToObj(menu, menuId)
      const pidMap = this.fd.data.arrayToObj(menu, 'parentId')
      const leaf = this.getAllTarget(this.menuMap, pidMap)
      this.targetsMsg = this.getAllParent(leaf, this.menuMap, menuId)
      this.getChildLength(this.targetsMsg, this.menuMap, menuId)
      this.deep = this.getObjMax(this.targetsMsg, 'level') + 1
    },
    getObjMax(data, key) {
      var max = 0
      var d = 0
      for (var i in data) {
        d = parseInt(data[i][key])
        max = d > max ? d : max
      }
      return max
    },
    getAllTarget(menuMap, pidMap) {
      const leaf = []
      // 找到所有的叶子节点
      for (const item in menuMap) {
        if (!pidMap[item]) {
          leaf.push(menuMap[item])
        }
      }
      return leaf
    },
    getChildLength(obj, menuMap, menuId) {
      let parent = []
      let id = ''
      for (const key in menuMap) {
        menuMap[key].rowspan = 0
      }
      for (const key in obj) {
        parent = obj[key].parent
        for (let n = 0; n < parent.length; n++) {
          id = parent[n][menuId]
          menuMap[id].rowspan = menuMap[id].rowspan || 0
          menuMap[id].rowspan++
        }
      }
    },
    getAllParent(leaf, menuMap, menuId) {
      const mlObj = {}
      let parent = []
      for (let i = 0; i < leaf.length; i++) {
        const id = leaf[i][menuId]
        mlObj[id] = this.fd.tools.merge(true, {}, leaf[i], { ...this.targetMap[id], parent: [] })
        parent = this.getParent(menuMap[id].parentId, menuMap)
        mlObj[id].parent = parent
        mlObj[id].level = parent.length
      }
      return mlObj
    },
    getParent(pid, menuMap) {
      let parent = []
      // 当只有一个节点的时候不存在父节点
      if (menuMap[pid]) {
        parent.push(menuMap[pid])
        if (menuMap[menuMap[pid].parentId]) {
          parent = this.getParent(menuMap[pid].parentId, menuMap).concat(parent)
        }
      }
      return parent
    }
  },
  watch: {
    deep() {
      this.tableHeads[0].colspan = this.deep
    },
    menus: {
      handler(curVal, oldVal) {
        this.getRegulationData()
      },
      deep: true
    },
    targetsMsg: {
      handler(curVal, oldVal) {
      },
      deep: true
    },
    targetMap: {
      handler(curVal, oldVal) {
        this.getRegulationData()
      },
      deep: true
    },
    isOther: {
      handler(curVal, oldVal) {
      },
      deep: true
    },
    getTargetMsg() {
      this.$emit('getTragetData', this.targetsMsg)
    },
    menuMap: {
      handler(curVal, oldVal) {
      },
      deep: true
    },
    'formulaForm.formulaId'(data) {
      if (data === '4') {
        this.formulaForm.formula = ''
      } else if (this.formulaMap[data]) {
        this.formulaForm.formula = this.formulaMap[data].name
      }
    }
  }
}
</script>

<style lang="scss">
  .special-world{
    color: #e09a00;
    font-size: 16px;
    font-weight: normal;
  }
  .full{
    width:100%
  }
</style>
