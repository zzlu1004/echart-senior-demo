<template>
  <div class="app-container table-detail trialTeam">
    <div class="container-inner bg-white" :style="{'min-height': height - 100 + 'px'}">

      <div class="tab-box">
        <el-tabs v-model="teamType" type="card"  @tab-click="radioChangeCase">
          <el-tab-pane label="审判组织(案件)" name="case">
            <div v-show="teamType ==='case'">
              <div class="clearfix py2">
                <div class="f-left">
                  <span>案件结案时间：</span>
                  <span>
                    <el-date-picker
                      type="month"
                      value-format="yyyy-MM"
                      size="small"
                      placeholder="选择日期"
                      v-model="trialCaseTeam.startTime"
                      :clearable=false
                      class="mr1"></el-date-picker>
                    -
                    <el-date-picker
                      type="month"
                      value-format="yyyy-MM"
                      size="small"
                      placeholder="选择日期"
                      v-model="trialCaseTeam.endTime"
                      :clearable=false
                      class="ml1"
                    ></el-date-picker>
                    </span>
                  <el-button class="f-right ml3" size="small" type="primary" @click="getTrialCaseTeam">查询</el-button>
                </div>
                <div class="f-right">
                  <fd-search
                    v-if="teamType ==='case'"
                    @search="searchByKeyword"
                    v-model="trialCaseTeam.keyword"></fd-search>
                </div>
              </div>
              <div>
                <div>
                  <fd-table
                    :option="caseTeamOpt" @cellClick="gotoCaseCountPegging"
                    :sortChange="sortByNum" :sortable=true
                    :loading="caseLoading"
                  ></fd-table>
                </div>
                <fd-pagination
                  :limit="trialCaseTeam.limit"
                  :offset="trialCaseTeam.offset"
                  :currentChange="currentChange"
                  :sizeChange="sizeChange"
                  :pageArr="[10,20,30,40,50]"
                  :sizes=true
                  :total= "trialCaseTeam.total"
                ></fd-pagination>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="审判团队" name="team">
            <div v-show="teamType ==='team'">
              <div class="clearfix py2">
                <div class="f-left">
                  <div class="btn btn-primary btn-sm" @click="showAddTrialTeam">
                    新增
                </div>
                </div>
                <div class="f-right">
                  <fd-search
                    v-if="teamType ==='team'"
                    @search="searchByKeyword"
                    v-model="trialTeam.keyword"></fd-search>
                </div>
              </div>
              <div>
                <div>
                  <fd-table
                    :option="teamOpt"
                    :loading="teamLoading"
                  ></fd-table>
                </div>
                <fd-pagination
                  :limit="trialTeam.limit"
                  :offset="trialTeam.offset"
                  :currentChange="currentChange"
                  :sizeChange="sizeChange"
                  :sizes=true
                  :pageArr="[10,20,30,40,50]"
                  :total= "trialTeam.total"></fd-pagination>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <fd-dialog
        :title="modelTitle"
        :syncVisible="dialogVisible"
        @beforeClose="dialogVisible = false"
      >
        <div slot="fd-body">
          <el-row>
            <el-col :span="20">
              <el-form
                :rules="targetTypeRules"
                ref="trialTeamItem"
                :model="trialTeamItem"
                label-position="right"
                label-width="35%">
                <el-form-item label="部门" prop="departs">
                  <el-select v-model="trialTeamItem.departs" filterable multiple placeholder="请选择部门">
                    <el-option
                      v-for="item of departData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="分管领导" prop="leaders">
                  <el-select v-model="trialTeamItem.leaders" filterable multiple placeholder="请选择分管领导">
                    <el-option
                      v-for="item of staffData"
                      :key="item.staffId"
                      :label="item.staffName + '（' + item.departName + '）'"
                      :value="item.staffId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="团队负责人" prop="principals">
                  <el-select v-model="trialTeamItem.principals" filterable multiple placeholder="请选择团队负责人">
                    <el-option
                      v-for="item of staffData"
                      :key="item.staffId"
                      :label="item.staffName + '（' + item.departName + '）'"
                      :value="item.staffId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="团队名称" prop="name">
                  <el-input v-model="trialTeamItem.name" placeholder="请输入团队名称，不多于50个字"></el-input>
                </el-form-item>
                <el-form-item label="员额法官" prop="judges">
                  <el-select v-model="trialTeamItem.judges" filterable multiple placeholder="请选择员额法官">
                    <el-option
                      v-for="item of staffData"
                      :key="item.staffId"
                      :label="item.staffName + '（' + item.departName + '）'"
                      :value="item.staffId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="法官助理" prop="assistants">
                  <el-select v-model="trialTeamItem.assistants" filterable multiple placeholder="请选择法官助理">
                    <el-option
                      v-for="item of staffData"
                      :key="item.staffId"
                      :label="item.staffName + '（' + item.departName + '）'"
                      :value="item.staffId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="书记员" prop="clerks">
                  <el-select v-model="trialTeamItem.clerks" filterable multiple placeholder="请选择书记员">
                    <el-option
                      v-for="item of staffData"
                      :key="item.staffId"
                      :label="item.staffName + '（' + item.departName + '）'"
                      :value="item.staffId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="审理案件范围" prop="caseScope">
                  <el-input  v-model="trialTeamItem.caseScope" placeholder="请输入审理案件范围，不多于1000个字"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="4"></el-col>
          </el-row>
        </div>
        <div slot="fd-footer">
          <el-button size="small" @click="dialogVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="saveTrialTeam">确定</el-button>
        </div>
      </fd-dialog>
    </div>
  </div>
</template>
<script>
  import fdTable from 'fd/table'
  import FdPagination from 'fd/pagination/pagination'
  import { getActiveSchemas, resetForm, getDepartData } from '@/api/kpi/record'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  import { saveTrialTeam, deleteTrialTeam, getTrialTeams, currentChange,
    sizeChange, searchByKeyword, getAccessBizStaffs, showAddTrialTeam, showEditTrialTeam,
    getTrialCaseTeam, radioChangeCase, toLocaleDate, toStartDate, sortByNum, gotoCaseCountPegging } from '@/api/kpi/record/trialTeam'
  export default {
    name: 'trialTeam',
    components: {
      fdTable, FdPagination, fdDialog
    },
    methods: {
      saveTrialTeam, deleteTrialTeam, getTrialTeams, currentChange, sizeChange, searchByKeyword, getAccessBizStaffs, resetForm,
      showAddTrialTeam, showEditTrialTeam, getTrialCaseTeam, radioChangeCase, toLocaleDate, toStartDate, sortByNum, gotoCaseCountPegging, getActiveSchemas, getDepartData
    },
    mounted() {
      this.getDepartData()
      this.getAccessBizStaffs()
      this.radioChangeCase()
      this.getActiveSchemas()
    },
    data() {
      return {
        height: this.$store.getters.globals.height,
        teamType: 'case',
        hasActive: false,
        caseLoading: false,
        teamLoading: false,
        trialTeamItem: {
          name: null,
          id: null,
          judges: [],
          assistants: [],
          clerks: [],
          departs: [],
          leaders: [],
          principals: [],
          caseScope: null
        },
        staffData: [],
        departData: [],
        dialogVisible: false,
        targetTypeRules: {
          name: [
            { required: true, message: '请输入团队名称', trigger: 'blur' },
            { max: 50, message: '长度不超过50个字符', trigger: 'blur' }
          ],
          judges: [
            { required: true, message: '请选择员额法官', trigger: 'change' }
          ],
          caseScope: [
            { max: 1000, message: '长度不超过1000个字符', trigger: 'blur' }
          ]
        },
        caseTeamOpt: {
          stripe: true,
          border: true,
          data: [],
          columns: [{
            field: 'index',
            title: '序号',
            width: this.fd.tools.getStringWidth('序号')
          }, {
            field: 'departNames',
            title: '承办部门',
            minWidth: this.fd.tools.getStringWidth('承办部门')
          }, {
            field: 'collegiateBenchType',
            title: '合议庭类型',
            minWidth: this.fd.tools.getStringWidth('合议庭类型')
          }, {
            field: 'judgeNames',
            title: '合议庭',
            minWidth: this.fd.tools.getStringWidth('合议庭')
          }, {
            field: 'handlerNames',
            title: '承办人',
            minWidth: this.fd.tools.getStringWidth('承办人')
          }, {
            field: 'assistantNames',
            title: '法官助理',
            minWidth: this.fd.tools.getStringWidth('序号法官助理')
          }, {
            field: 'clerkNames',
            title: '书记员',
            minWidth: this.fd.tools.getStringWidth('书记员')
          }, {
            field: 'caseCount',
            title: '办案数量',
            align: 'right',
            sortable: 'custom',
            minWidth: this.fd.tools.getStringWidth('办案数量'),
            formatter: (row, value) => {
              const pegColor = this.elements.casePeg ? 'class="color-blue pointer"' : ''
              return '<span ' + pegColor + '>' + value + '</span>'
            }
          }]
        },
        teamOpt: {
          stripe: true,
          border: true,
          data: [],
          columns: [{
            field: 'departNames',
            title: '部门',
            width: this.fd.tools.getStringWidth('部门')
          }, {
            field: 'leaderNames',
            title: '分管领导',
            width: this.fd.tools.getStringWidth('分管领导')
          }, {
            field: 'principalNames',
            title: '团队负责人',
            width: this.fd.tools.getStringWidth('团队负责人')
          }, {
            field: 'name',
            title: '团队名称',
            minWidth: this.fd.tools.getStringWidth('团队名称')
          }, {
            field: 'staffCount',
            title: '成员数量',
            align: 'right',
            minWidth: this.fd.tools.getStringWidth('成员数量')
          }, {
            field: 'judgeNames',
            title: '员额法官',
            minWidth: this.fd.tools.getStringWidth('员额法官')
          }, {
            field: 'assistantNames',
            title: '法官助理',
            minWidth: this.fd.tools.getStringWidth('法官助理')
          }, {
            field: 'clerkNames',
            title: '书记员',
            minWidth: this.fd.tools.getStringWidth('书记员')
          }, {
            field: 'caseScope',
            title: '审理案件范围',
            minWidth: this.fd.tools.getStringWidth('审理案件范围')
          }, {
            field: 'id',
            title: '操作',
            width: this.fd.tools.getStringWidth('操作2'),
            number: [{ text: '编辑', type: 'text', click: (d, row) => { this.showEditTrialTeam(row) } },
              { text: '删除', type: 'text', click: (d, row) => { this.deleteTrialTeam(row) } }
            ]
          }]
        },
        trialCaseTeam: {
          offset: 0,
          limit: 10,
          total: 0,
          startTime: this.toStartDate(new Date(this.fd.tools.getNowTime())),
          endTime: this.toLocaleDate(new Date(this.fd.tools.getNowTime())),
          keyword: null,
          orderField: null,
          orderType: null
        },
        trialTeam: {
          offset: 0,
          limit: 10,
          total: 0,
          keyword: null
        },
        modelTitle: ''
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.trialTeam || {}
      }
    }
  }
</script>
<style lang="scss">
</style>
