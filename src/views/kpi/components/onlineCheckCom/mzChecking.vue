<template>
  <div class="clearfix h14 reporting">
    <el-radio-group v-model="type" size="small" class="select-up">
      <el-radio-button label="detail">按细则</el-radio-button>
    </el-radio-group>
    <div v-show="type==='detail'">
      <div class="clearfix pb2">
        <div class="f-right">
          <fd-search @search="searchByKeyword"
                     v-if="type==='detail'"
                     v-model="searchVal"></fd-search>
        </div>
      </div>
      <div v-if="cardData.length === 0">
        <FdNoContent style="padding-top:-200px;"></FdNoContent>
      </div>
      <div v-else>
        <kpi-card
          v-for="(item, index) of cardData"
          :key="item.schemaId"
          :index="index"
          checkType="to_fill"
          v-on:seeRuleDetail="seeRuleDetail"
          :option="xzOpt[checkType]"
          :cardData="item"
        ></kpi-card>
      </div>
    </div>
  </div>
</template>

<script>
  import fdTable from 'fd/table'
  import kpiCard from '../kpiCard'
  import FdNoContent from 'fd/noContent'
  import FdPagination from 'fd/pagination/pagination'
  import { searchByKeyword, getxzList,
    fillXz, gotoDetailByName, seeRuleDetail } from '@/api/kpi/onlineCheck/mzReporting'
  export default {
    name: 'reporting',
    components: {
      fdTable, kpiCard, FdPagination, FdNoContent
    },
    methods: {
      searchByKeyword,
      getxzList, fillXz, seeRuleDetail,
      gotoDetailByName
    },
    data() {
      return {
        loading: false,
        pageSize: 10,
        total: 0,
        searchVal: '',
        type: 'detail',
        blocks: [],
        tableOpt: {},
        checkData: [],
        typesMap: {
          'k10015-01': '综合绩效',
          'k10015-02': '审判绩效',
          'k10015-03': '民主测评',
          'k10015-04': '部门考核'
        },
        params: {
          keyword: ''
        },
        staffId: this.$store.getters.user,
        xzOpt: {
          'to_mz': {
            btnTool: [
              { disabled: 'notFill', text: '填报', type: 'text', click: this.fillXz }
            ]
          }
        },
        cardData: []
      }
    },
    props: {
      checkType: {
        type: String
      },
      getCnt: {
        type: Boolean
      },
      active: {
        type: String
      },
      statusId: String
    },
    mounted() {
    },
    activated() {
      this.getxzList(this.statusId)
    },
    watch: {
    }
  }
</script>

<style lang="scss" scoped>

</style>
