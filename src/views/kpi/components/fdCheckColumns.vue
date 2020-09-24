<template>
  <!--render-header属性为指标说明，占用class-name属性，为指标说明提供字段-->
  <el-table-column class="check-list"
    :prop="data.menuId"
    sortable="costom"
    :class-name="data.content"
    :render-header="renderHeader"
    :label="data[this.label]?data[this.label]:label"
    :align="data[childKey] ? 'center' : 'right'"
    >
    <template v-if="!data[childKey]" slot-scope="scope">
      <!-- 查看页面 -->
      <div v-if="!edit">
        <el-popover
          v-if="getTargetData(scope.row, data.menuId, 'approveHasMe')"
          popper-class="score-popover"
          placement="right"
          trigger="hover"
          :open-delay="200"
          :content="getPopoverData(scope.row, data.menuId, 'popover')">
          <!-- 当审核分数为空的时候，写一个height 18px width：100%的方框来承载popover提示 -->
          <span v-if="!getTargetData(scope.row, data.menuId, 'draftScore')" slot="reference">
            <span class="space-font" :class="getYellow(scope.row, data.menuId)"></span>
          </span>
          <!-- 审核分数有值的时候就是滑到数字上显示popover -->
          <span v-else slot="reference"
            :class="getYellow(scope.row, data.menuId)"
            v-html="getTargetData(scope.row, data.menuId, 'draftScore')"
            ></span>
        </el-popover>
        <div v-else class="full" :class="getYellow(scope.row, data.menuId)" v-html="getTargetData(scope.row, data.menuId, 'draftScore')"></div>
      </div>
      <!-- 编辑页面 -->
      <div v-else>
        <div v-if="!getTargetData(scope.row, data.menuId, 'approveHasMe')" class="full" :class="getYellow(scope.row, data.menuId)" v-html="getTargetData(scope.row, data.menuId, 'approveScore')"></div>
        <!-- 只要approveHasMe为true，就显示浮层区间提示 -->
        <el-popover
          v-else
          popper-class="score-popover"
          placement="right"
          trigger="hover"
          :open-delay="200"
          :content="getPopoverData(scope.row, data.menuId, 'popover')">
          <!-- 可审核的显示输入框提示 -->
          <span slot="reference">
            <el-input
              v-if="getTargetData(scope.row, data.menuId, 'approveEditable')"
              size="small"
              :class="scope.row['red'+data.menuId]?'red-border': ''"
              @input="checkApproveScore(scope.row, data.menuId)"
              v-model="scope.row['approveScore'+data.menuId]"
              :placeholder="getPopoverData(scope.row, data.menuId, 'placeholder')"
              ></el-input>
            <!-- hasMe为true，但是不可审核 -->
            <span v-else>
              <!-- 空的时候，写一个height 18px width：100%的方框来承载popover提示 -->
              <span v-if="!getTargetData(scope.row, data.menuId, 'approveScore')" class="space-font"></span>
              <span v-else v-html="getTargetData(scope.row, data.menuId, 'approveScore')"></span>
            </span>
          </span>
        </el-popover>
      </div>
    </template>
  </el-table-column>
</template>

<script>
  import { noString } from '@/utils/filters'
  import { checkApproveScore, sortByNum } from '@/api/kpi/onlineCheck/ruleCheckList'
  export default {
    name: 'FdCheckColumns',
    components: {},
    props: {
      data: {
        type: Object,
        default: () => {}
      },
      childKey: {
        type: String,
        default: 'children'
      },
      id: {
        type: String,
        default: 'fillScore'
      },
      keyName: {
        type: String,
        default: 'menuId'
      },
      label: {
        type: String,
        default: 'menuName'
      },
      edit: {
        type: Boolean
      },
      redFlag: {
        type: Boolean
      },
      indexs: {
        type: Array
      },
      indexMenuId: {
        type: String
      }
    },
    data() {
      return {
        isFlag: false,
        isRed: false,
        indexObj: {},
        score: '',
        obj: {}
      }
    },
    computed: {},
    mounted() {
    },
    methods: {
      checkApproveScore,
      sortByNum,
      noString,
      getYellow(row, indexId) {
        for (const item in row.indexVal) {
          if (item === 'index' + indexId) {
            const color = (row.indexVal['index' + indexId] && row.indexVal['index' + indexId].approveHasMe && row.indexVal['index' + indexId].approveEditable) ? 'color-red' : ''
            return color
          }
        }
      },
      getTargetData(row, indexId, field) {
        for (const item in row.indexVal) {
          let result = ''
          if (item === 'index' + indexId) {
            result = (row.indexVal['index' + indexId]) ? row.indexVal['index' + indexId][field] : ''
            return result
          }
        }
      },
      getPopoverData(row, indexId, type) {
        for (const item in row.indexVal) {
          let result = ''
          if (item === 'index' + indexId) {
            if (type === 'placeholder') {
              result = (row.indexVal['index' + indexId] && (row.indexVal['index' + indexId].valueMin || row.indexVal['index' + indexId].valueMax))
                ? (row.indexVal['index' + indexId].valueMin | noString) + '-' + (row.indexVal['index' + indexId].valueMax | noString) : ''
            } else {
              result = (row.indexVal['index' + indexId] && (row.indexVal['index' + indexId].valueMin || row.indexVal['index' + indexId].valueMax))
                ? '【' + (row.indexVal['index' + indexId].valueMin | noString) + '-' + (row.indexVal['index' + indexId].valueMax | noString) + '】' : ''
            }
            return result
          }
        }
      },
      getRed(data) {
        this.$emit('getRed', data)
      },
      renderHeader(h, { column, $index }) {
        return h('span', [
          h('span', column.label),
          h('el-tooltip', {
            props: {
              effect: 'light',
              content: column.className || '暂无指标说明',
              placement: 'top'
            }
          },
          [h('i', {
            class: 'el-icon-question',
            style: 'color:#c0c4cc;margin-left:5px;cursor:pointer;'
          })],
          { content: column.className || '暂无指标说明' }
          )]
        )
      }
    },
    watch: {
      redFlag() {
        this.$emit('getRed', this.isRed)
      }
    }
  }
</script>

<style lang="scss">
  .color-red{
    color:#ff9b00;
  }
  .full{
    width:100%;
  }
  .red-border{
    .el-input__inner{
      border: 1px solid red;
    }
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
</style>

