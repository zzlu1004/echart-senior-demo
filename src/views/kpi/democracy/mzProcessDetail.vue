<template>
  <div class="app-container">
    <div class="bg-white container-inner has-fixed-bottom clearfix" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <el-form :model="processForm" :rules="processRules" ref="processForm">
        <div v-if="page==='detail'" class="bg-gray center p2">
          <span class="bold h18 color-title pr2">{{processForm.name}}</span>
          <span v-show="processForm.active" class="inline-block label-box h14"
                :class="processForm.active === 'active'?'green-box' : 'yellow-box'"
          >{{statusMap[processForm.active]}}</span>
        </div>
        <el-form-item v-else label="流程名称" prop="name">
          <el-input v-model="processForm.name" placeholder="请输入流程名称，不多于50个字"></el-input>
        </el-form-item>
        <el-form-item class="hide" label="流程ID" prop="id">
          <el-input v-model="processForm.id"></el-input>
        </el-form-item>
        <el-form-item label="详情描述" prop="remarks">
          <el-input type="textarea"
                    v-model="processForm.remarks"
                    :readonly="page==='detail'"
                    placeholder="请输入即将创建的流程的详细信息，不多于1000个字"
          ></el-input>
        </el-form-item>
      </el-form>
      <div>
        <div class="same-color-form-__label py2">流程设置</div>
      </div>
      <div>
        <div>
          <el-form :model="setForm" :rules="setRules" label-position="right" ref="setForm" label-width="120px">
            <el-form-item label="测评人流程" prop="nodes">
              <div>
                <span
                  v-for="(item, index) of setForm.nodes"
                  :key="index"
                >
                  <span class="inline-block height-normal line-height-normal pl2 pr5 bd tag-box relative mb1" :class="page!=='detail'? 'pointer':''"
                        @click="editAuditor(item, index)">
                    <span class="checkers-index">{{index + 1}}</span>
                    <span v-if="item.staffType === 'k10018-01'">{{staffTypeMap[item.staffType] || '--'}}</span>
                    <span v-else-if="item.staffType === 'k10018-02'">{{higherLevelMap[item.higherLevel] || '--'}}</span>
                    <span v-if="item.staffType === 'k10018-05'">{{teamMap[item.teamType] || '--'}}</span>
                    <span v-else-if="item.staffType === 'k10018-03'||item.staffType === 'k10018-04'">{{item[staffTypeMap[item.staffType]]}}</span>
                    <i v-if="page!=='detail'" class="f-right at icon-closecircle color-placeholder absolute delete-btn"
                          @click.stop="deleteFlowPeople('nodes', index)"></i>
                  </span>
                  <span v-if="index!==setForm.nodes.length-1" class="px1">>></span>
                  <span v-else class="px1"></span>
                </span>
                <!-- 单流程，审核人少于1个才显示添加审核人按钮 -->
                <i v-show="setForm.nodes.length<1 && page!=='detail'" @click="addAuditor" class="at icon-pluscircleo color-blue h24 pointer"></i>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 页面底部操作按钮 -->
      <div class="fixed-bottom">
        <div v-if="page==='detail' || processForm.statusId==='1'" class="fixed-bottom-item" @click="goBack">
          <div class="fixed-bottom-item-text">返回</div>
        </div>
        <div class="fixed-bottom-item" v-if="page==='edit' || page === 'add'" @click="cancelOperate">
          <div class="fixed-bottom-item-text">取消</div>
        </div>
        <div class="fixed-bottom-item" v-if="page==='edit' || page === 'add'" @click="sureOperate('processForm')">
          <div class="fixed-bottom-item-text">确定</div>
        </div>
        <div class="fixed-bottom-item" v-if="processForm.statusId!=='1'&&page==='detail'" @click="page = 'edit'">
          <div class="fixed-bottom-item-text">编辑</div>
        </div>
      </div>
      <fd-dialog
        title="设置测评人"
        :syncVisible="processVisible"
        @beforeClose="processVisible = false"
      >
        <div slot="fd-body">
          <el-row>
            <el-col :span="20">
              <el-form :model="peopleForm" ref="peopleForm" label-position="right" :rules="peopleFormRules" label-width="35%">
                <el-form-item label="测评人类别" prop="staffType">
                  <el-select v-model="peopleForm.staffType" filterable placeholder="请选择类别">
                    <el-option
                      v-for="item of peopleType"
                      :key="item.id"
                      :label="item.text"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <!-- 当填报人或者审核人类别为直属领导时，显示直属领导的下拉框 -->
                <el-form-item v-show="peopleForm.staffType==='k10018-02'" label="直属领导" prop="higherLevel">
                  <el-select v-model="peopleForm.higherLevel" filterable placeholder="请选择直属领导">
                    <el-option
                      v-for="item of higherLevels"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <!-- 当填报人或者审核人类别为指定成员时，显示指定成员的下拉框 -->
                <el-form-item v-show="peopleForm.staffType==='k10018-03'" label="指定成员" prop="staffId">
                  <el-select v-model="peopleForm.staffId" filterable placeholder="请选择指定成员">
                    <el-option
                      v-for="item of allPerson"
                      :key="item.id"
                      :label="item.name + '（' + item.departName + '）'"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <!-- 当填报人或者审核人类别为指定角色时，显示指定角色的下拉框树级结构 -->
                <el-form-item v-show="peopleForm.staffType === 'k10018-04'" label="指定角色" prop="roleName">
                  <el-popover
                    ref="members"
                    placement="bottom-start"
                    v-model="personCompanyTree">
                    <el-tree :data="roles"
                             :props="departProps"
                             :accordion="accordion"
                             @node-click="roleSelect"></el-tree>
                  </el-popover>
                  <el-input
                    v-model="peopleForm.roleName"
                    readonly
                    placeholder="请选择指定角色"
                    v-popover:members>
                  </el-input>
                </el-form-item>
                <!-- 当填报人或者审核人类别为指定团队时，显示指定团队的下拉框 -->
                <el-form-item v-show="peopleForm.staffType==='k10018-05'" label="指定团队" prop="staffId">
                  <el-select v-model="peopleForm.teamType" filterable placeholder="请选择指定团队">
                    <el-option
                      v-for="item of teams"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="4"></el-col>
          </el-row>
        </div>
        <div slot="fd-footer">
          <el-button size="small" @click="processVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="sureSave('peopleForm')">确定</el-button>
        </div>
      </fd-dialog>
    </div>
  </div>
</template>

<script>
  import { goBack } from '@/api/common'
  import { resetForm } from '@/api/kpi/record'
  import { getFlowById, cancelOperate, sureOperate, roleSelect, editAuditor,
    addAuditor, sureSave, deleteFlowPeople, showBtn, departSelect, clearForm, getAllPerson,
    showApproveDes, showFillDes, getRoles } from '@/api/kpi/democracy/mzProcessDetail'
  // import { getRoles } from '@/api/kpi/record/roles'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  export default {
    name: 'processDetail',
    data() {
      const validateHigherLevel = (rule, value, callback) => {
        if (this.peopleForm.staffType === 'k10018-02' && this.peopleForm.higherLevel === '') {
          callback(new Error('请选择直属领导'))
        } else {
          callback()
        }
      }
      const validateStaffId = (rule, value, callback) => {
        if (this.peopleForm.staffType === 'k10018-03' && this.peopleForm.staffId === '') {
          callback(new Error('请选择指定成员'))
        } else {
          callback()
        }
      }
      const validateRoleName = (rule, value, callback) => {
        if (this.peopleForm.staffType === 'k10018-04' && this.peopleForm.roleName === '') {
          callback(new Error('请选择指定角色'))
        } else {
          callback()
        }
      }
      return {
        processVisible: false,
        visible: {},
        page: '',
        personMap: {},
        allPerson: [],
        editItem: {},
        editIndex: 0,
        departProps: {
          children: 'children',
          label: 'label'
        }, // 指定成员数据获取
        accordion: true,
        personCompanyTree: false,
        peopleType: [
          // { id: 'k10018-01', text: '考核对象本人' },
          { id: 'k10018-02', text: '直属领导' },
          { id: 'k10018-03', text: '指定成员' },
          { id: 'k10018-04', text: '指定角色' },
          { id: 'k10018-05', text: '指定团队' }
        ],
        approvals: [{
          id: 'k10029-01',
          text: `会签`
        }, {
          id: 'k10029-02',
          text: `或签`
        }],
        staffTypeMap: {
          'k10018-01': '考核对象本人',
          'k10018-02': '直属领导',
          'k10018-03': 'staffName',
          'k10018-04': 'roleName',
          'k10018-05': '指定团队'
        },
        statusMap: {
          'active': '已生效',
          'inactive': '未生效'
        },
        processForm: {
          remarks: '',
          id: '',
          name: '',
          status: '',
          type: 'personal'
        },
        processRules: {
          name: [
            { required: true, message: '请输入流程名称', trigger: 'blur' },
            { max: 50, message: '长度不超过50个字符', trigger: 'blur' }
          ],
          remarks: [
            { max: 1000, message: '长度不超过1000个字符', trigger: 'blur' }
          ]
        },
        peopleFormRules: {
          staffType: [
            { required: true, message: '请选择类别', trigger: 'change' }
          ],
          higherLevel: [{ required: true, validator: validateHigherLevel, trigger: 'change' }],
          staffId: [{ required: true, validator: validateStaffId, trigger: 'change' }],
          roleName: [{ required: true, validator: validateRoleName, trigger: 'change' }]
        },
        setForm: {
          nodes: []
        },
        setRules: {
          nodes: [
            { required: true, message: '请输入测评人流程', trigger: 'change' }
          ]
        },
        peopleForm: {
          staffType: '', // 指定角色
          roleName: '',
          roleId: '',
          staffId: '',
          higherLevel: 'k10028-01', // 直属领导等级
          approvalType: 'k10029-02',
          teamType: 'k10031-01' // 指定团队
        },
        flowId: '',
        roles: [],
        teamMap: this.fd.tools.mapSelects('k10031'), // 指定团队
        higherLevelMap: this.fd.tools.mapSelects('k10028'), // 直属等级
        fillShow: true,
        approveShow: false
      }
    },
    components: { fdDialog },
    methods: {
      getFlowById, cancelOperate, sureOperate, addAuditor, sureSave, resetForm,
      deleteFlowPeople, showBtn, departSelect, getAllPerson, getRoles, roleSelect, clearForm, editAuditor,
      goBack, showApproveDes, showFillDes
    },
    computed: {
      // 指定团队
      teams() {
        return this.$store.getters.selects['k10031'] || []
      },
      // 直属等级
      higherLevels() {
        return this.$store.getters.selects['k10028'] || []
      }
    },
    mounted() {
      this.page = this.$route.query.page || 'add'
      this.flowId = this.$route.query.id || ''
      if (this.flowId) {
        this.getFlowById(this.flowId)
      }
      this.getAllPerson()
      this.getRoles()
    }
  }
</script>

<style lang="scss" scoped>
  .tag-box{
    border-radius: 2px;
  }
  .tag-box:hover{
    border-color:#66b1ff;
  }
  .tag-box:hover .delete-btn{
    display:inline-block;
  }
  .tag-box .delete-btn{
    display:none;
  }
  .delete-btn{
    top:0;
    right:16px;
  }
  .label-box {
    padding: 4px 16px;
    border-radius: 100px;
  }
  .green-box{
    background-color: #ebf8f2;
    border: solid 1px #00924b;
    color: #00924c;
  }
  .yellow-box{
    border: solid 1px #ffcd3c;
    background-color: #fffaeb;
    color: #e09a00;
  }
  .same-color-form-__label{
    color: #404040;
    font-weight: 700;
  }
  .checkers-index{
    background-color: #d9d9d9;
    border-radius: 20px;
    text-align: center;
    line-height: 20px;
    height: 20px;
    width: 20px;
    color: #fff;
    margin-right: 4px;
    display: inline-block;
  }
  .tag-box:hover .checkers-index{
    background-color: #66b1ff;
    color: #fff;
  }
  .multiple-fill-form {
    .el-form--label-right .el-form-item__label:after {
      content: '';
    }
  }
</style>
