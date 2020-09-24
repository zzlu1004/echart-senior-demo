<template>
  <div>
    <div class="px2 mb2 height-normal line-height-normal">
      <span class="color-title h16 f-left bold">法律职务</span>
      <span class="f-right">
        <el-button size="small" v-if="elements.export" @click="downloadLawDuty">导出</el-button>
        <el-button size="small" v-if="elements.edit && edit" @click="addLawDuty">新增</el-button>
      </span>
    </div>
    <div class="h14 px2 relative">
      <fd-table :option="lawOption" :loading="loading"></fd-table>
      <div v-if="lawTotal>lawOption.data.length" class="center color-blue pointer py1" @click="getLawDuty">更多...</div>
    </div>
    <fd-dialog
      :title="modelTitle"
      :syncVisible="addPersonDutyDialog"
      @beforeClose="addPersonDutyDialog = false"
    >
      <div slot="fd-body">
        <el-row>
          <el-col :span="20">
            <el-form :model="lawForm"
                    :rules="lawFormRules"
                    ref="lawForm"
                    label-width="35%"
                    label-position="right">
              <el-form-item label="起始日期" prop="startDate">
                <el-date-picker
                  v-if="$store.getters.globals.isIE"
                  type="month"
                  value-format="yyyy-MM"
                  :editable=false
                  v-model="lawForm.startDate"
                  :picker-options="pickerOptionsStart"
                  @change="changeEndLaw"
                  style="width: 100%;"></el-date-picker>
                <el-date-picker
                  v-else
                  type="month"
                  value-format="yyyy-MM"
                  :editable=false
                  placeholder="选择日期"
                  v-model="lawForm.startDate"
                  :picker-options="pickerOptionsStart"
                  @change="changeEndLaw"
                  style="width: 100%;"></el-date-picker>
              </el-form-item>
              <el-form-item label="截止日期" prop="endDate">
                <el-date-picker
                  v-if="$store.getters.globals.isIE"
                  type="month"
                  :editable=false
                  value-format="yyyy-MM"
                  v-model="lawForm.endDate"
                  :picker-options="pickerOptionsEnd"
                  @change="changeStartLaw"
                  style="width: 100%;"></el-date-picker>
                <el-date-picker
                  v-else
                  type="month"
                  :editable=false
                  value-format="yyyy-MM"
                  placeholder="选择日期"
                  v-model="lawForm.endDate"
                  :picker-options="pickerOptionsEnd"
                  @change="changeStartLaw"
                  style="width: 100%;"></el-date-picker>
              </el-form-item>
              <el-form-item label="法律职务" prop="legalPositionId">
                <el-select v-model="lawForm.legalPositionId" placeholder="请选择">
                  <el-option
                    v-for="item in work"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
      </div>
      <div slot="fd-footer">
        <el-button size="small" @click="addPersonDutyDialog = false">取消</el-button>
        <el-button size="small" type="primary" @click="saveLawDuty">确定</el-button>
      </div>
    </fd-dialog>
  </div>
</template>

<script>
  import fdTable from 'fd/table'
  import { resetForm } from '@/api/kpi/record'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  import { changeEndLaw, changeStartLaw, getLawDuty, saveLawDuty, addLawDuty, editLawDuty, downloadLawDuty,
    deleteLawDuty } from '@/api/kpi/record/personalDetail'
  export default {
    name: 'FdPersonalDuty',
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
        lawTotal: 0,
        modelTitle: '设置法律职务变更',
        loading: false,
        addPersonDutyDialog: false,
        params: {
          limit: 3,
          offset: 0
        },
        pickerOptionsStart: {},
        pickerOptionsEnd: {},
        lawOption: {
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
              field: 'legalPositionId',
              title: '法律职务',
              formatter: (row, value) => {
                return this.fd.tools.mapSelects('k10009')[value]
              }
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
        lawForm: {
          startDate: '',
          endDate: '',
          legalPositionId: ''
        },
        lawFormRules: {
          legalPositionId: [{ required: true, message: '请选择法律职务', trigger: 'change' }],
          startDate: [{ required: true, message: '请选择起始日期', trigger: 'change' }],
          endDate: [{ required: true, message: '请选择截止日期', trigger: 'change' }]
        },
        // 法律职务
        workMap: this.fd.tools.mapSelects('k10009')
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.personal || {}
      },
      // 法律职务
      work() {
        return this.$store.getters.selects['k10009']
      }
    },
    mounted() {
      if (this.edit) {
        this.lawOption.columns.push({
          field: '',
          title: '操作',
          width: '150px',
          number: [{ text: '编辑', type: 'text', show: 'isedit', click: (d, row) => { this.editLawDuty(row) } },
            { text: '不可编辑', type: 'text', show: 'noedit', disabled: 'noedit' },
            { text: '删除', type: 'text', show: 'isedit', click: (d, row) => { this.deleteLawDuty(row) } }]
        })
      }
      this.getLawDuty()
    },
    methods: {
      resetForm,
      changeEndLaw,
      changeStartLaw,
      getLawDuty,
      editLawDuty,
      saveLawDuty,
      addLawDuty,
      downloadLawDuty,
      deleteLawDuty
    },
    watch: {}
  }
</script>

<style scoped>
</style>
