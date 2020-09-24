<template>
  <div class="app-container checkProject">
    <div class="container-inner bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="line-height-4">
        <el-row>
          <el-col :span="12">
            <el-button v-if="elements.add" type="primary" size="small" @click="addSchemas"><i class="at icon-plus"/>新增方案</el-button>
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="12" class="t-right">
            <fd-search @search="searchByKeyword" v-model="keywords"></fd-search>
          </el-col>
        </el-row>
      </div>
      <div>
        <fd-new-card v-for="item of schemas"
                     class="mt2" :key="item.id"
                     :data="item"
                     :options="options"
                     v-on:cancel="cancelSchemas"
                     v-on:finish="checkFinish"
                     v-on:showDetail="showSchemaDetail"
                     v-on:delete="deleteSchemas"
                     v-on:edit="editSchemas"
                     v-on:copy="copySchemas"
                     v-on:active="checkSchemas">
          <div slot='body'>
            <el-row>
              <el-col class="relative" :span="8">
                <div class="absolute">考评周期:</div>
                <div class="except-w4-full">{{item.startTime|parseTime('{y}-{m}-{d}')}}至{{item.endTime|parseTime('{y}-{m}-{d}')}}</div>
              </el-col>
              <el-col class="relative" :span="8">
                <div class="absolute">上报截止时间:</div>
                <div class="except-w6-full">{{item.deadlineTime|parseTime('{y}-{m}-{d}')}}</div>
              </el-col>
              <el-col class="relative" :span="8">
                <div class="absolute">更新时间:</div>
                <div class="except-w4-full">{{item.updateTime|parseTime('{y}-{m}-{d}')}}</div>
              </el-col>
            </el-row>
          </div>
        </fd-new-card>
      </div>
      <div v-if="schemas.length === 0">
        <fd-no-content></fd-no-content>
      </div>
      <fd-pagination
        :limit="limit"
        :offset="offset"
        :currentChange="currentChange"
        :sizeChange="sizeChange"
        :sizes=true
        :total= "total"
      ></fd-pagination>
    </div>
    <fd-dialog
      title="错误报告"
      :syncVisible="projectCheckError"
      @beforeClose="projectCheckError = false"
    >
      <div slot="fd-body">
        <div>
          <div v-for="(data, series) of errorMsg"
               :key="series"
               class="mb1">
            <div class="relative h16 color-title bold">
              <div class="dot-hidden pr8">{{series}}</div>
              <div v-if="isAllSuccess(data)" class="absolute right-2 top-0 color-green">
                <i class="at icon-checkcircle"/>
              </div>
            </div>
            <div class="relative mt1" v-for="(item, index) of data" :key="index" v-show="!item.success">
              <el-tooltip class="item" effect="dark" :content="item.label" placement="top-start">
                <div class="dot-hidden pr8">{{item.label}}</div>
              </el-tooltip>
              <div v-if="item.success" class="absolute right-2 top-0 color-green">
                <i class="at icon-checkcircle"/>
              </div>
              <div class="absolute right-2 top-0 color-red" v-else>
                <i class="at icon-closecircle"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="fd-footer">
        <el-button size="small" type="primary" @click="projectCheckError = false">确定</el-button>
      </div>
    </fd-dialog>
    <fd-dialog
      title="错误报告"
      :syncVisible="finishCheckError"
      @beforeClose="finishCheckError = false"
    >
      <div slot="fd-body">
        <div>
          <div v-for="(data, series) of errorMsg"
               :key="series"
               class="mb1">
            <div class="relative h16 color-title bold">
              <div class="dot-hidden pr8">{{series}}</div>
              <div v-if="isAllSuccess(data)" class="absolute right-2 top-0 color-green">
                <i class="at icon-checkcircle"/>
              </div>
            </div>
            <div class="relative mt1" v-for="(item, index) of data" :key="index" v-show="!item.success">
              <el-tooltip class="item" effect="dark" :content="item.label" placement="top-start">
                <div class="dot-hidden pr8">{{item.label}}</div>
              </el-tooltip>
              <div v-if="item.success" class="absolute right-2 top-0 color-green">
                <i class="at icon-checkcircle"/>
              </div>
              <div class="absolute right-2 top-0 color-red" v-else>
                <i class="at icon-closecircle"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="fd-footer">
        <el-button size="small" type="primary" @click="finishCheckError = false">确定</el-button>
      </div>
    </fd-dialog>
  </div>
</template>

<script>
  import {
    refreshProjects,
    searchByKeyword,
    sizeChange,
    currentChange,
    getProjects,
    activeSchemas,
    cancelSchemas,
    checkFinish,
    finishSchemas,
    showSchemaDetail,
    deleteSchemas,
    editSchemas,
    addSchemas,
    copySchemas,
    checkSchemas
  } from '@/api/kpi/check/project'
  import FdNewCard from 'fd/newCard/FdCard'
  import FdPagination from 'fd/pagination/pagination'
  import FdNoContent from 'fd/noContent'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  export default {
    name: 'checkProject',
    components: { FdNoContent, FdNewCard, FdPagination, fdDialog },
    props: {},
    data() {
      return {
        keywords: '',
        limit: 10,
        offset: 0,
        total: 0,
        loading: null,
        effect: '1',
        schemas: [],
        options: {
          header: {
            left: [{
              type: 'text',
              field: 'name',
              class: 'h16 color-title color-link-hover pointer ml1',
              event: 'showDetail'
            }, {
              type: 'html',
              field: 'statusId',
              class: 'ml2',
              map: {
                '0': '<span class="status-map-0">草稿</span>',
                '1': '<span class="status-map-1">已生效</span>',
                '2': '<span class="status-map-2">已结束</span>',
                '3': '<span class="status-map-3">正在结束</span>',
                '4': '<span class="status-map-4">正在生效</span>'
              }
            }],
            right: [{
              type: 'button',
              child: [{
                text: '生效',
                show: 'effect',
                event: 'active'
              }, {
                text: '取消生效',
                show: 'inoperative',
                event: 'cancel'
              }, {
                text: '结束',
                show: 'end',
                event: 'finish'
              }, {
                text: '编辑',
                show: 'enable_edit',
                disable: 'edit',
                event: 'edit'
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
          eventNames: ['cancel', 'active', 'finish', 'copy', 'edit', 'delete', 'showDetail']
        },
        projectCheckError: false,
        finishCheckError: false,
        errorMsg: {}
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.checkProject || {}
      }
    },
    mounted() {
    },
    activated() {
      this.getProjects()
    },
    methods: {
      refreshProjects,
      searchByKeyword,
      sizeChange,
      currentChange,
      getProjects,
      activeSchemas,
      cancelSchemas,
      finishSchemas,
      deleteSchemas,
      checkFinish,
      showSchemaDetail,
      editSchemas,
      copySchemas,
      checkSchemas,
      addSchemas,
      isAllSuccess(data) {
        let flag = true
        for (const item of data) {
          if (!item.success) {
            flag = false
            break
          }
        }
        return flag
      }
    },
    watch: {}
  }
</script>

<style lang="scss">
  .app-container.checkProject{
    .status-map-0,
    .status-map-1,
    .status-map-2,
    .status-map-3,
    .status-map-4{
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
      background-color: rgba(255, 119, 51, 0.1);
      border: solid 1px #ff7733;
      color: #ff7733;
    }
    .status-map-4{
      background-color: rgba(34, 187, 238, 0.1);
      border: solid 1px #22bbee;
      color: #22bbee;
    }
  }
</style>
