<template>
  <div style="height: 400px">
    <div v-for="(item, index) of summary"
         :key="index"
         :style="{width: width}"
         class="summary-item bd">
      <div class="color-title h16 bg"><div class="py1 px2">{{map[index]}}</div></div>
      <div class="item-body bd-top">
        <div v-for="(child, i) of item"
             v-show="child.label.indexOf(filter) > -1"
             :class="'py1 px2 ' + getClassName(child, index)"
             @click="selectChange(child, index)"
             :key="i">
          <el-tooltip
            placement="top">
            <div slot="content">
              {{child.label}}
            </div>
            <div class="dot-hidden pointer full">
              <span v-show="select" class="mr1" @click.stop="summaryCheck(child, index)">
                <i v-if="data.indexOf(child.id) > -1" class="at color-selected icon-checksquare"/>
                <i class="at noselected" v-else/>
              </span>
              <span>{{child.label}}</span>
            </div>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div v-show="refresh"></div>
  </div>
</template>

<script>
  export default {
    name: 'FdSummary',
    components: {},
    props: {
      data: {
        type: Array,
        default: () => {
          return []
        }
      },
      summary: {
        type: Array,
        default: () => {
          return []
        }
      },
      select: {
        type: Boolean,
        default: false
      },
      getData: {
        type: Boolean,
        default: true
      },
      filter: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        map: {
          0: '一级案由',
          1: '二级案由',
          2: '三级案由',
          3: '四级案由',
          4: '五级案由',
          5: '六级案由',
          6: '七级案由',
          7: '八级案由'
        },
        selects: [],
        refresh: true
      }
    },
    computed: {
      width() {
        const length = this.summary.length
        if (length > 0) {
          return (Math.floor((100 / this.summary.length) * 100) / 100) + '%'
        }
        return '100%'
      }
    },
    mounted() {
      if (this.summary.length > 0) {
        this.refreshSelect(this.summary)
      }
    },
    methods: {
      getClassName(item, index) {
        let className = ''
        if (this.selects[index] && item.id === this.selects[index].id) {
          className += 'selected-one'
        }
        if (this.selects[index - 1] && item.parentId === this.selects[index - 1].id) {
          className += ' same-parent'
        }
        // 父节点没有被选中的时候子节点不能被选择
        if (this.data.indexOf(item.parentId) < 0 && index > 0 && this.selected) {
          className += ' color-forbid'
        }
        return className
      },
      refreshSelect(data) {
        for (let i = 0; i < data.length; i++) {
          if (i === 0) {
            this.selects.push(data[0][0])
          } else {
            const child = data[i] || []
            for (const item of child) {
              const last = this.selects[i - 1]
              if (last && last.id === item.parentId) {
                this.selects.push(item)
                break
              }
            }
          }
        }
      },
      selectChange(item, index) {
        this.selects[index] = item
        this.refreshChild(item, index)
        this.refreshParent(item, index)
        this.refresh = !this.refresh
      },
      refreshChild(item, index) {
        const next = index + 1
        // 往下的边界
        if (this.summary.length > next) {
          const data = this.selects[next]
          // 下一级原本有值
          if (data && data.parentId !== item.id) {
            const childs = this.summary[next] || []
            let total = 0
            for (const child of childs) {
              if (child.parentId === item.id) {
                total = 1
                this.selects[next] = child
                this.refreshChild(child, next)
                break
              }
            }
            if (total === 0) {
              this.selects = this.selects.splice(0, index)
            }
          } else if (!data) {
            const childs = this.summary[next] || []
            for (const child of childs) {
              if (child.parentId === item.id) {
                this.selects[next] = child
                this.refreshChild(child, next)
                break
              }
            }
          }
        }
      },
      refreshParent(item, index) {
        const data = this.selects[index - 1]
        if (data && data.id !== item.parentId) {
          const childs = this.summary[index - 1] || []
          for (const child of childs) {
            if (child.id === item.parentId) {
              this.selects[index - 1] = child
              this.refreshParent(child, index - 1)
              break
            }
          }
        }
      },
      summaryCheck(item, index) {
        if ((this.data.indexOf(item.parentId) > -1 || index === 0)) {
          const postion = this.data.indexOf(item.id)
          if (postion > -1) {
            this.data.splice(postion, 1)
            this.childCheck(item, index, false)
          } else {
            this.data.push(item.id)
            this.childCheck(item, index, true)
          }
        }
      },
      childCheck(item, index, checked) {
        const children = this.summary[index + 1] || []
        for (const child of children) {
          if (item.id === child.parentId) {
            const position = this.data.indexOf(child.id)
            if (checked) {
              if (position < 0) {
                this.data.push(child.id)
              }
            } else {
              if (position > -1) {
                this.data.splice(position, 1)
              }
            }
            this.childCheck(child, index + 1, checked)
          }
        }
      }
    },
    watch: {
      summary(data) {
        this.refreshSelect(data)
      },
      getData() {
        this.$emit('getSelect', this.data)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .summary-item{
    float: left;
    line-height: 1rem;
    .item-body{
      height: 360px;
      overflow-y: auto;
      line-height: 1rem;
    }
    .color-forbid{
      .noselected{
        border: 1px solid #dcdfe6;
        cursor: pointer;
      }
    }
    .noselected{
      display: inline-block;
      width: 14px;
      height: 13px;
      border: 1px solid #dcdfe6;
      border-radius: 2px;
      cursor: pointer;
    }
    .selected-one{
      color: #409eff;
      padding: 0 8px;
      cursor: pointer;
      div{
        padding: 8px;
        background-color: #edf6fd;
      }
    }
    .same-parent{
      background-color: #F7F7F7;
    }
    .color-selected{
      color: #409eff;
      cursor: pointer;
    }
  }
</style>
