<template>
  <div class="fd-relate-user">
    <!--添加筛选条件-->
    <el-row class="mb2" :gutter="20">
      <el-col :span="8">
        <div class="absolute pr1 py1">法院：</div>
        <div class="except-w4-full">
          <el-popover
            ref="courtPid"
            placement="bottom-start"
            v-model="showDepartTree">
            <el-tree
              style="max-height:300px;overflow-y: auto;"
              :data="departs"
              :props="defaultProps"
              :accordion="accordion"
              @node-click="courtNodeClick"></el-tree>
          </el-popover>
          <el-input
            v-model="companyName"
            size="small"
            readonly
            placeholder="请选择"
            v-popover:courtPid>
          </el-input>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="absolute pr1 py1">人员类型：</div>
        <div class="except-w4-full">
          <el-select
            v-model="typeId"
            multiple
            size="small"
            filterable
            clearablet
            @change="getGroupUsers"
            placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </el-col>
      <el-col class="pl2" :span="8">
        <div class="absolute pr1 py1">部门正副职：</div>
        <div class="except-w4-full">
          <el-select
            v-model="chairId"
            placeholder="请选择"
            size="small"
            multiple
            filterable
            clearable
            @change="getGroupUsers"
          >
            <el-option
              v-for="item in chair"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </el-col>
    </el-row>
    <div class="pb2 t-center">
      <el-transfer
        filterable
        :titles="['待选择项', '已选择项']"
        :filter-method="filterMethod"
        filter-placeholder="用户名/登录名/法院名/部门名"
        :props="{
          key: 'id',
          label: 'des'
        }"
        style="text-align: left; display: inline-block"
        v-model="selectId"
        @change="checkChange"
        :data="users">
        <span slot-scope="{ option }">
          <span :title="option.des">{{option.des}}</span>
        </span>
      </el-transfer>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FdRelateUser',
    components: {},
    props: {
      groupId: {
        type: String
      }
    },
    data() {
      return {
        showDepartTree: false,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        accordion: true,
        companyName: this.$store.getters.user.companyName,
        users: [],
        selectUser: [],
        selectId: [],
        typeId: [],
        chairId: [],
        query: {
          limit: 0,
          offset: 0,
          userName: '',
          companyId: this.$store.getters.user.companyCode,
          typeId: '',
          chairId: ''
        }
      }
    },
    mounted() {
      this.getGroupUsers()
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
      departs() {
        return this.fd.data.changeToTree(
          this.$store.getters.allCourt,
          'id',
          'parentId'
        )
      }
    },
    methods: {
      courtNodeClick(data) {
        console.log(data)
        this.query.companyId = data.code
        this.companyName = data.label
        this.showDepartTree = false
        this.getGroupUsers()
      },
      filterMethod(query, item) {
        // 处理法院和部门可能为null的情况会报错
        if (!item.companyName) {
          item.companyName = ' '
        }
        if (!item.departName) {
          item.departName = ' '
        }
        return item.userName.indexOf(query) > -1 || item.loginName.indexOf(query) > -1 || item.companyName.indexOf(query) > -1 || item.departName.indexOf(query) > -1
      },
      getGroupUsers() {
        this.query.typeId = this.typeId.join(',')
        this.query.chairId = this.chairId.join(',')
        // 获取菜单资源
        if (this.groupId) {
          this.fd.req({
            url: 'api/group/' + this.groupId + '/users',
            method: 'get',
            params: this.query
          }, 'uaa_url').then((d) => {
            const data = d.data.data
            for (const item of data) {
              if (!item.companyName) {
                item.companyName = ' '
              }
              if (!item.departName) {
                item.departName = ' '
              }
              item.des = item.userName + '/' + item.loginName + '（' + item.companyName + '/' + item.departName + '）'
              if (item.groupId) {
                this.selectId.push(item.id)
                this.selectUser.push(item)
              }
            }
            this.users = data
          })
        }
      },
      refreshUser() {
        this.users = []
        this.selectId = []
        this.$nextTick(() => {
          this.getGroupUsers()
        })
      },
      checkChange(now, position, selects) {
        const method = position === 'right' ? 'post' : 'delete'
        selects.forEach((item, i) => {
          this.updateGroupUser(item, method)
        })
      },
      // 保存组的用户信息
      updateGroupUser(userId, method) {
        this.fd.req({
          url: 'api/groups/' + this.groupId + '/users/' + userId,
          method: method
        }, 'uaa_url').then((d) => {
          this.$message({
            type: 'success',
            message: (method === 'delete' ? '取消' : '') + '分组成功!'
          })
        })
      }
    },
    watch: {
      groupId() {
        this.refreshUser()
      },
      handleSelect() {
        this.refreshUser()
      }
    }
  }
</script>

<style>
  .el-transfer__buttons {
    padding: 0 2%;
  }
  .el-transfer__buttons .el-button + .el-button{
    margin-left: 0;
  }
  .fd-relate-user .el-transfer-panel{
    min-width: 240px;
    width: 44.5%;
  }
  .fd-relate-user .el-transfer-panel__body{
    height: 500px;
  }
  .fd-relate-user .el-transfer-panel__body .el-transfer-panel__list.is-filterable{
    height: 450px;
  }
  .el-transfer{
    width: 88%;
  }
</style>
