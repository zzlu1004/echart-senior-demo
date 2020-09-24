<template>
  <div>
    <el-table class="tree-table"
      v-loading="loading"
      :height="height"
      element-loading-text="数据正在加载中"
      :data="tableData"
      @cell-click='cellClick'
      :border="true">
      <el-table-column
        v-for="(item, index) of columns"
        :key="index"
        :label="item.title"
        :width="item.width"
        :min-width="item.minWidth"
        :prop="item.field"
        :show-overflow-tooltip="item.showOverflowTooltip || true"
      >
        <template slot-scope="scope">
          <!--指标类别-->
          <span v-if="item.expand"
                class="at-expand pointer"
                @click.stop="toggleOpen(dataMap[scope.row.id])"
                :style="{'marginLeft': (scope.row.deep-1)*16+'px'}">
            <span v-if="children[scope.row.id]">
              <span v-if="dataMap[scope.row.id].isOpen"><i class="at icon-caretdown"/></span>
              <span v-else><i class="at icon-caretright"/></span>
            </span>
            <!--<span>{{dataMap[scope.row.id].menuName}}</span>-->
          </span>
          <!--menuType判断为指标行显示编辑,1指标，0目录-->
          <!--指标流程-->
          <span v-if="item.field === 'process' && (!dataMap[scope.row.id].flows || dataMap[scope.row.id].flows.length === 0) && dataMap[scope.row.id].menuType === '1'">--</span>
          <el-select v-model="dataMap[scope.row.id].indexFlowId"
                     v-if="item.selected && item.field === 'process' && dataMap[scope.row.id].menuType === '1' && dataMap[scope.row.id].flows.length > 0"
                     style="max-width: 300px;"
                     placeholder="请选择流程">
            <el-option
              v-for="li in dataMap[scope.row.id].flows"
              :key="li.id"
              :label="li.flowName"
              :value="li.id">
            </el-option>
          </el-select>
            <!--自定义权重-->
          <el-input style="max-width: 300px;"
                    v-else-if="item.changed && item.field === 'weight' && dataMap[scope.row.id].menuType === '1'"
                    @change="changeValue(dataMap[scope.row.id], 'weight')"
                    v-model="dataMap[scope.row.id].weight"></el-input>
          <!--规则-->
          <div class="pointer" @click.stop="showRule(dataMap[scope.row.id])" v-else-if="item.getSum && item.field === 'rule' && dataMap[scope.row.id].menuType === '0'">
            <span>{{(dataMap[scope.row.id].formula&&dataMap[scope.row.id].
              ruleType==='k10030-02')?dataMap[scope.row.id].formula:'求和'}}</span>
            <span class="f-right edit-icon">
                <i class="fd-icon icon-tianxiecopy color-subTitle"/>
            </span>
          </div>
          <!--分数换算-->
          <div class="pointer" @click.stop="showFormula(dataMap[scope.row.id])" v-else-if="item.getScore && item.field === 'formulas' && dataMap[scope.row.id].menuType === '1'">
            <span>{{dataMap[scope.row.id].formula}}</span>
            <span class="f-right edit-icon" >
                <i class="fd-icon icon-tianxiecopy color-subTitle"/>
            </span>
          </div>
          <!--得分区间-->
          <span class="pointer relative"  @click.stop="showSection(dataMap[scope.row.id])" v-else-if="item.changed && item.field === 'checkFormula' && dataMap[scope.row.id].menuType === '1'">
          <span class="inline-block pr3" v-html="getField(item, scope.row.id)"></span>
          <span class="f-right edit-icon edit-icon-score">
            <i class="fd-icon icon-tianxiecopy color-subTitle"/>
          </span>
        </span>
        <!--<span v-else v-html="item.getScore || item.getSum?'':dataMap[scope.row.id][item.field]"></span>-->
          <span v-else v-html="getField(item, scope.row.id)"></span>
        </template>
      </el-table-column>
    </el-table>
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
    <!--规则-->
    <fd-dialog
      title="规则"
      :syncVisible="ruleDialog"
      @beforeClose="ruleDialog = false"
    >
      <div slot="fd-body">
        <div class="dialog-formulaForm">
          <el-form ref="formulaRuleForm" :rules="rules" label-position="right" :model="formulaRuleForm" label-width="0" @submit.native.prevent>
            <el-form-item label="" prop="ruleType">
              <el-radio v-for="item of ruleTypes" v-model="formulaRuleForm.ruleType" :key = "item.id" :label="item.id">{{item.text}}</el-radio>
            </el-form-item>
            <el-form-item label="" prop="formula" v-show="formulaRuleForm.ruleType === 'k10030-02'">
              <el-input v-model="formulaRuleForm.formula"></el-input>
              <fd-formula-des-depart :des="dess" :example="[]" ></fd-formula-des-depart>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="fd-footer">
        <el-button  size="small" @click="ruleDialog = false">取消</el-button>
        <el-button  size="small" type="primary" @click = "saveRule">确定</el-button>
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
  import { isFloat } from '@/utils/validate'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  import FdFormulaDesDepart from '../components/formulaDesDepart'
  const validateFormula = function(rule, value, callback) {
    value = value || ''
    const left = value.match(/\(/g)
    const right = value.match(/\)/g)
    if (left && right && left.length !== right.length) {
      callback(new Error('()需要成对出现'))
    }
    if ((left && !right) || (!left && right)) {
      callback(new Error('()需要成对出现'))
    }
    const error = []
    const regs = [
      /部门指标值/g,
      /业务线指标值/g,
      /业务线指标均值/g,
      /全院指标值/g,
      /全院指标均值/g,
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
    name: 'regulationTableDepart',
    components: { FdFormulaDesDepart, fdDialog },
    props: {
      columns: {
        type: Array
      },
      data: {
        type: Array
      },
      id: {
        type: String,
        default: 'id'
      },
      isOpen: {
        type: Boolean,
        default: true
      },
      pid: {
        type: String,
        default: 'pid'
      },
      loading: {
        type: Boolean,
        default: false
      },
      height: {
        type: Number
      },
      getTargetMsg: {
        type: Boolean
      }
    },
    data() {
      const validateRuleFormula = (rule, value, callback) => {
        value = value || ''
        const left = value.match(/\(/g)
        const right = value.match(/\)/g)
        if (left && right && left.length !== right.length) {
          callback(new Error('()需要成对出现'))
        }
        if ((left && !right) || (!left && right)) {
          callback(new Error('()需要成对出现'))
        }
        const error = []
        const regs = [
          /IF/g,
          /AVERAGE/g,
          /AND/g,
          /OR/g,
          /\=/g,
          /\<\=/g,
          /\>\=/g,
          /[\+\-\*\/\(\)\,\<\>\s]/g
        ]
        // if (value.indexOf('、') > -1) {
        //   error.push(...value.match(/、/g))
        // }
        const shenhe = new Set(value.match(/#\{.*?\}/g))
        value = value.replace(/#\{.*?\}/g, '')
        const hefa = this.menus.map((item) => {
          if (item.menuType === '1') {
            return '#{' + item.menuName + '}'
          } else if (item.menuType === '0' && item.menuLevel > this.recentMenuLevel) {
            return '#{' + item.menuName + '}'
          }
        })
        shenhe.forEach((item, i) => {
          if (hefa.indexOf(item) < 0) {
            error.push(item)
          }
        })
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
      const requiredRuleFormula = (rule, value, callback) => {
        if (this.formulaRuleForm.ruleType === 'k10030-02') {
          if (!this.formulaRuleForm.formula) {
            callback(new Error('自定义规则不能为空'))
          } else {
            validateRuleFormula(rule, value, callback)
          }
        } else {
          callback()
        }
      }
      return {
        rules: {
          valueMin: [{ required: true, message: '请输入得分区间最小值', trigger: 'blur' }],
          valueMax: [{ required: true, message: '请输入得分区间最大值', trigger: 'blur' }],
          checkFormula: [{ validator: validateFormula, trigger: 'blur' }],
          indexSetupValue: [{ validator: validateFloat, trigger: 'blur' }],
          formula: [{ required: true, validator: requiredRuleFormula, trigger: 'blur' }]
        },
        des: `公式示例: 部门指标值>(全院指标均值*0.8)
      注意: 1、输入公式仅使用以下16种的半角符号才有效;
            2、输入公式可以输入任意数字值,范围在[-10000,10000]间,且小数点不超过4位;
            3、输入公式除数值和16种符号外仅可使用下列所示特殊中文指标值;
            4、点击下方对应指标值或符号后在公式输入框中粘贴(Ctrl+V)即可复制。`,
        dess: `公式示例: AVERAGE(<>0,#{指标名称1},#{指标名称2},#{指标名称3})+#{指标名称4}*0.8
      注意: 1、输入公式仅使用以下16种的半角符号才有效;
            2、输入公式可以输入任意数字值,范围在[-10000,10000]间,且小数点不超过4位;
            3、输入公式除数值和16种符号外仅可使用指标体系中的指标名称,如#{指标名称};
            4、点击下方对应指标值或符号后在公式输入框中粘贴(Ctrl+V)即可复制。`,
        children: {},
        dataMap: {},
        menus: [],
        tableData: [],
        root: [],
        formulaDialog: false,
        ruleDialog: false,
        sectionDialog: false,
        formulaList: [],
        formulaMap: {},
        defaultFormula: {},
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
        formulaRuleForm: {
          ruleType: 'k10030-01',
          formula: ''
        },
        ruleTypes: [{
          id: 'k10030-01',
          text: '求和'
        }, {
          id: 'k10030-02',
          text: '自定义规则'
        }],
        focusing: true,
        recentMenuLevel: 0
      }
    },
    computed: {},
    mounted() {
      this.initData(this.data)
      this.getFormulaList()
    },
    methods: {
      validateFormula,
      requiredFormula,
      validateFloat,
      getField(headItem, key) {
        let obj = {}
        obj = this.dataMap[key]
        if (headItem.field === 'indexType' && obj.menuType === '1') {
          return this.typesMap[obj.indexType] || headItem.default
        } else if (headItem.field === 'checkFormula' && obj.menuType === '1') {
          return '<div>[' + (this.fd.data.fixedFloat((obj.valueMin || 0), -9999.99, 9999.99, 2) + '-' +
            this.fd.data.fixedFloat((obj.valueMax === null ? 100 : obj.valueMax), -9999.99, 9999.99, 2) + ']' +
            ((obj.checkFormula) ? '或' : '') +
            ((obj.checkFormula) ? '<br><div class="py1" style="line-height: 15px">若：' + obj.checkFormula + '</div>' : '') + ((obj.indexSetupValue !== null && obj.indexSetupValue !== '' && obj.checkFormula) ? ('则：[' + this.fd.data.fixedFloat(obj.indexSetupValue, -9999.99, 9999.99, 2) + ']</div>') : '</div>'))
        } else if (headItem.field === 'process' && obj.menuType === '1') {
          return obj.flowName || headItem.default
        } else if (headItem.field === 'weight' && obj.menuType === '1') {
          return this.fd.data.fixedFloat(obj.weight, -9999.99, 9999.99, 2)
        } else if (headItem.field === 'rule' && obj.menuType === '0') {
          return obj.formula && obj.ruleType === 'k10030-02' ? obj.formula : '求和'
        } else if (headItem.field === 'formulas' && obj.menuType === '1') {
          return obj.formula
        } else {
          return obj[headItem.field] || headItem.default
        }
      },
      showSection(item) {
        this.sectionDialog = true
        this.$nextTick(() => {
          this.$refs.sectionForm.resetFields()
          this.showKey = item.id
          this.sectionForm.valueMax = item.valueMax
          this.sectionForm.valueMin = item.valueMin
          this.sectionForm.checkFormula = item.checkFormula
          this.sectionForm.indexSetupValue = item.indexSetupValue
        })
      },
      saveSection() {
        this.$refs.sectionForm.validate((valid) => {
          if (valid) {
            this.fd.tools.merge(true, this.dataMap[this.showKey], this.sectionForm)
            this.sectionDialog = false
          } else {
            return false
          }
        })
      },
      changeValue(obj, key, min = -9999.99, max = 9999.99) {
        let value = obj[key]
        value = value.replace(/[^\-\d\.]/g, '')
        value = this.fd.data.fixedFloat(value, min, max, 2)
        obj[key] = value
      },
      showFormula(item) {
        this.formulaDialog = true
        this.formulaMap = this.fd.tools.merge(true, {}, this.defaultFormula)
        this.formulaMap[item.formulaId].value = item.formula
        this.$nextTick(() => {
          this.$refs.formulaForm.resetFields()
          this.showKey = item.id
          this.formulaForm.formulaId = item.formulaId
          this.formulaForm.formula = item.formula
        })
      },
      showRule(item) {
        this.recentMenuLevel = item.menuLevel
        this.ruleDialog = true
        this.$nextTick(() => {
          this.$refs.formulaRuleForm.resetFields()
          this.showKey = item.id
          this.formulaRuleForm.formulaId = item.formulaId
          this.formulaRuleForm.ruleType = item.ruleType
          this.formulaRuleForm.formula = item.formula
        })
      },
      saveFormula() {
        this.$refs.formulaForm.validate((valid) => {
          if (valid) {
            this.fd.tools.merge(true, this.dataMap[this.showKey], this.formulaForm)
            this.formulaDialog = false
          } else {
            return false
          }
        })
      },
      saveRule() {
        this.$refs.formulaRuleForm.validate((valid) => {
          if (valid) {
            // if (this.formulaRuleForm.ruleType === 'k10030-01') {
            // this.formulaRuleForm.formula = ''
            // }
            this.fd.tools.merge(true, this.dataMap[this.showKey], this.formulaRuleForm)
            this.ruleDialog = false
          } else {
            return false
          }
        })
      },
      getFormulaName(item) {
        if (item.id === '8' && this.formulaMap[item.id].value === '自定义公式') {
          return '自定义公式'
        } else {
          return this.formulaMap[item.id].value
        }
      },
      formulaChange(id) {
        if (id === '8' && this.formulaMap[id].value === '自定义公式') {
          this.formulaForm.formula = ''
        } else {
          this.formulaForm.formula = this.formulaMap[id].value
        }
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
      initData(data) {
        this.menus = data
        this.dataMap = {}
        this.children = {}
        for (let i = 0; i < data.length; i++) {
          const pidVal = data[i][this.pid] || 'fd_root'
          this.$set(data[i], 'isOpen', this.isOpen)
          // 所有的节点都是可显示的
          this.$set(data[i], 'show', true)
          // 默认不选中
          this.$set(data[i], 'isSelect', false)
          // 保留每个节点的信息
          this.dataMap[data[i][this.id]] = data[i]
          // 相同父节点的放在一起
          this.children[pidVal] = this.children[pidVal] || []
          this.children[pidVal].push(data[i])
        }
        this.root = []
        // 获取所有的根节点
        for (const key in this.children) {
          if (!this.dataMap[key]) {
            this.root.push(...this.children[key])
          }
        }
        // 根节点默认显示
        for (const item of this.root) {
          this.$set(item, 'show', true)
        }
        this.tableData = []
        this.getTreeData(this.root, 1)
      },
      getTreeData(root, deep = 1) {
        root = root || []
        for (const item of root) {
          const id = item[this.id]
          if (item.show) { // 节点本身是否需要显示
            this.tableData.push({ id: id, deep: deep })
          }
          // 展开的节点需要获取子类
          if (item.isOpen) {
            this.getTreeData(this.children[id], deep + 1)
          }
        }
      },
      toggleSelect(data, item) {
        const id = data[this.id]
        if (this.dataMap[id]) {
          if (item.disabled && data[item.disabled]) {
            return false
          }
          const isSelected = this.dataMap[id].isSelect
          if (isSelected) {
            this.$set(this.dataMap[id], 'isSelect', false)
            this.toggleSelectChild(id, false)
            // this.toggleSelectParent(item[this.pid])
          } else {
            this.$set(this.dataMap[id], 'isSelect', 'full')
            this.toggleSelectChild(id, 'full')
            // this.toggleSelectParent(item[this.pid])
          }
          this.$emit('selectChange', id, !isSelected)
        }
      },
      toggleOpen(item) {
        const id = item[this.id]
        if (this.dataMap[id].isOpen) {
          this.$set(this.dataMap[id], 'isOpen', false)
          this.toggleOpenChild(this.children[id], false)
        } else {
          this.$set(this.dataMap[id], 'isOpen', true)
          this.toggleOpenChild(this.children[id], true)
        }
        this.tableData = []
        this.getTreeData(this.root, 1)
      },
      toggleOpenChild(data, open) {
        const id = this.id
        for (const item of data) {
          this.$set(this.dataMap[item[id]], 'show', open)
          // 是否还有子节点
          if (this.children[item[id]]) {
            // 展开
            if (open) {
              // 判断子节点原来的状态，如果是展开的话需要将他的子节点展开还原
              if (this.dataMap[item[id]].isOpen) {
                this.toggleOpenChild(this.children[item[id]], open)
              }
            } else { // 关闭的时候所有的子节点都需要隐藏
              this.toggleOpenChild(this.children[item[id]], open)
            }
          }
        }
      },
      toggleSelectChild(id, select) {
        const child = this.children[id] || []
        for (const item of child) {
          this.$set(this.dataMap[item[this.id]], 'isSelect', select)
          this.$emit('selectChange', item[this.id], select)
          this.toggleSelectChild(item[this.id], select)
        }
      },
      toggleSelectParent(pid) {
        const brother = this.children[pid] || []
        const parent = this.dataMap[pid]
        if (parent) {
          let fullCount = 0
          let helfCount = 0
          for (const item of brother) {
            if (item.isSelect === 'full') {
              fullCount++
            } else if (item.isSelect === 'helf') {
              helfCount++
            }
          }
          if (helfCount > 0 || fullCount > 0) {
            if (fullCount === brother.length) {
              this.$emit('selectChange', pid, true)
              this.$set(this.dataMap[pid], 'isSelect', 'full')
            } else {
              this.$emit('selectChange', pid, false)
              this.$set(this.dataMap[pid], 'isSelect', 'helf')
            }
          } else {
            this.$emit('selectChange', pid, false)
            this.$set(parent, 'isSelect', false)
          }
          this.toggleSelectParent(parent[this.pid])
        }
      },
      emitEvent(name, data) {
        this.$emit(name, { data, children: this.children[data.id] })
      },
      btnCount(operate, data) {
        let count = 0
        const shows = []
        const more = []
        for (const info of operate) {
          // 配置show属性的时候data的值为true的时候可以显示，没有配置show属性默认显示
          if ((info.show && data[info.show]) || info.show === undefined) {
            if (count < 2) {
              shows.push(info)
              count++
            } else {
              more.push(info)
            }
          }
        }
        if (more.length === 1) {
          shows.push(more.splice(0, 1)[0])
        }
        operate.buttons = shows
        operate.moreButtons = more
        return operate
      },
      cellClick(row, column, cell, event) {
        this.$emit('cellClick', row, column, cell, event)
      }
    },
    watch: {
      getTargetMsg() {
        this.$emit('refreshTargetMsg', this.dataMap)
      },
      dataMap: {
        handler(curVal, oldVal) {
          this.$emit('refreshTarget', curVal)
        },
        deep: true
      },
      data() {
        this.initData(this.data)
      }
    }
  }
</script>

<style lang="scss">
  .sectionForm .el-form-item__label{
    float: left;
  }
  .dialog-formulaForm .el-radio-group{
    font-size: 14px;
  }
  .tree-table{
    .el-button+.el-button{
      margin-left: 24px;
    }
    .at-expand{
      float: left;
      width: 25px;
      height: 20px;
    }
    .noselected{
      display: inline-block;
      width: 14px;
      height: 13px;
      border: 1px solid #dcdfe6;
      border-radius: 2px;
      cursor: pointer;
    }
    .noselected:hover {
      border-color: #409eff;
    }
    .disabled{
      display: inline-block;
      width: 14px;
      height: 13px;
      border: 1px solid #dcdfe6;
      background-color: #edf2fc;
      border-radius: 2px;
    }
    .more-line{
      margin-left:11px;
      padding-left: 11px;
      border-left: 1px solid #ebebeb;
      color:#409EFF;
      font-weight: 500;
    }
    .color-selected{
      color: #409eff;
      cursor: pointer;
    }
  }
</style>

