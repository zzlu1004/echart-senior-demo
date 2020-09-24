export function getDepartTotal() {
  if (!this.elements.depart) {
    return
  }
  this.params.startTime = this.fd.tools.firstDayOfMonth(this.params.startTime)
  this.params.endTime = this.fd.tools.endDayOfMonth(this.params.endTime)
  const data = this.fd.tools.merge(true, {}, this.params, this.departParams)
  this.fd.req({
    url: 'api/analysis/doc/type',
    method: 'get',
    data: data
  }).then((d) => {
    const data = d.data || {}
    this.departOpt.data = data.data
  })
}
export function sortByNum(column) {
  this.personParams.orderField = column.prop
  this.personParams.orderType = column.order
  this.getPersonTotal()
}
export function sortByNum1(column) {
  this.departParams.orderField = column.prop
  this.departParams.orderType = column.order
  this.getDepartTotal()
}
export function sortByNum2(column) {
  this.personParams.orderField = column.prop
  this.personParams.orderType = column.order
  this.getPersonTotal()
}
export function getPersonTotal() {
  if (!this.elements.person) {
    return
  }
  this.params.startTime = this.fd.tools.firstDayOfMonth(this.params.startTime)
  this.params.endTime = this.fd.tools.endDayOfMonth(this.params.endTime)
  const data = this.fd.tools.merge(true, {}, this.params, this.personParams)
  this.fd.req({
    url: 'api/analysis/doc/type',
    method: 'get',
    data: data
  }).then((d) => {
    const data = d.data || {}
    this.personOpt.data = data.data
    this.total = data.total
  })
}
export function downloadTable() {
  this.fileName = '综合工作_' + this.pageMap[this.page] + '_' + this.typeMap[this.type] + '_'
  const params1 = (this.type === 'depart') ? this.departParams : this.personParams
  const url = 'api/analysis/doc/type/download'
  this.params.startTime = this.fd.tools.firstDayOfMonth(this.params.startTime)
  this.params.endTime = this.fd.tools.endDayOfMonth(this.params.endTime)
  const data = this.fd.tools.merge(true, {}, params1, this.params, { fileName: this.fileName })
  this.fd.tools.download('', url, data)
}
export function refreshCondition() {
  this.isRefresh = !this.isRefresh
  this.personParams.limit = 10
  this.personParams.offset = 0
  this.personParams.keyword = this.val2
  this.personParams.orderField = ''
  this.personParams.orderType = ''
  this.$refs.personOpt.$children[0].clearSort()
  this.departParams.orderField = ''
  this.departParams.orderType = ''
  this.$refs.departOpt.$children[0].clearSort()
  this.departParams.keyword = this.val
}
export function refreshAll() {
  this.refreshCondition()
  this.getDepartTotal()
  this.getPersonTotal()
  this.getVbarData()
  this.getCourtTotal()
}
// 表格中发文数的反查
export function countPeg(row, column, cell, event) {
  if (!this.elements[this.page + 'Peg']) {
    return
  }
  let selfMsg = {}
  const docMap = {
    'allDoc': 'doc',
    'sendDoc': 'send',
    'recDoc': 'rec'
  }
  const name = (this.type === 'depart') ? 'departName' : 'name'
  if (column.property === 'allDoc' || column.property === 'sendDoc' || column.property === 'recDoc') {
    // 合计显示‘--’ todo
    selfMsg = { departName: row[name] || '--', index: column.label, value: row[column.property], page: this.pageMap[this.page] }
    const obj = {
      params: {
        startTime: this.fd.tools.firstDayOfMonth(this.params.startTime),
        endTime: this.fd.tools.endDayOfMonth(this.params.endTime),
        jobType: this.params.jobType,
        docType: docMap[column.property]
      },
      selfMsg: selfMsg
    }
    localStorage.setItem('params', JSON.stringify(obj))
    this.fd.tools.goDetail.call(this, 'totalWorkPeg', { query: { id: row.id,
      type: this.type, page: this.page, resource: 'total_' + this.page }})
  }
}
// 左边卡片数据
export function getCourtTotal() {
  // if (!this.elements.person) {
  //   return
  // }
  this.params.startTime = this.fd.tools.firstDayOfMonth(this.params.startTime)
  this.params.endTime = this.fd.tools.endDayOfMonth(this.params.endTime)
  const data = this.fd.tools.merge(true, {}, this.params, this.personParams)
  this.fd.req({
    url: 'api/analysis/doc/type/total',
    method: 'get',
    data: data
  }).then((d) => {
    const data = d.data || {}
    this.courtObj = data
  })
}
// 各部门人均业绩对比柱状图
export function getVbarData() {
  this.vbarOpt.data = []
  this.vbarOptTotal.data = []
  // if (!this.elements.person) {
  //   return
  // }
  this.params.startTime = this.fd.tools.firstDayOfMonth(this.params.startTime)
  this.params.endTime = this.fd.tools.endDayOfMonth(this.params.endTime)
  const data = this.fd.tools.merge(true, {}, this.params, this.personParams)
  this.fd.req({
    url: 'api/analysis/doc/type/echart',
    method: 'get',
    data: data
  }).then((d) => {
    const data = d.data || []
    data.forEach((item, index) => {
      if (item.seriesName === '发文总数') {
        this.vbarOpt.data.push(item)
      } else {
        this.vbarOptTotal.data.push(item)
      }
    })
    this.vbarOpt.chart.resize()
    this.vbarOptTotal.chart.resize()
  })
}

