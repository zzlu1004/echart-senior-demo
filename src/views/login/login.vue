<template>
  <div class="login-container">
    <div class = "login-bg-container">
      <el-carousel :interval="10000" indicator-position="none" arrow="never" @change = "carouselChange">
        <el-carousel-item class="login-bg" :style="{'backgroundImage':('url('+carousel_0.src+')')}">
        </el-carousel-item>
        <el-carousel-item class="login-bg" :style="{'backgroundImage':('url('+carousel_1.src+')')}">
        </el-carousel-item>
      </el-carousel>
      <div class = "description">
        <svg-icon icon-class="component"/>
        <span class="pl1">{{config.loginName}}</span>
      </div>
    </div>
    <div class = "login-form-container">
      <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px"
               class="card-box login-form">
        <h3 class = "title my1">登录</h3>
        <p class = "mb4" >
          您的
          <el-popover
          ref="popover"
          placement="bottom-start"
          v-model="showProject">
          <div class="py1">
            <div v-for="(one, key) of projects" :key="key" class="px3 py1 pointer color-link" @click="loginProject(key)">{{one.name}}</div>
          </div>
        </el-popover>
          <span class="pl1 fd-name pointer" v-popover:popover>{{projectName}}</span>
        </p>
        <el-form-item prop="username">
          <el-input name="username" type="text" v-model="loginForm.username" autoComplete="off" placeholder="用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="off"
                    placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="!loginEd" class="p1" type="primary" style="width:100%;border-radius: 0" :loading="loading" @click.native.prevent="handleLogin">
            登录
          </el-button>
          <el-button v-else type="primary" class="p1" style="width:100%;border-radius: 0" :loading="loading" @click.native.prevent="loginIn">
            进入系统
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <footer class="fd-login_footer">
      <div class="fd-login_information">
        <div class="fd-login_link">
          <span>系统状态</span>
          <span @click="showPhone">联系我们</span>
          <span><a :href="config.website" target="_blank">关于我们</a></span>
          <span>Copyright © 2015-2018</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
  import bg_0 from '@/assets/login/login_bg_0.jpg'
  import bg_1 from '@/assets/login/login_bg_1.jpg'
  import bg_2 from '@/assets/login/login_bg_2.jpg'
  import bg_3 from '@/assets/login/login_bg_3.jpg'
  import bg_4 from '@/assets/login/login_bg_4.jpg'
  import bg_5 from '@/assets/login/login_bg_5.jpg'
  import bg_6 from '@/assets/login/login_bg_6.jpg'
  import bg_7 from '@/assets/login/login_bg_7.jpg'
  import bg_8 from '@/assets/login/login_bg_8.jpg'
  import bg_9 from '@/assets/login/login_bg_9.jpg'
  import bg_10 from '@/assets/login/login_bg_10.jpg'
  import bg_11 from '@/assets/login/login_bg_11.jpg'
  import bg_12 from '@/assets/login/login_bg_12.jpg'
  import bg_13 from '@/assets/login/login_bg_13.jpg'
  export default {
    name: 'login',
    data() {
      return {
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
        },
        loading: false,
        loginEd: false,
        bgs: [{ src: bg_0, name: '《淡舞银妆》', auth: '韩效军', court: '太和法院' },
          { src: bg_1, name: '《清风》', auth: '陈明文', court: '铜陵中院' },
          { src: bg_2, name: '《天伦之乐》', auth: '陈明文', court: '铜陵中院' },
          { src: bg_3, name: '《图瓦村的早晨》', auth: '唐维克', court: '合肥中院' },
          { src: bg_4, name: '《巡回法庭进农家》', auth: '陶成', court: '五河法院' },
          { src: bg_5, name: '《希望》', auth: '王龙江', court: '蚌埠中院' },
          { src: bg_6, name: '《洗罐子》', auth: '刘崇凌', court: '宣州区法院' },
          { src: bg_7, name: '《巡回法庭的午餐》', auth: '陈霞', court: '宣州区人民法院' },
          { src: bg_8, name: '《巡回法庭——审理一案教育一片》', auth: '马万强', court: '阜南法院' },
          { src: bg_9, name: '《阳光下的茁壮》', auth: '钱雪梅', court: '蚌埠中院' },
          { src: bg_10, name: '《窑厂姐妹》', auth: '胡莉莉', court: '宣州区法院' },
          { src: bg_11, name: '《落日鎏金》', auth: '田坤', court: '颍上法院' },
          { src: bg_12, name: '《月映徽乡》', auth: '方华', court: '花山法院' },
          { src: bg_13, name: '《转场途中》', auth: '张润平', court: '宣州区法院' }],
        carousel_0: {},
        carousel_1: {},
        showProject: false,
        activeProject: window.config.systemKey,
        config: window.config,
        projectName: window.config.loginName,
        projects: window.config.projects
      }
    },
    mounted() {
      const index = Math.floor(Math.random() * (this.bgs.length - 2))
      this.carousel_0 = this.bgs[index]
      this.carousel_1 = this.bgs[index + 1]
      const tokenId = this.$route.query.tokenId
      const loginName = this.$route.query.loginName || ''
      const from = this.$route.query.from || ''
      if (tokenId) {
        if (from) {
          this.$store.dispatch('LoginByCude', tokenId).then(() => {
            window.config.systemKey = this.activeProject
            const params = {
              from: from,
              startTime: this.$route.query.startTime,
              endTime: this.$route.query.endTime,
              type: this.$route.query.type
            }
            this.loading = false
            this.$router.push({ path: window.config.cubeUrl, query: params })
          }).catch(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          })
        } else {
          this.$store.dispatch('LoginByTokenId', tokenId).then(() => {
            window.config.systemKey = this.activeProject
            this.loading = false
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          })
        }
      } else {
        // 数魔方2.0对接用loginName转换获取tokenId
        if (loginName) {
          this.$store.dispatch('LoginByLoginName', loginName).then(() => {
            window.config.systemKey = this.activeProject
            const type = this.$route.query.type
            const id = this.$route.query.id
            this.loading = false
            const selfMsg = { departName: this.$route.query.name, index: this.$route.query.label, label: this.$route.query.label, value: this.$route.query.value }
            const obj = {
              params: {
                weightId: '',
                startTime: this.$route.query.startTime,
                endTime: this.$route.query.endTime
              },
              selfMsg: selfMsg
            }
            if (obj.params.type === 'assistant' || obj.params.type === 'clerk') {
              this.$router.push({ path: window.config.oldCubeUrlAssist, query: { id: id, type: type, params: obj.params }})
            } else {
              this.$router.push({ path: window.config.oldCubeUrl, query: { id: id, type: type, params: obj.params }})
            }
          }).catch(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          })
        } else {
          this.$router.push({ path: '/login' })
        }
      }
    },
    methods: {
      loginProject(key) {
        this.projectName = this.projects[key].name
        this.activeProject = key
        this.showProject = false
      },
      carouselChange(active, prev) {
        if (prev > -1) {
          this.getCarousel(active, prev)
        }
      },
      getCarousel(active, prev) {
        this['carousel_' + prev] = this.bgs[Math.floor(Math.random() * (this.bgs.length - 1))]
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
              window.config.systemKey = this.activeProject
              this.loading = false
              this.$router.push({ path: '/' })
            }).catch(() => {
              this.loading = false
              this.$router.push({ path: '/' })
            })
          } else {
            return false
          }
        })
      },
      loginIn() {
        this.$router.push({ path: '/' })
      },
      showPhone() {
        const phone = window.config.phone
        this.$alert(phone, '', {
          confirmButtonText: '确定'
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/mixin.scss";
  $bg:#fff;
  $border_normal:#889aa4;
  $border_error:red;
  $color:#fff;
  $link: #1b95e7;
  .login-container {
    @include relative;
    height: 100vh;
    min-width: 1280px;
    background-color: $bg;
    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
      -webkit-text-fill-color: $bg !important;
    }
    .login-bg{
      background: url(../../assets/login/login_bg.jpg) center no-repeat;
      background-size: cover;
    }
    input {
      border: 0;
      border-radius:0;
      border-bottom: 1px solid $border_normal;
      line-height: 30px;
    }
    .el-input__inner {
      padding: 0;
    }
    .title {
      font-size: 20px;
    }
    .login-bg-container{
      height: 100%;
      padding-right: 35%;
      .description{
        position: absolute;
        top: 35%;
        left: 80px;
        color: $color;
        font-size: 40px;
        z-index: 100;
      }
    }
    .login-form-container {
      position: absolute;
      top: 15%;
      right: 0;
      width: 35%;
      padding: 0 100px;
    }
    .login-form{
      .fd-name{
        color: $link;
      }
    }
    .el-carousel,
    .el-carousel__container{
      height: 100%;
    }
    .el-carousel__item div{
      line-height: 40px;
      position: absolute;
      bottom: 0;
      width: 100%;
      text-align: right;
      padding-right: 2rem;
      background-color: rgba(00,00,00,0.5);
      color: $color;
    }
    .fd-login_footer {
      font-size: 12px;
      font-weight: 300;
      position: absolute;
      bottom: 14px;
      right: 0;
      width: 35%;
      padding: 0 80px;
    }
    
    .fd-login_footer span{
      cursor: pointer;
    }
    
    .fd-login_footer span:hover {
      color: #1b95e7;
    }
    
    .fd-login_footer p {
      text-align: center;
    }
    .fd-login_link {
      display: flex;
      justify-content: space-around;
    }
  }
</style>
