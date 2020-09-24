<template>
    <fd-panel :title="['队伍基础概况']" class="mb2" style="width: 100%; height: 203px">
      <div slot="panel-1" class="p2 relative">
        <span class="page-link"
              @click="$router.push({ name: 'recordAnalyze' })">
          <i class="at icon-doubleright"/>
        </span>
        <div class="total-data">
          <div class="total-data-item mr3 bold h16 f-left">
            <span><img class="total-data-img mr1" src="./icon-og1.svg" alt="无法加载"></span>
            <span >
            <span>{{companyName || '--'}}</span>
            <span class="h34 ml1 h28" >{{totalData.staffCount || 0}}</span>
            <span>人</span>
          </span>
          </div>
          <div class="total-data-item">
            <span><img class="total-data-img mr1" src="./icon-og2.svg" alt="无法加载"></span>
            <span >
            <span>全院部门</span>
            <span class="h34 ml1 h28">{{totalData.departCount || 0}}</span>
            <span>个</span>
          </span>
          </div>
        </div>
        <div class="four-data mt2">
          <fd-tag :tagData="tags" size="big"></fd-tag>
        </div>
      </div>
    </fd-panel>
</template>

<script>
  import FdPanel from 'fd/panel/panel'
  import FdTag from '../../components/tag'
  import { getTotalData } from '@/api/kpi/leaderWork/teamGeneral'
  export default {
    name: 'teamOverviewTop',
    components: { FdPanel, FdTag },
    props: {},
    data() {
      return {
        companyName: this.$store.getters.user.companyName,
        totalData: {},
        tags: [],
        unitMap: {
          '员额法官': '人',
          '法官助理': '人',
          '书记员': '人',
          '其他': '人'
        }
      }
    },
    mounted() {
      this.getTotalData()
    },
    methods: {
      getTotalData
    },
    watch: {
      isRefresh() {
        this.getTotalData()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .total-data {
    height: 20px;
  }
  .four-data{
    width: 100%;
    height: auto;
    overflow: hidden;
  }
  .total-data-item {
    height: 20px;
    color: #404040;
    line-height: 20px;
    .img,
    span {
      display: block;
      float: left;
      height: 20px;
      line-height: 20px;
    }
  }
  .total-data-img {
    width: 20px;
    height: 20px;
  }
  .page-link{
    position: absolute;
    top: -33px;
    right: 40px;
    z-index: 999;
    cursor: pointer
  }
</style>
