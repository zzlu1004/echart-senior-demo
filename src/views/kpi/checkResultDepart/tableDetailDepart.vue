<template>
  <div class="app-container table-detail">
    <div class="container-inner bg-white" :style="{'min-height': height - 100 + 'px'}">
      <div class="bd-dashed-bottom mb2">
        <div class="mb2">
          <el-row class="mb2">
            <el-col :span="8">
              <div class="absolute pr1 py1">法院：</div>
              <div class="except-w4-full">
                <el-popover
                  ref="courtPid"
                  placement="bottom-start"
                  v-model="showDepartTree">
                  <el-tree
                    style="max-height:300px;overflow-y: auto;"
                    :data="departs"
                    :props="defaultProps"
                    :accordion="accordion"
                    @node-click="courtNodeClick"></el-tree>
                </el-popover>
                <el-input
                  v-model="companyName"
                  size="small"
                  readonly
                  placeholder="请选择"
                  v-popover:courtPid>
                </el-input>
              </div>
            </el-col>
            <el-col class="pl2" :span="8">
              <div class="absolute pr1 py1">方案：</div>
              <div class="except-w4-full">
                <span class="inline-block status-panel">
                  <el-select class="full"
                             v-model="schemaStatus"
                             placeholder="请选择"
                             size="small"
                             @change="getSchemas">
                    <el-option
                      v-for="item in statusOpt"
                      v-if="elements[item.id]"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </span>
                <span class="inline-block schema-panel">
                  <el-select class="full"
                             size="small"
                             v-model="baseParams.schemaId"
                             placeholder="请选择"
                             @change="getDepartData">
                    <el-option
                      v-for="item in schemaOpt"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </span>
              </div>
            </el-col>
            <el-col class="pl2" :span="8">
              <div class="absolute pr1 py1">考核类别：</div>
              <div class="except-w4-full">
                <el-select
                  v-model="baseParams.schemaBlockType"
                  placeholder="请选择"
                  size="small">
                  <el-option
                    v-for="item in schemaBlockTypeOpt"
                    v-if="elements[item.id]"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div class="absolute pr1 py1">部门：</div>
              <div class="except-w4-full">
                <el-select
                    v-model="peopleParams.departIds"
                    multiple
                    size="small"
                    filterable
                    clearable
                    placeholder="请选择">
                  <el-option
                    v-for="item in departData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="16">
              <div class="pb2 right-align">
                <el-button size="small" @click="updateSchema" :disabled="schemaStatus !== 'active'">更新填报数据</el-button>
                <el-button size="small" type="primary" @click="clickBtn">查询</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div style="line-height: 1;margin-bottom: 1rem;">更新时间：{{schema.lastRefreshTime || '--'}}</div>
      <div>
        <div>
          <el-row class="mb2" :gutter="20">
            <el-col :span="grades.length>0?12:24">
              <el-row class="bd py2" >
                <el-col class="bd-right px3" :span="12">
                  <div class="color-title pb3 dot-hidden bold">{{schema.schemaName||'--'}}</div>
                  <div>考评周期: {{schema.schemaStartTime?schema.schemaStartTime:''}}至{{schema.schemaEndTime?schema.schemaEndTime:''}}</div>
                </el-col>
                <el-col class="bd-right t-center bold" :span="6">
                  <div class="color-title pb2">考核部门数</div>
                  <div class="color-title h24">{{usersCount.statValue}}/{{usersCount.maxValue}}</div>
                </el-col>
                <el-col class="t-center bold" :span="6">
                  <div class="color-title pb2">平均分数</div>
                  <div class="color-title h24">{{averange.statValue}}</div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="grades.length>0?12:0">
              <el-row class="bd py2">
                <el-col v-for="(item, index) of grades"
                        :key="index"
                        :class="((index?'bd-left':'')+' t-center bold')"
                        :style="{color: colorArr[index]}"
                        :span="24/(grades.length || 1)">
                  <div class="pb2">{{item.name}}档({{item.value}}个)</div>
                  <div class="h24">{{item.rate}}%</div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div class="tab-box">
          <el-tabs v-model="category" type="card">
            <el-tab-pane label="汇总表" name="total">
              <div v-if="category === 'total'">
                <div class="clearfix pb2 table-search">
              <span class="f-left">
                <el-popover
                  placement="right"
                  width="226"
                  ref="popover"
                >
                   <div class="scroll-body">
                      <el-checkbox-group v-model="totalCheckedCols" @change="changeTotalCols">
                        <div class="pb1" v-for="cols of totalCheckbox" :key="cols.field">
                          <el-checkbox :label="cols.field">{{cols.title}}</el-checkbox>
                        </div>
                      </el-checkbox-group>
                   </div>
                </el-popover>
                <el-button size="small" v-popover:popover>自定义列表</el-button>
              </span>
                  <span class="f-right btn btn-default btn-sm" style="margin-left: 24px" @click="printTable">
                  <i class="fd-icon icon-dayin"/>
                  打印
              </span>
                  <span class="f-right btn btn-default btn-sm" @click="downloadTableDetail">
                  <i class="at icon-download"/>
                  下载
              </span>
                  <span class="f-right mr3">
                <fd-search v-if="category === 'total'" @search="searchByKeyword"
                           v-model="totalVal"></fd-search>
              </span>
                </div>
                <div id="tableTotal">
                  <div class="relative print-title">
                    <div class="bold h16 absolute print-name center">{{printTitle}}</div>
                    <el-table
                      v-loading="tableTotalLoading"
                      element-loading-text="数据正在加载中"
                      :data="totalData"
                      @sort-change="sortByNum"
                      stripe
                      border>
                      <el-table-column
                        v-for="info of treeTotal"
                        :key="info.id"
                        :prop="info.field"
                        :label="info.label"
                        show-overflow-tooltip
                        :align="getAlignStyle(info.id)"
                        :min-width='fd.tools.getStringWidth(info.label)'
                        sortable='custom'
                        :fixed="getDataField(info)"
                      >
                        <template slot-scope="scope">
                          <!-- 姓名可反查 -->
                          <span v-if="info.field === 'departName'" class="color-blue pointer" @click="staffNamePeg(scope.row)">
                      {{scope.row.departName}}</span>
                          <span v-else-if="info.field === 'departName'||info.field === 'rank' || info.field === 'gradeName'">
                      {{scope.row[info.field] ? scope.row[info.field]:'--'}}</span>
                          <span v-else>{{fd.data.saveFloat(scope.row[info.field], 2)}}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
                <fd-pagination
                  :limit="totalParams.limit"
                  :total="totalTotal"
                  :offset="totalParams.offset"
                  sizes="sizes"
                  :pageArr="[10,20,30,40,50]"
                  :currentChange="currentChange"
                  :sizeChange="sizeChange">
                </fd-pagination>
                <div id="tableTotalDisply" v-if="tableDisplay">
                  <div class="relative print-title">
                    <div class="bold h16 absolute print-name center">{{printTitle}}</div>
                    <el-table
                      v-loading="tableTotalLoading"
                      element-loading-text="数据正在加载中"
                      :data="totalData2"
                      @sort-change="sortByNum"
                      stripe
                      border>
                      <el-table-column
                        v-for="info of treeTotal"
                        :key="info.id"
                        :prop="info.field"
                        :label="info.label"
                        show-overflow-tooltip
                        :align="getAlignStyle(info.id)"
                        :min-width='fd.tools.getStringWidth(info.label)'
                        sortable='custom'
                        :minWidth="fd.tools.getStringWidth(info.label)"
                      >
                        <template slot-scope="scope">
                          <!-- 姓名可反查 -->
                          <span v-if="info.field === 'departName'" >
                      {{scope.row.departName}}</span>
                          <span v-else-if="info.field === 'departName'||info.field === 'rank' || info.field === 'gradeName'">
                      {{scope.row[info.field] ? scope.row[info.field]:'--'}}</span>
                          <span v-else>{{fd.data.saveFloat(scope.row[info.field], 2)}}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="明细表" name="detail">
              <div v-if="category === 'detail'">
                <div class="clearfix pb2 table-search">
              <span class="f-left">
                <el-popover
                  placement="right"
                  width="226"
                  ref="popover2"
                >
                  <div class="scroll-body">
                    <el-checkbox-group v-model="detailCheckedCols" @change="changeDetailCols">
                      <div class="pb1" v-for="cols of detailCheckbox" :key="cols.field">
                        <el-checkbox :label="cols.field">{{cols.title}}</el-checkbox>
                      </div>
                    </el-checkbox-group>
                  </div>
                </el-popover>
                <el-button size="small" v-popover:popover2>自定义列表</el-button>
              </span>
                  <span class="f-left checkbox-panel">
                <el-checkbox-group v-model="columns" :min="1" @change="changeCols">
                  <el-checkbox v-for="info of checkbox" :label="info.id" :key="info.id">{{info.name}}</el-checkbox>
                </el-checkbox-group>
              </span>
                  <span class="f-right btn btn-default btn-sm"  style="margin-left: 24px" @click="printTable">
                  <i class="fd-icon icon-dayin"/>
                  打印
              </span>
                  <span class="f-right btn btn-default btn-sm" @click="downloadTableDetail">
                  <i class="at icon-download"/>
                  下载
              </span>
                  <span class="f-right mr3">
                <fd-search v-if="category === 'detail'" @search="searchByKeyword"
                           v-model="detailVal"></fd-search>
              </span>
                </div>
                <div id="tableDetailPanel">
                  <div id="tableDetail">
                    <div class="relative print-title">
                      <div class="bold h16 title-hide absolute print-name center" >{{printTitle}}</div>
                      <el-table
                        v-loading="tableDetailLoading"
                        element-loading-text="数据正在加载中"
                        :data="tableData"
                        @sort-change="sortByNum"
                        stripe
                        border
                      >
                        <multi-head
                          v-for="item of tree"
                          :key="item.id"
                          :elementsPeg="elements.peg"
                          :label="item.label"
                          :data="item"
                          :cols="cols"
                          v-bind:params="fd.tools.merge(true, params2, baseParams)"
                          v-bind:timeRange="timeRange"
                          resource='tableDetail'
                        ></multi-head>
                      </el-table>
                    </div>
                  </div>
                  <div id="tableDetailDisply" v-if="tableDisplay">
                    <div class="relative print-title">
                      <div class="bold h16 title-hide absolute print-name center" >{{printTitle}}</div>
                      <el-table
                        :data="tableData2"
                        border
                      >
                        <multi-head
                          v-for="item of tree"
                          :key="item.id"
                          :elementsPeg="elements.peg"
                          :label="item.label"
                          :data="item"
                          :cols="cols"
                          v-bind:params="fd.tools.merge(true, params2, baseParams)"
                          v-bind:timeRange="timeRange"
                          resource='tableDetail'
                        ></multi-head>
                      </el-table>
                    </div>
                  </div>
                  <fd-pagination
                    :limit="detailTParams.limit"
                    :total="detailTotal"
                    :offset="detailTParams.offset"
                    sizes="sizes"
                    :pageArr="[10,20,30,40,50]"
                    :currentChange="currentChange"
                    :sizeChange="sizeChange">
                  </fd-pagination>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import fdEcharts from 'fd/echarts/echarts'
  import FdPagination from 'fd/pagination/pagination'
  import multiHead from './components/multiHead.vue'
  import { courtNodeClick, getTotalResult, getTotalResult2, getDetailResult, getDetailResult2, searchByKeyword, changeTotalCols, changeDetailCols, changeCols, downloadTableDetail, getSchemas, refreshAll, sortByNum, getAlignStyle, printTable, printTableHead, staffNamePeg, clickBtn, getDepartData, currentChange, sizeChange, mzIndexDepartPeg } from '@/api/kpi/checkResultDepart/tableDetailDepart'
  export default {
    name: 'tableDetailDepart',
    components: {
      fdEcharts, multiHead, FdPagination
    },
    props: {},
    data() {
      return {
        tableDisplay: false,
        flag: true,
        flagDetail: true,
        isChangeTotalCols: false,
        isChangeDetailCols: false,
        changeHeader: [],
        changeDetailHeader: [],
        changeCheck: [],
        changeDetailCheck: [],
        totalCheckedCols: [],
        totalCheckbox: [],
        totalCheckboxName: [],
        detailCheckedCols: [],
        detailCheckbox: [],
        detailCheckboxName: [],
        tableTotalLoading: false,
        tableDetailLoading: false,
        category: 'total',
        isOrder: false, // 是否是排序 ，排序的话 不需要重新获取表头
        isOpen: false, // 是否展开子集隐藏的下拉框
        columns: ['approvalScore', 'score'],
        checkboxName: ['approvalScore', 'formulaScore', 'score'],
        height: this.$store.getters.globals.height,
        schema: {},
        schemaName: '',
        totalVal: '',
        detailVal: '',
        schemaStatus: 'active',
        tree: [],
        treeTotal: [], // 汇总表的表头（没有指标 只有指标分类）
        tableData: [],
        tableData2: [],
        totalData: [],
        totalData2: [],
        OriginalData: [],
        totalOriginalData: [],
        showDepartTree: false,
        departData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        accordion: true,
        params: {},
        totalParams: {
          isSummary: true,
          keyword: '',
          orderField: '',
          orderType: '',
          limit: 10,
          offset: 0
        },
        totalParamsDisply: {
          limit: 0,
          offset: 0
        },
        totalTotal: 0,
        detailTParams: {
          isSummary: false,
          keyword: '',
          orderField: '',
          orderType: '',
          limit: 10,
          offset: 0
        },
        detailTotal: 0,
        baseParams: {
          companyId: this.$store.getters.user.companyCode,
          schemaId: '',
          schemaBlockType: 'k10015-01'
        },
        statusOpt: [],
        params2: {
          weightId: ''
        },
        peopleParams: {
          departIds: []
        },
        checkCol: '',
        checkbox: [{
          id: 'approvalScore',
          name: '指标值'
        }, {
          id: 'formulaScore',
          name: '指标初始分'
        }, {
          id: 'score',
          name: '指标分数'
        }],
        cols: [],
        colObj: {
          approvalScore: '指标值',
          formulaScore: '指标初始分',
          score: '指标分数'
        },
        schemaId: '',
        companyName: this.$store.getters.user.companyName,
        schemaOpt: [],
        blockOpt: [],
        statusMap: {
          '1': '已公示',
          '0': '未公示'
        },
        classObj: {
          '1': 'public-status',
          '0': 'unPublic-status'
        },
        schemaBlockTypeOpt: [],
        schemaBlockMap: {
          'k10015-01': '综合绩效',
          'k10015-02': '审判绩效',
          'k10015-03': '民主测评',
          'k10015-04': '新民主测评'
        },
        categoryMap: {
          'total': '汇总表',
          'detail': '明细表'
        },
        usersCount: {
          statValue: 0,
          maxValue: 0
        },
        averange: {
          statValue: 0
        },
        grades: [],
        fileName: '',
        headerName: '',
        timeRange: {
          startTime: '',
          endTime: ''
        },
        weightMap: {},
        schemaMap: {},
        colorArr: ['#1a95e7', '#00a853', '#ffbf00', '#ef4133'],
        departsMap: {},
        printTitle: '',
        changeNum: 1,
        isChange: false // 判断是否进行了自定义列表，i定义列表之后需要重新调取递归组件
      }
    },
    computed: {
      // 人员类别映射
      typesMap() {
        return this.fd.tools.mapSelects('k10003')
      },
      // 部门
      departs() {
        return this.fd.data.changeToTree(this.$store.getters.allCourt, 'id', 'parentId')
      },
      chairMap() {
        return this.fd.tools.mapSelects('k10010')
      },
      court() {
        return this.$store.getters.court
      },
      elements() {
        return this.$store.getters.elements.tableDetailDepart || {}
      }
    },
    mounted() {
      this.checkbox.forEach((item, i) => {
        if (this.columns.includes(item.id)) {
          this.cols.push(item)
        }
      })
      // 如果没有给这个用户配置已生效 已结束
      if (this.$route.query.schemaStatus) {
        this.schemaStatus = this.$route.query.schemaStatus
      } else {
        if (this.elements.active) {
          this.schemaStatus = 'active'
        } else if (this.elements.finished) {
          this.schemaStatus = 'finished'
        } else if (this.elements.public) {
          this.schemaStatus = 'public'
        } else {
          this.schemaStatus = ''
        }
      }
      if (this.elements.active) {
        this.statusOpt.push({
          id: 'active',
          name: '已生效'
        })
      }
      if (this.elements.finished) {
        this.statusOpt.push({
          id: 'finished',
          name: '已结束'
        })
      }
      if (this.elements.public) {
        this.statusOpt.push({
          id: 'public',
          name: '已公示'
        })
      }
      if (this.$route.query.schemaBlockType) {
        this.baseParams.schemaBlockType = this.$route.query.schemaBlockType
      } else {
        if (this.elements['k10015-01']) {
          this.baseParams.schemaBlockType = 'k10015-01'
        } else if (this.elements['k10015-02']) {
          this.baseParams.schemaBlockType = 'k10015-02'
        } else if (this.elements['k10015-03']) {
          this.baseParams.schemaBlockType = 'k10015-03'
        } else if (this.elements['k10015-04']) {
          this.baseParams.schemaBlockType = 'k10015-04'
        } else {
          this.baseParams.schemaBlockType = ''
        }
      }
      // 如果没有给这个用户配置综合绩效 审判绩效
      if (this.elements['k10015-01']) {
        this.schemaBlockTypeOpt.push({
          id: 'k10015-01',
          name: '综合绩效'
        })
      }
      if (this.elements['k10015-02']) {
        this.schemaBlockTypeOpt.push({
          id: 'k10015-02',
          name: '审判绩效'
        })
      }
      if (this.elements['k10015-03']) {
        this.schemaBlockTypeOpt.push({
          id: 'k10015-03',
          name: '民主测评'
        })
      }
      if (this.elements['k10015-04']) {
        this.schemaBlockTypeOpt.push({
          id: 'k10015-04',
          name: '新民主测评'
        })
      }
      if (this.$route.query.schemaStatus) {
        this.refreshAll(this.$route.query.schemaStatus) // 获取方案下拉框
      } else {
        this.refreshAll(this.schemaStatus) // 获取方案下拉框
      }
    },
    methods: {
      refreshAll, getSchemas, getDepartData, courtNodeClick, getTotalResult, getTotalResult2, getDetailResult, getDetailResult2, searchByKeyword,
      changeTotalCols, changeDetailCols, changeCols, downloadTableDetail, sortByNum, printTable, printTableHead,
      staffNamePeg, clickBtn, currentChange, sizeChange, getAlignStyle, mzIndexDepartPeg,
      getDataField(data) {
        return data.id === 'departName' || data.id === 'staffName' || data.id === 'allScore' ||
          data.id === 'rank' || data.id === 'gradeName'
      },
      updateSchema() {
        this.fd.req({
          method: 'put',
          url: 'api/dept/schemas/refresh/result?' + `schemaId=` + this.baseParams.schemaId
        }).then(response => {
          this.$message({
            type: 'info',
            message: response.message
          })
        }).catch(error => {
          console.log(error)
        })
      }
    },
    watch: {
      changeNum() {
        this.isChange = true
      }
    }
  }
</script>

<style lang="scss">
.table-detail{
  .status-box{
    top: 50%;
    right: 96px;
    margin-top:-20px;
    transform:rotate(-30deg);
    -ms-transform:rotate(-30deg); 	/* IE 9 */
    -moz-transform:rotate(-30deg); 	/* Firefox */
    -webkit-transform:rotate(-30deg); /* Safari 和 Chrome */
    -o-transform:rotate(-30deg);
  }
  .status-panel{
    width: 30%;
    .el-input__inner {
      border-radius: 2px 0 0 2px;
    }
    .el-input--suffix .el-input__inner {
      padding-right: 23px;
      position:relative;
    }
    .el-select .el-input.is-focus .el-input__inner {
      z-index:999;
    }
    .el-select .el-input .el-select__caret.is-reverse{
      position:relative;
      z-index:999;
    }
  }
  .schema-panel{
    width: 70%;
    margin-left:-5px;
    .el-input__inner {
      border-radius: 0 2px 2px 0;
    }
    .el-input--suffix .el-input__inner {
      position:relative;
    }
    .el-select .el-input.is-focus .el-input__inner {
      z-index:999;
    }
    .el-select .el-input .el-select__caret.is-reverse{
      position:relative;
      z-index:999;
    }
  }
  .max-height-300{
    max-height:300px;
  }
  .public-status{
    color: #1b95e7;
    border-color:#1b95e7;
  }
  .unPublic-status{
    color: #ffBf00;
    border-color:#ffBf00;
  }
  .checkbox-panel{
    margin-top:7px;
    margin-left:24px;
  }
  .title-hide{
    display:none;
  }
  .scroll-body{
    max-height:300px;
    overflow-y: auto;
  }
}
</style>
