export function searchByKeyword(val) {
  this.params.keyword = val
  this.params.offset = 0
  this.getAllResult()
}
export function sortByNum(column) {
  this.params.orderField = column.prop
  this.params.orderType = column.order
  this.getAllResult()
}
export function getAllResult() {
  this.loading = true
  const url = 'api/trial-teams/cases/' + this.params.groupId + '/pegging'
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
export function refreshAllResult() {
  this.loading = true
  const url = 'api/trial-teams/cases/' + this.params.groupId + '/pegging'
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
export function currentChange(val) {
  this.params.offset = (val - 1) * this.params.limit
  this.getAllResult()
}
export function sizeChange(val) {
  this.params.limit = val
  this.params.offset = 0
  this.getAllResult()
}
export function changeCols(val) {
  this.caseOpt.columns = []
  for (const item of this.checkboxName) {
    if (val.indexOf(item) > -1) {
      let obj = {}
      obj = {
        field: item,
        title: this.columsObj[item],
        sortable: 'custom',
        minWidth: this.fd.tools.getStringWidth(this.columsObj[item])
      }
      this.caseOpt.columns.push(obj)
    }
  }
}
export function downloadTable() {
  const url = 'api/trial-teams/cases/' + this.params.groupId + '/pegging/export'
  this.fileName = '审判组织（案件）_办案数量（' + this.selfMsg.value + '）'
  this.fileName += '_' + this.params.startTime + '_' + this.params.endTime + '_'
  const titleName = `审判组织（案件）_办案数量（${this.selfMsg.value}）反查表`
  const data = this.fd.tools.merge(true, { fileName: this.fileName, titleName: titleName }, this.params)
  this.fd.tools.download('', url, data)
}
export function getColumns(columns) {
  this.checkedCols = []
  this.checkbox = []
  this.checkboxName = []
  this.caseOpt.columns = []
  for (const item of columns) {
    let obj = {}
    obj = {
      field: item.columnName,
      title: item.columnComment,
      minWidth: this.fd.tools.getStringWidth(item.columnComment),
      sortable: 'custom'
    }
    this.caseOpt.columns.push(obj)
    this.checkbox.push({
      field: item.columnName,
      title: item.columnComment
    })
    this.columsObj[item.columnName] = item.columnComment
    this.checkedCols.push(obj.field)
    this.checkboxName.push(obj.field)
  }
}
