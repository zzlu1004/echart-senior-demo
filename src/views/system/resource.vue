<template>
  <div class="app-container checkProject">
    <div class="container-inner bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
    <el-button-group class="mb2">
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
      <el-button type="primary" size="small" icon="el-icon-plus" :disabled="!currentMenu" @click="addMenu()">添加</el-button>
      <el-button type="primary" size="small" icon="el-icon-delete" :disabled="!currentMenu" @click="deleteMenu()">删除</el-button>
      <el-button type="primary" size="small" icon="el-icon-upload" :disabled="isUpgrade" @click="updateMenuElements()">权限升级</el-button>
      <el-button type="primary" size="small" icon="el-icon-upload" :disabled="!currentMenu"  @click="importMenus">导入</el-button>
      <el-button type="primary" size="small" icon="el-icon-download" :disabled="!currentMenu"  @click="downloadMenus">导出</el-button>
    </el-button-group>
      <el-row :gutter="10" type="flex">
        <el-col :span="8">
          <el-card>
            <el-input
              class="mb1"
              placeholder="输入关键字进行过滤"
              size="mini"
              clearable
              v-model="filterMenus">
            </el-input>
            <el-tree
              :data="menus"
              :props="treeMenuProps"
              :filter-node-method="filterMenusNode"
              :default-expanded-keys="expandedMenuKeys"
              :default-checked-keys="checkedKeys"
              :expand-on-click-node="false"
              :highlight-current="true"
              node-key="id"
              @node-click="clickMenu"
              ref="treeMenus"
            >
            </el-tree>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-card style="margin-bottom: 10px;">
            <el-form label-width="90px" :model="frmMenu" :rules="rules" ref="resourceForm">
              <el-form-item label="名称" prop="resourceName">
                <el-input size="small" v-model="frmMenu.resourceName" ></el-input>
              </el-form-item>
              <el-form-item label="菜单编码" prop="resourceCode">
                <el-select v-model="frmMenu.resourceCode"
                           placeholder="请选择路径编码"
                           filterable
                           allow-create
                           @change="resourceCodeChange"
                           size="small">
                  <el-option v-for="item in router" :key="item.value" :label="item.value" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否显示">
                <el-select v-model="frmMenu.routeHidden"  placeholder="请选择是否显示" size="small">
                  <el-option label="显示" value="0"></el-option>
                  <el-option label="隐藏" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="类型">
                <el-select v-model="frmMenu.resourceType"  placeholder="请选择类型" size="small">
                  <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="父级节点">
                <el-input size="small" readonly v-model="frmMenu.parentResourceName" ></el-input>
              </el-form-item>
              <el-form-item label="图标">
                <el-select size="small" v-model="frmMenu.iconClass" clearable placeholder="图标" class="fd-permission-item_input" >
                  <el-option
                    v-for="(item, index)
                    of
                    iconsMap"
                    :key="index"
                    :label="item.icons"
                    :value="item.icons">
                    <i :class="item.icons" style="float:left;height:100%;margin-right:16px;"/>
                    <span style="color: #8492a6; font-size: 13px">{{item.icons}}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="顺序">
                <el-input size="small" @change="changeValue(frmMenu, 'sortId', 0, 999999)" v-model="frmMenu.sortId" ></el-input>
              </el-form-item>
              <el-form-item label="描述">
                <el-input size="small" v-model="frmMenu.comments" ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary"  @click="saveMenu">保存</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import { asyncRouter } from 'router'
  import { getProductName } from '@/api/common'
  import vueUpload from 'vue-upload-component'
  export default {
    name: 'resource',
    components: { vueUpload },
    data() {
      return {
        asyncRouter,
        fileList: [], // 导入文件列表
        headers: { 'Authorization': this.$store.getters.token }, // 导入的请求头部
        height: window.innerHeight - 60 + 'px',
        currentMenu: null, // 被选中的页面菜单
        expandedMenuKeys: [], // 展开的节点
        isUpgrade: false, // 权限升级只允许点击一次
        checkedKeys: [],
        filterMenus: '', // 过滤菜单
        frmMenu: {
          id: '',
          parentId: '',
          parentResourceName: '',
          routeHidden: '0',
          iconClass: '',
          sortId: '',
          resourceCode: '',
          projectCode: '',
          resourceName: '',
          resourceType: 'page'
        }, // 菜单的表单数据
        rules: {
          resourceName: [{ required: true, message: '请输入名称', trigger: 'blur' },
            { max: 16, message: '最多输入16个字符', trigger: 'blur' }],
          resourceCode: [{ required: true, message: '请输入编码', trigger: 'blur' }],
          parentResourceName: [{ required: true, message: '请选择父节点', trigger: 'blur' }]
        },
        types: [{ label: '目录', value: 'menu' },
          { label: '页面', value: 'page' }],
        treeMenuProps: { // 菜单数据的默认属性
          children: 'children',
          label: 'resourceName',
          disabled: function(data) {
            return data.resourceType === 'product'
          }
        },
        menus: [], // 菜单数据
        allMenus: [], // 所有的菜单元素
        elements: [] //
      }
    },
    watch: {
      filterMenus(val) {
        this.$refs.treeMenus.filter(val)
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.getMenus(true)
      })
    },
    computed: {
      actionPath() {
        return process.env.BASE_API + window.config.uaa_url + 'api/resources/menu/import?Authorization=' +
          this.$store.getters.token
      },
      iconsMap() {
        return [{ icons: 'fd-icon icon-yejibaobiao' },
          { icons: 'fd-icon icon-xuexi' },
          { icons: 'fd-icon icon-jubao' },
          { icons: 'fd-icon icon-ccgl-zhiliangshigu-6' },
          { icons: 'fd-icon icon-kaopingrenwu' },
          { icons: 'fd-icon icon-zhiliangrenzheng' },
          { icons: 'fd-icon icon-unmarked' },
          { icons: 'fd-icon icon-marked' },
          { icons: 'fd-icon icon-logo' },
          { icons: 'fd-icon icon-danganzhongxin' },
          { icons: 'fd-icon icon-gerenzhongxin' },
          { icons: 'fd-icon icon-kongtubiao' },
          { icons: 'fd-icon icon-kaoheguanli' },
          { icons: 'fd-icon icon-kaohejieguo' },
          { icons: 'fd-icon icon-jixiaofenxi' },
          { icons: 'fd-icon icon-shouye' },
          { icons: 'fd-icon icon-jx-geren' },
          { icons: 'fd-icon icon-xitongguanli' },
          { icons: 'fd-icon icon-hebingxingzhuang' },
          { icons: 'fd-icon icon-xingzhuang' },
          { icons: 'fd-icon icon-ditu' },
          { icons: 'fd-icon icon-daishengxiao' },
          { icons: 'fd-icon icon-shouyezaixiankaohe' },
          { icons: 'fd-icon icon-jiezhiriqixuanzhong' },
          { icons: 'fd-icon icon-zhouqixing' },
          { icons: 'fd-icon icon-lingdaogongzuotai' },
          { icons: 'fd-icon icon-tongzhigonggao' },
          { icons: 'fd-icon icon-jx-bumen' },
          { icons: 'fd-icon icon-jx-renshi' },
          { icons: 'fd-icon icon-renwuhuaxiangyijiicom' },
          { icons: 'fd-icon icon-jx-quanzhong' }]
      },
      productName() {
        return this.getProductName()
      },
      router() {
        const routers = []
        for (const key in asyncRouter) {
          routers.push({ value: key })
        }
        return routers
      }
    },
    methods: {
      getProductName,
      changeValue(obj, key, min = 0, max = 99999999) {
        let value = obj[key]
        value = value.replace(/[^\d]/g, '')
        value = value || 999999999
        obj[key] = value
      },
      resourceCodeChange() {
        const obj = asyncRouter[this.frmMenu.resourceCode] || {}
        this.elements = obj.elements || []
      },
      downloadMenus() {
        const data = {
          projectCode: this.currentMenu.projectCode || this.productName
        }
        const uaa = window.config.uaa_url
        const url = uaa + '/api/resources/menu/export'
        this.fd.tools.download2('', url, data)
      },
      // 导入
      importMenus() {
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
        this.$message({
          type: 'success',
          message: '导入成功'
        })
        this.loading.close()
        this.getMenus()
      },
      // 获取菜单资源
      getMenus(first = false) {
        this.fd.req({
          url: 'api/resources/menu',
          method: 'get',
          data: {
            product: this.productName
          }
        }, 'uaa_url').then((d) => {
          this.allMenus = d.data
          this.menus = this.fd.data.changeToTree(d.data, 'id', 'parentId')
          if (first) {
            this.$nextTick(() => {
              const obj = this.menus[0].children[0] || {}
              const id = obj.id
              if (id) {
                this.expandedMenuKeys = [id]
                // this.checkedKeys = [id]
                this.$refs.treeMenus.setCurrentKey(id)
                this.currentMenu = { ...obj }
                this.setFrmMenu({ ...obj })
              }
            })
          } else {
            this.expandedMenuKeys = [this.currentMenu.id]
          }
        })
      },
      setFrmMenu(data) {
        for (const key in this.frmMenu) {
          this.frmMenu[key] = data[key]
        }
        this.resourceCodeChange()
      },
      // 页面菜单点击时
      clickMenu(data, node) {
        this.currentMenu = this.$refs.treeMenus.getCurrentNode()
        this.checkedKeys = [this.currentMenu.id]
        this.setFrmMenu(this.currentMenu)
      },
      // 新建菜单
      addMenu() {
        // if (this.currentMenu.resourceType === 'page') {
        //   this.$message({
        //     type: 'warning',
        //     message: '父级不能为页面'
        //   })
        //   return false
        // }
        this.setFrmMenu({
          id: '',
          parentId: this.currentMenu.id,
          parentResourceName: this.currentMenu.resourceName,
          routeHidden: '0',
          iconClass: '',
          projectCode: this.currentMenu.projectCode || this.productName,
          resourceCode: '',
          resourceName: '',
          resourceType: 'page'
        })
      },
      // 过滤菜单节点
      filterMenusNode(value, data) {
        if (!value) return true
        return data.resourceName.indexOf(value) !== -1
      },
      // 删除菜单信息
      deleteMenu() {
        if (this.currentMenu.children && this.currentMenu.children.length > 0) {
          this.$message({
            type: 'warning',
            message: '请先删除该菜单下的子菜单'
          })
          return
        }
        this.$confirm('此操作将删除该菜单及其下面的元素, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          const id = this.currentMenu.id
          this.fd.req({
            url: 'api/resources/' + id,
            method: 'delete'
          }, 'uaa_url').then((d) => {
            this.getMenus(true)
            this.$message({
              type: 'success',
              message: '菜单信息删除成功!'
            })
          })
        }).catch(() => {})
      },
      // 保存菜单信息
      saveMenu() {
        this.$refs.resourceForm.validate((valid) => {
          if (valid) {
            let method = 'post'
            let url = 'api/resources'
            if (this.frmMenu.id) {
              method = 'put'
              url = 'api/resources/' + this.frmMenu.id
            }
            this.fd.req({
              url: url,
              method: method,
              data: { ...this.frmMenu, routePath: this.frmMenu.resourceCode, projectCode: (this.frmMenu.projectCode || this.productName) }
            }, 'uaa_url').then((d) => {
              if (!this.frmMenu.id) {
                this.saveElement(d.data.id)
              }
              this.getMenus()
            })
          }
        })
      },
      // 保存页面元素信息
      saveElement(id) {
        for (const item of this.elements) {
          this.fd.req({
            url: 'api/resources',
            method: 'post',
            data: { ...item, parentId: id, projectCode: this.productName }
          }, 'uaa_url').then(() => {
          })
        }
      },
      updateMenuElements() {
        const allMenus = this.allMenus.filter((item) => {
          // 避免操作其他项目数据
          return item.projectCode === this.productName
        })
        for (const menu of allMenus) {
          this.getMenuElements(menu)
        }
        this.$nextTick(() => {
          this.isUpgrade = true
        })
        // projectCode
      },
      getMenuElements(menu) {
        this.fd.req({
          url: 'api/resources/' + menu.id + '/elements',
          method: 'get'
        }, 'uaa_url').then((response) => {
          const data = response.data
          const deletes = []
          const updates = []
          // 获取每个页面支持的权限配置
          let async = this.asyncRouter[menu.resourceCode] || {}
          // 不是每个页面配置都有权限配置
          if (async.elements) {
            async = async.elements
          } else {
            async = []
          }
          const eleMap = this.fd.data.arrayToObj(async, 'resourceCode')
          for (const item of data) {
            // 页面下只能挂权限控制的元素
            const ele = eleMap[item.resourceCode]
            if (menu.resourceType === 'page') {
              // 是否在支持的权限配置里面
              if (ele) {
                // 判断对象内容是否有不同
                if (ele.resourceName !== item.resourceName ||
                  ele.resourceType !== item.resourceType ||
                  ele.requestType !== item.requestType) {
                  updates.push({ ...item, ...eleMap[item.resourceCode] })
                }
              } else {
                deletes.push(item)
              }
              delete eleMap[item.resourceCode]
            } else if (menu.resourceType === 'menu') { // 菜单下面只能有页面。如果有元素说明都是多出来的数据
              deletes.push(item)
            }
          }
          const adds = []
          // 获取所有需要新增的字段
          for (const key in eleMap) {
            adds.push({ parentId: menu.id, projectCode: this.productName, ...eleMap[key] })
          }
          this.addElement(adds)
          this.updateElement(updates)
          this.deleteElement(deletes)
        })
      },
      // 保存页面元素信息
      addElement(elements) {
        for (const item of elements) {
          this.fd.req({
            url: 'api/resources',
            method: 'post',
            data: item
          }, 'uaa_url').then(() => {})
        }
      },
      updateElement(elements) {
        for (const item of elements) {
          this.fd.req({
            url: 'api/resources/' + item.id,
            method: 'put',
            data: item
          }, 'uaa_url').then(() => {})
        }
      },
      deleteElement(elements) {
        if (elements.length > 0) {
          this.fd.req({
            url: 'api/resources/' + this.fd.data.getValuesByKey(elements, 'id').join(),
            method: 'delete'
          }, 'uaa_url').then(() => {})
        }
      }
    }
  }
</script>


