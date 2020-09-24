<template>
  <div class="check-list">
    <div class="fd-menu-table online-menu-table" id="check-table">
      <table style="width: 100%; table-layout: fixed">
        <thead>
        <tr>
          <th :colspan="item.colspan"
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
              <div v-if="headItem.type !== 'tree' && edit && isnext">
                <!-- 系统测算的指标没有输入框来编辑审核分数 -->
                <!-- 只要approveHasMe为true，就显示浮层区间提示 -->
                  <el-popover
                    popper-class="score-popover"
                    v-if="headItem.field === 'approveScore' && checkType==='check' && item.approveHasMe"
                    placement="right"
                    trigger="hover"
                    :open-delay="200"
                    :content="getPopoverData(item, 'popover')">
                    <!-- 可审核的显示输入框提示 -->
                    <el-input
                      v-if="item.approveEditable"
                      slot="reference"
                      size="small"
                      :class="item.red?'red-border': ''"
                      v-model="item.approveScore"
                      :placeholder="getPopoverData(item, 'placeholder')"
                      @input="checkApproveScore(item, 'check')"
                    ></el-input>
                    <!-- hasMe为true，但是不可审核 -->
                    <span v-else slot="reference">
                      <!-- 空的时候，写一个height 18px width：100%的方框来承载popover提示 -->
                      <span v-if="getField(headItem, key) === ''" class="space-font"></span>
                      <span v-else v-html="getField(headItem, key)"></span>
                    </span>
                  </el-popover>
                <!-- 系统测算的指标没有操作按钮 -->
                <span v-else-if="headItem.field === 'operate' && item.showAttachments && item.approveHasMe">
                  <!-- 给所有的操作按钮增加权限 -->
                  <el-button v-if="item.approveRevocable" type="text" @click="recallTarget(item)">撤回</el-button>
                  <el-button v-if="see" :disabled="!item.approveViewable" type="text" @click="seeRegularDetail(item, resource)">查看</el-button>
                </span>
                <span v-else-if="headItem.field === 'attachments'" @click="seeAttachment(item)">
                  <span class="color-blue pointer" v-if="item.showAttachments && item.approveHasMe" v-html="getField(headItem, key)"></span>
                </span>
                <span v-else-if="(headItem.field === 'approveScore') &&
                  (item.indexType ==='2')"
                  class="color-placeholder"
                  v-html="getField(headItem, key)"></span>
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
                    <span v-if="item.showAttachments && item.approveHasMe">
                      <el-button :disabled="!item.approveRevocable" type="text" @click="recallTarget(item)">撤回</el-button>
                      <el-button v-if="see" :disabled="!item.approveViewable" type="text" @click="seeRegularDetail(item, resource)">查看</el-button>
                    </span>
                  </span>
                  <span v-else-if="headItem.field === 'attachments'" @click="seeAttachment(item)">
                    <span v-if="item.showAttachments && item.approveHasMe" class="color-blue pointer" v-html="getField(headItem, key)"></span>
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
                  <!-- 待审核列表查看页面审核分数不显示为上个流程分数，只有编辑页面输入框中才会加载上个流程分数的值 -->
                  <!-- 当item为审核分数的时候，分数也需要有分数区间popover提示 -->
                  <span v-else-if="headItem.field === 'approveScore' && item.approveHasMe">
                    <el-popover
                      popper-class="score-popover"
                      placement="right"
                      trigger="hover"
                      :open-delay="200"
                      :content="getPopoverData(item, 'popover')">
                      <!-- 当填报分数为空的时候，写一个height 18px width：100%的方框来承载popover提示 -->
                      <span v-if="item.draftScore === null" slot="reference">
                        <span class="space-font"></span>
                      </span>
                      <!-- 填报分数有值的时候 滑到数字上面显示popover -->
                      <span v-else slot="reference" :class="getYellow(item)">{{item.draftScore}}</span>
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
          class="attachForm px2"
          v-if="modelTitle === '材料说明'"
          :model="attachForm"
          label-position="right"
          label-width="90px">
          <el-row :gutter="32" class="special-item">
            <el-col :span="12">
              <el-form-item label="指标">
                <span>{{attachForm.menuName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="考核对象">
                <span>{{attachForm.departName}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="over-box pr2">
            <el-row v-for="it of attachForm.fillNodeActions" :key="it.id" :gutter="32" v-if="it">
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
                <el-form-item class="bd-dashed-bottom" label="附加材料">
                  <div class="attachment-list color-blue pb2" v-if="modelTitle === '材料说明'">
                    <div v-for="info of it.attachments" :key="info.id" @click="downloadFile(info)">
                      <i class="at icon-paperclip"></i>
                      <span class="pointer">{{info.attachmentName}}</span>
                    </div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
      <div slot="fd-footer">
        <el-button size="small" @click="visible = false">取消</el-button>
      </div>
    </fd-dialog>
  </div>
</template>

<script>
  import { noString } from '@/utils/filters'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  import { seeRegularDetail, saveDraft, saveSubmit, seeAttachment, recallTarget,
    handleRemove, handlePreview, handleExceed, handleSuccess,
    downloadFile, checkApproveScore, beforeAvatarUpload } from '@/api/kpi/onlineCheckDepart/checkListDepart'
  import { goBack } from '@/api/common'
  let exist = {}
  export default {
    name: 'checkListTable',
    beforeUpdate() {
      exist = {}
    },
    components: {
      fdDialog
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
      isnext: {
        type: Boolean,
        default: true
      },
      see: {
        type: Boolean,
        default: false
      },
      getTargetMsg: {
        type: Boolean
      },
      isRedDanger: {
        type: Boolean
      },
      departName: {
        type: String
      },
      parentParams: {
        type: Object
      }
    },
    data() {
      return {
        fileList: [],
        isRed: false,
        auth: {
          'report': 'first',
          'check': 'next'
        },
        tableHeads: [{
          field: 'menuName',
          label: '指标类别',
          type: 'tree'
        }, {
          field: 'indexContent',
          label: '指标说明',
          default: ''
        }, {
          field: 'preName',
          label: '上个流程提交人',
          width: this.fd.tools.getStringWidth('上个流程提交人'),
          default: ''
        }, {
          field: 'preScore',
          label: '上个流程分数',
          align: 'right',
          width: this.fd.tools.getStringWidth('上个流程分数'),
          default: ''
        }, {
          field: 'approveScore',
          label: '审核分数',
          align: 'right',
          width: this.fd.tools.getStringWidth('审核分数'),
          default: ''
        }, {
          field: 'attachments',
          label: '材料说明',
          width: this.fd.tools.getStringWidth('材料说明明'),
          default: ''
        }, {
          field: 'operate',
          label: '操作',
          default: '',
          width: this.fd.tools.getStringWidth('操作2')
        }],
        visible: false,
        modelTitle: '',
        attachForm: {
          departName: '',
          writeScore: '',
          menuName: '',
          attachments: ''
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
      handleRemove, handlePreview, handleExceed, noString,
      goBack, downloadFile, checkApproveScore, beforeAvatarUpload,
      handleSuccess,
      getYellow(row) {
        const color = row.approveHasMe && row.approveEditable ? 'color-red' : ''
        return color
      },
      getExist(parent) {
        let count = exist[parent.menuId] || 0
        if (count === 0) {
          exist[parent.menuId] = 1
        } else {
          count = ++exist[parent.menuId]
        }
        return count === 0
      },
      getField(headItem, key) {
        let obj = {}
        if (headItem.type === 'tree') {
          obj = this.menuMap[key] || {}
        } else {
          obj = this.targetsMsg[key]
        }
        // 系统测算的指标+当前环节没有我参与，只显示指标类别，指标说明
        if (!obj.approveHasMe) {
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
            return '材料内容&nbsp;&nbsp;&nbsp;<i class="fd-icon icon-shouyezaixiankaohe color-subTitle" style="font-size:12px;display:' + (obj.fillNodeActions[0].content ? 'inline-block' : 'none') + '"></i> <i class="at icon-paperclip color-subTitle h12" style="font-size:12px; display:' + (obj.attachmentCount > 0 ? 'inline-block' : 'none') + '" ></i> '
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
  .red-border{
    .el-input__inner{
      border: 1px solid red;
    }
  }
  .fd-menu-table{
    .el-button+.el-button{
      margin-left:24px;
    }
    .el-button{
      padding:0;
    }
  }
  .color-999{
    color: #999;
  }
  .over-box{
    max-height:300px;
    overflow-y: auto;
    overflow-x: hidden;
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
  .color-red{
    color:#ff9b00;
  }
</style>
