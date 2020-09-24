<template>
  <div class="app-container checkProject">
    <div class="container-inner bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="search">
        <el-row>
          <el-col :span="12">
            <el-button-group>
              <!-- 隐藏按钮，用于点击导入，触发该按钮的click事件importSelfTarget -->
              <div class="btn btn-default fd-btn-group" v-show=false>
                <vue-upload
                  class="pointer"
                  ref="upload"
                  v-model="fileList"
                  :post-action="actionPath"
                  :headers="headers"
                  @input-file="inputFile"
                  @input-filter="inputFilter"
                >
                  <span class="inline-block blue-btn px1">添加附件</span>
                </vue-upload>
              </div>
              <el-button type="primary" size="small" icon="el-icon-plus" @click="showEditDialog">添加</el-button>
              <el-button type="primary" size="small" icon="el-icon-delete" @click="deleteUser()">删除</el-button>
              <el-button type="primary" size="small" icon="el-icon-upload" @click="importUsers">导入</el-button>
              <el-button type="primary" size="small" icon="el-icon-download" @click="downloadUser">导出</el-button>
            </el-button-group>
          </el-col>
          <el-col :span="12">
            <div class="f-right">
              <fd-search @search="refreshUSer" v-model="userOrLoginName"></fd-search>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="mt2">
        <el-row>
          <el-col :span="24">
            <fd-table :data="userData" :border=true :selectionChange="handleSelect">
              <el-table-column type="selection" width="50">
              </el-table-column>
              <el-table-column prop="userName" label="姓名" width="150">
                <template slot-scope="scope">
                  <span class="color-link pointer" @click="showUser(scope.row)">{{scope.row.userName}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="loginName" label="登录名">
              </el-table-column>
              <el-table-column prop="companyName" label="法院" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="departName" label="部门" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="roles"
                               label="角色"
                               show-overflow-tooltip
                               width="300">
                <template slot-scope="scope">
                  <span>{{scope.row.roles|showArray("name")}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="userMobile" label="手机号">
              </el-table-column>
              <el-table-column label="操作"
                               width="180">
                <template slot-scope="scope">
                  <el-button @click="editUser(scope.row)" type="text">编辑</el-button>
                  <el-button @click="resetPassword(scope.row)" type="text">重置密码</el-button>
                </template>
              </el-table-column>
            </fd-table>
          </el-col>
        </el-row>
      </div>
      <fd-pagination :limit="limit"
                     :offset="offset"
                     :currentChange="currentChange"
                     :sizeChange="sizeChange"
                     :sizes=true
                     :total= "total"></fd-pagination>
      <fd-dialog
        :title="userTitle"
        :syncVisible="editDialog"
        @beforeClose="editDialog = false"
      >
        <div slot="fd-body">
          <el-row>
            <el-col :span="20">
              <el-form :model="user" label-width="35%" label-position="right" :rules="userRules" ref='editForm'>
                <el-form-item label="用户名" prop="userName">
                  <el-input v-model="user.userName" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="账号" prop="loginName">
                  <el-input v-model="user.loginName" placeholder="请输入登录名"></el-input>
                </el-form-item>
                <el-form-item label="法院" prop="companyName">
                  <el-popover
                    ref="courtPid"
                    placement="bottom-start"
                    v-model="showDepartTree">
                    <div v-show="userTitle !== '查看用户'" style="max-height: 20rem;" class="auto">
                      <el-tree
                        style="max-height:300px;overflow-y: auto;"
                        :data="companys"
                        :props="defaultProps"
                        :accordion="accordion"
                        highlight-current
                        ref="treeDepart"
                        @node-click="courtNodeClick"></el-tree>
                    </div>
                  </el-popover>
                  <el-input v-model="user.companyName" readonly placeholder="请选择法院" v-popover:courtPid></el-input>
                </el-form-item>
                <el-form-item label="部门" prop="departName">
                  <el-popover
                    ref="popover"
                    placement="bottom-start"
                    v-model="showDepart">
                    <div v-show="userTitle !== '查看用户'" style="max-height: 20rem;" class="auto">
                      <el-tree
                        :data="departs"
                        :props="defaultProps"
                        :accordion="accordion"
                        @node-click="handleNodeClick"
                        highlight-current
                        ref="treeDepart"
                      ></el-tree>
                    </div>
                  </el-popover>
                  <el-input v-model="user.departName" readonly placeholder="请选择部门" v-popover:popover></el-input>
                </el-form-item>
                <el-form-item label="人员类型" prop="typeId">
                  <el-select
                    v-model="user.typeId"
                    size="small"
                    filterable
                    clearablet
                    placeholder="请选择">
                    <el-option
                      v-for="item in types"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="部门正副职" prop="chairId">
                  <el-select
                    v-model="user.chairId"
                    placeholder="请选择"
                    size="small"
                    filterable
                    clearable
                  >
                    <el-option
                      v-for="item in chair"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="手机号" prop="userMobile">
                  <el-input v-model="user.userMobile" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="userEmail">
                  <el-input v-model="user.userEmail" placeholder="请输入邮箱"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="4"></el-col>
          </el-row>
        </div>
        <div v-show="userTitle !== '查看用户'" slot="fd-footer">
          <el-button size="small" @click="editDialog = false">取消</el-button>
          <el-button size="small" type="primary" @click="saveUser">确定</el-button>
        </div>
      </fd-dialog>
      <fd-dialog
        :title="title"
        :syncVisible="infoDialog"
        @beforeClose="infoDialog = false"
      >
        <div slot="fd-body">
          <div>
            <fd-table
              className="m0"
              v-bind:data="list">
              <el-table-column
                prop="userName"
                width="100"
                label="姓名">
              </el-table-column>
              <el-table-column
                prop="loginName"
                width="200"
                label="登录名">
              </el-table-column>
              <el-table-column
                prop="errorMsg"
                label="错误类型">
              </el-table-column>
              <el-table-column
                prop="rowNum"
                width="100"
                label="错误位置">
                <template slot-scope="scope">
                  <span>{{scope.row.rowNum}}行</span>
                </template>
              </el-table-column>
            </fd-table>
            <fd-pagination
              :limit="limitInfo"
              :offset="offsetInfo"
              :currentChange="currentChangeInfo"
              :sizeChange="sizeChangeInfo"
              :sizes=true
              :total= "totalInfo"
            ></fd-pagination>
          </div>
        </div>
        <div slot="fd-footer">
          <el-button size="small" @click="infoDetailOff">关闭</el-button>
        </div>
      </fd-dialog>
    </div>
  </div>
</template>


<script>
  import vueUpload from 'vue-upload-component'
  import FdTable from 'fd/table/src/fdTable'
  import FdPagination from 'fd/pagination/pagination'
  import { getCourt } from '@/api/common'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  export default {
    name: '',
    components: { FdTable, vueUpload, FdPagination, fdDialog },
    data() {
      return {
        title: '',
        list: [],
        failList: [],
        showDepartTree: false,
        total: 0,
        totalInfo: 0,
        fileList: [], // 导入文件列表
        headers: { 'Authorization': this.$store.getters.token }, // 导入的请求头部
        chooseCount: 0,
        chooses: [],
        height: window.innerHeight - 60 + 'px',
        limit: 10,
        limitInfo: 10,
        offset: 0,
        offsetInfo: 0,
        userData: [],
        infoDetail: [],
        editDialog: false,
        infoDialog: false,
        loading: false,
        userOrLoginName: '',
        userTitle: '新增用户',
        departs: [], // 部门选择树
        accordion: true,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        user: {
          userName: '',
          departName: '',
          departId: '',
          departCode: '',
          companyName: '',
          companyId: '',
          companyCode: '',
          loginName: '',
          typeId: '',
          chairId: '',
          userMobile: '',
          userEmail: ''
        },
        showDepart: false,
        userRules: {
          userName: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { max: 50, message: '最多输入50个字符', trigger: 'blur' }
          ],
          departName: [
            { required: true, message: '请选择部门', trigger: 'change' }
          ],
          companyName: [
            { required: true, message: '请选择法院', trigger: 'change' }
          ],
          loginName: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 3, max: 100, message: '长度为3-100位', trigger: 'blur' }
          ],
          userMobile: [{ min: 11, max: 11, message: '长度为11位', trigger: 'blur' }]
        }
      }
    },
    mounted() {
      this.searchUser()
      this.getGroups()
    },
    computed: {
      // 人员类别
      types() {
        return this.$store.getters.selects['k10003']
      },
      // 部门正副职
      chair() {
        return this.$store.getters.selects['k10010']
      },
      // 法院
      companys() {
        return this.fd.data.changeToTree(
          this.$store.getters.allCourt,
          'id',
          'parentId'
        )
      },
      actionPath() {
        return process.env.BASE_API + window.config.uaa_url + 'api/users/import?Authorization=' +
          this.$store.getters.token
      }
    },
    methods: {
      getCourts() {
        this.fd.req({
          url: '/api/auth/courts',
          method: 'get'
        }, 'zuul_url').then((d) => {
          const data = d.data || []
          this.courts = this.fd.data.changeToTree(data, 'id', 'parentId')
        })
      },
      // 错误信息列表
      getData() {
        this.list = this.failList.slice(this.offsetInfo, this.offsetInfo + this.limitInfo)
      },
      currentChangeInfo(page) {
        this.offsetInfo = (page - 1) * this.limitInfo
        this.getData()
      },
      sizeChangeInfo(limitInfo) {
        this.offsetInfo = 0
        this.limitInfo = limitInfo
        this.getData()
      },

      getCourt,
      currentChange(page) {
        this.offset = (page - 1) * this.limit
        this.searchUser()
      },
      refreshUSer() {
        this.offset = 0
        this.searchUser()
      },
      sizeChange(limit) {
        this.offset = 0
        this.limit = limit
        this.searchUser()
      },
      handleSelect(selection, row) {
        this.chooseCount = selection.length
        this.chooses = selection
      },
      handleNodeClick(data) {
        this.showDepart = false
        this.user.departId = data.id
        this.user.departCode = data.code
        this.user.departName = data.label
      },
      courtNodeClick(data) {
        this.user.companyId = data.id
        this.user.companyCode = data.code
        this.user.companyName = data.label
        this.showDepartTree = false
      },
      showUser(row) { // 查看用户信息
        this.user = row
        this.editDialog = true
        this.userTitle = '查看用户'
      },
      showEditDialog() {
        this.editDialog = true
        this.userTitle = '新增用户'
        this.user = {
          userName: '',
          departName: '',
          companyName: '',
          departId: '',
          typeId: '',
          chairId: '',
          departCode: '',
          companyId: '',
          companyCode: '',
          loginName: '',
          userMobile: '',
          userEmail: ''
        }
        if (this.$refs['editForm']) {
          this.$refs['editForm'].resetFields()
        }
      },
      searchUser() {
        this.fd.req({
          url: 'api/users',
          method: 'get',
          data: {
            userName: this.userOrLoginName,
            offset: this.offset,
            limit: this.limit
          }
        }, 'uaa_url').then((d) => {
          this.userData = d.data.data
          this.total = d.data.total
        })
      },
      // 导入
      importUsers() {
        document.getElementById('file').click()
      },
      onProgress() {
        this.checking = true
        const options = {
          lock: true,
          text: '文件正在导入读取数据中,请稍后......'
        }
        this.loading = this.$loading(options)
      },
      inputFilter(newFile, oldFile, prevent) {
        this.$refs.upload.active = true
      },
      inputFile(newFile, oldFile) {
        this.$refs.upload.active = true
        if (newFile && newFile.progress) {
          this.onProgress()
        }
        if (newFile && newFile.success) {
          this.uploadSuccess(newFile.response)
        }
        if (newFile && newFile.error) {
          this.uploadError(newFile.response)
        }
      },
      // 导入人员信息失败
      uploadError(data) {
        this.loading.close()
        this.$message({
          type: 'error',
          message: '导入失败！' + data.message
        })
      },
      // 导入人员信息成功
      uploadSuccess(data) {
        this.showResult(data)
      },
      showResult(result) {
        this.loading.close()
        this.loading = true
        this.checking = false
        if (result.data.verfiyFail) {
          this.infoDialog = true
          this.$nextTick(function() {
            this.failList = result.data.failList
            this.totalInfo = this.failList.length
            this.title = '导入列表存在' + this.totalInfo + '处错误，请完成修改后重新导入'
            this.getData()
          })
          this.loading = false
        } else {
          this.$message({
            type: 'success',
            message: '导入成功'
          })
          this.refreshUSer()
        }
      },
      downloadUser() {
        const data = {
          userName: this.userOrLoginName
        }
        const uaa = window.config.uaa_url
        const url = uaa + '/api/users/export'
        this.fd.tools.download2('', url, data)
      },
      saveUser() {
        this.$refs['editForm'].validate((valid) => {
          if (!valid) {
            return
          }
          let url = 'api/users'
          let method = 'post'
          if (this.user.id) {
            method = 'put'
            url += '/' + this.user.id
          }
          this.fd.req({
            url: url,
            method: method,
            data: this.user
          }, 'uaa_url').then((d) => {
            this.editDialog = false
            this.searchUser()
          })
        })
      },
      editUser(row) {
        this.userTitle = '编辑用户'
        this.editDialog = true
        this.$nextTick(() => {
          this.$refs['editForm'].resetFields()
          this.user = this.fd.tools.merge(true, {}, row)
          console.log(this.fd.tools.merge(true, {}, row))
        })
      },
      deleteUser(row) {
        if (this.chooses.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选择需要删除的人员'
          })
        } else {
          this.$confirm('请确认是否需要删除?', '提示', {
            type: 'warning'
          }).then(() => {
            const ids = this.fd.data.getValuesByKey(this.chooses, 'id').join()
            this.fd.req({
              url: 'api/users/' + ids,
              method: 'delete'
            }, 'uaa_url').then((d) => {
              this.searchUser()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            })
          }).catch(() => {})
        }
      },
      resetPassword(row) {
        this.$confirm('请确认是否需要重置密码?', '提示', {
          type: 'warning'
        }).then(() => {
          this.fd.req({
            url: 'api/users/' + row.id + '/reset',
            method: 'put'
          }, 'uaa_url').then((d) => {
            this.searchUser()
            this.$message({
              type: 'success',
              message: '密码重置成功'
            })
          })
        }).catch(() => {})
      },
      infoDetailOff() {
        this.infoDialog = false
      },
      getGroups() {
        const court = this.getCourt()
        this.departs = this.fd.data.changeToTree(court, 'id', 'parentId')
      }
    }
  }

</script>
