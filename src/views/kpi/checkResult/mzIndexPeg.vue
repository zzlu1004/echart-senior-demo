<template>
  <div class="app-container">
    <div class="bg-white container-inner has-fixed-bottom clearfix h14 check-list" :style="{'min-height':height}">
      <div class="bd-dashed-bottom pb2 mb2">
        <div class="clearfix mb2 height50 line-height-50">
          <div class="f-left color-title bold h20">{{schema.staffName || '--'}}</div>
        </div>
        <div>
          <el-row class="mb2">
            <el-col :span="8">
              <div class="f-left pr1 color-title">考核周期:</div>
              <div class="hidden text-indent0">{{schema.schemaStartTime || '--'}}至{{schema.schemaEndTime}}</div>
            </el-col>
            <el-col :span="8">
              <div class="f-left pr1 color-title">上报截止时间:</div>
              <div class="hidden text-indent0">{{schema.schemaDeadlineTime || '--'}}</div>
            </el-col>
            <el-col :span="8">
              <div class="f-left pr1 color-title">结束时间:</div>
              <div class="hidden text-indent0">{{schema.schemaFinishedTime || '--'}}</div>
            </el-col>
          </el-row>
        </div>
      </div>
    <div v-if="isShow">
        <el-table
            id="tableDetail"
            :data="tableData"
            border
            style="width: 100%">
          <!--指标得票一列-->
          <el-table-column
            prop=""
            :label="schema.indexName">
            <template slot-scope="scope">
             <span v-for="(items, index) of scope.row.scores" :key="items.id" v-if="getTargetData(items)">
              <span>{{items.total}}</span>
            </span>
            </template>
          </el-table-column>
            <fd-columns
                v-for="item of tree"
                :key="item.menuId"
                :label="item.menuName"
                :indexs="tableData"
                :data="item"></fd-columns>
        </el-table>
      </div>
      <div class="fixed-bottom">
        <div class="pt2">
          <el-button size="small" type="primary" @click="goBack">返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getRuleDetailById, refreshTableData, onProgress } from '@/api/kpi/checkResult/mzIndexPeg'
  import { goBack } from '@/api/common'
  import FdColumns from '../components/onlineCheckCom/fdMzIndexColumns.vue'
  import popBtn from 'fd/popoverButton/src/popBtn.vue'
  export default {
    name: 'mzIndexPeg',
    data() {
      return {
        fileList: [],
        height: (this.$store.getters.globals.height - 100) + 'px',
        headers: { 'Authorization': this.$store.getters.token },
        isShow: false,
        id: '',
        aaa: '111',
        params: {},
        schema: {},
        tableData: [],
        tree: [],
        heads: [],
        hasActive: false,
        loading: null,
        obj: {}
      }
    },
    components: {
      popBtn,
      FdColumns
    },
    methods: {
      getRuleDetailById, refreshTableData, onProgress, goBack,
      getTargetData(val, menu) {
        if (val.gear_id === '1234567') {
          return true
        } else {
          return false
        }
      },
      toshow(msg) {
        this.gearChooseArr = msg
      }
    },
    computed: {
    },
    mounted() {
      this.obj = JSON.parse(localStorage.getItem('params'))
      this.schema = JSON.parse(localStorage.getItem('schema'))
      this.schema.staffName = this.obj.staffName
      this.schema.indexName = this.obj.indexName
      this.id = this.$route.query.id || ''
      // 从上一个页面带来的方案id，细则id，考核类别，本人登录的人员id
      this.params = {
        staffId: this.obj.staffId || '',
        schemaId: this.obj.schemaId || '',
        schemaBlockType: this.obj.schemaBlockType || ''
      }
      this.getRuleDetailById()
    },
    watch: {
    }
  }
</script>

<style lang="scss">
  .check-list{
    .color-d9d9d9{
      color:#d9d9d9;
    }
    .attachForm {
      .el-input__inner{
        border:none;
      }
    }
    .el-upload__tip{
      div{
        line-height:14px;
      }
    }
    .el-popover{
      color:inherit;
    }
    .height50{
      height:50px;
    }
    .line-height-50{
      line-height:50px;
    }
    .file-uploads {
      vertical-align: bottom;
    }

    .file-uploads.file-uploads-html4 {
      display: inline-block;
      position: relative;
      width: 70px;
      height: 40px;
      line-height:1;
    }
    .file-uploads.file-uploads-html4 input, .file-uploads.file-uploads-html5 label {
      /* background fix ie  click */
      background: #fff;
      opacity: 0;
      font-size: 20em;
      z-index: 1;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
</style>
