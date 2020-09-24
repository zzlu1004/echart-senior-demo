<template>
  <div class="coeffcient-role">
    <el-form :model="formData"
             label-position="left"
             ref="roleForm">
      <el-row :gutter="20">
        <el-col v-for="(item, index) of formData.courts"
                :key="index"
                :span="6">
          <div class="courtItem bd bg-white auto">
            <div class="t-center bg color-title h16 py2 bd-bottom bold">{{item.label}}</div>
            <div class="role-item pb3 pt1 px3">
              <div v-for="(child, num) of item.form" :key="num" class="pt2">
                <div style="height: 40px" v-if="child.type == '1'">
                  <span class="f-left line-height-normal bold" v-if="isShow">{{child.label}}: </span>
                  <span class="f-left line-height-normal" v-if="isShow">{{fd.data.fixedFloat(child.value, 0, 9999.99, 2)}}{{child.unit}}</span>
                  <div v-else>
                    <el-form-item :label="child.label+':'"
                                  label-width="98px"
                                  :class="child.label.length <=5 ? '': 'lang-label'"
                                  :rules="{
                                    required: true, message: '值不能为空', trigger: 'blur'
                                  }"
                                  :prop="'courts.'+index+'.form.' + num + '.value'">
                      <el-input v-model="child.value"
                                @change="validateValue(child)"
                                size="small"
                                placeholder="">
                        <template slot="append">%</template></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div v-else :class="(child.label === '承办人不是审判长' ? 'mt2': 'mt1')">
                  <span class="bold" :class="((child.label === '承办人' ||  child.label === '承办人（兼审判长）')? 'h14': 'color-title h16 title-pl')">
                    {{child.label}}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import {
    getRoles,
    editCoefficientRole,
    validateCoefficientRole
  } from '@/api/kpi/check/coefficient'
  export default {
    name: 'FdCoeRole',
    components: {},
    props: {
      isShow: {
        type: Boolean,
        default: true
      },
      id: {
        type: String,
        default: ''
      },
      save: {
        type: Boolean,
        default: true
      },
      cancel: {
        type: Boolean,
        default: true
      },
      validate: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        formData: {
          init_courts: [],
          courts: [
            {
              'id': '1',
              'label': '独任合议庭',
              'form': [
                {
                  'id': '101',
                  'label': '承办人',
                  'type': '1',
                  'value': '100'
                }
              ]
            },
            {
              'id': '2',
              'label': '三人合议庭',
              'form': [
                {
                  'id': '201',
                  'label': '承办人是审判长',
                  'type': '0',
                  'value': null
                },
                {
                  'id': '20101',
                  'label': '承办人（兼审判长）',
                  'type': '1',
                  'value': '80'
                },
                {
                  'id': '20102',
                  'label': '二名合议庭成员各为',
                  'type': '1',
                  'value': '10'
                },
                {
                  'id': '202',
                  'label': '承办人不是审判长',
                  'type': '0',
                  'value': null
                },
                {
                  'id': '20201',
                  'label': '承办人',
                  'type': '1',
                  'value': '70'
                },
                {
                  'id': '20202',
                  'label': '审判长',
                  'type': '1',
                  'value': '20'
                },
                {
                  'id': '20203',
                  'label': '合议庭成员',
                  'type': '1',
                  'value': '10'
                }
              ]
            },
            {
              'id': '3',
              'label': '五人合议庭',
              'form': [
                {
                  'id': '301',
                  'label': '承办人是审判长',
                  'type': '0',
                  'value': null
                },
                {
                  'id': '30101',
                  'label': '承办人（兼审判长）',
                  'type': '1',
                  'value': '80'
                },
                {
                  'id': '30102',
                  'label': '四名合议庭成员各为',
                  'type': '1',
                  'value': '10'
                },
                {
                  'id': '302',
                  'label': '承办人不是审判长',
                  'type': '0',
                  'value': null
                },
                {
                  'id': '30201',
                  'label': '承办人',
                  'type': '1',
                  'value': '70'
                },
                {
                  'id': '30202',
                  'label': '审判长',
                  'type': '1',
                  'value': '20'
                },
                {
                  'id': '30203',
                  'label': '合议庭成员',
                  'type': '1',
                  'value': '10'
                }
              ]
            },
            {
              'id': '4',
              'label': '七人合议庭',
              'form': [
                {
                  'id': '401',
                  'label': '承办人是审判长',
                  'type': '0',
                  'value': ''
                },
                {
                  'id': '40101',
                  'label': '承办人（兼审判长）',
                  'type': '1',
                  'value': '80'
                },
                { 'id': '40102',
                  'label': '六名合议庭成员各为',
                  'type': '1',
                  'value': '10'
                },
                {
                  'id': '402',
                  'label': '承办人不是审判长',
                  'type': '0',
                  'value': null
                },
                {
                  'id': '40201',
                  'label': '承办人',
                  'type': '1',
                  'value': '70'
                },
                {
                  'id': '40202',
                  'label': '审判长',
                  'type': '1',
                  'value': '20'
                },
                {
                  'id': '40203',
                  'label': '合议庭成员',
                  'type': '1',
                  'value': '10'
                }
              ]
            }
          ]
        }
      }
    },
    computed: {},
    mounted() {
      if (this.id) {
        this.getRoles(this.id)
      }
    },
    methods: {
      getRoles,
      validateValue(obj) {
        let value = obj.value
        value = value.replace(/[^\-\d\.]/g, '')
        value = this.fd.data.fixedFloat(value, 0, 9999.99, 2)
        obj.value = value
      },
      editCoefficientRole,
      validateCoefficientRole
    },
    watch: {
      save(data) {
        this.editCoefficientRole()
      },
      cancel(data) {
        this.formData.courts = JSON.parse(JSON.stringify(this.formData.init_courts))
      },
      validate(data) {
        this.validateCoefficientRole()
      },
      id() {
        this.getRoles(this.id)
      }
    }
  }
</script>

<style lang="scss">
  .coeffcient-role{
    .courtItem{
      height: 655px;
    }
    .line-height-normal{
      line-height: 40px;
    }
    .title-pl{
      margin-left: -8px;
    }
    .lang-label .el-form-item__label{
      line-height: 20px;
    }
  }
</style>
