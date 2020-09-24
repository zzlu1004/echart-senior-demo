<template>
<div class="app-container">
    <div class="bg-white container-inner clearfix h14 target" :style="{'min-height': height - 100 + 'px'}">
      <div class="tab-box tab-box-mar">
        <el-tabs v-model="params.indexType" type="card" v-if="elements.report || elements.newSystem" @tab-click="handleClick">
          <el-tab-pane v-if="elements.report" :label="'综合填报('+reportCnt+')'" name="report">
            <div v-show="params.indexType ==='report'">
              <div class="clearfix py2">
                <div class="f-left align-middle">
                    <span class="btn btn-primary mr3 btn-sm"
                          v-if="elements.addType"
                          @click="addTargetType">
                        <i class="at icon-plus"/>新增指标类别
                    </span>
                  <span
                    v-if="elements.sort"
                    class="btn btn-primary btn-sm"
                    @click="orderTargetType({data:{id:'report', name: '所有指标类别'}, children: pOrderOpt})">
                        排序
                    </span>
                </div>
                <span class="f-right align-middle height-normal line-height-normal pl2">
                    <span>
                        生效中
                    </span>
                    <el-popover
                      placement="bottom"
                      width="310"
                      trigger="hover"
                      content="当前所关联的方案正在生效周期中，为了保证考核方案的正常实施，系统暂时不开放对该方案相关的细则、指标、流程以及权重系数等进行编辑或删除操作。">
                        <i slot="reference" class="at icon-questioncircle color-d9d9d9 pointer"/>
                    </el-popover>
                </span>
                <div class="f-right">
                  <fd-search v-if="params.indexType ==='report'" @search="searchByKeyword"
                             v-model="searchVal1"></fd-search>
                </div>
                <span class="f-right btn btn-default btn-sm mr2" v-if="elements.download" @click="downloadTable(params.indexType)">
                  <i class="at icon-download"/>
                  导出
                </span>
              </div>
              <div>
                <div class="mb2">
                  <fd-tree-table
                    :loading="reportLoading"
                    :columns="targetOption.columns"
                    :height="targetOption.height"
                    :data="reportTargetData"
                    v-on:editTarget="editTarget"
                    @addTarget="addTarget"
                    @orderTarget="orderTarget"
                    @cellClick="seeTarget"
                    v-on:copyTarget="copyTarget"
                    v-on:deleteTarget="deleteTarget"
                  ></fd-tree-table>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="elements.newSystem" :label="'新系统测算('+newSystemCnt+')'" name="newSystem">
            <!-- 新系统测算 -->
            <div v-show="params.indexType ==='newSystem'">
              <div class="clearfix py2">
                <div class="f-left align-middle">
                    <span class="btn btn-primary mr3 btn-sm"
                          v-if="elements.addType"
                          @click="addTargetType">
                        <i class="at icon-plus"/>新增指标类别
                    </span>
                  <span
                    v-if="elements.sort"
                    class="btn btn-primary btn-sm"
                    @click="orderTargetType({data:{id:'newSystem', name: '所有指标类别'}, children: pOrderOpt})">
                        排序
                    </span>
                </div>
                <span class="f-right align-middle height-normal line-height-normal pl2">
                    <span>
                        生效中
                    </span>
                    <el-popover
                      placement="bottom"
                      width="310"
                      trigger="hover"
                      content="当前所关联的方案正在生效周期中，为了保证考核方案的正常实施，系统暂时不开放对该方案相关的细则、指标、流程以及权重系数等进行编辑或删除操作。">
                        <i slot="reference" class="at icon-questioncircle color-d9d9d9 pointer"/>
                    </el-popover>
                </span>
                <div class="f-right">
                  <fd-search v-if="params.indexType ==='newSystem'" @search="searchByKeyword"
                             v-model="searchVal3"></fd-search>
                </div>
                <span class="f-right btn btn-default btn-sm mr2" v-if="elements.download" @click="downloadTable(params.indexType)">
                  <i class="at icon-download"/>
                  导出
                </span>
              </div>
              <div>
                <div class="mb2">
                  <fd-tree-table
                    :loading="newSystemLoading"
                    :columns="newSystemOpt.columns"
                    :height="newSystemOpt.height"
                    :data="newSystemTargetData"
                    v-on:editTarget="editTarget"
                    @addTarget="addTarget"
                    @orderTarget="orderTarget"
                    @cellClick="seeTarget"
                    v-on:copyTarget="copyTarget"
                    v-on:deleteTarget="deleteTarget"
                  ></fd-tree-table>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <fd-dialog
          :title="modelTitle"
          :syncVisible="targetVsible"
          @beforeClose="targetVsible = false"
        >
          <div slot="fd-body">
            <el-row>
              <el-col :span="20">
                <el-form
              v-show="modelTitle === '指标类别设置'"
              :rules="targetTypeRules"
              ref="targetTypeForm"
              :model="targetTypeForm"
              label-position="right"
              label-width="35%">
              <el-form-item class="hide" label="isLeaf">
                  <el-input v-model="targetTypeForm.isLeaf"></el-input>
              </el-form-item>
              <el-form-item label="指标类别名称" prop="name">
                  <el-input v-model="targetTypeForm.name" placeholder="请输入指标名称，不多于50个字"></el-input>
              </el-form-item>
              <el-form-item label="详情描述" prop="content">
                  <el-input type="textarea" v-model="targetTypeForm.content" placeholder="请输入描述性信息，不多于1000个字"></el-input>
              </el-form-item>
            </el-form>
              </el-col>
              <el-col :span="4"></el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form v-if="params.indexType === 'report' || params.indexType === 'system'"
                         v-show="modelTitle === '指标设置' || modelTitle === '指标详情'"
                         :rules="targetRules"
                         ref="targetForm"
                         :model="targetForm"
                         label-position="right"
                         label-width="35%">
                  <el-form-item class="hide" label="指标类别id" prop="pid">
                    <el-input :readonly="modelTitle == '指标详情'" v-model="targetForm.pid"></el-input>
                  </el-form-item>
                  <el-form-item class="hide" label="isLeaf">
                    <el-input :readonly="modelTitle == '指标详情'" v-model="targetForm.isLeaf"></el-input>
                  </el-form-item>
                  <el-form-item label="指标名称" prop="name">
                    <el-input :readonly="modelTitle == '指标详情'" v-model="targetForm.name" placeholder="请输入指标名称，不多于100个字"></el-input>
                  </el-form-item>
                  <el-form-item label="详情描述" prop="content">
                    <el-input :readonly="modelTitle == '指标详情'" type="textarea" v-model="targetForm.content" placeholder="请输入描述性信息，不多于1000个字"></el-input>
                  </el-form-item>
                  <el-form-item label="指标方向" prop="isPositive">
                    <el-select :disabled="modelTitle == '指标详情'" v-model="targetForm.isPositive" placeholder="请选择指标方向">
                      <el-option label="正向" :value=1></el-option>
                      <el-option label="负向" :value=0></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="params.indexType ==='report'" label="指标区间" prop="valueMin">
                    <el-col :span="11">
                      <el-form-item>
                        <el-input :readonly="modelTitle == '指标详情'" v-model="targetForm.valueMin" placeholder="请输入具体数值" value="number" :max="targetForm.valueMax"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col class="line center" :span="2">至</el-col>
                    <el-col :span="11">
                      <el-form-item prop="valueMax">
                        <el-input :readonly="modelTitle == '指标详情'" v-model="targetForm.valueMax" placeholder="请输入具体数值" value="number" :min="targetForm.valueMin"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-form-item>
                  <el-form-item v-if="params.indexType ==='report'" label="关联流程" prop="flowIds">
                    <el-select :disabled="modelTitle == '指标详情'" v-model="targetForm.flowIds" multiple placeholder="请选择关联流程">
                      <el-option
                        v-for="item of relate"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="上传填报材料说明" v-if="params.indexType === 'report'" required>
                    <el-form-item prop="uploadZero">
                      指标值为0时，是否必须上传：
                      <el-radio-group :disabled="modelTitle == '指标详情'" v-model="targetForm.uploadZero">
                      <el-radio label="是"></el-radio>
                      <el-radio label="否"></el-radio>
                    </el-radio-group>
                    </el-form-item>
                    <el-form-item prop="uploadNonzero">
                      指标值不为0时，是否必须上传：
                    <el-radio-group :disabled="modelTitle == '指标详情'" v-model="targetForm.uploadNonzero">
                      <el-radio label="是"></el-radio>
                      <el-radio label="否"></el-radio>
                    </el-radio-group>
                    </el-form-item>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="4"></el-col>
            </el-row>
            <el-row v-if="params.indexType === 'newSystem' && (modelTitle === '指标设置' || modelTitle === '指标详情')">
              <el-col :span="20">
                <el-form
                  :rules="newSystemRules"
                  ref="targetForm"
                  :model="targetForm"
                  label-position="right"
                  label-width="35%">
                  <div class="tab-box" style="padding-left: 35%">
                    <el-radio-group v-model="newSystemRadio" size="small">
                      <el-radio-button label="basic">基础值</el-radio-button>
                      <el-radio-button label="personal">部门指标值</el-radio-button>
                      <el-radio-button label="scoreChange">分数换算</el-radio-button>
                    </el-radio-group>
                  </div>
                  <div v-show="newSystemRadio === 'basic'">
                    <div class="clearfix py2">
                      <el-form-item class="hide" label="指标类别id" prop="pid">
                        <el-input :readonly="modelTitle == '指标详情'" v-model="targetForm.pid"></el-input>
                      </el-form-item>
                      <el-form-item class="hide" label="isLeaf">
                        <el-input :readonly="modelTitle == '指标详情'" v-model="targetForm.isLeaf"></el-input>
                      </el-form-item>
                      <el-form-item label="指标名称" prop="name">
                        <el-input :readonly="modelTitle == '指标详情'" v-model="targetForm.name" placeholder="请输入指标名称，不多于50个字"></el-input>
                      </el-form-item>
                      <el-form-item label="详情描述" prop="content">
                        <el-input :readonly="modelTitle == '指标详情'" type="textarea" v-model="targetForm.content" placeholder="请输入描述性信息，不多于1000个字"></el-input>
                      </el-form-item>
                      <el-form-item label="指标方向" prop="isPositive">
                        <el-select :disabled="modelTitle == '指标详情'" v-model="targetForm.isPositive" placeholder="请选择指标方向">
                          <el-option label="正向" :value=1></el-option>
                          <el-option label="负向" :value=0></el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="指标层级" prop="indexLevel">
                      <el-select :disabled="modelTitle == '指标详情'" v-model="targetForm.indexLevel" placeholder="请选择指标层级">
                        <el-option
                          v-for="item in indexLevels" v-if="item.id !== 'k10032-00'"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="是否参与考核" prop="isAccess">
                    <label slot="label" style="line-height:24px;">是否参与考核</label>
                      <el-select :disabled="modelTitle == '指标详情'" v-model="targetForm.isAccess" placeholder="请选择是否参与考核">
                        <el-option
                          v-for="item in isAccesses"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="指标范围" prop="indexScope" v-if="targetForm.indexLevel !== 'k10032-02'">
                      <el-input :readonly="modelTitle == '指标详情'" type="textarea" v-model="targetForm.indexScope" placeholder="请输入指标范围"></el-input>
                  </el-form-item>
                  <el-form-item label="指标规则" prop="indexExpression">
                      <el-input :readonly="modelTitle == '指标详情'" type="textarea" v-model="targetForm.indexExpression" placeholder="请输入指标规则"></el-input>
                  </el-form-item>
                  </div>
                </div>
                  <div v-show="newSystemRadio === 'personal'">
                    <div class="clearfix py2">
                      <div>
                        <el-form-item label="部门指标值规则" prop="departExpression">
                          <el-select :disabled="modelTitle == '指标详情'" required v-model="targetForm.departExpression" placeholder="请选择部门指标值规则">
                            <el-option
                              v-for="item in departExpressions"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="部门指标值范围" prop="departScope" v-if="!(targetForm.indexLevel=== 'k10032-02' && targetForm.departExpression === 'k10034-01')">
                          <el-input :readonly="modelTitle == '指标详情'" v-model="targetForm.departScope"></el-input>
                        </el-form-item>
                        <el-form-item label="个人值范围" prop="departPersonalScope" v-if="targetForm.departExpression === 'k10034-02'">
                          <el-input :readonly="modelTitle == '指标详情'" v-model="targetForm.departPersonalScope"></el-input>
                        </el-form-item>
                        <el-form-item label="反查类型" prop="dataDetail">
                            <el-select :disabled="modelTitle == '指标详情'" v-model="targetForm.dataDetail" placeholder="请选择反查类型">
                              <el-option
                                v-for="item in dataDetails"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                              </el-option>
                            </el-select>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                  <div v-show="newSystemRadio === 'scoreChange'">
                    <div class="clearfix py2">
                        <el-form-item label="全院值规则" prop="courtExpression">
                          <el-select :disabled="modelTitle == '指标详情'" v-model="targetForm.courtExpression" placeholder="请选择全院值规则">
                            <el-option
                              v-for="item in courtExpressions"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <!-- 新系统测算中新增二级指标，在二级指标的分数换算中，全院值规则选择按基础值计算，当全院值规则选择按照基础值计算时，【全院值范围】的输入框不显示 -->
                        <el-form-item v-if="!(targetForm.indexLevel=== 'k10032-02' && targetForm.courtExpression === 'k10035-01')" label="全院值范围" prop="courtScope">
                          <el-input :readonly="modelTitle == '指标详情'" type="textarea" v-model="targetForm.courtScope" placeholder="请输入全院值范围"></el-input>
                        </el-form-item>
                        <el-form-item label="个人值范围" prop="courtPersonalScope" v-if="targetForm.courtExpression === 'k10035-02'">
                          <el-input :readonly="modelTitle == '指标详情'" v-model="targetForm.courtPersonalScope"></el-input>
                        </el-form-item>
                        <el-form-item label="全院均值分子规则" prop="courtAvgNumeratorExpression">
                          <el-select :disabled="modelTitle == '指标详情'" v-model="targetForm.courtAvgNumeratorExpression" placeholder="请选择全院均值分子规则">
                            <el-option
                              v-for="item in courtExpressions"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item  v-if="!(targetForm.indexLevel=== 'k10032-02' && targetForm.courtAvgNumeratorExpression === 'k10035-01')" label="全院均值分子范围" prop="courtAvgNumeratorScope">
                          <el-input :readonly="modelTitle == '指标详情'" type="textarea" v-model="targetForm.courtAvgNumeratorScope" placeholder="请输入全院均值分子范围"></el-input>
                        </el-form-item>
                        <el-form-item label="全院均值分母规则" prop="courtAvgDenominatorExpression">
                          <el-input :readonly="modelTitle == '指标详情'" type="textarea" v-model="targetForm.courtAvgDenominatorExpression" placeholder="请输入全院均值分母规则"></el-input>
                        </el-form-item>
                        <el-form-item label="全院均值分母范围" prop="courtAvgDenominatorScope">
                          <el-input :readonly="modelTitle == '指标详情'" type="textarea" v-model="targetForm.courtAvgDenominatorScope" placeholder="请输入全院均值分母范围"></el-input>
                        </el-form-item>
                        <el-form-item label="个人值范围" prop="courtAvgPersonalScope" v-if="targetForm.courtAvgNumeratorExpression === 'k10035-02'">
                          <el-input :readonly="modelTitle == '指标详情'" v-model="targetForm.courtAvgPersonalScope"></el-input>
                        </el-form-item>
                      </div>
                    </div>
                </el-form>
              </el-col>
              <el-col :span="4"></el-col>
            </el-row>

            <div v-show="modelTitle === '指标排序'||modelTitle === '指标类别排序'">
                <div class="h16 color-forbid mb1">
                  {{(sortTarget.data)&&dataMap[sortTarget.data.id]?'选中下列指标可上下拖拽进行排序':'选中下列指标类别可上下拖拽进行排序'}}
                </div>
                <div>
                    <fd-draggable
                      v-on:dragend="dragend"
                      label="name"
                      group="sortTarget"
                      :list="sortTarget.children?sortTarget.children:[]"></fd-draggable>
                </div>
            </div>
          </div>
          <div slot="fd-footer">
            <el-button v-if="modelTitle != '指标详情'" size="small" @click="targetVsible = false">取消</el-button>
            <el-button v-if="modelTitle != '指标详情'" size="small" type="primary" @click="sureSave">确定</el-button>
            <el-button v-if="modelTitle == '指标详情'" size="small" @click="targetVsible = false">关闭</el-button>
          </div>
        </fd-dialog>
    </div>
</div>
</template>

<script>
    import FdTreeTable from '../components/treeTable'
    import fdDialog from 'fd/dialog/src/dialog.vue'
    import { noString } from '@/utils/filters'
    import { currentChange, sizeChange } from '@/api/kpi/checkDepart/checkProcessDepart'
    import { dragend } from '@/api/kpi/record/depart'
    import { resetForm } from '@/api/kpi/record'
    import { addTargetType, orderTargetType, getTargetList, sureSave, addTarget, orderTarget,
      editTarget, copyTarget, deleteTarget, getTargetCount, getAllProcess,
      searchByKeyword, saveSort, seeTarget, downloadTable } from '@/api/kpi/checkDepart/targetDepart'
    import { isNumber } from '@/utils/validate'
    import FdDraggable from 'fd/drag/draggable'
    export default {
      name: 'targetDepart',
      components: {
        FdTreeTable, FdDraggable, fdDialog
      },
      methods: {
        handleClick() {
          this.getTargetList(this.params.indexType)
        },
        getTargetList, resetForm, searchByKeyword, currentChange, sizeChange, addTargetType, orderTargetType,
        orderTarget, sureSave, addTarget, editTarget, copyTarget, deleteTarget, getTargetCount, getAllProcess,
        saveSort, dragend, isNumber, seeTarget, downloadTable
      },
      data() {
        var validateValueMin = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入具体数值'))
          } else if (!this.isNumber(value)) {
            callback(new Error('请输入数字'))
          } else if (parseFloat(value) > 10000 || parseFloat(value) < -10000) {
            callback(new Error('数值范围为-9999.99-9999.99以内'))
          } else if (!(/^-?\d+(\.\d{0,2})?$/.test(value))) {
            callback(new Error('最多输入两位小数'))
          } else if (value - this.targetForm.valueMax > 0) {
            callback(new Error('请不要大于最大值'))
          } else {
            callback()
          }
        }
        var validateValueMax = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入具体数值'))
          } else if (!this.isNumber(value)) {
            callback(new Error('请输入数字'))
          } else if (parseFloat(value) > 10000 || parseFloat(value) < -10000) {
            callback(new Error('数值范围为-9999.99-9999.99以内'))
          } else if (!(/^-?\d+(\.\d{0,2})?$/.test(value))) {
            callback(new Error('最多输入两位小数'))
          } else {
            callback()
          }
        }
        return {
          newSystemRadio: 'basic',
          pOrderOpt: [],
          height: this.$store.getters.globals.height,
          modelTitle: '',
          targetVsible: false,
          searchVal1: '',
          searchVal2: '',
          searchVal3: '',
          dataMap: {}, // 保存表格数据id的映射关系
          oldSorts: [],
          newSorts: [],
          relate: [], // 关联流程列表
          valObj: {
            'report': 'searchVal1',
            'system': 'searchVal2',
            'newSystem': 'searchVal3'
          },
          reportLoading: false,
          newSystemLoading: false,
          systemLoading: false,
          params: {
            indexType: 'report',
            indexName: ''
          },
          flowParam: {
            limit: 0,
            offset: 0
          },
          targetTypeForm: {
            name: '',
            content: '',
            isLeaf: 0
          },
          targetTypeRules: {
            name: [
              { required: true, message: '请输入指标类别名称', trigger: 'blur' },
              { max: 50, message: '长度不超过50个字符', trigger: 'blur' }
            ],
            content: [
              { max: 1000, message: '长度不超过1000个字符', trigger: 'blur' }
            ]
          },
          targetForm: {
            name: '',
            content: '',
            isLeaf: 1,
            pid: '',
            isPositive: '',
            valueMin: '',
            valueMax: '',
            uploadZero: '',
            uploadNonzero: '',
            flowIds: []
          },
          // 拖拽数据对象集合
          sortTarget: {},
          newSystemRules: {
            name: [
              { required: true, message: '请输入指标名称', trigger: 'blur' },
              { max: 50, message: '长度不超过50个字符', trigger: 'blur' }
            ],
            content: [
              { max: 1000, message: '长度不超过1000个字符', trigger: 'blur' }
            ],
            isPositive: [
              { required: true, message: '请选择指标方向', trigger: 'change' }
            ],
            indexLevel: [
              { required: true, message: '请选择指标层级', trigger: 'change' }
            ],
            isAccess: [
              { required: true, message: '请选择是否参与考核', trigger: 'change' }
            ],
            dataDetail: [
              { required: true, message: '请选择反查类型', trigger: 'change' }
            ],
            indexScope: [
              { required: true, message: '请输入指标范围', trigger: 'blur' }
            ],
            indexExpression: [
              { required: true, message: '请输入指标规则', trigger: 'blur' }
            ],
            departExpression: [
              { required: true, message: '请选择部门指标值规则', trigger: 'change' }
            ],
            courtExpression: [
              { required: true, message: '请选择全院值规则', trigger: 'change' }
            ],
            courtAvgNumeratorExpression: [
              { required: true, message: '请选择全院均值分子规则', trigger: 'change' }
            ],
            courtAvgDenominatorExpression: [
              { required: true, message: '请选择全院均值分母规则', trigger: 'change' }
            ]
          },
          targetRules: {
            name: [
              { required: true, message: '请输入指标名称', trigger: 'blur' },
              { max: 100, message: '长度不超过100个字符', trigger: 'blur' }
            ],
            content: [
              { max: 1000, message: '长度不超过1000个字符', trigger: 'blur' }
            ],
            isPositive: [
              { required: true, message: '请选择指标方向', trigger: 'change' }
            ],
            valueMin: [
              { required: true, validator: validateValueMin, trigger: 'blur' }
            ],
            valueMax: [
              { required: true, validator: validateValueMax, trigger: 'blur' }
            ],
            flowIds: [
              { required: true, message: '请选择关联流程', trigger: 'change' }
            ],
            uploadZero: [
              { required: true, message: '请选择指标值为0时，是否必须上传', trigger: 'change' }
            ],
            uploadNonzero: [
              { required: true, message: '请选择指标值不为0时，是否必须上传', trigger: 'change' }
            ]
          },
          // targetData: [],
          reportTargetData: [],
          newSystemTargetData: [],
          systemTargetData: [],
          newSystemOpt: {
            height: this.$store.getters.globals.height - 260,
            columns: [
              {
                field: 'name',
                title: '指标目录',
                expand: true,
                minWidth: '200px',
                showOverflowTooltip: true,
                formatter: (row, value) => {
                  return row.isLeaf ? `<span class="color-blue pointer">${value}</span>` : value
                }
              },
              {
                field: 'content',
                title: '详情描述',
                minWidth: '200px',
                showOverflowTooltip: true
              },
              {
                field: 'isPositive',
                title: '指标方向',
                width: '120px',
                formatter: (row, value) => {
                  if (value === 0) {
                    return '<span>负</span><i class="at icon-arrowdown"/>'
                  } else if (value === 1) {
                    return '<span>正</span><i style="color:#ffbf00" class="at icon-arrowup"/>'
                  } else {
                    return ''
                  }
                }
              },
              {
                field: 'indexLevel',
                title: '指标层级',
                width: this.fd.tools.getStringWidth('指标层级'),
                formatter: (row, value) => {
                  return this.indexLevelMap[value]
                }
              },
              {
                field: 'isAccess',
                title: '是否参与考核',
                width: this.fd.tools.getStringWidth('是否参与考核'),
                formatter: (row, value) => {
                  return this.checkMap[value]
                }
              },
              {
                field: 'dataDetail',
                title: '反查类型',
                width: this.fd.tools.getStringWidth('反查类型'),
                formatter: (row, value) => {
                  return this.dataDetailMap[value]
                }
              },
              {
                field: 'indexScope',
                title: '指标范围',
                minWidth: '200px',
                showOverflowTooltip: true
              },
              {
                field: 'indexExpression',
                title: '指标规则',
                minWidth: '200px',
                showOverflowTooltip: true
              },
              {
                field: 'status',
                title: '当前状态',
                width: this.fd.tools.getStringWidth('反查类型'),
                formatter: (row, value) => {
                  if (row.isLeaf === 1) {
                    return (value === 'inactive' ? '未生效' : '生效中')
                  } else {
                    return ''
                  }
                }
              },
              {
                field: '',
                title: '操作',
                width: this.fd.tools.getStringWidth('操作3'),
                type: 'operate',
                operate: [{
                  text: '新增',
                  show: 'isadd',
                  disabled: '',
                  eventName: 'addTarget'
                }, {
                  text: '编辑',
                  show: 'edit',
                  disabled: 'isedit',
                  eventName: 'editTarget'
                }, {
                  text: '复制',
                  show: 'isChild',
                  eventName: 'copyTarget'
                }, {
                  text: '排序',
                  show: 'issort',
                  eventName: 'orderTarget'
                }, {
                  text: '删除',
                  show: 'isdelete',
                  disabled: 'isedit',
                  eventName: 'deleteTarget'
                }]
              }
            ]
          },
          targetOption: {
            height: this.$store.getters.globals.height - 260,
            columns: [
              {
                field: 'name',
                title: '指标目录',
                expand: true,
                formatter: (row, value) => {
                  return row.isLeaf ? `<span class="color-blue pointer">${value}</span>` : value
                }
              },
              {
                field: 'content',
                title: '详情描述',
                showOverflowTooltip: true
              },
              {
                field: 'isPositive',
                title: '指标方向',
                width: '120px',
                formatter: (row, value) => {
                  if (value === 0) {
                    return '<span>负</span><i class="at icon-arrowdown"/>'
                  } else if (value === 1) {
                    return '<span>正</span><i style="color:#ffbf00" class="at icon-arrowup"/>'
                  } else {
                    return ''
                  }
                }
              },
              {
                field: '',
                title: '指标区间',
                width: '130px',
                formatter: (row, value) => {
                  return (row.valueMin || row.valueMax) ? '[' + noString(row.valueMin) + '~' + noString(row.valueMax) + ']' : ''
                }
              },
              {
                field: 'flows',
                title: '关联流程',
                showOverflowTooltip: true,
                formatter: (row, value) => {
                  const back = []
                  for (const item of value) {
                    back.push(item.flowName)
                  }
                  return back.join(';')
                }
              },
              {
                field: 'status',
                title: '当前状态',
                width: '120px',
                formatter: (row, value) => {
                  if (row.isLeaf === 1) {
                    return (value === 'inactive' ? '未生效' : '生效中')
                  } else {
                    return ''
                  }
                }
              },
              {
                field: '',
                title: '操作',
                width: this.fd.tools.getStringWidth('操作3'),
                type: 'operate',
                operate: [{
                  text: '新增',
                  show: 'isadd',
                  eventName: 'addTarget'
                }, {
                  text: '编辑',
                  show: 'edit',
                  disabled: 'isedit',
                  eventName: 'editTarget'
                }, {
                  text: '复制',
                  show: 'isChild',
                  eventName: 'copyTarget'
                }, {
                  text: '排序',
                  show: 'issort',
                  eventName: 'orderTarget'
                }, {
                  text: '删除',
                  show: 'isdelete',
                  disabled: 'isedit',
                  eventName: 'deleteTarget'
                }]
              }
            ]
          },
          systemOption: {
            height: this.$store.getters.globals.height - 260,
            columns: [
              {
                field: 'name',
                title: '指标目录',
                expand: true,
                formatter: (row, value) => {
                  return row.isLeaf ? `<span class="color-blue pointer">${value}</span>` : value
                }
              },
              {
                field: 'content',
                title: '详情描述',
                showOverflowTooltip: true
              },
              {
                field: 'isPositive',
                title: '指标方向',
                width: '120px',
                formatter: (row, value) => {
                  if (value === 0) {
                    return '<span>负</span><i class="at icon-arrowdown"/>'
                  } else if (value === 1) {
                    return '<span>正</span><i style="color:#ffbf00" class="at icon-arrowup"/>'
                  } else {
                    return ''
                  }
                }
              },
              {
                field: '',
                title: '操作',
                width: this.fd.tools.getStringWidth('操作2'),
                type: 'operate',
                operate: [{
                  text: '编辑',
                  disabled: 'isedit',
                  show: 'edit',
                  eventName: 'editTarget'
                }, {
                  text: '排序',
                  show: 'issort',
                  eventName: 'orderTarget'
                }]
              }
            ]
          },
          systemCnt: 0,
          reportCnt: 0,
          newSystemCnt: 0,
          newSystemAccessCnt: 0,
          // 参与考核
          checkMap: this.fd.tools.mapSelects('k10004'),
          // 指标层级
          indexLevelMap: this.fd.tools.mapSelects('k10032'),
          // 反查类型
          dataDetailMap: this.fd.tools.mapSelects('k10033')
        }
      },
      mounted() {
        if (this.elements.system && !this.elements.report) {
          this.params.indexType = 'system'
        }
      },
      activated() {
        this.getTargetList(this.params.indexType)
        this.getTargetCount()
        this.getAllProcess()
      },
      computed: {
        elements() {
          return this.$store.getters.elements.targetDepart || {}
        },
        // 参与考核
        isAccesses() {
          return this.$store.getters.selects['k10004']
        },
        // 指标层级
        indexLevels() {
          return this.$store.getters.selects['k10032']
        },
        // 反查类型
        dataDetails() {
          return this.$store.getters.selects['k10033']
        },
        // 部门指标规则
        departExpressions() {
          return this.$store.getters.selects['k10034']
        },
        // 法院指标规则
        courtExpressions() {
          return this.$store.getters.selects['k10035']
        }
      },
      watch: {
        reportTargetData(data) {
          this.dataMap = this.fd.data.arrayToObj(data, 'id')
        },
        newSystemTargetData(data) {
          this.dataMap = this.fd.data.arrayToObj(data, 'id')
        },
        systemTargetData(data) {
          this.dataMap = this.fd.data.arrayToObj(data, 'id')
        }
      }
    }
</script>

<style lang="scss">
  .target {
    .color-d9d9d9{
      color:#d9d9d9;
    }
    .pr-60px{
        padding-right:60px;
    }
    .no-personal{
      height:120px;
      line-height:120px;
    }
  }
</style>
