<template>
  <div class="resume">
    <div class="px2 mb2" style="height:40px;line-height:40px">
      <span class="color-title h16 f-left bold">简历信息</span>
      <span class="f-right">
        <!-- <div class="ml3 inline-block">
          <div class="btn btn-default btn-sm" v-show="elements.import && edit" @click="beforeUpload">
            <el-upload
            ref="upload"
            class="avatar-uploader"
            :action="actionPath"
            :show-file-list=false
            :headers="headers"
            :on-progress="onProgress"
            :disabled="hasActive"
            :on-success="uploadSuccess"
            :multiple=false>
                    <div>
                      导入
                    </div>
                  </el-upload></div>
        </div> -->
        <vue-upload
          class="hide"
          ref="upload"
          v-model="fileList"
          :post-action="actionPath"
          :headers="headers"
          @input-file="inputFile"
          @input-filter="inputFilter"
        >
          <span class="inline-block blue-btn px1">导入</span>
        </vue-upload>
        <div v-if="elements.import && edit" class="ml3 inline-block"><div class="btn btn-default btn-sm" @click="beforeUpload('resume')">导入</div></div>
        <div v-if="elements.export" class="ml3 inline-block"><div class="btn btn-default btn-sm" @click="downloadResume">导出</div></div>
        <div v-if="elements.edit && edit" class="ml3 inline-block"><div class="btn btn-default btn-sm" @click="addResume">新增</div></div>
      </span>
    </div>
    <div class="h14 px2 relative">
      <fd-table :option="resumeOption"></fd-table>
      <div v-if="total>resumeOption.data.length" class="center color-blue pointer py1" @click="getResume">更多...</div>
    </div>
    <fd-dialog
      :title="modelTitle"
      :syncVisible="addResumeDialog"
      @beforeClose="addResumeDialog = false"
    >
      <div slot="fd-body">
        <el-row>
          <el-col :span="20">
            <el-form :model="formData"
                    :rules="rules"
                    ref="resumeForm"
                    label-width="35%"
                    label-position="right"
                    class="demo-ruleForm">
              <el-form-item label="起始日期" prop="startDate">
                <el-date-picker
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  :editable=false
                  v-model="formData.startDate"
                  :picker-options="startDateOpt"
                  @change="changeStartDate"
                  style="width: 100%;"></el-date-picker>
              </el-form-item>
              <el-form-item label="截止日期" prop="endDate">
                <el-date-picker
                  type="date"
                  :editable=false
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  v-model="formData.endDate"
                  :picker-options="endDateOpt"
                  @change="changeEndDate"
                  style="width: 100%;"></el-date-picker>
              </el-form-item>
              <el-form-item label="所在单位" prop="companyName">
                <el-input
                  v-model="formData.companyName"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
              <el-form-item label="所在部门" prop="departName">
                <el-input
                  v-model="formData.departName"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
              <el-form-item label="职务" prop="position">
                <el-input
                  v-model="formData.position"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
              <el-form-item label="职级" prop="level">
                <el-input
                  v-model="formData.level"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
              <el-form-item label="是否上任免表" prop="isAssume">
                <el-input
                  v-model="formData.isAssume"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
              <el-form-item label="证明人" prop="witness">
                <el-input
                  v-model="formData.witness"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
              <el-form-item label="补充内容" prop="comments">
                <el-input
                  v-model="formData.comments"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
      </div>
      <div slot="fd-footer">
        <el-button size="small" @click="addResumeDialog = false">取消</el-button>
        <el-button size="small" type="primary" @click="saveResume">确定</el-button>
      </div>
    </fd-dialog>
  </div>
</template>

<script>
  import fdTable from 'fd/table'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  import { resetForm } from '@/api/kpi/record'
  import vueUpload from 'vue-upload-component'
  import { beforeUpload, onProgress, changeEndDate, changeStartDate, getResume, addResume, downloadResume,
    editResume, saveResume, deleteResume, inputFilter, inputFile, uploadError } from '@/api/kpi/record/personalDetail'
  export default {
    name: 'FdPersonalResume',
    components: {
      fdTable, vueUpload, fdDialog
    },
    props: {
      edit: {
        type: Boolean,
        default: true
      },
      hasActive: {
        type: Boolean,
        default: true
      },
      userInfo: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        total: 0,
        modelTitle: '设置简历信息',
        fileList: [],
        headers: { 'Authorization': this.$store.getters.token, staffId: this.userInfo.id },
        addResumeDialog: false,
        params: {
          limit: 3,
          offset: 0
        },
        startDateOpt: {},
        endDateOpt: {},
        resumeOption: {
          stripe: true,
          data: [],
          border: true,
          columns: [
            {
              field: 'index',
              width: '55px',
              title: '序号'
            }, {
              field: 'startDate',
              title: '起始日期',
              formatter: (row, value) => {
                const val = value || '--'
                return val
              }
            }, {
              field: 'endDate',
              title: '截止日期',
              formatter: (row, value) => {
                const val = value || '--'
                return val
              }
            }, {
              field: 'companyName',
              title: '所在单位'
            }, {
              field: 'departName',
              title: '所在部门'
            }, {
              field: 'position',
              title: '职务'
            }, {
              field: 'level',
              title: '职级'
            }, {
              field: 'comments',
              title: '补充内容'
            }
          ]
        },
        formData: {
          startDate: '',
          endDate: '',
          departName: '',
          companyName: '',
          position: '',
          level: '',
          isAssume: '',
          witness: '',
          comments: ''
        },
        loading: null,
        rules: {
          companyName: [{ required: true, message: '请输入所在单位', trigger: 'blur' },
            { max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          startDate: [{ required: true, message: '请选择起始日期', trigger: 'change' }],
          departName: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          position: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          level: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          witness: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          comments: [{ max: 500, message: '长度不超过500个字符', trigger: 'blur' }]
        },
        // 树结构存储的部门信息
        accordion: true,
        treeDepart: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.personal || {}
      },
      actionPath() {
        return process.env.BASE_API + window.config.project_url + 'api/staff/resume/import?staffId=' + this.userInfo.id + '&Authorization=' +
          this.$store.getters.token
      }
    },
    mounted() {
      if (this.edit) {
        this.resumeOption.columns.push({
          field: '',
          title: '操作',
          width: '150px',
          number: [{ text: '编辑', type: 'text', show: 'isEdit', click: (d, row) => { this.editResume(row) } },
            { text: '删除', type: 'text', show: 'isEdit', click: (d, row) => { this.deleteResume(row) } }]
        })
      }
      this.getResume()
    },
    methods: {
      resetForm,
      beforeUpload,
      onProgress,
      inputFilter, inputFile, uploadError,
      uploadSuccess() {
        this.loading.close()
        this.resumeOption.data = []
        this.getResume()
      },
      changeEndDate, changeStartDate, getResume, addResume, downloadResume, editResume, saveResume, deleteResume
    },
    watch: {}
  }
</script>

<style scoped>
</style>
