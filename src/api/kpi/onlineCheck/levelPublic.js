export function changeIndexModels() {
  if (this.indexModels === 'finished') {
    this.getAllPublic()
  } else if (this.indexModels === 'active') {
    this.getAllActivePublic()
  }
}
export function getAllPublic() {
  this.loading = true
  this.fd.req({
    url: 'api/schemas/finished',
    method: 'get',
    data: this.params
  }).then((d) => {
    const data = d.data.data || []
    let index = 0
    for (const item of data) {
      item.index = ++index
      if (item.isPublic === '1') {
        item.isCall = true
        item.isEdit = false
      } else {
        item.isedit = true
        item.isPub = true
      }
    }
    this.loading = false
    this.total = d.data.total
    this.levelOption.data = data
  })
}
export function getAllActivePublic() {
  this.loading = true
  this.fd.req({
    url: 'api/schemas/public/active',
    method: 'get',
    data: this.activeParams
  }).then((d) => {
    const data = d.data.data || []
    let index = 0
    for (const item of data) {
      item.index = ++index
      if (item.display === '1') {
        item.isCall = true
        item.isEdit = false
      } else {
        item.isedit = true
        item.isPub = true
      }
    }
    this.loading = false
    this.activeTotal = d.data.total
    this.activeOption.data = data
  })
}
export function searchByKeyword(val) {
  this.params.schemaName = val
  this.params.offset = 0
  this.getAllPublic()
}
export function searchByKeywordActive(val) {
  this.activeParams.schemaName = val
  this.activeParams.offset = 0
  this.getAllActivePublic()
}
export function editPublic(row) {
  this.fd.tools.goDetail.call(this, 'publicDetail', { query: { page: 'edit', id: row.id }})
}
export function publicing(row) {
  this.visible = true
  this.schemaId = row.id
  this.content = '请问确认按照如上范围，公示《' + row.name + '》的结果吗？'
}
export function callPublic(row) {
  this.$confirm('撤回后被考核人将不能看到考核结果，请问确定撤回公示《' + row.name + '》的结果吗？', '撤回公示', {
    type: 'warning'
  }).then(() => {
    this.fd.req({
      url: 'api/schemas/' + row.id + '/public/withdraw',
      method: 'put'
    }).then((d) => {
      this.getAllPublic()
      this.$message({
        type: 'success',
        message: '撤回成功'
      })
    })
  })
}
export function publicingActive(row) {
  this.fd.req({
    url: 'api/schemas/' + row.id + '/display',
    method: 'put'
  }).then((d) => {
    this.getAllActivePublic()
    this.$message({
      type: 'success',
      message: '公开成功'
    })
  })
}
export function callPublicActive(row) {
  this.$confirm('撤回后被考核人将不能看到考核结果，请问确定撤回公开《' + row.name + '》的结果吗？', '撤回公开', {
    type: 'warning'
  }).then(() => {
    this.fd.req({
      url: 'api/schemas/' + row.id + '/display/withdraw',
      method: 'put'
    }).then((d) => {
      this.getAllActivePublic()
      this.$message({
        type: 'success',
        message: '撤回成功'
      })
    })
  })
}
export function surePublic() {
  const data = this.form.publicColumn.join(',')
  this.fd.req({
    url: 'api/schemas/' + this.schemaId + '/public',
    method: 'put',
    data: { publicColumn: data }
  }).then((d) => {
    this.getAllPublic()
    this.visible = false
    this.$message({
      type: 'success',
      message: '公示成功'
    })
  })
}
export function gotoDetail(row, column, cell, event) {
  if (column.property === 'name') {
    this.fd.tools.goDetail.call(this, 'publicDetail', { query: { page: 'detail', id: row.id }})
  }
}
export function currentChange(val) {
  this.params.offset = (val - 1) * this.params.limit
  this.getAllPublic()
}
export function sizeChange(val) {
  this.params.limit = val
  this.params.offset = 0
  this.getAllPublic()
}
export function activeCurrentChange(val) {
  this.activeParams.offset = (val - 1) * this.activeParams.limit
  this.getAllActivePublic()
}
export function activeSizeChange(val) {
  this.activeParams.limit = val
  this.activeParams.offset = 0
  this.getAllActivePublic()
}
