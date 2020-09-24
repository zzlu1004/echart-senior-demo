<template>
  <div class="case-tabs" :class="showCenterMenu.indexOf(pageName.resourceCode) !== -1 ? 'center-menu-color':'bg-white'">
    <div class="case-tabs-con" :class="showCenterMenu.indexOf(pageName.resourceCode) !== -1 ? 'center-menu':'px3'" >
      <div  class="py2 h12" v-if="showBreadMenu.indexOf(pageName.resourceCode) === -1">
        <div v-for="(item, index) of path"
             :key="index"
             class="inline-block">
          <div v-if="menuMap[item]">
            <span class="menu-color" style="margin-left: 4px" v-show="index !== 0">/</span>
            <span class="menu-color" v-if="menuMap[item].resourceType !== 'page'">{{menuMap[item].resourceName}}</span>
            <router-link
              v-else
              :to="{
              name: getRouteName(item, index),
              query: getQuery(item, index)
            }">
              <span class="menu-link-color">{{menuMap[item].resourceName}}</span>
            </router-link>
          </div>
        </div>
      </div>
      <div class="pb2 h20 bold" v-if="showPageName.indexOf(pageName.resourceCode) === -1">{{pageName.resourceName}}</div>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'FdBreadcrumb',
    mixins: [],
    components: {},
    data() {
      return {
        pageName: '',
        showPageName: [],
        showBreadMenu: [],
        showCenterMenu: [],
        path: []
      }
    },
    props: {},
    watch: {
      $route() {
        this.getPath()
      }
    },
    hooks() {},
    computed: {
      ...mapGetters([
        'menuMap'
      ])
    },
    mounted() {
      this.getPath()
    },
    methods: {
      getPath() {
        this.path = this.$route.path.replace(/^\//, '').split('/')
        this.savePathQuery(this.path)
        this.pageName = this.menuMap[this.path[this.path.length - 1]]
        this.showPageName = window.isPage
        this.showBreadMenu = window.isBreadMenu
        this.showCenterMenu = window.isCenterMenu
      },
      getRouteName(item, index) {
        const preCode = this.path[index - 1]
        if (preCode && this.menuMap[preCode].resourceType === 'page') {
          return preCode + '-' + item
        }
        return item
      },
      getQuery(item, index) {
        const systemBreadQuery = JSON.parse(localStorage.getItem('breadcrumbQuery')) || []
        const indexItem = systemBreadQuery.findIndex((itemBread) => {
          return itemBread.pathName === item
        })
        if (indexItem >= 0) {
          return systemBreadQuery[indexItem].query
        }
      },
      savePathQuery(path) {
        const currentPathQuery = {
          pathName: path[path.length - 1],
          query: this.$route.query
        }
        let systemBreadQuery = JSON.parse(localStorage.getItem('breadcrumbQuery')) || []
        const breadQuery = []
        const index = systemBreadQuery.findIndex((item) => {
          return item.pathName === currentPathQuery.pathName
        })
        if (index === -1) {
          breadQuery.push(currentPathQuery)
        } else {
          systemBreadQuery[index].query = this.$route.query
        }
        systemBreadQuery = systemBreadQuery.concat(breadQuery)
        // 存在localStorage中
        localStorage.setItem('breadcrumbQuery', JSON.stringify(systemBreadQuery))
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'src/styles/variables.scss';
  .center-menu{
    padding-left: 24px;
    margin: 0 auto;
    width: 1200px;
    background-color: #fff;
  }
  .only-top-menu .case-tabs-con{
    width: 1366px;
    margin: 0 auto;
  }
  .case-tabs {
    height: auto;
    color: #404040;
  }
  .menu-color{
    color: $c-subTitle;
  }
  .menu-link-color{
    color: $c-text;
  }
  .menu-link-color:hover{
    color: $c-link;
  }
  .center-menu-color{
    background-color: #f5f5f5;
  }
</style>
