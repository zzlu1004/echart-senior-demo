<template>
  <div class="report-list">
    <div class="fd-menu-table online-menu-table" id="report-table">
      <table style="width: 100%; table-layout: fixed">
        <thead>
          <tr>
            <th
              :colspan="item.colspan"
              v-for="item of tableHeads"
              :key="item.field"
              :width="item.width"
              :align="item.align || 'left'">
              {{item.label}}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, key) in targetsMsg" :key="key">
            <td v-for="parent of item.parent" :key="parent.menuName" v-if="getExist(parent)" :rowspan="parent.rowspan">
              <span>{{parent.menuName}}</span>
            </td>
            <td v-for="headItem of tableHeads"
                :colspan="(headItem.type === 'tree' ? (deep - item.parent.length) : '1')"
                :key="headItem.field"
                :width="headItem.width"
                :align="headItem.align || 'left'"
                >
                <!-- 编辑页面 -->
              <div v-if="headItem.type !== 'tree' && edit && isfirst">
                <!-- 系统测算的指标没有输入框来编辑填报分数 -->
                <!-- 只要fillHasMe为true，就显示浮层区间提示 -->
                  <el-popover
                    popper-class="score-popover"
                    v-if="headItem.field === 'fillScore' && checkType==='report' && item.fillHasMe && item.indexType !=='2'"
                    placement="right"
                    trigger="hover"
                    :open-delay="200"
                    :content="getPopoverData(item, 'popover')">
                    <!-- 可填报的显示输入框提示 -->
                    <el-input
                      v-if="item.fillEditable"
                      size="small"
                      slot="reference"
                      :class="item.red?'red-border': ''"
                      v-model="item.fillScore"
                      :placeholder="getPopoverData(item, 'placeholder')"
                      @input="checkFillScore(item, 'report')"
                      ></el-input>
                    <!-- hasMe为true，但是不可填报 -->
                    <span v-else slot="reference">
                      <!-- 空的时候，写一个height 18px width：100%的方框来承载popover提示 -->
                      <span v-if="getField(headItem, key) === ''" class="space-font"></span>
                      <span v-else v-html="getField(headItem, key)"></span>
                    </span>
                  </el-popover>
                <!-- 系统测算的指标没有操作按钮 -->
                <span v-else-if="headItem.field === 'operate' && item.indexType !=='2' && item.fillHasMe">
                  <!-- 给所有的操作按钮增加权限 -->
                  <el-button :disabled="!item.fillEditable" type="text" @click="addAttachment(item)">补充材料</el-button>
                  <el-button v-if="item.fillRevocable" type="text" @click="recallTarget(item)">撤回</el-button>
                  <el-button v-if="see" :disabled="!item.fillViewable" type="text" @click="seeRegularDetail(item, resource)">查看</el-button>
                </span>
                <span v-else-if="headItem.field === 'attachments'" @click="seeAttachment(item)">
                    <span class="color-blue pointer" v-html="getField(headItem, key)"></span>
                </span>
                <span v-else-if="(headItem.field === 'fillScore') &&
                  (item.indexType ==='2' || item.fillHasMe)"
                  class="color-placeholder"
                  v-html="getField(headItem, key)">
                </span>
                <!-- 指标类别指标名称需要设置最小宽度150px -->
                <span v-else-if="headItem.field === 'menuName'">
                  <div style="min-width:150px;">
                    <span v-html="getField(headItem, key)"></span>
                  </div>
                </span>
                <!-- 指标说明单行显示不下省略号 -->
                <span v-else-if="headItem.field === 'indexContent'">
                  <!-- 指标说明有值的时候 -->
                  <el-tooltip v-if="getField(headItem, key)" :open-delay='300' effect="dark" :content="getField(headItem, key)" placement="top-start">
                    <div class="dot-hidden">
                      <span v-html="getField(headItem, key)"></span>
                    </div>
                  </el-tooltip>
                  <!-- 指标说明没有值的时候，不做tooltip处理 -->
                  <span v-else v-html="getField(headItem, key)"></span>
                </span>
                <span v-else v-html="getField(headItem, key)"></span>
              </div>
              <!-- 查看页面 -->
              <div v-else>
                  <!-- 系统测算的指标没有操作按钮 -->
                  <span v-if="headItem.field === 'operate'">
                    <span v-if="item.indexType !=='2' && item.fillHasMe">
                      <el-button :disabled="!item.fillRevocable" type="text" @click="recallTarget(item)">撤回</el-button>
                      <el-button v-if="see" :disabled="!item.fillViewable" type="text" @click="seeRegularDetail(item, resource)">查看</el-button>
                    </span>
                  </span>
                  <span v-else-if="headItem.field === 'attachments'" @click="seeAttachment(item)">
                    <span class="color-blue pointer" v-html="getField(headItem, key)"></span>
                  </span>
                  <!-- 指标类别指标名称需要设置最小宽度150px -->
                  <span v-else-if="headItem.field === 'menuName'">
                    <div style="min-width:150px;">
                      <span v-html="getField(headItem, key)"></span>
                    </div>
                  </span>
                  <!-- 指标说明单行显示不下省略号 -->
                  <span v-else-if="headItem.field === 'indexContent'">
                    <!-- 指标说明有值的时候 -->
                    <el-tooltip v-if="getField(headItem, key)" :open-delay='300' effect="dark" :content="getField(headItem, key)" placement="top-start">
                      <div class="dot-hidden">
                        <span v-html="getField(headItem, key)"></span>
                      </div>
                    </el-tooltip>
                    <!-- 指标说明没有值的时候，不做tooltip处理 -->
                    <span v-else v-html="getField(headItem, key)"></span>
                  </span>
                  <!-- 当item为填报分数的时候，分数也需要有分数区间popover提示 -->
                  <span v-else-if="headItem.field === 'fillScore' && item.indexType !=='2' && item.fillHasMe">
                    <el-popover
                      popper-class="score-popover"
                      placement="right"
                      trigger="hover"
                      :open-delay="200"
                      :content="getPopoverData(item, 'popover')">
                      <!-- 当填报分数为空的时候，写一个height 18px width：100%的方框来承载popover提示 -->
                      <span v-if="getField(headItem, key) === ''" slot="reference">
                        <span class="space-font"></span>
                      </span>
                      <!-- 填报分数有值的时候 滑到数字上面显示popover -->
                      <span v-else slot="reference" v-html="getField(headItem, key)" :class="getYellow(item)"></span>
                    </el-popover>
                  </span>
                  <span v-else v-html="getField(headItem, key)"></span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="menus.length === 0" class="bd-bottom el-table__empty-block" style="width: 100%;">
        <span class="el-table__empty-text">暂无数据</span>
      </div>
    </div>
    <fd-dialog
        :title="modelTitle"
        :syncVisible="visible"
        @beforeClose="visible = false"
      >
        <div slot="fd-body">
          <el-form
            ref="attachForm"
            class="attachForm"
            v-if="modelTitle === '材料说明'||modelTitle === '补充材料'"
            :model="attachForm"
            :rules="attachFormRule"
            label-position="right"
            label-width="90px">
            <!-- 上传按钮 -->
            <vue-upload
              v-if="modelTitle === '补充材料'"
              class="hide"
              ref="upload"
              v-model="attachForm.myAttachments"
              :post-action="action"
              :headers="headers"
              :maximum="10"
              :multiple="true"
              @input-file="inputFile"
              @input-filter="inputFilter"
            >
            </vue-upload>
            <el-row class="special-item">
              <el-col :span="12">
                <el-form-item label="指标">
                  <span>{{attachForm.menuName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="考核对象">
                  <span>{{attachForm.staffName}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="over-box">
              <!-- attachForm.fillNodeActions长度为0 -->
              <el-row
                v-if="attachForm.fillNodeActions.length === 0">
                <el-col :span="12" class="special-item">
                  <el-form-item label="填报人">
                    <span>{{staffName}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12" class="special-item">
                  <el-form-item label="指标值">
                    <span>--</span>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="填报说明" prop="content">
                      <el-input
                          v-model="fillNodeActionsContent"
                          :maxlength=1000
                          type="textarea"
                          placeholder="请补充额外说明，不多于1000字"
                          :readonly="modelTitle === '材料说明'"
                      ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="附加材料">
                    <div v-if="modelTitle === '补充材料'">
                        <span class="btn btn-default" @click="addAttachBtn">
                            <i class="at icon-upload"/>
                            上传文件
                        </span>
                        <div class="tip-content">
                          <div class="py1">支持上传文件类型为：rar、zip、doc、docx、pdf、jpg、png、xlsx、xls</div>
                          <div>数量不多于10个，每个不大于10M</div>
                        </div>
                      </div>
                      <div class="attachment-list color-blue pb2" v-if="modelTitle === '材料说明'">
                          <div v-for="info of it.attachments" :key="info.id" @click="downloadFile(info)">
                              <i class="at icon-paperclip"/>
                              <span class="pointer">{{info.attachmentName}}</span>
                          </div>
                      </div>
                      <div class="attachment-box pb2" v-if="modelTitle === '补充材料'">
                        <div class="mt2 tag-box" v-for="info of attachForm.myAttachments" :key="info.id">
                            <i class="color-blue at icon-paperclip"/>
                            <span class="color-blue">{{info.name}}</span>
                            <i class="ml1 at icon-closecircle color-placeholder pointer delete-btn"
                              @click.stop="handleRemove(info)"/>
                        </div>
                      </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- attachForm.fillNodeActions当前这个审核或者填报节点有多少人处理 -->
              <el-row
                v-else
                v-for="(it, index) of attachForm.fillNodeActions" :key="it.id">
                <el-col :span="12" class="special-item">
                  <el-form-item label="填报人">
                    <span>{{it.operatorName}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12" class="special-item">
                  <el-form-item label="指标值">
                    <span>{{it.score}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="填报说明" prop="content">
                      <el-input
                          v-model="it.content"
                          :maxlength=1000
                          type="textarea"
                          placeholder="请补充额外说明，不多于1000字"
                          :readonly="modelTitle === '材料说明'"
                      ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item :class="index === attachForm.fillNodeActions.length - 1 ? '' : 'bd-dashed-bottom'" label="附加材料">
                      <!-- <el-upload
                          v-if="modelTitle === '补充材料'"
                          ref="upload"
                          :action="action"
                          :auto-upload="false"
                          :headers="headers"
                          :on-preview="handlePreview"
                          :on-remove="handleRemove"
                          :on-success="handleSuccess"
                          :before-upload="beforeAvatarUpload"
                          multiple
                          :limit="10"
                          :on-exceed="handleExceed"
                          :file-list="it.attachments">
                          <span class="btn btn-default">
                              <i class="at icon-upload"/>
                              上传文件
                          </span>
                          <div slot="tip" class="el-upload__tip color-999">
                              <div class="py1">支持上传文件类型为：rar、zip、doc、docx、pdf、jpg、png、xlsx、xls</div>
                              <div>数量不多于10个，每个不大于10M</div>
                          </div>
                      </el-upload> -->
                      <div v-if="modelTitle === '补充材料' && attachForm.fillNodeActionId === it.id">
                        <span class="btn btn-default" @click="addAttachBtn">
                            <i class="at icon-upload"/>
                            上传文件
                        </span>
                        <div class="tip-content">
                          <div class="py1">支持上传文件类型为：rar、zip、doc、docx、pdf、jpg、png、xlsx、xls</div>
                          <div>数量不多于10个，每个不大于10M</div>
                        </div>
                      </div>
                      <div class="attachment-list color-blue pb2" v-if="modelTitle === '材料说明'">
                          <div v-for="info of it.attachments" :key="info.id" @click="downloadFile(info)">
                              <i class="at icon-paperclip"/>
                              <span class="pointer">{{info.attachmentName}}</span>
                          </div>
                      </div>
                      <div class="attachment-box pb2" v-if="modelTitle === '补充材料' && attachForm.fillNodeActionId === it.id">
                        <div class="mt2 tag-box" v-for="info of attachForm.myAttachments" :key="info.id">
                            <i class="color-blue at icon-paperclip"/>
                            <span class="color-blue">{{info.name}}</span>
                            <i class="ml1 at icon-closecircle color-placeholder pointer delete-btn"
                              @click.stop="handleRemove(info)"/>
                        </div>
                      </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form>
        </div>
        <div slot="fd-footer">
          <div v-if="modelTitle === '材料说明'||modelTitle === '补充材料'">
            <el-button size="small" @click="visible = false">取消</el-button>
            <el-button v-if="modelTitle === '补充材料'" size="small" type="primary" @click="sureAddAttach">确定</el-button>
          </div>
          <div v-else>
            <el-button size="small" @click="visible = false">取消</el-button>
          </div>
        </div>
      </fd-dialog>
  </div>
</template>

<script>
import { noString } from '@/utils/filters'
import vueUpload from 'vue-upload-component'
import fdDialog from 'fd/dialog/src/dialog.vue'
import { seeRegularDetail, saveDraft, saveSubmit, seeAttachment, recallTarget,
  handleRemove, handlePreview, handleExceed, handleSuccess, addAttachment, sureAddAttach,
  downloadFile, checkFillScore, beforeAvatarUpload, inputFile, inputFilter, addAttachBtn } from '@/api/kpi/onlineCheck/reportList'
import { goBack } from '@/api/common'
let exist = {}
export default {
  name: 'reportListTable',
  beforeUpdate() {
    exist = {}
  },
  components: {
    vueUpload, fdDialog
  },
  props: {
    menus: {
      type: Array
    },
    targetMap: {
      type: Object
    },
    rule: {
      type: Object
    },
    edit: {
      type: Boolean,
      default: false
    },
    see: {
      type: Boolean,
      default: false
    },
    isfirst: {
      type: Boolean,
      default: true
    },
    getTargetMsg: {
      type: Boolean
    },
    isRedDanger: {
      type: Boolean
    },
    unfill: {
      type: Boolean
    },
    staffName: {
      type: String
    },
    parentParams: {
      type: Object
    },
    // 页面来源，来源是我的考核 ，还是 其他考核
    originalPage: {
      type: String
    }
  },
  data() {
    return {
      fillNodeActionsContent: '', // fillNodeActions长度为0时，填报说明的v-model
      action: '',
      headers: { 'Authorization': this.$store.getters.token },
      fileList: [],
      isRed: false,
      auth: {
        'report': 'first',
        'check': 'next'
      },
      tableHeads: [],
      tableHeadsMap: {
        'myReportList': [{
          field: 'menuName',
          label: '指标类别',
          type: 'tree'
        }, {
          field: 'indexContent',
          label: '指标说明',
          default: ''
        }, {
          field: 'fillScore',
          label: '填报分数',
          align: 'right',
          width: this.fd.tools.getStringWidth('填报分数'),
          default: ''
        }, {
          field: 'allStatus',
          label: '当前状态',
          width: this.fd.tools.getStringWidth('当前状态'),
          default: ''
        }, {
          field: 'attachments',
          label: '材料说明',
          width: this.fd.tools.getStringWidth('材料说明加'),
          default: ''
        }, {
          field: 'operate',
          label: '操作',
          default: '',
          width: this.fd.tools.getStringWidth('操作3')
        }],
        'reportList': [{
          field: 'menuName',
          label: '指标类别',
          type: 'tree'
        }, {
          field: 'indexContent',
          label: '指标说明',
          default: ''
        }, {
          field: 'fillScore',
          label: '填报分数',
          align: 'right',
          width: this.fd.tools.getStringWidth('填报分数'),
          default: ''
        }, {
          field: 'attachments',
          label: '材料说明',
          width: this.fd.tools.getStringWidth('材料说明加'),
          default: ''
        }, {
          field: 'operate',
          label: '操作',
          default: '',
          width: this.fd.tools.getStringWidth('操作3')
        }]
      },
      visible: false,
      modelTitle: '',
      attachForm: {
        staffName: '',
        writeScore: '',
        menuName: '',
        attachments: ''
      },
      attachFormRule: {
        // content: [{ max: 1000, message: '长度不超过1000个字符', trigger: 'blur' }]
      },
      indexTypes: [
        { id: 'k10015-01', name: '综合填报' },
        { id: 'k10015-02', name: '系统测算' }],
      typesMap: {
        'k10015-01': '综合填报',
        'k10015-02': '系统测算',
        'k10015-03': '民主测评',
        'k10015-04': '部门考核'
      },
      menuMap: {},
      targetsMsg: {},
      deep: 1,
      formulaDialog: false,
      sectionDialog: false,
      formulList: [],
      formulMap: {},
      editKey: '',
      formulaForm: {
        formula: '',
        formulaId: ''
      },
      sectionForm: {
        valueMax: '',
        valueMin: '',
        checkFormula: '',
        indexSetupValue: ''
      },
      focusing: true,
      resource: '',
      page: '',
      params: {},
      isOther: false,
      detailRule: {},
      obj: {},
      currentItem: {},
      loading: null
    }
  },
  computed: {
  },
  mounted() {
    this.tableHeads = this.tableHeadsMap[this.originalPage]
    this.detailRule = this.fd.tools.merge(true, {}, this.rule)
    this.obj = JSON.parse(localStorage.getItem('obj'))
    this.checkType = this.obj.checkType
    this.page = this.obj.page
    this.resource = this.obj.resource
    this.params = {
      blockId: this.$route.query.blockId || '',
      schemaId: this.$route.query.schemaId || '',
      schemaBlockType: this.$route.query.schemaBlockType || ''
    }
    this.isOther = (this.resource === 'other')
    this.getRegulationData()
  },
  methods: {
    seeRegularDetail, saveDraft, saveSubmit, seeAttachment, recallTarget,
    handleRemove, handlePreview, handleExceed, addAttachment, sureAddAttach,
    goBack, downloadFile, checkFillScore, beforeAvatarUpload,
    handleSuccess, inputFile, inputFilter, addAttachBtn, noString,
    getExist(parent) {
      let count = exist[parent.menuId] || 0
      if (count === 0) {
        exist[parent.menuId] = 1
      } else {
        count = ++exist[parent.menuId]
      }
      return count === 0
    },
    getYellow(row) {
      const color = row.fillHasMe && row.fillEditable ? 'color-red' : ''
      return color
    },
    getField(headItem, key) {
      let obj = {}
      if (headItem.type === 'tree') {
        obj = this.menuMap[key] || {}
      } else {
        obj = this.targetsMsg[key]
      }
      // 系统测算的指标+当前环节没有我参与，只显示指标类别，指标说明，状态
      if (!obj.fillHasMe) {
        if (headItem.field !== 'indexContent' && headItem.field !== 'menuName' && headItem.field !== 'allStatus') {
          return ''
        } else {
          if (obj[headItem.field] === 0) {
            return obj[headItem.field]
          } else {
            return obj[headItem.field] || headItem.default
          }
        }
      } else {
        if (headItem.field === 'attachments') {
          return '材料内容&nbsp;&nbsp;&nbsp;<i class="fd-icon icon-shouyezaixiankaohe color-subTitle" style="font-size:12px;display:' + (obj.fillNodeActions[0].contentDetail ? 'inline-block' : 'none') + '"></i> <i class="at icon-paperclip color-subTitle h12" style="font-size:12px; display:' + (obj.attachmentCount > 0 ? 'inline-block' : 'none') + '" ></i> '
        } else {
          if (obj[headItem.field] === 0) {
            return obj[headItem.field]
          } else {
            return obj[headItem.field] || headItem.default
          }
        }
      }
    },
    // 将指标目录和指标信息整合
    getRegulationData(menus = this.menus, targetMap = this.targetMap, menuId = 'menuId', listId = 'id') {
      const [...menu] = menus
      this.menuMap = this.fd.data.arrayToObj(menu, menuId)
      const pidMap = this.fd.data.arrayToObj(menu, 'pid')
      const leaf = this.getAllTarget(this.menuMap, pidMap)
      this.targetsMsg = this.getAllParent(leaf, this.menuMap, menuId)
      this.getChildLength(this.targetsMsg, this.menuMap, menuId)
      this.deep = this.getObjMax(this.targetsMsg, 'level') + 1
    },
    getObjMax(data, key) {
      var max = 0
      var d = 0
      for (var i in data) {
        d = parseInt(data[i][key])
        max = d > max ? d : max
      }
      return max
    },
    getAllTarget(menuMap, pidMap) {
      const leaf = []
      // 找到所有的叶子节点
      for (const item in menuMap) {
        if (!pidMap[item]) {
          leaf.push(menuMap[item])
        }
      }
      return leaf
    },
    getChildLength(obj, menuMap, menuId) {
      let parent = []
      let id = ''
      for (const key in menuMap) {
        menuMap[key].rowspan = 0
      }
      for (const key in obj) {
        parent = obj[key].parent
        for (let n = 0; n < parent.length; n++) {
          id = parent[n][menuId]
          menuMap[id].rowspan = menuMap[id].rowspan || 0
          menuMap[id].rowspan++
        }
      }
    },
    getAllParent(leaf, menuMap, menuId) {
      const mlObj = {}
      let parent = []
      for (let i = 0; i < leaf.length; i++) {
        const id = leaf[i][menuId]
        mlObj[id] = this.fd.tools.merge(true, {}, leaf[i], { ...this.targetMap[id], parent: [] })
        parent = this.getParent(menuMap[id].pid, menuMap)
        mlObj[id].parent = parent
        mlObj[id].level = parent.length
      }
      return mlObj
    },
    getPopoverData(item, type) {
      let result = ''
      if (type === 'placeholder') {
        result = (item.valueMax || item.valueMin)
          ? (item.valueMin | noString) + '-' + (item.valueMax | noString) : ''
      } else {
        result = (item.valueMax || item.valueMin)
          ? '【' + (item.valueMin | noString) + '-' + (item.valueMax | noString) + '】' : ''
      }
      return result
    },
    getParent(pid, menuMap) {
      let parent = []
      // 当只有一个节点的时候不存在父节点
      if (menuMap[pid]) {
        parent.push(menuMap[pid])
        if (menuMap[menuMap[pid].pid]) {
          parent = this.getParent(menuMap[pid].pid, menuMap).concat(parent)
        }
      }
      return parent
    }
  },
  watch: {
    deep() {
      this.tableHeads[0].colspan = this.deep
    },
    menus: {
      handler(curVal, oldVal) {
        this.getRegulationData()
      },
      deep: true
    },
    targetsMsg: {
      handler(curVal, oldVal) {
      },
      deep: true
    },
    targetMap: {
      handler(curVal, oldVal) {
        this.getRegulationData()
      },
      deep: true
    },
    isOther: {
      handler(curVal, oldVal) {
      },
      deep: true
    },
    getTargetMsg() {
      this.$emit('getTragetData', this.targetsMsg, this.isRed)
    },
    isRedDanger() {
      this.$emit('getRedDanger', this.isRed)
    },
    unfill() {
      this.$emit('getUnfillIndexCnt', this.targetsMsg)
    },
    menuMap: {
      handler(curVal, oldVal) {
      },
      deep: true
    },
    'formulaForm.formulaId'(data) {
      if (data === '4') {
        this.formulaForm.formula = ''
      } else if (this.formulaMap[data]) {
        this.formulaForm.formula = this.formulaMap[data].name
      }
    }
  }
}
</script>

<style lang="scss">
  .special-world{
    color: #e09a00;
    font-size: 16px;
    font-weight: normal;
  }
  .full{
    width:100%
  }
  .color-red{
    color:#ff9b00;
  }
  .red-border{
    .el-input__inner{
      border: 1px solid red;
    }
  }
  .report-list{
    .el-popover{
      min-width: 100px;
    }
  }
  .tag-box:hover .delete-btn{
    display:inline-block;
  }
  .tag-box .delete-btn{
    display:none;
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
  .tip-content div{
    line-height: 1;
    font-size: 12px;
    color: #999;
  }
  .over-box{
    max-height:300px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .attachment-box div {
    line-height: 1;
  }
  .score-popover.el-popover--plain{
    padding: 10px;
  }
  .score-popover.el-popover{
    min-width: 80px;
  }
  .space-font{
    display: inline-block;
    width: 100%;
    height: 18px;
  }
  .special-item {
    .el-form-item {
      margin-bottom: 0;
    }
  }
</style>
