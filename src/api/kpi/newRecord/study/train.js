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
  this.params.keyword = val
  this.params.offset = 0
  this.getTable()
}
export function currentChange(val) {
  this.params.offset = (val - 1) * this.params.limit
  this.getTable()
}
export function sizeChange(val) {
  this.params.limit = val
  this.params.offset = 0
  this.getTable()
}
// 表格中发文数的反查
export function countPeg(row, column, cell, event) {
  if (!this.elements.peg) {
    return
  }
  let selfMsg = {}
  const name = 'name'
  if (column.property === 'total') {
    selfMsg = { departName: row[name] || '--', index: column.label, value: row[column.property] }
    const obj = {
      params: {
        startTime: this.fd.tools.firstDayOfMonth(this.params.startTime),
        endTime: this.fd.tools.endDayOfMonth(this.params.endTime)
      },
      selfMsg: selfMsg
    }
    localStorage.setItem('params', JSON.stringify(obj))
    this.fd.tools.goDetail.call(this, 'studyTotalPeg', { query: { id: row.id, page: this.page,
      type: 'person', resource: this.page + '-person' }})
  }
}
export function getAll() {
  this.getColumns()
  this.refreshAll()
}
export function refreshAll() {
  this.getEcharts()
  this.getTable()
}
export function sortByNum(column) {
  this.params.orderField = column.prop
  this.params.orderType = column.order
  this.getTable()
}
export function clickRefreshAll() {
  this.refreshCondition()
  this.getEcharts()
  this.getTable()
}
export function refreshCondition() {
  this.params.limit = 10
  this.params.offset = 0
  this.params.keyword = this.val
  this.$refs.tableOpt.$children[0].clearSort()
  this.params.orderField = ''
  this.params.orderType = ''
}
export function departPeg(opt) {
  let selfMsg = {}
  selfMsg = { departName: opt.name, index: '合计', value: opt.data.value, page: this.pageMap[this.page] }
  const obj = {
    params: {
      startTime: this.fd.tools.firstDayOfMonth(this.params.startTime),
      endTime: this.fd.tools.endDayOfMonth(this.params.endTime)
    },
    selfMsg: selfMsg
  }
  localStorage.setItem('params', JSON.stringify(obj))
  this.fd.tools.goDetail.call(this, 'studyTotalPeg', { query: { id: opt.data.ids, page: this.page, type: 'depart', resource: this.page + '-depart' }})
}
export function getTable() {
  if (!this.elements.person) {
    return
  }
  let url = ''
  if (this.page === 'train') {
    url = 'api/analysis/train/person'
  } else if (this.page === 'cadrePartTime') {
    url = 'api/analysis/job/person'
  } else if (this.page === 'reward') {
    url = 'api/analysis/reward/person'
  }
  this.params.startTime = this.fd.tools.firstDayOfMonth(this.params.startTime)
  this.params.endTime = this.fd.tools.endDayOfMonth(this.params.endTime)
  this.fd.req({
    url: url,
    method: 'get',
    data: this.params
  }).then((d) => {
    const data = d.data || {}
    this.tableOpt.data = data.data
    this.total = data.total
  })
}
export function getEcharts() {
  if (!this.elements.depart) {
    return
  }
  let url = ''
  if (this.page === 'train') {
    url = 'api/analysis/train/depart'
  } else if (this.page === 'cadrePartTime') {
    url = 'api/analysis/job/depart'
  } else if (this.page === 'reward') {
    url = 'api/analysis/reward/depart'
  }
  this.params.startTime = this.fd.tools.firstDayOfMonth(this.params.startTime)
  this.params.endTime = this.fd.tools.endDayOfMonth(this.params.endTime)
  this.fd.req({
    url: url,
    method: 'get',
    data: this.params
  }).then((d) => {
    const data = d.data || {}
    this.vbarOpt.data = data.echartsVo
    this.vbarOpt.opt.title.text = '全院共' + data.total + '人次'
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
  let url = ''
  if (this.page === 'train') {
    url = 'api/analysis/train/person/download'
  } else if (this.page === 'cadrePartTime') {
    url = 'api/analysis/job/person/download'
  } else if (this.page === 'reward') {
    url = 'api/analysis/reward/person/download'
  }
  this.fileName = '工作业绩_学习拓展_' + this.pageMap[this.page] + '_统计表_'
  const data = this.fd.tools.merge(true, {}, this.params, { fileName: this.fileName })
  this.fd.tools.download('', url, data)
}
// 根据接口返回的数据字段匹配生成表头数据列
export function getColumns() {
  // 清空表格表头
  this.tableOpt.columns = []
  // 清空已选中的自定义列表数据
  this.checkedCols = []
  // 清空自定义列表所有数据
  this.checkbox = []
  this.checkboxName = []
  for (const key in this.columsObj) {
    let obj = {}
    if (key === 'total') {
      obj = {
        field: key,
        title: this.columsObj[key],
        sortable: 'custom',
        minWidth: 180,
        formatter: (row, value) => {
          return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
        }
      }
    } else {
      obj = {
        field: key,
        title: this.columsObj[key],
        sortable: 'custom',
        minWidth: 180,
        formatter: (row, value) => {
          return (value && value !== 0) ? value : '--'
        }
      }
    }
    this.tableOpt.columns.push(obj)
    this.checkbox.push({
      field: key,
      title: this.columsObj[key]
    })
    this.checkedCols.push(obj.field)
    this.checkboxName.push(obj.field)
  }
}
// 自定义列表联动表格的表头显示
export function changeCols(val) {
  this.tableOpt.columns = []
  for (const item of this.checkboxName) {
    if (val.indexOf(item) > -1) {
      let obj = {}
      if (item === 'total') {
        obj = {
          field: item,
          title: this.columsObj[item],
          sortable: 'custom',
          minWidth: 180,
          formatter: (row, value) => {
            return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
          }
        }
      } else {
        obj = {
          field: item,
          title: this.columsObj[item],
          sortable: 'custom',
          minWidth: 180
        }
      }
      this.tableOpt.columns.push(obj)
    }
  }
}
