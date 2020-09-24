<template>
  <div class="app-wrapper">
    <nav-bar level="0"></nav-bar>
    <div class="main-container"
         id="main-container-scroll"
         :style="{'height': $store.getters.globals.height - 50 + 'px'}">
      <div :class="(sidebar.opened ? 'full' : 'half')">
        <div class="sidebar-left">
          <div class="f-left side-width hiddenX">
            <div class="route-item h14">
              <div class="scrollY" :style="{'height': $store.getters.globals.height - 100 + 'px'}">
                <div v-for="(item, index) of menus"  :key="index">
                  <el-popover
                    placement="right-start"
                    width="200"
                    v-if="item.resourceType === 'page'"
                    popper-class="p0 bd-none"
                    :disabled="sidebar.opened"
                    :visible-arrow=false
                    trigger="hover">
                      <router-link
                        :to="{ name: item.resourceCode }">
                        <div class="child-menu">
                          <span class="dot-hidden menu-name">{{getTitle(item)}}</span>
                        </div>
                      </router-link>
                    <div slot="reference">
                      <div class="menu-page">
                        <router-link
                          :to="{ name: item.resourceCode }">
                          <i :class="item.iconClass || 'at icon-wallet'"></i>
                          <span class="dot-hidden menu-name">{{getTitle(item)}}</span>
                         </router-link>
                      </div>
                    </div>
                  </el-popover>
                  <div v-else>
                    <el-popover
                      :disabled="sidebar.opened"
                      placement="right-start"
                      width="200"
                      popper-class="p0 bd-none"
                      :visible-arrow=false
                      trigger="hover">
                      <div>
                        <fd-popper-menu :children="item.children" :path="('/' + item.resourceCode)"></fd-popper-menu>
                      </div>
                      <div slot="reference">
                        <div class="main-menu pointer" @click="expandChild(item)">
                          <i class="mr1" :class="item.iconClass || 'at icon-wallet'"></i>
                          <span class="dot-hidden menu-name">{{getTitle(item)}}</span>
                          <i class="at f-right" :class="expands[item.resourceCode] ? 'icon-right':'icon-down'"></i>
                        </div>
                      </div>
                    </el-popover>
                    <el-collapse-transition>
                      <div class="second-menu" v-show="!expands[item.resourceCode]">
                        <div>{{item.collapse}}</div>
                        <side-bar-expand :menus="item.children" :parentCode="('/' + item.resourceCode )"></side-bar-expand>
                      </div>
                    </el-collapse-transition>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--收起展开-->
          <div class="f-left toggle-width">
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
  import { mapGetters } from 'vuex'
  import FdBreadcrumb from 'fd/FdBreadcrumb'
  import Toggle from './components/Toggle'
  import SideBarExpand from './components/SideBarExpand'
  import FdPopperMenu from './components/PopperMenu'
  export default {
    name: 'LayoutV',
    mixins: [],
    components: { NavBar, SideBarExpand, AppMain, FdBreadcrumb, Toggle, FdPopperMenu },
    data() {
      return {
        expands: {}
      }
    },
    props: {},
    watch: {},
    hooks() {},
    methods: {
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      onresize() {
        window.onresize = () => {
          this.$store.dispatch('WindowResize').then().catch()
        }
      },
      // 获取目录选中情况
      getSelected(item, parentPath = '') {
        const routePath = this.$route.path
        const path = parentPath + '/' + item.resourceCode
        // 正好就是该页面或者是子页面表示被选中
        if (routePath === path || routePath.startsWith(path + '/')) {
          return 'selected'
        }
        return ''
      },
      // 获取菜单名称
      getTitle(item) {
        return item.resourceName
      },
      expandChild(item) {
        console.log('expandChild', this.expands[item.resourceCode])
        this.$set(this.expands, item.resourceCode, !this.expands[item.resourceCode])
      }
    },
    computed: {
      ...mapGetters([
        'menus',
        'sidebar'
      ])
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
        .route-item{
          height: 100%;
          width: $sidebar-left-width + 20px;
          line-height: 32px;
          padding: 24px 0;
          background-color: $menu-sidebar-bg;
          color: $menu-text-color;
          a{
            display: inline-block;
            padding: 0 16px 0 24px;
            width: 100%;
            line-height: 48px;
            i{
              margin-right: 8px;
            }
          }
          .selected{
            background-color: $menu-sidebar-item-select;
            color: $menu-text-select;
          }
          .menu-page{
            cursor: pointer;
          }
          .menu-page:hover{
            background-color: $menu-sidebar-item-hover;
            color: $menu-text-hover;
          }
        }
      }
      .toggle:hover{
        .toggle-btn{
          display: inline-block;
        }
      }
      .toggle-width{
        width: 30px;
        height: 100%;
      }
      .toggle{
        position: absolute;
        top: 0;
        width: 30px;
        height: 100%;
        display: flex;
        font-size: 24px;
        cursor: pointer;
        align-items: center;
        .toggle-btn{
          display: none;
          width: 30px;
          height: 70px;
          padding: 23px 3px;
          background-color: $toggle-bg;
          color: $toggle-text;
        }
      }
      .sidebar-right{
        margin-left: $sidebar-left-width;
      }
      .main-menu{
        padding: 0 16px 0 24px;
        line-height: 48px;
      }
      .main-menu:hover{
        background-color: $menu-sidebar-item-hover;
        color: $menu-text-color;
      }
    }
    .half {
      .menu-name, .second-menu, .main-menu .icon-right, .main-menu .icon-down{
        display: none;
      }
      .toggle{
        left: 50px;
        .toggle-btn{
          display: inline-block;
        }
      }
      .side-width{
        width: 50px;
        .route-item{
          width: 70px;
        }
        height: 100%;
      }
      .sidebar-right{
        margin-left: 50px;
      }
      .route-item a, .main-menu{
        padding-left: 16px !important;
      }
    }
    .full {
      .menu-name, .main-menu .icon-right{
        display: initial;
      }
      .second-menu{
        display: block;
      }
      .toggle{
        left: $sidebar-left-width;
      }
      .side-width{
        width: $sidebar-left-width;
        .route-item{
          width: $sidebar-left-width + 20px;
        }
        height: 100%;
      }
      .sidebar-right{
        margin-left: $sidebar-left-width;
      }
    }
  }
  .child-menu{
    height: 40px;
    line-height: 40px;
    padding: 0 16px;
    background-color: $menu-top-bg;
    color: $menu-text-color;
  }
  .child-menu:hover{
    background-color: $menu-top-hover;
    color: $menu-text-hover;
  }
  .child-menu.selected{
    background-color: $menu-top-item-select;
    color: $menu-text-select;
  }
</style>
