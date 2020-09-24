<template>
  <div class="help">
    <div class="" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="tab-box">
        <div class="bg-white helpHeader">
          <span class="helpCenter">帮助中心</span>
          <!-- <span class="sysTip" >系统提示</span> -->
          <span class="sysTip">
            <el-popover
              content="IE9浏览器不支持预览PDF文件，建议使用谷歌、搜狐、360或者IE11浏览器。"
              placement="bottom"
              trigger="hover"
              width="310">
                <i class="at color-d9d9d9 pointer" slot="reference">系统提示</i>
            </el-popover>
          </span>
        </div>
        <el-tabs v-model="indexModels" type="card"  @tab-click="this.getList">
          <el-tab-pane label="操作手册" name="manual">
            <div v-show="indexModels ==='manual'">
            <div class="container-inner1 " :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
              <div class="line-height-4">
              <el-row>
                <el-col :span="12">
                  <el-button @click="addHelp"  size="small" type="primary"  v-show="showAddButton" ><i class="at icon-plus"/>新增手册</el-button>
                  <span>&nbsp;</span>
                </el-col>
                <el-col :span="12" class="t-right">
                  <fd-search @search="getList" v-model="manual.keywords"></fd-search>
                </el-col>
              </el-row>
            </div>
            <div>
              <fd-new-card v-for="item of schemas"
                          class="mt-help" :key="item.id"
                          :data="item"
                          :options="options"
                          v-on:showDetail="showOperationDetail"
                          v-on:download="downloadOperation"
                          v-on:edit="editOperation"
                          v-on:delete="deleteOperation">
                <div slot='body'>
                  <el-row>
                    <el-col :span="8">
                      <span>文件大小:</span>
                      <span>{{item.fileSize}}</span>
                    </el-col>
                    <el-col :span="8">
                      <span>上传时间:</span>
                      <span>{{item.updateTime|parseTime('{y}-{m}-{d}')}}</span>
                    </el-col>
                  </el-row>
                </div>
              </fd-new-card>
            </div>
            <div v-if="schemas.length === 0">
              <fd-no-content></fd-no-content>
            </div>
            </div>
          </div>
          </el-tab-pane>
          <el-tab-pane label="操作视频" name="video">
            <div v-show="indexModels ==='video'">
              <div class="container-inner1" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
              <div class="line-height-4">
              <el-row>
                <el-col :span="12">
                  <el-button  @click="addHelp"  size="small" type="primary"  v-show="showAddButton" ><i class="at icon-plus"/>新增视频</el-button>
                  <span>&nbsp;</span>
                </el-col>
                <el-col :span="12" class="t-right">
                  <fd-search @search="getList" v-model="video.keywords"></fd-search>
                </el-col>
              </el-row>
            </div>
            <div>
              <fd-new-card v-for="item of schemas"
                          class="mt2" :key="item.id"
                          :data="item"
                          :options="options"
                          v-on:showDetail="showOperationDetail"
                          v-on:download="downloadOperation"
                          v-on:edit="editOperation"
                          v-on:delete="deleteOperation">
                <div slot='body'>
                  <el-row>
                    <el-col :span="8">
                      <span>文件大小:</span>
                      <span>{{item.fileSize}}</span>
                    </el-col>
                    <el-col :span="8">
                      <span >上传时间:</span>
                      <span>{{item.updateTime|parseTime('{y}-{m}-{d}')}}</span>
                    </el-col>
                  </el-row>
                </div>
              </fd-new-card>
            </div>
            <div v-if="schemas.length === 0">
              <fd-no-content></fd-no-content>
            </div>
            </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

   <fd-dialog
      :title="editHelpTitle"
      :syncVisible="editHelpDialog"
      @beforeClose="editHelpDialog = false"
    >
      <div slot="fd-body">
        <el-row>
          <el-col :span="20">
            <el-form :rules="rules"
                     ref="helpForm"
                     :model="helpForm"
                     label-position="right"
                     label-width="35%"  v-if="this.indexModels === 'manual'">
              <el-form-item label="手册编号" prop="sort">
                <el-input
                  v-model="helpForm.sort"
                  clearable
                  placeholder="请输入"
                  >
                </el-input>
              </el-form-item>
              <el-form-item label="手册名称" prop="manualName">
                <el-input
                  v-model="helpForm.manualName"
                  clearable
                  placeholder="请输入"
                  >
                </el-input>
              </el-form-item>
              <el-form-item label="上传手册">
                  <el-upload
                     ref="upload"
                     class="avatar-uploader"
                     :class="{uploadSty:showBtnImg,disuploadSty:noneBtnImg}"
                     :on-remove="handleRemove"
                     :action="action"
                     :file-list="fileList"
                     :headers="headers"
                     :auto-upload="false"
                     :multiple=false
                     :limit="1"
                     :on-change="fileChange"
                     :on-success="uploadSuccess"
                     accept=".pdf,.mp4,.avi,.wmv">
                     <el-button size="small" slot="trigger" type="primary" >选取文件</el-button>
                  </el-upload>
                  <span :class="{uploadSpanSty:showBtnImg,disuploadSpanSty:noneBtnImg}" >只可上传PDF格式，最大不超过10M。</span>
              </el-form-item>
            </el-form>
            <el-form :model="helpForm"
                     :rules="rules"
                     label-position="right"
                     label-width="35%"
                     ref="helpForm"  v-if="this.indexModels === 'video'">
              <el-form-item label="视频编号" prop="sort">
                <el-input
                  clearable
                  placeholder="请输入"
                  v-model="helpForm.sort"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="视频名称" prop="manualName">
                <el-input
                  clearable
                  placeholder="请输入"
                  v-model="helpForm.manualName"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="上传视频">
                <el-upload
                  :action="action"
                  :auto-upload="false"
                  :class="{uploadSty:showBtnImg,disuploadSty:noneBtnImg}"
                  :file-list="fileList"
                  :headers="headers"
                  :limit="1"
                  :multiple=false
                  :on-change="fileChange"
                  :on-remove="handleRemove"
                  :on-success="uploadSuccess"
                  accept=".pdf,.mp4,.avi,.wmv"
                  class="avatar-uploader"
                  ref="upload">
                  <el-button size="small" slot="trigger" type="primary" >选取文件</el-button>
                </el-upload>
                <span :class="{uploadSpanSty:showBtnImg,disuploadSpanSty:noneBtnImg}" >可上传MP4,AVI,WMV格式，视频最大不超过50M。</span>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
      </div>
      <div slot="fd-footer">
        <el-button size="small" @click="cancelHelp">取消</el-button>
        <el-button size="small" type="primary" @click="saveHelp">确定</el-button>
      </div>
    </fd-dialog>

  </div>
</template>



<script>
  import {
    getList,
    showOperationDetail,
    deleteOperation,
    editOperation,
    downloadOperation,
    addHelp,
    cancelHelp,
    saveHelp,
    addAttach,
    handleRemove,
    getAttById,
    fileChange } from '@/api/kpi/help/help'
  import FdNewCard from 'fd/newCard/FdHelpCard'
  import FdNoContent from 'fd/noContent'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  import vueUpload from 'vue-upload-component'
  import { isNumber } from '@/utils/validate'
  export default {
    name: 'help',
    components: { fdDialog, FdNoContent, FdNewCard, vueUpload },
    data() {
      var validateValue = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入具体数值'))
        } else if ((!this.isNumber(value)) || ((value) % 1 !== 0)) {
          callback(new Error('请输入整数'))
        } else if (parseInt(value) > 10000 || parseInt(value) < 1) {
          callback(new Error('数值范围为1-9999以内'))
        } else {
          callback()
        }
      }
      return {
        showAddButton: false,
        operationId: '', // id
        isAdd: false, // 是否为新增
        indexModels: 'manual', // 选项卡标识
        manual: { // 手册查询条件
          keywords: ''
        },
        video: { // 视频查询条件
          keywords: ''
        },
        loading: null,
        editHelpDialog: false, // 弹框控制
        editHelpTitle: '操作设置', // 弹框标题
        helpForm: { // 表单字段
          sort: '',
          manualName: ''
        },
        rules: { // 表单规则
          sort: [{ required: true, validator: validateValue, trigger: 'blur' }],
          manualName: [{ required: true, message: '请输入手册名称', trigger: 'blur' }, { max: 50, message: '长度不超过50个字符', trigger: 'blur' }]
        },
        fileList: [], // 文件列表
        headers: { 'Authorization': this.$store.getters.token },
        showBtnImg: true, // 控制上传按钮显示
        noneBtnImg: false, // 控制上传按钮隐藏
        limitCountImg: 1, // 上传图片的最大数量
        schemas: [],
        options: { // 列表选项
          header: {
            left: [{
              type: 'text',
              field: 'sort',
              class: 'h16 color-title  ml1'
            }, {
              type: 'fixedText',
              class: 'h16 color-title  ml1',
              text: '.'
            }, {
              type: 'text',
              field: 'manualName',
              class: 'h16 color-title  ml1'
            }],
            right: [{
              type: 'button',
              child: [{
                text: '预览',
                show: 'showDetail',
                event: 'showDetail',
                class: 'margin-left-5'
              }, {
                text: '|',
                show: 'showDetail'
              }, {
                text: '下载',
                show: 'download',
                event: 'download',
                class: 'margin-left-5'
              }, {
                text: '|',
                show: 'edit'
              }, {
                text: '编辑',
                show: 'edit',
                event: 'edit',
                class: 'margin-left-5'
              }, {
                text: '|',
                show: 'delete'
              }, {
                text: '删除',
                show: 'delete',
                event: 'delete',
                class: 'margin-left-5 margin-right-20'
              }]
            }]
          },
          body: {},
          eventNames: ['showDetail', 'download', 'edit', 'delete']
        },
        errorMsg: {}
      }
    },
    computed: {
      action: {
        get: function() {
          return process.env.BASE_API + window.config.zuul_url + window.config.basic_url + 'api/attachments/owners/' + this.operationId
        },
        set: function() {
          return process.env.BASE_API + window.config.zuul_url + window.config.basic_url + 'api/attachments/owners/' + this.operationId
        }
      },
      elements() {
        return this.$store.getters.elements.help || {}
      }
    },
    mounted() {
      if (this.elements.add && this.elements.add) {
        this.showAddButton = true
      }
      this.getList()
    },
    methods: {
      getList,
      showOperationDetail,
      deleteOperation,
      editOperation,
      downloadOperation,
      addHelp,
      cancelHelp,
      saveHelp,
      addAttach,
      handleRemove,
      getAttById,
      isNumber,
      fileChange,
      uploadSuccess() {
        this.editHelpDialog = false
        this.getList()
        this.loading.close()
      },
      uploadError() {
        this.$message({
          type: 'error',
          message: '文件上传失败，请重新选择上传！'
        })
        return
      }
    },
    watch: {}
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.help{
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
    .blue-btn{
      height: 32px;
      line-height:16px;
      border:1px solid #1b95e7;
      color: #1b95e7;
      text-align:center;
    }
}
.tag-box {
  margin-left: 186px;
}
.helpHeader {
  padding: 24px;
  border-radius: 4px 4px 0 0;
}
.helpCenter {
  font-size: 18px;
  font-weight: 500;
}
.sysTip {
  float: right;
  padding: 0.5em;
}
.el-tabs--card /deep/ .el-tabs__header{
  border-bottom: none;
  background-color: white;
  border-radius:  0 0 4px 4px;
  padding: 0px 0px 0px 16px;
  margin: 0 0 16px;
}
.el-tabs--card /deep/ .el-tabs__header .el-tabs__nav {
  border: none;
}
.el-tabs--card /deep/ .el-tabs__header .el-tabs__item {
  border-right: none;
  border-left: none;
}
.el-tabs--card /deep/ .el-tabs__content {
  background-color: white;
  border-radius:  4px;
}
/*.tab-box {*/
  /*padding-left: 5em;*/
  /*padding-right: 5em;*/
/*}*/
.el-form-item.is-required:not(.is-no-asterisk) /deep/ .el-form-item__label:before {
  content: ''
}
.color-d9d9d9 {
  color: #1b95e7;
}
.tab-box .el-tabs__item {
  padding: none;
}
.uploadSty /deep/ .el-upload {
  display: inline-block;
}
.disuploadSty /deep/ .el-upload {
  display:none;   /* 上传按钮隐藏 */
}
.uploadSpanSty {
 display: inline-block;
}
.disuploadSpanSty {
  display:none;   /* 上传按钮隐藏 */
}
.container-inner1{
  padding: 24px;
}
.container-inner1 /deep/ .headItem {
  margin-right: -5px;
}
.el-tabs--card /deep/   .margin-left-5{
    margin-left: 5px;
  }
.el-tabs--card /deep/   .margin-right-20{
    margin-right: 20px;
  }
  .mt-help{
    margin-top: 16px;
  }
.fd-new-card{
  border-radius: 4px!important;
}
</style>
