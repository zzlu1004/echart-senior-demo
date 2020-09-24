export function changeIndexModels() {
  if (this.indexModels === 'finished') {
    this.getAllPublic()
  } else if (this.indexModels === 'active') {
    this.getAllActivePublic()
  }
}
// 搜索table和分页的total
export function getAllPublic() {
  this.loading = true
  this.fd.req({
    url: 'api/dept/schemas/finished',
    method: 'get',
    data: this.params
  }).then((d) => {
    const data = d.data.data || []
    let index = 0
    for (const item of data) {
      item.index = ++index
      // 判断显示编辑、公示、撤回公示三个按钮，isPublic === '1'是已公示状态
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
    url: 'api/dept/schemas/public/active',
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

// 模糊查询
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
// “编辑”，page: 'edit'页面可以编辑
export function editPublic(row) {
  this.fd.tools.goDetail.call(this, 'publicDetailDepart', { query: { page: 'edit', id: row.id }})
}
// “公示”
export function publicing(row) {
  this.visible = true
  this.schemaId = row.id
  this.content = '请问确认按照如上范围，公示《' + row.name + '》的结果吗？'
}
export function publicingActive(row) {
  this.fd.req({
    url: 'api/dept/schemas/' + row.id + '/display',
    method: 'put'
  }).then((d) => {
    this.getAllActivePublic()
    this.$message({
      type: 'success',
      message: '公开成功'
    })
  })
}
// “撤回公示”
export function callPublic(row) {
  this.$confirm('撤回后被考核人将不能看到考核结果，请问确定撤回公示《' + row.name + '》的结果吗？', '撤回公示', {
    type: 'warning'
  }).then(() => {
    this.fd.req({
      url: 'api/dept/schemas/' + row.id + '/public/withdraw',
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
export function callPublicActive(row) {
  this.$confirm('撤回后被考核人将不能看到考核结果，请问确定撤回公开《' + row.name + '》的结果吗？', '撤回公开', {
    type: 'warning'
  }).then(() => {
    this.fd.req({
      url: 'api/dept/schemas/' + row.id + '/display/withdraw',
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
// “确定”
export function surePublic() {
  const data = this.form.publicColumn.join(',')
  this.fd.req({
    url: 'api/dept/schemas/' + this.schemaId + '/public',
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
// 查看公示详情，page: 'detail'页面不可编辑
export function gotoDetail(row, column, cell, event) {
  if (column.property === 'name') {
    this.fd.tools.goDetail.call(this, 'publicDetailDepart', { query: { page: 'detail', id: row.id }})
  }
}
// 换页
export function currentChange(val) {
  this.params.offset = (val - 1) * this.params.limit
  this.getAllPublic()
}
// 分页
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
