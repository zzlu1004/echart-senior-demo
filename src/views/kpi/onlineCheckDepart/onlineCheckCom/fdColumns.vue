<template>
  <el-table-column class="report-list"
    :prop="data[childKey]? '':id"
    :label="data[this.label]?data[this.label]:label"
    :align="data[childKey] ? 'center' : 'right'"
    >
    <fd-columns
        v-if="data[childKey]"
        v-for="item of data[childKey]"
        :key="item[keyName]"
        :data="item"
        v-bind:redFlag="redFlag"
        v-on:getRed="getRed"
        :edit="edit"
        :indexs="indexs"
        ></fd-columns>
    <template v-if="!data[childKey]" slot-scope="scope">
      <!-- 查看页面 -->
      <div v-if="!edit">
        <el-popover
          v-if="getTargetData(scope.row, data.menuId, 'fillHasMe')"
          popper-class="score-popover"
          placement="right"
          trigger="hover"
          :open-delay="200"
          :content="getPopoverData(scope.row, data.menuId, 'popover')">
          <!-- 当填报分数为空的时候，写一个height 18px width：100%的方框来承载popover提示 -->
          <span v-if="!getTargetData(scope.row, data.menuId, 'fillScore')" slot="reference">
            <span class="space-font" :class="getYellow(scope.row, data.menuId)"></span>
          </span>
          <!-- 填报分数有值的时候就是滑到数字上显示popover -->
          <span v-else slot="reference"
            :class="getYellow(scope.row, data.menuId)"
            v-html="getTargetData(scope.row, data.menuId, 'fillScore')"
            ></span>
        </el-popover>
        <div v-else class="full" :class="getYellow(scope.row, data.menuId)" v-html="getTargetData(scope.row, data.menuId, 'fillScore')"></div>
      </div>
      <!-- 编辑页面 -->
      <div v-else>
        <div v-if="!getTargetData(scope.row, data.menuId, 'fillHasMe')" class="full" :class="getYellow(scope.row, data.menuId)" v-html="getTargetData(scope.row, data.menuId, 'fillScore')"></div>
        <!-- 只要fillHasMe为true，就显示浮层区间提示 -->
        <el-popover
          v-else
          popper-class="score-popover"
          placement="right"
          trigger="hover"
          :open-delay="200"
          :content="getPopoverData(scope.row, data.menuId, 'popover')">
          <!-- 可填报的显示输入框提示 -->
          <span slot="reference">
            <el-input
              v-if="getTargetData(scope.row, data.menuId, 'fillEditable')"
              size="small"
              :class="scope.row['red'+data.menuId]?'red-border': ''"
              @input="checkFillScore(scope.row, data.menuId)"
              v-model="scope.row['fillScore'+data.menuId]"
              :placeholder="getPopoverData(scope.row, data.menuId, 'placeholder')"
              ></el-input>
            <!-- hasMe为true，但是不可填报 -->
            <span v-else>
              <!-- 空的时候，写一个height 18px width：100%的方框来承载popover提示 -->
              <span v-if="!getTargetData(scope.row, data.menuId, 'fillScore')" class="space-font"></span>
              <span v-else v-html="getTargetData(scope.row, data.menuId, 'fillScore')"></span>
            </span>
          </span>
        </el-popover>
      </div>
    </template>
  </el-table-column>
</template>

<script>
  import { noString } from '@/utils/filters'
  import { checkFillScore } from '@/api/kpi/onlineCheckDepart/ruleReportListDepart'
  export default {
    name: 'FdColumns',
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
      }
    },
    data() {
      return {
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
      checkFillScore,
      noString,
      getYellow(row, indexId) {
        for (const item in row.indexVal) {
          if (item === 'index' + indexId) {
            const color = (row.indexVal['index' + indexId] && row.indexVal['index' + indexId].fillHasMe && row.indexVal['index' + indexId].fillEditable) ? 'color-red' : ''
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

