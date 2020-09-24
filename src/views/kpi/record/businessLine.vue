<template>
  <div class="app-container">
    <div class="container-inner bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="mb2 hidden">
          <span v-if="elements.add" class="f-left btn btn-sm btn-primary" @click="addLine">
            <i class="at icon-plus"/>新增业务线
          </span>
          <span class="f-right">
            <fd-search @search="searchByKeyword"
                       v-model="keyword">
            </fd-search>
          </span>
      </div>
      <div>
        <fd-table :data="lineData" :border=true :loading="loading">
          <el-table-column prop="name"  width="300" label="业务线名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="departNames" label="涉及部门" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.departNames|showArray("departNamess")}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           width="180">
            <template slot-scope="scope">
              <el-button  v-if="elements.edit" @click="editLine(scope.row)" type="text">编辑</el-button>
              <el-button  v-if="elements.delete" @click="deleteLine(scope.row)" type="text">删除</el-button>
            </template>
          </el-table-column>
        </fd-table>
      </div>
    </div>
    <fd-dialog
      :title="editLineTitle"
      :syncVisible="editLineDialog"
      @beforeClose="editLineDialog = false"
    >
      <div slot="fd-body">
        <el-row>
          <el-col :span="20">
            <el-form :rules="rules"
                    ref="lineForm"
                    :model="lineFrom"
                    label-position="right"
                    label-width="35%">
              <el-form-item label="业务线名称" prop="name">
                <el-input
                  v-model="lineFrom.name"
                  placeholder="请输入业务线名称，不多于50个字">
                </el-input>
              </el-form-item>
              <el-form-item label="涉及部门" prop="departIds">
                <el-select multiple
                           clearable
                           filterable
                           v-model="lineFrom.departIds" placeholder="请选择">
                  <el-option
                    v-for="item in departs"
                    :key="item.id"
                    :label="item.name"
                    :disabled="item.used"
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
        <el-button size="small" @click="editLineDialog = false">取消</el-button>
        <el-button size="small" type="primary" @click="saveLine">确定</el-button>
      </div>
    </fd-dialog>
  </div>
</template>

<script>
  import fdDialog from 'fd/dialog/src/dialog.vue'
  import FdTable from 'fd/table/src/fdTable'
  import { tableSelect, resetForm, getAllPerson, getActiveSchemas } from '@/api/kpi/record'
  import {
    addLine,
    saveLine,
    deleteLine,
    editLine,
    getLineData,
    getdepartsData,
    searchByKeyword
  } from '@/api/kpi/record/businessLine'
  import FdDraggable from 'fd/drag/draggable'
  export default {
    name: '',
    components: { FdDraggable, fdDialog, FdTable },
    data() {
      return {
        departs: [],
        rowId: [],
        keyword: '',
        editLineDialog: false,
        editLineTitle: '业务线设置',
        disabled_edit: false,
        lineFrom: {
          name: '',
          departIds: []
        },
        // 表格数据
        lineData: [],
        loading: false,
        rules: {
          name: [{ required: true, message: '请输入业务线名称', trigger: 'blur' },
            { max: 50, message: '最多输入50个字符', trigger: 'blur' }],
          departIds: [{ required: true, message: '请选择涉及部门', trigger: 'blur' }]
        },
        hasActive: false
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.businessLine || {}
      }
    },
    mounted() {
      this.getLineData()
      this.getAllPerson()
      this.getActiveSchemas()
    },
    methods: {
      tableSelect,
      getLineData,
      getActiveSchemas,
      getAllPerson,
      // 点击新增部门
      addLine,
      saveLine,
      deleteLine,
      editLine,
      resetForm,
      getdepartsData,
      searchByKeyword
    },
    watch: {
    }
  }
</script>

<style scoped>
</style>

