<template>
  <div class="app-container">
    <div :style="{'min-height': $store.getters.globals.height - 160 + 'px'}">
      <div class="p3 bg-white mb2">
        <div>
          <el-row class="mb2" :gutter="20">
            <el-col :span="8">
              <div class="absolute pr1 py1">法院:</div>
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
                  v-model="query.companyName"
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
                <el-select v-model="query.departTypes"
                           multiple
                           filterable
                           clearable
                           placeholder="全部"
                           size="small">
                  <el-option
                    v-for="item in departTypes"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="absolute pr1 py1">部门：</div>
              <div class="except-w4-full">
                <el-select
                  v-model="query.departIds"
                  class="full"
                  multiple
                  size="small"
                  filterable
                  clearable
                  placeholder="全部">
                  <el-option
                    v-for="item in departData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
          <el-row v-if="!showMore" :gutter="20">
            <el-col :span="8">
              <div class="absolute pr1 py1">人员类型：</div>
              <div class="except-w4-full">
                <el-select
                  v-model="query.staffTypes"
                  multiple
                  size="small"
                  filterable
                  clearable
                  placeholder="全部">
                  <el-option
                    v-for="item in types"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="16">
              <div class="f-right">
                <el-button size="small" @click="showMore = true">展开</el-button>
                <el-button size="small" type="primary" @click="refreshAll">查询</el-button>
              </div>
            </el-col>
          </el-row>
          <el-row class="mb2" v-if="showMore" :gutter="20">
            <el-col :span="8">
              <div class="absolute pr1 py1">人员类型：</div>
              <div class="except-w4-full">
                <el-select
                  v-model="query.staffTypes"
                  multiple
                  size="small"
                  filterable
                  clearable
                  placeholder="全部">
                  <el-option
                    v-for="item in types"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="absolute pr1 py1">工作年限：</div>
              <div class="except-w4-full">
                <el-select
                  v-model="query.workSeniority"
                  multiple
                  size="small"
                  filterable
                  clearable
                  placeholder="全部">
                  <el-option
                    v-for="item in workSeniority"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="absolute pr1 py1">学历：</div>
              <div class="except-w4-full">
                <el-select
                  v-model="query.edu"
                  multiple
                  size="small"
                  filterable
                  clearable
                  placeholder="全部">
                  <el-option
                    v-for="item in edu"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
          <el-row class="mb2" v-if="showMore" :gutter="20">
            <el-col :span="8">
              <div class="absolute pr1 py1">学位：</div>
              <div class="except-w4-full">
                <el-select
                  v-model="query.degree"
                  multiple
                  size="small"
                  filterable
                  clearable
                  placeholder="全部">
                  <el-option
                    v-for="item in degree"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="absolute pr1 py1">年龄：</div>
              <div class="except-w4-full relative">
                <el-select
                  v-model="query.age"
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
                      <el-button type="primary" @click="addAge('ruleForm')"size="mini" >确定</el-button>
                    </el-col>
                  </el-form>
                  <el-button  slot="reference" size="small" style="position: absolute;top: 0;right: 0">自定义区间</el-button>
                </el-popover>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="absolute pr1 py1">性别：</div>
              <div class="except-w4-full">
                <el-select
                  v-model="query.sex"
                  multiple
                  size="small"
                  filterable
                  clearable
                  placeholder="全部">
                  <el-option
                    v-for="item in sex"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
          <el-row class="mb2" v-if="showMore" :gutter="20">
            <el-col :span="8">
              <div class="absolute pr1 py1">法律职务：</div>
              <div class="except-w4-full">
                <el-select
                  v-model="query.legalPosition"
                  multiple
                  size="small"
                  filterable
                  clearable
                  placeholder="全部">
                  <el-option
                    v-for="item in legalPosition"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="absolute pr1 py1">等级：</div>
              <div class="except-w4-full">
                <el-select
                  v-model="query.grade"
                  multiple
                  size="small"
                  filterable
                  clearable
                  placeholder="全部">
                  <el-option
                    v-for="item in grade"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="absolute pr1 py1">职级：</div>
              <div class="except-w4-full">
                <el-select
                  v-model="query.level"
                  multiple
                  size="small"
                  filterable
                  clearable
                  placeholder="全部">
                  <el-option
                    v-for="item in level"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
          <el-row v-if="showMore" :gutter="20">
            <el-col :span="8">
              <div class="absolute pr1 py1">政治面貌：</div>
              <div class="except-w4-full">
                <el-select
                  v-model="query.politics"
                  multiple
                  size="small"
                  filterable
                  clearable
                  placeholder="全部">
                  <el-option
                    v-for="item in politics"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="absolute pr1 py1">任职年限：</div>
              <div class="except-w4-full relative">
                <el-select
                  v-model="query.legalPositionDate"
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
                      <el-button @click="showYearEdit = false" size="mini" >取消</el-button>
                      <el-button type="primary" @click="addYear('ruleFormYear')" size="mini">确定</el-button>
                    </el-col>
                  </el-form>
                  <el-button  slot="reference" size="small" style="position: absolute;top: 0;right: 0">自定义区间</el-button>
                </el-popover>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="f-right" >
                <el-button size="small" @click="showMore = false">收起</el-button>
                <el-button size="small" type="primary" @click="refreshAll">查询</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="mb2 bg-white" v-if="elements.total">
        <div class="record-analyze-title bd-bottom">
          <span class="color-title bold">汇总统计数</span>
          <span class="f-right">
            <span class="btn-sm btn-primary"  @click="downloadTotal">
              <i class="at icon-download"/>
              下载
            </span>
          </span>
        </div>
        <div class="px2">
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="my2 bd-dashed-right">
                <fd-echart :option="totalLeft" height="238px"></fd-echart>
              </div>
            </el-col>
            <el-col :span="16">
              <fd-echart :option="totalRight" height="270px"></fd-echart>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="mb2" v-if="showData.length > 0">
        <el-row :gutter="20">
          <el-col :span="showData.length === 1 ? 24 : 12">
            <fd-record-item :options="showData[0]"></fd-record-item>
          </el-col>
          <el-col :span="12" v-if="showData.length > 1">
            <fd-record-item :options="showData[1]"></fd-record-item>
          </el-col>
        </el-row>
      </div>
      <div class="mb2" v-if="showData.length > 2">
        <el-row :gutter="20">
          <el-col :span="showData.length === 3 ? 24 : 12">
            <fd-record-item :options="showData[2]"></fd-record-item>
          </el-col>
          <el-col :span="12" v-if="showData.length > 3">
            <fd-record-item :options="showData[3]"></fd-record-item>
          </el-col>
        </el-row>
      </div>
      <div class="mb2" v-if="showData.length > 4">
        <el-row :gutter="20">
          <el-col :span="showData.length === 5 ? 24 : 12">
            <fd-record-item :options="showData[4]"></fd-record-item>
          </el-col>
          <el-col :span="12" v-if="showData.length > 5">
            <fd-record-item :options="showData[5]"></fd-record-item>
          </el-col>
        </el-row>
      </div>
      <div class="mb2" v-if="showData.length > 6">
        <el-row :gutter="20">
          <el-col :span="showData.length === 7 ? 24 : 12">
            <fd-record-item :options="showData[6]"></fd-record-item>
          </el-col>
          <el-col :span="12" v-if="showData.length > 7">
            <fd-record-item :options="showData[7]"></fd-record-item>
          </el-col>
        </el-row>
      </div>
      <div class="mb2" v-if="showData.length > 8">
        <el-row :gutter="20">
          <el-col :span="showData.length === 9 ? 24 : 12">
            <fd-record-item :options="showData[8]"></fd-record-item>
          </el-col>
          <el-col :span="12" v-if="showData.length > 9">
            <fd-record-item :options="showData[9]"></fd-record-item>
          </el-col>
        </el-row>
      </div>
      <div class="mb2" v-if="showData.length > 10">
        <el-row :gutter="20">
          <el-col :span="showData.length === 11 ? 24 : 12">
            <fd-record-item :options="showData[10]"></fd-record-item>
          </el-col>
          <el-col :span="12" v-if="showData.length > 11">
            <fd-record-item :options="showData[11]"></fd-record-item>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import { courtNodeClick, refreshAll, getShowData, downloadTotal,
    getData,
    addAge,
    addYear,
    getData_total,
    getData_personType,
    getData_workYear,
    getData_degree,
    getData_age,
    getData_legalPositionDate,
    getData_educational,
    getData_duty,
    getData_sex,
    getData_level,
    getData_rank,
    changeLabeltoValue,
    changeValuetoLabel,
    getData_politics,
    getQueryData
  } from '@/api/kpi/record/recordAnalyze'
  import FdRecordItem from '../components/recordItem'
  import fdEchart from 'fd/echarts/echarts'
  export default {
    name: '',
    components: { FdRecordItem, fdEchart },
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
        editValueStart: '',
        editValueEnd: '',
        showDepartTree: false,
        departData: [],
        query: {
          departIds: [],
          companyName: this.$store.getters.user.companyName,
          companyId: this.$store.getters.user.companyId,
          departTypes: [],
          staffTypes: [],
          age: [],
          legalPositionDate: [],
          degree: [],
          edu: [],
          grade: [],
          legalPosition: [],
          level: [],
          sex: [],
          politics: [],
          workSeniority: []
        },
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        accordion: true,
        departTypes: [],
        showData: [],
        showKeys: [],
        types: [],
        age: [],
        legalPositionDate: [],
        ageMap: {},
        ageIdMap: {},
        legalPositionDateMap: {},
        legalPositionDateIdMap: {},
        degree: [],
        edu: [],
        grade: [],
        legalPosition: [],
        level: [],
        sex: [],
        politics: [],
        workSeniority: [],
        chartSort: [
          'personType',
          'workYear',
          'degree',
          'age',
          'educational',
          'duty',
          'sex',
          'level',
          'rank',
          'politics',
          'legalPositionDate'
        ],
        chartMap: {
          'personType': {
            title: '人员类型分布',
            type: 'pie',
            allData: {},
            option: {
              legend: {
                show: false
              }
            }
          },
          'workYear': {
            title: '工作年限分布',
            type: 'hbar',
            allData: {},
            option: {
              xAxis: {
                name: '人',
                minInterval: 1
              },
              grid: {
                bottom: 30
              }
            }
          },
          'degree': {
            title: '学位分布',
            type: 'vbar',
            allData: {},
            option: {
              yAxis: {
                name: '人',
                minInterval: 1
              }
            }
          },
          'age': {
            title: '年龄分布',
            type: 'pie',
            allData: {},
            option: {
              legend: {
                show: false
              }
            }
          },
          'educational': {
            title: '学历分布',
            type: 'pie',
            allData: {},
            option: {
              legend: {
                show: false
              }
            }
          },
          'duty': {
            title: '法律职务分布',
            type: 'vbar',
            allData: {},
            option: {
              yAxis: {
                name: '人',
                minInterval: 1
              }
            }
          },
          'sex': {
            title: '性别分布',
            type: 'pie',
            allData: {},
            option: {
              legend: {
                show: false
              }
            }
          },
          'level': {
            title: '等级分布',
            type: 'vbar',
            allData: {},
            option: {
              yAxis: {
                name: '人',
                minInterval: 1
              }
            }
          },
          'rank': {
            title: '职级分布',
            type: 'hbar',
            allData: {},
            option: {
              xAxis: {
                name: '人',
                minInterval: 1
              },
              grid: {
                bottom: 30
              }
            }
          },
          'politics': {
            title: '政治面貌分布',
            type: 'pie',
            allData: {},
            option: {
              legend: {
                show: false
              }
            }
          },
          'legalPositionDate': {
            title: '任职年限分布',
            type: 'hbar',
            allData: {},
            option: {
              legend: {
                show: false
              }
            }
          }
        },
        totalLeft: {
          data: [],
          type: 'gauge',
          chartOption: {},
          dataZoom: true,
          chart: null,
          opt: {
            radius: '90%',
            center: ['50%', '45%'],
            detail: {
              offsetCenter: [0, '78%'],
              fontSize: 16,
              fontWeight: 'bold',
              formatter: (param) => {
                return param + '人'
              }
            },
            title: {
              offsetCenter: [0, '106%'],
              fontWeight: 'bold',
              fontSize: 16
            },
            axisLabel: {
              formatter: function(val) {
                const value = val + ''
                return value.indexOf('.') > -1 ? value.split('.')[0] : value
              }
            }
          }
        },
        totalRight: {
          data: [],
          type: 'pie',
          chartOption: {},
          dataZoom: true,
          chart: null,
          opt: {
            tooltip: {
              show: true,
              formatter: (param) => {
                const data = param.data
                return `${param.marker}${data.seriesName}:<br/>${data.name}: ${data.value}人/占比${data.rate}%`
              }
            },
            series: {
              radius: ['20%', '55%'],
              roseType: 'area',
              label: {
                normal: {
                  show: true,
                  formatter: (param) => {
                    const data = param.data
                    let seriesName = data.seriesName
                    if (seriesName.length > 8) {
                      seriesName = seriesName.substring(0, 8) + '...'
                    }
                    return `${seriesName}（${data.name}: ${data.rate}%）`
                  },
                  rich: {
                    title: {
                      fontWeight: 'bold'
                    }
                  }
                }
              }
            },
            legend: {
              show: false
            }
          }
        },
        showMore: false
      }
    },
    computed: {
      departs() {
        return this.fd.data.changeToTree(this.$store.getters.allCourt, 'id', 'parentId')
      },
      elements() {
        return this.$store.getters.elements.recordAnalyze || {}
      }
    },
    mounted() {
      this.getQueryData()
      this.getShowData()
      this.refreshAll()
    },
    methods: {
      addAge,
      addYear,
      courtNodeClick,
      refreshAll,
      getData_total,
      getShowData,
      downloadTotal,
      getData,
      getData_personType,
      getData_workYear,
      getData_degree,
      getData_age,
      getData_legalPositionDate,
      getData_educational,
      getQueryData,
      getData_duty,
      getData_sex,
      getData_level,
      getData_rank,
      changeLabeltoValue,
      changeValuetoLabel,
      getData_politics
    },
    watch: {}
  }
</script>

<style>
  .record-analyze-title{
    height: 50px;
    line-height: 50px;
    font-weight: bold;
    font-size: 16px;
    padding: 0 16px;
  }
  .el-popover__title {
    margin-left: 10px;
  }
</style>
<style scoped>
  .hover-bg{
    border-radius: 2px;
  }
  .hover-bg:hover{
    background-color: #D2EAFA;
  }
</style>

