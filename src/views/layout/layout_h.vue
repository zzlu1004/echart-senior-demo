<template>
  <div class="app-wrapper">
    <div>
      <div class="head-bg">
        <div class="panel-h">
          <nav-bar level="all"></nav-bar>
        </div>
      </div>
      <div class="main-container only-top-menu"
           id="main-container-scroll"
           :style="{'height': $store.getters.globals.height - 80 + 'px'}">
        <fd-breadcrumb></fd-breadcrumb>
        <div class="panel-h">
          <app-main></app-main>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import NavBar from './components/NavBar'
  import AppMain from './components/AppMain'
  import FdBreadcrumb from 'fd/FdBreadcrumb'
  export default {
    name: 'LayoutH',
    mixins: [],
    components: { AppMain, NavBar, FdBreadcrumb },
    data() {
      return {}
    },
    props: {},
    watch: {},
    hooks() {},
    methods: {
      onresize() {
        window.onresize = () => {
          this.$store.dispatch('WindowResize').then().catch()
        }
      }
    },
    computed: {},
    mounted() {
      this.onresize()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  @import 'src/styles/variables.scss';
  $menu-width: 1366px;
  .app-wrapper {
    @include clearfix;
    position: absolute;
    height: 100%;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    .head-bg{
      height: 50px;
      background-color: $menu-top-bg;
      color: $menu-text-color;
      position: relative;
      z-index: 10000000;
    }
    .panel-min-width {
      width: $menu-width;
    }
    .panel-h {
      width: $menu-width;
      margin: 0 auto;
    }
    .main-container{
      top: 50px;
      margin-left: 0;
      position: absolute;
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      min-width: $menu-width;
    }
  }
</style>
