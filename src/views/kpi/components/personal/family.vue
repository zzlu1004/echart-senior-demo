<template>
  <div class="family">
    <div class="px2 mb2" style="height:40px;line-height:40px">
      <span class="color-title h16 f-left bold">家庭信息</span>
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
        <div v-if="elements.import && edit" class="ml3 inline-block"><div class="btn btn-default btn-sm" @click="beforeUpload('family')">导入</div></div>
        <div v-if="elements.export" class="ml3 inline-block"><div class="btn btn-default btn-sm" @click="downloadFamily">导出</div></div>
        <div v-if="elements.edit && edit" class="ml3 inline-block"><div class="btn btn-default btn-sm" @click="addFamily">新增</div></div>
      </span>
    </div>
    <div class="h14 px2 relative">
      <fd-table :option="familyOption"></fd-table>
      <div v-if="total>familyOption.data.length" class="center color-blue pointer py1" @click="getFamily">更多...</div>
    </div>
    <fd-dialog
      :title="modelTitle"
      :syncVisible="addFamilyDialog"
      @beforeClose="addFamilyDialog = false"
    >
      <div slot="fd-body">
        <el-row>
          <el-col :span="20">
            <el-form :model="formData"
                    :rules="rules"
                    ref="familyForm"
                    label-width="35%"
                    label-position="right"
                    class="demo-ruleForm">
              <el-form-item label="姓名" prop="name">
                <el-input
                  v-model="formData.name"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
              <el-form-item label="与该人关系" prop="relationship">
                <el-input
                  v-model="formData.relationship"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
              <el-form-item label="出生日期" prop="brithDate">
                <el-date-picker
                  type="date"
                  :editable=false
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  v-model="formData.brithDate"
                  style="width: 100%;"></el-date-picker>
              </el-form-item>
              <el-form-item label="政治面貌" prop="politicalStatus">
                <el-input
                  v-model="formData.politicalStatus"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
              <el-form-item label="人员联系电话" prop="phone">
                <el-input
                  v-model="formData.phone"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
              <el-form-item label="邮政编码" prop="postalCode">
                <el-input
                  v-model="formData.postalCode"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
              <el-form-item label="家庭住址" prop="address">
                <el-input
                  v-model="formData.address"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
              <el-form-item label="单位及职务" prop="companyName">
                <el-input
                  v-model="formData.companyName"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
              <el-form-item label="住房面积" prop="housingArea">
                <el-input
                  v-model="formData.housingArea"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
              <el-form-item label="已故标识" prop="isLate">
                <el-input
                  v-model="formData.isLate"
                  placeholder="请输入">
                </el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
      </div>
      <div slot="fd-footer">
        <el-button size="small" @click="addFamilyDialog = false">取消</el-button>
        <el-button size="small" type="primary" @click="saveFamily">确定</el-button>
      </div>
    </fd-dialog>
  </div>
</template>

<script>
  import fdTable from 'fd/table'
  import vueUpload from 'vue-upload-component'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  import { resetForm } from '@/api/kpi/record'
  import { beforeUpload, onProgress, getFamily, addFamily, downloadFamily, editFamily, saveFamily,
    deleteFamily, inputFilter, inputFile, uploadError } from '@/api/kpi/record/personalDetail'
  export default {
    name: 'FdPersonalFamily',
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
        modelTitle: '设置家庭信息',
        headers: { 'Authorization': this.$store.getters.token, staffId: this.userInfo.id },
        addFamilyDialog: false,
        params: {
          limit: 3,
          offset: 0
        },
        startDateOpt: {},
        endDateOpt: {},
        familyOption: {
          stripe: true,
          data: [],
          border: true,
          columns: [
            {
              field: 'index',
              width: '55px',
              title: '序号'
            }, {
              field: 'name',
              title: '姓名',
              minWidth: '120'
            }, {
              field: 'relationship',
              title: '与该人关系',
              minWidth: '120'
            }, {
              field: 'brithDate',
              title: '出生日期',
              minWidth: '120',
              formatter: (row, value) => {
                const val = value || '--'
                return val
              }
            }, {
              field: 'politicalStatus',
              title: '政治面貌',
              minWidth: '120'
            }, {
              field: 'companyName',
              title: '单位及职务',
              minWidth: '150'
            }, {
              field: 'phone',
              title: '人员联系电话',
              minWidth: '150'
            }, {
              field: 'postalCode',
              title: '邮政编码',
              minWidth: '120'
            }, {
              field: 'address',
              title: '家庭住址',
              minWidth: '150'
            }, {
              field: 'housingArea',
              title: '住房面积',
              minWidth: '120'
            }, {
              field: 'isLate',
              title: '已故标识',
              minWidth: '120'
            }
          ]
        },
        loading: null,
        formData: {
          name: '',
          relationship: '',
          brithDate: '',
          politicalStatus: '',
          phone: '',
          postalCode: '',
          address: '',
          companyName: '',
          housingArea: '',
          isLate: ''
        },
        rules: {
          name: [{ required: true, message: '请输入姓名', trigger: 'blur' },
            { max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          relationship: [{ required: true, message: '请输入与该人关系', trigger: 'blur' },
            { max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          politicalStatus: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          phone: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          postalCode: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          address: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          companyName: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          housingArea: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          isLate: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }]
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
        return process.env.BASE_API + window.config.project_url + 'api/staff/family/import?staffId=' + this.userInfo.id + '&Authorization=' +
          this.$store.getters.token
      }
    },
    mounted() {
      if (this.edit) {
        this.familyOption.columns.push({
          field: '',
          title: '操作',
          width: '150px',
          number: [{ text: '编辑', type: 'text', show: 'isEdit', click: (d, row) => { this.editFamily(row) } },
            { text: '删除', type: 'text', show: 'isEdit', click: (d, row) => { this.deleteFamily(row) } }]
        })
      }
      this.getFamily()
    },
    methods: {
      resetForm,
      beforeUpload,
      onProgress, inputFilter, inputFile, uploadError,
      uploadSuccess() {
        this.loading.close()
        this.familyOption.data = []
        this.getFamily()
      },
      getFamily, addFamily, downloadFamily, editFamily, saveFamily, deleteFamily
    },
    watch: {}
  }
</script>

<style scoped>
</style>
