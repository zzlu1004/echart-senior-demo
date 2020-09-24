export function choosePage() {
}
// 开始时间和结束时间的限制
export function changeStartTime() {
  this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
    disabledDate: (time) => {
      const disabledDate = time.getTime() > new Date(this.params.endTime).getTime()
      return disabledDate
    }
  })
}
export function changeEndTime() {
  this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
    disabledDate: (time) => {
      const disabledDate = time.getTime() < new Date(this.params.startTime).getTime()
      return disabledDate
    }
  })
}
export function searchByKeyword(val) {
  if (this.type === 'depart') {
    this.departParams.keyword = val
    this.getDepartTotal()
  } else {
    this.personParams.keyword = val
    this.personParams.offset = 0
    this.getPersonTotal()
  }
}
// 表格中数字反查
export function countPeg(row, column, cell, event) {
  if (!this.elements.peg) {
    return
  }
  let selfMsg = {}
  const name = (this.type === 'depart') ? 'departName' : 'name'
  if (!(column.property === 'departName' || column.property === 'name' || column.property === 'total')) {
    // 合计显示‘--’ todo
    selfMsg = { departName: row[name] || '--', index: column.label, value: row[column.property], page: this.pageMap[this.page] }
    const obj = {
      params: {
        startTime: this.params.startTime,
        endTime: this.params.endTime,
        otherType: this.docMap[column.property]
      },
      selfMsg: selfMsg
    }
    localStorage.setItem('params', JSON.stringify(obj))
    this.fd.tools.goDetail.call(this, 'totalWorkPeg', { query: { id: row.id, type: this.type, resource: 'other' }})
  }
}
export function currentChange(val) {
  this.personParams.offset = (val - 1) * this.personParams.limit
  this.getPersonTotal()
}
export function sizeChange(val) {
  this.personParams.limit = val
  this.personParams.offset = 0
  this.getPersonTotal()
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
export function getDepartTotal() {
  if (!this.elements.depart) {
    return
  }
  const data = this.fd.tools.merge(true, {}, this.params, this.departParams)
  this.fd.req({
    url: 'api/analysis/others',
    method: 'get',
    data: data
  }).then((d) => {
    const data = d.data || {}
    this.departOpt.data = data.data
  })
}
export function getPersonTotal() {
  if (!this.elements.person) {
    return
  }
  const data = this.fd.tools.merge(true, {}, this.params, this.personParams)
  this.fd.req({
    url: 'api/analysis/others',
    method: 'get',
    data: data
  }).then((d) => {
    const data = d.data || {}
    this.personOpt.data = data.data
    this.total = data.total
  })
}
export function toLocaleDate(time) {
  function addZero(num) {
    if (num < 10) {
      return '0' + num
    } else {
      return num
    }
  }
  const aaa = time.getDate() + ''
  if (aaa.length === 1) {
    this.nowDate = '0' + time.getDate()
  } else if (aaa.length === 2) {
    this.nowDate = time.getDate()
  }
  // 按自定义拼接格式返回
  return time.getFullYear() + '-' + addZero(time.getMonth() + 1) + '-' + this.nowDate
}
export function toStartDate(time) {
  return time.getFullYear() + '-01' + '-01'
}
export function downloadTable() {
  this.fileName = '工作业绩_' + this.pageMap.other + '_' + this.typeMap[this.type] + '_'
  const params1 = (this.type === 'depart') ? this.departParams : this.personParams
  const url = 'api/analysis/others/download'
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
}
// 左边卡片数据
export function getCourtTotal() {
  if (!this.elements.person) {
    return
  }
  const data = this.fd.tools.merge(true, {}, this.params, this.personParams)
  this.fd.req({
    url: 'api/analysis/others/total',
    method: 'get',
    data: data
  }).then((d) => {
    const data = d.data || {}
    this.courtOtherObj = data
  })
}
// 各部门人均业绩对比
export function getVbarData() {
  if (!this.elements.person) {
    return
  }
  const data = this.fd.tools.merge(true, {}, this.params, this.personParams)
  this.fd.req({
    url: 'api/analysis/others/echart',
    method: 'get',
    data: data
  }).then((d) => {
    const data = d.data || []
    this.vbarOtherOpt.chart.resize()
    this.vbarOtherOpt.data = data
  })
}

