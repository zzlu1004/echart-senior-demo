<template>
  <div class="app-container bg-white" :style="{'height': (this.$store.getters.globals.height - 100+'px')}">
    <div class="fd-title bd-bottom pb2 px2">个人设置</div>
    <el-row>
      <el-col class="py4" :span="12" :offset="6">
        <div class="pb2">
          <fd-cropper v-bind="{userId}"></fd-cropper>
        </div>
        <div class="color-title" v-show="!passwordFormVisible">
          <el-row>
            <el-col :span="4" :offset="7">
              <div class="title-user">用户密码</div>
            </el-col>
            <el-col :span="10">
              <el-button @click="editPassword" size="small">修改</el-button>
            </el-col>
          </el-row>
        </div>
        <div v-show="passwordFormVisible">
          <fd-password :reset="reset" ref="password" :userId="userId"></fd-password>
          <div class="py2 f-right">
            <el-button size="small" @click="passwordFormVisible = false">取消</el-button>
	          <el-button size="small" type="primary" @click="submit">确定</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import FdCropper from 'fd/cropper/cropper'
  import FdPassword from '../component/password'
  export default {
    name: 'FdSetting',
    components: { FdCropper, FdPassword },
    data() {
      return {
        passwordFormVisible: false,
        reset: true
      }
    },
    computed: {
      userId() {
        return this.$store.getters.user.id
      }
    },
    mounted() {
    },
    methods: {
      cancelPassword(formName) {
        this.passwordFormVisible = false
      },
      editPassword() {
        this.passwordFormVisible = true
        this.reset = !this.reset
      },
      submit() {
        this.$refs.password.submitPassword()
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.title-user{
  height: 32px;
  line-height: 32px;
}
</style>

