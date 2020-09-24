<template>
  <div class="app-container">
    <div class="bg-white container-inner has-fixed-bottom clearfix h14 check-list" :style="{'min-height':height}">
      <div class="bd-dashed-bottom pb2 mb2">
        <div class="clearfix mb2 height50 line-height-50">
          <div class="f-left color-title bold h20">{{blockName || '--'}}</div>
        </div>
        <div>
          <el-row class="mb2">
            <el-col :span="8">
              <div class="f-left pr1 color-title">所属方案:</div>
              <div class="hidden text-indent0">{{detailRule.schemaName || '--'}}</div>
            </el-col>
            <el-col :span="8">
              <div class="f-left pr1 color-title">考核周期:</div>
              <div class="hidden text-indent0">{{detailRule.startTime || '--'}}至{{detailRule.endTime || '--'}}</div>
            </el-col>
            <el-col :span="8">
              <div class="f-left pr1 color-title">上报截止时间:</div>
              <div class="hidden text-indent0">{{detailRule.deadlineTime || '--'}}</div>
            </el-col>
          </el-row>
          <el-row class="mb1">
            <el-col :span="8">
              <div class="f-left pr1 color-title">考核部门数:</div>
              <div class="hidden text-indent0">{{totalNum || '--'}}</div>
            </el-col>
            <el-col :span="8">
              <div class="f-left pr1 color-title">考核类别:</div>
              <div class="hidden text-indent0">{{typesMap[detailRule.schemaBlockType] || '--'}}</div>
            </el-col>
          </el-row>
        </div>
      </div>
    <div v-if="isShow">
        <el-table
            id="tableDetail"
            :data="tableData"
            border
            style="width: 100%">
            <fd-columns
                v-for="item of tree"
                :key="item.menuId"
                :label="item.menuName"
                @showbox="toshow"
                :edit="edit"
                :indexs="tableData"
                :isactive="isactive"
                :gearChooseArr="gearChooseArr"
                :data="item"></fd-columns>
        </el-table>
      </div>
      <div class="fixed-bottom">
        <div class="pt2">
          <el-button size="small" type="primary" @click="goBack">返回</el-button>
          <el-button v-if="show1" size="small" type="primary" @click="previousRule">上一个</el-button>
          <el-button v-if="show2" size="small" type="primary" @click="nextRule">下一个</el-button>
          <el-button v-if="!edit" :disabled="allStatus === 'completed' || isWithdraw" size="small" type="primary" @click="withdrawAll">全部撤回</el-button>
          <el-button :disabled="allStatus === 'completed'" v-if="edit" size="small" type="primary" @click="resetAll">重置</el-button>
          <span v-if="edit" class="btn-space" @click="saveDraft">
            <pop-btn :disabled="allStatus === 'completed'" text="保存草稿" content="保存草稿后，需要再点击提交才能完成指标评测工作"></pop-btn>
          </span>
          <el-button v-if="edit" :disabled="allStatus === 'completed'" class="btn-space" size="small" type="primary" @click="saveSubmit">提交</el-button>
          <el-button v-if="!edit" :disabled="!isFill"  size="small" type="primary" @click="fillTable">填报</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { seeRegularDetail } from '@/api/kpi/onlineCheck/checkList'
  import { getRuleDetailById, refreshTableData, saveDraft, withdrawAll, resetAll, fillTable,
    saveSubmit, getTragetData, previousRule, nextRule, getAllRuleIds, onProgress } from '@/api/kpi/onlineCheckDepart/mzReportListDepart'
  import { goBack } from '@/api/common'
  import FdColumns from '../components/onlineCheckCom/fdMzColumns.vue'
  import popBtn from 'fd/popoverButton/src/popBtn.vue'
  export default {
    name: 'mzReportListDepart',
    data() {
      return {
        fileList: [],
        height: (this.$store.getters.globals.height - 100) + 'px',
        headers: { 'Authorization': this.$store.getters.token },
        page: '',
        // 重新刷新表格，解决多级表头刷新时的丢列问题
        isShow: false,
        isactive: [],
        fillClick: '',
        id: '',
        detailRule: {},
        totalNum: 0,
        params: {},
        gearNum: [],
        typesMap: {
          'k10015-01': '综合绩效',
          'k10015-02': '审判绩效',
          'k10015-03': '民主测评',
          'k10015-04': '新民主测评'
        },
        tableData: [],
        indexCount: 0,
        indexTotal: 0,
        targetType: {},
        tree: [],
        heads: [],
        staffId: this.$store.getters.user.id,
        edit: false,
        statusObj: {
          'report': '待提交',
          'check': '待审核'
        },
        isFill: true,
        isWithdraw: false,
        typeName: '',
        fileName: '列表',
        blocks: [],
        total: 0,
        show1: false,
        hasActive: false,
        loading: null,
        show2: false,
        obj: {},
        index: 0,
        blockGroup: [],
        allStatus: '',
        withDrawIndexs: [],
        withDrawStaffs: [],
        parentParams: {},
        gearChooseArr: [],
        blockName: ''
      }
    },
    components: {
      popBtn,
      FdColumns
    },
    methods: {
      seeRegularDetail, saveDraft, withdrawAll, resetAll, saveSubmit, getAllRuleIds,
      getRuleDetailById, refreshTableData, goBack, getTragetData, previousRule, nextRule, onProgress, fillTable,
      toshow(msg) {
        this.gearChooseArr = msg
      }
    },
    computed: {
    },
    mounted() {
      this.blockName = this.$route.query.blockName
      this.obj = JSON.parse(localStorage.getItem('obj'))
      this.blockGroup = JSON.parse(localStorage.getItem('blocks'))
      this.checkType = this.obj.checkType
      this.operateType = this.obj.operateType
      this.page = this.obj.page
      this.type = this.obj.type
      // 判断是否进入编辑页面
      this.edit = this.obj.page === 'edit'
      this.id = this.$route.query.blockId || ''
      this.index = this.$route.query.index || 0
      // 从上一个页面带来的方案id，细则id，考核类别，本人登录的人员id
      this.params = {
        schemaId: this.$route.query.schemaId || '',
        schemaBlockType: this.$route.query.schemaBlockType || '',
        type: 'fill'
      }
      this.getAllRuleIds()
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
