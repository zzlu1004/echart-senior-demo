<template>
<div class="app-container">
    <div class="bg-white container-inner clearfix h14" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
        <div class="clearfix mb2">
            <span class="f-left align-middle">
                <span v-if="elements.add" class="btn btn-sm btn-primary" @click="addProcess">
                  <i class="at icon-plus"/>新增流程
                </span>
            </span>
            <span class="f-right height-normal line-height-normal align-middle">
                <span>生效中</span>
                <el-popover
                    placement="bottom"
                    width="310"
                    trigger="hover"
                    content="当前所关联的方案正在生效周期中，为了保证考核方案的正常实施，系统暂时不开放对该方案相关的细则、指标、流程以及权重系数等进行编辑或删除操作。">
                    <i slot="reference" class="at icon-questioncircle color-d9d9d9 pointer"/>
                </el-popover>
            </span>
            <span class="f-right mr2">
              <fd-search @search="searchByKeyword"
                         v-model="searchVal"></fd-search>
            </span>
        </div>
        <div>
            <fd-table
            :loading="loading"
            :option="processOption"
            @cellClick="gotoDetail"
            ></fd-table>
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
</template>

<script>
    import fdTable from 'fd/table'
    import FdPagination from 'fd/pagination/pagination'
    import { addProcess, editProcess, copyProcess, deleteProcess,
      searchByKeyword, getAllProcess, currentChange, sizeChange, gotoDetail } from '@/api/kpi/checkDepart/checkProcessDepart'
    export default {
      name: 'checkProcessDepart',
      data() {
        return {
          searchVal: '',
          total: 0,
          pageSize: 10,
          params: {
            limit: 10,
            offset: 0,
            keyword: ''
          },
          loading: false,
          teamMap: this.fd.tools.mapSelects('k10031'), // 指定团队
          higherLevelMap: this.fd.tools.mapSelects('k10028'), // 直属等级
          processOption: {
            stripe: true,
            border: true,
            data: [],
            columns: [
              {
                field: 'name',
                title: '流程名称',
                showOverflowTooltip: true,
                formatter: (row, value) => {
                  return '<span class="color-blue pointer">' + value + '</span>'
                }
              },
              {
                field: 'content',
                title: '详情描述',
                showOverflowTooltip: true
              },
              {
                field: 'flowNodeList',
                title: '流程设置',
                showOverflowTooltip: true,
                formatter: (row, value) => {
                  const staffTypeMap = {
                    '1': '考核对象',
                    '3': 'staffName',
                    '4': 'roleName'
                  }
                  let html = ''
                  for (let i = 0; i < value.length; i++) {
                    if (value[i].staffType === '1') {
                      html += '<span>' + (staffTypeMap[value[i].staffType] || '--') + '</span>'
                    } else if (value[i].staffType === '2') {
                      html += '<span>' + (this.higherLevelMap[value[i].higherLevel] || '--') + '</span>'
                    } else if (value[i].staffType === '3' || value[i].staffType === '4') {
                      html += '<span>' + (value[i][staffTypeMap[value[i].staffType]] || '--') + '</span>'
                    } else if (value[i].staffType === '5') {
                      html += '<span>' + (this.teamMap[value[i].teamType] || '--') + '</span>'
                    }
                    if (value[i].staffType === '2' || value[i].staffType === '4' || value[i].staffType === '5') {
                      html += '<span>' + (value[i].approvalType === 'k10029-01' ? '(会签)' : '(或签)') + '</span>'
                    }
                    html += (i !== value.length - 1) ? '<span>>></span>' : ''
                  }
                  return html
                }
              },
              {
                field: 'statusId',
                title: '当前状态',
                width: '150px',
                formatter: (row, value) => {
                  const statusMap = {
                    '1': '已生效',
                    '0': '未生效'
                  }
                  return statusMap[value]
                }
              },
              {
                field: '',
                title: '操作',
                width: this.fd.tools.getStringWidth('操作3'),
                number: [{ text: '编辑', type: 'text', show: 'hasEdit', disabled: 'isedit', click: (d, row) => { this.editProcess(row) } },
                  { text: '复制', type: 'text', show: 'hasCopy', click: (d, row) => { this.copyProcess(row) } },
                  { text: '删除', type: 'text', show: 'hasDelete', disabled: 'isdelete', click: (d, row) => { this.deleteProcess(row) } }
                ]
              }
            ]
          }
        }
      },
      components: { fdTable, FdPagination },
      methods: {
        addProcess, editProcess, copyProcess, deleteProcess,
        searchByKeyword, getAllProcess, currentChange, sizeChange,
        gotoDetail
      },
      computed: {
        elements() {
          return this.$store.getters.elements.checkProcessDepart || {}
        }
      },
      mounted() {
      },
      activated() {
        this.getAllProcess()
      }
    }
</script>

<style lang="scss" scoped>
    .height-normal {
        height:32px;
    }
    .line-height-normal{
        line-height:32px;
    }
    .pr-60px{
        padding-right:60px;
    }
    .color-d9d9d9{
      color:#d9d9d9;
    }
</style>
