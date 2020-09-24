<template>
  <div class="app-container notice">
    <div class="container-inner has-fixed-bottom bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <el-form size="small" :model="noticeForm" ref="noticeForm" :rules="rules">
        <el-form-item label="公告名称" prop="title">
          <el-input v-model="noticeForm.title"></el-input>
        </el-form-item>
        <el-form-item label="" prop="content" class="full">
          <el-input v-model="noticeForm.content" type="textarea" :autosize="{ minRows: 2, maxRows: 20 }" placeholder=""></el-input>
        </el-form-item>
        <div class="clearfix">
          <span class="f-left">
              <span class="inline-block blue-btn btn-sm px1 pointer" @click="addAttach">添加附件</span>
            <!-- <el-upload
              ref="upload"
              :action="action"
              :auto-upload="false"
              :headers="headers"
              :on-remove="handleRemove"
              multiple
              :limit="3"
              :file-list="fileList">
              <span class="inline-block blue-btn px1">添加附件</span>
            </el-upload> -->
            <vue-upload
              class="hide"
              ref="upload"
              v-model="fileList"
              :post-action="action"
              :headers="headers"
              :multiple="true"
              @input-file="inputFile"
              @input-filter="inputFilter"
            >
            </vue-upload>
          </span>
          <span class="f-left">
            <el-form-item prop="releaseDate">
              <span class="f-left time-label">预定发布时间：</span>
              <span class="f-left">
                <el-date-picker
                  v-if="$store.getters.globals.isIE"
                  class="mr1"
                  v-model="noticeForm.releaseDate"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm"
                  format="yyyy-MM-dd HH:mm"
                  :picker-options="pickerDate">
                </el-date-picker>
                <el-date-picker
                  v-else
                  class="mr1"
                  v-model="noticeForm.releaseDate"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm"
                  format="yyyy-MM-dd HH:mm"
                  :picker-options="pickerDate"
                  placeholder="选择日期时间">
                </el-date-picker>
                <el-popover
                  placement="top"
                  width="250"
                  trigger="hover"
                  content="设置预定发布时间可自动按设置时间发布内容，预定发布时间前可编辑修改">
                    <i slot="reference" class="at icon-questioncircle color-d9d9d9 pointer"/>
                </el-popover>
              </span>
              </el-form-item>
          </span>
        </div>
        <div>
          <div class="mb2 tag-box" v-for="info of fileList" :key="info.id">
              <i class="color-blue at icon-paperclip"/>
              <span class="color-blue">{{info.name}}</span>
              <i class="ml1 at icon-closecircle color-placeholder pointer delete-btn"
                @click.stop="handleRemove(info)"/>
          </div>
        </div>
      </el-form>
      <div class="fixed-bottom">
        <div class="fixed-bottom-item" @click="goBack">
          <div class="fixed-bottom-item-text">取消</div>
        </div>
        <div class="fixed-bottom-item" @click="saveDraft">
          <div class="fixed-bottom-item-text">保存草稿</div>
        </div>
        <div class="fixed-bottom-item" @click="publishNotice">
          <div class="fixed-bottom-item-text">发布</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import vueUpload from 'vue-upload-component'
  import { goBack } from '@/api/common'
  import { saveNotice, publishNotice, saveDraft, getDetail, getAttById, handleRemove,
    addAttach, toLocaleString, getUuid, getCurrentDate } from '@/api/kpi/center/editNotice'
  export default {
    name: '',
    components: {
      vueUpload
    },
    props: {},
    data() {
      return {
        action: process.env.BASE_API + window.config.zuul_url + window.config.basic_url + 'api/attachments/owners/' + this.noticeId,
        decimalNum: 10000,
        strValue: '',
        headers: { 'Authorization': this.$store.getters.token },
        noticeForm: {
          title: '',
          releaseDate: '',
          content: '',
          type: 'bulletin',
          projectCode: 'kpi',
          status: '4'
        },
        rules: {
          title: [
            { required: true, message: '请输入公告名称', trigger: 'blur' },
            { max: 50, message: '长度不超过50个字符', trigger: 'blur' }
          ]
        },
        fileList: [],
        noticeId: '',
        pickerDate: {
          disabledDate: (time) => {
            const disabledDate = (time.getTime() + 86400000) <= new Date(this.fd.tools.getNowTime()).getTime()
            return disabledDate
          }
        },
        serverTime: '',
        id: '',
        isAddAttach: false
      }
    },
    computed: {},
    mounted() {
      this.noticeId = this.$route.query.id || ''
      if (this.noticeId) {
        this.id = this.noticeId
        this.action = process.env.BASE_API + window.config.zuul_url + window.config.basic_url + 'api/attachments/owners/' +
          this.noticeId + '?Authorization=' + this.$store.getters.token
        this.noticeForm.id = this.noticeId
        this.getDetail()
        this.getAttById()
      } else {
        this.getUuid()
        this.getCurrentDate()
        // this.serverTime = this.toLocaleString(new Date(this.fd.tools.getNowTime()))
        // this.noticeForm.releaseDate = this.serverTime
      }
    },
    methods: {
      goBack, saveNotice, publishNotice, saveDraft, getDetail, getAttById, handleRemove,
      toLocaleString, getUuid, addAttach, getCurrentDate,
      alertValue(e, strValue, decimalNum) {
        e.quill.deleteText(decimalNum, 1, strValue)
      },
      inputFilter(newFile, oldFile, prevent) {
      },
      inputFile(newFile, oldFile) {
        if (newFile && newFile.success) {
          this.goBack()
        }
      }
    },
    watch: {
    }
  }
</script>

<style lang="scss">
  .notice{
    .color-d9d9d9{
      color:#d9d9d9;
    }
    .el-textarea__inner{
      height: 300px;
    }
    .blue-btn{
      height: 32px;
      line-height:16px;
      border:1px solid #1b95e7;
      color: #1b95e7;
      text-align:center;
    }
    .time-label{
      height:32px;
      line-height:32px;
      width:145px;
      padding-left:24px;
    }
    .tag-box:hover .delete-btn{
      display:inline-block;
    }
    .tag-box .delete-btn{
        display:none;
    }
  }
  .el-popover{
    font-size:12px;
  }
  .file-uploads.file-uploads-html4 {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 40px;
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
</style>
