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
export function handleSelect(key) {
  this.page = key
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
  if (!this.elements.peg) {
    return
  }
  let selfMsg = {}
  const docMap = {
    'trainCount': 'train',
    'jobCount': 'job',
    'fgpxCount': 'judgeTrain',
    'rewardCount': 'reward'
  }
  // 档案查询-学习拓展-调训培训、法官培训、干部兼职反查
  if (column.property === 'trainCount' || column.property === 'jobCount' || column.property === 'fgpxCount') {
    selfMsg = { departName: row.name, index: column.label, value: row[column.property], property: column.property }
    const obj = {
      params: {
        startTime: '',
        endTime: '',
        otherType: docMap[column.property]
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
    this.fd.tools.goDetail.call(this, 'studyTotalPeg', { query: { userId: this.userId || this.$store.getters.user.id,
      userName: this.userName, id: row.id, type: this.type, page: this.page, resource: 'center_study_develop' }})
  // 档案查询-学习拓展-表彰奖励、干部兼职反查
  } else if (column.property === 'rewardCount') {
    selfMsg = { departName: row.name, index: column.label, value: row[column.property], property: column.property }
    const obj = {
      params: {
        startTime: '',
        endTime: '',
        otherType: docMap[column.property]
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
    this.fd.tools.goDetail.call(this, 'studyTotalPeg', { query: { userId: this.userId || this.$store.getters.user.id,
      id: row.id, type: this.type, page: this.page, userName: this.userName, resource: 'center_punish_reward' }})
  }
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
  if (this.page === 'study') {
    url = 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/learning-development'
  } else if (this.page === 'rewardPunish') {
    url = 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/reward-punishment'
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
  if (this.page === 'study') {
    url = 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/learning-development'
  } else if (this.page === 'rewardPunish') {
    url = 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/reward-punishment'
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
  this.fileName = this.menuMap[this.page] + '_' + this.typeMap[this.type] + '_' + this.userName + '_'
  let url = ''
  if (this.page === 'study') {
    url = 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/learning-development/download'
  } else if (this.page === 'rewardPunish') {
    url = 'api/analysis/current-user/' + (this.userId || this.$store.getters.user.id) + '/reward-punishment/download'
  }
  const params = (this.type === 'year') ? this.yearParams : this.monthParams
  const params1 = {
    startTime: this.fd.tools.firstDayOfMonth(this.params.startTime),
    endTime: this.fd.tools.endDayOfMonth(this.params.endTime)
  }
  const data = this.fd.tools.merge(true, {}, params1, params, { fileName: this.fileName })
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
export function refreshStudyAll() {
  this.getColumns('study')
  this.refreshCondition()
  this.getYearTotal()
  this.getMonthTotal()
}
export function refreshPunishAll() {
  this.getColumns('rewardPunish')
  this.refreshCondition()
  this.getYearTotal()
  this.getMonthTotal()
}
// 自定义列表联动表格的表头显示
export function changeCols(val) {
  const opt = (this.type === 'year') ? this.yearOpt : this.monthOpt
  opt.columns = []
  for (const item of this.checkboxName) {
    if (val.indexOf(item) > -1) {
      let obj = {}
      if (item === 'name') {
        obj = {
          field: item,
          title: this.columsObj[this.page][item],
          sortable: 'custom',
          minWidth: 180
        }
      } else if (item === 'punishmentCount') {
        obj = {
          field: item,
          title: this.columsObj[this.page][item],
          sortable: 'custom',
          minWidth: 180,
          formatter: (row, value) => {
            return '--'
          }
        }
      } else {
        obj = {
          field: item,
          title: this.columsObj[this.page][item],
          sortable: 'custom',
          minWidth: 180,
          formatter: (row, value) => {
            return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
          }
        }
      }
      opt.columns.push(obj)
    }
  }
}
// 根据接口返回的数据字段匹配生成表头数据列
export function getColumns(page) {
  // 清空表格表头
  this.yearOpt.columns = []
  this.monthOpt.columns = []
  for (const key in this.columsObj[page]) {
    let obj = {}
    if (key === 'name') {
      obj = {
        field: key,
        title: this.columsObj[page][key],
        sortable: 'custom',
        minWidth: 180
      }
    } else if (key === 'punishmentCount') {
      obj = {
        field: key,
        title: this.columsObj[page][key],
        align: 'right',
        sortable: 'custom',
        minWidth: 180,
        formatter: (row, value) => {
          return '--'
        }
      }
    } else {
      obj = {
        field: key,
        title: this.columsObj[page][key],
        align: 'right',
        sortable: 'custom',
        minWidth: 180,
        formatter: (row, value) => {
          return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>' : value
        }
      }
    }
    this.yearOpt.columns.push(obj)
    this.monthOpt.columns.push(obj)
  }
}
