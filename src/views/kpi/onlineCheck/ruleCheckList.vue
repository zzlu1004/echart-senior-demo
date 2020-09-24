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
            <el-col v-if="detailRule.staffName" :span="8">
              <div class="f-left pr1 color-title">考核对象:</div>
              <div class="hidden text-indent0">{{detailRule.staffName}}</div>
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
            @sort-change="sortByNum"
            style="width: 100%">
            <el-table-column
                prop="departName"
                label="部门">
            </el-table-column>
            <el-table-column
                prop="staffName"
                label="姓名">
                <template slot-scope="scope">
                    <span class="color-blue pointer" @click="seeCheckDetail(detailRule, scope.row)">{{scope.row.staffName}}</span>
                </template>
            </el-table-column>
            <fd-check-columns
                v-for="item of tree"
                :key="item.menuId"
                :indexMenuId="indexMenuId"
                :label="item.menuName"
                :redFlag="redFlag"
                v-on:getRed="getRed"
                :edit="edit"
                :indexs="tableData"
                :data="item"></fd-check-columns>
        </el-table>
      </div>
      <div class="fixed-bottom">
        <div class="pt2">
          <el-button size="small" type="primary" @click="goBack">返回</el-button>
          <el-button :disabled="withDrawStaffs.length === 0" size="small" type="primary" @click="revocationBatch">批量撤回</el-button>
          <div style="display: inline-block;" class="mr2" v-if="isCheck && edit">
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
          <el-button v-if="isCheck && edit" size="small" type="primary" @click="downloadTableDetail">导出</el-button>
          <el-button v-if="show1" size="small" type="primary" @click="previousRule">上一个</el-button>
          <el-button v-if="show2" size="small" type="primary" @click="nextRule">下一个</el-button>
          <span v-if="isCheck && edit" class="btn-space" @click="saveDraft">
            <pop-btn text="保存草稿" content="保存草稿后，需要再点击提交才能完成分数审核工作"></pop-btn>
          </span>
          <el-button v-if="isCheck && edit" class="btn-space" size="small" type="primary" @click="saveSubmit">提交</el-button>
          <el-button v-if="isCheck && !edit" size="small" type="primary" @click="fillTable">审核</el-button>
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
  </div>
</template>

<script>
  import fdDialog from 'fd/dialog/src/dialog.vue'
  import { seeRegularDetail } from '@/api/kpi/onlineCheck/checkList'
  import { getRuleDetailById, refreshTableData, saveDraft, saveSubmit,
    getTragetData, getAllRuleToTab, revocationBatch, saveSuccess,
    previousRule, nextRule, fillReport, fillCheck, getAllRuleIds, seeCheckDetail, getRed, sortByNum,
    inputTableDetail, downloadTableDetail, uploadSuccess, fillTable, beforeAvatarUpload } from '@/api/kpi/onlineCheck/ruleCheckList'
  import { goBack } from '@/api/common'
  import FdCheckColumns from '../components/fdCheckColumns.vue'
  import FdRevocationBatch from './revocationBatch'
  import popBtn from 'fd/popoverButton/src/popBtn.vue'
  export default {
    name: '',
    data() {
      return {
        indexMenuId: '',
        isShow: false,
        fileList: [],
        height: (this.$store.getters.globals.height - 100) + 'px',
        headers: { 'Authorization': this.$store.getters.token },
        page: '',
        resource: '',
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
        targetType: {},
        tree: [],
        heads: [],
        staffId: this.$store.getters.user.id,
        edit: false,
        statusObj: {
          'report': '待提交',
          'check': '待审核'
        },
        isCheck: true,
        redFlag: false,
        indexCount: 0,
        indexTotal: 0,
        typeName: '',
        fileName: '列表',
        ruleParams: {
          offset: 0,
          limit: 1,
          type: 'to_approve'
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
      FdCheckColumns, FdRevocationBatch, fdDialog, popBtn
    },
    methods: {
      seeRegularDetail, saveDraft, saveSubmit, inputTableDetail,
      getRuleDetailById, refreshTableData, goBack, getTragetData, previousRule, nextRule,
      fillReport, fillCheck, getAllRuleIds, seeCheckDetail, getRed, downloadTableDetail, uploadSuccess,
      getAllRuleToTab, fillTable, beforeAvatarUpload, revocationBatch, saveSuccess, sortByNum,
      handerSuccess(file, fileList) {
        this.uploadSuccess(file)
      },
      handerError(err, file, fileList) {
        var mes = err['message']
        var start = mes.indexOf('导入失败：')
        var end = mes.indexOf('","data"')
        var message = mes.slice(start, end)
        this.$message.error(message)
      },
      sureSave() {
        this.$refs.revocation.revocationSave()
      }
    },
    computed: {
      actionPath() {
        return process.env.BASE_API + window.config.project_url + 'api/assessments/blocks/' + this.params.blockId + '/import?Authorization=' +
          this.$store.getters.token
      },
      importParams() {
        return {
          schemaId: this.params.schemaId,
          blockId: this.params.blockId,
          schemaBlockType: this.params.schemaBlockType,
          type: 'approve'
        }
      }
    },
    mounted() {
      this.obj = JSON.parse(localStorage.getItem('obj'))
      // 判断审核按钮是否显示
      if (this.obj.from === 'rule') {
        this.isCheck = this.obj.originalCheck
      } else {
        this.isCheck = this.obj.isCheck
      }
      this.checkType = this.obj.checkType
      this.operateType = this.obj.operateType
      this.page = this.obj.page
      this.resource = this.obj.resource
      this.type = this.obj.type
      // 判断是否进入编辑页面
      this.edit = this.page === 'edit'
      this.id = this.$route.query.blockId || ''
      this.ruleParams.offset = this.$route.query.index || 0
      // 从上一个页面带来的方案id，细则id，考核类别，本人登录的人员id
      this.params = {
        schemaId: this.$route.query.schemaId || '',
        blockId: this.$route.query.blockId || '',
        schemaBlockType: this.$route.query.schemaBlockType || '',
        type: 'approve'
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
