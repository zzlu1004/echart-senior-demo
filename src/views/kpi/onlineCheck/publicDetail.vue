<template>
  <div class="app-container">
    <div class="container-inner has-fixed-bottom bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="bg-gray p2 mb2 relative">
        <div class="h24 bold color-title mb2">{{schema.name}}</div>
        <div>
          <el-row>
            <el-col :span="6">
              <span>考评周期：</span>
              <span>{{(schema.startTime?schema.startTime:'')+'至'+(schema.endTime?schema.endTime:'')}}</span>
            </el-col>
            <el-col :span="6">
              <span>上报截止时间：</span>
              <span>{{schema.deadlineTime}}</span>
            </el-col>
            <el-col :span="6">
              <span>结束时间 ：</span>
              <span>{{schema.finishedDate?schema.finishedDate:''}}</span>
            </el-col>
            <el-col :span="6"></el-col>
          </el-row>
        </div>
        <span class="h16 bd py1 px2 status-box absolute" :class="classObj[schema.isPublic]">
          {{statusMap[schema.isPublic]}}
        </span>
      </div>
      <div class="relative pb2 bd-dashed-bottom">
        <el-row>
          <el-col :span="24"
                class="form-box"
                v-for="item of checkObj"
                :key="item.key">
            <div class="absolute pr1 bold">{{item.label}}：</div>
            <div class="except-w4-full">
              <el-checkbox-group
                v-model="params[item.key]">
                <el-checkbox v-for="info of item.check" :key="info.id" :label="info.id">{{info.name}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-col>
        </el-row>
        <el-button type="primary" size="small" class="absolute btn-position" @click="refreshAllLevel">查询</el-button>
      </div>
      <div>
      <div class="my2">
        <el-row>
          <el-col :span="8" class="bd p2 clearfix">
            <div class="half-width f-left bd-right center bold">
              <div class="pb2">
                已评人数
              </div>
              <div class="color-title h24">
                {{schema.markCount}}/{{schema.staffCount}}
              </div>
            </div>
            <div class="half-width f-left center bold">
              <div class="pb2">
                平均分
              </div>
              <div class="color-title h24">
                {{fd.data.saveFloat(schema.avgScore, 2)}}
              </div>
            </div>
          </el-col>
          <el-col :span="16" class="pl4">
            <div class="bd p2 clearfix">
              <div v-for="(item,index) of schema.grades" :key="item.gradeId"
                  :class="'four-width f-left center bold '+colorObj[item.gradeId]+((index===3)?'':' bd-right')"
                  >
                <div class="pb2">
                  {{item.gradeName}}档（ {{item.markCount}}人 ）
                </div>
                <div class="h24">
                  {{item.percent}}%
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div>
        <div class="clearfix pb2 table-search">
          <span class="f-right btn btn-default btn-sm" @click="downloadTable">
              <i class="at icon-download"/>
              下载
          </span>
          <span class="f-right mr3">
            <fd-search @search="searchByKeyword" v-model="val"></fd-search>
          </span>
        </div>
        <div>
          <fd-table
            :loading="loading"
            :highlightCurrentRow=true
            :border=true
            :sortChange="sortByNum" :sortable=true
            :data="lists">
            <el-table-column
              prop="staffName"
              label="姓名"
              width="130"
              show-overflow-tooltip
              sortable="custom">
              <template slot-scope="scope">
                <span class="color-blue pointer" @click="gotoMyResult(scope.row)">{{scope.row.staffName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="staffTypeName"
              label="人员类型"
              width="130"
              show-overflow-tooltip
              sortable="custom">
            </el-table-column>
            <el-table-column
              prop="departName"
              label="部门"
              width="130"
              show-overflow-tooltip
              sortable="custom">
            </el-table-column>
            <el-table-column
              prop="allScore"
              label="总分"
              align="right"
              width="130"
              show-overflow-tooltip
              sortable="custom">
              <template slot-scope="scope">
                {{fd.data.saveFloat(scope.row.allScore, 2)}}
              </template>
            </el-table-column>
            <el-table-column
              prop="gradeName"
              width="220"
              label="评档"
              sortable="custom">
              <template slot-scope="scope">
                <div>
                  <span v-for="(key, index) of levelMap" :key="key.id">
                    <span :class="'level-box ' + (index === 3 ? '' : 'mr3 ') + (edit ? 'pointer ' : '')+
                    (key.id === scope.row.gradeId ? levelClass[scope.row.gradeId] : '')"
                    v-html="key.name"
                    @click="chooseLevel(key.id, scope.row)">
                    </span>
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="publicGradeReason"
              label="评语"
              show-overflow-tooltip
              sortable="custom">
              <template slot-scope="scope">
                <div v-if="!edit" class="dot-hidden">{{scope.row.publicGradeReason}}</div>
                <div v-else>
                  <el-input v-model="scope.row.publicGradeReason" size="small" @blur="changeGradeReason(scope.row.publicGradeReason, scope.row)"></el-input>
                </div>
              </template>
            </el-table-column>
          </fd-table>
        </div>
        <fd-pagination
          :limit="params.limit"
          :total="total"
          :offset="params.offset"
          sizes="sizes"
          :pageArr="[10,20,30,40,50]"
          :currentChange="currentChange"
          :sizeChange="sizeChange">
      </fd-pagination>
      </div>
      </div>
      <div class="fixed-bottom">
        <div class="fixed-bottom-item" @click="goBack"><div class="fixed-bottom-item-text">返回</div></div>
      </div>
    </div>
  </div>
</template>

<script>
  import FdPagination from 'fd/pagination/pagination'
  import fdTable from 'fd/table/src/fdTable'
  import { goBack } from '@/api/common'
  import { getInfoById, currentChange, sizeChange, gotoMyResult, searchByKeyword, downloadTable,
    getAllLevel, editLevel, chooseLevel, changeLevel, changeGradeReason, refreshAllLevel,
    sortByNum } from '@/api/kpi/onlineCheck/publicDetail'
  export default {
    name: 'publicDetail',
    components: {
      FdPagination, fdTable
    },
    props: {},
    data() {
      return {
        schemaId: '',
        pageSize: 10,
        total: 0,
        edit: false,
        lists: [],
        val: '',
        schema: {},
        levelMap: [],
        statusMap: {
          '1': '已公示',
          '0': '未公示'
        },
        classObj: {
          '1': 'public-status',
          '0': 'unPublic-status'
        },
        levelClass: {
          '1': 'A-box',
          '2': 'B-box',
          '3': 'C-box',
          '4': 'D-box'
        },
        colorObj: {
          '1': 'A-level',
          '2': 'B-level',
          '3': 'C-level',
          '4': 'D-level'
        },
        params: {
          types: [],
          departTypes: [],
          chairs: [],
          schemaId: '',
          limit: 10,
          offset: 0,
          orderField: '',
          orderType: '',
          keyword: ''
        },
        checkObj: [
          {
            key: 'types',
            label: '人员类型',
            check: this.$store.getters.selects['k10003'] // 人员类别
          }, {
            key: 'departTypes',
            label: '部门类型',
            check: this.$store.getters.selects['k10027']
          }, {
            key: 'chairs',
            label: '部门正副职',
            check: [...this.$store.getters.selects['k10010'], { id: 'other', name: '一般干警' }]
          }
        ],
        totalParams: {},
        // 人员类型
        typeMap: this.fd.tools.mapSelects('k10003'),
        loading: false
        // 部门正副职
        // chairMap: this.fd.tools.mapSelects('k10010')
      }
    },
    computed: {
      // 人员类别
      types() {
        return this.$store.getters.selects['k10003']
      },
      // 部门正副职
      chairMap() {
        return this.$store.getters.selects['k10010']
      }
    },
    mounted() {
      this.schemaId = this.$route.query.id || ''
      this.params.schemaId = this.schemaId
      this.edit = (this.$route.query.page === 'edit')
      this.getInfoById()
      this.getAllLevel()
    },
    methods: {
      getInfoById, currentChange, sizeChange, gotoMyResult, searchByKeyword, downloadTable,
      getAllLevel, goBack, editLevel, chooseLevel, changeLevel, changeGradeReason, refreshAllLevel,
      sortByNum
    },
    watch: {
    }
  }
</script>

<style lang="scss" scoped>
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
  .public-status{
    color: #1b95e7;
    border-color:#1b95e7;
  }
  .unPublic-status{
    color: #ffBf00;
    border-color:#ffBf00;
  }
  .btn-position{
    bottom: 16px;
    right: 0;
  }
  .form-box{
    height:30px;
    line-height:30px;
  }
  .half-width{
    width:50%;
  }
  .four-width{
    width:25%;
  }
  .A-level{
    color: #1a95e7;
  }
  .B-level{
    color: #00a853;
  }
  .C-level{
    color: #ffbf00;
  }
  .D-level{
    color: #ef4133;
  }
  .level-box {
    display: inline-block;
    width: 28px;
    height:28px;
    line-height:26px;
    text-align: center;
    border-radius: 2px;
	  border: solid 2px #ebebeb;
    color:#ebebeb;
  }
  .A-box{
    color: #1a95e7;
    border-color: #1a95e7;
  }
  .B-box{
    color: #00a853;
    border-color: #00a853;
  }
  .C-box{
    color: #ffbf00;
    border-color: #ffbf00;
  }
  .D-box{
    color: #ef4133;
    border-color: #ef4133;
  }
</style>
