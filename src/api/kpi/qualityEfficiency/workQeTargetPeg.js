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
  let url = ''
  if (this.resource === 'center_workQe') {
    url = 'api/analysis/quality/index/judge/inspection'
  } else {
    url = 'api/analysis/quality/index/' + this.type + '/inspection'
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
export function refreshAllResult() {
  this.loading = true
  let url = ''
  if (this.resource === 'center_workQe') {
    url = 'api/analysis/quality/index/judge/inspection'
  } else {
    url = 'api/analysis/quality/index/' + this.type + '/inspection'
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
        title: this.columsObj[this.type][item],
        sortable: 'custom',
        minWidth: this.fd.tools.getStringWidth(this.columsObj[this.type][item])
      }
      this.caseOpt.columns.push(obj)
    }
  }
}
export function downloadTable() {
  let url = ''
  let titleName = ''
  if (this.resource === 'center_workQe') {
    url = 'api/analysis/quality/index/judge/inspection/download'
    titleName = `${this.userName}_${this.selfMsg.index}反查表`
    this.fileName = '工作质效_' + this.selfMsg.targetName + '_' + this.typeMap[this.type] + '_' + this.userName + '_' +
      this.selfMsg.index + '_' + this.params.startTime + '至' + this.params.endTime + '_'
  } else {
    url = 'api/analysis/quality/index/' + this.type + '/inspection/download'
    titleName = `${this.selfMsg.departName}_${this.selfMsg.index}反查表`
    this.fileName = this.pageMap[this.resource] + '_' + (this.selfMsg.targetName ? this.selfMsg.targetName + '_' : '') + this.typeMap[this.type] + '_' + this.selfMsg.departName + '_' +
      this.selfMsg.index + '_' + this.params.startTime + '至' + this.params.endTime + '_'
  }
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
