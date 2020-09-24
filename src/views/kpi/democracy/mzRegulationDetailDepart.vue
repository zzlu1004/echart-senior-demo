<template>
  <div class="app-container regulation-detail">
    <div class="container-inner has-fixed-bottom bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="bg-gray t-center p2">
        <span class="h18 bold color-title">{{regulation.name}}</span>
        <span :class="'bd status status-map-'+regulation.status">
          {{statusName[regulation.status]}}
        </span>
        <div class="f-right mr4">更新时间: {{regulation.updateTime|parseTime('{y}-{m}-{d}')}}</div>
      </div>
      <el-form class="py2"
               :model="regulation"
               label-position="top"
               size="small"
               ref="regulationForm">
        <el-form-item label="备注" prop="content">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 20 }"
            v-model="regulation.content"
            readonly
            placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="指标体系">
          <div>
            <mz-regulation-table-depart
              :loading="targetLoading"
              :columns="target.columns"
              :data="indexData"
            ></mz-regulation-table-depart>
          </div>
        </el-form-item>
        <el-form-item label="关联方案">
          <div>
            <fd-table
              className="p0"
              :loading="schemaLoading"
              :data='schemas'>
              <el-table-column
                type="index"
                width="60"
                label="序号">
              </el-table-column>
              <el-table-column
                prop="name"
                show-overflow-tooltip
                width="300"
                label="方案名称">
              </el-table-column>
              <el-table-column
                prop="statusId"
                width="120"
                label="状态">
                <template slot-scope="scope"  >
                  {{statusName[scope.row.statusId]}}
                </template>
              </el-table-column>
              <el-table-column
                prop="startTime"
                width="200"
                label="考核周期">
                <template slot-scope="scope">
                  {{scope.row.startTime}}至{{scope.row.endTime}}
            </template>
              </el-table-column>
              <el-table-column
                prop="departCount"
                width="120"
                align="right"
                label="考核部门数">
              </el-table-column>
              <el-table-column
                prop="departNames"
                class-name="regulation-over-visible"
                show-overflow-tooltip
                label="考核对象">
              </el-table-column>
            </fd-table>
            <div v-if="allSchemas.length > schemas.length" class="t-center color-link pointer p2" @click="showMore">更多...</div>
          </div>
        </el-form-item>
      </el-form>
      <div class="fixed-bottom">
        <div class="fixed-bottom-item" @click="goBack">
          <div class="fixed-bottom-item-text">返回</div>
        </div>
        <div class="fixed-bottom-item" v-show="elements.edit && regulation.status !== forbid && !this.schemaId" @click = "editRegulation({ id: id })">
          <div class="fixed-bottom-item-text">编辑</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mzRegulationTableDepart from '../components/mzRegulationTableDepart.vue'
  import {
    getRegulationMenus,
    getRegulationIndexs,
    getRegulationSchemas,
    getRegulationDetail,
    editRegulation
  } from '@/api/kpi/democracy/mzRegulation'
  import FdFormulaDes from '../components/formulaDes'
  import { statusName, statusColor } from '@/api/kpi/democracy/mzRegulation'
  import { goBack } from '@/api/common'
  import FdTable from 'fd/table/src/fdTable'
  export default {
    name: 'mzRegulationDetailDepart',
    components: { FdTable, mzRegulationTableDepart, FdFormulaDes },
    props: {},
    data() {
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
              showOverflowTooltip: true
            },
            {
              field: 'process',
              title: '指标流程',
              default: '',
              showOverflowTooltip: true
            },
            {
              field: 'weight',
              title: '自定义权重（%）',
              align: 'right',
              showOverflowTooltip: true
            },
            {
              field: 'formulas',
              title: '分数换算',
              showOverflowTooltip: true
            },
            {
              field: 'checkFormula',
              title: '得分区间',
              showOverflowTooltip: true
            }
          ]
        },
        regulation: {
          name: '',
          content: '',
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
        des: `公式示例: #{指标名称}*0.2 + #{指标名称}*0.4 + #{指标名称}*0.4
      注意: 1、输入公式仅使用以下16种的半角符号才有效;
            2、输入公式可以输入任意数字值,范围在[-10000,10000]间,且小数点不超过4位;
            3、输入公式除数值和16种符号外仅可使用指标体系中的指标名称,如#{指标名称};
            4、点击下方对应指标值或符号后在公式输入框中粘贴(Ctrl+V)即可复制。`,
        allSchemas: [],
        schemas: [],
        menus: [],
        indexData: [],
        targetMap: {},
        statusName,
        statusColor,
        forbid: 'active',
        targetLoading: false,
        schemaLoading: false
      }
    },
    computed: {
      id() {
        return this.$route.query.id
      },
      schemaId() {
        return this.$route.query.schemaId
      },
      elements() {
        return this.$store.getters.elements.mzRegulations || {}
      },
      type() {
        return this.$route.query.type
      }
    },
    mounted() {
      console.log('this.regulation2', this.regulation)
      console.log('this.schemaId', this.schemaId)
      console.log('this.forbid', this.forbid)
      console.log('this.elements.edit', this.elements.edit)
    },
    activated() {
      this.getRegulationDetail()
      this.getRegulationIndexs() // 获取指标体系列表内容
      this.getRegulationMenus()
      this.getRegulationSchemas()
    },
    methods: {
      goBack,
      editRegulation,
      getRegulationMenus,
      getRegulationIndexs,
      getRegulationSchemas,
      getRegulationDetail,
      showMore() {
        this.schemas = this.allSchemas.slice(0)
      },
      getDepartStats(row) {
        const back = []
        for (const item of row.departStats) {
          back.push(item.departName + '(' + item.staffCount + ')')
        }
        return back.join(' | ')
      }
    },
    watch: {
      indexData(d) {
        const data = this.fd.data.changeListKey(d, { indexId: 'menuId' })
        this.targetMap = this.fd.data.arrayToObj(data, 'menuId')
      },
      allSchemas(data) {
        this.schemas = data.slice(0, 5)
      }
    }
  }
</script>

<style scoped>
  .bd.status{
    border-radius: 25px;
    margin-left: 8px;
    padding: 4px 16px;
  }
</style>
<style>
  .regulation-detail .el-form-item__content table{
    line-height: 1;
  }
  .regulation-detail .el-checkbox{
    margin-left: 0;
    margin-right: 16px;
  }
  .default-check-box-height{
    margin-bottom: 0;
  }
  .regulation-over-visible .cell{
    overflow: visible;
  }
  .status-map-inactive{
    border-color: #ffcd3c;
    background-color: #fffaeb;
    color: #e09a00;
  }
  .status-map-active{
    background-color: #ebf8f2;
    border: solid 1px #00924b;
    color: #00924c;
  }
  .status-map-0{
    border-color: #ffcd3c;
    background-color: #fffaeb;
    color: #e09a00;
  }
  .status-map-1{
    background-color: #ebf8f2;
    border: solid 1px #00924b;
    color: #00924c;
  }
  .status-map-2{
    background-color: #edf6fd;
    border: solid 1px #177cc9;
    color: #177dc9;
  }
  .status-map-3{
    background-color: #fef0ef;
    border: solid 1px #F04134;
    color: #F04134;
  }
</style>
