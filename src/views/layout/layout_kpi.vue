<template>
  <div class="app-wrapper">
    <!--上方显示一级菜单-->
    <nav-bar level="1"></nav-bar>
    <div class="main-container"
         id="main-container-scroll"
         :style="{'height': $store.getters.globals.height - 50 + 'px'}">
      <div :class="(sidebar.opened && sideMenu.length > 0 ? 'full' : 'half')">
        <div class="sidebar-left">
          <div class="f-left side-width hiddenX">
            <div class="route-item">
              <div class="scrollY" :style="{'height': $store.getters.globals.height - 100 + 'px'}">
                <side-bar-expand :menus="sideMenu" :parentCode="parentCode"></side-bar-expand>
              </div>
            </div>
           <!-- <side-bar :menus="sideMenu" :parentCode="parentCode"></side-bar>-->
          </div>
          <!--收起展开-->
          <div class="f-left toggle-width" v-show="sideMenu.length > 0" >
            <toggle></toggle>
          </div>
        </div>
        <div class="sidebar-right auto" :style="{'height': $store.getters.globals.height - 50 + 'px'}">
          <fd-breadcrumb></fd-breadcrumb>
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
  import Toggle from './components/Toggle'
  import { mapGetters } from 'vuex'
  import SideBarExpand from './components/SideBarExpand'
  export default {
    name: 'LayoutKpi',
    components: {
      SideBarExpand,
      Toggle,
      FdBreadcrumb,
      AppMain,
      NavBar
    },
    data() {
      return {}
    },
    methods: {
      onresize() {
        window.onresize = () => {
          this.$store.dispatch('WindowResize').then().catch()
        }
      },
      // 一级菜单选中发生变化，二级子菜单需要同步刷新
      getSideMenu(menu) {
        this.parentCode = '/' + menu.resourceCode
        this.sideMenu = menu.children
      }
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'menus'
      ]),
      parentCode() {
        return this.$route.path.match(/^\/[^\/]+/)[0]
      },
      sideMenu() {
        let sideMenu = []
        for (const item of this.menus) {
          if (this.parentCode === '/' + item.resourceCode) {
            sideMenu = item.children || []
            break
          }
        }
        return sideMenu
      }
    },
    mounted() {
      this.onresize()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  @import 'src/styles/variables.scss';
  .app-wrapper {
    @include clearfix;
    position: absolute;
    height: 100%;
    width: 100%;
    .main-container{
      top: 50px;
      margin-left: 0;
      position: absolute;
      width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      .sidebar-left{
        position: absolute;
        z-index: 100;
        height: 100%;
        overflow-y: auto;
      }
      .full .side-width{
        width: $sidebar-left-width;
      }
      .full .sidebar-right{
        margin-left: $sidebar-left-width;
      }
      .side-width{
        width: 0;
        height: 100%;
      }
      .toggle-width{
        width: 30px;
        height: 100%;
      }
      .sidebar-right{
        margin-left: 0;
      }
      .route-item{
        background-color: $menu-sidebar-bg;
        height: 100%;
        width: $sidebar-left-width + 20px;
        line-height: 32px;
        padding: 16px 0;
        color: $menu-sidebar-text-color;
        .selected{
          background-color: $menu-sidebar-item-select;
          color: $menu-sidebar-text-select;
        }
        .menu-page{
          cursor: pointer;
        }
        .menu-page:hover{
          background-color: $menu-sidebar-item-hover;
          color: $menu-sidebar-text-hover;
        }
      }
    }
  }
</style>
