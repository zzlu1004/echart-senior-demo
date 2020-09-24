export function sortByNum(column) {
  this.params.orderField = column.prop
  this.params.orderType = column.order
  this.getAllResult()
}
export function getAllResult() {
  let data = {}
  if (this.resource === 'center_study_develop' || this.resource === 'center_punish_reward') {
    data = this.fd.tools.merge(true, {}, this.params, { id: this.id, type: this.type })
  } else {
    data = this.fd.tools.merge(true, {}, this.params, { id: this.id })
  }
  this.fd.req({
    url: this.url[this.resource].list,
    method: 'get',
    data: data
  }).then((d) => {
    const data = d.data || {}
    this.total = data.total || 0
    this.caseOpt.data = data.data
  })
}
export function changeCols(val) {
  let page = ''
  if (this.selfMsg.property === 'trainCount') {
    page = 'train'
  } else if (this.selfMsg.property === 'jobCount') {
    page = 'cadrePartTime'
  } else if (this.selfMsg.property === 'fgpxCount') {
    page = 'judgeTrain'
  } else if (this.selfMsg.property === 'rewardCount') {
    page = 'reward'
  } else {
    page = this.page
  }
  this.caseOpt.columns = []
  for (const item of this.checkboxName) {
    if (val.indexOf(item) > -1) {
      let obj = {}
      obj = {
        field: item,
        title: this.headMap[page][item],
        sortable: 'custom',
        minWidth: this.fd.tools.getStringWidth(this.headMap[page][item])
      }
      this.caseOpt.columns.push(obj)
    }
  }
}
export function getColumns(page) {
  this.checkedCols = []
  this.checkbox = []
  this.checkboxName = []
  this.caseOpt.columns = []
  const head = this.headMap[page]
  this.caseOpt.columns = []
  let obj = {}
  for (const item in head) {
    obj = {
      field: item,
      title: head[item],
      sortable: 'custom',
      minWidth: this.fd.tools.getStringWidth(head[item])
    }
    this.caseOpt.columns.push(obj)
    this.checkbox.push({
      field: item,
      title: head[item]
    })
    this.checkedCols.push(obj.field)
    this.checkboxName.push(obj.field)
  }
}
export function initResult() {
  let page = ''
  if (this.selfMsg.property === 'trainCount') {
    page = 'train'
  } else if (this.selfMsg.property === 'jobCount') {
    page = 'cadrePartTime'
  } else if (this.selfMsg.property === 'fgpxCount') {
    page = 'judgeTrain'
  } else if (this.selfMsg.property === 'rewardCount') {
    page = 'reward'
  } else {
    page = this.page
  }
  this.getColumns(page)
  this.getAllResult()
}
export function downloadTable() {
  let data = {}
  // 档案查询-学习拓展 || 档案查询-工作奖惩是人名
  if (this.resource === 'center_punish_reward' || this.resource === 'center_study_develop') {
    data = this.fd.tools.merge(true, {}, this.params, { id: this.id, type: this.type })
    this.fileName = this.menuMap[this.page] + '_' + this.typeMap[this.type] + '_' + this.userName + '_' +
      this.selfMsg.index + '_' + this.params.startTime + '至' + this.params.endTime + '_'
  } else {
  // 其他都是点击对象
    data = this.fd.tools.merge(true, {}, this.params, { id: this.id })
    this.fileName = this.menuMap[this.page] + '_' + this.typeMap[this.type] + '_' + this.selfMsg.departName + '_' +
      this.selfMsg.index + '_' + this.params.startTime + '至' + this.params.endTime + '_'
  }
  const url = this.url[this.resource].download
  const Data = this.fd.tools.merge(true, {}, data, { id: this.id, fileName: this.fileName })
  this.fd.tools.download('', url, Data)
}
export function searchByKeyword(val) {
  this.params.keyword = val
  this.params.offset = 0
  this.getAllResult()
}
export function currentChange(val) {
  this.params.offset = (val - 1) * this.params.limit
  this.getAllResult()
}
export function sizeChange(val) {
  this.params.limit = val
  this.params.offset = 0
  this.getAllResult()
}
