<template>
  <div class="fd-relate-data">
    <div class="pb2 t-center">
      <el-tree
        :data="departs"
        :props="treeProps"
        show-checkbox
        default-expand-all
        :default-checked-keys="checkedKeys"
        check-strictly
        @check="treeCheck"
        node-key="id"
        ref="treeData"
      >
      </el-tree>
    </div>
  </div>
</template>

<script>
  import { getProductName } from '@/api/common'
  export default {
    name: 'FdRelateData',
    components: {},
    props: {
      groupId: {
        type: String
      }
    },
    data() {
      return {
        departs: [],
        treeProps: {
          children: 'children',
          label: 'groupName'
        },
        checkedKeys: []
      }
    },
    computed: {},
    mounted() {
      this.getDataTree()
    },
    methods: {
      getProductName,
      getDataTree() {
        this.fd.req({
          url: 'api/data/departs',
          method: 'get',
          data: {
            groupId: this.groupId,
            projectCode: this.getProductName()
          }
        }, 'uaa_url').then((d) => {
          const data = d.data || []
          this.departs = this.fd.data.changeToTree(data, 'id', 'parentId')
          this.checkedKeys = []
          for (const item of data) {
            if (item.ownerFlag === '1') {
              this.checkedKeys.push(item.id)
            }
          }
        })
      },
      treeCheck(node, checks) {
        if (checks.checkedKeys.indexOf((node.id)) > -1) {
          this.fd.req({
            url: 'api/group/' + this.groupId + '/data/' + node.id,
            method: 'post'
          }, 'uaa_url').then(() => {
            this.$message({
              type: 'success',
              message: '新增权限成功'
            })
          })
        } else {
          this.fd.req({
            url: 'api/group/' + this.groupId + '/data/' + node.id,
            method: 'delete'
          }, 'uaa_url').then(() => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          })
        }
      }
    },
    watch: {
      groupId() {
        this.getDataTree()
      }
    }
  }
</script>

<style scoped>
</style>
