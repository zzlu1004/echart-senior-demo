<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-tree
          :data="menus"
          :props="treeMenuProps"
          :expand-on-click-node="false"
          :highlight-current="true"
          node-key="id"
          @node-click="clickMenu"
          ref="treeMenu"
        >
        </el-tree>
      </el-col>
      <el-col :span="16">
        <div class="bd">
          <el-table :data="elements"
                    @select="handleSelect"
                    @select-all="handleSelect"
                    :ref="'elementsTable_'+groupId">
            <el-table-column type="selection" width="50" prop="groupId"></el-table-column>
            <el-table-column
              prop="resourceName"
              label="元素名称">
            </el-table-column>
            <el-table-column
              prop="resourceType"
              label="元素类型">
            </el-table-column>
          </el-table>
        </div>
        <fd-pagination
          :limit="query.limit"
          :offset="query.offset"
          :currentChange="currentChange"
          :sizeChange="sizeChange"
          :total= "total"></fd-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { getProductName } from '@/api/common'
  import FdTable from 'fd/table/src/fdTable'
  import FdPagination from 'fd/pagination/pagination'
  export default {
    name: 'FdRelateEle',
    components: { FdTable, FdPagination },
    props: {
      groupId: {
        type: String
      }
    },
    data() {
      return {
        total: 0,
        menus: [], // 菜单数据
        elements: [], // 页面元素一览数据
        selectedElementIds: [],
        resourceName: '',
        selectedMenu: {},
        treeMenuProps: { // 菜单数据的默认属性
          children: 'children',
          label: 'resourceName'
        },
        query: {
          limit: 10,
          offset: 0,
          resourceName: ''
        }
      }
    },
    computed: {},
    mounted() {
      this.refreshMenus()
    },
    methods: {
      getProductName,
      currentChange(page) {
        this.query.offset = (page - 1) * this.query.limit
        this.getGroupElements()
      },
      sizeChange(limit) {
        this.query.offset = 0
        this.query.limit = limit
        this.getGroupElements()
      },
      handleSelect(selection, row) {
        console.log(selection)
        console.log(row)
        console.log(this.selectedElementIds)
        const newIds = []
        selection.forEach((item) => {
          newIds.push(item.id)
        })
        const addElements = newIds.filter(x => !this.selectedElementIds.includes(x))
        const deleteElements = this.selectedElementIds.filter(x => !newIds.includes(x))
        addElements.forEach((d) => {
          this.updateGroupResource(d, 'post')
        })
        deleteElements.forEach((d) => {
          this.updateGroupResource(d, 'delete')
        })
      },
      // 更新组的资源信息
      updateGroupResource(resourceId, method) {
        this.fd.req({
          url: 'api/groups/' + this.groupId + '/resources/' + resourceId,
          method: method
        }, 'uaa_url').then((d) => {
          if (method === 'post') {
            this.selectedElementIds.push(resourceId)
          } else {
            this.selectedElementIds = this.selectedElementIds.filter((d) => d !== resourceId)
          }
          this.$message({
            type: 'success',
            message: (method === 'delete' ? '取消' : '') + '授权成功!'
          })
        })
      },
      // 页面菜单点击时
      clickMenu(data, node) {
        this.selectedMenu = data
        this.refreshElements()
      },
      getGroupElements() {
        // 获取菜单资源
        if (this.groupId) {
          // 获取页面元素资源
          this.fd.req({
            url: 'api/group/' + this.groupId + '/resources/' + this.selectedMenu.id + '/elements',
            method: 'get'
          }, 'uaa_url').then((d) => {
            this.elements = d.data
            this.$nextTick(() => {
              this.selectedElementIds = []
              for (let i = 0; i < this.elements.length; i++) {
                if (this.elements[i].groupId) {
                  this.selectedElementIds.push(this.elements[i].id)
                }
                this.$refs['elementsTable_' + this.groupId].toggleRowSelection(this.elements[i], this.elements[i].groupId)
              }
            })
          })
        }
      },
      refreshMenus() {
        // 获取菜单资源
        this.fd.req({
          url: 'api/resources/menu',
          method: 'get',
          data: {
            product: this.getProductName()
          }
        }, 'uaa_url').then((d) => {
          this.menus = this.fd.data.changeToTree(d.data, 'id', 'parentId')
        })
      },
      refreshElements() {
        this.offset = 0
        this.query.resourceName = this.resourceName
        this.users = []
        this.total = 0
        this.$nextTick(() => {
          this.getGroupElements()
        })
      }
    },
    watch: {
      groupId() {
        this.refreshMenus()
      }
    }
  }
</script>

<style scoped>
</style>
