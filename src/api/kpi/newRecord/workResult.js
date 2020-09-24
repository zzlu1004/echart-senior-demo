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
export function handleSelect(key, keyPath) {
  this.page = key
  if (keyPath[0] === 'total') {
    this.totalMenu = this.pageMap[keyPath[0]] + '（ ' + this.pageMap[keyPath[1]] + ' ）'
  } else if (keyPath[0] === 'work') {
    this.handleMenu = this.pageMap[keyPath[0]] + '（ ' + this.pageMap[keyPath[1]] + ' ）'
  }
}
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
        docType: this.docMap[column.property]
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
      id: row.id, type: this.type, page: this.page, resource: 'work_result_writing' }})
  // 工作业绩-其他-反查
  } else if (column.property === 'noticeCount' || column.property === 'businessCount' || column.property === 'carCount' ||
  column.property === 'goodsCount' || column.property === 'workCardCount' || column.property === 'judgeTeamCount' ||
  column.property === 'personnelCount' || column.property === 'proofCount' || column.property === 'abroadCount' || column.property === 'leaveCount' || column.property === 'cancelleaveCount') {
    selfMsg = { departName: row.name, index: column.label, value: row[column.property],
      label: column.label, page: this.pageMap[this.page], userName: this.userName }
    const obj = {
      params: {
        startTime: '',
        endTime: '',
        otherType: this.docMap[column.property]
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
      id: row.id, type: this.type, page: this.page, resource: 'center_other' }})
  // 办案工作-法官-反查
  } else if (column.property === 'cbrCaseNum' || column.property === 'chiefCaseNum' ||
    column.property === 'hytCaseNum' || column.property === 'cbrWorkload' ||
    column.property === 'chiefWorkload' || column.property === 'hytWorkload' ||
    column.property === 'totalWorkload' || column.property === 'totalCaseNum') {
    selfMsg = { departName: this.userName || this.$store.getters.user.userName || row.staffName, index: column.label,
      label: column.label, value: row[column.property], page: this.pageMap[this.page], userName: this.userName,
      weightName: this.weightMap[this.params.weightId] }
    const obj = {
      params: {
        startTime: '',
        endTime: '',
        weightId: this.params.weightId,
        type: this.docMap[column.property]
      },
      selfMsg: selfMsg
    }
    if (this.type === 'year') {
      obj.params.startTime = this.fd.tools.firstDayOfMonth(row.staffName + '-01')
      obj.params.endTime = this.fd.tools.endDayOfMonth(row.staffName + '-12')
    } else {
      obj.params.startTime = this.fd.tools.firstDayOfMonth(row.staffName)
      obj.params.endTime = this.fd.tools.endDayOfMonth(row.staffName)
    }
    if (column.property.indexOf('Workload') > -1) {
      obj.selfMsg.value = this.fd.data.saveFloat(row[column.property], 2)
      localStorage.setItem('params', JSON.stringify(obj))
      this.fd.tools.goDetail.call(this, 'workloadPeg', { query: { id: this.userId || this.$store.getters.user.id,
        type: 'judge', resource: 'center_judge' }})
    } else {
      localStorage.setItem('params', JSON.stringify(obj))
      this.fd.tools.goDetail.call(this, 'caseCountPeg', { query: { id: this.userId || this.$store.getters.user.id,
        type: 'judge', resource: 'center_judge' }})
    }
  // 办案工作-法官助理书记员-反查
  } else if (column.property === 'caseNum' || column.property === 'workload') {
    selfMsg = { departName: this.userName || this.$store.getters.user.userName || row.staffName, index: column.label,
      label: column.label, value: row[column.property], page: this.pageMap[this.page], userName: this.userName,
      weightName: this.weightMap[this.params.weightId] }
    const obj = {
      params: {
        startTime: '',
        endTime: '',
        weightId: this.params.weightId,
        type: this.page
      },
      selfMsg: selfMsg
    }
    if (this.type === 'year') {
      obj.params.startTime = this.fd.tools.firstDayOfMonth(row.staffName + '-01')
      obj.params.endTime = this.fd.tools.endDayOfMonth(row.staffName + '-12')
    } else {
      obj.params.startTime = this.fd.tools.firstDayOfMonth(row.staffName)
      obj.params.endTime = this.fd.tools.endDayOfMonth(row.staffName)
    }
    // if (this.type === 'year') {
    //   obj.params.startTime = row.staffName + '-01'
    //   obj.params.endTime = row.staffName + '-12'
    // } else {
    //   obj.params.startTime = row.staffName
    //   obj.params.endTime = row.staffName
    // }
    if (column.property.indexOf('workload') > -1) {
      obj.selfMsg.value = this.fd.data.saveFloat(row[column.property], 2)
      localStorage.setItem('params', JSON.stringify(obj))
      this.fd.tools.goDetail.call(this, 'assistloadPeg', { query: { id: this.userId ||
        this.$store.getters.user.id, type: this.page, resource: 'center_' + this.page }})
    } else {
      localStorage.setItem('params', JSON.stringify(obj))
      this.fd.tools.goDetail.call(this, 'caseCountPeg', { query: { id: this.userId ||
        this.$store.getters.user.id, type: this.page, resource: 'center_' + this.page }})
    }
  }
}
// 获取权重体系版本列表
export function getWeightOpt() {
  this.fd.req({
    url: 'api/weight/active',
    method: 'get'
  }).then((d) => {
    const data = d.data || []
    this.weightSchemaOpt = data
    for (const item of data) {
      this.weightMap[item.id] = item.name
    }
    if (data.length > 0) {
      this.params.weightId = data[0].id
      if (this.page === 'judge') {
        this.refreshJudgeAll(data[0].id)
      } else {
        this.refreshAssistAll(data[0].id)
      }
    } else {
      if (this.page === 'judge') {
        this.refreshJudgeAll()
      } else {
        this.refreshAssistAll()
      }
    }
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
export function getYearTotal() {
  let url = ''
  if (this.page === 'writing') {
    url = 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/doc'
  } else if (this.page === 'judge') {
    url = 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/workload'
  } else if (this.page === 'assistant') {
    url = 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/workload/type'
  } else if (this.page === 'clerk') {
    url = 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/workload/type'
  } else if (this.page === 'other') {
    url = 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/other'
  }
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
  let url = ''
  if (this.page === 'writing') {
    url = 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/doc'
  } else if (this.page === 'judge') {
    url = 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/workload'
  } else if (this.page === 'assistant') {
    url = 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/workload/type'
  } else if (this.page === 'clerk') {
    url = 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/workload/type'
  } else if (this.page === 'other') {
    url = 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/other'
  }
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
  let url = ''
  if (this.page === 'writing') {
    url = 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/doc/download'
  } else if (this.page === 'judge') {
    this.fileName = this.menuMap[this.page] + '_' + this.weightMap[this.params.weightId] + '_' + this.typeMap[this.type] + '_' + (this.userId ? this.userName + '_' : '_')
    url = 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/workload/download'
  } else if (this.page === 'assistant') {
    this.fileName = this.menuMap[this.page] + '_' + this.weightMap[this.params.weightId] + '_' + this.typeMap[this.type] + '_' + (this.userId ? this.userName + '_' : '_')
    url = 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/workload/type/download'
  } else if (this.page === 'clerk') {
    this.fileName = this.menuMap[this.page] + '_' + this.weightMap[this.params.weightId] + '_' + this.typeMap[this.type] + '_' + (this.userId ? this.userName + '_' : '_')
    url = 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/workload/type/download'
  } else if (this.page === 'other') {
    url = 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/other/download'
  }
  const params = (this.type === 'year') ? this.yearParams : this.monthParams
  this.params.startTime = this.fd.tools.firstDayOfMonth(this.params.startTime)
  this.params.endTime = this.fd.tools.firstDayOfMonth(this.params.endTime)
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
  if (!this.elements.writing) {
    return
  }
  this.refreshCondition()
  this.getYearTotal()
  this.getMonthTotal()
}
export function refreshJudgeAll(val) {
  if (!this.elements.judge) {
    return
  }
  this.params.weightId = val
  this.refreshCondition()
  this.getYearTotal()
  this.getMonthTotal()
}
export function refreshAssistAll(val) {
  if (!this.elements.assistant) {
    return
  }
  this.params.weightId = val
  this.params.workType = this.page
  this.refreshCondition()
  this.getYearTotal()
  this.getMonthTotal()
}
export function refreshOtherAll() {
  if (!this.elements.other) {
    return
  }
  this.refreshCondition()
  this.getYearTotal()
  this.getMonthTotal()
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
          title: this.columsObj[this.page][item],
          sortable: 'custom',
          minWidth: this.fd.tools.getStringWidth(this.columsObj[this.page][item])
        }
      } else if (item === 'total') {
        obj = {
          field: item,
          title: this.columsObj[this.page][item],
          align: 'right',
          sortable: 'custom',
          minWidth: this.fd.tools.getStringWidth(this.columsObj[this.page][item])
        }
      } else if (item === 'avgWorkload') {
        obj = {
          field: item,
          title: this.columsObj[this.page][item],
          align: 'right',
          sortable: 'custom',
          minWidth: this.fd.tools.getStringWidth(this.columsObj[this.page][item]),
          formatter: (row, value) => {
            return this.fd.data.saveFloat(value, 2)
          }
        }
      } else if (item === 'cbrWorkload' || item === 'chiefWorkload' ||
      item === 'hytWorkload' || item === 'totalWorkload' ||
      item === 'workload') {
        obj = {
          field: item,
          title: this.columsObj[this.page][item],
          align: 'right',
          sortable: 'custom',
          minWidth: this.fd.tools.getStringWidth(this.columsObj[this.page][item]),
          formatter: (row, value) => {
            return this.elements[peg] ? '<span class="color-blue pointer">' + this.fd.data.saveFloat(value, 2) + '</span>'
              : this.fd.data.saveFloat(value, 2)
          }
        }
      } else {
        obj = {
          field: item,
          title: this.columsObj[this.page][item],
          align: 'right',
          sortable: 'custom',
          minWidth: this.fd.tools.getStringWidth(this.columsObj[this.page][item]),
          formatter: (row, value) => {
            return this.elements[peg] ? '<span class="color-blue pointer">' + value + '</span>' : value
          }
        }
      }
      opt.columns.push(obj)
    }
  }
}
// 根据接口返回的数据字段匹配生成表头数据列
export function getColumns(page) {
  const peg = this.parentMenu + 'Peg'
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
    if (key === 'name' || key === 'staffName') {
      obj = {
        field: key,
        title: this.columsObj[page][key],
        sortable: 'custom',
        minWidth: this.fd.tools.getStringWidth(this.columsObj[page][key])
      }
    } else if (key === 'total') {
      obj = {
        field: key,
        title: this.columsObj[page][key],
        align: 'right',
        sortable: 'custom',
        minWidth: this.fd.tools.getStringWidth(this.columsObj[page][key])
      }
    } else if (key === 'avgWorkload') {
      obj = {
        field: key,
        title: this.columsObj[page][key],
        align: 'right',
        sortable: 'custom',
        minWidth: this.fd.tools.getStringWidth(this.columsObj[page][key]),
        formatter: (row, value) => {
          return this.fd.data.saveFloat(value, 2)
        }
      }
    } else if (key === 'cbrWorkload' || key === 'chiefWorkload' ||
     key === 'hytWorkload' || key === 'totalWorkload' ||
     key === 'workload') {
      obj = {
        field: key,
        title: this.columsObj[page][key],
        align: 'right',
        sortable: 'custom',
        minWidth: this.fd.tools.getStringWidth(this.columsObj[page][key]),
        formatter: (row, value) => {
          return this.elements[peg] ? '<span class="color-blue pointer">' + this.fd.data.saveFloat(value, 2) + '</span>'
            : this.fd.data.saveFloat(value, 2)
        }
      }
    } else {
      obj = {
        field: key,
        title: this.columsObj[page][key],
        sortable: 'custom',
        align: 'right',
        minWidth: this.fd.tools.getStringWidth(this.columsObj[page][key]),
        formatter: (row, value) => {
          return this.elements[peg] ? '<span class="color-blue pointer">' + value + '</span>' : value
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
