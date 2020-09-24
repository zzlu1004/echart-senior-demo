
<template>
  <div :class="getSelected()">
    <div class="relative pr3" :class="('pl' + (level * 2 + 1))">
      <router-link
        v-if="menu.resourceType === 'page'"
        :to="{ path: path}">
        <div class="py1 h14">
          <i :class="menu.iconClass"></i>
          <span class="dot-hidden">{{menu.resourceName}}</span>
        </div>
      </router-link>
      <div class="py1 bold dot-hidden h14" v-else>
        <i :class="menu.iconClass"></i>
        <span class="dot-hidden">{{menu.resourceName}}</span>
      </div>
    </div>
    <div v-if="menu.children">
      <side-bar-item
        v-for="(item, index) of menu.children"
        :key="index"
        :level ='level+1'
        :menu="item"
        :parentCode="parentCode+'/'+menu.resourceCode"></side-bar-item>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SideBarItem',
    mixins: [],
    components: {},
    data() {
      return {}
    },
    props: {
      menu: Object,
      parentCode: {
        type: String,
        default: '/'
      },
      level: {
        type: Number,
        default: 1
      }
    },
    watch: {},
    hooks() {},
    computed: {
      path() {
        return this.parentCode + '/' + this.menu.resourceCode
      }
    },
    mounted() {},
    methods: {
      getSelected() {
        let back = ''
        if (this.menu.resourceType === 'page') {
          back = 'menu-page'
          if (this.$route.path === this.path || this.$route.path.startsWith(this.path + '/')) {
            back += ' selected'
          }
        }
        return back
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
