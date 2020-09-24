<template>
  <div class="app-container">
    <div class="bg p2" :style="{'min-height': $store.getters.globals.height - 160 + 'px'}">
      <div v-show="checking"
           :style="{'min-height': $store.getters.globals.height - 160 + 'px'}"
           :v-loading="!checking"
           element-loading-text="文件正在导入读取数据中,请稍后......">
      </div>
      <div v-show="!checking">
        <div>
          <el-alert
            :title="title"
            type="error"
            show-icon>
          </el-alert>
        </div>
        <div class="my2" style="height: 38px;">
        <span class="f-right">
          <el-button type="primary" size="small" @click="importExcel">重新导入</el-button>
        </span>
        </div>
        <vue-upload
          class="pointer hide"
          ref="upload"
          v-model="fileList"
          :post-action="actionPath"
          :headers="headers"
          @input-file="inputFile"
          @input-filter="inputFilter"
        >
          <div>重新导入</div>
        </vue-upload>
        <div>
          <fd-table
            className="m0"
            v-bind:data="list">
            <el-table-column
              prop="name"
              width="100"
              label="姓名">
            </el-table-column>
            <el-table-column
              prop="idCard"
              width="200"
              label="身份证号">
            </el-table-column>
            <el-table-column
              prop="errorMsg"
              label="错误类型">
            </el-table-column>
            <el-table-column
              prop="rowNum"
              width="100"
              label="错误位置">
              <template slot-scope="scope">
                <span>{{scope.row.rowNum}}行</span>
              </template>
            </el-table-column>
          </fd-table>
          <fd-pagination
            :limit="limit"
            :offset="offset"
            :currentChange="currentChange"
            :sizeChange="sizeChange"
            :sizes=true
            :total= "total"
          ></fd-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import vueUpload from 'vue-upload-component'
  import FdTable from 'fd/table/src/fdTable'
  import FdPagination from 'fd/pagination/pagination'
  import { goBack } from '@/api/common'
  export default {
    name: '',
    components: { FdTable, FdPagination, vueUpload },
    props: {},
    data() {
      return {
        fileList: [],
        offset: 0,
        limit: 10,
        total: 0,
        list: [],
        checking: false,
        loading: null,
        title: '',
        failList: [],
        headers: { 'Authorization': this.$store.getters.token }
      }
    },
    computed: {
      actionPath() {
        return process.env.BASE_API + window.config.project_url + 'api/staff/importExcel?Authorization=' +
          this.$store.getters.token
      },
      result() {
        return this.$route.query.result || { failList: [] }
      }
    },
    mounted() {
      this.failList = this.result.failList
      this.total = this.failList.length
      this.title = '导入列表存在' + this.total + '处错误，请完成修改后重新导入'
      this.getData()
    },
    methods: {
      goBack,
      importExcel() {
        document.getElementById('file').click()
      },
      getData() {
        this.list = this.failList.slice(this.offset, this.offset + this.limit)
      },
      currentChange(page) {
        this.offset = (page - 1) * this.limit
        this.getData()
      },
      sizeChange(limit) {
        this.offset = 0
        this.limit = limit
        this.getData()
      },
      onProgress() {
        this.checking = true
        const options = {
          lock: true,
          text: '文件正在导入读取数据中,请稍后......'
        }
        this.loading = this.$loading(options)
      },
      uploadSuccess(data) {
        this.showResult(data)
      },
      inputFilter(newFile, oldFile, prevent) {
        this.$refs.upload.active = true
      },
      inputFile(newFile, oldFile) {
        if (newFile.progress) {
          this.onProgress()
        }
        if (newFile.success) {
          this.uploadSuccess(newFile.response)
        }
      },
      showResult(result) {
        this.checking = false
        this.loading.close()
        if (result && result.verfiyFail) {
          this.failList = result.failList
          this.total = this.failList.length
          this.title = '导入列表存在' + this.total + '处错误，请完成修改后重新导入'
          this.getData()
        } else {
          this.goBack()
        }
      }
    },
    watch: {
    }
  }
</script>

<style lang="scss">
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

