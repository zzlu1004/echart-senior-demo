<template>
  <div class="app-container">
    <div class="container-inner bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <el-row>
        <el-col :span="5" class="bd-dashed-right pr2" :style="{'min-height': $store.getters.globals.height - 260 + 'px'}">
          <el-tree :data="roles"
                   :props="roleProps"
                   node-key="id"
                   ref="roleTree"
                   :default-checked-keys="defaultKeys"
                   :default-expand-all=true
                   :check-on-click-node=true
                   :expand-on-click-node=false
                   :highlight-current=true
                   :accordion="accordion"
                   @node-click="roleSelect">
          </el-tree>
        </el-col>
        <el-col :span="19" class="pl3">
          <div v-show="roleName==='部门领导'" class="px2 py1 mb2 border-primary" style="border: 1px solid #1b95e7;background-color: rgba(112,198,242,0.3)">
            如需添加或变更部门领导人员, 请点击
            <span @click="gotoDepart" class="color-link pointer">【部门管理】</span>
            进行相关操作
          </div>
          <div class="px2 py1 mb2 border-primary" style="border: 1px solid #1b95e7;background-color: rgba(112,198,242,0.3)" v-show="roleName==='部门正式干警'">
            如需变更部门正式干警人员, 请点击
            <span @click="gotoPersonal" class="color-link pointer">【人员管理】</span>
            进行修改
          </div>
          <div class="mb2 height-normal">
            <el-button-group size="small" v-show="roleName!=='部门领导' && roleName != '部门正式干警'">
              <el-button size="small" v-if="elements.delete" @click="batchDeletePerson">批量删除</el-button>
              <el-button size="small" v-if="elements.add" @click="addPerson"><i class="at icon-plus"/>添加人员</el-button>
            </el-button-group>
            <div class="f-right">
              <fd-search @search="searchByKeyword" v-model="keyword"></fd-search>
            </div>
          </div>
          <fd-table
            className="m0"
            emptyText="当前暂无人员，点击左上角添加人员"
            :highlightCurrentRow=true
            :loading="loading"
            :selectionChange="selectionChange"
            :data="persons">
            <el-table-column
              type="selection"
              width="60"
              :show-overflow-tooltip="true"
              >
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              width="180"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              prop="idCard"
              label="身份证号"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              prop="departName"
              label="部门"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              prop="typeName"
              label="人员类型"
              width="150"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              v-if="roleName===speRole"
              prop="departs"
              label="分管部门"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.departs|showArray('name')}}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="roleName===speRole && elements.edit"
              prop=""
              label="编辑">
              <template slot-scope="scope">
                <span class="pointer color-link" @click="showManage(scope.row)">分管配置</span>
              </template>
            </el-table-column>
          </fd-table>
          <fd-pagination
            :limit="limit"
            :offset="offset"
            :currentChange="currentChange"
            :sizeChange="sizeChange"
            :sizes=true
            :total= "total"
          ></fd-pagination>
        </el-col>
      </el-row>
    </div>
    <fd-dialog
      title="设置分管配置"
      :syncVisible="manageDialog"
      @beforeClose="manageDialog = false"
    >
      <div slot="fd-body">
        <el-row>
          <el-col :span="20">
            <el-form ref="manageForm"
                 :model="manageForm"
                 label-position="right"
                 label-width="35%">
              <el-form-item label="姓名" prop="name">
                <el-input disabled v-model="manageForm.name"></el-input>
              </el-form-item>
              <el-form-item label="身份证号" prop="idCard">
                <el-input disabled v-model="manageForm.idCard"></el-input>
              </el-form-item>
              <el-form-item label="部门" prop="departName">
                <el-input disabled v-model="manageForm.departName"></el-input>
              </el-form-item>
              <el-form-item label="人员类型" prop="typeName">
                <el-input disabled v-model="manageForm.typeName"></el-input>
              </el-form-item>
              <el-form-item label="分管部门" prop="departIds">
                <el-select v-model="departs"
                          multiple
                          filterable
                          clearable
                          placeholder="请选择">
                  <el-option
                    v-for="item in chargeDepart"
                    :key="item.id"
                    :disabled="item.roleId && selfDeparts.indexOf(item.id) < 0"
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
        <el-button size="small" @click="manageDialog = false">取消</el-button>
        <el-button size="small" type="primary" @click="saveManageMsg">确定</el-button>
      </div>
    </fd-dialog>
    <!--正常添加-->
    <fd-dialog
      title="添加人员"
      :syncVisible="addPersonDialog"
      @beforeClose="addPersonDialog = false"
    >
      <div slot="fd-body">
        <el-row>
          <el-col :span="20">
           <el-form ref="personForm"
                    :model="personForm"
                    label-position="right"
                    label-width="35%">
              <el-form-item
                label="姓名"
                prop="names"
                :rules="{
                  required: true, message: '姓名不能为空', trigger: 'blur'
                }">
                <el-select v-model="personForm.names"
                          multiple
                          filterable
                          clearable
                          placeholder="请选择">
                  <el-option
                    v-for="item of allPerson"
                    :key="item.id"
                    :label="(item.name+'/'+item.departName)"
                    :disabled="item.roleId !== null"
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
        <el-button size="small" @click="addPersonDialog = false">取消</el-button>
        <el-button size="small" type="primary" @click="saveAddPerson">确定</el-button>
      </div>
    </fd-dialog>
    <!--添加分管院领导-->
    <fd-dialog
      title="添加人员"
      :syncVisible="addChargeDialog"
      @beforeClose="addChargeDialog = false"
    >
      <div slot="fd-body">
        <el-row>
          <el-col :span="20">
            <el-form ref="chargeForm"
                    :model="personForm"
                    label-position="right"
                    label-width="35%">
              <el-form-item label="姓名"
                            prop="name"
                            :rules="{
                              required: true, message: '姓名不能为空', trigger: 'blur'
                            }"
              >
                <el-select v-model="personForm.name"
                          filterable
                          clearable
                          placeholder="请选择">
                  <el-option
                    v-for="item of allPerson"
                    :key="item.id"
                    :label="(item.name+'/'+item.departName)"
                    :disabled="item.roleId !== null"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="分管部门" prop="departs">
                <el-select v-model="departs"
                          multiple
                          filterable
                          clearable
                          placeholder="请选择">
                  <el-option
                    v-for="item in chargeDepart"
                    :key="item.id"
                    :disabled="item.roleId !== null"
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
        <el-button size="small" @click="addChargeDialog = false">取消</el-button>
        <el-button size="small" type="primary" @click="saveAddPerson">确定</el-button>
      </div>
    </fd-dialog>
  </div>
</template>

<script>
  import { getDepartData, getSelectIds, resetForm, gotoDepart, gotoPersonal, refreshPersons, getActiveSchemas } from '@/api/kpi/record'
  import {
    getRoles,
    roleSelect,
    getPersons,
    currentChange,
    sizeChange,
    batchDeletePerson,
    getRolePerson,
    selectionChange,
    addPerson,
    saveAddPerson,
    initTreeDepart,
    saveManageMsg,
    departNodeCheck,
    showManage,
    getChargeDepart,
    searchByKeyword
  } from '@/api/kpi/record/roles'
  import FdTable from 'fd/table/src/fdTable'
  import FdPagination from 'fd/pagination/pagination'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  export default {
    name: '',
    components: { FdTable, FdPagination, fdDialog },
    data() {
      return {
        offset: 0,
        limit: 10,
        total: 0,
        keyword: '',
        speRole: '分管院领导',
        loading: false,
        roles: [],
        roleProps: {
          children: 'children',
          label: (data) => {
            return data.label + '(' + (data.total || 0) + '人)'
          }
        },
        accordion: true,
        defaultKeys: [],
        roleId: '',
        roleName: '',
        departData: [],
        chargeDepart: [],
        persons: [],
        selectData: [],
        manageDialog: false,
        addPersonDialog: false,
        addChargeDialog: false,
        departs: [],
        selfDeparts: [],
        manageForm: {
          typeName: '',
          idCard: '',
          name: '',
          names: [],
          departName: '',
          roleId: '',
          staffId: ''
        },
        departsName: '',
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        showDepartTree: false,
        showDepartTree2: false,
        allPerson: [],
        hasActive: false,
        personForm: {
          name: '',
          names: []
        }
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.depart || {}
      }
    },
    mounted() {
      this.getDepartData()
      this.getRoles()
      this.getActiveSchemas()
    },
    methods: {
      resetForm,
      getRolePerson,
      getDepartData,
      gotoDepart,
      gotoPersonal,
      getSelectIds,
      getRoles,
      roleSelect,
      getActiveSchemas,
      getPersons,
      refreshPersons,
      currentChange,
      sizeChange,
      saveManageMsg,
      batchDeletePerson,
      departNodeCheck,
      selectionChange,
      initTreeDepart,
      saveAddPerson,
      addPerson,
      showManage,
      getChargeDepart,
      searchByKeyword
    },
    watch: {
    }
  }
</script>


