// 查询
export function searchByKeyword(val) {
  this.params.keyword = val
  this.params.offset = 0
  this.getAllResult()
}
// 排序
export function sortByNum(column) {
  this.params.orderField = column.prop
  this.params.orderType = column.order
  this.getAllResult()
}
export function refreshAllResult() {
  this.loading = true
  let url = ''
  if (this.type === 'clerk') {
    url = 'api/analysis/pegging/' + this.type + '/cases'
  } else if (this.type === 'assistant') {
    url = 'api/analysis/pegging/assistant/cases'
  } else {
    url = 'api/analysis/' + this.type + '/pegging/cases'
  }
  this.fd.req({
    url: url,
    method: 'get',
    data: this.params
  }).then((d) => {
    const data = d.data || {}
    this.total = data.total || 0
    this.caseOpt.data = data.data
    this.loading = false
    this.getColumns(data.columns)
  })
}
// 获取表格
export function getAllResult() {
  this.loading = true
  let url = ''
  if (this.type === 'clerk') {
    url = 'api/analysis/pegging/' + this.type + '/cases'
  } else if (this.type === 'assistant') {
    url = 'api/analysis/pegging/assistant/cases'
  } else {
    url = 'api/analysis/' + this.type + '/pegging/cases'
  }
  this.fd.req({
    url: url,
    method: 'get',
    data: this.params
  }).then((d) => {
    const data = d.data || {}
    this.total = data.total || 0
    this.caseOpt.data = data.data
    this.loading = false
  })
}
// 点击分页
export function currentChange(val) {
  this.params.offset = (val - 1) * this.params.limit
  this.getAllResult()
}
// 改变分页的每页展示数量
export function sizeChange(val) {
  this.params.limit = val
  this.params.offset = 0
  this.getAllResult()
}
// 自定义列表
export function changeCols(val) {
  this.caseOpt.columns = []
  for (const item of this.checkboxName) {
    if (val.indexOf(item) > -1) {
      let obj = {}
      obj = {
        field: item,
        title: this.columsObj[this.type][item],
        sortable: 'custom',
        minWidth: this.fd.tools.getStringWidth(this.columsObj[this.type][item])
      }
      this.caseOpt.columns.push(obj)
    }
  }
}
// 下载表格
export function downloadTable(exportType) {
  const url = exportType ? ('api/analysis/export/' + exportType) : 'api/analysis/index/pegging/cases/download'
  let titleName = ''
  if (this.resource === 'center_judge' || this.resource === 'center_assistant' || this.resource === 'center_clerk') {
    this.fileName = '办案工作_' + this.selfMsg.weightName + '_' + this.typeMap[this.type] + '_' + this.userName + '_' +
      this.selfMsg.index + '_' + this.params.startTime + '至' + this.params.endTime + '_'
    titleName = `${this.userName}_${this.selfMsg.index}反查表`
  } else {
    this.fileName = (this.type === 'index' ? '' : '办案工作_') + (this.selfMsg.weightName ? this.selfMsg.weightName + '_' : '') + this.typeMap[this.type] + '_' + this.selfMsg.departName + '_' +
      this.selfMsg.index + '_' + this.params.startTime + '至' + this.params.endTime + '_'
    titleName = `${this.selfMsg.departName}_${this.selfMsg.index}反查表`
  }
  const data = this.fd.tools.merge(true, { fileName: this.fileName, titleName: titleName }, this.params)
  this.fd.tools.download('', url, data)
}
// 获取表头及自定义列表的checkbox内的内容
export function getColumns(columns) {
  this.checkedCols = [] // checkbox中被选中的选项
  this.checkbox = [] // checkbox中所有选项
  this.checkboxName = []
  this.caseOpt.columns = []
  for (const item of columns) {
    let obj = {}
    obj = {
      field: item.content,
      title: item.comments,
      minWidth: this.fd.tools.getStringWidth(item.comments),
      sortable: 'custom'
    }
    this.caseOpt.columns.push(obj)
    this.checkbox.push({
      field: item.content,
      title: item.comments
    })
    this.columsObj[this.type][item.content] = item.comments
    this.checkedCols.push(obj.field)
    this.checkboxName.push(obj.field)
  }
}
