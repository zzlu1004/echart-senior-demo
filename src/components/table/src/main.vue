<template>
  <div class="fdTable">
    <el-table
      v-loading="loading"
      element-loading-text="数据正在加载中"
      :data="tableData"
      :border="option.border"
      :stripe='option.stripe'
      :height="option.height"
      :max-height="option.maxHeight"
      :width='option.width'
      :emptyText='option.emptyText'
      :default-sort="defaultSort"
      @cell-click='cellClick'
      @row-click="rowClick"
      @sort-change='sortChange1'
      highlight-current-row
    >
      <slot></slot>
      <el-table-column
                  v-for="item of option.columns"
                  v-if="item.title!='操作'"
                  :key="item.field"
                  :prop="item.field"
                  :label="item.title"
                  :fixed="getFixed(item, option)"
                  :width="item.width"
                  :min-width="item.minWidth"
                  :align="item.align"
                  :class="item.class"
                  :sortable="item.sortable"
                  :show-overflow-tooltip="item.showOverflowTooltip||true"
                  >
                    <template slot-scope="scope"  >
                       <template v-if='item.edit ==true' >
                         <el-popover
                                :ref="'edit'+scope.$index"
                                v-if = 'item.edit'
                                placement="right"
                                width="220"
                                @show='editShow(scope.$index,scope.row,scope.row[item.field])'
                                trigger="click">
                                 <el-form label-position="top" label-width="80px" :model="form" size="mini" >
                                   <div style="color: #9a9a9a;margin-bottom: 4px;">编辑</div>
                                    <el-form-item >
                                        <el-input
                                            placeholder="请输入内容"
                                            v-model="form.text"
                                            :ref="'editform'+scope.$index"
                                            size="mini"
                                            :autofocus='autofocus'
                                            clearable ='true'
                                            >
                                    </el-input>
                                    </el-form-item>
                                <el-form-item style="margin-top: 6px; text-align: right;">
                                      <el-button type="primary" @click="onSubmit('edit'+scope.$index,scope.$index,item.field)" size="mini">确定</el-button>
                                      <el-button size="mini"  @click="onCencel('edit'+scope.$index)">取消</el-button>
                                </el-form-item>
                                </el-form>
                                <span slot="reference">{{item.formatter?item.formatter(scope.row,scope.row[item.field]):scope.row[item.field]}}</span>
                          </el-popover>
                      </template>
                      <template v-else >
                          <span :class="item.sortable ? 'edit' : ''" v-html="item.formatter?item.formatter(scope.row,scope.row[item.field]):scope.row[item.field]"></span>
                      </template>
                    </template>
      </el-table-column>
      <el-table-column v-else
                :key="item.field"
                :prop="item.field"
                :label="item.title"
                :fixed="item.fixed"
                :width="item.width"
                :align="item.align"
                :min-width="item.minWidth"
                :sortable="item.sortable"
                >
                  <template slot-scope="scope"  >
                    <el-button
                      :type="it.type"
                      :class="it.class"
                      v-for="(it, index) of btnCount(item.number, scope.row).buttons"
                      :key="index"
                      v-show="(it.show?scope.row[it.show]:true)"
                      :disabled="(it.disabled?scope.row[it.disabled]:false)"
                      v-text="it.text"
                      @click.stop="it.click?it.click(scope.$index,scope.row):buttonClick(scope.$index,scope.row)"
                    ></el-button>
                    <el-dropdown
                      @command="handleCommand"
                      v-if="btnCount(item.number, scope.row).moreButtons.length>0"
                      trigger="click">
                    <span class="el-dropdown-link more-line pointer underline">
                        更多
                    </span>
                      <el-dropdown-menu
                        slot="dropdown">
                        <el-dropdown-item
                          v-for="(it, index) in btnCount(item.number, scope.row).moreButtons"
                          :key="index"
                          :disabled="(it.disabled?scope.row[it.disabled]:false)"
                          :command="{it: it, index: index, row: scope.row}"
                          v-show="(it.show?scope.row[it.show]:true)">
                          <el-button
                            type="text"
                            v-text="it.text"
                            :disabled="(it.disabled?scope.row[it.disabled]:false)"
                          ></el-button>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'FdTable',
  data() {
    return {
      allData: [],
      flag: true,
      isTableEdit: false,
      form: {
        text: ''
      },
      dataMap: {},
      autofocus: true,
      order: ''
    }
  },

  components: {},

  computed: {
    tableData() {
      return this.option.data || this.datas
    },
    total() {
      return this.option.data.length
    }
  },

  methods: {
    handleCommand(command) {
      const it = command.it
      const index = command.index
      const row = command.row
      it.click ? it.click(index, row) : this.buttonClick(index, row)
    },
    dumppage() {
      // this.tableData = this.option.data || this.data
    },
    buttonClick(data) {
      this.$emit('buttonClick', data)
    },
    cellClick(row, column, cell, event) {
      this.$emit('cellClick', row, column, cell, event)
    },
    rowClick(row, event, column) {
      this.$emit('rowClick', row, event, column)
    },
    sortChange1(column, prop, order) {
      if (this.sortable) {
        this.sortChange(column)
      } else {
        prop = column.prop
        order = column.order
        this.order = order
        if (!order) {
          this.option.data = [...this.allData]
          return
        }
        this.option.data.sort(function(a, b) {
          const reg = /^-?\d+(\.\d+)?$/
          if (reg.test(a[prop]) && reg.test(b[prop])) {
            return NumberOrder(a[prop], b[prop], order)
          } else {
            return StringOrder(a[prop], b[prop], order)
          }
        })
      }
      function StringOrder(a, b, order) {
        if (a === b) {
          return 0
        }
        if (order === 'descending') {
          return a > b ? 1 : -1
        } else {
          return a > b ? -1 : 1
        }
      }
      function NumberOrder(a, b, order) {
        if (order === 'descending') {
          return parseFloat(b) - parseFloat(a)
        } else {
          return parseFloat(a) - parseFloat(b)
        }
      }
    },
    onSubmit(ref, index, field) {
      var size = this.option.pageSize * (this.option.pageNumber - 1) + index
      this.option.data[size][field] = this.form.text
      for (var i = 0; i < this.$refs[ref].length; i++) {
        this.$refs[ref][i].showPopper = false
      }
    },
    onCencel(ref) {
      for (var i = 0; i < this.$refs[ref].length; i++) {
        this.$refs[ref][i].showPopper = false
      }
    },
    editShow(index, row, value) {
      // this.$refs['editform'+index].$el;
      this.autofocus = true
      this.form.text = value
    },
    btnCount(operate, data) {
      let count = 0
      const shows = []
      const more = []
      for (const info of operate) {
        // 配置show属性的时候data的值为true的时候可以显示，没有配置show属性默认显示
        if ((info.show && data[info.show]) || info.show === undefined) {
          if (count < 2) {
            shows.push(info)
            count++
          } else {
            more.push(info)
          }
        }
      }
      if (more.length === 1) {
        shows.push(more.splice(0, 1)[0])
      }
      operate.buttons = shows
      operate.moreButtons = more
      return operate
    },
    getFixed(item, opt) {
      return item.fixed
    }
  },
  props: {
    option: {
      type: Object,
      default: () => {
        return {}
      }
    },
    defaultSort: {
      type: Object,
      default: () => {
        return {}
      }
    },
    datas: {
      type: Array
    },
    'sortChange': {
      type: Function,
      default: () => {}
    },
    sortable: {
      type: Boolean,
      default: false
    },
    isRefresh: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.allData = [...this.option.data]
  },
  watch: {
    isRefresh(val) {
      this.order = ''
    },
    'option.data'(newval, oldval) {
      // 只要没走排序，就给allData赋值
      if (!this.order) {
        this.allData = [...newval]
      }
      // this.allData = [...newval]
    }
  }
}
</script>
<style lang="scss">
.fdTable {
  .el-button+.el-button{
    margin-left:24px;
  }
  .border {
    border-left: 1px solid #e6ebf5;
    border-right: 1px solid #e6ebf5;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin: 0;
  }
  .edit {
    padding-right: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .more-line{
    margin-left:11px;
    padding-left: 11px;
    border-left: 1px solid #ebebeb;
    color:#409EFF;
    font-weight: 500;
  }
}
.el-table__body-wrapper {
  overflow-y: auto;
}
</style>
