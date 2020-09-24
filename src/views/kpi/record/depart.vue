<template>
  <div class="app-container">
    <div class="container-inner bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="pb2">
        <el-row>
          <el-col :span="12" class="t-left">
            <span v-if="elements.add" class="btn btn-sm btn-primary" @click="addDepart">
              <i class="at icon-plus"/>新增部门
            </span>
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="12" class="t-right">
            <span v-if="elements.delete" @click="verifyDeleteDepart" class="btn btn-sm btn-default">删除部门</span>
          </el-col>
        </el-row>
      </div>
      <div>
        <fd-tree-table
          :loading="loading"
          :columns="columns"
          :data="data"
          v-on:editDepart="editDepart"
          v-on:sortChild="sortChild"
          v-on:selectChange="selectChange"
        ></fd-tree-table>
      </div>
    </div>
    <fd-dialog
      :title="editDepartTitle"
      :syncVisible="editDepartDialog"
      @beforeClose="editDepartDialog = false"
    >
      <div slot="fd-body">
        <el-row>
          <el-col :span="20">
            <el-form :rules="rules"
                    ref="departForm"
                    :model="departFrom"
                    label-position="right"
                    label-width="35%">
              <el-form-item
                label="部门名称"
                prop="name">
                <el-input
                  :readonly="(departFrom.id === (treeDepart[0] ? treeDepart[0].id: '-1') || disabled_edit)"
                  v-model="departFrom.name"
                  placeholder="请输入部门名称">
                </el-input>
              </el-form-item>
              <el-form-item v-if="departFrom.parentName" label="上级部门" prop="pid">
                <el-popover
                  ref="departPid"
                  :disabled="disabled_edit"
                  placement="bottom-start"
                  v-model="showDepartTree">
                  <div style="max-height: 20rem;" class="auto">
                    <el-tree :data="treeDepart"
                            :props="defaultProps"
                            default-expand-all
                            :accordion="accordion"
                            @node-click="handleNodeClick"></el-tree>
                  </div>
                </el-popover>
                <el-input
                  v-model="departFrom.parentName"
                  readonly
                  placeholder="请选择上级部门"
                  v-popover:departPid>
                </el-input>
              </el-form-item>
              <el-form-item label="部门领导" prop="headId">
                <el-select v-model="departFrom.headId" filterable clearable placeholder="请选择">
                  <el-option
                    v-for="item in allPerson"
                    :key="item.idCard"
                    :label="(item.name+'/'+item.departName)"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="部门副领导" prop="staffIds">
                <el-select v-model="departFrom.staffIds" filterable clearable multiple placeholder="请选择">
                  <el-option
                    v-for="item in allPerson"
                    :key="item.idCard"
                    :label="(item.name+'/'+item.departName)"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="考核关联人">
                <el-select v-model="departFrom.appointStaff" filterable clearable placeholder="请选择">
                  <el-option
                    v-for="item in allPerson"
                    :key="item.idCard"
                    :label="(item.name+'/'+item.departName)"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="部门类型" prop="departType">
                <el-select v-model="departFrom.departType" placeholder="请选择">
                  <el-option
                    v-for="item in types"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
      </div>
      <div slot="fd-footer">
        <el-button size="small" @click="editDepartDialog = false">取消</el-button>
        <el-button size="small" type="primary" @click="saveDepart">确定</el-button>
      </div>
    </fd-dialog>
    <fd-dialog
      title="部门排序"
      :syncVisible="sortDepartDialog"
      @beforeClose="sortDepartDialog = false"
    >
      <div slot="fd-body">
        <div v-if="sortDepart.data">
          <div class="h16 color-forbid mb1">{{dataMap[sortDepart.data.id].name}}<span class="h14">（选中部门可上下拖拽进行排序）</span></div>
          <div>
            <fd-draggable
              v-on:dragend="dragend"
              label="name"
              group="sortDepart"
              :list="sortDepart.children"></fd-draggable>
          </div>
        </div>
      </div>
      <div slot="fd-footer">
        <el-button size="small" @click="sortDepartDialog = false">取消</el-button>
        <el-button size="small" type="primary" @click="saveSort">确定</el-button>
      </div>
    </fd-dialog>
  </div>
</template>

<script>
  import FdTreeTable from '../components/treeTable'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  import { tableSelect, resetForm, getAllPerson, getActiveSchemas } from '@/api/kpi/record'
  import {
    dragend,
    addDepart,
    handleNodeClick,
    saveDepart,
    sortChild,
    saveSort,
    selectChange,
    verifyDeleteDepart,
    deleteDepart,
    editDepart,
    refreshSort,
    getDepartData
  } from '@/api/kpi/record/depart'
  import FdDraggable from 'fd/drag/draggable'
  export default {
    name: '',
    components: { FdDraggable, FdTreeTable, fdDialog },
    data() {
      return {
        // 表格配置
        columns: [{
          field: 'name',
          title: '部门名称',
          width: '350px',
          expand: true,
          disabled: 'disabled_edit',
          checkbox: true
        }, {
          field: 'source',
          title: '数据来源',
          formatter: (row, value) => {
            return value === 'system' ? '系统内' : '系统外'
          }
        }, {
          field: 'total',
          title: '成员数'
        }, {
          field: 'headName',
          title: '部门领导'
        }, {
          field: 'leader',
          title: '部门副领导',
          showOverflowTooltip: true,
          formatter: (row, value) => {
            let html = ''
            value.forEach((item, i) => {
              html += item.name + (i === value.length - 1 ? '' : '|')
            })
            return html
          }
        }, {
          field: 'appointStaffName',
          title: '考核关联人',
          showOverflowTooltip: true
        }, {
          field: 'departTypeName',
          title: '部门类型',
          showOverflowTooltip: true
        }, {
          field: '',
          title: '操作',
          width: this.fd.tools.getStringWidth('操作2'),
          type: 'operate',
          operate: [{
            text: '编辑',
            show: 'edit',
            eventName: 'editDepart'
          }, {
            text: '排序',
            show: 'sortable',
            eventName: 'sortChild'
          }]
        }],
        // 设置部门信息弹框
        editDepartDialog: false,
        editDepartTitle: '设置部门信息',
        disabled_edit: false,
        departFrom: {
          id: '',
          name: '',
          pid: '',
          departType: 'k10027-99',
          parentName: '',
          headId: '',
          staffIds: [],
          appointStaff: ''
        },
        // 保存表格数据id的映射关系
        dataMap: {},
        data: [],
        // 表格数据
        departData: [],
        loading: false,
        rules: {
          name: [{ required: true, message: '请输入部门名称', trigger: 'blur' },
            { max: 50, message: '最多输入50个字符', trigger: 'blur' }],
          parentName: [{ required: true, message: '请选择父级部门', trigger: 'blur' }]
        },
        // 设置部门信息弹框中部门选择的树
        treeDepart: [],
        showDepartTree: false,
        accordion: true,
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        sortDepartDialog: false,
        sortDepart: {},
        oldSorts: [],
        newSorts: [],
        departId: '',
        keyword: '',
        allPerson: [],
        offset: 0,
        limit: 0,
        hasActive: false,
        typeMap: this.fd.tools.mapSelects('k10027')
      }
    },
    computed: {
      // 部门类型
      types() {
        return this.$store.getters.selects['k10027']
      },
      elements() {
        return this.$store.getters.elements.depart || {}
      }
    },
    mounted() {
      this.getDepartData()
      this.getAllPerson()
      this.getActiveSchemas()
    },
    methods: {
      tableSelect,
      getDepartData,
      getActiveSchemas,
      dragend,
      getAllPerson,
      // 点击新增部门
      addDepart,
      handleNodeClick,
      saveDepart,
      sortChild,
      saveSort,
      selectChange,
      verifyDeleteDepart,
      deleteDepart,
      editDepart,
      resetForm,
      refreshSort
    },
    watch: {
      departData(data) {
        this.dataMap = this.fd.data.arrayToObj(data, 'id')
        const pidMap = this.fd.data.arrayToObj(data, 'pid')
        this.treeDepart = this.fd.data.changeToTree(data, 'id', 'pid')
        this.refreshSort(this.treeDepart, this.dataMap)
        for (const item of data) {
          item.edit = this.elements.edit
          item.disabled_edit = item.source !== 'system'
          item.departTypeName = this.typeMap[item.departType]
          item.sortable = this.elements.sort && !!pidMap[item.id]
        }
        this.data = data
      }
    }
  }
</script>

<style scoped>
</style>

