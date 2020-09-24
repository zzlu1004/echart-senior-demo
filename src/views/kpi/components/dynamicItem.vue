<template>
  <el-table-column
    :prop="data[field]"
    :sortable="(data[childKey]?false:'custom')"
    :fixed="fixed"
    show-overflow-tooltip
    :align="data[childKey]?'center':getAlignStyle(data[field])"
    :min-width="fd.tools.getStringWidth(data[label])"
    :label="data[label]">
    <dynamic-table-item
      v-if="data[childKey] && data[childKey].length>0"
      v-for="item of data[childKey]"
      :key="item.id"
      v-bind:data="item"
      v-bind:isShow="isShow"
      v-bind:weightName="weightName"
      v-bind:weightId="weightId"
      v-bind:weightmodelId="weightmodelId"
      v-bind:timeRange="timeRange"
      v-bind:selectItem="selectItem"
      v-bind:typeId="typeId"
    ></dynamic-table-item>
    <template slot-scope="scope">
      <span v-if="isShow">
        <span v-if="data.code === 'query'" @click="showQuery(scope.row, data)" class="color-link pointer">{{showValue(scope.row, data)}}</span>
        <span v-else>{{showValue(scope.row, data)}}</span>
      </span>
      <div v-else>
        <span v-if="data.code === 'query'" @click="showQuery(scope.row, data)" class="color-link pointer">{{showValue(scope.row, data)}}</span>
        <div v-else-if="data.code === 'edit'">
          <el-popover
            :title="data[label]"
            placement="top"
            width="300"
            trigger="click"
            @show="getTargetData(scope.row, data[field])">
            <div>
              <el-row :gutter="8">
                <el-col :span="14">
                  <el-input size="small" @change="validateValue" v-model="editValue"></el-input>
                </el-col>
                <el-col :span="5"><span @click="hidePopover(scope)" class="btn-sm btn-default">取消</span></el-col>
                <el-col :span="5"><span @click="updateRowData(scope, data)" class="btn-sm btn-primary">确认</span></el-col>
              </el-row>
            </div>
            <span v-if="flag" slot="reference" :id="`reference-${scope.$index}${scope.column.property}`">
              <span class="pointer">{{showValue(scope.row, data)}}</span>
            </span>
          </el-popover>
          <!-- <span v-else class="pointer" @click="getTargetData(scope.row, data[field])">{{showValue(scope.row, data)}}</span> -->
        </div>
        <span v-else>{{showValue(scope.row, data)}}</span>
      </div>
    </template>
  </el-table-column>
</template>

<script>
  export default {
    name: 'DynamicTableItem',
    components: {},
    props: {
      data: {
        type: Object,
        default: () => {
          return {}
        }
      },
      selectItem: {
        type: Object,
        default: () => {
          return {}
        }
      },
      timeRange: {
        type: Array,
        default: () => {
          return []
        }
      },
      isShow: {
        type: Boolean,
        default: true
      },
      childKey: {
        type: String,
        default: 'children'
      },
      field: {
        type: String,
        default: 'field'
      },
      label: {
        type: String,
        default: 'label'
      },
      weightId: { // 左侧树的id
        type: String
      },
      weightmodelId: { // 左侧树的id
        type: String
      },
      typeId: { // 左侧树的id
        type: String
      },
      fixed: { // 表头的序号
        type: Boolean,
        default: false
      },
      weightName: {
        type: String
      }
    },
    data() {
      return {
        editValue: '',
        showEdit: false,
        editId: '',
        flag: 1
      }
    },
    computed: {},
    mounted() {
    },
    methods: {
      // sort(a, b) {
      //   let back = true
      //   if (isNaN(parseFloat(a[this.data[this.field]]))) {
      //     back = a[this.data[this.field]] > b[this.data[this.field]]
      //   } else {
      //     back = (a[this.data[this.field]] || 0) - (b[this.data[this.field]] || 0)
      //   }
      //   return back
      // },
      getAlignStyle(prop) {
        if (prop) {
          if (prop === 'name') {
            return 'left'
          } else {
            return 'right'
          }
        } else {
          return 'center'
        }
      },
      hidePopover(scope) {
        window.$('#reference-' + (scope.$index + scope.column.property)).click()
      },
      getTargetData(row, field) {
        const data = row[field] || '0.000'
        this.editValue = this.fd.data.fixedFloat(data, 0, 9999.999)
        this.editId = row.id
      },
      validateValue() {
        this.editValue = this.fd.data.fixedFloat(this.editValue, 0, 9999.999)
      },
      updateRowData(scope, data) {
        const row = scope.row
        this.fd.req({
          url: 'api/weight/kpi',
          method: 'post',
          data: {
            weightId: this.weightId,
            weightmodelId: this.weightmodelId,
            weightmodelPageKpiId: row.id,
            typeId: this.typeId,
            tableheadKpi: data.id.replace('-value', ''),
            value: this.editValue
          }
        }).then((d) => {
          row[data.field] = d.data.value
          this.flag++
          this.hidePopover(scope)
        })
      },
      showValue(row, data) {
        let value = row[data[this.field]]
        if (!value) {
          if (data[this.label] === '权重系数') {
            value = '0.000'
          } else {
            value = '0'
          }
        } else {
          if (data[this.label] === '权重系数') {
            value = this.fd.data.fixedFloat(value, 0, 9999.999)
          }
        }
        return value
      },
      showQuery(row, data) {
        let selfMsg = {}
        selfMsg = { index: data.label,
          value: this.showValue(row, data),
          departName: this.getNodeName(this.selectItem) + ' - ' + row.name,
          weightName: this.weightName }
        const obj = {
          params: {
            weightModelId: this.weightmodelId,
            typeId: this.typeId,
            kpiId: row.id,
            tableheadKpi: data.id.split('-')[0],
            startTime: this.timeRange[0],
            endTime: this.timeRange[1],
            limit: 10,
            offset: 0
          },
          selfMsg: selfMsg
        }
        localStorage.setItem('params', JSON.stringify(obj))
        this.fd.tools.goDetail.call(this, 'caseCountPeg', { query: { id: row.id, type: 'index' }})
      },
      getNodeName(node, name = '') {
        name = node.data.label + (name ? (' - ' + name) : '')
        if (node.level > 1) {
          return this.getNodeName(node.parent, name)
        }
        return name
      }
    },
    watch: {
      data() {}
    }
  }
</script>

<style scoped>
</style>
