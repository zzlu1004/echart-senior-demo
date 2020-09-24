<template>
  <div class="app-container">
    <div class="bg-white container-inner has-fixed-bottom clearfix h14 check-list" :style="{'min-height':height}">
      <div class="bd-dashed-bottom pb2 mb2">
        <div class="clearfix mb2 height50 line-height-50">
          <div class="f-left color-title bold h20">{{detailRule.blockName}}</div>
        </div>
        <div>
          <el-row class="mb2">
            <el-col :span="8">
              <div class="f-left pr1 color-title">所属方案:</div>
              <div class="hidden text-indent0">{{detailRule.schemaName}}</div>
            </el-col>
            <el-col :span="8">
              <div class="f-left pr1 color-title">考核周期:</div>
              <div class="hidden text-indent0">{{detailRule.startTime}}至{{detailRule.endTime}}</div>
            </el-col>
            <el-col :span="8">
              <div class="f-left pr1 color-title">上报截止时间:</div>
              <div class="hidden text-indent0">{{detailRule.deadlineTime}}</div>
            </el-col>
          </el-row>
          <el-row class="mb1">
            <el-col v-if="detailRule.departName" :span="8">
              <div class="f-left pr1 color-title">考核对象:</div>
              <div class="hidden text-indent0">{{detailRule.departName}}</div>
            </el-col>
            <el-col :span="8">
              <div class="f-left pr1 color-title">考核类别:</div>
              <div class="hidden text-indent0">{{typesMap[detailRule.schemaBlockType]}}</div>
            </el-col>
          </el-row>
        </div>
      </div>
    <div>
        <el-table
            v-if="isShow"
            id="tableDetail"
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
                prop="departName"
                label="部门">
                <template slot-scope="scope">
                    <span class="color-blue pointer" @click="seeCheckDetail(detailRule, scope.row)">{{scope.row.departName}}</span>
                </template>
            </el-table-column>
            <fd-columns
                v-for="item of tree"
                :key="item.menuId"
                :label="item.menuName"
                v-bind:redFlag="redFlag"
                v-on:getRed="getRed"
                :edit="edit"
                :indexs="tableData"
                :data="item"></fd-columns>
        </el-table>
      </div>
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
              :data="importParams"
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
          <el-button v-if="show1" size="small" type="primary" @click="previousRule">上一个</el-button>
          <el-button v-if="show2" size="small" type="primary" @click="nextRule">下一个</el-button>
          <span v-if="isFill && edit" class="btn-space" @click="saveDraft">
            <pop-btn text="保存草稿" content="保存草稿后，需要再点击提交才能完成分数填报工作"></pop-btn>
          </span>
          <el-button v-if="isFill && edit" class="btn-space" size="small" type="primary" @click="saveSubmit">提交</el-button>
          <el-button v-if="isFill && !edit" size="small" type="primary" @click="fillTable">填报</el-button>
        </div>
      </div>
    </div>
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
  import fdDialog from 'fd/dialog/src/dialog.vue'
  import { getRuleDetailById, refreshTableData, saveDraft,
    saveSubmit, getTragetData, previousRule, nextRule, getAllRuleIds, seeCheckDetail, getRed,
    inputTableDetail, downloadTableDetail, uploadSuccess, revocationBatch, saveSuccess,
    getAllRuleToTab, fillTable, beforeAvatarUpload, getUnfillIndexCnt,
    handleExceed } from '@/api/kpi/onlineCheckDepart/ruleReportListDepart'
  import { goBack } from '@/api/common'
  import FdColumns from './onlineCheckCom/fdColumns.vue'
  import FdRevocationBatch from './revocationBatch'
  import popBtn from 'fd/popoverButton/src/popBtn.vue'
  export default {
    name: '',
    data() {
      return {
        isShow: false,
        errorMsg: '',
        visible: false,
        fileList: [],
        height: (this.$store.getters.globals.height - 100) + 'px',
        headers: { 'Authorization': this.$store.getters.token },
        page: '',
        fillClick: '',
        id: '',
        detailRule: {},
        params: {},
        typesMap: {
          'k10015-01': '综合绩效',
          'k10015-02': '审判绩效',
          'k10015-03': '民主测评'
        },
        tableData: [],
        redMap: [],
        indexCount: 0,
        indexTotal: 0,
        targetType: {},
        tree: [],
        heads: [],
        edit: false,
        statusObj: {
          'report': '待提交',
          'check': '待审核'
        },
        isFill: true,
        redFlag: false,
        typeName: '',
        fileName: '列表',
        ruleParams: {
          offset: 0,
          limit: 1,
          type: 'to_fill'
        },
        blocks: [],
        total: 0,
        show1: false,
        hasActive: false,
        loading: null,
        show2: false,
        obj: {},
        revocationDialog: false,
        resetForm: true,
        withDrawIndexs: [],
        withDrawStaffs: [],
        parentParams: {}
      }
    },
    components: {
      FdRevocationBatch, fdDialog, popBtn,
      FdColumns
    },
    methods: {
      saveDraft, saveSubmit, inputTableDetail,
      getRuleDetailById, refreshTableData, goBack, getTragetData, previousRule, nextRule,
      getAllRuleIds, seeCheckDetail, getRed, downloadTableDetail, uploadSuccess, revocationBatch, saveSuccess,
      getAllRuleToTab, fillTable, beforeAvatarUpload, handleExceed, getUnfillIndexCnt,
      handerSuccess(file, fileList) {
        this.uploadSuccess(file)
      },
      handerError(err, file, fileList) {
        var mes = 'message'
        if (err[mes] && err[mes].includes('导入失败：文件格式与模板不匹配')) {
          this.$message.error('导入失败：文件格式与模板不匹配')
        } else {
          this.$message.error('导入失败')
        }
      },
      sureSave() {
        this.$refs.revocation.revocationSave()
      }
    },
    computed: {
      actionPath() {
        return process.env.BASE_API + window.config.project_url + 'api/dept/assessments/blocks/' + this.params.blockId + '/import?Authorization=' +
          this.$store.getters.token
      },
      importParams() {
        return {
          schemaId: this.params.schemaId,
          blockId: this.params.blockId,
          schemaBlockType: this.params.schemaBlockType,
          type: 'fill'
        }
      }
    },
    mounted() {
      this.obj = JSON.parse(localStorage.getItem('obj'))
      // 判断审核按钮是否显示
      // 用于处理 按细则进入细则相关人员填报页面 如果该细则下面有待填报的记录 isFill为true，但点击了一条不能填报的人员记录，此刻需要记录
      // 这个细则的isFill，不然，会被当前人员不能填报影响，所以用originalFill来记录原先细则是否可以填报，如果细则不可以填报，则下面所有
      // 人员都不能填报
      if (this.obj.from === 'rule') {
        this.isFill = this.obj.originalFill
      } else {
        this.isFill = this.obj.isFill
      }
      this.checkType = this.obj.checkType
      this.operateType = this.obj.operateType
      this.page = this.obj.page
      this.type = this.obj.type
      // 判断是否进入编辑页面
      this.edit = this.obj.page === 'edit'
      this.id = this.$route.query.blockId || ''
      this.ruleParams.offset = this.$route.query.index || 0
      // 从上一个页面带来的方案id，细则id，考核类别，本人登录的人员id
      this.params = {
        schemaId: this.$route.query.schemaId || '',
        blockId: this.$route.query.blockId || '',
        schemaBlockType: this.$route.query.schemaBlockType || '',
        type: 'fill'
      }
      this.getAllRuleToTab()
      this.getRuleDetailById()
    },
    watch: {
    }
  }
</script>

<style lang="scss">
  .check-list{
    .color-d9d9d9{
      color:#d9d9d9;
    }
    .attachForm {
      .el-input__inner{
        border:none;
      }
    }
    .el-upload__tip{
      div{
        line-height:14px;
      }
    }
    .el-popover{
      color:inherit;
    }
    .height50{
      height:50px;
    }
    .line-height-50{
      line-height:50px;
    }
    .file-uploads {
      vertical-align: bottom;
    }

    .file-uploads.file-uploads-html4 {
      display: inline-block;
      position: relative;
      width: 70px;
      height: 40px;
      line-height:1;
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
  }
</style>
