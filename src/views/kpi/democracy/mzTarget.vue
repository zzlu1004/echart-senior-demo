<template>
  <div class="app-container">
    <div class="container-inner bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="tab-box">
        <el-tabs v-if="elements.depart || elements.person" v-model="type" type="card"  @tab-click="typeChange">
          <el-tab-pane  v-if="elements.person" label="个人" name="personal">
            <div class="mb2 hidden">
            <span v-if="elements.add" class="f-left btn btn-sm btn-primary" @click="addTarget">
              <i class="at icon-plus"/>新增指标
            </span>
              <span class="f-right">
              <fd-search @search="searchByKeyword"
                         v-model="personParams.keyword">
              </fd-search>
            </span>
            </div>
            <div>
              <fd-table :data="targetData" :border=true :loading="loading">
                <el-table-column prop="name"  width="200" label="指标名称" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span class="color-blue pointer"  @click="seeTarget(scope.row)">{{scope.row.name}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="remarks" label="详情描述"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="indexExpression" label="规则"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="flowName" label="关联流程" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="collections" label="档位">
                  <template slot-scope="scope">
                    <el-popover
                      placement="top-start"
                      title=""
                      width="200"
                      v-for="(item,index) in scope.row.collections"
                      :key="item.id"
                      trigger="hover">
                    <span>
                      <span v-for="(item,index) in item.gears">
                        <span class="gear-class">{{item.gearName}}</span>
                      </span>
                    </span>
                      <span  class="gear-name" slot="reference">{{item.collectionName}}</span>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column prop="active" width="100" label="状态">
                  <template slot-scope="scope"  >{{scope.row.active === 'active' ? '已生效' : '未生效'}}</template>
                </el-table-column>
                <el-table-column label="操作"
                                 width="180">
                  <template slot-scope="scope">
                    <el-button  v-if="elements.edit" :disabled="scope.row.active === 'active'" @click="editTarget(scope.row)" type="text">编辑</el-button>
                    <el-button  v-if="elements.copy" @click="copyTarget(scope.row)" type="text">复制</el-button>
                    <el-button  v-if="elements.delete" :disabled="scope.row.active === 'active'" @click="deleteTarget(scope.row)" type="text">删除</el-button>
                  </template>
                </el-table-column>
              </fd-table>
              <fd-pagination
                :limit="personParams.limit"
                :offset="personParams.offset"
                :currentChange="currentChange"
                :sizeChange="sizeChange"
                :sizes=true
                :total= "personParams.total"
              ></fd-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane  v-if="elements.depart" label="部门" name="depart">
            <div class="mb2 hidden">
            <span v-if="elements.add" class="f-left btn btn-sm btn-primary" @click="addTarget">
              <i class="at icon-plus"/>新增指标
            </span>
              <span class="f-right">
              <fd-search @search="searchByKeyword"
                         v-model="departParams.keyword">
              </fd-search>
            </span>
            </div>
            <div>
              <fd-table :data="targetData" :border=true :loading="loading">
                <el-table-column prop="name"  width="200" label="指标名称" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span class="color-blue pointer"  @click="seeTarget(scope.row)">{{scope.row.name}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="remarks" label="详情描述"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="indexExpression" label="规则"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="flowName" label="关联流程" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="collections" label="档位">
                  <template slot-scope="scope">
                    <el-popover
                      placement="top-start"
                      title=""
                      width="200"
                      v-for="(item,index) in scope.row.collections"
                      :key="item.id"
                      trigger="hover">
                    <span>
                      <span v-for="(item,index) in item.gears">
                        <span class="gear-class">{{item.gearName}}</span>
                      </span>
                    </span>
                      <span  class="gear-name" slot="reference">{{item.collectionName}}</span>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column prop="active" width="100" label="状态">
                  <template slot-scope="scope"  >{{scope.row.active === 'active' ? '已生效' : '未生效'}}</template>
                </el-table-column>
                <el-table-column label="操作"
                                 width="180">
                  <template slot-scope="scope">
                    <el-button  v-if="elements.edit" :disabled="scope.row.active === 'active'" @click="editTarget(scope.row)" type="text">编辑</el-button>
                    <el-button  v-if="elements.copy" @click="copyTarget(scope.row)" type="text">复制</el-button>
                    <el-button  v-if="elements.delete" :disabled="scope.row.active === 'active'" @click="deleteTarget(scope.row)" type="text">删除</el-button>
                  </template>
                </el-table-column>
              </fd-table>
              <fd-pagination
                :limit="departParams.limit"
                :offset="departParams.offset"
                :currentChange="currentChange"
                :sizeChange="sizeChange"
                :sizes=true
                :total= "departParams.total"
              ></fd-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <fd-dialog
      :title="editTargetTitle"
      :syncVisible="editTargetDialog"
      @beforeClose="editTargetDialog = false"
    >
      <div slot="fd-body">
        <el-row>
          <el-col :span="20">
            <el-form :rules="rules"
                     ref="targetForm"
                     :model="targetFrom"
                     label-position="right"
                     label-width="35%">
              <!--指标名称-->
              <el-form-item label="指标名称" prop="name">
                <el-input
                  :readonly="editTargetTitle == '查看指标'"
                  v-model="targetFrom.name"
                  clearable
                  placeholder="请输入指标名称"
                >
                </el-input>
              </el-form-item>
              <!--详情描述-->
              <el-form-item prop="remarks" label="详情描述">
                <el-input :readonly="editTargetTitle == '查看指标'" type="textarea" v-model="targetFrom.remarks" placeholder="请输入详情描述"></el-input>
              </el-form-item>
              <!--关联个人流程-->
              <el-form-item v-if="type === 'personal'" label="关联个人流程" prop="flowId">
                <el-select :disabled="editTargetTitle == '查看指标'" v-model="targetFrom.flowId" placeholder="请选择关联个人流程">
                  <el-option
                    v-for="item of personalFlows"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!--关联部门流程-->
              <el-form-item v-if="type === 'depart'" label="关联部门流程" prop="flowId">
                <el-select :disabled="editTargetTitle == '查看指标'" v-model="targetFrom.flowId" placeholder="请选择关联部门流程">
                  <el-option
                    v-for="item of departFlows"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!--关联档位-->
              <el-form-item label="关联档位" prop="collectionIds">
                <el-select :disabled="editTargetTitle == '查看指标'" v-model="targetFrom.collectionIds" multiple placeholder="请选择关联档位">
                  <el-option
                    v-for="item of collections"
                    :key="item.id"
                    :label="setTargetLabel(item)"
                    :value="item.id"
                  >
                  <span>{{item.collectionName}}:{{(item.gears || []) | showArray2('gearName')}}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <!--指标规则-->
              <el-form-item label="指标规则" prop="indexExpression">
                <el-input :readonly="editTargetTitle == '查看指标'" type="textarea" v-model="targetFrom.indexExpression" placeholder="请输入指标规则"></el-input>
                <fd-formula-des :example="[]" ></fd-formula-des>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
      </div>
      <div slot="fd-footer">
        <el-button size="small" @click="editTargetDialog = false">取消</el-button>
        <el-button size="small" type="primary" @click="saveTarget">确定</el-button>
      </div>
    </fd-dialog>
  </div>
</template>

<script>
  import fdDialog from 'fd/dialog/src/dialog.vue'
  import FdTable from 'fd/table/src/fdTable'
  import FdPagination from 'fd/pagination/pagination'
  import FdFormulaDes from '../components/mzTargetFormulaDes'
  import { tableSelect, resetForm, getAllPerson, getActiveSchemas } from '@/api/kpi/record'
  import {
    currentChange,
    sizeChange,
    addTarget,
    addTargets,
    saveTarget,
    seeTarget,
    deleteTarget,
    copyTarget,
    editTarget,
    getTargetData,
    getDepartFlows,
    getPersonalFlows,
    typeChange,
    getCollectionData,
    searchByKeyword
  } from '@/api/kpi/democracy/mzTarget'
  import FdDraggable from 'fd/drag/draggable'
  export default {
    name: '',
    components: { FdDraggable, fdDialog, FdTable, FdPagination, FdFormulaDes },
    data() {
      return {
        type: 'personal',
        personParams: {
          limit: 10,
          offset: 0,
          total: 0,
          keyword: '',
          paging: true,
          type: 'personal'
        },
        departParams: {
          limit: 10,
          offset: 0,
          total: 0,
          keyword: '',
          paging: true,
          type: 'depart'
        },
        departs: [],
        rowId: [],
        departFlows: [],
        personalFlows: [],
        collections: [],
        editTargetDialog: false,
        editTargetTitle: '指标设置',
        disabled_edit: false,
        targetFrom: {
          name: '',
          flowId: '',
          collectionIds: [],
          remarks: '',
          indexExpression: ''
        },
        relate: [],
        // 表格数据
        targetData: [],
        loading: false,
        rules: {
          name: [{ required: true, message: '请输入指标名称', trigger: 'blur' },
            { max: 50, message: '最多输入50个字符', trigger: 'blur' }],
          remarks: [{ required: false, message: '请输入详情描述', trigger: 'blur' },
            { max: 1000, message: '最多输入1000个字符', trigger: 'blur' }],
          flowId: [{ required: true, message: '请选择关联流程', trigger: 'blur' }],
          collectionIds: [{ required: true, message: '请选择关联档位', trigger: 'blur' }],
          indexExpression: [{ required: true, message: '请输入指标规则', trigger: 'blur' }]
        },
        hasActive: false
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.mzTarget || { add: true, edit: true, copy: true, deletable: true }
      }
    },
    mounted() {
      this.getTargetData(this.type)
      this.getAllPerson()
      this.getActiveSchemas()
      this.getCollectionData()
      this.getPersonalFlows()
      this.getDepartFlows()
    },
    methods: {
      currentChange,
      sizeChange,
      tableSelect,
      getTargetData,
      getDepartFlows,
      getPersonalFlows,
      getActiveSchemas,
      getAllPerson,
      addTarget,
      seeTarget,
      addTargets,
      saveTarget,
      deleteTarget,
      copyTarget,
      editTarget,
      resetForm,
      typeChange,
      searchByKeyword, getCollectionData,
      // 档位选择框数据内容自定义
      setTargetLabel(value) {
        const targetLabel = []
        value.gears.forEach((item, index) => {
          targetLabel.push(item.gearName)
        })
        return value.collectionName + ' : ' + targetLabel.join(' | ')
      }
    },
    watch: {
    }
  }
</script>

<style scoped>
  .target-input>.el-form-item{
    float: left;
    width: 24%!important;
    margin-bottom: 20px;
    margin-right: 16px;
  }
  .gear-class{
    float: left;
    font-weight: 500;
    background-color: #e8f4fd;
    padding: 2px 10px;
    margin-right: 16px;
    color: #1b95e7;
    margin-bottom: 8px;
  }
  .gear-name{
    float: left;
    cursor: pointer;
    border: 1px solid #ebeef5;
    padding: 2px 10px;
    margin-right: 8px;
    margin-bottom: 2px;
    border-radius: 2px;
  }
</style>

