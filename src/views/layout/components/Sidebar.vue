<template>
  <div class="route-item">
    <div class="auto" :style="{'height': $store.getters.globals.height - 100 + 'px'}">
      <!--支持多层级收缩展开-->
      <side-bar-item
        v-for="(item, index) of menus"
        :key="index"
        :parentCode="parentCode ? ('/' + parentCode) : ''"
        :menu = "item"
      ></side-bar-item>
    </div>
  </div>
</template>

<script>
  import SideBarItem from './SideBarItem'
  export default {
    name: 'SideBar',
    mixins: [],
    components: { SideBarItem },
    data() {
      return {}
    },
    props: {
      menus: Array,
      parentCode: String
    },
    watch: {
      menus() {}
    },
    hooks() {},
    computed: {},
    mounted() {},
    methods: {
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import 'src/styles/variables.scss';
  .route-item{
    background-color: $menu-sidebar-bg;
    height: 100%;
    line-height: 24px;
    padding: 16px 0;
    color: $menu-text-color;
    .selected{
      background-color: $menu-sidebar-item-select;
    }
    .menu-page{
      cursor: pointer;
    }
    .menu-page:hover{
      background-color: $menu-sidebar-item-hover;
    }
  }
</style>
