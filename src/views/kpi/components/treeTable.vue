<template>
  <div>
    <el-table class="tree-table"
      v-loading="loading"
      :height="height"
      element-loading-text="数据正在加载中"
      :data="tableData"
      @cell-click='cellClick'
      :border="true">
      <el-table-column
        v-for="(item, index) of columns"
        :key="index"
        :label="item.title"
        :width="item.width"
        :min-width="item.minWidth"
        :prop="item.field"
        :show-overflow-tooltip="item.showOverflowTooltip || true"
      >
        <template slot-scope="scope">
          <span v-if="item.expand"
                class="at-expand pointer"
                @click.stop="toggleOpen(dataMap[scope.row.id])"
                :style="{'marginLeft': (scope.row.deep-1)*16+'px'}">
            <span v-if="children[scope.row.id]">
              <span v-if="dataMap[scope.row.id].isOpen"><i class="at icon-caretdown"/></span>
              <span v-else><i class="at icon-caretright"/></span>
            </span>
          </span>
          <span v-if="item.checkbox" class="at-expand">
            <span
              v-if="dataMap[dataMap[scope.row.id][pid]]"
              @click.stop="toggleSelect(dataMap[scope.row.id], item)">
              <i v-if="item.disabled && dataMap[scope.row.id][item.disabled]" class="at disabled"></i>
              <i v-else-if="dataMap[scope.row.id].isSelect === 'full'" class="at color-selected icon-checksquare"/>
              <i v-else-if="dataMap[scope.row.id].isSelect === 'helf'" class="at color-selected icon-minussquare"/>
              <i class="at noselected" v-else/>
            </span>
          </span>
          <span v-if="item.type === 'operate'">
            <el-button
              type="text"
              v-for="(li, index) of btnCount(item.operate, dataMap[scope.row.id]).buttons"
              :key="index"
              v-show="(li.show?dataMap[scope.row.id][li.show]:true)"
              :disabled="(li.disabled?dataMap[scope.row.id][li.disabled]:false)"
              v-text="li.text"
              @click.stop="emitEvent(li.eventName, dataMap[scope.row.id])"
            ></el-button>
            <el-dropdown v-if="btnCount(item.operate, dataMap[scope.row.id]).moreButtons.length>0" trigger="click">
              <span class="el-dropdown-link more-line pointer underline">
                  更多
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                    v-for="(li, index) in btnCount(item.operate, dataMap[scope.row.id]).moreButtons"
                    :key="index"
                    v-show="(li.show?dataMap[scope.row.id][li.show]:true)">
                    <el-button
                      type="text"
                      v-text="li.text"
                      :disabled="(li.disabled?dataMap[scope.row.id][li.disabled]:false)"
                      @click.stop="emitEvent(li.eventName, dataMap[scope.row.id])"
                    ></el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
          <span v-else v-html="item.formatter?item.formatter(dataMap[scope.row.id],dataMap[scope.row.id][item.field]):dataMap[scope.row.id][item.field]"></span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'FdTreeTable',
    components: {},
    props: {
      columns: {
        type: Array
      },
      data: {
        type: Array
      },
      id: {
        type: String,
        default: 'id'
      },
      isOpen: {
        type: Boolean,
        default: true
      },
      pid: {
        type: String,
        default: 'pid'
      },
      loading: {
        type: Boolean,
        default: false
      },
      height: {
        type: Number
      }
    },
    data() {
      return {
        children: {},
        dataMap: {},
        tableData: [],
        root: []
      }
    },
    computed: {},
    mounted() {
      this.initData(this.data)
    },
    methods: {
      initData(data) {
        this.dataMap = {}
        this.children = {}
        for (let i = 0; i < data.length; i++) {
          const pidVal = data[i][this.pid] || 'fd_root'
          this.$set(data[i], 'isOpen', this.isOpen)
          // 所有的节点都是可显示的
          this.$set(data[i], 'show', true)
          // 默认不选中
          this.$set(data[i], 'isSelect', false)
          // 保留每个节点的信息
          this.dataMap[data[i][this.id]] = data[i]
          // 相同父节点的放在一起
          this.children[pidVal] = this.children[pidVal] || []
          this.children[pidVal].push(data[i])
        }
        this.root = []
        // 获取所有的根节点
        for (const key in this.children) {
          if (!this.dataMap[key]) {
            this.root.push(...this.children[key])
          }
        }
        // 根节点默认显示
        for (const item of this.root) {
          this.$set(item, 'show', true)
        }
        this.tableData = []
        this.getTreeData(this.root, 1)
      },
      getTreeData(root, deep = 1) {
        root = root || []
        for (const item of root) {
          const id = item[this.id]
          if (item.show) { // 节点本身是否需要显示
            this.tableData.push({ id: id, deep: deep })
          }
          // 展开的节点需要获取子类
          if (item.isOpen) {
            this.getTreeData(this.children[id], deep + 1)
          }
        }
      },
      toggleSelect(data, item) {
        const id = data[this.id]
        if (this.dataMap[id]) {
          if (item.disabled && data[item.disabled]) {
            return false
          }
          const isSelected = this.dataMap[id].isSelect
          if (isSelected) {
            this.$set(this.dataMap[id], 'isSelect', false)
            this.toggleSelectChild(id, false)
            // this.toggleSelectParent(item[this.pid])
          } else {
            this.$set(this.dataMap[id], 'isSelect', 'full')
            this.toggleSelectChild(id, 'full')
            // this.toggleSelectParent(item[this.pid])
          }
          this.$emit('selectChange', id, !isSelected)
        }
      },
      toggleOpen(item) {
        const id = item[this.id]
        if (this.dataMap[id].isOpen) {
          this.$set(this.dataMap[id], 'isOpen', false)
          this.toggleOpenChild(this.children[id], false)
        } else {
          this.$set(this.dataMap[id], 'isOpen', true)
          this.toggleOpenChild(this.children[id], true)
        }
        this.tableData = []
        this.getTreeData(this.root, 1)
      },
      toggleOpenChild(data, open) {
        const id = this.id
        for (const item of data) {
          this.$set(this.dataMap[item[id]], 'show', open)
          // 是否还有子节点
          if (this.children[item[id]]) {
            // 展开
            if (open) {
              // 判断子节点原来的状态，如果是展开的话需要将他的子节点展开还原
              if (this.dataMap[item[id]].isOpen) {
                this.toggleOpenChild(this.children[item[id]], open)
              }
            } else { // 关闭的时候所有的子节点都需要隐藏
              this.toggleOpenChild(this.children[item[id]], open)
            }
          }
        }
      },
      toggleSelectChild(id, select) {
        const child = this.children[id] || []
        for (const item of child) {
          this.$set(this.dataMap[item[this.id]], 'isSelect', select)
          this.$emit('selectChange', item[this.id], select)
          this.toggleSelectChild(item[this.id], select)
        }
      },
      toggleSelectParent(pid) {
        const brother = this.children[pid] || []
        const parent = this.dataMap[pid]
        if (parent) {
          let fullCount = 0
          let helfCount = 0
          for (const item of brother) {
            if (item.isSelect === 'full') {
              fullCount++
            } else if (item.isSelect === 'helf') {
              helfCount++
            }
          }
          if (helfCount > 0 || fullCount > 0) {
            if (fullCount === brother.length) {
              this.$emit('selectChange', pid, true)
              this.$set(this.dataMap[pid], 'isSelect', 'full')
            } else {
              this.$emit('selectChange', pid, false)
              this.$set(this.dataMap[pid], 'isSelect', 'helf')
            }
          } else {
            this.$emit('selectChange', pid, false)
            this.$set(parent, 'isSelect', false)
          }
          this.toggleSelectParent(parent[this.pid])
        }
      },
      emitEvent(name, data) {
        this.$emit(name, { data, children: this.children[data.id] })
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
      cellClick(row, column, cell, event) {
        this.$emit('cellClick', row, column, cell, event)
      }
    },
    watch: {
      data() {
        this.initData(this.data)
      }
    }
  }
</script>

<style lang="scss">
  .tree-table{
    .el-button+.el-button{
      margin-left: 24px;
    }
    .at-expand{
      float: left;
      width: 25px;
      height: 20px;
    }
    .noselected{
      display: inline-block;
      width: 14px;
      height: 13px;
      border: 1px solid #dcdfe6;
      border-radius: 2px;
      cursor: pointer;
    }
    .noselected:hover {
      border-color: #409eff;
    }
    .disabled{
      display: inline-block;
      width: 14px;
      height: 13px;
      border: 1px solid #dcdfe6;
      background-color: #edf2fc;
      border-radius: 2px;
    }
    .more-line{
      margin-left:11px;
      padding-left: 11px;
      border-left: 1px solid #ebebeb;
      color:#409EFF;
      font-weight: 500;
    }
    .color-selected{
      color: #409eff;
      cursor: pointer;
    }
  }
</style>

