export function sortByNum(column) {
  this.params.orderField = column.prop
  this.params.orderType = column.order
  this.getAllResult()
}
// 工作量占比
export function getWorkRate() {
  let url = ''
  if (this.type === 'clerk') {
    url = 'api/analysis/pegging/' + this.type + '/workload/proportion'
  } else if (this.type === 'assistant') {
    url = 'api/analysis/pegging/assistant/workload/proportion'
  } else {
    url = 'api/analysis/' + this.type + '/pegging/workload/proportion'
  }
  if (!this.pParams.params.weightId) {
    this.pParams.params.weightId = this.params.weightId
  }
  this.fd.req({
    url: url,
    method: 'get',
    data: this.fd.tools.merge(true, {}, this.cParams, this.pParams.params)
  }).then((d) => {
    const data = d.data || []
    this.workRateOpt.data = data
  })
}
// 工作量构成
export function getWorkForm() {
  let url = ''
  if (this.type === 'clerk') {
    url = 'api/analysis/pegging/' + this.type + '/workload/constitute'
  } else if (this.type === 'assistant') {
    url = 'api/analysis/pegging/assistant/workload/constitute'
  } else {
    url = 'api/analysis/' + this.type + '/pegging/workload/constitute'
  }
  if (!this.pParams.params.weightId) {
    this.pParams.params.weightId = this.params.weightId
  }
  this.fd.req({
    url: url,
    method: 'get',
    data: this.fd.tools.merge(true, {}, this.cParams, this.pParams.params)
  }).then((d) => {
    const data = d.data || []
    this.workOpt.data = data
  })
}
// 浮动因素得分分布
export function getFloat() {
  let url = ''
  if (this.type === 'clerk') {
    url = 'api/analysis/pegging/' + this.type + '/workload/score'
  } else if (this.type === 'assistant') {
    url = 'api/analysis/pegging/assistant/workload/score'
  } else {
    url = 'api/analysis/' + this.type + '/pegging/workload/score'
  }
  if (!this.pParams.params.weightId) {
    this.pParams.params.weightId = this.params.weightId
  }
  this.fd.req({
    url: url,
    method: 'get',
    data: this.fd.tools.merge(true, {}, this.cParams, this.pParams.params)
  }).then((d) => {
    const data = d.data || []
    this.floatOpt.data = data
  })
}
// 从数魔方跳转过来，需要重新获取最新的权重系数
export function getCubePeg() {
  this.fd.req({
    url: 'api/weight/active',
    method: 'get',
    data: {
      limit: 0,
      offset: 0,
      status: '',
      keyword: ''
    }
  }).then((d) => {
    const data = d.data || []
    if (data.length > 0) {
      this.params.weightId = data[0].id
    } else {
      this.params.weightId = ''
    }
    this.refreshAllResult()
    this.getEchartData()
  })
}
// 从数魔方跳转过来，需要重新获取最新的权重系数assistloadPeg
export function getCubePegAssist() {
  this.fd.req({
    url: 'api/weight/active',
    method: 'get',
    data: {
      limit: 0,
      offset: 0,
      status: '',
      keyword: ''
    }
  }).then((d) => {
    const data = d.data || []
    if (data.length > 0) {
      this.params.weightId = data[0].id
    } else {
      this.params.weightId = ''
    }
    this.refreshAllResult()
  })
}
// 获取图标的数据
export function getEchartData() {
  this.getWorkRate()
  this.getWorkForm()
  this.getFloat()
}
export function refreshAllResult() {
  this.loading = true
  let url = ''
  if (this.type === 'clerk') {
    url = 'api/analysis/pegging/' + this.type + '/workload'
  } else if (this.type === 'assistant') {
    url = 'api/analysis/pegging/assistant/workload'
  } else {
    url = 'api/analysis/' + this.type + '/pegging/workload'
  }
  this.fd.req({
    url: url,
    method: 'get',
    data: this.params
  }).then((d) => {
    const data = d.data || {}
    this.total = data.total || 0
    this.caseOpt.data = data.data
    this.loading = false
    this.getColumns(data.columns)
  })
}
// 获取表格中数据
export function getAllResult() {
  this.loading = true
  let url = ''
  if (this.type === 'clerk') {
    url = 'api/analysis/pegging/' + this.type + '/workload'
  } else if (this.type === 'assistant') {
    url = 'api/analysis/pegging/assistant/workload'
  } else {
    url = 'api/analysis/' + this.type + '/pegging/workload'
  }
  this.fd.req({
    url: url,
    method: 'get',
    data: this.params
  }).then((d) => {
    const data = d.data || {}
    this.total = data.total || 0
    this.caseOpt.data = data.data
    this.loading = false
  })
}
export function changeCols(val) {
  this.caseOpt.columns = []
  for (const item of this.checkboxName) {
    if (val.indexOf(item) > -1) {
      let obj = {}
      obj = {
        field: item,
        title: this.columsObj[this.type][item],
        sortable: 'custom',
        minWidth: this.fd.tools.getStringWidth(this.columsObj[this.type][item]),
        formatter: (row, value) => {
          if (typeof (value) === 'number') {
            return this.fd.data.saveFloat(value, 4)
          } else {
            return value
          }
        }
      }
      this.caseOpt.columns.push(obj)
    }
  }
}
export function getColumns(columns) {
  this.checkedCols = []
  this.checkbox = []
  this.checkboxName = []
  this.caseOpt.columns = []
  for (const item of columns) {
    let obj = {}
    obj = {
      field: item.content,
      title: item.comments,
      minWidth: this.fd.tools.getStringWidth(item.comments),
      sortable: 'custom',
      formatter: (row, value) => {
        if (typeof (value) === 'number') {
          return this.fd.data.saveFloat(value, 4)
        } else {
          return value
        }
      }
    }
    this.caseOpt.columns.push(obj)
    this.checkbox.push({
      field: item.content,
      title: item.comments
    })
    this.columsObj[this.type][item.content] = item.comments
    this.checkedCols.push(obj.field)
    this.checkboxName.push(obj.field)
  }
}
