<template>
  <div class="app-container">
    <div class="container-inner bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="mb2 hidden">
        <span v-if="elements.add" class="f-left btn btn-sm btn-primary" @click="addGear">
          <i class="at icon-plus"/>新增档位
        </span>
        <span class="f-right">
            <fd-search @search="searchByKeyword"
                       v-model="keyword">
            </fd-search>
          </span>
      </div>
      <div>
        <fd-table :data="gearData" :border=true :loading="loading">
          <el-table-column prop="collectionName"  width="300" label="档位集合名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="gears"  label="档位" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="item.names" v-for="(item,index) in scope.row.gears">
                <span class="gear-class">{{item.names}}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="active" width="120" label="状态" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.active === 'active' ? '生效中' : '未生效'}}
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           width="120">
            <template slot-scope="scope">
              <el-button  v-if="elements.edit"  :disabled="scope.row.active === 'active'" @click="editGear(scope.row)" type="text">编辑</el-button>
              <el-button  v-if="elements.delete"  :disabled="scope.row.active === 'active'" @click="deleteGear(scope.row)" type="text">删除</el-button>
            </template>
          </el-table-column>
        </fd-table>
        <fd-pagination
          :limit="limit"
          :offset="offset"
          :total="total"
          sizes="sizes"
          :currentChange="currentChange"
          :sizeChange="sizeChange">
        </fd-pagination>
      </div>
    </div>
    <fd-dialog
      :title="editGearTitle"
      :syncVisible="editGearDialog"
      @beforeClose="editGearDialog = false"
    >
      <div slot="fd-body">
        <el-row>
          <el-col :span="20">
            <el-form :rules="rules"
                     ref="gearForm"
                     :model="gearFrom"
                     label-position="right"
                     label-width="35%">
              <el-form-item label="档位集合名称" prop="collectionName">
                <el-input
                  v-model="gearFrom.collectionName"
                  clearable
                  placeholder="请输入档位集合名称"
                  >
                </el-input>
              </el-form-item>
              <el-form-item label="档位" required >
                <div class="gear-input">
                  <el-form-item
                    v-for="(items, i) in gearFrom.gears"
                    :key="i"
                    :rules="[{ max: 10, message: '长度不超过10个字符', trigger: 'blur' }]"
                    :prop="'gears[' + i + '].gearName'"
                  >
                    <el-input
                      type="text"
                      style="width: 118px;height: 40px;overflow: hidden"
                      v-model="items.gearName"
                      placeholder="请输入档位"
                      clearable
                    > </el-input>
                  </el-form-item>
                  <el-button type="primary" icon="el-icon-plus" @click="addGears()">新增档位</el-button>
                </div>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
      </div>
      <div slot="fd-footer">
        <el-button size="small" @click="cancelGear">取消</el-button>
        <el-button size="small" type="primary" @click="saveGear">确定</el-button>
      </div>
    </fd-dialog>
  </div>
</template>

<script>
  import FdPagination from 'fd/pagination/pagination'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  import FdTable from 'fd/table/src/fdTable'
  import { tableSelect, resetForm, getAllPerson, getActiveSchemas } from '@/api/kpi/record'
  import {
    addGear,
    cancelGear,
    addGears,
    saveGear,
    deleteGear,
    editGear,
    getGearData,
    currentChange,
    sizeChange,
    searchByKeyword
  } from '@/api/kpi/democracy/gearHouse'
  import FdDraggable from 'fd/drag/draggable'
  export default {
    name: '',
    components: { FdDraggable, fdDialog, FdTable, FdPagination },
    data() {
      return {
        limit: 10,
        offset: 0,
        total: 0,
        keyword: '',
        commonGear: '',
        departs: [],
        rowId: [],
        editGearDialog: false,
        flag: false,
        editGearTitle: '档位设置',
        disabled_edit: false,
        gearFrom: {
          collectionName: '',
          gears: []
        },
        // 表格数据
        gearData: [],
        loading: false,
        rules: {
          collectionName: [{ required: true, message: '请输入档位集合名称', trigger: 'blur' },
            { max: 50, message: '长度不超过50个字符', trigger: 'blur' }]
        },
        hasActive: false,
        relatedIndexes: ''
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.gearHouse || {}
      }
    },
    mounted() {
      this.getGearData()
      this.getAllPerson()
      this.getActiveSchemas()
    },
    methods: {
      tableSelect,
      searchByKeyword,
      getGearData,
      getActiveSchemas,
      getAllPerson,
      addGear,
      addGears,
      saveGear,
      deleteGear,
      cancelGear,
      editGear,
      resetForm,
      currentChange,
      sizeChange,
      addGearName(items, i) {
        console.log('items', items)
        return items.gearName
      }
    },
    watch: {
    }
  }
</script>

<style scoped>
  .gear-input>.el-form-item{
    float: left;
    /*width: 24%!important;*/
    /*margin-bottom: 20px;*/
    margin-right: 16px;
  }
  .gear-class{
    float: left;
    list-style: none;
    font-weight: 500;
    background-color: #e8f4fd;
    padding: 2px 10px;
    margin-right: 16px;
    margin-bottom: 8px;
    color: #1b95e7;
  }
</style>

