<template>
  <div class="popper-menu">
    <div
      v-for="(child, i) of children"
      :key="i">
      <!--二级菜单为页面-->
      <router-link
        v-if="child.resourceType === 'page'"
        :to="{ name: child.resourceCode }">
        <div class="child-menu pointer" :class="getSelected(child, path)">
          <i :class="child.iconClass"></i><span>{{getTitle(child)}}</span>
        </div>
      </router-link>
      <div class="child-menu second-menu" :class="getSelected(child, path)" v-else>
        <div>
          <i :class="child.iconClass"></i>
          <span>{{getTitle(child)}}</span>
          <i class="at icon-right f-right"></i>
        </div>
        <div class="menu-leaf">
          <div
            v-for="(cc, ii) of child.children"
            :key="ii">
            <div class="child-menu pointer"  :class="getSelected(cc, path + '/' + child.resourceCode)">
              <router-link
                :to="{ name: cc.resourceCode }">
                <i :class="cc.iconClass"></i><span>{{getTitle(cc)}}</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FdPopperMenu',
    mixins: [],
    components: {},
    data() {
      return {}
    },
    props: {
      children: Array,
      path: String
    },
    watch: {},
    hooks() {},
    computed: {},
    mounted() {},
    methods: {
      getTitle(item) {
        return item.resourceName
      },
      getPath(item, path = this.path) {
        if (item.children && item.children.length > 0) {
          return this.getPath(item.children[0], path + item.resourceCode + '/')
        } else {
          return path + item.resourceCode
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
      getMenuChild(item) {
        item.children = item.children || []
        this.$emit('change', item)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "~@/styles/el-variables.scss";
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
    background-color: $menu-top-hover;
    color: $menu-text-hover;
  }
  .child-menu.selected{
    background-color: $menu-top-item-select;
    color: $menu-text-select;
  }
  .second-menu{
    position: relative;
    .menu-leaf{
      display: none;
      position: absolute;
      width: 200px;
      left: 200px;
      top: -1px;
      border-radius: $border-radius;
      background-color: $menu-top-bg;
      color: $menu-text-color;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      border: 1px solid $--border-color-lighter;
    }
  }
  .second-menu:hover .menu-leaf{
    display: block;
  }
  .menu-leaf:hover{
    display: block;
  }
</style>
