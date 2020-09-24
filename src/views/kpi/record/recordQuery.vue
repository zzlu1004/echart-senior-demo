<template>
  <div class="app-container">
    <div
      class="container-inner bg-white record-query"
      :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="mb2">
        <el-row class="mb2" :gutter="20">
          <el-col :span="8">
            <div class="absolute pr1 py1">法院：</div>
            <div class="except-w4-full">
              <el-popover
                ref="courtPid"
                placement="bottom-start"
                v-model="showDepartTree">
                <el-tree
                  style="max-height:300px;overflow-y: auto;"
                  :data="departs"
                  :props="defaultProps"
                  :accordion="accordion"
                  @node-click="courtNodeClick"></el-tree>
              </el-popover>
              <el-input
                v-model="companyName"
                size="small"
                readonly
                placeholder="请选择"
                v-popover:courtPid>
              </el-input>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="absolute pr1 py1">部门类型：</div>
            <div class="except-w4-full">
              <el-select
                v-model="params.departTypes"
                multiple
                filterable
                clearable
                placeholder="全部"
                size="small"
              >
                <el-option
                  v-for="item in departTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="absolute pr1 py1">部门：</div>
            <div class="except-w4-full">
              <el-select
                v-model="params.departIds"
                class="full"
                multiple
                size="small"
                filterable
                clearable
                placeholder="全部"
              >
                <el-option
                  v-for="item in departData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <el-row class="mb2" :gutter="20">
          <el-col :span="8">
            <div class="absolute pr1 py1">人员类型：</div>
            <div class="except-w4-full">
              <el-select
                v-model="params.staffTypes"
                multiple
                size="small"
                filterable
                clearable
                placeholder="全部"
              >
                <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="absolute pr1 py1">工作年限：</div>
            <div class="except-w4-full">
              <el-select
                v-model="params.workSeniority"
                multiple
                size="small"
                filterable
                clearable
                placeholder="全部"
              >
                <el-option
                  v-for="item in workSeniority"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="8" v-if="showMore">
            <div class="absolute pr1 py1">学历：</div>
            <div class="except-w4-full">
              <el-select
                v-model="params.edu"
                multiple
                size="small"
                filterable
                clearable
                placeholder="全部"
              >
                <el-option
                  v-for="item in edu"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="8" v-if="!showMore">
            <div class="absolute pr1 py1">搜索：</div>
            <div class="except-w4-full">
              <el-input
                v-model="params.keyword"
                size="small"
                placeholder="请输入部门和姓名进行搜索"
                @keyup.enter.native="searchByKeyword(params.keyword)"
              ></el-input>
            </div>
          </el-col>
        </el-row>
        <el-row class="mb2" v-if="showMore" :gutter="20">
          <el-col :span="8" v-if="!showMore">
            <div class="absolute pr1 py1">学历：</div>
            <div class="except-w4-full">
              <el-select
                v-model="params.edu"
                multiple
                size="small"
                filterable
                clearable
                placeholder="全部"
              >
                <el-option
                  v-for="item in edu"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="absolute pr1 py1">学位：</div>
            <div class="except-w4-full">
              <el-select
                v-model="params.degree"
                multiple
                size="small"
                filterable
                clearable
                placeholder="全部"
              >
                <el-option
                  v-for="item in degree"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="absolute pr1 py1">年龄：</div>
            <div class="except-w4-full relative">
              <el-select
                v-model="params.age"
                multiple
                style="padding-right: 100px;"
                size="small"
                filterable
                clearable
                placeholder="全部">
                <el-option
                  v-for="item in age"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-popover
                title="自定义区间:"
                placement="top"
                width="390"
                v-model="showEdit"
                trigger="click">
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm">
                  <el-col :span="6">
                    <el-form-item label="" prop="startAge" >
                      <el-input v-model.number="ruleForm.startAge" placeholder="最小值" size="mini"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col class="line center" :span="1" style="line-height: 42px;margin-left: -14px;" >至</el-col>
                  <el-col :span="6">
                    <el-form-item label="" prop="endAge">
                      <el-input v-model.number="ruleForm.endAge" placeholder="最大值" size="mini"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11" style="margin: 6px 0 0 8px">
                    <el-button @click="showEdit = false" size="mini">取消</el-button>
                    <el-button type="primary" @click="addAge('ruleForm')"size="mini">确定</el-button>
                  </el-col>
                </el-form>
                <el-button  slot="reference" size="small" style="position: absolute;top: 0;right: 0">自定义区间</el-button>
              </el-popover>
            </div>
          </el-col>
          <el-col :span="8" v-if="showMore">
            <div class="absolute pr1 py1">性别：</div>
            <div class="except-w4-full">
              <el-select
                v-model="params.sex"
                multiple
                size="small"
                filterable
                clearable
                placeholder="全部"
              >
                <el-option
                  v-for="item in sex"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <el-row class="mb2" v-if="showMore" :gutter="20">
          <el-col :span="8" v-if="!showMore">
            <div class="absolute pr1 py1">性别：</div>
            <div class="except-w4-full">
              <el-select
                v-model="params.sex"
                multiple
                size="small"
                filterable
                clearable
                placeholder="全部"
              >
                <el-option
                  v-for="item in sex"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="absolute pr1 py1">法律职务：</div>
            <div class="except-w4-full">
              <el-select
                v-model="params.legalPosition"
                multiple
                size="small"
                filterable
                clearable
                placeholder="全部"
              >
                <el-option
                  v-for="item in legalPosition"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="absolute pr1 py1">等级：</div>
            <div class="except-w4-full">
              <el-select
                v-model="params.grade"
                multiple
                size="small"
                filterable
                clearable
                placeholder="全部"
              >
                <el-option
                  v-for="item in grade"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="absolute pr1 py1">职级：</div>
            <div class="except-w4-full">
              <el-select
                v-model="params.level"
                multiple
                size="small"
                filterable
                clearable
                placeholder="全部"
              >
                <el-option
                  v-for="item in level"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <el-row class="mb2" v-if="showMore" :gutter="20">
          <el-col :span="8">
            <div class="absolute pr1 py1">政治面貌：</div>
            <div class="except-w4-full">
              <el-select
                v-model="params.politics"
                multiple
                size="small"
                filterable
                clearable
                placeholder="全部"
              >
                <el-option
                  v-for="item in politics"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="absolute pr1 py1">任职年限：</div>
            <div class="except-w4-full relative">
              <el-select
                v-model="params.legalPositionDate"
                multiple
                style="padding-right: 100px;"
                size="small"
                filterable
                clearable
                placeholder="全部">
                <el-option
                  v-for="item in legalPositionDate"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-popover
                title="自定义区间:"
                placement="top"
                width="390"
                v-model="showYearEdit"
                trigger="click">
                <el-form :model="ruleFormYear" status-icon :rules="rulesYear" ref="ruleFormYear">
                  <el-col :span="6">
                    <el-form-item label="" prop="startYear">
                      <el-input v-model.number="ruleFormYear.startYear" placeholder="最小值" size="mini"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col class="line center" :span="1" style="line-height: 42px;margin-left: -14px;">至</el-col>
                  <el-col :span="6">
                    <el-form-item label="" prop="endYear">
                      <el-input v-model.number="ruleFormYear.endYear" placeholder="最大值" size="mini"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11" style="margin: 6px 0 0 8px">
                    <el-button @click="showYearEdit = false" size="mini">取消</el-button>
                    <el-button type="primary" @click="addYear('ruleFormYear')" size="mini">确定</el-button>
                  </el-col>
                </el-form>
                <el-button  slot="reference" size="small" style="position: absolute;top: 0;right: 0">自定义区间</el-button>
              </el-popover>
            </div>
          </el-col>
          <el-col :span="8" v-if="showMore">
            <div class="absolute pr1 py1">搜索：</div>
            <div class="except-w4-full">
              <el-input
                v-model="params.keyword"
                size="small"
                placeholder="请输入部门和姓名进行搜索"
                @keyup.enter.native="searchByKeyword(params.keyword)"
              ></el-input>
            </div>
          </el-col>
        </el-row>
        <el-row class="mb2" :gutter="20">
          <el-col :span="24">
            <div class="right-align">
              <el-button v-if="!showMore" size="small" @click="showMore = true">展开</el-button>
              <el-button v-else size="small" @click="showMore = false">收起</el-button>
              <el-button size="small" type="primary" @click="getDepartList">查询</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div>
        <staffCard
          v-for="(item, index) in cardData"
          :key="index"
          :data="item.value"
          :name="item.key"
        ></staffCard>
      </div>
    </div>
  </div>
</template>

<script>
import {
  addAge,
  addYear,
  getDepartList,
  searchByKeyword,
  handleScroll,
  getStaffPhoto,
  getQueryData,
  changeLabeltoValue,
  changeValuetoLabel,
  courtNodeClick
} from '@/api/kpi/record/recordQuery'
import staffCard from '../components/staffCard.vue'
export default {
  name: 'recordQuery',
  components: {
    staffCard
  },
  props: {},
  data() {
    // 年龄数据校验--最小值
    var validatePass = (rule, value, callback) => {
      if (this.ruleForm.endAge !== '') {
        if (value === '') {
          callback()
        } else {
          if (value - this.ruleForm.endAge > 0) {
            callback(new Error('请不要大于最大值'))
          } else if (value < 0 || value > 999 || !Number.isInteger(value)) {
            callback(new Error('请输入0~999的数字'))
          } else {
            callback()
          }
        }
      } else {
        if (value === '') {
          return callback(new Error('不能为空'))
        } else {
          if (value < 0 || value > 999 || !Number.isInteger(value)) {
            callback(new Error('请输入0~999的数字'))
          } else {
            callback()
          }
        }
      }
    }
    // 年龄数据校验--最大值
    var checkAge = (rule, value, callback) => {
      if (this.ruleForm.startAge !== '') {
        if (value === '') {
          callback()
        } else {
          if (value < 0 || value > 999 || !Number.isInteger(value)) {
            callback(new Error('请输入0~999的数字'))
          } else {
            callback()
          }
        }
      } else {
        if (value === '') {
          return callback(new Error('不能为空'))
        } else {
          if (value < 0 || value > 999 || !Number.isInteger(value)) {
            callback(new Error('请输入0~999的数字'))
          } else {
            callback()
          }
        }
      }
    }
    // 任职年限数据校验--最小值
    var validatePassYear = (rule, value, callback) => {
      if (this.ruleFormYear.endYear !== '') {
        if (value === '') {
          callback()
        } else {
          if (value - this.ruleFormYear.endYear > 0) {
            callback(new Error('请不要大于最大值'))
          } else if (value < 0 || value > 999 || !Number.isInteger(value)) {
            callback(new Error('请输入0~999的数字'))
          } else {
            callback()
          }
        }
      } else {
        if (value === '') {
          return callback(new Error('不能为空'))
        } else {
          if (value < 0 || value > 999 || !Number.isInteger(value)) {
            callback(new Error('请输入0~999的数字'))
          } else {
            callback()
          }
        }
      }
    }
    // 任职年限数据校验--最大值
    var checkYear = (rule, value, callback) => {
      if (this.ruleFormYear.startYear !== '') {
        if (value === '') {
          callback()
        } else {
          if (value < 0 || value > 999 || !Number.isInteger(value)) {
            callback(new Error('请输入0~999的数字'))
          } else {
            callback()
          }
        }
      } else {
        if (value === '') {
          return callback(new Error('不能为空'))
        } else {
          if (value < 0 || value > 999 || !Number.isInteger(value)) {
            callback(new Error('请输入0~999的数字'))
          } else {
            callback()
          }
        }
      }
    }
    return {
      ruleForm: {
        startAge: '',
        checkPass: '',
        endAge: ''
      },
      rules: {
        startAge: [
          { validator: validatePass, trigger: 'blur' }
        ],
        endAge: [
          { validator: checkAge, trigger: 'blur' }
        ]
      },
      ruleFormYear: {
        startYear: '',
        checkPass: '',
        endYear: ''
      },
      rulesYear: {
        startYear: [
          { validator: validatePassYear, trigger: 'blur' }
        ],
        endYear: [
          { validator: checkYear, trigger: 'blur' }
        ]
      },
      showEdit: false,
      showYearEdit: false,
      showMore: false,
      departData: [],
      cardData: [],
      showDepartTree: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      accordion: true,
      params: {
        companyId: this.$store.getters.user.companyCode,
        keyword: '',
        departIds: [],
        departTypes: [],
        staffTypes: [],
        age: [],
        degree: [],
        edu: [],
        grade: [],
        legalPosition: [],
        level: [],
        sex: [],
        politics: [],
        workSeniority: [],
        legalPositionDate: []
      },
      ageMap: {},
      ageIdMap: {},
      legalPositionDateMap: {},
      legalPositionDateIdMap: {},
      departTypes: [],
      showData: [],
      showKeys: [],
      types: [],
      age: [],
      degree: [],
      edu: [],
      grade: [],
      legalPosition: [],
      level: [],
      sex: [],
      politics: [],
      workSeniority: [],
      legalPositionDate: [],
      scrollDom: null,
      companyName: this.$store.getters.user.companyName,
      height: this.$store.getters.globals.height
    }
  },
  computed: {
    departs() {
      return this.fd.data.changeToTree(
        this.$store.getters.allCourt,
        'id',
        'parentId'
      )
    },
    court() {
      return this.$store.getters.court
    }
  },
  mounted() {
    this.scrollDom = document.getElementsByClassName('sidebar-right')[0]
    this.scrollDom.removeEventListener('scroll', this.handleScroll)
    this.scrollDom.addEventListener('scroll', this.handleScroll)
    this.getDepartList()
    this.getQueryData()
  },
  methods: {
    addAge,
    addYear,
    getDepartList,
    searchByKeyword,
    handleScroll,
    getStaffPhoto,
    getQueryData,
    changeLabeltoValue,
    changeValuetoLabel,
    courtNodeClick
  },
  watch: {
    cardData() {
      this.$nextTick(() => {
        this.handleScroll()
      })
    }
  }
}
</script>

<style lang="scss" >
.height50 {
  height: 50px;
}
.width-500px {
  width: 500px;
}
.width-430px {
  width: 418px;
}
.py4px {
  padding: 4px 0;
}
.m0 {
  margin: 0 auto;
}
.line-height-50 {
  line-height: 50px;
}
.line-height-37 {
  line-height: 37px;
}
.color-ffde2e {
  color: #ffde2e;
}
.record-query {
  .card-box{
    width:168px;
    height:96px;
    border-radius: 2px;
    overflow: hidden;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.12);
    .name-box{
      width: 72px;
    }
  }
  .card-box:hover{
    box-shadow: 0px 4px 12px 0px rgba(24, 24, 24, 0.3);
    .name-box{
      color: #1a95e7;
    }
  }
  .card-photo{
    height: 100%;
    img{
      background-repeat: no-repeat;
      width:72px;
      height:96px;
    }
  }
  .text-box-chair {
    height: 40px;
    top:50%;
    left: 72px;
    margin-top: -20px;
  }
  .text-box {
    height: 16px;
    top:50%;
    left: 72px;
    margin-top: -8px;
  }
}
.title-box {
  border-left: solid 4px #1a95e7;
}
.el-popover__title {
  margin-left: 10px;
}
</style>
