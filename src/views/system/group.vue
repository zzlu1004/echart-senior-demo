<template>
  <div class="app-container checkProject">
    <div class="container-inner bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="tab-box">
        <el-tabs v-model="activeName" @tab-click="getGroups" type="card">
          <el-tab-pane label="角色类型" name="role"></el-tab-pane>
          <el-tab-pane label="部门类型" name="depart"></el-tab-pane>
          <el-tab-pane label="自定义类型" name="custom"></el-tab-pane>
          <div>
            <div>
              <el-button-group class="pb1">
                <el-button type="primary" icon="el-icon-plus" @click="addGroup()" size="small">添加</el-button>
                <el-button type="primary" @click="copyGroup()" size="small"><svg-icon icon-class="clipboard" />&nbsp;复制</el-button>
                <el-button type="primary" icon="el-icon-delete" @click="deleteGroup()" size="small">删除</el-button>
                <el-button v-show="activeName !== 'depart'" type="primary" size="small" @click="permissionEffect()">
                  <svg-icon icon-class="person_details"/>
                  权限生效
                </el-button>
              </el-button-group>
            </div>
            <div>
              <el-row :gutter="16">
                <el-col :span="9">
                  <div class="grid-content ">
                    <el-input
                      class="my1"
                      placeholder="输入关键字进行过滤"
                      v-model="filterGroup">
                    </el-input>
                    <el-tree
                      :data="groups"
                      :props="treeGroupProps"
                      :filter-node-method="filterGroupNode"
                      :default-expanded-keys="expandedGroupsKeys"
                      :default-checked-keys="checkedKeys"
                      :expand-on-click-node="false"
                      :highlight-current="true"
                      @node-expand="treeExpand"
                      @node-collapse="treeCollapse"
                      @node-click="clickGroup"
                      node-key="id"
                      ref="treeRole"
                    >
                    </el-tree>
                  </div>
                </el-col>
                <el-col :span="15" class="bd-left">
                  <el-tabs v-model="secondPanel" type="border-card">
                    <el-tab-pane label="关联用户" name="user">
                      <div v-if="secondPanel === 'user'">
                        <fd-relate-user :groupId="selectedRole.id"></fd-relate-user>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="页面权限" name="page">
                      <div v-if="secondPanel === 'page'">
                        <fd-relate-ele :groupId="selectedRole.id"></fd-relate-ele>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="数据权限" name="data">
                      <div v-if="secondPanel === 'data'">
                        <fd-relate-data :groupId="selectedRole.id"></fd-relate-data>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="基本信息" name="basic">
                      <div v-if="secondPanel === 'basic'">
                        <el-form label-width="80px"
                                 :model="frmGroup"
                                 :rules="rules"
                                 ref="groupForm">
                          <el-form-item label="组名" prop="groupName">
                            <el-input v-model="frmGroup.groupName"></el-input>
                          </el-form-item>
                          <el-form-item label="简称">
                            <el-input v-model="frmGroup.groupShortName"></el-input>
                          </el-form-item>
                          <el-form-item label="备注">
                            <el-input v-model="frmGroup.comments"></el-input>
                          </el-form-item>
                          <el-form-item>
                            <el-button type="primary" @click="saveGroup">保存</el-button>
                          </el-form-item>
                        </el-form>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import { getProductName } from '@/api/common'
  import FdRelateUser from './relate_user'
  import FdRelateEle from './relate_elements'
  import FdRelateData from './relate_data'
  export default {
    name: 'group',
    components: { FdRelateEle, FdRelateUser, FdRelateData },
    data() {
      return {
        activeName: 'role',
        secondPanel: 'user',
        groups: [],
        treeGroupProps: { // 组数的默认配置
          children: 'children',
          label: 'groupName'
        },
        filterGroup: '',
        checkedKeys: [],
        expandedGroupsKeys: [],
        frmGroup: {},
        selectedRole: {
          id: ''
        },
        rules: {
          groupName: [{ required: true, message: '组名不能为空', trigger: 'blur' },
            { max: 32, message: '长度不超过32个字符', trigger: 'blur' }]
        },
        selectUser: false,
        selectEle: false
      }
    },
    watch: {
      filterGroup(val) {
        this.$refs.treeRole.filter(val)
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.getGroups()
      })
    },
    methods: {
      getProductName,
      // 过滤组树的数据
      filterGroupNode(value, data) {
        if (!value) return true
        return data.groupName.indexOf(value) !== -1
      },
      // 获取组信息
      getGroups() {
        this.fd.req({
          url: 'api/groups/group-type/' + this.activeName,
          method: 'get',
          data: {
            projectCode: this.getProductName()
          }
        }, 'uaa_url').then((d) => {
          const data = d.data || []
          this.groups = this.fd.data.changeToTree(data, 'id', 'parentId')
          const msgObj = this.fd.data.arrayToObj(data, 'id')
          if (this.checkedKeys.length > 0) {
            this.clickGroup(msgObj[this.selectedRole.id])
          }
        })
      },
      treeExpand(data, node) {
        this.expandedGroupsKeys.push(data.id)
      },
      treeCollapse(data, node) {
        this.expandedGroupsKeys = this.expandedGroupsKeys.filter((item) => {
          item.id !== data.id
        })
      },
      // 页面角色点击时
      clickGroup(data) {
        this.checkedKeys = [data.id]
        this.frmGroup = data
        this.frmGroup = {
          id: data.id,
          parentId: data.parentId,
          parentName: data.parentName,
          projectCode: data.projectCode || this.getProductName(),
          groupName: data.groupName,
          groupType: data.groupType,
          groupShortName: data.groupShortName,
          comments: data.comments
        }
        this.selectedRole = data
      },
      addGroup() {
        if (this.frmGroup.id) {
          this.secondPanel = 'basic'
          this.$nextTick(() => {
            this.$refs.groupForm.resetFields()
            this.frmGroup = {
              parentId: this.selectedRole.id,
              parentName: this.selectedRole.groupName,
              projectCode: this.getProductName(),
              groupName: '',
              groupType: this.activeName
            }
          })
        } else if (this.frmGroup.parentId) {
          this.$message({
            type: 'warning',
            message: '请保存后，再进行新建!'
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请先选择一个分组!'
          })
        }
      },
      copyGroup() {
        if (this.frmGroup.id) {
          this.$nextTick(() => {
            this.fd.req({
              url: 'api/group/' + this.selectedRole.id + '/copy',
              method: 'post'
            }, 'uaa_url').then((d) => {
              if (d && d.code === 200) {
                this.$message({
                  type: 'success',
                  message: '复制成功'
                })
                this.getGroups()
              } else {
                this.$message({
                  type: 'error',
                  message: '复制失败'
                })
              }
            })
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请先选择一个分组!'
          })
        }
      },
      deleteGroup() {
        const frmGroup = this.selectedRole
        if (frmGroup.children && frmGroup.children.length > 0) {
          this.$message({
            type: 'warning',
            message: '请先删除分组:' + frmGroup.groupName + '下的子集'
          })
          return
        }
        this.$confirm('此操作将删除分组:' + frmGroup.groupName + ', 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          const id = frmGroup.id
          this.fd.req({
            url: 'api/groups/' + id,
            method: 'delete'
          }, 'uaa_url').then(() => {
            this.checkedKeys = []
            this.getGroups()
          })
        })
      },
      permissionResource() {
        this.secondPanel = 'page'
        this.selectEle = true
      },
      permissionEffect() {
        // 获取菜单资源
        this.fd.req({
          url: 'api/groups/resources/refresh',
          method: 'post'
        }, 'zuul_url').then((d) => {
          localStorage.setItem('elements', '')
          this.$store.dispatch('GetUserInfo')
        })
      },
      relateUser() {
        this.secondPanel = 'user'
      },
      saveGroup() {
        this.$refs.groupForm.validate((valid) => {
          if (valid) {
            const frmGroup = this.frmGroup
            let method = 'post'
            let url = 'api/groups'
            if (frmGroup.id) {
              method = 'put'
              url = 'api/groups/' + frmGroup.id
            }
            this.fd.req({
              url: url,
              method: method,
              data: frmGroup
            }, 'uaa_url').then((d) => {
              this.getGroups()
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .width-260px{
    width:260px;
  }
</style>

