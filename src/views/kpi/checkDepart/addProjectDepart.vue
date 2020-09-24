<template>
  <div class="app-container add-project">
    <div class="container-inner has-fixed-bottom bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <el-form :rules="rules"
               :model="projectForm"
               label-position="top"
               size="small"
               ref="projectForm">
        <el-form-item label="方案名称" prop="name">
          <el-row>
            <el-col :span="18">
              <el-input v-model="projectForm.name" placeholder="请输入方案名称,不多于50个字"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-row>
          <el-col :span="12" v-if="$store.getters.globals.isIE">
            <el-form-item label="考评周期"
                          :rules="{required: true, validator: requiredTimeRange, trigger: 'blur'}"
                          prop="startTime">
              <el-date-picker
                type="date"
                value-format="yyyy-MM-dd"
                v-model="projectForm.startTime"
                :clearable=false
                class="mr1"></el-date-picker>
                -
                <el-date-picker
                type="date"
                class="ml1"
                value-format="yyyy-MM-dd"
                v-model="projectForm.endTime"
                :clearable=false></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-else>
            <el-form-item label="考评周期"
                          :rules="{required: true, validator: requiredTimeRange, trigger: 'blur'}"
                          prop="startTime">
              <el-date-picker
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                v-model="projectForm.startTime"
                :clearable=false
                class="mr1"></el-date-picker>
                -
                <el-date-picker
                type="date"
                class="ml1"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                v-model="projectForm.endTime"
                :clearable=false></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="$store.getters.globals.isIE">
            <el-form-item label="上报截止时间" prop="deadlineTime">
              <el-date-picker
                v-model="projectForm.deadlineTime"
                type="date"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-else>
            <el-form-item label="上报截止时间" prop="deadlineTime">
              <el-date-picker
                v-model="projectForm.deadlineTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="content">
          <el-input
            type="textarea"
            v-model="projectForm.content"
            placeholder="请输入方案的备注信息,不多于1000个字"></el-input>
        </el-form-item>
        <el-form-item label="关联系数" prop="weightId">
          <div class="width-300px">
            <el-select v-model="projectForm.weightId"
                       filterable
                       placeholder="请选择关联系数">
              <el-option
                v-for="item in weight"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="关联细则" prop="blocks">
          <div>
            <el-row>
              <el-col :span="12">
                <el-radio-group v-model="blockId">
                  <el-radio-button
                    v-for="(item, index) of blocksName"
                    v-if="elements[item.id]"
                    :key="index"
                    :label="item.id"><span>{{item.name + "(" + blocks[index].data.length + ")"}}</span></el-radio-button>
                </el-radio-group>
              </el-col>
              <el-col :span="12">
                <el-button type="primary" class="f-right" @click="addRegulation"><i class="at icon-plus"/>新增细则</el-button>
              </el-col>
            </el-row>
            <div v-if="item.id === blockId"
                 v-for="item of blocks"
                 :key="item.id">
              <fd-table
                className="mt2"
                emptyText=""
                v-bind:data="item.data">
                <el-table-column
                  type="index"
                  label="序号"
                  width="60">
                </el-table-column>
                <el-table-column
                  prop="blockName"
                  show-overflow-tooltip
                  width="300"
                  label="细则名称">
                  <template slot-scope="scope">
                    <span class="pointer color-link-hover" @click="goRegulationDetail(scope.row)">{{regMap[scope.row.blockId]?regMap[scope.row.blockId].name:scope.row.blockName}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="departs"
                  label="考核部门数"
                  width="150">
                  <template slot-scope="scope">
                    {{scope.row.departs.length}}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="departs"
                  class-name="pb-custom"
                  show-overflow-tooltip
                  :formatter="getDepartStats"
                  label="考核对象">
                </el-table-column>
                <el-table-column
                  prop=""
                  width="150"
                  label="操作">
                  <template slot-scope="scope">
                    <span @click="editRegulation(scope.row, scope)" class="color-link pointer mr1">编辑</span>
                    <span @click="deleteRegulation(scope.row)" class="color-link pointer">删除</span>
                  </template>
                </el-table-column>
              </fd-table>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div class="fixed-bottom">
        <div class="fixed-bottom-item" @click="goBack">
          <div class="fixed-bottom-item-text">取消</div>
        </div>
        <div class="fixed-bottom-item" v-if="!id" @click = "saveProject">
          <div class="fixed-bottom-item-text">确定</div>
        </div>
        <div class="fixed-bottom-item" v-else-if="id" @click = "saveProject">
          <div class="fixed-bottom-item-text">保存修改</div>
        </div>
      </div>
    </div>
    <fd-dialog
      :title="projectTitle"
      :syncVisible="projectDialog"
      @beforeClose="projectDialog = false"
      maxHeight="480px"
    >
      <div slot="fd-body" class="px2">
        <el-form
          :rules="regRules"
          label-position="right"
          :model="regForm"
          label-width="100px"
          ref="regulationForm">
          <el-form-item label="考核细则" prop="blockId">
            <el-select v-model="regForm.blockId" filterable placeholder="请选择考核细则">
              <el-option
                v-for="item in showRegulation(blockId === 'k10015-04'?regulationsMz:regulations)"
                :key="item.id"
                :disabled="(item.hasJudgeIndex === 1 || item.hasPeopleIndex === 1) && blockId !== 'k10015-01'"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="clearfix mb2 mt4">
          <div class="f-left height-normal line-height-normal">
            <span>已选{{regForm.departs.length}}个</span>
          </div>
          <div class="f-right">
            <div class="f-left  height-normal line-height-normal">
              <el-checkbox-group v-model="regForm.departTypes">
                <el-checkbox
                v-for="item of departTypes"
                :key="item.id"
                :label="item.id">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="f-right">
            <fd-search  @search="getDeparts"
                            className=""
                            v-model="departName"></fd-search>
            </div>
          </div>
        </div>
          <div class="auto" style="max-height: 250px">
            <fd-new-card v-for="item in staffDeparts"
                         class="mb2" :key="item.id"
                         :data="item"
                         v-on:selectAll="selectStaff"
                         v-on:unselectAll="unselectStaff"
                         :options="options">
              <div slot='body'>
<el-checkbox-group v-model="regForm.departs">
              <el-checkbox
                v-for="item of departs"
                :key="item.id"
                v-if="showDepart(item)"
                :disabled=!isSelectAble(item)
                :label="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
              </div>
            </fd-new-card>
          </div>
      </div>
      <div slot="fd-footer">
        <el-button size="small" @click="projectDialog = false">取消</el-button>
        <el-button size="small" type="primary" @click="saveRegulation">确定</el-button>
      </div>
    </fd-dialog>
  </div>
</template>

<script>
  import {
    getProjectDetail,
    saveProject,
    addRegulation,
    editRegulation,
    deleteRegulation,
    saveRegulation,
    getRegulationList,
    getDeparts,
    selectStaff,
    unselectStaff,
    isSelectAble,
    showDepart,
    getSelectStaff,
    goRegulationDetail,
    showRegulation,
    saveRegAlone,
    getStaff,
    combineReg,
    getCoefficientList
  } from '@/api/kpi/checkDepart/projectDepart'
  import { goBack, resetForm } from '@/api/common'
  import FdNewCard from 'fd/newCard/FdCard'
  import FdTable from 'fd/table/src/fdTable'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  const requiredTimeRange = function(rule, value, callback) {
    if (!this.projectForm.endTime && !this.projectForm.startTime) {
      callback(new Error('考评周期不能为空'))
    }
    if (!this.projectForm.endTime || !this.projectForm.startTime) {
      callback(new Error('考评周期不完整'))
    }
    if (new Date(this.projectForm.startTime) > new Date(this.projectForm.endTime)) {
      callback(new Error('考评周期开始时间不能大于结束时间'))
    }
    callback()
  }
  export default {
    name: 'addProjectDepart',
    components: { FdTable, FdNewCard, fdDialog },
    props: {},
    data() {
      return {
        editIndex: -1,
        projectForm: {
          name: '',
          startTime: '',
          endTime: '',
          deadlineTime: '',
          content: '',
          weightId: '',
          blocks: []
        },
        schemaId: '',
        departName: '',
        blockId: 'k10015-01',
        // 新建细则前临时保留的细则信息
        blocks: [{
          id: 'k10015-01',
          data: []
        }, {
          id: 'k10015-02',
          data: []
        }, {
          id: 'k10015-03',
          data: []
        }, {
          id: 'k10015-04',
          data: []
        }],
        blocksMap: {},
        // 新增方案校验规则
        rules: {
          name: [{ required: true, message: '请输入方案名称', trigger: 'blur' },
            { max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          weightId: [{ required: true, message: '请选择关联系数', trigger: 'blur' },
            { max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          content: [{ max: 1000, message: '长度不超过1000个字符', trigger: 'blur' }],
          deadlineTime: [{ required: true, message: '请选择上报截止日期', trigger: 'blur' }],
          blocks: [{ required: true, message: '请新增细则', trigger: 'blur' }]
        },
        // 新增细则弹框校验规则
        regRules: {
          blockId: [{ required: true, message: '请选择细则', trigger: 'change' }]
        },
        // 获取权重的接口保存的数据
        weight: [],
        weightMap: {},
        projectDialog: false,
        projectTitle: '新增细则',
        // 所有细则
        regulationsMz: [],
        regulations: [],
        reg: {},
        regDe: {},
        // 所有细则的映射关系
        regMap: {},
        // 新增细则弹框保留的数据
        regForm: {
          id: '',
          blockId: '',
          blockName: '',
          schemaBlockType: '',
          departTypes: [],
          departs: []
        },
        departs: [],
        exception: [],
        // 通过
        // staffType: {},
        // staffChair: {},
        departMap: {},
        options: {
          header: {
            left: [{
              type: 'collapse'
            }, {
              type: 'text',
              field: 'name'
            }],
            right: [{
              type: 'button',
              child: [{
                text: '全选',
                event: 'selectAll'
              }, {
                text: '取消选中',
                event: 'unselectAll'
              }]
            }]
          },
          body: {},
          border: true,
          eventNames: ['selectAll', 'unselectAll']
        },
        staffDeparts: [
          { name: '部门' }
        ]
      }
    },
    computed: {
      id() {
        return this.$route.query.id
      },
      departTypes() {
        const types = this.$store.getters.selects['k10027'] || []
        const d = []
        types.forEach((i, idx) => {
          if (i.id !== 'k10027-99') {
            d.push(i)
          }
        })
        return d
      },
      // 细则类型
      blocksName() {
        const data = this.$store.getters.selects['k10015'] || []
        const back = []
        data.forEach((d, i) => {
          if (this.blocks[i]) {
            back.push(d)
          }
        })
        return back
      },
      // 方案详情按钮权限
      elements() {
        return this.$store.getters.elements.projectDetailDepart || {}
      }
    },
    mounted() {
      // 如果没有给这个用户配置综合绩效 审判绩效
      if (this.elements['k10015-01']) {
        this.blockId = 'k10015-01'
      } else if (this.elements['k10015-02']) {
        this.blockId = 'k10015-02'
      } else if (this.elements['k10015-03']) {
        this.blockId = 'k10015-03'
      } else if (this.elements['k10015-04']) {
        this.blockId = 'k10015-04'
      }
      this.blocksName.forEach((d, i) => {
        this.blocks[i].id = d.id
        this.blocksMap[d.id] = i
      })
    },
    activated() {
      this.getCoefficientList()
      // 获取细则，成功后获取人员信息，成功后获取方案详情
      this.getRegulationList()
    },
    methods: {
      requiredTimeRange,
      getProjectDetail,
      saveProject,
      goBack,
      addRegulation,
      editRegulation,
      deleteRegulation,
      saveRegulation,
      getRegulationList,
      getDeparts,
      selectStaff,
      unselectStaff,
      isSelectAble,
      showDepart,
      saveRegAlone,
      getSelectStaff,
      goRegulationDetail,
      resetForm,
      showRegulation,
      getStaff,
      combineReg,
      getCoefficientList,
      getDepartStats(row) {
        const data = row.departs
        const back = []
        for (const item of data) {
          if (this.departMap[item]) {
            back.push(this.departMap[item].name)
          }
        }
        return back.join(' | ')
      }
    },
    watch: {}
  }
</script>

<style>
  .add-project .el-form-item__content table{
    line-height: 1;
  }
  .add-project .el-checkbox{
    margin-left: 0;
    margin-right: 16px;
  }
  .default-check-box-height{
    margin-bottom: 0;
  }
</style>
