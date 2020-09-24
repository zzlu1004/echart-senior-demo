<template>
<div class="app-container">
    <div class="filters">
      <el-radio-group v-model="statusId" size="mini" @change="handleChange">
        <el-radio-button label="1">已生效</el-radio-button>
        <el-radio-button label="2">已结束</el-radio-button>
      </el-radio-group>
    </div>
    <div class="bg-white container-inner clearfix h14 my-check" :style="{'min-height':height}">
        <div>
            <div class="pb2 clearfix">
                <div class="f-right fd-search width-300px">
                  <fd-search @search="searchByKeyword" v-model="searchVal"></fd-search>
                </div>
            </div>
            <div class="fd-menu-table online-menu-table" id="myCheckTable">
                <table width= "100% ">
                    <thead>
                        <tr>
                            <th v-for="item of heads" :key="item.label" :width="item.width">{{item.label}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) of checkData" :key="index">
                            <td v-for="info of heads"
                                v-if="item[info.field] !== undefined || info.field === ''"
                                :key="info.label"
                                :rowspan="(info.rowspan || item.rowspan)"
                                >
                                <span v-if="info.field === ''">
                                    <el-button :disabled="item.auth.isFill" type="text" @click="submitCheck(item)">填报</el-button>
                                    <el-button type="text" @click="seeDetail(item)">查看</el-button>
                                </span>
                                <span v-else v-html="item[info.field]"></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="checkData.length === 0" class="bd-bottom el-table__empty-block" style="width: 100%;"><span class="el-table__empty-text">暂无数据</span></div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
    // import FdCheckTable from '../components/checkTable.vue'
    import { searchByKeyword, seeDetail, submitCheck, getMyList } from '@/api/kpi/onlineCheck/myCheck'
    export default {
      name: '',
      data() {
        return {
          height: (this.$store.getters.globals.height - 100) + 'px',
          loading: null,
          searchVal: '',
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
          deep: 1,
          heads: [{
            field: 'schemaName',
            label: '所属方案'
          }, {
            field: 'reportRange',
            label: '考核周期'
          }, {
            field: 'deadlineTime',
            label: '上报截止时间'
          }, {
            field: 'checkType',
            label: '考核类别',
            rowspan: 1
          }, {
            field: 'blockName',
            label: '所属细则',
            rowspan: 1
          }, {
            field: 'completeRate',
            label: '完成率',
            rowspan: 1
          }, {
            field: '',
            label: '操作',
            width: '200px',
            rowspan: 1
          }],
          statusId: '1'
        }
      },
      components: {},
      methods: {
        searchByKeyword, seeDetail, submitCheck, getMyList,
        handleChange() {
          this.getMyList()
        }
      },
      mounted() {
        this.getMyList()
      }
    }
</script>

<style lang="scss" scoped>
  .fd-menu-table .dialog-full .pointer{
    width: 100%;
    height: 40px;
  }
  .app-container{
    position: relative;
    .filters{
      position: absolute;
      top: -40px;
      right: 1rem;
    }
  }
</style>
