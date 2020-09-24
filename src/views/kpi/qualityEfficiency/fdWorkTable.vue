<template>
  <div>
    <div class="clearfix mb3 fd-work-table">
     <div class="clearfix pb2 table-search">
          <span class="f-left">
            <el-popover
              placement="right"
              width="226"
              ref="popover"
            >
              <el-checkbox-group v-model="checkedCols" @change="changeCols">
                <div class="pb1" v-for="cols of checkbox" :key="cols.field">
                  <el-checkbox :label="cols.field">{{cols.title}}</el-checkbox>
                </div>
              </el-checkbox-group>
            </el-popover>
            <el-button size="small" v-popover:popover>自定义列表</el-button>
          </span>
          <span class="f-right pl2 pt1">
              <span>
                  指标说明
              </span>
              <el-popover
                  placement="top"
                  width="310"
                  trigger="hover"
                  :content="targetMap[params.indexId]+'：'+targetDesc[params.indexId]">
                  <i slot="reference" class="at icon-questioncircle color-d9d9d9 pointer"/>
              </el-popover>
          </span>
          <span class="f-right btn btn-default btn-sm" @click="downloadTable">
              <i class="at icon-download"/>
              下载
          </span>
          <span class="f-right mr3">
            <fd-search v-if="elements.depart && type === 'depart'" @search="searchByKeyword"
                       v-model="val"></fd-search>
          </span>
        </div>
        <fd-table
          v-if="isSuccess"
          :loading="departLoading"
          :option="tableOpt"
          @cellClick="countPeg"
          :isRefresh="isFlag"
          :sortChange="sortByNum1" 
          :sortable=true
          :defaultSort="defaultSort"
          ref="tableOpt"
          ></fd-table>
    </div>
  </div>
</template>

<script>
  import FdPagination from 'fd/pagination/pagination'
  import fdTable from 'fd/table'
  import { searchByKeyword, countPeg, changeCols, downloadTable, getColumns, refreshCondition,
    getDepartTotal, currentChange, sizeChange, getWidth, sortByNum1 } from '@/api/kpi/qualityEfficiency/workQuality'
  export default {
    name: 'fdWorkTable',
    components: {
      fdTable, FdPagination
    },
    props: {
      type: {
        type: String,
        default: ''
      },
      typeId: {
        type: String,
        default: ''
      },
      active: {
        type: String,
        default: ''
      },
      targetMap: {
        type: Object
      },
      targetDesc: {
        type: Object
      },
      Pparams: {
        type: Object
      },
      elements: {
        type: Object
      },
      isFlag: {
        type: Boolean,
        default: false
      },
      isSuccess: {
        type: Boolean,
        default: false
      },
      flag: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        val: '',
        departLoading: false,
        pageSize: 10,
        total: 0,
        defaultSort: {},
        params: {
          orderField: '',
          orderType: '',
          keyword: '',
          type: ''
        },
        judgeParams: {
          limit: 10,
          offset: 0
        },
        typeMap: {
          'depart': '部门',
          'judge': '员额法官'
        },
        pageMap: {
          'zb002': '办案公正',
          'zb003': '办案效率',
          'zb004': '办案效果',
          'zb005': '司法公开'
        },
        fileName: '',
        columsObj: {
          // 改判发回重审案件数
          'depart-zb002011': {
            name: '部门',
            zb002011: '改判发回重审案件数',
            d001016: '上诉案件改判（错误）数',
            d001017: '上诉案件发回重审（错误）数'
          },
          // 再审改判发回案件数
          'depart-zb002012': {
            name: '部门',
            zb002012: '再审改判发回案件数',
            d001018: '本院再审案件改判（错误）数',
            d001019: '上级法院再审案件改判（错误）数',
            d001020: '上级法院再审案件发回重审（错误）数',
            d001021: '本院再审案件发回重审（错误）数'
          },
          // 结案率（执结率）
          'depart-zb003001': {
            name: '部门',
            zb003001: '结案率（执结率）',
            d001002: '各类案件结案数',
            d001004: '各类案件旧存数',
            d001003: '各类案件新收数'
          },
          // 法定（正常）审限内结案率
          'depart-zb003002': {
            name: '部门',
            zb003002: '法定（正常）审限内结案率',
            d001005: '法定审限内结案数', // todo 法定审限内结案案件数
            d001002: '各类案件结案数（期限内结案数）'
          },
          // 超审限案件数
          'depart-zb003003': {
            name: '部门',
            zb003003: '超审限案件数'
          },
          // 平均审理时间指数
          'depart-zb003007': {
            name: '部门',
            zb003007: '平均审理时间指数',
            d001015: '审理时间指数',
            d001008: '一审结案数',
            d001010: '二审结案数',
            d001011: '再审案件结案数（排除抗）',
            d001012: '执行案件结案数',
            d001013: '一审简易程序结案数',
            d001014: '不计审限结案数（一审、二审、再审）'
          },
          // 调撤率
          'depart-zb004001': {
            name: '部门',
            zb004001: '调撤率',
            d001007: '调解、和解和撤诉案件数',
            d001035: '可调结案案件数'
          },
          // 一审服判息诉率
          'depart-zb004002': {
            name: '部门',
            zb004002: '一审服判息诉率',
            d001009: '上诉案件收案数',
            d001008: '一审结案数'
          },
          // 长期未结诉讼案件和久押未决案件数
          'depart-zb003010': {
            name: '部门',
            zb003010: '长期未结诉讼案件和久押未决案件数',
            d001022: '长期未结诉讼案件数',
            d001023: '久押未决案件数'
          },
          // 庭审直播率
          'depart-zb005004': {
            name: '部门',
            zb005004: '庭审直播率',
            m1049: '庭审直播数',
            m1050: '排期开庭数',
            m1051: '不公开庭审数'
          },
          // 文书上网率
          'depart-zb005002': {
            name: '部门',
            zb005002: '文书上网率',
            m1045: '公开文书数',
            d001002: '结案案件数',
            m1046: '调解案件数',
            m1047: '离婚纠纷案件数',
            m1048: '涉未成年人案件数'
          }
        },
        checkedCols: [],
        checkbox: [],
        checkboxName: [],
        tableOpt: {
          stripe: true,
          border: true,
          data: [],
          columns: []
        }
      }
    },
    computed: {
    },
    mounted() {
      this.params.type = this.type
      this.params = this.fd.tools.merge(true, {}, this.params, this.Pparams)
    },
    methods: {
      searchByKeyword, countPeg, changeCols, downloadTable, getColumns, refreshCondition,
      getDepartTotal, currentChange, sizeChange, sortByNum1, getWidth
    },
    watch: {
      isFlag() {
        this.params = this.fd.tools.merge(true, {}, this.params, this.Pparams)
        this.getColumns()
        if (!this.flag) {
          this.defaultSort = { prop: this.params.indexId, order: 'descending' }
        } else {
          this.refreshCondition()
          this.getDepartTotal(this.type)
        }
      },
      Pparams: {
        handler(val, oldVal) {
          if (!oldVal.indexId) {
            this.params = this.fd.tools.merge(true, {}, this.params, this.Pparams)
            this.getColumns()
          }
        },
        deep: true
      }
    }
  }
</script>

<style lang="scss">
</style>
