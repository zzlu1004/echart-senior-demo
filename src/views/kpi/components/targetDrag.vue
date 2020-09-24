<template>
  <div>
    <div v-for="(list, index) of data" :key="index" :style="{'margin-left': (level * 5 +'px')}">
      <div class="relative py1">
        <i v-show="!(index === 0 && level === 1 && list.menuName === '总分'||list.menuName === '一级分类不显示')"
           @click.stop="deleteMenu(data, index)"
           class="at icon-close absolute pointer"
           style="left:0;top:15px"/>
        <i v-if="level < 5 && list.menuName !== '总分'"
           @click.stop="addMenu(list, index)"
           class="at icon-enter absolute pointer"
           style="left:20px;top:15px"/>
        <div style="margin-left: 40px">
          <el-input v-model="list.menuName"
                    :id = "list.id"
                    :disabled="level === 1"
                    :placeholder="placeholder[level]"></el-input></div>
      </div>
      <div name="target-child" >
        <draggable class="fd-drag-menuLists" name="menuLists" :id = "list.id" :options="dragOpt" @clone="clone" @end="end"  @start="start" :move="move">
          <div class="relative mt1 no-dragging-target my-handle"
               name = "target-dragged"
               :menuId = "child.id"
               style="padding-left:20px;margin-left:45px"
               v-for="(child, num) of list.targets"
               :key="child.id">
            <i @click.stop="deleteTarget(list.targets, num)"
               class="at icon-close absolute pointer"
               style="left:0;top:0px;"/>
            <i class="at icon-appstore1"/>
            <span class="ml2">{{showTargetName(child)}}</span>
          </div>
          <div v-if="list.targets.length === 0" class="relative no-dragging-target pt1"></div>
        </draggable>
      </div>
      <div name = "menu-child" v-if="list.menus">
        <fd-target-drag
          v-bind:data="list.menus"
          v-on:refreshMenus="refreshMenus"
          v-bind:level="level+1"></fd-target-drag>
      </div>
    </div>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  export default {
    name: 'FdTargetDrag',
    components: { draggable },
    props: {
      data: {
        type: Array,
        default: () => {
          return []
        }
      },
      level: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        menuLevel: 0,
        placeholder: {
          1: '一级分类不显示',
          2: '二级分类',
          3: '三级分类',
          4: '四级分类',
          5: '五级分类'
        },
        dragOpt: {
          group: 'menuList',
          handle: '.my-handle',
          draggable: '.no-dragging-target',
          ghostClass: 'bg-yellow',
          chosenClass: 'fd-drag-chosen',
          forceFallback: true,
          delay: 200,
          fallbackClass: 'fd-drag-dragging'
        }
      }
    },
    computed: {},
    mounted() {
    },
    methods: {
      showTargetName(child) {
        const dom = document.getElementById(child.id)
        if (dom) {
          dom.setAttribute('class', 'pl1 mt1 relative color-forbid no-dragging-target')
        }
        return child.menuName
      },
      deleteMenu(item, index) {
        this.$confirm('删除目录后，此目录及目录下方的次级目录以及指标都会被删除，请确认删除。', '删除目录', {
          type: 'info'
        }).then(() => {
          const del = item.splice(index, 1)
          const targets = this.getAllTargets(del[0])
          for (const id of targets) {
            const dom = document.getElementById(id)
            if (dom) {
              dom.setAttribute('class', 'pl1 mt1 relative my-handle no-dragging-target')
            }
          }
        }).catch(() => {})
      },
      deleteTarget(item, index) {
        const del = item.splice(index, 1)
        const targets = this.getAllTargets(del[0])
        for (const id of targets) {
          const dom = document.getElementById(id)
          if (dom) {
            dom.setAttribute('class', 'pl1 mt1 relative my-handle no-dragging-target')
          }
        }
      },
      getAllTargets(del, target = []) {
        // del为左侧删除的指标
        if (del.indexType || del.menuType === '1') {
          return [del.id]
        }
        const ids = this.fd.data.getValuesByKey(del.targets, 'id')
        for (const menu of del.menus) {
          ids.push(...this.getAllTargets(menu))
        }
        return ids
      },
      addMenu(item) {
        const obj = {
          id: this.fd.tools.getId(),
          pid: item.id,
          menuName: '',
          menuType: '0',
          ruleType: 'k10030-01',
          formula: '',
          menuLevel: parseFloat(item.menuLevel) + 1,
          menus: [],
          targets: []
        }
        item.menus.push(obj)
        this.refreshMenus(obj)
      },
      refreshMenus(obj) {
        this.$emit('refreshMenus', obj)
      },
      end(evt) {},
      start(evt) {},
      clone(evt) {},
      move(evt) {}
    },
    watch: {
      data() {}
    }
  }
</script>

