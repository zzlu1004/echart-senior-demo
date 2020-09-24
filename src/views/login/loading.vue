<template>
  <div class="login-bg relative">
    <div class="absolute position-center">
      <div class="logo-page"></div>
      <div class="name-panel mt6 mb4 bold">
        法院绩效管理平台
      </div>
      <div class="f-name-panel h36">
        正在初始化菜单和资源...
      </div>
    </div>
  </div>
</template>

<script>
  // import {} from ''
  export default {
    name: '',
    components: {},
    props: {},
    data() {
      return {
        height: window.innerHeight,
        activeProject: window.config.systemKey
      }
    },
    computed: {
    },
    mounted() {
      const tokenId = this.$route.query.tokenId
      const from = this.$route.query.from || ''
      const loginName = this.$route.query.loginName || ''
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
            this.$router.push({ path: window.config.cubeUrl, query: params })
          }).catch(() => {
            this.$router.push({ path: '/' })
          })
        } else {
          this.$store.dispatch('LoginByTokenId', tokenId).then(() => {
            window.config.systemKey = this.activeProject
            this.$router.push({ path: '/' })
          }).catch(() => {
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
              this.$router.push({ path: window.config.oldCubeUrlAssist, query: { id: id, type: type, from: from,
                params: JSON.stringify(obj) }})
            } else {
              this.$router.push({ path: window.config.oldCubeUrl, query: { id: id, type: type, from: from,
                params: JSON.stringify(obj) }})
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
    },
    watch: {
    }
  }
</script>

<style lang="scss">
  .login-bg{
    width: 100%;
    height: 100vh;
    background: url(../../assets/loading-bg.svg) center no-repeat;
    background-size: cover;
  }
  .position-center{
    text-align: center;
    top: 50%;
    left: 50%;
    margin-left: -224px;
    margin-top: -155px;
  }
  .logo-page{
    width: 128px;
    height: 128px;
    background: url(../../assets/fy-logo.svg) center no-repeat;
    background-size:100% 100%; 
    margin: 0 auto;
  }
  .name-panel{
    font-size: 56px;
    color: #fff;
  }
  .f-name-panel{
    color: #fff;
  }
</style>
