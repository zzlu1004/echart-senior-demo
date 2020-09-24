<template>
  <div>
    <div class="px2 mb2 height-normal line-height-normal">
      <span class="color-title h16 f-left bold">部门变更</span>
      <span class="f-right">
        <el-button size="small" v-if="elements.export" @click="downloadDepartChange">导出</el-button>
        <el-button size="small" v-if="elements.edit && edit" @click="addDepartChange">新增</el-button>
      </span>
    </div>
    <div class="h14 px2 relative">
      <fd-table :option="changeOption" :loading="loading"></fd-table>
      <div v-if="changeTotal>changeOption.data.length" class="center color-blue pointer py1" @click="getDepart">更多...</div>
    </div>
    <fd-dialog
      :title="modelTitle"
      :syncVisible="addPersonDepartDialog"
      @beforeClose="addPersonDepartDialog = false"
    >
      <div slot="fd-body">
        <el-row>
          <el-col :span="20">
            <el-form :model="changeForm"
                    :rules="changeFormRules"
                    ref="changeForm"
                    label-width="35%"
                    label-position="right">
              <el-form-item label="起始日期" prop="startDate">
                <el-date-picker
                  v-if="$store.getters.globals.isIE"
                  type="month"
                  value-format="yyyy-MM"
                  :editable=false
                  v-model="changeForm.startDate"
                  :picker-options="startDateDepartOpt"
                  @change="changeEndDepart"
                  style="width: 100%;"></el-date-picker>
                <el-date-picker
                  v-else
                  type="month"
                  value-format="yyyy-MM"
                  :editable=false
                  placeholder="选择日期"
                  v-model="changeForm.startDate"
                  :picker-options="startDateDepartOpt"
                  @change="changeEndDepart"
                  style="width: 100%;"></el-date-picker>
              </el-form-item>
              <el-form-item label="截止日期" prop="endDate">
                <el-date-picker
                  v-if="$store.getters.globals.isIE"
                  type="month"
                  value-format="yyyy-MM"
                  :editable=false
                  v-model="changeForm.endDate"
                  :picker-options="endDateDepartOpt"
                  @change="changeStartDepart"
                  style="width: 100%;"></el-date-picker>
                <el-date-picker
                  v-else
                  type="month"
                  value-format="yyyy-MM"
                  :editable=false
                  placeholder="选择日期"
                  v-model="changeForm.endDate"
                  :picker-options="endDateDepartOpt"
                  @change="changeStartDepart"
                  style="width: 100%;"></el-date-picker>
              </el-form-item>
              <el-form-item label="部门" prop="departName">
                <el-popover
                  ref="departPid2"
                  v-model="personDepartTree"
                  placement="bottom-start">
                  <div style="max-height: 20rem;" class="auto">
                    <el-tree :data="treeDepart" :props="defaultProps" :accordion="accordion" @node-click="departNodeClick"></el-tree>
                  </div>
                </el-popover>
                <el-input
                  v-model="changeForm.departName"
                  readonly
                  placeholder="请选择"
                  v-popover:departPid2>
                </el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
      </div>
      <div slot="fd-footer">
        <el-button size="small" @click="addPersonDepartDialog = false">取消</el-button>
        <el-button size="small" type="primary" @click="saveDepart">确定</el-button>
      </div>
    </fd-dialog>
  </div>
</template>

<script>
  import fdTable from 'fd/table'
  import { resetForm, getDepartData } from '@/api/kpi/record'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  import { changeEndDepart, changeStartDepart, departNodeClick, deleteDepart,
    getDepart, saveDepart, addDepartChange, editDepart, downloadDepartChange } from '@/api/kpi/record/personalDetail'
  export default {
    name: 'FdPersonalDepart',
    components: {
      fdTable, fdDialog
    },
    props: {
      showMsg: {
        type: Object,
        default: () => {
          return {
            name: '',
            idCard: '',
            sexId: '',
            nationId: '',
            companyName: '',
            departName: '',
            typeId: '',
            isAccess: '',
            resourceId: '',
            legalPositionId: '',
            chairId: '',
            levelId: '',
            judgeLevelId: '',
            addressShort: '',
            degreeId: '',
            startWorkDate: '',
            partyDate: '',
            companyDate: '',
            leaveDate: ''
          }
        }
      },
      edit: {
        type: Boolean,
        default: true
      },
      hasActive: {
        type: Boolean,
        default: true
      },
      userInfo: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        changeTotal: 0,
        modelTitle: '设置部门变更',
        loading: false,
        addPersonDepartDialog: false,
        params: {
          limit: 3,
          offset: 0
        },
        startDateDepartOpt: {},
        endDateDepartOpt: {},
        changeOption: {
          stripe: true,
          data: [],
          border: true,
          columns: [
            {
              field: 'index',
              width: '55px',
              title: '序号'
            },
            {
              field: 'departName',
              title: '部门'
            },
            {
              field: 'startDate',
              title: '起始日期',
              formatter: (row, value) => {
                const val = value || '--'
                return val
              }
            },
            {
              field: 'endDate',
              title: '截止日期',
              formatter: (row, value) => {
                const val = value || '至今'
                return val
              }
            }
          ]
        },
        changeForm: {
          startDate: '',
          endDate: '',
          departName: ''
        },
        personDepartTree: false,
        changeFormRules: {
          departName: [{ required: true, message: '请选择部门', trigger: 'change' }],
          startDate: [{ required: true, message: '请选择起始日期', trigger: 'change' }],
          endDate: [{ required: true, message: '请选择截止日期', trigger: 'change' }]
        },
        // 树结构存储的部门信息
        accordion: true,
        treeDepart: [],
        departData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.personal || {}
      }
    },
    mounted() {
      if (this.edit) {
        this.changeOption.columns.push({
          field: '',
          title: '操作',
          width: '150px',
          number: [{ text: '编辑', type: 'text', show: 'isedit', click: (d, row) => { this.editDepart(row) } },
            { text: '删除', type: 'text', show: 'isedit', click: (d, row) => { this.deleteDepart(row) } },
            { text: '不可编辑', type: 'text', show: 'noedit', disabled: 'noedit' }]
        })
      }
      this.getDepart()
      this.getDepartData()
    },
    methods: {
      resetForm,
      getDepartData,
      changeEndDepart,
      changeStartDepart,
      departNodeClick,
      getDepart,
      saveDepart,
      addDepartChange,
      editDepart,
      downloadDepartChange,
      deleteDepart
    },
    watch: {
      departData(data) {
        this.treeDepart = this.fd.data.changeToTree(data, 'id', 'pid')
      }
    }
  }
</script>

<style scoped>
</style>
