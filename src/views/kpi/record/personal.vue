<template>
  <div class="app-container">
    <div v-show="!checking">
      <div class="container-inner bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
        <div class="relative">
          <div class="absolute bd-dashed-right left-0 top-0"
               style="width: 250px;overflow: hidden;">
            <div style="width: 272px;overflow-x: hidden;overflow-y: scroll;" :style="{'height': $store.getters.globals.height - 160 + 'px'}">
              <el-tree :data="members"
                       :props="departProps"
                       :default-expand-all=true
                       :check-on-click-node=true
                       :expand-on-click-node=false
                       :highlight-current=true
                       :accordion="accordion"
                       @node-click="departSelect">
              </el-tree>
            </div>
          </div>
          <div class="pl3" style="margin-left: 250px">
            <div class="height-normal">
              <el-row>
                <el-col :span="17">
                  <vue-upload
                    class="hide"
                    :disabled="hasActive"
                    ref="upload"
                    v-model="fileList"
                    :post-action="actionPath"
                    :headers="headers"
                    @input-file="inputFile"
                    @input-filter="inputFilter"
                  >
                  </vue-upload>
                  <div class="btn btn-default fd-btn-group btn-sm" v-show="elements.export" @click="downloadExcel">全部导出</div>
                  <div class="btn btn-default fd-btn-group btn-sm" v-show="elements.import" @click="beforeUpload">
                    <!-- <el-upload
                      ref="upload"
                      class="avatar-uploader"
                      :action="actionPath"
                      :show-file-list=false
                      :headers="headers"
                      :on-progress="onProgress"
                      :disabled="hasActive"
                      :on-success="uploadSuccess"
                      :multiple=false>
                      <div>
                        批量导入
                        <el-popover
                        placement="bottom-start"
                        trigger="hover">
                          <div class="p2 line-height-4 h14" style="width:450px;">
                            <div class="h16">新建人员信息</div>
                            <div class="color-subTitle">
                              <span>1.请下载人员信息模板，批量填写人员信息</span>
                              <span class="f-right pointer color-link" @click="downloadExcelTemplate">模板下载</span>
                            </div>
                            <div class="color-subTitle"><span>2.再点击【批量导入】上传填写好的人员信息表</span></div>
                            <div class="h16 mt1">修改人员信息</div>
                            <div class="color-subTitle">
                              <span>1.请点击【全部导出】，导出所有人员信息表，在Excel表格中批量修改</span>
                            </div>
                            <div class="color-subTitle"><span>2.再点击【批量导入】上传修改好的人员信息表</span></div>
                          </div>
                          <i slot="reference" class="at icon-questioncircle color-d9d9d9 pointer"/>
                        </el-popover>
                      </div>
                    </el-upload> -->
                    批量导入
                    <el-popover
                    placement="bottom-start"
                    trigger="hover">
                    <div class="p2 line-height-4 h14" style="width:450px;">
                      <div class="h16">新建人员信息</div>
                      <div class="color-subTitle">
                        <span>1.请下载人员信息模板，批量填写人员信息</span>
                        <span class="f-right pointer color-link" @click="downloadExcelTemplate">模板下载</span>
                      </div>
                      <div class="color-subTitle"><span>2.再点击【批量导入】上传填写好的人员信息表</span></div>
                      <div class="h16 mt1">修改人员信息</div>
                      <div class="color-subTitle">
                        <span>1.请点击【全部导出】，导出所有人员信息表，在Excel表格中批量修改</span>
                      </div>
                      <div class="color-subTitle"><span>2.再点击【批量导入】上传修改好的人员信息表</span></div>
                    </div>
                    <i slot="reference" class="at icon-questioncircle color-d9d9d9 pointer"/>
                  </el-popover>
                  </div>
                  <div class="btn btn-default fd-btn-group btn-sm" v-show="elements.changeDepart" @click="changeDepart">调整部门</div>
                  <div class="btn btn-default fd-btn-group btn-sm" v-show="elements.delete" @click="batchDeletePerson">批量删除</div>
                  <div class="btn btn-default fd-btn-group btn-sm" v-show="elements.add" @click="addPerson"><i class="at icon-plus"/>添加人员</div>
                  <span>{{" "}}</span>
                </el-col>
                <el-col :span="7">
                  <div class="f-right full" style="max-width: 300px;">
                    <fd-search @search="searchByKeyword" v-model="keyword" className="fd-search"></fd-search>
                  </div>
                </el-col>
              </el-row>
            </div>
            <fd-table
              className="mt2"
              emptyText="当前暂无人员，点击左上角添加人员"
              :highlightCurrentRow=true
              :selectionChange="selectionChange"
              :rowClick="rowClick"
              :loading="tableLoading"
              :data="persons">
              <el-table-column
                type="selection"
                :selectable=enableSelect
                width="60">
              </el-table-column>
              <el-table-column
                prop="name"
                show-overflow-tooltip
                label="姓名">
                <template slot-scope="scope">
                  <div class="pointer color-link">{{scope.row.name}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="source"
                show-overflow-tooltip
                label="数据来源">
                <template slot-scope="scope">
                  {{scope.row.source === 'system' ? '系统内' : '系统外'}}
                </template>
              </el-table-column>
              <el-table-column
                prop="id"
                show-overflow-tooltip
                label="ID">
              </el-table-column>
              <el-table-column
                prop="departName"
                show-overflow-tooltip
                label="部门">
              </el-table-column>
              <el-table-column
                prop="typeId"
                show-overflow-tooltip
                label="人员类型">
                <template slot-scope="scope">
                  <span>{{typeMap[scope.row.typeId]}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="isAccess"
                show-overflow-tooltip
                label="参与考核">
                <template slot-scope="scope">
                  <span>{{checkMap[scope.row.isAccess]}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="legalPositionId"
                show-overflow-tooltip
                label="法律职务">
                <template slot-scope="scope">
                  <span>{{workMap[scope.row.legalPositionId]}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="chairId"
                show-overflow-tooltip
                label="部门正副职">
                <template slot-scope="scope">
                  <span>{{chairMap[scope.row.chairId]}}</span>
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
          </div>
        </div>
      </div>
    </div>
    <fd-dialog
      title="设置部门信息"
      :syncVisible="changeDepartDialog"
      @beforeClose="changeDepartDialog = false"
    >
      <div slot="fd-body">
        <el-row>
          <el-col :span="20">
            <el-form class="px2"
                    :rules="rules"
                    ref="departForm"
                    :model="departForm"
                    label-position="right"
                    label-width="35%">
              <el-form-item label="调整至" prop="departName">
                <el-popover
                  ref="departPid"
                  placement="bottom-start"
                  v-model="showDepartTree">
                  <div style="max-height: 20rem;" class="auto">
                    <el-tree :data="treeDepart" :props="defaultProps" :accordion="accordion" @node-click="departNodeClick"></el-tree>
                  </div>
                </el-popover>
                <el-input
                  v-model="departForm.departName"
                  readonly
                  placeholder="请选择部门"
                  v-popover:departPid>
                </el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
      </div>
      <div slot="fd-footer">
        <el-button size="small" @click="changeDepartDialog = false">取消</el-button>
        <el-button size="small" type="primary" @click="saveChangeDepart">确定</el-button>
      </div>
    </fd-dialog>
    <fd-dialog
      title="设置基本信息"
      :syncVisible="addPersonDialog"
      @beforeClose="addPersonDialog = false"
    >
      <div slot="fd-body">
        <el-form :rules="rules"
                 ref="personForm"
                 :model="personForm"
                 label-position="right"
                 label-width="100px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="personForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="人员类型" prop="typeId">
                <el-select v-model="personForm.typeId" placeholder="请选择">
                  <el-option
                    v-for="item in types"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="参与考核" prop="isAccess">
                <el-select v-model="personForm.isAccess" placeholder="请选择">
                  <el-option
                    v-for="item in check"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="单位" prop="companyName">
                <el-popover
                  ref="companyId"
                  placement="bottom-start"
                  v-model="personCompanyTree">
                  <div style="max-height: 20rem;" class="auto">
                    <el-tree :data="departs" :props="companyProps" :accordion="accordion" @node-click="companyNodeClick"></el-tree>
                  </div>
                </el-popover>
                <el-input
                  v-model="personForm.companyName"
                  readonly
                  placeholder="请选择"
                  v-popover:companyId>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="部门" prop="departName">
                <el-popover
                  ref="departPid"
                  placement="bottom-start"
                  v-model="personDepartTree">
                  <div style="max-height: 20rem;" class="auto">
                    <el-tree :data="treeDepart" :props="defaultProps" :accordion="accordion" @node-click="personNodeClick"></el-tree>
                  </div>
                </el-popover>
                <el-input
                  v-model="personForm.departName"
                  readonly
                  placeholder="请选择"
                  v-popover:departPid>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="正式干警" prop="officialPolice">
                <el-select v-model="personForm.officialPolice" placeholder="请选择">
                  <el-option
                    v-for="item in officialPoliceCheck"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="部门正副职" prop="chairId">
                <el-select v-model="personForm.chairId" clearable placeholder="请选择">
                  <el-option
                    v-for="item in chair"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="身份证号" prop="idCard">
                <el-input v-model="personForm.idCard"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别" prop="sexId">
                <el-select v-model="personForm.sexId" placeholder="请选择">
                  <el-option
                    v-for="item in sex"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="籍贯" prop="addressShort">
                <el-input v-model="personForm.addressShort"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="民族" prop="nationId">
                <el-input v-model="personForm.nationId"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="学历" prop="degreeId">
                <el-input v-model="personForm.degreeId"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="法律职务" prop="legalPositionId">
                <el-select v-model="personForm.legalPositionId" placeholder="请选择">
                  <el-option
                    v-for="item in work"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="职级" prop="levelId">
                <el-input v-model="personForm.levelId"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="进入途径" prop="resourceId">
                <el-select v-model="personForm.resourceId" placeholder="请选择">
                  <el-option
                    v-for="item in resource"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="fd-footer">
        <el-button size="small" @click="addPersonDialog = false">取消</el-button>
        <el-button size="small" type="primary" @click="savePersonMsg">确定</el-button>
      </div>
    </fd-dialog>
  </div>
</template>

<script>
  import vueUpload from 'vue-upload-component'
  import FdTable from 'fd/table/src/fdTable'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  import { getDepartData, resetForm, getPersons, refreshPersons, getSelectIds, getActiveSchemas } from '@/api/kpi/record'
  import {
    departSelect,
    getDepartMembers,
    selectionChange,
    changeDepart,
    saveChangeDepart,
    departNodeClick,
    rowClick,
    currentChange,
    sizeChange,
    batchDeletePerson,
    uploadSuccess,
    beforeUpload,
    onProgress,
    downloadExcel,
    showResult,
    addPerson,
    companyNodeClick,
    downloadExcelTemplate,
    personNodeClick,
    savePersonMsg,
    inputFile,
    inputFilter,
    searchByKeyword
  } from '@/api/kpi/record/personal'
  import FdPagination from 'fd/pagination/pagination'
  import { isIDCard } from '@/utils/validate'
  export default {
    name: 'personal',
    components: { FdPagination, FdTable, vueUpload, fdDialog },
    data() {
      return {
        fileList: [],
        offset: 0,
        limit: 10,
        total: 0,
        keyword: '',
        checking: false,
        loading: null,
        departId: '',
        headers: { 'Authorization': this.$store.getters.token },
        // 人员列表
        persons: [],
        // 列表中选中的数据
        selectData: [],
        // 部门结构
        departData: [],
        // 树结构存储的部门信息
        treeDepart: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        companyProps: {
          children: 'children',
          label: 'label'
        },
        // 左侧树成员数量信息
        members: [],
        // 左侧树显示的配置
        departProps: {
          children: 'children',
          label: (data) => {
            return data.label + '(' + (data.total || 0) + '人)'
          }
        },
        accordion: true,
        tableLoading: false,
        changeDepartDialog: false,
        personCompanyTree: false,
        showDepartTree: false,
        departForm: {
          departId: '',
          departName: ''
        },
        addPersonDialog: false,
        personForm: {
          'name': '',
          'idCard': '',
          'companyId': '',
          'companyName': '',
          'departId': '',
          'departName': '',
          'typeId': '',
          'isAccess': '',
          'resourceId': '',
          'legalPositionId': '',
          'chairId': '',
          'levelId': '',
          judgeLevelId: '',
          'addressShort': '',
          'sexId': '',
          'nationId': '',
          'degreeId': '',
          'startWorkDate': '',
          'partyDate': '',
          'companyDate': '',
          'leaveDate': '',
          'comments': '',
          'officialPolice': ''
        },
        hasActive: false,
        personDepartTree: false,
        rules: {
          departName: [{ required: true, message: '请选择部门', trigger: 'change' }],
          name: [{ required: true, message: '请输入姓名', trigger: 'blur' },
            { max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          idCard: [{ validator: (rule, value, callback) => {
            if (this.isIDCard(value) || value === '') {
              callback()
            } else {
              callback(new Error('请输入合法的身份证号'))
            }
          }, trigger: 'blur' }],
          levelId: [{ max: 20, message: '长度不超过20个字符', trigger: 'blur' }],
          nationId: [{ max: 20, message: '长度不超过20个字符', trigger: 'blur' }],
          degreeId: [{ max: 20, message: '长度不超过20个字符', trigger: 'blur' }],
          addressShort: [{ max: 20, message: '长度不超过20个字符', trigger: 'blur' }],
          companyName: [{ required: true, message: '请选择单位', trigger: 'change' }],
          typeId: [{ required: true, message: '请选择人员类型', trigger: 'change' }],
          isAccess: [{ required: true, message: '请选择是否参与考核', trigger: 'change' }]
        },
        // 性别
        sexMap: this.fd.tools.mapSelects('k10012'),
        // 人员类型
        typeMap: this.fd.tools.mapSelects('k10003'),
        // 考核
        checkMap: this.fd.tools.mapSelects('k10004'),
        // 进入途径
        resourceMap: this.fd.tools.mapSelects('k10005'),
        // 法律职务
        workMap: this.fd.tools.mapSelects('k10009'),
        // 部门正副职
        chairMap: this.fd.tools.mapSelects('k10010'),
        // 正式干警
        officialPoliceMap: this.fd.tools.mapSelects('k10038')
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.personal || {}
      },
      actionPath() {
        return process.env.BASE_API + window.config.project_url + 'api/staff/importExcel?Authorization=' +
          this.$store.getters.token
      },
      // 性别
      sex() {
        return this.$store.getters.selects['k10012']
      },
      // 人员类别
      types() {
        return this.$store.getters.selects['k10003']
      },
      // 参与考核
      check() {
        return this.$store.getters.selects['k10004']
      },
      // 进入途径
      resource() {
        return this.$store.getters.selects['k10005']
      },
      // 法律职务
      work() {
        return this.$store.getters.selects['k10009']
      },
      // 民族
      nation() {
        return this.$store.getters.selects['1001']
      },
      // 职级
      // level() {
      //   return this.$store.getters.selects['职级']
      // },
      // 等级
      judgeLevel() {
        return this.$store.getters.selects['k10011']
      },
      departs() {
        return this.fd.data.changeToTree(this.$store.getters.allCourt, 'id', 'parentId')
      },
      // 部门正副职
      chair() {
        return this.$store.getters.selects['k10010']
      },
      // 正式干警
      officialPoliceCheck() {
        return this.$store.getters.selects['k10038']
      }
    },
    mounted() {
      this.getDepartData()
      this.getDepartMembers()
      this.getActiveSchemas()
    },
    activated() {
      this.getPersons()
    },
    methods: {
      isIDCard,
      getSelectIds,
      departSelect,
      getActiveSchemas,
      addPerson,
      selectionChange,
      getDepartMembers,
      getPersons,
      getDepartData,
      changeDepart,
      saveChangeDepart,
      departNodeClick,
      showResult,
      rowClick,
      resetForm,
      currentChange,
      sizeChange,
      batchDeletePerson,
      beforeUpload,
      downloadExcel,
      uploadSuccess,
      refreshPersons,
      downloadExcelTemplate,
      personNodeClick,
      companyNodeClick,
      savePersonMsg,
      onProgress,
      inputFile,
      inputFilter,
      searchByKeyword,
      enableSelect(row) {
        return row.source === 'system'
      }
    },
    watch: {
      departData(data) {
        this.treeDepart = this.fd.data.changeToTree(data, 'id', 'pid')
      }
    }
  }
</script>

<style lang="scss">
  .fd-btn-group{
    margin-left: -1px;
    float: left;
    border-radius: 0;
  }
  .file-uploads.file-uploads-html4 {
    display: inline-block;
    position: relative;
    width: 115px;
    height: 40px;
  }
  .file-uploads.file-uploads-html4 input, .file-uploads.file-uploads-html5 label {
    /* background fix ie  click */
    background: #fff;
    opacity: 0;
    font-size: 20em;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>

