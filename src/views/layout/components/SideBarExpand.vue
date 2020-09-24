<template>
  <div class="side-bar-child">
    <div v-for="(item,index) of menus" :key="index">
      <div class="px3 py1" :class="getSelected(item, getPath(item))">
        <router-link
          v-if="item.resourceType === 'page'"
          :to="{ path: getPath(item)}">
          <div class="h14">
            <i :class="item.iconClass"></i>
            <span class="dot-hidden menu-name">{{item.resourceName}}</span>
          </div>
        </router-link>
        <div class="h12 color-menu" v-else>
          <i :class="item.iconClass"></i>
          <span class="dot-hidden menu-name">{{item.resourceName}}</span>
        </div>
      </div>
      <div v-if="item.children">
        <div class="py1 pl5 pr3"
             :class="getSelected(child, getPath(child, getPath(item)))"
             v-for="(child, i) of item.children" :key="i">
          <router-link
            v-if="child.resourceType === 'page'"
            :to="{ path: getPath(child, getPath(item))}">
            <div class="h14">
              <i :class="child.iconClass"></i>
              <span class="dot-hidden menu-name">{{child.resourceName}}</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SideBarExpand',
    mixins: [],
    components: {},
    data() {
      return {}
    },
    props: {
      menus: Array,
      parentCode: String
    },
    watch: {
      parentCode() {}
    },
    hooks() {},
    computed: {},
    mounted() {
    },
    methods: {
      getPath(item, parentCode = this.parentCode) {
        return parentCode + '/' + item.resourceCode
      },
      getSelected(item, path) {
        let back = ''
        if (item.resourceType === 'page') {
          back = 'menu-page'
          if (this.$route.path === path || this.$route.path.startsWith(path + '/')) {
            back += ' selected'
          }
        }
        return back
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import 'src/styles/variables.scss';
  .selected{
    background-color: $menu-sidebar-item-select;
  }
  .menu-page{
    cursor: pointer;
  }
  .menu-page:hover{
    background-color: $menu-sidebar-item-hover;
  }
  .menu-name{
    width: 180px;
  }
  .half .menu-name{
    width: 0;
  }
  .side-bar-child{
    background-color: $menu-sidebar-child-bg;
  }
  .color-menu{
    color: #8f8f8f
  }
</style>
