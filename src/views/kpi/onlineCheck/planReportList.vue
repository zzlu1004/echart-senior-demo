<template>
  <div class="app-container">
    <div class="bg-white container-inner has-fixed-bottom clearfix h14 check-list" :style="{'min-height':height}">
      <!--顶部查询条件-->
      <div>
        <div class="bd-dashed-bottom pb2 mb2">
          <div class="clearfix mb2 height50 line-height-50">
            <div class="f-left color-title bold h20">{{detailPlan.schemaName}}</div>
          </div>
          <div>
            <el-row class="mb2">
              <el-col :span="8">
                <div class="f-left pr1 color-title">考核周期:</div>
                <div class="hidden text-indent0">{{detailPlan.startTime}}至{{detailPlan.endTime}}</div>
              </el-col>
              <el-col :span="8">
                <div class="f-left pr1 color-title">上报截止时间:</div>
                <div class="hidden text-indent0">{{detailPlan.deadlineTime}}</div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="pb2">
          <el-row>
            <el-col :span="8">
              <div class="absolute pr1 py1">考核类别：</div>
              <div class="except-w4-full">
                <el-select
                  v-model="params.schemaBlockType"
                  placeholder="请选择"
                  @change="schemaChange"
                  size="small">
                  <el-option
                    v-for="item in schemaBlockTypeOpt"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="8" class="pl2">
              <div class="absolute pr1 py1">人员类型：</div>
              <div class="except-w4-full">
                <el-select
                  v-model="params.staffTypeIds"
                  size="small"
                  @change="staffTypeChange"
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
            <el-col :span="8" class="pl2">
              <div class="absolute pr1 py1">细则：</div>
              <div class="except-w4-full">
                <el-select
                  v-model="params.blockIds"
                  multiple
                  size="small"
                  filterable
                  clearable
                  placeholder="请选择">
                  <el-option
                    v-for="item in filterBlockOptions"
                    :key="item.blockId"
                    :label="item.blockName"
                    :value="item.blockId">
                  </el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="pb2 right-align">
          <el-button size="small" type="primary" @click="clickBtn">查询</el-button>
          <el-button size="small" @click="resetBtn">重置</el-button>
        </div>
      </div>
      <!--表格内容-->
      <div>
        <el-table
          id="tablePlan"
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="departName"
            label="部门">
          </el-table-column>
          <el-table-column
            prop="staffName"
            label="姓名">
            <template slot-scope="scope">
              <span class="color-blue pointer" @click="seeCheckDetail(detailPlan, scope.row)">{{scope.row.staffName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="typeName"
            label="人员类型">
          </el-table-column>
          <fd-columns
            v-for="item of tree"
            :key="item.menuId"
            :label="item.menuName"
            :edit="edit"
            :indexs="tableData"
            :data="item"></fd-columns>
        </el-table>
      </div>
      <!--底部固定按钮-->
      <div class="fixed-bottom">
        <div class="pt2">
          <el-button size="small" type="primary" @click="goBack">返回</el-button>
          <el-button :disabled="withDrawStaffs.length === 0" size="small" type="primary" @click="revocationBatch">批量撤回</el-button>
          <div style="display: inline-block;" class="mr2" v-if="isFill && edit">
            <el-upload
              class="pointer"
              name="file"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .xls, .xlsx"
              :action="actionPath"
              :data="actionParams"
              multiple
              :headers="{
                    Authorization: $store.getters.token
                  }"
              :on-success="handerSuccess"
              :on-error="handerError"
              :before-upload="beforeAvatarUpload"
              :show-file-list="false">
              <el-button class="btn-ml" size="small" type="primary">导入</el-button>
            </el-upload>
          </div>
          <el-button v-if="isFill && edit" size="small" type="primary" @click="downloadTableDetail">导出</el-button>
          <span v-if="isFill && edit" class="btn-space" @click="saveDraft">
            <pop-btn text="保存草稿" content="保存草稿后，需要再点击提交才能完成分数填报工作"></pop-btn>
          </span>
          <el-button v-if="isFill && edit" class="btn-space" size="small" type="primary" @click="saveSubmit">提交</el-button>
          <el-button v-if="isFill && !edit" size="small" type="primary" @click="fillTable">填报</el-button>
        </div>
      </div>
    </div>
    <!--批量撤回-->
    <fd-dialog
      title="批量撤回"
      :syncVisible="revocationDialog"
      @beforeClose="revocationDialog = false"
    >
      <div slot="fd-body">
        <fd-revocation-batch
          ref="revocation"
          v-bind:staffs=withDrawStaffs
          v-bind:targets="withDrawIndexs"
          :resetForm="resetForm"
          :importParams="importParams"
          v-on:save="saveSuccess"></fd-revocation-batch>
      </div>
      <div slot="fd-footer">
        <el-button size="small" @click="revocationDialog = false">取消</el-button>
        <el-button size="small" type="primary" @click="sureSave">确定</el-button>
      </div>
    </fd-dialog>
    <!--材料报错提示-->
    <fd-dialog
      title="报错提示"
      :syncVisible="visible"
      @beforeClose="visible = false"
    >
      <div slot="fd-body">
        <p class="bold">以下指标要求必须上传填报材料，请输入填报说明或上传附加材料后提交。</p>
        <div v-for="(val,key,i) of errorMsg" :key="i">
          <div class="hidden">
            <p class="f-left" style="width: 70px">{{key}}：</p>
            <p class="" style="margin-left: 70px">
              <span v-for="item of val">《{{item}}》 </span>
            </p>
          </div>
        </div>
      </div>
      <div slot="fd-footer">
        <el-button size="small" type="primary" @click="visible = false">确定</el-button>
      </div>
    </fd-dialog>
  </div>
</template>

<script>
  import { getPlanDetailById, getXzOptions, revocationBatch, downloadTableDetail, saveDraft, saveSubmit, fillTable,
    clickBtn, refreshTableData, resetBtn, getTargetData, getUnfillIndexCnt, saveSuccess, uploadSuccess, seeCheckDetail, dealBtnShow } from '@/api/kpi/onlineCheck/planReportList'
  import { beforeAvatarUpload } from '@/api/kpi/onlineCheck/ruleReportList'
  import { goBack } from '@/api/common'
  import popBtn from 'fd/popoverButton/src/popBtn.vue'
  import FdColumns from '../components/fdColumns.vue'
  import FdRevocationBatch from './revocationBatch'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  export default {
    name: 'planReportList',
    components: { popBtn, FdColumns, FdRevocationBatch, fdDialog },
    props: {},
    data() {
      return {
        height: (this.$store.getters.globals.height - 100) + 'px',
        detailPlan: {},
        typesMap: {
          'k10015-01': '综合绩效',
          'k10015-02': '审判绩效',
          'k10015-03': '民主测评'
        },
        params: {
          staffTypeIds: '',
          schemaBlockType: 'k10015-01',
          blockIds: [], // 细则id
          schemaId: ''
        },
        ruleParams: {
          offset: 0,
          limit: 0,
          type: 'to_fill',
          staffType: this.$store.getters.selects['k10003'][0].id
        },
        schemaBlockTypeOpt: [
          {
            id: 'k10015-01',
            name: '综合绩效'
          },
          {
            id: 'k10015-02',
            name: '审判绩效'
          },
          {
            id: 'k10015-03',
            name: '民主测评'
          }
        ],
        withDrawStaffs: [], // 提交的草稿箱内容
        withDrawIndexs: [],
        isFill: true,
        edit: false,
        obj: null,
        loading: null,
        blocksOptions: [], // 细则数据
        filterBlockOptions: [], // 考核类别跟细则联动
        tableData: [],
        tree: null,
        indexTotal: 0, // 记录表格中需要填写的列表项
        refFlagCount: 0,
        typeName: '',
        revocationDialog: false,
        resetForm: true,
        visible: false,
        errorMsg: ''
      }
    },
    methods: {
      getPlanDetailById, getXzOptions, revocationBatch, downloadTableDetail, saveDraft, saveSubmit, fillTable, beforeAvatarUpload, clickBtn,
      goBack, refreshTableData, resetBtn, getTargetData, getUnfillIndexCnt, saveSuccess, uploadSuccess, seeCheckDetail, dealBtnShow,
      handerError(err) {
        var mes = 'message'
        if (err[mes] && err[mes].includes('导入失败：文件格式与模板不匹配')) {
          this.$message.error('导入失败：文件格式与模板不匹配')
        } else {
          mes = JSON.parse(err.message).message
          if (mes) {
            this.$message.error(mes)
          } else {
            this.$message.error('导入失败')
          }
        }
      },
      handerSuccess(file) {
        this.uploadSuccess(file)
      },
      sureSave() {
        this.$refs.revocation.revocationSave()
      },
      schemaChange(val) {
        this.filterBlockOptions = this.blocksOptions.filter((item) => {
          return item.schemaBlockType === val
        })
        this.params.blockIds = []
        if (this.filterBlockOptions.length > 0) {
          this.params.blockIds.push(this.filterBlockOptions[0].blockId)
        }
      },
      staffTypeChange(val) {
        this.ruleParams.staffType = val
      }
    },
    mounted() {
      this.obj = JSON.parse(localStorage.getItem('obj'))
      this.detailPlan = JSON.parse(localStorage.getItem('planObj'))
      if (this.obj.from === 'rule') {
        this.isFill = this.obj.originalFill
      } else {
        this.isFill = this.obj.isFill
      }
      this.edit = this.obj.page === 'edit'
      this.params.schemaId = this.$route.query.schemaId || ''
      this.params.staffTypeIds = this.$store.getters.selects['k10003'][0].id
      this.getXzOptions()
    },
    computed: {
      types() {
        return this.$store.getters.selects['k10003']
      },
      elements() {
        return this.$store.getters.elements.tableDetail || {}
      },
      importParams() {
        return {
          schemaId: this.params.schemaId,
          blockId: this.params.blockIds.join(','),
          schemaBlockType: this.params.schemaBlockType,
          staffType: this.params.staffTypeIds,
          type: 'fill'
        }
      },
      actionParams() {
        return {
          schemaId: this.params.schemaId,
          blockIds: this.params.blockIds.join(','),
          schemaBlockType: this.params.schemaBlockType,
          staffType: this.params.staffTypeIds,
          type: 'fill'
        }
      },
      actionPath() {
        return process.env.BASE_API + window.config.project_url + 'api/assessments/schemas/' + this.params.schemaId + '/import?Authorization=' +
          this.$store.getters.token
      }
    }
  }
</script>

<style scoped>

</style>
