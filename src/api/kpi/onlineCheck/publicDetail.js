export function getInfoById() {
  this.fd.req({
    url: 'api/schemas/' + this.schemaId + '/grade',
    method: 'get'
  }).then((d) => {
    const data = d.data || {}
    this.schema = data
    for (const item of data.grades) {
      this.levelMap.push({
        id: item.gradeId,
        name: item.gradeName
      })
    }
  })
}
export function refreshAllLevel() {
  this.params.limit = 10
  this.params.offset = 0
  this.getAllLevel()
}
export function getAllLevel() {
  this.loading = true
  this.totalParams = this.fd.tools.merge(true, {}, this.params)
  this.fd.req({
    url: 'api/evaluations/grade',
    method: 'POST',
    data: this.totalParams
  }).then((d) => {
    const data = d.data || {}
    this.loading = false
    this.lists = data.data || []
    this.total = data.total || 0
  })
}
export function searchByKeyword(val) {
  this.params.keyword = val
  this.params.offset = 0
  this.getAllLevel()
}
export function gotoMyResult(row) {
  const timeRange = {
    startTime: this.schema.startTime,
    endTime: this.schema.endTime
  }
  localStorage.setItem('timeRange', JSON.stringify(timeRange))
  this.fd.tools.goDetail.call(this, 'staffDetail', { query: {
    id: row.staffId,
    schemaId: this.schemaId,
    schemaBlockType: this.schema.schemaBlockType
  }})
}
export function changeGradeReason(val, row) {
  const data = {
    id: row.id,
    gradeId: row.gradeId,
    schemaId: row.schemaId,
    publicGradeReason: val
  }
  const arr = []
  arr.push(data)
  this.changeLevel(arr)
}
export function chooseLevel(val, row) {
  if (!this.edit) {
    return
  }
  if (row.gradeId === val) {
    return
  } else {
    row.gradeId = val
  }
  const data = {
    id: row.id,
    schemaId: row.schemaId,
    gradeId: val,
    publicGradeReason: row.publicGradeReason
  }
  const arr = []
  arr.push(data)
  this.changeLevel(arr)
}
export function downloadTable() {
  let fileName = ''
  const types = this.params.types
  let type = ''
  for (let i = 0; i < types.length; i++) {
    if (i === types.length - 1) {
      type = type + this.typeMap[types[i]]
    } else {
      type = type + this.typeMap[types[i]] + '、'
    }
  }
  fileName = this.schema.name + type + '评档结果'
  const data = this.fd.tools.merge(true, {}, this.totalParams, { fileName: fileName })
  this.fd.tools.downloadByHtml(data, 'api/evaluations/grade/export', 'post')
}
export function editLevel(row, event, column) {
}
export function currentChange(val) {
  this.params.offset = (val - 1) * this.params.limit
  this.getAllLevel()
}
export function sizeChange(val) {
  this.params.limit = val
  this.params.offset = 0
  this.getAllLevel()
}
export function changeLevel(val) {
  this.fd.req({
    url: 'api/evaluations/grade',
    method: 'PUT',
    data: val
  }).then((d) => {
  })
}
export function sortByNum(column) {
  this.params.orderField = column.prop
  this.params.orderType = column.order
  this.getAllLevel()
}
