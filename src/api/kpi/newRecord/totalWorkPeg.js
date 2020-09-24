export function sortByNum(column) {
  this.params.orderField = column.prop
  this.params.orderType = column.order
  this.getAllResult()
}
export function changeCols(val) {
  this.caseOpt.columns = []
  const head = this.headMap[this.params[this.columnType]]
  for (const item of this.checkboxName) {
    if (val.indexOf(item) > -1) {
      let obj = {}
      obj = {
        field: item,
        title: head[item],
        sortable: 'custom',
        minWidth: this.fd.tools.getStringWidth(head[item])
      }
      this.caseOpt.columns.push(obj)
    }
  }
}
export function getColumns() {
  const head = this.headMap[this.params[this.columnType]]
  this.checkedCols = []
  this.checkbox = []
  this.checkboxName = []
  let obj = {}
  this.caseOpt.columns = []
  for (const item in head) {
    obj = {
      field: item,
      title: head[item],
      sortable: 'custom',
      minWidth: this.fd.tools.getStringWidth(head[item])
    }
    this.caseOpt.columns.push(obj)
    this.checkbox.push({
      field: item,
      title: head[item]
    })
    this.checkedCols.push(obj.field)
    this.checkboxName.push(obj.field)
  }
}
export function getAllResult() {
  this.loading = true
  const data = this.fd.tools.merge(true, {}, this.params, { type: this.type, id: this.id })
  this.fd.req({
    url: this.url[this.resource].list,
    method: 'get',
    data: data
  }).then((d) => {
    const data = d.data || {}
    this.total = data.total || 0
    this.caseOpt.data = data.data
    this.loading = false
  })
}
export function initResult() {
  this.getColumns()
  this.getAllResult()
}
export function downloadTable() {
  // 我的档案-综合工作-办文 || 我的档案-其他-其他
  if (this.resource === 'work_result_writing' ||
    this.resource === 'work_result_ruleSystem' ||
    this.resource === 'work_result_specialWork' ||
    this.resource === 'work_result_workSummary' ||
    this.resource === 'work_result_researchReport' ||
    this.resource === 'work_result_runMeeting' ||
    this.resource === 'work_result_typeOther' ||
    this.resource === 'center_other') {
    this.fileName = this.menuMap[this.resource] + '_' + this.typeMap[this.type] + '_' + this.userName + '_' +
      this.selfMsg.index + '_' + this.params.startTime + '至' + this.params.endTime + '_'
  } else {
    this.fileName = this.menuMap[this.resource] + '_' + this.typeMap[this.type] + '_' + this.selfMsg.departName + '_' +
      this.selfMsg.index + '_' + this.params.startTime + '至' + this.params.endTime + '_'
  }
  const url = this.url[this.resource].download
  const data = this.fd.tools.merge(true, {}, this.params, { type: this.type, id: this.id, fileName: this.fileName })
  this.fd.tools.download('', url, data)
}
export function searchByKeyword(val) {
  this.params.keyword = val
  this.params.offset = 0
  this.getAllResult()
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
