<template>
  <div class='app-container'>
    <div class="container-inner has-fixed-bottom bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <el-form class="px2"
               :rules="rules"
               :model="regulation"
               label-position="top"
               size="small"
               ref="regulationForm">
        <el-form-item label="细则名称" prop="name">
          <el-input v-model="regulation.name" placeholder="请输入细则名称,不多于50个字"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="content">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 20 }"
            v-model="regulation.content"
            placeholder="请输入细则的备注信息,不多于1000个字"></el-input>
        </el-form-item>
        <el-form-item label="指标体系"
                      prop="indexDat"
                      :rules="{required: true, validator: validateMenus, trigger: 'blur'}">
          <div @click="setTargetType" class="btn btn-sm btn-primary f-right" style="margin-top: -36px">设置指标类别</div>
          <div class="mt2">
            <mz-regulation-table-depart
              :columns="target.columns"
              :data="indexData"
              :type="type"
              v-bind:targetMap="targetMap"
              v-bind:getTargetMsg="getTargetMsg"
              v-on:refreshTargetMsg="refreshTargetMsg"
              v-on:refreshTarget="refreshTarget"
              :edit="edit"
            ></mz-regulation-table-depart>
          </div>
        </el-form-item>
      </el-form>
      <div class="fixed-bottom">
        <div class="fixed-bottom-item" @click="goBack">
          <div class="fixed-bottom-item-text">返回</div>
        </div>
        <div class="fixed-bottom-item" v-if="!id" @click="saveRegulation">
          <div class="fixed-bottom-item-text">确定</div>
        </div>
        <div class="fixed-bottom-item" v-else-if="id" @click="saveRegulation">
          <div class="fixed-bottom-item-text">保存修改</div>
        </div>
      </div>
    </div>
    <fd-dialog
      title="指标体系"
      :syncVisible="targetSystem"
      @beforeClose="beforeClose"
      maxHeight="450px"
      width="970px"
    >
      <div slot="fd-body">
        <div>
          <div class="height-normal line-height-normal mb1">
            <el-row>
              <el-col :span="11">
                创建指标类别
              </el-col>
              <el-col :span="13">
                <div class="pl2">
                  指标库
                  <el-popover
                    placement="bottom-start"
                    width="310"
                    trigger="hover"
                    content="点击指标,可以拖动到左侧各个分类下面。">
                    <i slot="reference" class="at icon-questioncircle color-d9d9d9 pointer"></i>
                  </el-popover>
                </div>
              </el-col>
            </el-row>
          </div>
          <fd-mz-target-depart  ref="target"
                         v-if="type === 'depart'"
                         :type="type"
                      v-bind:menus="indexData"
                      v-bind:getMenus="getMenus"
                      v-on:refreshMenus="refreshMenus"></fd-mz-target-depart>
        </div>
      </div>
      <div slot="fd-footer">
        <el-button size="small" @click="cancelTargetSystem">取消</el-button>
        <el-button size="small" type="primary" @click="saveTargetSystem">确定</el-button>
      </div>
    </fd-dialog>
  </div>
</template>

<script>
  import mzRegulationTableDepart from '../components/mzRegulationTableDepart.vue'
  import FdMzTargetDepart from '../components/FdMzTargetDepart.vue'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  import FdFormulaDes from '../components/formulaDes'
  import { goBack } from '@/api/common'
  import {
    saveTargetSystem,
    setTargetType,
    saveRegulation,
    goRegulation,
    refreshTargetMsg,
    refreshTarget
  } from '@/api/kpi/democracy/addMzRegulation'
  import {
    // getRegulationMenus,
    getRegulationIndexs,
    getRegulationDetail
  } from '@/api/kpi/democracy/mzRegulation'
  export default {
    name: 'addMzRegulationDepart',
    components: { FdMzTargetDepart, mzRegulationTableDepart, FdFormulaDes, fdDialog },
    props: {},
    data() {
      const validateFormula = (rule, value, callback) => {
        value = value || ''
        const left = value.match(/\(/g)
        const right = value.match(/\)/g)
        if (left && right && left.length !== right.length) {
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
        if (value.indexOf('、') > -1) {
          error.push(...value.match(/、/g))
        }
        const shenhe = new Set(value.match(/#\{.*?\}/g))
        value = value.replace(/#\{.*?\}/g, '')
        const hefa = this.indexData.map((item) => {
          if (item.menuType === '1') {
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
      const requiredFormula = (rule, value, callback) => {
        if (this.regulation.ruleType === 'k10030-02') {
          if (value === '') {
            callback(new Error('自定义规则不能为空'))
          } else {
            validateFormula(rule, value, callback)
          }
        } else {
          callback()
        }
      }
      return {
        target: {
          columns: [
            {
              field: 'menuName',
              title: '指标类别',
              expand: true
            },
            {
              field: 'rule',
              title: '规则',
              getSum: true,
              showOverflowTooltip: true
            },
            {
              field: 'process',
              title: '指标流程',
              default: '',
              selected: true,
              showOverflowTooltip: true
            },
            {
              field: 'weight',
              title: '自定义权重（%）',
              align: 'right',
              changed: true,
              showOverflowTooltip: true
            },
            {
              field: 'formulas',
              title: '分数换算',
              getScore: true,
              showOverflowTooltip: true
            },
            {
              field: 'checkFormula',
              title: '得分区间',
              changed: true,
              showOverflowTooltip: true
            }
          ]
        },
        // 保存新增细则的基本信息
        regulation: {
          name: '',
          content: ''
        },
        /* ruleTypes: [{
          id: 'k10030-01',
          text: '求和'
        }, {
          id: 'k10030-02',
          text: '自定义规则'
        }],
        des: `公式示例: AVERAGE(<>0,#{指标名称1},#{指标名称2},#{指标名称3})+#{指标名称4}*0.8
      注意: 1、输入公式仅使用以下16种的半角符号才有效;
            2、输入公式可以输入任意数字值,范围在[-10000,10000]间,且小数点不超过4位;
            3、输入公式除数值和16种符号外仅可使用指标体系中的指标名称,如#{指标名称};
            4、点击下方对应指标值或符号后在公式输入框中粘贴(Ctrl+V)即可复制。`,*/
        // 新增指标指标体系必须有值
        validateMenus: (rule, value, callback) => {
          if (this.indexData.length === 0) {
            callback(new Error('请添加指标体系'))
          }
          callback()
        },
        // 新增指标体系中目录结构
        menus: [],
        // 细则配置的指标信息
        indexData: [],
        // 获取最新的目录
        getMenus: true,
        getTargetMsg: true,
        targetMap: {},
        rules: {
          name: [{ required: true, message: '细则名称', trigger: 'blur' },
            { max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          content: [{ max: 1000, message: '长度不超过1000个字符', trigger: 'blur' }],
          formula: [{ required: true, validator: requiredFormula, trigger: 'blur' }]
        },
        targetSystem: false,
        edit: true
      }
    },
    computed: {
      id() {
        return this.$route.query.id
      },
      type() {
        return this.$route.query.type
      }
    },
    mounted() {
      if (this.id) {
        this.getRegulationDetail()
        // this.getRegulationMenus()
        this.getRegulationIndexs()
      }
    },
    methods: {
      goBack,
      goRegulation,
      getRegulationDetail,
      // getRegulationMenus,
      getRegulationIndexs,
      saveTargetSystem,
      setTargetType,
      saveRegulation,
      refreshTargetMsg,
      refreshTarget,
      refreshMenus(list) {
        this.targetSystem = false
        // 获取到指标体系数据，需清空indexDat的校验
        this.$refs['regulationForm'].clearValidate(['indexDat'])
        this.indexData = [...list]
      },
      cancelTargetSystem() {
        this.targetSystem = false
        if (this.id) {
          // this.getRegulationMenus()
          this.$refs.target.getTargetList()
        }
      },
      beforeClose() {
        this.targetSystem = false
        if (this.id) {
          // this.getRegulationMenus()
          this.$refs.target.getTargetList()
        }
      }
    },
    watch: {
      menus(data) {
      },
      indexData(d) {
        const data = this.fd.data.changeListKey(d, { indexId: 'menuId' })
        this.targetMap = this.fd.data.arrayToObj(data, 'menuId')
      }
    }
  }
</script>

<style scoped>
</style>

