<template>
  <div :style="{'backgroundColor':'#f0f2f5',
                'height': (this.$store.getters.globals.height+'px')}">
    <div class="wscn-http404">
      <div class="pic-404">
        <img :src="img_404" alt="404">
      </div>
      <div class="pic-404" style="width: 580px">
        <div class="h40 pb8 pt8 mt4">抱歉，您访问的页面不存在，或您没有权限访问该页面。请联系运维人员</div>
        <div class="btn btn-primary" @click="gotoHome">返回首页</div>
      </div>
    </div>
  </div>
</template>

<script>
import img_404 from '@/assets/404_images/404.png'

export default {
  name: 'page404',
  data() {
    return {
      img_404
    }
  },
  computed: {
    message() {
      return ''
    }
  },
  methods: {
    gotoHome() {
      this.$router.push({ name: 'home' })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.wscn-http404 {
  position: relative;
  width: 1200px;
  margin: 0 auto;
  padding: 0;
  overflow: hidden;
  .pic-404 {
    position: relative;
    float: left;
    width: 620px;
    padding: 42% 0 0;
    margin-top: -300px;
    overflow: hidden;
    .img{
      width: 100%;
      height: 100%;
    }
  }
}
</style>
