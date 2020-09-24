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
// 打印
export function printTable() {
  if (this.type === 'depart') {
    let time = ''
    if (this.params.startTime.split('-')[0] === this.params.endTime.split('-')[0]) {
      time = `${this.params.startTime}年${this.params.startTime.split('-')[1]}-${this.params.endTime.split('-')[1]}月`
    }
    this.printTitle = `${time}${this.$store.getters.user.companyName}各业务庭办案工作量统计表`
    this.$nextTick(() => {
      this.fd.tools.tablePrint(window.$('#depart'))
    })
  } else {
    this.isPrint = true
    if (!this.params.weightId) {
      return
    }
    let url = ''
    if (this.type === 'judge') {
      url = 'api/analysis/judge/stats'
    } else if (this.type === 'assistant') {
      url = 'api/analysis/stats/assistant'
    } else if (this.type === 'clerk') {
      url = 'api/analysis/stats/clerk'
    }
    const params = {
      keyword: this.params.keyword,
      type: this.type,
      limit: 0,
      offset: 0
    }
    const data = this.fd.tools.merge(true, {}, params, this.Pparams)
    let time = ''
    if (this.Pparams.startTime.split('-')[0] === this.Pparams.endTime.split('-')[0]) {
      time = `${this.Pparams.startTime}年${this.Pparams.startTime.split('-')[1]}-${this.Pparams.endTime.split('-')[1]}月`
    }
    this.printTitle = `${time}${this.$store.getters.user.companyName}${this.typeMap[this.type]}办案工作量统计表`
    this.fd.req({
      url: url,
      method: 'get',
      data: data
    }).then((d) => {
      const data = d.data || {}
      this.printOpt.data = data.data
      this.$nextTick(() => {
        const html = window.$(`#${this.type}`).removeClass('hide')
        this.fd.tools.tablePrint(html)
        this.isPrint = false
      })
    })
  }
}
// 获取权重体系版本列表
export function getWeightOpt() {
  this.fd.req({
    url: 'api/weight/active',
    method: 'get',
    data: this.weightParams
  }).then((d) => {
    const data = d.data || []
    this.weightSchemaOpt = data
    for (const item of data) {
      this.weightMap[item.id] = item.name
    }
    // 绩效本页面
    if (!this.from) {
      this.params.startTime = this.toStartDate(new Date(this.fd.tools.getNowTime()))
      this.params.endTime = this.toLocaleDate(new Date(this.fd.tools.getNowTime()))
    } else {
      // 数魔方跳转过来
      this.params.startTime = this.$route.query.startTime
      this.params.endTime = this.$route.query.endTime
    }
    if (data.length > 0) {
      this.params.weightId = data[0].id
    } else {
      this.params.weightId = ''
    }
    this.$nextTick(() => {
      this.isFirst = true
    })
  })
}
export function currentChange(val) {
  this[this.type + 'Params'].offset = (val - 1) * this[this.type + 'Params'].limit
  this.getJudgeTotal(this.type)
}
export function sizeChange(val) {
  this[this.type + 'Params'].limit = val
  this[this.type + 'Params'].offset = 0
  this.getJudgeTotal(this.type)
}
export function sortByNum(column) {
  this[this.type + 'Params'].orderField = column.prop
  this[this.type + 'Params'].orderType = column.order
  if (this.type === 'depart') {
    this.getDepartTotal(this.type)
  } else {
    this.getJudgeTotal(this.type)
  }
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
export function refreshCondition() {
  this[this.type + 'Params'].orderField = ''
  this[this.type + 'Params'].orderType = ''
  if (this.type !== 'depart') {
    this[this.type + 'Params'].limit = 10
    this[this.type + 'Params'].offset = 0
  }
  if (this.$refs[this.type + 'Opt']) {
    this.$refs[this.type + 'Opt'].$children[0].clearSort()
  }
}
// 刷新所有数据
export function refreshAll() {
  this.isRefresh = !this.isRefresh
}
// 左边卡片法院数据
export function getCourtTotal() {
  this.fd.req({
    url: 'api/analysis/depart/stats',
    method: 'get',
    data: this.Pparams
  }).then((d) => {
    const data = d.data || {}
    this.courtObj = data
  })
}
// 各部门人均业绩对比
export function getVbarData() {
  this.fd.req({
    url: 'api/analysis/depart/performance',
    method: 'get',
    data: this.Pparams
  }).then((d) => {
    const data = d.data || []
    const vbarData = []
    for (const item of data) {
      for (const key in item) {
        if (key === 'avgCaseCount') {
          vbarData.push({
            id: item.departId,
            seriesName: '平均承办案件数',
            name: item.departName,
            value: item.avgCaseCount
          })
        } else if (key === 'avgWorkload') {
          vbarData.push({
            id: item.departId,
            seriesName: '平均办案工作量',
            name: item.departName,
            value: item.avgWorkload
          })
        }
      }
    }
    this.vbarOpt.data = vbarData
  })
}
export function searchByKeyword(val) {
  this[this.type + 'Params'].keyword = val
  if (this.type === 'depart') {
    this.getDepartTotal()
  } else {
    this[this.type + 'Params'].offset = 0
    this.getJudgeTotal(this.type)
  }
}
// 员额法官，法官助理，书记员的表格数据
export function getJudgeTotal(type) {
  if (!this.params.weightId && !this.Pparams.weightId) {
    return
  }
  let url = ''
  if (type === 'judge') {
    url = 'api/analysis/judge/stats'
  } else if (type === 'assistant') {
    url = 'api/analysis/stats/assistant'
  } else if (type === 'clerk') {
    url = 'api/analysis/stats/clerk'
  }
  let data = {}
  if (this.params.weightId) {
    data = this.fd.tools.merge(true, this[this.type + 'Params'], this.params)
  } else {
    data = this.fd.tools.merge(true, this[this.type + 'Params'], this.Pparams)
  }
  this.fd.req({
    url: url,
    method: 'get',
    data: data
  }).then((d) => {
    const data = d.data || {}
    this[this.type + 'Opt'].data = data.data
    this.tableOpt[type] = 1
    this.total = data.total
  })
}
// 部门统计的表格数据
export function getDepartTotal() {
  this.params = this.fd.tools.merge(true, this.departParams, this.Pparams)
  this.fd.req({
    url: 'api/analysis/depart/stats/detail',
    method: 'get',
    data: this.params
  }).then((d) => {
    const data = d.data || []
    this.departOpt.data = data
  })
}
// 表格中案件数和工作量的反查
export function countPeg(row, column, cell, event) {
  console.log(this.weightMap)
  console.log(this.Pparams)
  if (!this.elements.peg) {
    return
  }
  const id = (this.type === 'depart') ? 'departId' : 'staffId'
  const name = (this.type === 'depart') ? 'departName' : 'staffName'
  const clickObj = {
    'cbrCaseNum': 'cbr',
    'chiefCaseNum': 'chief',
    'hytCaseNum': 'hyt',
    'totalCaseNum': '',
    'cbrWorkload': 'cbr',
    'chiefWorkload': 'chief',
    'hytWorkload': 'hyt',
    'totalWorkload': '',
    // 书记员和法官助理只有一个反查，不区分到点击字段property
    'clerk': 'clerk',
    'assistant': 'assistant'
  }
  let selfMsg = {}
  // 案件数反查
  if (column.property === 'caseCount' || column.property === 'workload' || column.property === 'caseNum') {
    selfMsg = { departName: row[name], index: column.label, label: column.label, value: row[column.property], weightName: this.weightMap[this.Pparams.weightId] }
    const obj = {
      params: {
        weightId: this.Pparams.weightId,
        startTime: this.Pparams.startTime,
        endTime: this.Pparams.endTime
      },
      selfMsg: selfMsg
    }
    // bug 2228 需求变更【绩效分析-办案工作】法官助理和书记员的工作量反查页面中的图表可以去掉，跳转到新页面
    if (this.type === 'clerk' || this.type === 'assistant') {
      obj.params.type = clickObj[this.type]
      if (column.property.indexOf('workload') > -1) {
        obj.selfMsg.value = this.fd.data.saveFloat(row[column.property], 2)
        localStorage.setItem('params', JSON.stringify(obj))
        this.fd.tools.goDetail.call(this, 'assistloadPeg', { query: { id: row[id], type: this.type }})
      } else {
        localStorage.setItem('params', JSON.stringify(obj))
        this.fd.tools.goDetail.call(this, 'caseCountPeg', { query: { id: row[id], type: this.type }})
      }
    } else {
      if (column.property.indexOf('workload') > -1) {
        obj.selfMsg.value = this.fd.data.saveFloat(row[column.property], 2)
        localStorage.setItem('params', JSON.stringify(obj))
        this.fd.tools.goDetail.call(this, 'workloadPeg', { query: { id: row[id], type: this.type }})
      } else {
        localStorage.setItem('params', JSON.stringify(obj))
        this.fd.tools.goDetail.call(this, 'caseCountPeg', { query: { id: row[id], type: this.type }})
      }
    }
  } else if (column.property === 'cbrCaseNum' || column.property === 'chiefCaseNum' ||
    column.property === 'hytCaseNum' || column.property === 'cbrWorkload' ||
    column.property === 'chiefWorkload' || column.property === 'hytWorkload' ||
    column.property === 'totalWorkload' || column.property === 'totalCaseNum') {
    selfMsg = { departName: row[name], index: column.label, label: column.label, value: row[column.property], weightName: this.weightMap[this.Pparams.weightId] }
    const obj = {
      params: {
        weightId: this.Pparams.weightId,
        startTime: this.Pparams.startTime,
        endTime: this.Pparams.endTime,
        type: clickObj[column.property]
      },
      selfMsg: selfMsg
    }
    if (column.property.indexOf('Workload') > -1) {
      obj.selfMsg.value = this.fd.data.saveFloat(row[column.property], 2)
      localStorage.setItem('params', JSON.stringify(obj))
      this.fd.tools.goDetail.call(this, 'workloadPeg', { query: { id: row[id], type: this.type }})
    } else {
      localStorage.setItem('params', JSON.stringify(obj))
      this.fd.tools.goDetail.call(this, 'caseCountPeg', { query: { id: row[id], type: this.type }})
    }
  } else if (column.property === 'staffCount') {
    if (row.departName === '其他' || row.staffCount === 0) {
      return
    }
    const refreshData = {}
    if (row.departName === '合计') {
      refreshData.departName = ''
    } else {
      refreshData.departName = row.departName
    }
    refreshData.type = 'judge'
    this.$emit('refreshType', refreshData)
  }
}
// 自定义列表联动表格的表头显示
export function changeCols(val) {
  const opt = this[this.type + 'Opt']
  const check = this[this.type + 'CheckboxName']
  opt.columns = []
  for (const item of check) {
    if (val.indexOf(item) > -1) {
      let obj = {}
      if (item === 'caseCount' || item === 'workload' ||
        item === 'cbrCaseNum' || item === 'chiefCaseNum' ||
        item === 'hytCaseNum' || item === 'cbrWorkload' ||
        item === 'chiefWorkload' || item === 'hytWorkload' ||
        item === 'totalWorkload' || item === 'totalCaseNum') {
        if (item.indexOf('workload') > -1 || item.indexOf('Workload') > -1 || item === 'avgCaseCount') {
          obj = {
            field: item,
            title: this.columsObj[this.type][item],
            sortable: 'custom',
            align: 'right',
            minWidth: this.fd.tools.getStringWidth(this.columsObj[this.type][item]),
            formatter: (row, value) => {
              return this.elements.peg ? '<span class="color-blue pointer">' + this.fd.data.saveFloat(value, 2) + '</span>'
                : this.fd.data.saveFloat(value, 2)
            }
          }
        } else {
          obj = {
            field: item,
            title: this.columsObj[this.type][item],
            sortable: 'custom',
            align: 'right',
            minWidth: this.fd.tools.getStringWidth(this.columsObj[this.type][item]),
            formatter: (row, value) => {
              return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
            }
          }
        }
      } else {
        if (item.indexOf('workload') > -1 || item.indexOf('Workload') > -1 || item === 'avgCaseCount') {
          obj = {
            field: item,
            title: this.columsObj[this.type][item],
            sortable: 'custom',
            align: 'right',
            minWidth: this.fd.tools.getStringWidth(this.columsObj[this.type][item]),
            formatter: (row, value) => {
              return this.elements.peg ? '<span class="color-blue pointer">' + this.fd.data.saveFloat(value, 2) + '</span>'
                : this.fd.data.saveFloat(value, 2)
            }
          }
        } else {
          if (this.type === 'judge') {
            if (item === 'departName' || item === 'staffName') {
              obj = {
                field: item,
                title: this.columsObj[this.type][item],
                minWidth: this.fd.tools.getStringWidth(this.columsObj[this.type][item]),
                fixed: true,
                sortable: 'custom'
              }
            }
          } else {
            if (item === 'departName' || item === 'staffName') {
              obj = {
                field: item,
                title: this.columsObj[this.type][item],
                minWidth: this.fd.tools.getStringWidth(this.columsObj[this.type][item]),
                sortable: 'custom'
              }
            } else {
              obj = {
                field: item,
                align: 'right',
                title: this.columsObj[this.type][item],
                minWidth: this.fd.tools.getStringWidth(this.columsObj[this.type][item]),
                sortable: 'custom'
              }
            }
          }
        }
      }
      opt.columns.push(obj)
    }
  }
}
export function downloadTable(exportType) {
  this.fileName = '办案工作_' + this.weightMap[this.Pparams.weightId] + '_' + this.typeMap[this.type] + '_'
  const url = exportType ? ('api/analysis/export/' + exportType) : 'api/analysis/index/pegging/cases/download'
  const data = this.fd.tools.merge(true, { fileName: this.fileName }, this[this.type + 'Params'], this.Pparams)
  this.fd.tools.download('', url, data)
}
// 根据接口返回的数据字段匹配生成表头数据列
export function getColumns(type) {
  this[type + 'Opt'].columns = []
  this[type + 'CheckedCols'] = []
  this[type + 'Checkbox'] = []
  this[type + 'CheckboxName'] = []
  for (const key in this.columsObj[type]) {
    let obj = {}
    if (key === 'staffCount' || key === 'caseCount' || key === 'workload' ||
    key === 'cbrCaseNum' || key === 'chiefCaseNum' ||
    key === 'hytCaseNum' || key === 'cbrWorkload' ||
    key === 'chiefWorkload' || key === 'hytWorkload' ||
    key === 'totalWorkload' || key === 'totalCaseNum' ||
    key === 'caseNum') {
      if (key.indexOf('workload') > -1 || key.indexOf('Workload') > -1 || key === 'avgCaseCount') {
        obj = {
          field: key,
          title: this.columsObj[type][key],
          sortable: 'custom',
          align: 'right',
          minWidth: this.fd.tools.getStringWidth(this.columsObj[type][key]),
          formatter: (row, value) => {
            return this.elements.peg ? '<span class="color-blue pointer">' + this.fd.data.saveFloat(value, 2) + '</span>'
              : this.fd.data.saveFloat(value, 2)
          }
        }
      } else if (key === 'staffCount') {
        obj = {
          field: key,
          title: this.columsObj[type][key],
          sortable: 'custom',
          align: 'right',
          minWidth: this.fd.tools.getStringWidth(this.columsObj[type][key]),
          formatter: (row, value) => {
            if (value === 0 || row.departName === '其他') {
              return this.elements.peg ? '<span>' + value + '</span>' : value
            } else {
              return this.elements.peg ? '<span class="color-blue pointer" >' + value + '</span>' : value
            }
          }
        }
      } else {
        obj = {
          field: key,
          title: this.columsObj[type][key],
          sortable: 'custom',
          align: 'right',
          minWidth: this.fd.tools.getStringWidth(this.columsObj[type][key]),
          formatter: (row, value) => {
            return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
          }
        }
      }
    } else {
      if (key.indexOf('workload') > -1 || key.indexOf('Workload') > -1 || key === 'avgCaseCount') {
        obj = {
          field: key,
          title: this.columsObj[type][key],
          minWidth: this.fd.tools.getStringWidth(this.columsObj[type][key]),
          sortable: 'custom',
          align: 'right',
          formatter: (row, value) => {
            return this.fd.data.saveFloat(value, 2)
          }
        }
      } else {
        if (this.type === 'judge') {
          // 判断是否是承办部门或者法官，不需要右对齐，其他的都要右对齐
          if (key === 'departName' || key === 'staffName') {
            obj = {
              field: key,
              title: this.columsObj[type][key],
              minWidth: this.fd.tools.getStringWidth(this.columsObj[type][key]),
              fixed: true,
              sortable: 'custom'
            }
          }
        } else {
          // 判断是否是承办部门或者法官，不需要右对齐，其他的都要右对齐
          if (key === 'departName' || key === 'staffName') {
            obj = {
              field: key,
              title: this.columsObj[type][key],
              minWidth: this.fd.tools.getStringWidth(this.columsObj[type][key]),
              sortable: 'custom'
            }
          } else {
            obj = {
              field: key,
              title: this.columsObj[type][key],
              align: 'right',
              minWidth: this.fd.tools.getStringWidth(this.columsObj[type][key]),
              sortable: 'custom'
            }
          }
        }
      }
    }
    this[type + 'Opt'].columns.push(obj)
    this[type + 'Checkbox'].push({
      field: key,
      title: this.columsObj[type][key]
    })
    this[type + 'CheckedCols'].push(obj.field)
    this[type + 'CheckboxName'].push(obj.field)
    if (type !== 'depart') {
      this.printOpt.columns.push(obj)
    }
  }
}
export function typeChange() {
  this.refreshType()
}
