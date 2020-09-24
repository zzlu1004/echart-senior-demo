<template>
  <div class="app-container">
    <div class="container-inner bg-white weight-model" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="line-height-4">
        <el-row>
          <el-col :span="12">
            <el-button v-if="elements.add" type="primary" size="small" @click="addWeightModel"><i class="at icon-plus"/>新增模型</el-button>
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="12" class="t-right">
            <div class="inline-block">
              <fd-search @search="searchByKeywords"
                         v-model="keywords"></fd-search>
            </div>
          </el-col>
        </el-row>
      </div>
      <div>
        <fd-new-card v-for="(item, index) of lists"
                     class="mt2"
                     :key="index"
                     :data="item"
                     :options="options"
                     v-on:showDetail="showModelDetail"
                     v-on:delete="deleteModel"
                     v-on:start="checkModel"
                     v-on:end="cancelModel"
                     v-on:edit="editModel"
                     v-on:copy="copyModel">
          <div slot='body'>
            <div>
              <div class="f-left label mr1 line-height-normal">分类:</div>
              <div class="hidden text-indent0">
                <span v-for="page of item.modelPages"
                      :key="page.pageId"
                      class="bd mr2 color-link pointer inline-block line-height-normal px1"
                      @click="showDetailPage(page, item)"
                      style="border-color: #1b95e7;">{{page.name}}({{page.kpiCount||0}})</span>
              </div>
            </div>
            <div class="pt2">
              <div class="f-left label mr1">详情描述:</div>
              <div class="hidden text-indent0 label">
                <span>{{item.content | noString}}</span><span v-html="'&nbsp;'"></span>
              </div>
            </div>
          </div>
        </fd-new-card>
      </div>
      <fd-pagination
        :limit="limit"
        :offset="offset"
        :currentChange="currentChange"
        :sizeChange="sizeChange"
        :pageArr="[5,10,20,30,40,50]"
        :sizes=true
        :total= "total"
      ></fd-pagination>
      <div v-if="lists.length === 0">
        <fd-no-content></fd-no-content>
      </div>
    </div>
    <fd-dialog
      :title="modelTitle"
      :syncVisible="editModelDialog"
      @beforeClose="editModelDialog = false"
      >
      <div slot="fd-body">
        <el-row>
          <el-col :span="20">
            <el-form :rules="rules"
                 ref="modelForm"
                 :model="modelForm"
                 label-position="right"
                 label-width="35%">
              <el-form-item label="权重模型名称" prop="name">
                <el-input v-model="modelForm.name" :readonly="modelTitle === '模型详情'" placeholder="请输入权重模型名称,不多于50个字"></el-input>
              </el-form-item>
              <el-form-item label="详情描述" prop="content">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 20 }"
                  v-model="modelForm.content"
                  :readonly="modelTitle === '模型详情'"
                  :placeholder="(modelTitle !== '模型详情'?'请输入权重模型的详情描述,不多于1000个字':'')"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
      </div>
      <div slot="fd-footer">
        <el-button v-show="modelTitle !== '模型详情'" size="small" @click="editModelDialog = false">取消</el-button>
        <el-button v-show="modelTitle !== '模型详情'" size="small" type="primary" @click="saveModel">确定</el-button>
        <el-button v-show="modelTitle === '模型详情'" size="small" @click="editModelDialog = false">关闭</el-button>
      </div>
    </fd-dialog>
    <fd-dialog
      title="启用失败"
      :syncVisible="checkModelDialog"
      @beforeClose="checkModelDialog = false"
    >
      <div slot="fd-body">
        <div class="relative mt1" v-for="(item, index) of checkErrorList" :key="index">
          <el-tooltip class="item" effect="dark" :content="item" placement="top-start">
            <div class="dot-hidden pr8">{{item}}</div>
          </el-tooltip>
          <div class="absolute right-2 top-0 color-red">
            <i class="at icon-closecircle"/>
          </div>
        </div>
      </div>
      <div slot="fd-footer">
        <el-button size="small" type="primary" @click="checkModelDialog = false">确定</el-button>
      </div>
    </fd-dialog>
  </div>
</template>

<script>
  import {
    addWeightModel,
    refreshWeightModel,
    getWeightModel,
    dealWithModel,
    currentChange,
    sizeChange,
    copyModel,
    deleteModel,
    editModel,
    saveModel,
    startModel,
    cancelModel,
    showModelDetail,
    showDetailPage,
    checkModel,
    searchByKeywords
  } from '@/api/kpi/check/weight'
  import { resetForm } from '@/api/common'
  import FdNewCard from 'fd/newCard/FdCard'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  import FdPagination from 'fd/pagination/pagination'
  import FdNoContent from 'fd/noContent'
  export default {
    name: 'weightModel',
    components: { FdNoContent, FdNewCard, FdPagination, fdDialog },
    props: {},
    data() {
      return {
        keywords: '',
        limit: 5,
        offset: 0,
        total: 0,
        effect: '1',
        models: [],
        lists: [],
        modelTitle: '新增模型',
        editModelDialog: false,
        checkModelDialog: false,
        checkErrorList: [],
        pageMap: {
          1: 'model_fixedList',
          2: 'model_criList',
          3: 'model_civList',
          31: 'model_civtList',
          4: 'model_admList',
          5: 'model_exeList',
          6: 'model_floatList'
        },
        modelForm: {
          id: '',
          name: '',
          content: ''
        },
        rules: {
          name: [{ required: true, message: '请输入模型名称', trigger: 'blur' }, {
            max: 50, message: '长度不超过50个字符', trigger: 'blur'
          }],
          content: [{ max: 1000, message: '长度不超过1000个字符', trigger: 'blur' }]
        },
        loading: null,
        options: {
          header: {
            left: [{
              type: 'text',
              field: 'name',
              class: 'h16 color-title color-link-hover pointer ml1',
              event: 'showDetail'
            }, {
              type: 'html',
              field: 'isUse',
              class: 'ml2',
              map: {
                '0': '<span class="status-map-0">未启用</span>',
                '1': '<span class="status-map-2">已启用</span>',
                '2': '<span class="status-map-1">启用中</span>',
                '3': '<span class="status-map-3">启用失败</span>'
              }
            }],
            right: [{
              type: 'button',
              child: [{
                text: '编辑',
                show: 'enable_edit',
                disable: 'edit',
                event: 'edit'
              }, {
                text: '启用',
                show: 'enable_enabled',
                disable: 'enabled',
                event: 'start'
              }, {
                text: '停用',
                show: 'enable_cancel',
                disable: 'cancel',
                event: 'end'
              }, {
                text: '复制',
                show: 'enable_copy',
                event: 'copy'
              }, {
                text: '删除',
                show: 'enable_delete',
                disable: 'delete',
                event: 'delete'
              }]
            }]
          },
          body: {},
          eventNames: ['copy', 'edit', 'start', 'end', 'delete', 'showDetail']
        }
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.weightModel || {}
      }
    },
    mounted() {
    },
    activated() {
      this.refreshWeightModel()
    },
    methods: {
      addWeightModel,
      refreshWeightModel,
      searchByKeywords,
      getWeightModel,
      dealWithModel,
      currentChange,
      sizeChange,
      copyModel,
      deleteModel,
      editModel,
      startModel,
      cancelModel,
      showModelDetail,
      resetForm,
      saveModel,
      showDetailPage,
      checkModel
    },
    watch: {
      models(data) {
        this.lists = this.dealWithModel(data)
      }
    }
  }
</script>

<style lang="scss">
.app-container .weight-model{
  .status-map-0,
  .status-map-1,
  .status-map-2,
  .status-map-3{
    border: 1px solid;
    border-radius: 15px;
    padding: 4px 16px;
  }
  .status-map-0{
    border-color: #ffcd3c;
    background-color: #fffaeb;
    color: #e09a00;
  }
  .status-map-1{
    background-color: #ebf8f2;
    border: solid 1px #00924b;
    color: #00924c;
  }
  .status-map-2{
    background-color: #edf6fd;
    border: solid 1px #177cc9;
    color: #177dc9;
  }
  .status-map-3{
    background-color: #FEEDEC;
    border: solid 1px #F04134;
    color: #F04134;
  }
}
</style>
