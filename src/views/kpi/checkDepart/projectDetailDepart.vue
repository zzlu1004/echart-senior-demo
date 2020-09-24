<template>
  <div class="app-container project-detail">
    <div class="container-inner has-fixed-bottom bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="t-center p2 bg-gray">
        <span class="h18 bold color-title mr1">{{projectForm.name}}</span>
        <span v-html="statusMap[projectForm.statusId]"></span>
        <span class="f-right">更新时间: {{projectForm.updateTime|parseTime('{y}-{m}-{d}')}}</span>
      </div>
      <el-form class="py2"
               :model="projectForm"
               label-position="top"
               size="small"
               ref="projectForm">
        <el-row>
          <el-col :span="12" v-if="$store.getters.globals.isIE">
            <el-form-item label="考评周期" class="readonly" prop="times">
              <el-date-picker
                type="date"
                value-format="yyyy-MM-dd"
                v-model="projectForm.startTime"
                readonly
                class="mr1"></el-date-picker>
              -
              <el-date-picker
              type="date"
              value-format="yyyy-MM-dd"
              readonly
              v-model="projectForm.endTime"
              class="ml1"
              :clearable=false></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-else>
            <el-form-item label="考评周期" class="readonly" prop="times">
              <el-date-picker
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                v-model="projectForm.startTime"
                readonly
                class="mr1"></el-date-picker>
              -
              <el-date-picker
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              readonly
              v-model="projectForm.endTime"
              class="ml1"
              :clearable=false></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="$store.getters.globals.isIE">
            <el-form-item label="上报截止时间" prop="deadlineTime">
              <el-date-picker
                v-model="projectForm.deadlineTime"
                type="date"
                readonly
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-else>
            <el-form-item label="上报截止时间" prop="deadlineTime">
              <el-date-picker
                v-model="projectForm.deadlineTime"
                type="date"
                readonly
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="content">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 20 }"
            readonly
            v-model="projectForm.content"
            placeholder="请输入方案的备注信息,不多于1000个字"></el-input>
        </el-form-item>
        <el-form-item label="关联系数" prop="weightId">
          <div class="width-300px">
            <el-select v-model="projectForm.weightId"
                       placeholder="请选择关联系数"
                       disabled>
              <el-option
                v-for="item in weight"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="关联细则" prop="blocks">
          <div>
            <div class="tab-box tab-box-mar">
              <el-tabs v-model="blockId" type="card" >
                <el-tab-pane v-for="(item, index) of blocksName"
                             v-if="elementsDes[item.id]"
                             :label="item.name+'('+blocks[index].data.length+')'"
                             :key="item.id"
                             :name="item.id">
                  <div v-if="elementsDes[item.id] && item.id === blockId"
                       v-for="item of blocks"
                       :key="item.id">
                    <fd-table
                      className="mt2"
                      emptyText=""
                      :loading="tableLoading"
                      v-bind:data="item.data">
                      <el-table-column
                        type="index"
                        label="序号"
                        width="60">
                      </el-table-column>
                      <el-table-column
                        prop="blockName"
                        show-overflow-tooltip
                        width="300"
                        label="细则名称">
                        <template slot-scope="scope">
                          <span class="pointer color-link-hover" @click="goRegulationDetail(scope.row)">{{regMap[scope.row.blockId]?regMap[scope.row.blockId].name:scope.row.blockName}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="departs"
                        label="考核部门数"
                        align="right"
                        width="150">
                        <template slot-scope="scope">
                          {{(scope.row.departs||[])['length']}}
                  </template>
                      </el-table-column>
                      <el-table-column
                        prop="departs"
                        class-name=""
                        show-overflow-tooltip
                        :formatter="getDepartStats"
                        label="考核对象">
                      </el-table-column>
                      <el-table-column
                        prop=""
                        :width="fd.tools.getStringWidth('操作2')"
                        label="操作">
                        <template slot-scope="scope">
                          <span @click="addRegulation(scope.row)" class="color-link pointer mr1">对象详情</span>
                        </template>
                      </el-table-column>
                    </fd-table>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div class="fixed-bottom">
        <div class="fixed-bottom-item" @click="goBack">
          <div class="fixed-bottom-item-text">返回</div>
        </div>
        <div class="fixed-bottom-item" v-show="elements.edit && projectForm.statusId === 0" @click = "editProject">
          <div class="fixed-bottom-item-text">编辑</div>
        </div>
      </div>
    </div>
    <fd-dialog
      title="对象详情"
      :syncVisible="projectDialog"
      @beforeClose="projectDialog = false"
      maxHeight="480px"
    >
      <div slot="fd-body" class="px2">
        <el-form class="px2"
                  :rules="regRules"
                  :model="regForm"
                  label-position="right"
                  label-width="100px"
                  ref="regulationForm">
          <el-form-item label="考核细则" prop="blockId">
            <el-row>
              <el-col :span="24">
                <span>{{regForm.blockName}}</span>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <div class="clearfix mb2 mt4">
          <div class="f-left height-normal line-height-normal">
            <span>已选{{regForm.departs.length}}个</span>
          </div>
          <div class="f-right">
            <div class="f-left  height-normal line-height-normal view-checkbox">
            <el-checkbox-group v-model="regForm.departTypes">
              <el-checkbox
                v-for="item of departTypes"
                :key="item.id"
                disabled
                :label="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
            </div>
            <div class="f-right">
            <fd-search  @search="getDeparts"
                            className=""
                            v-model="departName"></fd-search>
            </div>
          </div>
        </div>
          <div class="auto view-checkbox" style="max-height: 250px">
            <fd-new-card v-for="item in staffDeparts"
                         class="mb2" :key="item.id"
                         :data="item"
                         v-on:selectAll="selectStaff"
                         v-on:unselectAll="unselectStaff"
                         :options="options">
              <div slot='body'>
            <el-checkbox-group v-model="regForm.departs">
              <el-checkbox
                v-for="item of departs"
                :key="item.id"
                v-if="showDepart(item)"
                disabled
                :label="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
              </div>
            </fd-new-card>
          </div>
      </div>
      <div slot="fd-footer">
        <el-button size="small" @click="projectDialog = false">关闭</el-button>
      </div>
    </fd-dialog>
  </div>
</template>

<script>
  import {
    getProjectDetail,
    addRegulation,
    getRegulationList,
    getCoefficientList,
    getDeparts,
    showDepart,
    getSelectStaff,
    selectStaff,
    unselectStaff,
    isSelectAble,
    goRegulationDetail,
    showRegulation,
    editProject,
    combineReg,
    getStaff
  } from '@/api/kpi/checkDepart/projectDepart'
  import { goBack, resetForm } from '@/api/common'
  import FdNewCard from 'fd/newCard/FdCard'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  import FdTable from 'fd/table/src/fdTable'
  export default {
    name: 'projectDetailDepart',
    components: { FdTable, FdNewCard, fdDialog },
    props: {},
    data() {
      return {
        statusMap: {
          '0': '<span class="status-map-0">草稿</span>',
          '1': '<span class="status-map-1">已生效</span>',
          '2': '<span class="status-map-2">已结束</span>',
          '3': '<span class="status-map-3">正在结束</span>'
        },
        projectForm: {
          name: '',
          startTime: '',
          endTime: '',
          deadlineTime: '',
          updateTime: '',
          comments: '',
          weightId: '',
          blocks: []
        },
        tableLoading: false,
        schemaId: '',
        departName: '',
        blockId: 'k10015-01',
        // 新建细则前临时保留的细则信息
        blocks: [{
          id: 'k10015-01',
          data: []
        }, {
          id: 'k10015-02',
          data: []
        }, {
          id: 'k10015-03',
          data: []
        }, {
          id: 'k10015-04',
          data: []
        }],
        blocksMap: {},
        // 新增细则弹框校验规则
        regRules: {
          blockId: [{ required: true, message: '请选择细则', trigger: 'change' }]
        },
        // 获取权重的接口保存的数据
        weight: [],
        weightMap: {},
        projectDialog: false,
        projectTitle: '新增细则',
        // 所有细则
        regulations1: [],
        regulations2: [],
        regulations: [],
        reg: {},
        regDe: {},
        // 所有细则的映射关系
        regMap: {},
        // 新增细则弹框保留的数据
        regForm: {
          blockId: '',
          blockName: '',
          schemaBlockType: '',
          departTypes: [],
          departs: []
        },
        departs: [],
        exception: [],
        // staffType: {},
        // staffChair: {},
        departMap: {},
        options: {
          header: {
            left: [{
              type: 'collapse'
            }, {
              type: 'text',
              field: 'name'
            }],
            right: [{
              type: 'button',
              child: [{
                text: '全选',
                event: 'selectAll'
              }, {
                text: '取消选中',
                event: 'unselectAll'
              }]
            }]
          },
          body: {},
          border: true,
          eventNames: ['selectAll', 'unselectAll']
        },
        staffDeparts: [
          { name: '部门' }
        ]
      }
    },
    computed: {
      id() {
        return this.$route.query.id || this.$route.query.schemaId
      },
      departTypes() {
        const types = this.$store.getters.selects['k10027'] || []
        const d = []
        types.forEach((i, idx) => {
          if (i.id !== 'k10027-99') {
            d.push(i)
          }
        })
        return d
      },
      // 页面综合质效，审判质效，民主测评的选择切换 细则类型
      blocksName() {
        const data = this.$store.getters.selects['k10015'] || []
        const back = []
        data.forEach((d, i) => {
          if (this.blocks[i]) {
            back.push(d)
          }
        })
        return back
      },
      elements() {
        return this.$store.getters.elements.checkProjectDepart || {}
      },
      // 方案详情按钮权限
      elementsDes() {
        return this.$store.getters.elements.projectDetailDepart || {}
      }
    },
    mounted() {
      // 如果没有给这个用户配置综合绩效 审判绩效
      if (this.elementsDes['k10015-01']) {
        this.blockId = 'k10015-01'
      } else if (this.elementsDes['k10015-02']) {
        this.blockId = 'k10015-02'
      } else if (this.elementsDes['k10015-03']) {
        this.blockId = 'k10015-03'
      } else if (this.elementsDes['k10015-04']) {
        this.blockId = 'k10015-04'
      }
      this.blocksName.forEach((d, i) => {
        this.blocks[i].id = d.id
        this.blocksMap[d.id] = i
      })
      // this.getCoefficientList()
      // 获取细则，成功后获取人员信息，成功后获取方案详情
      // this.getRegulationList()
    },
    activated() {
      this.getCoefficientList()
      // 获取细则，成功后获取人员信息，成功后获取方案详情
      this.getRegulationList()
    },
    methods: {
      getProjectDetail,
      getCoefficientList,
      goBack,
      addRegulation,
      getRegulationList,
      getDeparts,
      showDepart,
      getSelectStaff,
      goRegulationDetail,
      editProject,
      selectStaff,
      unselectStaff,
      isSelectAble,
      resetForm,
      showRegulation,
      combineReg,
      getStaff,
      getDepartStats(row) {
        const data = row.departs
        const back = []
        for (const item of data) {
          if (this.departMap[item]) {
            back.push(this.departMap[item].name)
          }
        }
        return back.join(' | ')
      }
    },
    watch: {}
  }
</script>

<style>
  .project-detail .el-form-item__content table{
    line-height: 1;
  }
  .project-detail .el-checkbox{
    margin-left: 0;
    margin-right: 16px;
  }
  .default-check-box-height{
    margin-bottom: 0;
  }
</style>
<style lang="scss">
  .app-container.project-detail{
    .status-map-0,
    .status-map-1,
    .status-map-2,
    .status-map-3{
      border: 1px solid;
      border-radius: 15px;
      padding: 4px 16px;
    }
    .status-map-0{
      border-color: #ffcd3c;
      background-color: #fffaeb;
      color: #e09a00;
    }
    .status-map-1{
      background-color: #ebf8f2;
      border: solid 1px #00924b;
      color: #00924c;
    }
    .status-map-2{
      background-color: #edf6fd;
      border: solid 1px #177cc9;
      color: #177dc9;
    }
    .status-map-3{
      background-color: rgba(255, 119, 51, 0.1);
      border: solid 1px #ff7733;
      color: #ff7733;
    }
    .status-map-4{
      background-color: rgba(34, 187, 238, 0.1);
      border: solid 1px #22bbee;
      color: #22bbee;
    }
  }
  .view-checkbox{
    .el-checkbox-group {
      .is-disabled.is-checked{
        .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          background-color: #409eff;
          border-color: #409eff;
        }
        .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after{
          border-color: #fff;
        }
        .el-checkbox__input.is-disabled + span.el-checkbox__label{
          color: #409eff;
        }
      }
    }
  }
</style>
