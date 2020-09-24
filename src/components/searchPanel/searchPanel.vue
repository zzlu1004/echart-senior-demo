<template>
  <div class="search-panel">
    <el-row v-for="(row, index) of rows" :key="index" :gutter="24">
      <el-col :span="8" v-for="(item, i) of row" :key="i">
        <div class="relative" v-if="item.label">
          <div class="line-height-normal left-0 absolute">{{item.label|showLabel}}</div>
          <div class="full" :class="('except-w'+item.label.length+'-full')">
            <slot :name="item.name">
              <el-input
                v-if="item.type==='input'"
                v-model="query[item.name]"
                :size="size"
                :placeholder="item.placeholder|| '请输入'" ></el-input>
              <el-select
                v-else-if="item.type==='select'"
                v-model="query[item.name]"
                :size="size"
                class="full"
                :multiple="item.multiple"
                clearable
                filterable
                :placeholder="item.placeholder || '请选择'">
                <el-option
                  v-for="li of item.options"
                  :key="li.id"
                  :value="li.id"
                  :label="li.label || li.name|| li.text"></el-option>
              </el-select>
              <el-date-picker
                v-else-if="dateTypes.indexOf(item.type) > -1"
                v-model="query[item.name]"
                :type="item.type"
                :size="size"
                range-separator="~"
                :value-format="dateFormat[item.type]"
                :start-placeholder="item.placeholder || '开始日期'"
                :end-placeholder="item.placeholder || '结束日期'"
                :placeholder="item.placeholder || '请选择'"></el-date-picker>
              <div v-else-if="item.type === 'tree'">
                <el-popover
                  ref="departPid"
                  placement="bottom-start"
                  v-model="showTree">
                  <div style="max-height: 20rem;" class="auto">
                    <el-tree
                      :data="item.options"
                      :props="item.defaultProps || defaultProps"
                      :accordion="true"
                      @node-click="handleNodeClick"></el-tree>
                  </div>
                  <el-input
                    slot="reference"
                    :size="size"
                    v-model="query[item.name]"
                    :readonly=true
                    v-popover:departPid
                    :placeholder="item.placeholder || '请选择'">
                  </el-input>
                </el-popover>
              </div>
              <el-cascader
                v-else-if="item.type === 'cascader'"
                v-model="query[item.name]"
                :options="item.options"
                :props="item.defaultProps || defaultProps"
                :size="size"
                clearable
                filterable
                change-on-select
                class="full"></el-cascader>
            </slot>
          </div>
        </div>
        <div v-if="item.length > 0 && i === row.length - 1 && index === rows.length - 1" :class="align">
          <el-button v-for="(btn, ii) of item"
                     :key="ii"
                     class="h14"
                     :class="{ mr1: ii < item.length - 1 }"
                     :type="btn.type"
                     :size="size"
                     @click="btnClick(btn.event)">{{btn.text}}</el-button>
        </div>
        <div>{{"&nbsp;"}}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'FdSearchPanel',
    mixins: [],
    components: {},
    data() {
      return {
        query: {}, // 查询条件
        align: 'f-left', // 搜索按钮对齐方式
        colLength: 3, // 每行显示的个数
        rows: [], // 搜索条件的行数
        dateTypes: ['year', 'month', 'date', 'dates', 'week', 'datetime', 'datetimerange', 'daterange', 'monthrange'],
        dateFormat: {
          year: 'yyyy',
          month: 'yyyy-MM',
          date: 'yyyy-MM-dd',
          dates: 'yyyy-MM-dd',
          monthrange: 'yyyy-MM',
          daterange: 'yyyy-MM-dd'
        },
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        showTree: false
      }
    },
    props: {
      value: [String, Number, Object, Array],
      params: {
        type: Array
      },
      size: {
        type: String,
        default: 'small'
      },
      btn: {
        type: Array,
        default: () => {
          return [{
            type: 'primary',
            event: 'search',
            text: '查询'
          }]
        }
      }
    },
    watch: {
      params: {
        handler(curVal, oldVal) {
          this.refresh()
        },
        deep: true
      }
    },
    hooks() {},
    computed: {
      colLen() {
        return this.colLength - 1
      }
    },
    mounted() {
      this.refresh()
    },
    activated() {
      console.log('activated', this.params)
      this.refresh()
    },
    methods: {
      reset() {
        this.params.forEach((item, i) => {
          this.$set(this.query, item.name, item.value)
        })
      },
      btnClick(eventName) {
        if (eventName === 'reset') {
          this.reset()
        }
        this.$emit('input', this.query)
        this.$emit('search', this.query)
      },
      // 因为某些操作导致某个查询条件不可见， 需要判断最终显示的行数
      refresh() {
        let count = 0 // 显示的搜索总数
        this.rows = [] // 每行的页面布局
        const row = [[]] // 二维数组
        let x = 0 // 列的下坐标
        let y = 0 // 行的下坐标
        this.params.forEach((item, index) => {
          item.label = item.label || ''
          // 没有明确指定某一搜索条件不可见的都认为可见
          if (item.show !== false) {
            count++
            if (x < this.colLen) {
              row[y].push(item)
              x++
            } else if (x === this.colLen) {
              x = 0
              row[y++].push(item)
              row[y] = []
            }
          }
        })
        // 如果搜索条件正好占满一行
        if (x === this.colLength) {
          row.push([{}, {}, this.btn])
        } else if (y > 0) {
          const [item1 = {}, item2 = {}] = row[y]
          row[y] = [item1, item2, this.btn]
        } else {
          row[y].push(this.btn)
        }
        this.rows = row
        // 两个以上的搜索条件搜索按钮右对齐
        if (count > this.colLen) {
          this.align = 'f-right'
        }
        console.log('rows', this.rows)
      },
      handleNodeClick(data, node, dom) {
        console.log('handleNodeClick', data, node, dom)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .search-panel{
    .el-date-editor.el-input, .el-date-editor.el-input__inner{
      width: 100%;
    }
  }
</style>
