<template>
<div class="app-container">
  <div class="bg-white container-inner has-fixed-bottom clearfix h14 check-list" :style="{'min-height':height}">
      <div class="bd-dashed-bottom mb2">
          <div class="clearfix mb2 height-title">
              <div class="f-left color-title bold h20" v-if="type==='people'">{{detailRule.departName}}</div>
              <div class="f-left color-title bold h20" v-else>{{detailRule.blockName}}</div>
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
              <el-row class="mb2">
                  <el-col :span="8">
                      <div class="f-left pr1 color-title">考核类别:</div>
                      <div class="hidden text-indent0">{{typesMap[detailRule.schemaBlockType]}}</div>
                  </el-col>
                  <el-col v-if="type==='people'" :span="8">
                      <div class="f-left pr1 color-title">所属细则:</div>
                      <div class="hidden text-indent0">{{detailRule.blockName}}</div>
                  </el-col>
                  <el-col v-else :span="8">
                      <div class="f-left pr1 color-title">考核对象:</div>
                      <div class="hidden text-indent0">{{detailRule.departName}}</div>
                  </el-col>
              </el-row>
          </div>
      </div>
      <div>
          <reportListTable
              v-bind:menus="targetMenus"
              v-bind:targetMap="targetMap"
              v-bind:getTargetMsg="getTargetMsg"
              v-bind:isRedDanger="isRedDanger"
              v-bind:unfill="unfill"
              v-on:getTragetData="getTragetData"
              v-on:getUnfillIndexCnt="getUnfillIndexCnt"
              v-on:getRedDanger="getRedDanger"
              v-on:refreshData="refreshData"
              v-on:refreshAttach="refreshAttach"
              :edit="edit"
              :see="elements.see"
              :isfirst="isfirst"
              originalPage="myReportList"
              v-bind:rule="detailRule"
              :parentParams="parentParams"
              :departName="departName"
              ></reportListTable>
      </div>
    <div class="fixed-bottom">
      <div class="pt2">
        <el-button size="small" type="primary" @click="goBack">返回</el-button>
        <el-button size="small" :disabled="revocationId.length === 0" type="primary" @click="revocationAll">全部撤回</el-button>
        <el-button v-if="resource === 'other' && show1" size="small" type="primary" @click="prevPeople">上一个</el-button>
        <el-button v-if="resource === 'other' && show2" size="small" type="primary" @click="nextPeople">下一个</el-button>
        <span v-if="isfirst && edit" class="btn-space" @click="saveDraft">
          <pop-btn text="保存草稿" content="保存草稿后，需要再点击提交才能完成分数填报工作"></pop-btn>
        </span>
        <el-button v-if="isfirst && edit" class="btn-space" size="small" type="primary" @click="saveSubmit">提交</el-button>
        <el-button v-if="isfirst && !edit" size="small" type="primary" @click="fillTable">填报</el-button>
      </div>
    </div>
  </div>
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
  import { goBack } from '@/api/common'
  import { seeRegularDetail, seeAttachment, recallTarget, revocationAll,
    handleRemove, handlePreview, handleExceed, beforeRemove, addAttachment, sureAddAttach,
    getTargetById, getTragetData, saveDraft, saveSubmit, watchTarget, prevPeople, nextPeople,
    refreshData, refreshAttach, getPeopleList, getTargetByUrlId,
    getPeopleListToTab, getRedDanger, fillTable, getUnfillIndexCnt } from '@/api/kpi/onlineCheckDepart/reportListDepart'
  import reportListTable from './onlineCheckCom/reportListTable.vue'
  import popBtn from 'fd/popoverButton/src/popBtn.vue'
  export default {
    name: 'myReportListDepart',
    data() {
      return {
        height: (this.$store.getters.globals.height - 100) + 'px',
        params: {},
        errorMsg: '',
        isSubmit: false,
        targetMenus: [],
        indexData: [],
        targetMap: {},
        typesMap: {
          'k10015-01': '综合绩效',
          'k10015-02': '审判绩效',
          'k10015-03': '民主测评',
          'k10015-04': '部门考核'
        },
        revocationId: [],
        statusObj: {
          'report': '待填报',
          'check': '待审核'
        },
        detailRule: {
          departName: ''
        },
        departName: '',
        page: '',
        resource: '',
        fillClick: '',
        checkType: '',
        id: '',
        checkData: [],
        getTargetMsg: true,
        typeName: '',
        edit: false,
        type: '',
        index: 0,
        staffId: '',
        show1: false,
        show2: false,
        visible: false,
        isfirst: true,
        peopleData: [],
        peopleParams: {
          limit: 1,
          offset: 0,
          type: 'to_fill'
        },
        total: 0,
        isRedDanger: true,
        unfill: true, // 用于判断是否还有未填报的指标，系统将默认为0
        obj: {},
        attachCnt: {},
        parentParams: {}
      }
    },
    components: {
      reportListTable, popBtn, fdDialog
    },
    methods: {
      seeRegularDetail, goBack, seeAttachment, recallTarget, handleRemove, revocationAll,
      handlePreview, handleExceed, beforeRemove, addAttachment, sureAddAttach, getTargetById, getTragetData,
      watchTarget, saveDraft, saveSubmit, prevPeople, nextPeople, refreshData, getPeopleList,
      getTargetByUrlId, getPeopleListToTab, getRedDanger, fillTable, refreshAttach, getUnfillIndexCnt
    },
    computed: {
      elements() {
        return this.$store.getters.elements.myReportListDepart || {}
      }
    },
    mounted() {
      this.id = this.$route.query.blockId || ''
      this.staffId = this.$route.query.staffId || ''
      this.obj = JSON.parse(localStorage.getItem('obj'))
      // 判断填报按钮是否显示 填报的指标全部为待审核状态时不显示
      this.isfirst = this.obj.isFill
      this.checkType = this.obj.checkType
      this.operateType = this.obj.operateType
      this.page = this.obj.page
      this.resource = this.obj.resource
      this.type = this.obj.type
      // this.edit = (this.page === 'edit' || this.fillClick === 'fillReport' || (this.page === 'otherCheck' && this.operateType === 'check'))
      this.edit = this.page === 'edit'
      // 从上一个页面带来的方案id，细则id，考核类别，本人登录的人员id
      this.params = {
        blockId: this.$route.query.blockId || '',
        schemaId: this.$route.query.schemaId || '',
        departId: this.$route.query.departId || '',
        schemaBlockType: this.$route.query.schemaBlockType || ''
      }
      this.peopleParams.offset = this.$route.query.index || 0
      this.getTargetByUrlId()
      this.getPeopleListToTab()
    },
    watch: {
      indexData(d) {
        const data = this.fd.data.changeListKey(d, { indexId: 'menuId' })
        this.targetMap = this.fd.data.arrayToObj(data, 'menuId')
      }
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
}
</style>
