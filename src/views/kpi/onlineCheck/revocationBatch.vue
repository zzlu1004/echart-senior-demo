<template>
  <div>
    <div class="px2">
      <div class="pb2">请选择批量撤回的考核对象与考核指标</div>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="pb2">
            <fd-search v-model="searchStaffName" @search="refreshStaffName"></fd-search>
          </div>
          <div class="line-height-normal">
            <el-checkbox :indeterminate="staffIndeterminate" v-model="checkStaff" @change="handleStaffChange">全选</el-checkbox>
            <span class="f-right">已选对象{{revocationForm.staffIds.length}}人</span>
          </div>
          <div style="height:300px" class="auto bd py1 px2">
            <div>
              <el-checkbox-group v-model="revocationForm.staffIds" @change="handleCheckedStaffChange">
                <div v-for="item in allStaff" :key="item.staffId" class="mb1">
                  <el-checkbox :label="item.staffId">{{item.staffName}}</el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="pb2">
            <fd-search v-model="searchIndexName" @search="refreshTargetName"></fd-search>
          </div>
          <div class="line-height-normal">
            <el-checkbox :indeterminate="targetIndeterminate" v-model="checkTarget" @change="handleTargetChange">全选</el-checkbox>
            <span class="f-right">已选指标{{revocationForm.indexIds.length}}个</span>
          </div>
          <div style="height:300px" class="auto bd py1 px2">
            <div>
              <el-checkbox-group v-model="revocationForm.indexIds" @change="handleCheckedTargetChange">
                <div v-for="item in allTarget" :key="item.indexId" class="mb1">
                  <el-checkbox :label="item.indexId" >{{item.indexName}}</el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- <div class="t-right py2">
      <div class="btn btn-default color-text mr4" @click="cancel">取消</div>
      <div class="btn btn-primary"  @click = "revocationSave">确定</div>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'FdRevocationBatch',
  data() {
    return {
      revocationForm: {
        staffIds: [],
        indexIds: []
      },
      allStaff: [],
      allTarget: [],
      searchStaffName: '',
      searchIndexName: '',
      staffIndeterminate: false,
      targetIndeterminate: false,
      checkStaff: false,
      checkTarget: false
    }
  },
  props: {
    staffs: Array,
    targets: Array,
    importParams: Object,
    resetForm: Boolean
  },
  components: {
  },
  methods: {
    handleCheckedStaffChange(v) {
      const checkedCount = v.length
      this.checkStaff = checkedCount === this.staffIds.length
      this.staffIndeterminate = checkedCount > 0 && checkedCount < this.staffIds.length
    },
    handleStaffChange(v) {
      this.revocationForm.staffIds = v ? this.staffIds : []
      this.staffIndeterminate = false
    },
    handleCheckedTargetChange(v) {
      const checkedCount = v.length
      this.checkTarget = checkedCount === this.indexIds.length
      this.targetIndeterminate = checkedCount > 0 && checkedCount < this.indexIds.length
    },
    handleTargetChange(v) {
      this.revocationForm.indexIds = v ? this.indexIds : []
      this.targetIndeterminate = false
    },
    refreshStaffName() {
      this.allStaff = this.staffs.filter((item) => {
        return item.staffName.indexOf(this.searchStaffName) > -1
      })
    },
    refreshTargetName() {
      this.allTarget = this.targets.filter((item) => {
        return item.indexName.indexOf(this.searchIndexName) > -1
      })
    },
    revocationSave() {
      if (!(this.revocationForm.indexIds.length && this.revocationForm.staffIds.length)) {
        this.$message({
          type: 'error',
          message: '请选择需要批量撤回的人员与指标'
        })
        return
      }
      this.fd.req({
        url: 'api/evaluations/current-user/flows/block/withdraw',
        method: 'put',
        data: { ...this.importParams, ...this.revocationForm }
      }).then((d) => {
        this.$message({
          type: 'success',
          message: '撤回成功'
        })
        this.$emit('save')
      })
    },
    cancel() {
      this.$emit('cancel')
    }
  },
  mounted() {
    this.refreshStaffName()
    this.refreshTargetName()
  },
  computed: {
    staffIds() {
      return this.fd.data.getValuesByKey(this.staffs, 'staffId')
    },
    indexIds() {
      return this.fd.data.getValuesByKey(this.targets, 'indexId')
    }
  },
  watch: {
    resetForm() {
      this.refreshStaffName()
      this.refreshTargetName()
      this.revocationForm.staffIds = []
      this.revocationForm.indexIds = []
      this.searchStaffName = ''
      this.searchIndexName = ''
      this.staffIndeterminate = false
      this.targetIndeterminate = false
      this.checkStaff = false
      this.checkTarget = false
    }
  }
}
</script>

<style scoped>

</style>
