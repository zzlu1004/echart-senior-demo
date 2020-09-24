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
    this.personParams.limit = 10
    this.getPersonTotal()
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
// 表格中发文数的反查
export function countPeg(row, column, cell, event) {
  if (!this.elements.peg) {
    return
  }
  let selfMsg = {}
  const name = 'name'
  if (column.property === 'total' || column.property === 'yoy') {
    selfMsg = { departName: row[name] || '--', index: column.label, value: row[column.property] }
    const obj = {
      params: {
        startTime: this.params.startTime,
        endTime: this.params.endTime
      },
      selfMsg: selfMsg
    }
    localStorage.setItem('params', JSON.stringify(obj))
    this.fd.tools.goDetail.call(this, 'studyTotalPeg', { query: { id: row.id, page: this.page,
      type: this.type, resource: this.page + '-' + this.type }})
  }
}
export function getAll() {
  this.getColumns('depart')
  this.getColumns('person')
  this.getEcharts()
}
export function refreshCondition() {
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
  this.getEcharts()
  this.getDepartTotal()
  this.getPersonTotal()
}
export function sortByNum(column) {
  if (this.type === 'depart') {
    this.departParams.orderField = column.prop
    this.departParams.orderType = column.order
    this.getDepartTotal()
  } else {
    this.personParams.orderField = column.prop
    this.personParams.orderType = column.order
    this.getPersonTotal()
  }
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
  let url = ''
  if (this.page === 'train') {
    url = 'api/analysis/learn-reward/train/depart'
  } else if (this.page === 'cadrePartTime') {
    url = 'api/analysis/learn-reward/job/depart'
  } else if (this.page === 'reward') {
    url = 'api/analysis/learn-reward/reward/depart'
  } else if (this.page === 'judgeTrain') {
    url = 'api/analysis/learn-reward/fgpx/depart'
  }
  const data = this.fd.tools.merge(true, {}, this.params, this.departParams)
  this.fd.req({
    url: url,
    method: 'get',
    data: data
  }).then((d) => {
    const data = d.data || []
    this.departOpt.data = data.data
  })
}
export function getPersonTotal() {
  if (!this.elements.person) {
    return
  }
  let url = ''
  if (this.page === 'train') {
    url = 'api/analysis/learn-reward/train/person'
  } else if (this.page === 'cadrePartTime') {
    url = 'api/analysis/learn-reward/job/person'
  } else if (this.page === 'reward') {
    url = 'api/analysis/learn-reward/reward/person'
  } else if (this.page === 'judgeTrain') {
    url = 'api/analysis/learn-reward/fgpx/person'
  }
  const data = this.fd.tools.merge(true, {}, this.params, this.personParams)
  this.fd.req({
    url: url,
    method: 'get',

    data: data
  }).then((d) => {
    const data = d.data || {}
    this.personOpt.data = data.data
    this.total = data.total
  })
}
export function getEcharts() {
  let url = ''
  if (this.page === 'train') {
    url = 'api/analysis/learn-reward/train/chart'
  } else if (this.page === 'cadrePartTime') {
    url = 'api/analysis/learn-reward/job/chart'
  } else if (this.page === 'reward') {
    url = 'api/analysis/learn-reward/reward/chart'
  } else if (this.page === 'judgeTrain') {
    url = 'api/analysis/learn-reward/fgpx/chart'
  }
  this.fd.req({
    url: url,
    method: 'get',
    data: this.params
  }).then((d) => {
    const data = d.data || {}
    this.vbarOpt.data = data.charts
    this.courtObj = data.total
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
  if (this.type === 'depart') {
    if (this.page === 'train') {
      url = 'api/analysis/learn-reward/train/depart/download'
    } else if (this.page === 'cadrePartTime') {
      url = 'api/analysis/learn-reward/job/depart/download'
    } else if (this.page === 'reward') {
      url = 'api/analysis/learn-reward/reward/depart/download'
    } else if (this.page === 'judgeTrain') {
      url = 'api/analysis/learn-reward/fgpx/depart/download'
    }
  } else {
    if (this.page === 'train') {
      url = 'api/analysis/learn-reward/train/person/download'
    } else if (this.page === 'cadrePartTime') {
      url = 'api/analysis/learn-reward/job/person/download'
    } else if (this.page === 'reward') {
      url = 'api/analysis/learn-reward/reward/person/download'
    } else if (this.page === 'judgeTrain') {
      url = 'api/analysis/learn-reward/fgpx/person/download'
    }
  }
  let pageName = ''
  if (this.pageMap[this.page] === '参加培训') {
    pageName = '法官培训'
  } else {
    pageName = this.pageMap[this.page]
  }
  this.fileName = '工作业绩-学习拓展-' + pageName + '-' + this.typeMap[this.type] + '-统计表'
  const params1 = (this.type === 'depart') ? this.departParams : this.personParams
  const data = this.fd.tools.merge(true, {}, params1, this.params, { fileName: this.fileName })
  this.fd.tools.download('', url, data)
}
// 根据接口返回的数据字段匹配生成表头数据列
export function getColumns(type) {
  // 清空表格表头
  if (type === 'depart') {
    this.departOpt.columns = []
  } else {
    this.personOpt.columns = []
  }
  const columns = this.columsObj[type]
  for (const key in columns) {
    let obj = {}
    if (key === 'total' || key === 'yoy') {
      obj = {
        field: key,
        title: columns[key],
        align: 'right',
        sortable: 'custom',
        minWidth: 180,
        formatter: (row, value) => {
          return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
        }
      }
    } else if (key === 'rate') {
      obj = {
        field: key,
        title: columns[key],
        align: 'right',
        sortable: 'custom',
        minWidth: 180,
        formatter: (row, value) => {
          return (value !== '--') ? this.fd.data.saveFloat(value, 2) + '%' : '--'
        }
      }
    } else {
      if (key !== 'name' && key !== 'departName') {
        obj = {
          field: key,
          title: columns[key],
          align: 'right',
          sortable: 'custom',
          minWidth: 180,
          formatter: (row, value) => {
            return (value && value !== 0) ? value : '--'
          }
        }
      } else {
        obj = {
          field: key,
          title: columns[key],
          sortable: 'custom',
          minWidth: 180,
          formatter: (row, value) => {
            return (value && value !== 0) ? value : '--'
          }
        }
      }
    }
    if (type === 'depart') {
      this.departOpt.columns.push(obj)
    } else {
      this.personOpt.columns.push(obj)
    }
  }
}
export function getDepartData() {
  this.fd.req({
    type: 'get',
    url: 'api/depart'
  }).then(response => {
    const data = response.data
    this.departData = data
  }).catch(error => {
    console.log('getDepartData', error)
  })
}
