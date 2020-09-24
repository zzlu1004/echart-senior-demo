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
        <checkListTable
          v-bind:menus="targetMenus"
          v-bind:targetMap="targetMap"
          v-bind:getTargetMsg="getTargetMsg"
          v-bind:isRedDanger="isRedDanger"
          v-on:getTragetData="getTragetData"
          v-on:getRedDanger="getRedDanger"
          v-on:refreshData="refreshData"
          :edit="edit"
          :parentParams="parentParams"
          :see="elements.see"
          :isnext="isnext"
          v-bind:rule="detailRule"
          :departName="departName"
        ></checkListTable>
      </div>
      <div class="fixed-bottom">
        <div class="pt2">
          <el-button size="small" type="primary" @click="goBack">返回</el-button>
          <el-button size="small" :disabled="revocationId.length === 0" type="primary" @click="revocationAll">全部撤回</el-button>
          <el-button v-if="show1" size="small" type="primary" @click="prevPeople">上一个</el-button>
          <el-button v-if="show2" size="small" type="primary" @click="nextPeople">下一个</el-button>
          <span v-if="isnext && edit" class="btn-space" @click="saveDraft">
            <pop-btn text="保存草稿" content="保存草稿后，需要再点击提交才能完成分数审核工作"></pop-btn>
          </span>
          <el-button class="btn-space" v-if="isnext && edit" size="small" type="primary" @click="saveSubmit">提交</el-button>
          <el-button v-if="isnext && !edit" size="small" type="primary" @click="fillTable">审核</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { goBack } from '@/api/common'
  import { seeRegularDetail, seeAttachment, recallTarget,
    getTargetById, getTragetData, saveDraft, saveSubmit, watchTarget, prevPeople, nextPeople, revocationAll,
    refreshData, getPeopleList, getTargetByUrlId,
    getPeopleListToTab, getRedDanger, fillTable } from '@/api/kpi/onlineCheckDepart/checkListDepart'
  import checkListTable from './onlineCheckCom/checkListTable.vue'
  import popBtn from 'fd/popoverButton/src/popBtn.vue'
  export default {
    name: 'checkListDepart',
    data() {
      return {
        height: (this.$store.getters.globals.height - 100) + 'px',
        params: {},
        isSubmit: false,
        targetMenus: [],
        indexData: [],
        targetMap: {},
        typesMap: {
          'k10015-01': '综合绩效',
          'k10015-02': '审判绩效',
          'k10015-03': '民主测评'
        },
        statusObj: {
          'report': '待填报',
          'check': '待审核'
        },
        detailRule: {
          departName: ''
        },
        departName: '',
        page: '',
        fillClick: '',
        checkType: '',
        id: '',
        checkData: [],
        getTargetMsg: true,
        isRedDanger: true,
        typeName: '',
        edit: false,
        visible: true,
        type: '',
        index: 0,
        departId: '',
        show1: false,
        show2: false,
        isnext: true,
        peopleParams: {
          limit: 1,
          offset: 0,
          type: 'to_approve'
        },
        total: 0,
        obj: {},
        revocationId: [],
        parentParams: {}
      }
    },
    components: {
      checkListTable, popBtn
    },
    methods: {
      seeRegularDetail, seeAttachment, recallTarget, goBack, revocationAll,
      getTargetById, getTragetData, saveDraft, saveSubmit, watchTarget, prevPeople, nextPeople,
      refreshData, getPeopleList, getTargetByUrlId, getPeopleListToTab, getRedDanger, fillTable
    },
    computed: {
      elements() {
        return this.$store.getters.elements.checkListDepart || {}
      }
    },
    mounted() {
      this.id = this.$route.query.blockId || ''
      this.departId = this.$route.query.departId || ''
      this.obj = JSON.parse(localStorage.getItem('obj'))
      // 判断审核按钮是否显示
      this.isnext = this.obj.isCheck
      this.checkType = this.obj.checkType
      this.operateType = this.obj.operateType
      this.page = this.obj.page
      this.type = this.obj.type
      this.edit = this.page === 'edit'
      // 从上一个页面带来的方案id，细则id，考核类别，本人登录的人员id
      this.params = {
        blockId: this.$route.query.blockId || '',
        schemaId: this.$route.query.schemaId || '',
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
    .el-popover{
      line-height: 1.2;
    }
  }
</style>
