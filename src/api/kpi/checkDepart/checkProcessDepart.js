export function getAllProcess() {
  this.loading = true
  this.fd.req({
    url: 'api/dept/flow',
    method: 'get',
    data: this.params
  }).then((d) => {
    const data = d.data.data || []
    for (const item of data) {
      item.isedit = false
      item.isdelete = false
      item.hasDelete = this.elements.delete
      item.hasEdit = this.elements.edit
      item.hasCopy = this.elements.copy
      if (item.statusId === '1') {
        item.isedit = true
        item.isdelete = true
      } else {
        item.isedit = false
        item.isdelete = false
      }
    }
    this.total = d.data.total
    this.processOption.data = data
    this.loading = false
  })
}
export function searchByKeyword(val) {
  this.params.keyword = val
  this.params.offset = 0
  this.getAllProcess()
}
export function addProcess() {
  this.fd.tools.goDetail.call(this, 'processDetailDepart', { query: { page: 'add' }})
}
export function editProcess(row) {
  this.fd.tools.goDetail.call(this, 'processDetailDepart', { query: { page: 'edit', id: row.id }})
}
export function copyProcess(row) {
  this.$confirm('请问确定复制《' + row.name + '》流程设置吗?', '复制流程', {
    type: 'info'
  }).then(() => {
    this.fd.req({
      url: 'api/dept/flow/' + row.id,
      method: 'POST'
    }).then((d) => {
      this.getAllProcess()
      this.$message({
        type: 'success',
        message: '复制成功'
      })
    })
  })
}
export function deleteProcess(row) {
  this.$confirm('删除后该流程的设置内容将无法恢复，请问确定删除《' + row.name + '》流程设置吗?', '删除流程', {
    type: 'warning'
  }).then(() => {
    this.fd.req({
      url: 'api/dept/flow/' + row.id,
      method: 'delete'
    }).then((d) => {
      this.getAllProcess()
      this.$message({
        type: 'success',
        message: '删除成功'
      })
    })
  })
}
export function gotoDetail(row, column, cell, event) {
  if (column.property === 'name') {
    this.fd.tools.goDetail.call(this, 'processDetailDepart', { query: { id: row.id, page: 'detail' }})
  }
}
export function currentChange(val) {
  this.params.offset = (val - 1) * this.params.limit
  this.getAllProcess()
}
export function sizeChange(val) {
  this.params.limit = val
  this.params.offset = 0
  this.getAllProcess()
}
