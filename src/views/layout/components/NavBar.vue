<template>
  <div class="navbar relative">
    <div class="projectName h18" ref="projectName">
      <i class="fd-icon icon-logo h18"></i>
      <span>{{$store.getters.config.projectName}}</span>
    </div>
    <!--level === 0 说明顶部菜单没有内容-->
    <div class="menu-list h14" :style="{ paddingLeft: projectWidth + 'px' }">
      <div ref="menuList" v-if="level !== '0'" class="full f-left">
        <div
          v-for="(item, index) of showMenu"
          :key="index"
          :class="getSelected(item)"
          class="menu-list-item">
          <!--顶部只显示一级菜单-->
          <div v-if="level === '1'">
            <router-link
              :to="{ path: getPath(item) }"  v-if="getTitle(item) !== '帮助中心'">
              <i :class="item.iconClass ? (item.iconClass + ' mr1') : ''"></i><span>{{getTitle(item)}}</span>
            </router-link>
          </div>
          <!--菜单都在顶部显示，二级以上的移上去悬浮-->
          <div class="relative" v-else>
            <router-link
              v-if="item.resourceType === 'page'"
              :to="{ path: getPath(item) }">
              <i :class="item.iconClass ? (item.iconClass + ' mr1') : ''"></i>
              <span>{{getTitle(item)}}</span>
            </router-link>
            <!--目录，有二级菜单-->
            <div class="menu-list-first" v-else>
              <el-popover
                :disabled="!item.children"
                placement="bottom-start"
                width="200"
                popper-class="p0 bd-none"
                :visible-arrow=false
                trigger="hover">
                <div>
                  <fd-popper-menu :children="item.children" :path="('/' + item.resourceCode)"></fd-popper-menu>
                </div>
                <div slot="reference">
                  <router-link
                    :to="{ path: getPath(item) }">
                    <i :class="item.iconClass ? (item.iconClass + ' mr1') : ''"></i><span>{{getTitle(item)}}</span>
                  </router-link>
                </div>
              </el-popover>
            </div>
          </div>
        </div>
        <div class="menu-list-item" v-if="moreMenu.length > 0">
          <el-popover
            placement="bottom-start"
            popper-class="p0 bd-none"
            :visible-arrow=false
            trigger="hover">
            <div class="popper-menu">
              <div v-for="(item, index) of moreMenu" :key="index">
                <!--只显示一级-->
                <router-link
                  v-if="level === '1'"
                  :to="{ path: getPath(item) }" >
                  <div :class="getSelected(item)" class="child-menu" v-if="getTitle(item) !== '帮助中心'">
                    <i :class="item.iconClass ? (item.iconClass + ' mr1') : ''"></i><span>{{getTitle(item)}}</span>
                  </div>
                </router-link>
                <div v-else>
                  <router-link
                    v-if="item.resourceType === 'page'"
                    :to="{ name: item.resourceCode }">
                    <div class="child-menu" :class="getSelected(item)">
                      <i :class="item.iconClass ? (item.iconClass + ' mr1') : ''"></i>
                      <span>{{getTitle(item)}}</span>
                    </div>
                  </router-link>
                  <div v-else>
                    <div class="relative more-menu-panel">
                      <div class="child-menu" :class="getSelected(item)">
                        <i :class="item.iconClass ? (item.iconClass + ' mr1') : ''"></i>
                        <span>{{getTitle(item)}}</span>
                      </div>
                      <div class="leaf-menu" style="left: 200px;width: 200px">
                        <fd-popper-menu :children="item.children" :path="('/' + item.resourceCode)"></fd-popper-menu>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div slot="reference">
              <div class="main-menu px2 inline-block pointer">
                <i class="at icon-bars "></i>
              </div>
            </div>
          </el-popover>
        </div>
      </div>
    </div>
    <div class="avatar-container">
      <div class="f-right">
        <div class="f-left mr2"></div>
        <!--头像点击下拉-->
        <el-dropdown class="f-left" trigger="click">
          <div class="avatar-wrapper">
            <span class="inline-block user-avatar">
              <img :src="photo" alt=""/>
            </span>
            <span class="user-name">{{user.userName}}</span>
          </div>
          <el-dropdown-menu class="user-dropdown" slot="dropdown">
            <el-dropdown-item v-if="!$store.getters.globals.IE9  && this.showHelpFlag">
              <span style="display:block;" @click="goHelp">帮助中心</span>
            </el-dropdown-item>
           <!-- <el-dropdown-item v-if="!$store.getters.globals.IE9">
              <router-link
                :to="{ path: '/personal/help' }">
                <span style="display:block;">帮助中心</span>
              </router-link>
            </el-dropdown-item>-->
            <el-dropdown-item>
              <span @click="editPassword('passwordForm')" style="display:block;">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item v-if="!$store.getters.globals.IE9">
              <router-link
                :to="{ path: '/personal/setting' }">
                <span style="display:block;">设置</span>
              </router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <span @click="logout" style="display:block;">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <fd-dialog
      title="修改密码"
      :syncVisible="passwordFormVisible"
      @beforeClose="cancelPassword"
    >
      <div slot="fd-body">
        <el-row>
          <el-col :span="20">
            <fd-password ref="password" :reset="reset" :userId="userId"  v-on:cancel="cancelPassword"></fd-password>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
      </div>
      <div slot="fd-footer">
        <el-button size="small" @click="cancelPassword">取消</el-button>
        <el-button size="small" type="primary" @click="submit">确定</el-button>
      </div>
    </fd-dialog>
  </div>
</template>

<script>
  import head from '@/assets/userPhoto.svg'
  import FdPassword from '@/views/component/password'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  import { mapGetters } from 'vuex'
  import FdPopperMenu from './PopperMenu'
  import { removeToken } from '@/utils/auth'
  export default {
    name: 'NavBar',
    mixins: [],
    components: { FdPopperMenu, FdPassword, fdDialog },
    data() {
      return {
        photo: this.$store.getters.user.userPhoto || head,
        passwordFormVisible: false,
        reset: true,
        projectWidth: 224,
        moreMenu: [],
        showMenu: [],
        showHelpFlag: false
      }
    },
    props: {
      level: String // 1: 顶部只展示一级菜单，all: 所有菜单在顶部显示 0: 不展示顶部菜单栏
    },
    watch: {
      '$store.getters.user.userPhoto'(to) {
        this.photo = to
      },
      '$store.getters.size'() {
        this.showMoreMenu()
      }
    },
    hooks() {},
    computed: {
      ...mapGetters([
        'menus'
      ]),
      user() {
        return this.$store.getters.user
      },
      userId() {
        return this.$store.getters.user.id
      }
    },
    mounted() {
      this.showMenu = [...this.menus]
      this.$nextTick(() => {
        this.projectWidth = this.$refs.projectName.clientWidth
        this.showMoreMenu()
      })
      this.showHelpButton()
      this.init()
    },
    activated() {
      this.init()
    },
    methods: {
      init() {
      },
      goHelp() {
        this.$router.push({ name: 'help' })
      },
      showHelpButton() {
        for (const item of this.showMenu) {
          if (item.resourceName === '帮助中心') {
            this.showHelpFlag = true
          }
        }
      },
      showMoreMenu() {
        // 当浏览器大小变化的时候展示的数量需要相应变化
        const menuList = this.$refs.menuList
        if (menuList) {
          this.showMenu = [...this.menus]
          this.moreMenu = []
          this.$nextTick(() => {
            const child = menuList.childNodes
            let index = 0
            for (const item of child) {
              if (item.offsetTop === 0) {
                index++
              } else if (item.offsetTop > 0) {
                this.showMenu = this.menus.slice(0, index - 1)
                this.moreMenu = this.menus.slice(index - 1)
                break
              }
            }
          })
        }
      },
      submit() {
        this.$refs.password.submitPassword()
      },
      logout() {
        removeToken()
        this.$router.push({ path: '/login' })
        location.reload()
      },
      editPassword() {
        this.passwordFormVisible = true
        this.reset = !this.reset
      },
      cancelPassword() {
        this.passwordFormVisible = false
      },
      getPath(item, path = '/') {
        if (item.children && item.children.length > 0) {
          return this.getPath(item.children[0], path + item.resourceCode + '/')
        } else {
          return path + item.resourceCode
        }
      },
      // 获取目录选中情况
      getSelected(item) {
        const routePath = this.$route.path
        const path = '/' + item.resourceCode
        // 正好就是该页面或者是子页面表示被选中
        if (routePath === path || routePath.startsWith(path + '/')) {
          return 'selected'
        }
        return ''
      },
      // 获取菜单名称
      getTitle(item) {
        return item.resourceName
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "~@/styles/el-variables.scss";
  .navbar {
    height: 50px;
    line-height: 50px;
    background-color: $menu-top-bg;
    border-radius: 0px !important;
    .projectName{
      height: 50px;
      min-width: $sidebar-left-width;
      color: $menu-text-color;
      padding: 0 24px;
      position: absolute;
    }
    .avatar-container {
      height: 50px;
      line-height: 50px;
      display: inline-block;
      position: absolute;
      right: 0;
      padding: 0 24px;
      top: 0;
      .avatar-wrapper {
        cursor: pointer;
        position: relative;
        .user-avatar {
          width: 24px;
          height: 24px;
          border-radius: 24px;
          margin-top: 12px;
          overflow: hidden;
          img {
            width: 24px;
            height:34px;
          }
        }
        .user-name {
          font-size: 12px;
          float: right;
          color: $menu-text-color;
          padding: 0 5px;
          max-width: 70px;
          overflow-x: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    .menu-list{
      padding-right: $top-right-width;
      .menu-list-item{
        float: left;
        color: $menu-text-color;
        border-bottom: 2px solid $menu-top-bg;
        height: 50px;
        a{
          display: inline-block;
          padding: 0 24px;
        }
      }
      .menu-list-item:hover{
        background-color: $menu-top-hover;
        color: $menu-text-hover;
        border-bottom-color: $menu-top-hover;
      }
      .menu-list-item.selected{
        background-color: $menu-top-item-select;
        border-bottom: 2px solid $menu-select-border;
        color: $menu-text-select;
      }
    }
  }
  .popper-menu{
    border-radius: $border-radius;
    background-color: $menu-top-bg;
    color: $menu-text-color;
  }
  .child-menu{
    height: 40px;
    line-height: 40px;
    padding: 0 16px;
  }
  .child-menu:hover{
    background-color: $menu-sidebar-item-hover;
    color: $menu-text-hover;
  }
  .child-menu.selected{
    background-color: $menu-top-item-select;
    border-bottom: 2px solid $menu-select-border;
    color: $menu-text-select;
  }
  .more-menu-panel{
    height: 40px;
    line-height: 40px;
    .child-menu{
      width: 200px;
    }
    .leaf-menu{
      display: none;
      position: absolute;
      left: 200px;
      top: 0;
    }
  }
  .more-menu-panel:hover .leaf-menu{
    display: block;
  }
</style>
