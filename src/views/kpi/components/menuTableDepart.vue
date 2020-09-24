<template>
  <div class="fd-menu-table">
    <table style="width: 100%;">
      <thead>
        <tr>
          <th
            :colspan="item.colspan"
            v-for="item of heads"
            :key="item.field"
            :align="item.align || 'left'">
            {{item.label}}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in targetsMsg" :key="key">
          <td v-for="parent of item.parent" :key="parent.menuName" v-if="getExist(parent)" :rowspan="parent.rowspan">
            {{parent.menuName}}
          </td>
          <td v-for="headItem of heads"
              :colspan="(headItem.type === 'tree' ? (deep - item.parent.length) : '1')"
              :key="headItem.field"
              :align="headItem.align || 'left'">
            <div v-if="headItem.type !== 'tree' && edit" class = "dialog-full">
              <!--<el-select v-if="headItem.field === 'indexType'" v-model="item.indexType" placeholder="请选择">
                <el-option
                  v-for="type in indexTypes"
                  :key="type.id"
                  :label="type.name"
                  :value="type.id">
                </el-option>
              </el-select>-->
              <span v-if="headItem.field === 'indexType'">{{getField(headItem, key)}}</span>
              <span v-if="headItem.field === 'process' && (!item.flows || item.flows.length === 0)">--</span>
              <el-select v-model="item.indexFlowId"
                         v-else-if="headItem.field === 'process' && item.flows.length > 0"
                         style="max-width: 300px;"
                         placeholder="请选择流程">
                <el-option
                  v-for="li in item.flows"
                  :key="li.id"
                  :label="li.flowName"
                  :value="li.id">
                </el-option>
              </el-select>
              <el-input style="max-width: 300px;"
                        v-else-if="headItem.field === 'weight'"
                        @change="changeValue(item, 'weight')"
                        v-model="item.weight"></el-input>
              <div class="pointer" @click.stop="showFormula(item)" v-else-if="headItem.field === 'formula'">
                <span>{{item.formula}}</span>
                <span class="f-right edit-icon">
                  <i class="fd-icon icon-tianxiecopy color-subTitle"/>
                </span>
              </div>
              <div class="pointer relative" @click.stop="showSection(item)" v-else-if="headItem.field === 'checkFormula'">
                <span class="inline-block pr3" v-html="getField(headItem, key)"></span>
                <span class="absolute edit-icon edit-icon-score">
                  <i class="fd-icon icon-tianxiecopy color-subTitle"/>
                </span>
              </div>
            </div>
            <span v-else v-html="getField(headItem, key)"></span>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="menus.length === 0" class="bd-bottom el-table__empty-block" style="width: 100%;"><span class="el-table__empty-text">暂无数据</span></div>
    <!--分数换算-->
    <fd-dialog
      title="分数换算"
      :syncVisible="formulaDialog"
      @beforeClose="formulaDialog = false"
    >
      <div slot="fd-body">
        <div class="dialog-formulaForm">
          <el-form ref="formulaForm" label-position="right" :model="formulaForm" label-width="0" @submit.native.prevent>
            <div v-for="(item, index) in formulaList" class="mt2 relative" :key="index">
              <div class="absolute" :style="{top: (item.id === formulaForm.formulaId ? '5px' : '0')}">
                <el-radio v-model="formulaForm.formulaId" name="formulaId" @change="formulaChange" :label="item.id">&nbsp;</el-radio>
              </div>
              <el-form-item class="inline-block"
                            prop="formula"
                            style="width:100%"
                            labelWidth="30px"
                            v-if="item.id === formulaForm.formulaId"
                            :rules="{required: false, validator: requiredFormula, trigger: 'blur'}">
                <el-input v-model="formulaForm.formula"
                          @focus="focusing=true"
                          placeholder="请输入换算公式"></el-input>
              </el-form-item>
              <div v-else="" style="margin-left: 30px;">{{getFormulaName(item)}}</div>
              <fd-formula-des-depart v-show="formulaForm.formulaId === item.id && focusing"></fd-formula-des-depart>
            </div>
            <!--<el-radio-group v-model="formulaForm.formulaId" @change="formulaChange">
            </el-radio-group>-->
          </el-form>
        </div>
      </div>
      <div slot="fd-footer">
        <el-button  size="small" @click="formulaDialog = false">取消</el-button>
        <el-button  size="small" type="primary" @click = "saveFormula">确定</el-button>
      </div>
    </fd-dialog>
    <!--得分区间-->
    <fd-dialog
      title="得分区间"
      :syncVisible="sectionDialog"
      @beforeClose="sectionDialog = false"
    >
      <div slot="fd-body">
        <div class="px2">
          <el-form ref="sectionForm" label-position="right" class="sectionForm" :model="sectionForm" label-width="100px" :rules="rules">
            <el-form-item label="得分区间">
              <el-col :span="9">
                <el-form-item prop="valueMin">
                  <el-input v-model="sectionForm.valueMin" @change="changeValue(sectionForm, 'valueMin')"></el-input>
                </el-form-item>
              </el-col>
              <el-col class="t-center" :span="1">至</el-col>
              <el-col :span="9">
                <el-form-item prop="valueMax">
                  <el-input v-model="sectionForm.valueMax" @change="changeValue(sectionForm, 'valueMax')"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label-width="0">
              <div>
                <div class="bold color-title h16 pb2">特殊条件</div>
                <div class="p2 bd">
                  <div class="py1">
                    <div class = "absolute special-world">若</div>
                    <div class = "except-w1-full">
                      <el-form-item prop="checkFormula">
                        <el-input v-model="sectionForm.checkFormula"
                                  style="width: 600px"
                                  placeholder="请输入具体公式"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <fd-formula-des-depart :des = "des"></fd-formula-des-depart>
                  <div class="pt2">
                    <div class = "absolute special-world">则</div>
                    <div class = "absolute" style="left: 48px">指标分数为:</div>
                    <div class = "except-w6-full">
                      <el-form-item prop="indexSetupValue">
                        <el-input v-model="sectionForm.indexSetupValue"
                                  @change="changeValue(sectionForm, 'indexSetupValue')"
                                  style="width: 300px"></el-input>
                        <el-popover
                          placement="top-start"
                          width="300"
                          trigger="hover"
                          content="指标分数为非必填项,当该部门指标设置某种限制条件时,该指标数值为该分数。">
                          <i slot="reference" class="at icon-questioncircle color-d9d9d9 pointer"/>
                        </el-popover>
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="fd-footer">
        <el-button size="small" @click="sectionDialog = false">关闭</el-button>
        <el-button size="small" @click = "saveSection" type="primary">确定</el-button>
      </div>
    </fd-dialog>
  </div>
</template>

<script>
  import FdTable from 'fd/table/src/fdTable'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  import FdFormulaDesDepart from '../components/formulaDesDepart'
  import { isFloat } from '@/utils/validate'
  let exist = {}
  const validateFormula = function(rule, value, callback) {
    value = value || ''
    const left = value.match(/\(/g)
    const right = value.match(/\)/g)
    if (left && right && left.length !== right.length) {
      callback(new Error('()需要成对出现'))
    }
    const error = []
    const regs = [
      /部门指标值/g,
      /全院指标值/g,
      /全院指标均值/g,
      /业务线指标值/g,
      /业务线指标均值/g,
      /IF/g,
      /AVERAGE/g,
      /AND/g,
      /OR/g,
      /\=/g,
      /\<\=/g,
      /\>\=/g,
      /[\+\-\*\/\(\)\,\<\>\s]/g
    ]
    if (value.indexOf('、') > -1) {
      error.push(...value.match(/、/g))
    }
    // 数字[-10000, 10000]之间
    const ints = value.match(/-?\d+\.*\d*/g) || []
    value = value.replace(/-?\d+\.*\d*/g, '')
    for (const item of ints) {
      if (!(/^-?\d{1,4}(\.\d{1,4})?$/g.test(item))) {
        error.push(item)
      }
    }
    for (const reg of regs) {
      value = value.replace(reg, '、')
    }
    if (value !== '' || error.length > 0) {
      error.push(...value.split(/、/g))
      const total = []
      for (const item of error) {
        if (item !== '') {
          total.push(item)
        }
      }
      if (total.length > 0) {
        callback(new Error('存在不支持的字符: ' + total.join()))
      } else {
        callback()
      }
    }
    callback()
  }
  const requiredFormula = function(rule, value, callback) {
    if (value === '') {
      callback(new Error('换算公式不能为空'))
    }
    validateFormula(rule, value, callback)
  }
  const validateFloat = function(rule, value, callback) {
    if (value && !isFloat(value)) {
      callback(new Error('请输入一个小数位不超过4位的数值'))
    }
    callback()
  }
  export default {
    name: 'FdMenuTableDepart',
    beforeUpdate() {
      exist = {}
    },
    components: { FdTable, FdFormulaDesDepart, fdDialog },
    props: {
      menus: {
        type: Array
      },
      targetMap: {
        type: Object
      },
      heads: {
        type: Array,
        default: () => {
          return [{
            field: 'menuName',
            label: '指标类别',
            type: 'tree'
          }, {
            field: 'process',
            label: '指标流程',
            default: '--'
          }, {
            field: 'weight',
            label: '自定义权重(%)',
            align: 'right',
            default: ''
          }, {
            field: 'formula',
            label: '分数换算',
            default: ''
          }, {
            field: 'checkFormula',
            label: '得分区间',
            default: ''
          }]
        }
      },
      edit: {
        type: Boolean,
        default: false
      },
      getTargetMsg: {
        type: Boolean
      }
    },
    data() {
      return {
        rules: {
          valueMin: [{ required: true, message: '请输入得分区间最小值', trigger: 'blur' }],
          valueMax: [{ required: true, message: '请输入得分区间最大值', trigger: 'blur' }],
          checkFormula: [{ validator: validateFormula, trigger: 'blur' }],
          indexSetupValue: [{ validator: validateFloat, trigger: 'blur' }]
        },
        des: `公式示例: 部门指标值>(全院指标均值*0.8)
      注意: 1、输入公式仅使用以下16种的半角符号才有效;
            2、输入公式可以输入任意数字值,范围在[-10000,10000]间,且小数点不超过4位;
            3、输入公式除数值和16种符号外仅可使用下列所示特殊中文指标值;
            4、点击下方对应指标值或符号后在公式输入框中粘贴(Ctrl+V)即可复制。`,
        indexTypes: [{ id: '1', name: '综合填报' },
          { id: '2', name: '系统测算' }],
        typesMap: {
          1: '综合填报',
          2: '系统测算'
        },
        menuMap: {},
        targetsMsg: {},
        deep: 1,
        formulaDialog: false,
        sectionDialog: false,
        formulaList: [],
        formulaMap: {},
        defaultFormula: {},
        editKey: '',
        formulaForm: {
          formula: '',
          formulaId: ''
        },
        sectionForm: {
          valueMax: '',
          valueMin: '',
          checkFormula: '',
          indexSetupValue: ''
        },
        focusing: true
      }
    },
    computed: {},
    mounted() {
      this.getRegulationData()
      this.getFormulaList()
    },
    methods: {
      emptyFun(e) {
      },
      changeValue(obj, key, min = -9999.99, max = 9999.99) {
        let value = obj[key]
        value = value.replace(/[^\-\d\.]/g, '')
        value = this.fd.data.fixedFloat(value, min, max, 2)
        obj[key] = value
      },
      validateFormula,
      requiredFormula,
      getFormulaName(item) {
        if (item.id === '8' && this.formulaMap[item.id].value === '自定义公式') {
          return '自定义公式'
        } else {
          return this.formulaMap[item.id].value
        }
      },
      formatterProcess(data) {
        data = data || []
        const staffTypeMap = {
          '1': '考核对象本人',
          '2': '直属领导',
          '3': 'staffName',
          '4': 'roleName'
        }
        let html = ''
        for (let i = 0; i < data.length; i++) {
          if (data[i].staffType === '1' || data[i].staffType === '2') {
            html += staffTypeMap[data[i].staffType]
          } else if (data[i].staffType === '3' || data[i].staffType === '4') {
            html += data[i][staffTypeMap[data[i].staffType]]
          }
          html += (i !== data.length - 1) ? '>>' : ''
        }
        return html
      },
      formulaChange(id) {
        if (id === '8' && this.formulaMap[id].value === '自定义公式') {
          this.formulaForm.formula = ''
        } else {
          this.formulaForm.formula = this.formulaMap[id].value
        }
      },
      getExist(parent) {
        let count = exist[parent.menuId] || 0
        if (count === 0) {
          exist[parent.menuId] = 1
        } else {
          count = ++exist[parent.menuId]
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
        } else if (headItem.field === 'checkFormula') {
          return '<div>[' + (this.fd.data.fixedFloat((obj.valueMin || 0), -9999.99, 9999.99, 2) + '-' +
            this.fd.data.fixedFloat((obj.valueMax === null ? 100 : obj.valueMax), -9999.99, 9999.99, 2) + ']' +
            ((obj.checkFormula) ? '或' : '') +
            ((obj.checkFormula) ? '<br><div class="py1" style="line-height: 15px">若：' + obj.checkFormula + '</div>' : '') + ((obj.indexSetupValue !== null && obj.indexSetupValue !== '' && obj.checkFormula) ? ('则：[' + this.fd.data.fixedFloat(obj.indexSetupValue, -9999.99, 9999.99, 2) + ']</div>') : '</div>'))
        } else if (headItem.field === 'process') {
          return obj.flowName || headItem.default
        } else if (headItem.field === 'weight') {
          return this.fd.data.fixedFloat(obj.weight, -9999.99, 9999.99, 2)
        } else {
          return obj[headItem.field] || headItem.default
        }
      },
      // 将指标目录和指标信息整合
      getRegulationData(menus = this.menus, targetMap = this.targetMap, menuId = 'menuId', listId = 'id') {
        const menu = JSON.parse(JSON.stringify(menus))
        this.menuMap = this.fd.data.arrayToObj(menu, menuId)
        const pidMap = this.fd.data.arrayToObj(menu, 'pid')
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
        for (const key in menuMap) {
          menuMap[key].rowspan = 0
        }
        let parent = []
        let id = ''
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
          mlObj[id] = this.fd.tools.merge(true, {}, leaf[i], this.targetsMsg[id], { ...this.targetMap[id], parent: [] })
          parent = this.getParent(menuMap[id].pid, menuMap)
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
          if (menuMap[menuMap[pid].pid]) {
            parent = this.getParent(menuMap[pid].pid, menuMap).concat(parent)
          }
        }
        return parent
      },
      showFormula(item) {
        this.formulaDialog = true
        this.formulaMap = this.fd.tools.merge(true, {}, this.defaultFormula)
        this.formulaMap[item.formulaId].value = item.formula
        this.$nextTick(() => {
          this.$refs.formulaForm.resetFields()
          this.showKey = item.menuId
          this.formulaForm.formulaId = item.formulaId
          this.formulaForm.formula = item.formula
        })
      },
      showSection(item) {
        this.sectionDialog = true
        this.$nextTick(() => {
          this.$refs.sectionForm.resetFields()
          this.showKey = item.menuId
          this.sectionForm.valueMax = item.valueMax
          this.sectionForm.valueMin = item.valueMin
          this.sectionForm.checkFormula = item.checkFormula
          this.sectionForm.indexSetupValue = item.indexSetupValue
        })
      },
      getFormulaList() {
        this.fd.req({
          url: 'api/blocks/formulas',
          method: 'get',
          data: {
            type: 'depart'
          }
        }).then((d) => {
          const data = d.data
          this.defaultFormula = this.fd.data.arrayToObj(data, 'id')
          this.formulaMap = this.fd.tools.merge(true, {}, this.defaultFormula)
          this.formulaList = data
        })
      },
      saveFormula() {
        this.$refs.formulaForm.validate((valid) => {
          if (valid) {
            this.fd.tools.merge(true, this.targetsMsg[this.showKey], this.formulaForm)
            this.formulaDialog = false
          } else {
            return false
          }
        })
      },
      saveSection() {
        this.$refs.sectionForm.validate((valid) => {
          if (valid) {
            this.fd.tools.merge(true, this.targetsMsg[this.showKey], this.sectionForm)
            this.sectionDialog = false
          } else {
            return false
          }
        })
      }
    },
    watch: {
      deep() {
        this.heads[0].colspan = this.deep
      },
      menus: {
        handler(curVal, oldVal) {
          this.getRegulationData()
        },
        deep: true
      },
      targetsMsg: {
        handler(curVal, oldVal) {
          this.$emit('refreshTarget', curVal)
        },
        deep: true
      },
      targetMap: {
        handler(curVal, oldVal) {
          this.getRegulationData()
        },
        deep: true
      },
      getTargetMsg() {
        this.$emit('refreshTargetMsg', this.targetsMsg)
      },
      menuMap: {
        handler(curVal, oldVal) {
        },
        deep: true
      }
    }
  }
</script>

<style scoped>
  .special-world{
    color: #e09a00;
    font-size: 16px;
    font-weight: normal;
  }
  .fd-menu-table .dialog-full .pointer{
    width: 100%;
  }
  .el-table__empty-block{
    min-height: 4rem;
  }
  .edit-icon:hover i{
    color: #1b95e7;
  }
  .edit-icon-score{
    top: 50%;
    margin-top: -7px;
    right: 0
  }
</style>
<style>
  .sectionForm .el-form-item__label{
    float: left;
  }
  .dialog-formulaForm .el-radio-group{
    font-size: 14px;
  }
</style>

