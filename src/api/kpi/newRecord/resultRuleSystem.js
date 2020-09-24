export function sortByNum(column) {
  if (this.type === 'year') {
    this.yearParams.orderField = column.prop
    this.yearParams.orderType = column.order
    this.getYearTotal()
  } else {
    this.monthParams.orderField = column.prop
    this.monthParams.orderType = column.order
    this.getMonthTotal()
  }
}
export function getYearTotal() {
  const url = 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/doc/type'
  const data = this.fd.tools.merge(true, {}, this.params, this.yearParams)
  this.fd.req({
    url: url,
    method: 'get',
    data: data
  }).then((d) => {
    const data = d.data || {}
    this.yearOpt.data = data.data
    this.yearTotal = data.total
  })
}
export function getMonthTotal() {
  const url = 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/doc/type'
  const data = this.fd.tools.merge(true, {}, this.params, this.monthParams)
  this.fd.req({
    url: url,
    method: 'get',
    data: data
  }).then((d) => {
    const data = d.data || {}
    this.monthOpt.data = data.data
    this.monthTotal = data.total
  })
}
export function downloadTable() {
  this.fileName = this.menuMap[this.page] + '_' + this.typeMap[this.type] + '_' + (this.userId ? this.userName + '_' : '_')
  const url = 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/doc/type/download'
  this.params.startTime = this.fd.tools.firstDayOfMonth(this.params.startTime)
  this.params.endTime = this.fd.tools.endDayOfMonth(this.params.endTime)
  const params = (this.type === 'year') ? this.yearParams : this.monthParams
  this.params.startTime = this.fd.tools.firstDayOfMonth(this.params.startTime)
  this.params.endTime = this.fd.tools.endDayOfMonth(this.params.endTime)
  const data = this.fd.tools.merge(true, {}, this.params, params, { fileName: this.fileName })
  this.fd.tools.download('', url, data)
}
export function refreshCondition() {
  this.yearParams.limit = 10
  this.yearParams.offset = 0
  this.yearParams.keyword = this.val
  this.yearParams.orderField = ''
  this.yearParams.orderType = ''
  this.monthParams.limit = 10
  this.monthParams.offset = 0
  this.monthParams.keyword = this.val2
  this.monthParams.orderField = ''
  this.monthParams.orderType = ''
}
export function refreshAll() {
  this.refreshCondition()
  this.getYearTotal()
  this.getMonthTotal()
}
// 表格中发文数量的反查
export function countPeg(row, column, cell, event) {
  const peg = this.parentMenu + 'Peg'
  if (!this.elements[peg]) {
    return
  }
  let selfMsg = {}
  // 综合工作-办文-反查
  if (column.property === 'allDoc' || column.property === 'sendDoc' || column.property === 'recDoc') {
    // 合计显示‘--’ todo
    selfMsg = { departName: row.name || '--', index: column.label, value: row[column.property],
      label: column.label, page: this.pageMap[this.page], userName: this.userName }
    const obj = {
      params: {
        startTime: '',
        endTime: '',
        weightId: '',
        docType: this.docMap[column.property],
        jobType: this.params.jobType
      },
      selfMsg: selfMsg
    }
    if (this.type === 'year') {
      obj.params.startTime = this.fd.tools.firstDayOfMonth(row.name + '-01')
      obj.params.endTime = this.fd.tools.endDayOfMonth(row.name + '-12')
    } else {
      obj.params.startTime = this.fd.tools.firstDayOfMonth(row.name)
      obj.params.endTime = this.fd.tools.endDayOfMonth(row.name)
    }
    localStorage.setItem('params', JSON.stringify(obj))
    this.fd.tools.goDetail.call(this, 'totalWorkPeg', { query: { userId: this.userId || this.$store.getters.user.id,
      id: row.id, type: this.type, page: this.page, resource: 'work_result_' + this.page }})
  }
}
// 自定义列表联动表格的表头显示
export function changeCols(val) {
  const peg = this.parentMenu + 'Peg'
  const opt = (this.type === 'year') ? this.yearOpt : this.monthOpt
  opt.columns = []
  for (const item of this.checkboxName) {
    if (val.indexOf(item) > -1) {
      let obj = {}
      if (item === 'name' || item === 'staffName') {
        obj = {
          field: item,
          title: this.columsObj['writing'][item],
          sortable: 'custom',
          minWidth: 180
        }
      } else {
        obj = {
          field: item,
          title: this.columsObj['writing'][item],
          sortable: 'custom',
          minWidth: 180,
          formatter: (row, value) => {
            return this.elements[peg] ? '<span class="color-blue pointer">' + value + '</span>' : value
          }
        }
      }
      opt.columns.push(obj)
    }
  }
}
