<template>
  <div class="app-container">
    <div class="container-inner bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div  class="mb2 tab-box">
        <el-tabs v-if="elements.depart || elements.personal" v-model="type" type="card">
          <el-tab-pane v-if="elements.personal" label="个人" name="personal">
            <!-- 个人 -->
            <div v-show="elements.personal && type === 'personal'">
              <div  class="mb2">
                <fd-search-panel :params="paramsPersonEarch" v-model="query" v-on:search="refreshAll">
                  <span v-if="$store.getters.globals.isIE" slot="time"  class="new-time-pick">
                    <el-row>
                      <el-col :span="11">
                         <el-date-picker
                           type="date"
                           value-format="yyyy-MM-dd"
                           size="small"
                           v-model="personParams.startTime"
                           :clearable=false
                           class="mr1"></el-date-picker>
                      </el-col>
                       <el-col  :span="1">
                        <span class="center inline-block time-divide">-</span>
                      </el-col>
                      <el-col :span="12"> <el-date-picker
                        type="date"
                        value-format="yyyy-MM-dd"
                        size="small"
                        v-model="personParams.endTime"
                        :clearable=false
                        class="ml1"
                      ></el-date-picker></el-col>
                    </el-row>
                </span>
                  <span v-else  slot="time" class="new-time-pick">
                    <el-row>
                      <el-col  :span="11">
                        <el-date-picker
                        type="date"
                        value-format="yyyy-MM-dd"
                        size="small"
                        placeholder="选择日期"
                        v-model="personParams.startTime"
                        :clearable=false
                        class="mr1">
                        </el-date-picker>
                      </el-col>
                      <el-col  :span="1">
                        <span class="center inline-block time-divide">-</span>
                      </el-col>
                      <el-col  :span="12"><el-date-picker
                        type="date"
                        value-format="yyyy-MM-dd"
                        size="small"
                        placeholder="选择日期"
                        v-model="personParams.endTime"
                        :clearable=false
                        class="ml1"
                      ></el-date-picker>
                      </el-col>
                    </el-row>
                  </span>
                  <el-select
                    slot="schemaBlock"
                    v-model="personParams.schemaBlockType"
                    size="small"
                    placeholder="请选择">
                    <el-option
                      v-for="li of paramsPersonEarch[3].options"
                      :key="li.id"
                      :value="li.id"
                      :label="li.text"></el-option>
                  </el-select>
                </fd-search-panel>
              </div>
              <div>
                <fd-table
                  :loading="judgeLoading"
                  :option="personOpt"
                  @cellClick="countPersonPeg"
                  :sortChange="sortByNum2"
                  :sortable=true
                  :defaultSort="{prop:'startTime', order:'descending'}"
                  ref="personOpt"></fd-table>
              </div>
              <fd-pagination
                :limit="personParams.limit"
                :total="total"
                :offset="personParams.offset"
                sizes="sizes"
                :pageArr="[10,20,30,40,50]"
                :currentChange="currentChange"
                :sizeChange="sizeChange">
              </fd-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="elements.depart" label="部门" name="depart">
            <!-- 部门 -->
            <div v-show="elements.depart && type === 'depart'">
              <div class="mb2">
                <fd-search-panel :params="paramsEarch" v-model="departQuery" v-on:search="refreshAllDepart">
                  <span v-if="$store.getters.globals.isIE" slot="time" class="new-time-pick">
                    <el-row>
                      <el-col :span="11">
                         <el-date-picker
                           type="date"
                           value-format="yyyy-MM-dd"
                           size="small"
                           v-model="departParams.startTime"
                           :clearable=false
                           class="mr1"></el-date-picker>
                      </el-col>
                       <el-col  :span="1">
                        <span class="center inline-block time-divide">-</span>
                      </el-col>
                      <el-col :span="12"> <el-date-picker
                        type="date"
                        value-format="yyyy-MM-dd"
                        size="small"
                        v-model="departParams.endTime"
                        :clearable=false
                        class="ml1"
                      ></el-date-picker></el-col>
                    </el-row>
                </span>
                  <span v-else  slot="time" class="new-time-pick">
                    <el-row>
                      <el-col  :span="11"><el-date-picker
                        type="date"
                        value-format="yyyy-MM-dd"
                        size="small"
                        placeholder="选择日期"
                        v-model="departParams.startTime"
                        :clearable=false
                        class="mr1"></el-date-picker>
                      </el-col>
                      <el-col  :span="1">
                        <span class="center inline-block time-divide">-</span>
                      </el-col>
                      <el-col  :span="12"><el-date-picker
                        type="date"
                        value-format="yyyy-MM-dd"
                        size="small"
                        placeholder="选择日期"
                        v-model="departParams.endTime"
                        :clearable=false
                        class="ml1"
                      ></el-date-picker>
                      </el-col>
                    </el-row>
                  </span>
                  <el-select
                    slot="schemaBlock"
                    v-model="departParams.schemaBlockType"
                    size="small"
                    placeholder="请选择">
                    <el-option
                      v-for="li of paramsEarch[3].options"
                      :key="li.id"
                      :value="li.id"
                      :label="li.text"></el-option>
                  </el-select>
                </fd-search-panel>
              </div>
              <div>
                <fd-table
                  :loading="departLoading"
                  :option="departOpt"
                  @cellClick="countPeg"
                  :isRefresh="isRefresh"
                  :sortable=true
                  :defaultSort="{prop:'startTime', order:'descending'}"
                  :sortChange="sortByNum1"
                  ref="departOpt"></fd-table>
              </div>
              <fd-pagination
                :limit="departParams.limit"
                :total="totalDepart"
                :offset="departParams.offset"
                sizes="sizes"
                :pageArr="[10,20,30,40,50]"
                :currentChange="currentChangeDepart"
                :sizeChange="sizeChangeDepart">
              </fd-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import FdSearchPanel from 'fd/searchPanel/searchPanel'
  import fdTable from 'fd/table'
  import FdPagination from 'fd/pagination/pagination'
  import { sortByNum1, countPeg, countPersonPeg, sortByNum2, refreshAll, refreshAllDepart, currentChange, currentChangeDepart, sizeChange, sizeChangeDepart, getJudgeTotal, getDepartTotal } from '@/api/kpi/newRecord/evalua/workEvalua'
  export default {
    name: 'workEvalua',
    components: {
      fdTable, FdPagination, FdSearchPanel
    },
    props: {},
    data() {
      return {
        judgeLoading: false,
        departLoading: false,
        paramsEarch: [
          {
            name: 'time',
            placeholder: '请选择',
            label: '考核周期',
            type: '',
            value: ''
          }, {
            name: 'status',
            placeholder: '请选择',
            label: '方案状态',
            type: 'select',
            multiple: true,
            value: [],
            options: [{ id: 'finished', text: '已结束' },
              { id: 'public', text: '已公示' }]
          }, {
            name: 'schemaIds',
            placeholder: '请选择',
            label: '考核方案',
            type: 'select',
            multiple: true,
            value: [],
            options: []
          }, {
            name: 'schemaBlock',
            placeholder: '请选择',
            label: '考核类别',
            type: 'select',
            multiple: true,
            value: [],
            options: [{ id: 'k10015-01', text: '综合绩效' },
              { id: 'k10015-02', text: '审判绩效' },
              { id: 'k10015-03', text: '民主测评' }]
          }, {
            name: 'departTypes',
            placeholder: '请选择',
            label: '部门类型',
            type: 'select',
            multiple: true,
            value: [],
            options: []
          }],
        paramsPersonEarch: [
          {
            name: 'time',
            placeholder: '请选择',
            label: '考核周期',
            type: '',
            value: ''
          }, {
            name: 'status',
            placeholder: '请选择',
            label: '方案状态',
            type: 'select',
            multiple: true,
            value: [],
            options: [{ id: 'finished', text: '已结束' },
              { id: 'public', text: '已公示' }]
          }, {
            name: 'schemaIds',
            placeholder: '请选择',
            label: '考核方案',
            type: 'select',
            multiple: true,
            value: [],
            options: []
          }, {
            name: 'schemaBlock',
            placeholder: '请选择',
            label: '考核类别',
            type: '',
            multiple: true,
            value: [],
            options: [{ id: 'k10015-01', text: '综合绩效' },
              { id: 'k10015-02', text: '审判绩效' },
              { id: 'k10015-03', text: '民主测评' }]
          }, {
            name: 'chairTypes',
            placeholder: '请选择',
            label: '部门正副职',
            type: 'select',
            multiple: true,
            value: [],
            options: []
          }, {
            name: 'staffTypes',
            placeholder: '请选择',
            label: '人员类型',
            type: 'select',
            multiple: true,
            value: [],
            options: []
          }],
        query: {
          status: [],
          schemaIds: [],
          chairTypes: [],
          staffTypes: []
        },
        departQuery: {
          status: [],
          schemaIds: [],
          departTypes: []
        },
        departParams: {
          type: 'depart',
          orderField: '',
          orderType: '',
          schemaBlockType: 'k10015-01',
          offset: 0,
          limit: 10,
          startTime: '',
          endTime: ''
        },
        personParams: {
          type: 'personal',
          orderField: '',
          orderType: '',
          schemaBlockType: 'k10015-01',
          offset: 0,
          limit: 10,
          startTime: '',
          endTime: ''
        },
        typeMap: {
          'depart': '部门',
          'personal': '个人'
        },
        fileName: '',
        pickerOptionsStart: {},
        pickerOptionsEnd: {},
        myStaffTypes: [],
        myDepartTypes: [],
        mySchemaId: [],
        myDeptSchemaId: [],
        myChair: [],
        type: '',
        total: 0,
        totalDepart: 0,
        typesMap: {
          'k10015-01': '综合绩效',
          'k10015-02': '审判绩效',
          'k10015-03': '民主测评'
        },
        isRefresh: false,
        personOpt: {
          stripe: true,
          border: true,
          data: [],
          columns: [
            {
              field: 'startTime',
              title: '考核周期',
              sortable: 'custom',
              width: '210px',
              showOverflowTooltip: true,
              formatter: (row, value) => {
                return row.startTime + '~' + row.endTime
              }
            },
            {
              field: 'schemaName',
              title: '考核方案',
              formatter: (row, value) => {
                return this.elements.assessmentProgram ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              showOverflowTooltip: true
            },
            {
              field: 'statusDesc',
              title: '方案状态',
              width: this.fd.tools.getStringWidth('方案状态'),
              showOverflowTooltip: true
            },
            {
              field: 'schemaBlockType',
              title: '考核类别',
              width: '130px',
              formatter: (row, value) => {
                return this.typesMap[value]
              },
              showOverflowTooltip: true
            },
            {
              field: 'count',
              title: '考核人数',
              align: 'right',
              sortable: 'custom',
              width: this.fd.tools.getStringWidth('考核人数'),
              showOverflowTooltip: true
            },
            {
              field: 'avgScore',
              title: '平均分',
              align: 'right',
              sortable: 'custom',
              formatter: (row, value) => {
                return this.elements.averageScore ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              width: this.fd.tools.getStringWidth('平均分'),
              showOverflowTooltip: true
            },
            {
              field: 'grade1',
              title: 'A档',
              align: 'right',
              width: this.fd.tools.getStringWidth('A档'),
              showOverflowTooltip: true
            },
            {
              field: 'grade2',
              title: 'B档',
              align: 'right',
              width: this.fd.tools.getStringWidth('A档'),
              showOverflowTooltip: true
            },
            {
              field: 'grade3',
              title: 'C档',
              align: 'right',
              width: this.fd.tools.getStringWidth('A档'),
              showOverflowTooltip: true
            },
            {
              field: 'grade4',
              title: 'D档',
              align: 'right',
              width: this.fd.tools.getStringWidth('A档'),
              showOverflowTooltip: true
            }
          ]
        },
        departOpt: {
          stripe: true,
          border: true,
          data: [],
          columns: [
            {
              field: 'startTime',
              title: '考核周期',
              width: '210px',
              sortable: 'custom',
              showOverflowTooltip: true,
              formatter: (row, value) => {
                return row.startTime + '~' + row.endTime
              }
            },
            {
              field: 'schemaName',
              title: '考核方案',
              formatter: (row, value) => {
                return this.elements.assessmentProgram ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              showOverflowTooltip: true
            },
            {
              field: 'statusDesc',
              title: '方案状态',
              width: this.fd.tools.getStringWidth('方案状态'),
              showOverflowTooltip: true
            },
            {
              field: 'schemaBlockType',
              title: '考核类别',
              width: '130px',
              formatter: (row, value) => {
                return this.typesMap[value]
              },
              showOverflowTooltip: true
            },
            {
              field: 'count',
              title: '考核部门数',
              align: 'right',
              sortable: 'custom',
              width: this.fd.tools.getStringWidth('考核部门数'),
              showOverflowTooltip: true
            },
            {
              field: 'avgScore',
              title: '平均分',
              align: 'right',
              sortable: 'custom',
              formatter: (row, value) => {
                return this.elements.averageScore ? '<span class="color-blue pointer">' + value + '</span>' : value
              },
              width: this.fd.tools.getStringWidth('平均分'),
              showOverflowTooltip: true
            },
            {
              field: 'grade1',
              title: 'A档',
              align: 'right',
              width: this.fd.tools.getStringWidth('A档'),
              showOverflowTooltip: true
            },
            {
              field: 'grade2',
              title: 'B档',
              align: 'right',
              width: this.fd.tools.getStringWidth('A档'),
              showOverflowTooltip: true
            },
            {
              field: 'grade3',
              title: 'C档',
              align: 'right',
              width: this.fd.tools.getStringWidth('A档'),
              showOverflowTooltip: true
            },
            {
              field: 'grade4',
              title: 'D档',
              align: 'right',
              width: this.fd.tools.getStringWidth('A档'),
              showOverflowTooltip: true
            }
          ]
        }
      }
    },
    computed: {
      // 人员类别
      types() {
        return this.$store.getters.selects['k10003']
      },
      // 部门正副职
      chair() {
        return [...this.$store.getters.selects['k10010'], { id: 'other', name: '一般干警' }] || []
      },
      // 部门类型
      check() {
        return this.$store.getters.selects['k10027']
      },
      elements() {
        return this.$store.getters.elements.workEvalua || {}
      },
      elementsDetail() {
        return this.$store.getters.elements.tableDetail || {}
      },
      elementsDetailDepart() {
        return this.$store.getters.elements.tableDetailDepart || {}
      }
    },
    mounted() {
      this.getAreaCode()
      this.getSchemaId()
      this.getDeptSchemaId()
      if (this.elements.personal) {
        this.type = 'personal'
      } else if (this.elements.depart) {
        this.type = 'depart'
      }
    },
    methods: {
      sortByNum1, sortByNum2, currentChange, currentChangeDepart, sizeChange, sizeChangeDepart, refreshAll, refreshAllDepart, countPeg, countPersonPeg, getJudgeTotal, getDepartTotal,
      getAreaCode() {
        // 模拟接口异步请求，数据等页面渲染后获取
        setTimeout(() => {
          // 人员类别
          this.types.forEach((item, index) => {
            this.myStaffTypes.push({
              id: item.id,
              text: item.name
            })
          })
          this.paramsPersonEarch[5].options = this.myStaffTypes
          // 部门正副职
          this.chair.forEach((item, index) => {
            this.myChair.push({
              id: item.id,
              text: item.name
            })
          })
          this.paramsPersonEarch[4].options = this.myChair
          // 部门类型
          this.check.forEach((item, index) => {
            if (item.name !== '其他') {
              this.myDepartTypes.push({
                id: item.id,
                text: item.name
              })
            }
          })
          this.paramsEarch[4].options = this.myDepartTypes
        }, 1000)
      },
      // 获取个人考核-考核方案
      getSchemaId() {
        this.fd.req({
          type: 'get',
          url: 'api/schemas/status-list',
          data: { status: 'finished' }
        }).then(response => {
          const data = response.data || []
          data.forEach((item, index) => {
            this.mySchemaId.push({
              id: item.id,
              text: item.name
            })
          })
          this.paramsPersonEarch[2].options = this.mySchemaId
        }).catch(error => {
          console.log(error)
        })
      },
      // 获取部门考核-考核方案
      getDeptSchemaId() {
        this.fd.req({
          type: 'get',
          url: 'api/dept/schemas/status-list',
          data: { status: 'finished' }
        }).then(response => {
          const data = response.data || []
          data.forEach((item, index) => {
            this.myDeptSchemaId.push({
              id: item.id,
              text: item.name
            })
          })
          this.paramsEarch[2].options = this.myDeptSchemaId
        }).catch(error => {
          console.log(error)
        })
      }
    },
    watch: {
      isRefresh() {
        this.getDepartTotal()
        this.getJudgeTotal()
      }
    }
  }
</script>

<style lang="scss">
.new-time-pick .el-date-editor.el-input {
   width: auto;
}
.new-time-pick .time-divide {
  width: 100%;
  line-height: 32px;
  height: 32px;
}
.width-356px{
  width:356px;
}
.min-height-400 {
  min-height:400px;
}
.height51{
  height:51px;
}
.width-260px {
  width:260px;
}
</style>
