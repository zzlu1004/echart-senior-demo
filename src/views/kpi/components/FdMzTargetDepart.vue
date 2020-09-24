<template>
  <div class="target-drag-list px1">
    <el-row :gutter="16">
      <el-col :span="11">
        <div id = "targetLeftMenu" name="toMenuList" class="p1 bd bg auto" style="height: 24rem;">
          <fd-target-drag v-bind:data="menusTree" v-on:refreshMenus="refreshDataMap"></fd-target-drag>
        </div>
      </el-col>
      <el-col :span="13">
        <div class="pl2">
          <div class="p1 bd-dashed relative target-ku radius-normal">
            <el-input v-model="indexName"
                class="absolute" style="width: 180px;top: -40px; right: 0px"
                @keyup.enter.native="searchTarget"
                :clearable="true"
                @clear="searchTarget"
                size="small">
              <el-button slot="append" icon="el-icon-search" @click="searchTarget(indexName)"></el-button>
            </el-input>
            <div>
              <el-radio-group v-model="indexType" @change="getTargetList" size="small">
                <el-radio-button label="democratic" border>民主测评({{democraticCnt}})</el-radio-button>
              </el-radio-group>
            </div>
            <div class="auto full mt1" id = "targetRightMenu" style="height: 20rem">
              <div class="px1 mt1">
                <draggable name="targetList" :options="targetOpt" @clone="clone" @end="end"  @start="start" :move="move">
                  <div :id="child.id" v-bind:class="isDraggable(child)" v-for="child of targetData" :key="child.id">
                    <i class="at icon-appstore1"/>
                    <span class="ml2">{{child.name}}</span>
                  </div>
                </draggable>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    getTargetList,
    showTarget
  } from '@/api/kpi/democracy/addMzRegulation'
  import {
    getTargetCount
  } from '@/api/kpi/checkDepart/targetDepart'
  import draggable from 'vuedraggable'
  import FdTargetDrag from './targetDrag'
  export default {
    name: 'FdMzTargetDepart',
    components: { FdTargetDrag, draggable },
    props: {
      getMenus: {
        type: Boolean
      },
      type: {
        type: String
      },
      menus: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data() {
      return {
        // 获取所有指标
        indexData: [],
        // 指标映射
        targetMap: {},
        targetData: [],
        indexType: 'democratic',
        indexName: '',
        systemCnt: 0,
        isSum: true, // 判断为true时新增指标类别，“确定”时在指标体系表格种增加“总分”一行，
        reportCnt: 0,
        democraticCnt: 0,
        markedCnt: 0,
        newSystemAccessCnt: 0,
        dataMap: {},
        menusTree: [],
        targetOpt: {
          group: { name: 'menuList', pull: 'clone', put: false },
          handle: '.my-handle',
          draggable: '.no-dragging-target',
          ghostClass: 'bg-yellow',
          chosenClass: 'fd-drag-chosen',
          forceFallback: true,
          fallbackClass: 'fd-drag-dragging'
        },
        sumData: {}
      }
    },
    computed: {},
    mounted() {
      this.getTargetList()
      this.getTargetCount()
      this.initMenusTree(this.menus)
    },
    methods: {
      isDraggable(child) {
        let exit = false
        const $parent = document.getElementById('targetLeftMenu')
        if ($parent) {
          const $div = $parent.getElementsByTagName('div')
          for (const item of $div) {
            if (item.getAttribute('menuId') === child.id) {
              exit = true
              break
            }
          }
          return exit ? 'pl1 mt1 relative color-forbid no-dragging-target' : 'pl1 mt1 relative my-handle no-dragging-target'
        }
      },
      searchTarget(val) {
        this.getTargetList()
      },
      addMenuParent() {
        const obj = {
          id: this.fd.tools.getId() + Math.floor(Math.random() * 10000000),
          pid: null,
          menuName: '一级分类不显示',
          menuType: '0',
          menuLevel: 1,
          ruleType: 'k10030-01',
          formula: '',
          menus: [],
          targets: []
        }
        this.dataMap[obj.id] = obj
        this.menusTree.push(obj)
      },
      deleteTarget(e) {
        const parent = e.target.parentElement
        const id = parent.id
        if (parent.remove) {
          parent.remove()
        } else {
          parent.parentNode.removeChild(parent)
        }
        const dom = document.getElementById(id)
        if (dom) {
          dom.setAttribute('class', 'pl1 mt1 relative my-handle no-dragging-target')
        }
      },
      showTarget,
      getTargetList,
      getTargetCount,
      end(evt) {
        const item = evt.item
        if (item.getAttribute('name') !== 'target-dragged' && evt.to !== evt.from) {
          evt.clone.setAttribute('class', 'pl1 mt1 relative color-forbid no-dragging-target')
          const { id: id, name: menuName, indexType, indexFlowId, valueMax, valueMin, status, flows } = this.targetMap[evt.item.id]
          const obj = {
            id,
            menuName,
            indexType,
            valueMax: valueMax || 100,
            valueMin: valueMin || 0,
            status,
            flows,
            indexFlowId: indexFlowId || (flows && flows[0] && flows[0].id),
            formulaId: '13',
            weight: 100,
            formula: '部门指标值',
            checkFormula: '',
            indexSetupValue: '',
            menuType: '1'
          }
          this.dataMap[id] = obj
          const list = this.getItemById(evt.to.getAttribute('id'))
          if (evt.item.remove) {
            evt.item.remove()
          } else {
            evt.item.parentNode.removeChild(evt.item)
          }
          list.targets.splice(evt.newIndex, 0, obj)
        }
      },
      getItemById(id, data = this.menusTree) {
        const menus = []
        let back = ''
        for (const item of data) {
          if (item.id === id) {
            back = item
            break
          } else if (item.menus) {
            menus.push(...item.menus)
          }
        }
        if (back) {
          return back
        } else if (menus.length > 0) {
          return this.getItemById(id, menus)
        }
      },
      start(evt) {},
      clone(evt) {},
      move(evt) {},
      initMenusTree(d) {
        const data = JSON.parse(JSON.stringify(d))
        if (data.length === 0) {
          data.push({
            pid: null,
            id: this.fd.tools.getId() + Math.floor(Math.random() * 10000000),
            menuName: '一级分类不显示',
            menuLevel: 1,
            ruleType: 'k10030-01',
            formula: '',
            menuType: '0',
            menus: [],
            targets: []
          })
          this.sumData = {}
        } else {
          if (data[0].menuName === '总分') {
            this.sumData = data[0]
            data.splice(0, 1)
          } else {
            this.sumData = {}
          }
        }
        this.dataMap = this.fd.data.arrayToObj(data, 'id')
        const tree = this.fd.data.changeToTree(data, 'id', 'pid')
        this.classifyChildren(tree)
        this.menusTree = tree
      },
      refreshDataMap(data) {
        this.dataMap[data.id] = data
      },
      classifyChildren(data) {
        for (const item of data) {
          item.menus = []
          item.targets = []
          if (item.children) { // 新增指标类别的时候只有一个目录，没有children
            this.isSum = false
            for (const child of item.children) {
              if (child.menuType === '1') {
                item.targets.push(child)
              } else {
                item.menus.push(child)
              }
            }
            this.classifyChildren(item.menus)
          }
        }
      },
      refreshMenus(data) {
        this.$emit('refreshMenus', JSON.parse(JSON.stringify(data)))
      },
      getMenusMsg() {
        const $parent = document.getElementById('targetLeftMenu')
        // 所有的目录
        const $menus = $parent.getElementsByTagName('input')
        // 相同目录的指标集合
        const $targets = $parent.getElementsByClassName('fd-drag-menuLists')
        if ($targets.length === 0) {
          this.$message({
            type: 'warning',
            message: '指标不能为空'
          })
          return false
        }
        const targetMap = {}
        // 遍历所有的指标 将他放到对应的目录信息中
        for (const el of $targets) {
          const menuId = el.getAttribute('id')
          targetMap[menuId] = []
          const nodes = el.children
          for (const node of nodes) {
            const id = node.getAttribute('menuId')
            if (id) {
              targetMap[menuId].push({ ...this.dataMap[id], pid: menuId })
            }
          }
        }
        const menus = []
        // 遍历所有目录，将目录放到对应的pid父级下
        const menuMap = {}
        for (const el of $menus) {
          const id = el.getAttribute('id')
          const pid = this.dataMap[id].pid
          if (pid) {
            menuMap[pid] = []
            menuMap[pid].push(this.dataMap[id])
          }
        }
        for (const el of $menus) {
          const id = el.getAttribute('id')
          menus.push({ ...this.dataMap[id], menuName: el.value })
          if (el.value === '') {
            this.$message({
              type: 'warning',
              message: '目录名称不能为空'
            })
            return false
          }
          if (targetMap[id].length === 0 && !menuMap[id] && el.value !== '总分') {
            this.$message({
              type: 'warning',
              message: '指标类别下必须有指标类别或指标'
            })
            return false
          }
          menus.push(...targetMap[id])
        }
        if (Object.keys(this.sumData).length !== 0) {
          menus.unshift(this.sumData)
        } else {
          // 添加“总分”一行
          menus.unshift({
            blockId: '',
            createTime: null,
            createUser: null,
            formula: '',
            ruleType: 'k10030-01',
            formulaId: null,
            menuType: '0',
            id: '',
            menuId: null,
            menuName: '总分',
            menuLevel: 0,
            pid: null,
            updateTime: null,
            updateUser: null
          })
        }
        return menus
      }
    },
    watch: {
      indexData(data) {
        this.fd.tools.merge(true, this.targetMap, this.fd.data.arrayToObj(data, 'id'))
        this.targetData = []
        this.$nextTick(() => {
          const targetData = this.fd.data.changeToTree(data, 'id', 'pid')
          this.targetData = targetData.concat([])
        })
      },
      getMenus() {
        const data = this.getMenusMsg()
        if (data) {
          this.refreshMenus(data)
        }
      },
      menus(menus) {
        this.initMenusTree(menus)
      }
    }
  }
</script>

<style lang="scss">
  .target-drag-list {
    .fd-drag-chosen .icon-close{
      display: none;
    }
    .fd-drag-chosen{
      line-height: 40px;
      color: #fcfcfc;
      background-color: rgba(112,198,242,1);
      cursor: pointer;
    }
    .bg-yellow{
      height: 0px;
      padding: 1px;
      overflow: hidden;
      background-color: rgba(112,198,242,1);
      cursor: pointer;
    }
    .fd-drag-dragging{
      color: #fcfcfc;
      clear: both;
      height: 40px !important;
      line-height: 40px;
      background-color: rgba(112,198,242,1);
      border-radius: 2px;
    }
    .icon-enter {
      transform: rotate(-90deg);
    }
    .el-radio-button--small .el-radio-button__inner{
      padding:9px 9px;
    }
    .width-180px{
      width:180px;
    }
    .target-ku {
      .el-input__inner{
        width: 148px;
      }
    }
  }
</style>

