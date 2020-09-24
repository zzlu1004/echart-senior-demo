<template>
  <el-carousel trigger="click"
               :height=option.height
               :initial-index = option.index
               :indicator-position = option.position
               :autoplay = option.autoplay
               :arrow = option.arrow
               :type = option.type
               @change = "setActiveItem">
    <el-carousel-item v-for="item of option.imgArray" :key="item.id">
      <h3>{{ item.img }}</h3>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
    export default {
      name: 'FdCarousel',
      props: {
        option: {
          type: Object,
          default: {
            height: '150px',
            index: 0,
            position: 'none',
            autoplay: false,
            interval: 3000,
            arrow: 'never',
            imgArray: []
          }
        }
      },
      data() {
        return {}
      },
      methods: {
        setActiveItem(name, label) {
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
