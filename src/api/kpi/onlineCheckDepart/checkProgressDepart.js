// 考核进度
export function getCompletes() {
  this.loading = true
  this.fd.req({
    url: 'api/dept/assessment-progress',
    method: 'get',
    data: this.fd.tools.merge(true, {}, this.baseParams, this.params)
  }).then((d) => {
    const data = d.data || {}
    this.loading = false
    this.total = data.total || 0
    this.levelOption.data = data.data || []
  })
}
// 待办进度
export function getTodos() {
  this.loading2 = true
  this.fd.req({
    url: 'api/dept/assessment-progress',
    method: 'get',
    data: this.fd.tools.merge(true, {}, this.baseParams, this.params2)
  }).then((d) => {
    const data = d.data || {}
    this.loading2 = false
    this.total2 = data.total || 0
    this.todoOption.data = data.data || []
  })
}
// 点击查询按钮，调取考核进度和待办进度接口
export function getAllTables() {
  this.params.offset = 0
  this.params2.offset = 0
  this.getCompletes()
  this.getTodos()
}
// 下载table
export function downloadTable() {
  const url = 'api/dept/assessment-progress/download'
  this.fileName = (this.schemaMap[this.baseParams.schemaId] ? this.schemaMap[this.baseParams.schemaId] + '_' : '') +
    (this.baseParams.schemaBlockType ? this.schemaBlockMap[this.baseParams.schemaBlockType] + '_' : '') + (this.baseParams.type === 'complete' ? '考核进度_' : '待办进度_')
  const params = this.baseParams.type === 'complete' ? this.params : this.params2
  const data = this.fd.tools.merge(true, {}, this.baseParams, params, { fileName: this.fileName })
  this.fd.tools.download('', url, data)
}
// 考核进度-换页
export function currentChange(val) {
  this.params.offset = (val - 1) * this.params.limit
  this.getCompletes()
}
// 待办进度-换页
export function currentChange2(val) {
  this.params2.offset = (val - 1) * this.params2.limit
  this.getTodos()
}
// 考核进度-排序
export function sortByNum(column) {
  if (column.prop === 'complete') {
    this.params.orderField = 'completeRat'
  } else if (column.prop === 'approve') {
    this.params.orderField = 'approveRat'
  } else {
    this.params.orderField = column.prop
  }
  this.params.orderType = column.order
  this.getCompletes()
}
// 待办进度-排序
export function sortByNum2(column) {
  if (column.prop === 'complete') {
    this.params2.orderField = 'completeRat'
  } else if (column.prop === 'approve') {
    this.params2.orderField = 'approveRat'
  } else {
    this.params2.orderField = column.prop
  }
  this.params2.orderType = column.order
  this.getTodos()
}
// 考核进度-查询
export function searchByKeyword(val) {
  this.params.keyword = val
  this.params.offset = 0
  this.getCompletes()
}
// 待办进度-查询
export function searchByKeyword2(val) {
  this.params2.keyword = val
  this.params2.offset = 0
  this.getTodos()
}
// 考核进度-分页
export function sizeChange(val) {
  this.params.limit = val
  this.params.offset = 0
  this.getCompletes()
}
// 待办进度-分页
export function sizeChange2(val) {
  this.params2.limit = val
  this.params2.offset = 0
  this.getTodos()
}
// 获取方案
export function getActiveSchemas() {
  this.fd.req({
    type: 'get',
    url: 'api/dept/schemas/status-list',
    data: { status: 'active' }
  }).then(response => {
    const data = response.data || []
    this.schemaOpt = data
    this.baseParams.schemaId = data.length > 0 ? data[0].id : ''
    for (const item of data) {
      this.schemaMap[item.id] = item.name
    }
    this.getCompletes()
    this.getTodos()
  }).catch(() => {
  })
}
