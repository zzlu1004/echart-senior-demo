<template>
<div class="app-container">
    <div class="bg-white container-inner clearfix h14 level" :style="{'min-height':height}">
      <div class="tab-box">
        <el-tabs v-model="indexModels" type="card"  @tab-click="changeIndexModels">
          <el-tab-pane label="已结束方案" name="finished">
            <div v-show="indexModels ==='finished'">
              <div class="pb2 clearfix">
                <div class="f-right">
                  <fd-search @search="searchByKeyword" v-model="searchVal"></fd-search>
                </div>
              </div>
              <div>
                <fd-table
                  :loading="loading"
                  :option="levelOption"
                  @cellClick="gotoDetail"
                ></fd-table>
              </div>
              <fd-pagination
                :limit="params.limit"
                :offset="params.offset"
                :total="total"
                sizes="sizes"
                :pageArr="[10,20,30,40,50]"
                :currentChange="currentChange"
                :sizeChange="sizeChange">
              </fd-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="生效中方案" name="active">
            <div v-show="indexModels ==='active'">
              <div class="pb2 clearfix">
                <div class="f-right">
                  <fd-search @search="searchByKeywordActive" v-model="searchValActive"></fd-search>
                </div>
              </div>
              <div>
                <fd-table
                  :loading="loading"
                  :option="activeOption"
                ></fd-table>
              </div>
              <fd-pagination
                :limit="activeParams.limit"
                :offset="activeParams.offset"
                :total="activeTotal"
                sizes="sizes"
                :pageArr="[10,20,30,40,50]"
                :currentChange="activeCurrentChange"
                :sizeChange="activeSizeChange">
              </fd-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <fd-dialog
          title="绩效结果公示"
          :syncVisible="visible"
          @beforeClose="visible = false"
          ref="form"
        >
          <div slot="fd-body">
            <el-form>
              <div class="py1">配置向被考核人公示范围</div>
              <el-form-item>
                <el-checkbox-group v-model="form.publicColumn">
                  <el-checkbox label="评档结果" disabled name="评档结果"></el-checkbox>
                  <el-checkbox label="指标值" disabled name="指标值"></el-checkbox>
                  <el-checkbox label="指标值反查" disabled name="指标值反查"></el-checkbox>
                  <el-checkbox label="指标分数" disabled name="指标分数"></el-checkbox>
                  <el-checkbox label="绩效总分" disabled name="绩效总分"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <div class="color-forbid" style="height: 17px;" v-html="content"></div>
            </el-form>
          </div>
          <div slot="fd-footer">
            <el-button size="small" @click="visible = false">取消</el-button>
            <el-button size="small" type="primary" @click="surePublic">确定</el-button>
          </div>
        </fd-dialog>
    </div>
</div>
</template>

<script>
    import fdTable from 'fd/table'
    import fdDialog from 'fd/dialog/src/dialog.vue'
    import FdPagination from 'fd/pagination/pagination'
    import { changeIndexModels, editPublic, publicing, callPublic, publicingActive, callPublicActive,
      searchByKeyword, searchByKeywordActive, getAllPublic, getAllActivePublic, currentChange, sizeChange, activeCurrentChange
      , activeSizeChange, gotoDetail, surePublic } from '@/api/kpi/onlineCheck/levelPublic'
    export default {
      name: 'levelPublic',
      mixins: [],
      data() {
        return {
          indexModels: 'finished',
          height: (this.$store.getters.globals.height - 100) + 'px',
          searchValActive: '',
          searchVal: '',
          pageSize: 10,
          total: 0,
          activeTotal: 0,
          visible: false,
          loading: false,
          form: {
            publicColumn: ['评档结果', '指标值', '指标值反查', '指标分数', '绩效总分']
          },
          schemaId: '',
          content: '',
          params: {
            schemaName: '',
            limit: 10,
            offset: 0
          },
          activeParams: {
            schemaName: '',
            limit: 10,
            offset: 0
          },
          levelOption: {
            stripe: true,
            border: true,
            data: [],
            columns: [
              {
                field: 'index',
                title: '序号',
                width: '60px'
              },
              {
                field: 'name',
                title: '方案名称',
                showOverflowTooltip: true,
                formatter: (row, value) => {
                  return '<span class="color-blue pointer">' + value + '</span>'
                }
              },
              {
                field: 'content',
                title: '评档进度 ',
                formatter: (row, value) => {
                  return row.markCount + '/' + row.staffCount
                }
              },
              {
                field: 'isPublic',
                title: '公示状态',
                formatter: (row, value) => {
                  const statusMap = {
                    '1': '已公示',
                    '0': '未公示'
                  }
                  return statusMap[value]
                }
              },
              {
                field: 'publicColumn',
                title: '公示范围',
                showOverflowTooltip: true
              },
              {
                field: '',
                title: '操作',
                width: '180px',
                number: [{ text: '编辑', type: 'text', show: 'isedit', click: (d, row) => { this.editPublic(row) } },
                  { text: '公示', type: 'text', show: 'isPub', click: (d, row) => { this.publicing(row) } },
                  { text: '撤回公示', type: 'text', show: 'isCall', click: (d, row) => { this.callPublic(row) } }
                ]
              }
            ]
          },
          activeOption: {
            stripe: true,
            border: true,
            data: [],
            columns: [
              {
                field: 'index',
                title: '序号',
                width: '60px'
              },
              {
                field: 'name',
                title: '方案名称',
                showOverflowTooltip: true
              },
              {
                field: 'display',
                title: '公开状态',
                formatter: (row, value) => {
                  const statusMap = {
                    '1': '已公开',
                    '0': '未公开'
                  }
                  return statusMap[value]
                }
              },
              {
                field: '',
                title: '操作',
                width: '180px',
                number: [
                  { text: '公开', type: 'text', show: 'isPub', click: (d, row) => { this.publicingActive(row) } },
                  { text: '撤回公开', type: 'text', show: 'isCall', click: (d, row) => { this.callPublicActive(row) } }
                ]
              }
            ]
          }
        }
      },
      components: {
        fdTable, FdPagination, fdDialog
      },
      hooks() {},
      mounted() {
      },
      activated() {
        this.getAllPublic()
      },
      methods: {
        changeIndexModels, editPublic, publicing, callPublic, publicingActive, callPublicActive, surePublic,
        searchByKeyword, searchByKeywordActive, getAllPublic, getAllActivePublic, currentChange, sizeChange, activeCurrentChange, activeSizeChange, gotoDetail
      }
    }
</script>

<style lang="scss">
.level {
  .el-form-item{
    margin-bottom:0;
  }
}
</style>
