<template>
  <div class="education">
    <div class="px2 mb2" style="height:40px;line-height:40px">
      <span class="color-title h16 f-left bold">学习经历</span>
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
            </el-upload>
          </div>
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
        <div class="ml3 inline-block" v-if="elements.import && edit"><div class="btn btn-default btn-sm" @click="beforeUpload('education')">导入</div></div>
        <div class="ml3 inline-block" v-if="elements.export"><div class="btn btn-default btn-sm" @click="downloadEducation">导出</div></div>
        <div class="ml3 inline-block" v-if="elements.edit && edit"><div class="btn btn-default btn-sm" @click="addEducation">新增</div></div>
      </span>
    </div>
    <div class="h14 px2 relative">
      <fd-table :option="educationOption"></fd-table>
      <div v-if="total>educationOption.data.length" class="center color-blue pointer py1" @click="getEducation">更多...</div>
    </div>
    <fd-dialog
      :title="modelTitle"
      :syncVisible="addEducationDialog"
      @beforeClose="addEducationDialog = false"
    >
      <div slot="fd-body">
        <el-row>
          <el-col :span="20">
            <el-form :model="formData"
                    :rules="rules"
                    ref="educationForm"
                    label-width="35%"
                    label-position="right"
                    class="demo-ruleForm">
              <el-form-item label="学历" prop="degreeName">
                <el-input
                  v-model="formData.degreeName"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
              <el-form-item label="学位" prop="academicDegree">
                <el-input
                  v-model="formData.academicDegree"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
              <el-form-item label="所学专业" prop="major">
                <el-input
                  v-model="formData.major"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
              <el-form-item label="所学专业名称补充" prop="majorDetail">
                <el-input
                  v-model="formData.majorDetail"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
              <el-form-item label="学校(单位)名称" prop="schoolName">
                <el-input
                  v-model="formData.schoolName"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
              <el-form-item label="教育形式" prop="educationType">
                <el-input
                  v-model="formData.educationType"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
              <el-form-item label="学校类别" prop="schoolType">
                <el-input
                  v-model="formData.schoolType"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
              <el-form-item label="学习形式" prop="leaningType">
                <el-input
                  v-model="formData.leaningType"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
              <el-form-item label="入学日期" prop="entranceDate">
                <el-date-picker
                  type="date"
                  :editable=false
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  v-model="formData.entranceDate"
                  style="width: 100%;"></el-date-picker>
              </el-form-item>
              <el-form-item label="毕(肆)业日期" prop="graduationDate">
                <el-date-picker
                  type="date"
                  :editable=false
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  v-model="formData.graduationDate"
                  style="width: 100%;"></el-date-picker>
              </el-form-item>
              <el-form-item label="学制" prop="schoolSystem">
                <el-input
                  v-model="formData.schoolSystem"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
              <el-form-item label="授予单位" prop="companyName">
                <el-input
                  v-model="formData.companyName"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
              <el-form-item label="学校所在国家" prop="schoolCountry">
                <el-input
                  v-model="formData.schoolCountry"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
              <el-form-item label="进院学历" prop="preDegreeName">
                <el-input
                  v-model="formData.preDegreeName"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
              <el-form-item label="是否当前信息" prop="isInfo">
                <el-input
                  v-model="formData.isInfo"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
      </div>
      <div slot="fd-footer">
        <el-button size="small" @click="addEducationDialog = false">取消</el-button>
        <el-button size="small" type="primary" @click="saveEducation">确定</el-button>
      </div>
    </fd-dialog>
  </div>
</template>

<script>
  import fdTable from 'fd/table'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  import { resetForm } from '@/api/kpi/record'
  import vueUpload from 'vue-upload-component'
  import { beforeUpload, onProgress, getEducation, addEducation, downloadEducation, editEducation, saveEducation,
    deleteEducation, inputFilter, inputFile, uploadError } from '@/api/kpi/record/personalDetail'
  export default {
    name: 'FdPersonalEducation',
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
        fileList: [],
        modelTitle: '设置学习简历',
        headers: { 'Authorization': this.$store.getters.token, staffId: this.userInfo.id },
        addEducationDialog: false,
        params: {
          limit: 3,
          offset: 0
        },
        startDateOpt: {},
        endDateOpt: {},
        educationOption: {
          stripe: true,
          data: [],
          border: true,
          columns: [
            {
              field: 'index',
              width: '55px',
              title: '序号'
            }, {
              field: 'degreeName',
              title: '学历',
              minWidth: '120'
            }, {
              field: 'academicDegree',
              title: '学位',
              minWidth: '120'
            }, {
              field: 'major',
              title: '所学专业',
              minWidth: '150'
            }, {
              field: 'majorDetail',
              title: '所学专业名称补充',
              minWidth: '150'
            }, {
              field: 'schoolName',
              title: '学校(单位)名称',
              minWidth: '150'
            }, {
              field: 'educationType',
              title: '教育形式',
              minWidth: '120'
            }, {
              field: 'schoolType',
              title: '学校类别',
              minWidth: '120'
            }, {
              field: 'leaningType',
              title: '学习形式',
              minWidth: '120'
            }, {
              field: 'entranceDate',
              title: '入学日期',
              minWidth: '120',
              formatter: (row, value) => {
                const val = value || '--'
                return val
              }
            }, {
              field: 'graduationDate',
              title: '毕(肆)业日期',
              minWidth: '120',
              formatter: (row, value) => {
                const val = value || '--'
                return val
              }
            }, {
              field: 'schoolSystem',
              title: '学制',
              minWidth: '120'
            }, {
              field: 'companyName',
              title: '授予单位',
              minWidth: '150'
            }, {
              field: 'schoolCountry',
              title: '学校所在国家',
              minWidth: '120'
            }, {
              field: 'preDegreeName',
              title: '进院学历',
              minWidth: '120'
            }, {
              field: 'isInfo',
              title: '是否当前信息',
              minWidth: '120'
            }
          ]
        },
        formData: {
          degreeName: '',
          academicDegree: '',
          major: '',
          majorDetail: '',
          schoolName: '',
          educationType: '',
          schoolType: '',
          leaningType: '',
          entranceDate: '',
          graduationDate: '',
          schoolSystem: '',
          companyName: '',
          schoolCountry: '',
          preDegreeName: '',
          isInfo: ''
        },
        loading: null,
        rules: {
          degreeName: [{ required: true, message: '请输入学历', trigger: 'blur' },
            { max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          academicDegree: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          major: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          majorDetail: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          schoolName: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          educationType: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          schoolType: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          leaningType: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          preDegreeName: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          isInfo: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          schoolSystem: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          companyName: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          schoolCountry: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }]
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
        return process.env.BASE_API + window.config.project_url + 'api/staff/degree/import?staffId=' + this.userInfo.id + '&Authorization=' +
          this.$store.getters.token
      }
    },
    mounted() {
      if (this.edit) {
        this.educationOption.columns.push({
          field: '',
          title: '操作',
          width: '150px',
          number: [{ text: '编辑', type: 'text', show: 'isEdit', click: (d, row) => { this.editEducation(row) } },
            { text: '删除', type: 'text', show: 'isEdit', click: (d, row) => { this.deleteEducation(row) } }]
        })
      }
      this.getEducation()
    },
    methods: {
      resetForm,
      beforeUpload,
      onProgress, inputFilter, inputFile, uploadError,
      uploadSuccess() {
        this.loading.close()
        this.educationOption.data = []
        this.getEducation()
      },
      getEducation, addEducation, downloadEducation, editEducation, saveEducation, deleteEducation
    },
    watch: {}
  }
</script>

<style scoped>
</style>
