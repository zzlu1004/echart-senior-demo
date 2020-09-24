export function choosePage(key) {
  this.page = key
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
// 表格中发文数的反查
export function countPeg(row, column, cell, event) {
  if (!this.elements.writingPeg) {
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
        startTime: this.params.startTime,
        endTime: this.params.endTime,
        docType: docMap[column.property]
      },
      selfMsg: selfMsg
    }
    localStorage.setItem('params', JSON.stringify(obj))
    this.fd.tools.goDetail.call(this, 'totalWorkPeg', { query: { id: row.id, type: this.type, page: this.page, resource: 'total_writing' }})
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
    url: 'api/analysis/doc',
    method: 'get',
    data: data
  }).then((d) => {
    const data = d.data || {}
    this.departOpt.data = data.data
    this.total = data.total
  })
}
export function getPersonTotal() {
  if (!this.elements.person) {
    return
  }
  const data = this.fd.tools.merge(true, {}, this.params, this.personParams)
  this.fd.req({
    url: 'api/analysis/doc',
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
  this.fileName = '综合工作_' + this.pageMap[this.page] + '_' + this.typeMap[this.type] + '_'
  const params1 = (this.type === 'depart') ? this.departParams : this.personParams
  const url = 'api/analysis/doc/download'
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
  this.$set(this.timeRange, 'startTime', this.params.startTime)
  this.$set(this.timeRange, 'endTime', this.params.endTime)
  this.isNew = !this.isNew // 是否点击了查询按钮
  this.getVbarData()
  this.getCourtTotal()
  this.getDepartTotal()
  this.getPersonTotal()
}
// 各部门人均业绩对比柱状图
export function getVbarData() {
  this.vbarOpt.data = []
  this.vbarOptTotal.data = []
  // if (!this.elements.person) {
  //   return
  // }
  const data = this.fd.tools.merge(true, {}, this.params, this.personParams)
  this.fd.req({
    url: 'api/analysis/doc/echart',
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
// 左边卡片数据
export function getCourtTotal() {
  // if (!this.elements.person) {
  //   return
  // }
  const data = this.fd.tools.merge(true, {}, this.params, this.personParams)
  this.fd.req({
    url: 'api/analysis/doc/total',
    method: 'get',
    data: data
  }).then((d) => {
    const data = d.data || {}
    this.courtObj = data
  })
}
