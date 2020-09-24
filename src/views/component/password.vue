<template>
  <div>
    <el-form :model="passwordForm" status-icon :rules="rules2" ref="passwordForm" label-width="35%" class="demo-ruleForm">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input type="password" v-model="passwordForm.oldPassword" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="passwordForm.newPassword" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input type="password" v-model="passwordForm.confirmPassword" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'FdPassword',
    components: {},
    props: {
      reset: Boolean,
      userId: {
        type: String
      },
      cancel: {}
    },
    data() {
      var validateOldPassword = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入旧密码'))
        } else if (value.length < 6 || value.length > 20) {
          callback(new Error('密码长度范围在6-20位'))
        } else {
          callback()
        }
      }
      var validateNewPassword = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入新密码'))
        } else if (value === this.passwordForm.oldPassword) {
          callback(new Error('输入的新密码不能与原始密码一致'))
        } else if (value.length < 6 || value.length > 20) {
          callback(new Error('密码长度范围在6-20位'))
        } else {
          if (this.passwordForm.confirmPassword !== '') {
            this.$refs.passwordForm.validateField('confirmPassword')
          }
          callback()
        }
      }
      var validateConfirmPassword = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else if (value.length < 6 || value.length > 20) {
          callback(new Error('密码长度范围在6-20位'))
        } else {
          callback()
        }
      }
      return {
        passwordForm: {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        },
        rules2: {
          oldPassword: [
            { validator: validateOldPassword, trigger: 'blur' }
          ],
          newPassword: [
            { validator: validateNewPassword, trigger: 'blur' }
          ],
          confirmPassword: [
            { validator: validateConfirmPassword, trigger: 'blur' }
          ]
        }
      }
    },
    computed: {},
    mounted() {
    },
    methods: {
      submitPassword(formName) {
        this.$refs.passwordForm.validate((valid) => {
          if (valid) {
            this.fd.req({
              method: 'put',
              url: 'api/users/' + this.userId + '/password',
              data: this.passwordForm
            }, 'uaa_url').then(response => {
              this.$message({
                type: 'success',
                message: '修改密码成功!'
              })
              this.$emit('cancel')
            }).catch(error => {
              console.log('submitPassword', error)
            })
          } else {
            return false
          }
        })
      }
    },
    watch: {
      reset() {
        this.passwordForm.oldPassword = ''
        this.passwordForm.newPassword = ''
        this.passwordForm.confirmPassword = ''
        this.$refs['passwordForm'].resetFields()
      }
    }
  }
</script>

<style scoped>
</style>
