export function searchByKeyword(val) {
  if (this.type === 'year') {
    this.yearParams.keyword = val
    this.yearParams.offset = 0
    this.getYearTotal()
  } else {
    this.monthParams.keyword = val
    this.monthParams.offset = 0
    this.getMonthTotal()
  }
}
export function handleSelect(key) {
  this.page = key
}
// 表格中指标和子指标的反查
export function countPeg(row, column) {
  const peg = this.page + 'Peg'
  if (!this.elements[peg]) {
    return
  }
  let selfMsg = {}
  if (column.property !== 'name' && column.property !== 'zb002011' && column.property !== 'zb002012' &&
    column.property !== 'zb003001' && column.property !== 'zb003002' && column.property !== 'zb003007' &&
    column.property !== 'zb004001' && column.property !== 'zb004002' && column.property !== 'zb003010' && column.property !== 'zb005004' && column.property !== 'zb005002') {
    selfMsg = { departName: this.userName || this.$store.getters.user.userName || row.name, index: column.label,
      label: column.label, value: row[column.property], page: this.pageMap[this.page],
      userName: this.userName || this.$store.getters.user.userName, targetName: this.targetMap[this.params.indexId] }
    const obj = {
      params: {
        startTime: '',
        endTime: '',
        indexId: column.property
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
    // if (this.type === 'year') {
    //   obj.params.startTime = row.name + '-01'
    //   obj.params.endTime = row.name + '-12'
    // } else {
    //   obj.params.startTime = row.name
    //   obj.params.endTime = row.name
    // }
    localStorage.setItem('params', JSON.stringify(obj))
    this.fd.tools.goDetail.call(this, 'workQeTargetPeg', { query: { id: this.userId ||
      this.$store.getters.user.id, type: this.type, resource: 'center_workQe' }})
  }
}
// 获取质效指标下拉框列表
export function getTargetOpt() {
  this.fd.req({
    url: 'api/analysis/quality/' + this.typeIdMap[this.page],
    method: 'get'
  }).then((d) => {
    const data = d.data || []
    this.targetOpt = data
    for (const item of data) {
      this.targetMap[item.id] = item.name
    }
    if (data.length > 0) {
      this.params.indexId = data[0].id
    }
    this.refreshAll()
  })
}
export function currentChange(val) {
  if (this.type === 'year') {
    this.yearParams.offset = (val - 1) * this.yearParams.limit
    this.getYearTotal()
  } else if (this.type === 'month') {
    this.monthParams.offset = (val - 1) * this.monthParams.limit
    this.getMonthTotal()
  }
}
export function sizeChange(val) {
  if (this.type === 'year') {
    this.yearParams.limit = val
    this.yearParams.offset = 0
    this.getYearTotal()
  } else if (this.type === 'month') {
    this.monthParams.limit = val
    this.monthParams.offset = 0
    this.getMonthTotal()
  }
}
export function sortByNum(column) {
  if (this.type === 'year') {
    this.yearParams.orderField = column.prop
    this.yearParams.orderType = column.order
    this.getYearTotal()
  } else if (this.type === 'month') {
    this.monthParams.orderField = column.prop
    this.monthParams.orderType = column.order
    this.getMonthTotal()
  }
}
export function getYearTotal() {
  this.yearLoading = true
  const data = this.fd.tools.merge(true, {}, this.params, this.yearParams)
  const url = 'api/analysis/quality/index/' + (this.userId || this.$store.getters.user.id)
  this.fd.req({
    url: url,
    method: 'get',
    data: data
  }).then((d) => {
    const data = d.data || {}
    this.yearOpt.data = data.data
    this.yearTotal = data.total
    this.yearLoading = false
  })
}
export function getMonthTotal() {
  this.monthLoading = true
  const data = this.fd.tools.merge(true, {}, this.params, this.monthParams)
  const url = 'api/analysis/quality/index/' + (this.userId || this.$store.getters.user.id)
  this.fd.req({
    url: url,
    method: 'get',
    data: data
  }).then((d) => {
    const data = d.data || {}
    this.monthOpt.data = data.data
    this.monthTotal = data.total
    this.monthLoading = false
  })
}
export function downloadTable() {
  const userName = this.userName || this.$store.getters.user.userName
  this.fileName = this.menuMap[this.page] + '_' + this.targetMap[this.params.indexId] + '_' + this.typeMap[this.type] + '_' +
  userName + '_'
  const url = 'api/analysis/quality/index/' + (this.userId || this.$store.getters.user.id) + '/download'
  const params = (this.type === 'year') ? this.yearParams : this.monthParams
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
  this.tabId = this.page + '-' + this.params.indexId
  this.getColumns(this.tabId)
  this.getYearTotal()
  this.getMonthTotal()
}
export function getWidth(name) {
  const l = 16
  return (name.length + 1) * l + 40
}
// 自定义列表联动表格的表头显示
export function changeCols(val) {
  const peg = this.page + 'Peg'
  const opt = (this.type === 'year') ? this.yearOpt : this.monthOpt
  opt.columns = []
  for (const item of this.checkboxName) {
    if (val.indexOf(item) > -1) {
      let obj = {}
      if (item === 'name') {
        obj = {
          field: item,
          title: this.columsObj[this.tabId][item],
          sortable: 'custom',
          minWidth: 180
        }
      } else {
        // 所有的父级指标都不可以反查，除了超审限案件数没有子指标
        if (item === 'zb002011' || item === 'zb002012' || item === 'zb003001' || item === 'zb003002' || item === 'zb003007' ||
        item === 'zb004001' || item === 'zb004002' || item === 'zb003010' || item === 'zb005004' || item === 'zb005002') {
          obj = {
            field: item,
            title: this.columsObj[this.tabId][item],
            align: 'right',
            sortable: 'custom',
            minWidth: this.getWidth(this.columsObj[this.tabId][item]),
            formatter: (row, value) => {
              value = value === undefined ? '' : value
              return value
            }
          }
        } else {
          obj = {
            field: item,
            title: this.columsObj[this.tabId][item],
            align: 'right',
            sortable: 'custom',
            minWidth: this.getWidth(this.columsObj[this.tabId][item]),
            formatter: (row, value) => {
              value = value === undefined ? '' : value
              return this.elements[peg] ? '<span class="color-blue pointer">' + value + '</span>'
                : value
            }
          }
        }
      }
      opt.columns.push(obj)
    }
  }
}
// 根据接口返回的数据字段匹配生成表头数据列
export function getColumns(page) {
  const peg = this.page + 'Peg'
  // 清空表格表头
  this.yearOpt.columns = []
  this.monthOpt.columns = []
  // 清空已选中的自定义列表数据
  this.checkedCols = []
  // 清空自定义列表所有数据
  this.checkbox = []
  this.checkboxName = []
  for (const key in this.columsObj[page]) {
    let obj = {}
    if (key === 'name') {
      obj = {
        field: key,
        title: this.columsObj[page][key],
        sortable: 'custom',
        minWidth: 180
      }
    } else {
      // 所有的父级指标都不可以反查，除了超审限案件数没有子指标
      if (key === 'zb002011' || key === 'zb002012' || key === 'zb003001' || key === 'zb003002' || key === 'zb003007' ||
        key === 'zb004001' || key === 'zb004002' || key === 'zb003010' || key === 'zb005004' || key === 'zb005002') {
        obj = {
          field: key,
          title: this.columsObj[page][key],
          align: 'right',
          sortable: 'custom',
          minWidth: this.getWidth(this.columsObj[page][key]),
          formatter: (row, value) => {
            value = value === undefined ? '' : value
            return value
          }
        }
      } else {
        obj = {
          field: key,
          title: this.columsObj[page][key],
          align: 'right',
          sortable: 'custom',
          minWidth: this.getWidth(this.columsObj[page][key]),
          formatter: (row, value) => {
            value = value === undefined ? '' : value
            return this.elements[peg] ? '<span class="color-blue pointer">' + value + '</span>'
              : value
          }
        }
      }
    }
    this.yearOpt.columns.push(obj)
    this.monthOpt.columns.push(obj)
    this.checkbox.push({
      field: key,
      title: this.columsObj[page][key]
    })
    this.checkboxName.push(obj.field)
    this.checkedCols1.push(obj.field)
    this.checkedCols2.push(obj.field)
  }
}
