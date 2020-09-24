<template>
  <div class="app-container">
    <div class="container-inner has-fixed-bottom bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class=" t-center bg-gray p2 mb2 bd-radius-3-4" v-show="isShow">
        <span class="color-title h18 bold">{{formData.name}}</span>
        <span :class="'bd status status-map-'+formData.isUse">
          {{statusName[formData.isUse]}}</span>
      </div>
      <el-form :rules="rules"
               :model="formData"
               size="small"
               label-position="top"
               v-if="!isShow"
               ref="detailForm">
        <el-form-item label="权重系数名称" prop="name">
          <el-row>
            <el-col :span="12">
              <el-input v-model="formData.name"
                         :readonly="isShow"
                         placeholder="请输入权重系数名称">
              </el-input>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div>
        <div class="tab-box">
          <el-tabs v-model="active" type="card">
            <el-tab-pane label="案件权重体系" name="case">
              <div v-show="active === 'case'">
                <fd-coe-case :isShow="isShow"
                             v-bind:name="formData.name"
                             v-bind:id="id"
                             v-bind:formData="formData"
                             v-bind:save="refresh"></fd-coe-case>
              </div>
            </el-tab-pane>
            <el-tab-pane label="办案角色权重" name="role">
              <div v-show="active === 'role'">
                <fd-coe-role :isShow="isShow"
                             v-bind:id="id"
                             v-bind:validate="validate"
                             v-bind:save="refresh"
                             v-bind:cancel="roleCancel"
                             v-on:validateBack="validateBack"></fd-coe-role>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        </div>
    </div>
    <div class="fixed-bottom">
      <div class="fixed-bottom-item" v-if="isShow" @click="goBack">
        <div class="fixed-bottom-item-text">返回</div>
      </div>
      <div class="fixed-bottom-item" v-show="!isShow" @click="cancelEdit">
        <div class="fixed-bottom-item-text">取消</div>
      </div>
      <div class="fixed-bottom-item" v-show="canEdit && isShow" @click = "detailEdit">
        <div class="fixed-bottom-item-text">编辑</div>
      </div>
      <div class="fixed-bottom-item" v-show="!(canEdit && isShow || id)" @click = "validateCoefficient">
        <div class="fixed-bottom-item-text">保存</div>
      </div>
      <div class="fixed-bottom-item" v-show="(canEdit && !isShow && id)" @click = "validateCoefficient">
        <div class="fixed-bottom-item-text">保存修改</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    cancelEdit,
    detailEdit,
    validateBack,
    getWeightDetail,
    validateCoefficient
  } from '@/api/kpi/check/coefficient'
  import { goBack, resetForm } from '@/api/common'
  import FdCoeRole from '../../components/coefficientRole'
  import FdCoeCase from '../../components/coefficientCase'
  export default {
    name: 'coefficientDetail',
    components: { FdCoeCase, FdCoeRole },
    props: {},
    data() {
      return {
        oldData: {},
        formData: {
          name: '',
          status: '',
          isUse: '',
          weightmodelId: ''
        },
        forbid: 1,
        rules: {
          name: [{ required: true, message: '请输入权重系数名称', trigger: 'blur' }]
        },
        active: 'case',
        isShow: false,
        roleCancel: false,
        // 进入页面的第一步不是查看，直接通过编辑进来
        firstShow: false,
        refresh: true,
        validate: true,
        statusName: {
          0: '未启用',
          1: '已启用',
          2: '启用中',
          3: '启用失败'
        },
        id: '',
        canEdit: false
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.weightCoefficient || {}
      }
    },
    mounted() {
    },
    activated() {
      this.id = this.$route.query.id
      const behavior = this.$route.params.behavior
      if (this.id) {
        this.getWeightDetail(this.id)
        if (behavior === 'show') {
          this.isShow = true
          this.firstShow = true
        } else if (behavior === undefined) { // 编辑页面f5刷新的时候默认为查看页面
          this.isShow = true
          this.firstShow = true
        }
      }
    },
    methods: {
      getWeightDetail,
      cancelEdit,
      detailEdit,
      validateBack,
      validateCoefficient,
      goBack,
      resetForm
    },
    watch: {}
  }
</script>

<style scoped>
  .bd.status{
    border-radius: 25px;
    margin-left: 8px;
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
    background-color: #fef0ef;
    border: solid 1px #F04134;
    color: #F04134;
  }
</style>
