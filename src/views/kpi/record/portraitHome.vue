<template>
  <div class="app-container">
    <div class="container-inner bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}" >
      <div style="margin: 0 auto;width: 1200px;" class="bg-img" :style="{'min-height': $store.getters.globals.height - 130 + 'px'}" >
        <div class="search-item">
          <div class="search-tit">智能人物画像</div>
          <div class="search-con">
            <el-autocomplete
              class="inline-input autocomplete"
              v-model="state"
              clearable
              prefix-icon="el-icon-search"
              :fetch-suggestions="querySearch"
              placeholder="请输入姓名或部门搜索员额法官"
              @select="currentNodeClick"
            ></el-autocomplete>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getUserDetail, currentNodeClick, createFilter, querySearch } from '@/api/kpi/record/portraitHome'
  export default {
    name: 'portraitHome',
    components: {
    },
    props: {
    },
    computed: {
    },
    data() {
      return {
        state: '',
        restaurants: [],
        userDetail: [],
        params: {
          companyId: this.$store.getters.user.companyCode,
          staffTypes: ['k10003-01', 'k10003-02'],
          pigurePortrait: true
        }
      }
    },
    mounted() {
      this.getUserDetail()
    },
    methods: {
      getUserDetail,
      currentNodeClick,
      createFilter,
      querySearch
    },
    watch: {
    }
  }
</script>

<style lang="scss">
  @import 'src/styles/variables.scss';
  .bg-img{
    height: 100%;
    background-image: url("~@/assets/portrait/searchBg.png");
    .search-item{
      padding: 200px 0 0;
    }
    .search-tit{
      font-size: 32px;
      text-align: center;
      font-weight: 500;
      letter-spacing: 2px;
      color: #2e394b;
    }
    .search-con{
      margin: 80px 0 0;
      text-align: center;
    }
    .autocomplete{
      width: 600px;
      height: 56px;
      box-shadow: 1px 2px 4px #eee;
    }
    .autocomplete .el-input__inner{
      height: 56px;
      line-height: 56px;
    }
  }
</style>
