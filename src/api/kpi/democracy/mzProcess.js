export function getPersonList() {
  this.personloading = true
  this.fd.req({
    url: 'api/democratic-flows',
    method: 'get',
    data: this.personParams
  }).then((d) => {
    const data = d.data.data || []
    for (const item of data) {
      item.isedit = false
      item.isdelete = false
      item.hasDelete = this.elements.delete
      item.hasEdit = this.elements.edit
      item.hasCopy = this.elements.copy
      if (item.active === 'active') {
        item.isedit = true
        item.isdelete = true
      } else {
        item.isedit = false
        item.isdelete = false
      }
    }
    this.total1 = d.data.total
    this.personOpt.data = data
    this.personloading = false
  })
}
export function copy(row) {
  this.$confirm('请问确定复制《' + row.name + '》流程设置吗?', '复制流程', {
    type: 'info'
  }).then(() => {
    this.fd.req({
      url: 'api/democratic-flows/' + row.id + '/copy',
      method: 'POST'
    }).then((d) => {
      if (this.type === 'person') {
        this.getPersonList()
      } else {
        this.getDepartList()
      }
      this.$message({
        type: 'success',
        message: '复制成功'
      })
    })
  })
}
export function getDepartList() {
  this.departloading = true
  this.fd.req({
    url: 'api/democratic-flows',
    method: 'get',
    data: this.departParams
  }).then((d) => {
    const data = d.data.data || []
    for (const item of data) {
      item.isedit = false
      item.isdelete = false
      item.hasDelete = this.elements.delete
      item.hasEdit = this.elements.edit
      item.hasCopy = this.elements.copy
      if (item.active === 'active') {
        item.isedit = true
        item.isdelete = true
      } else {
        item.isedit = false
        item.isdelete = false
      }
    }
    this.total2 = d.data.total
    this.departOpt.data = data
    this.departloading = false
  })
}
export function addItem() {
  if (this.type === 'person') {
    this.fd.tools.goDetail.call(this, 'mzProcessDetail', { query: { page: 'add' }})
  } else {
    this.fd.tools.goDetail.call(this, 'mzProcessDetailDepart', { query: { page: 'add' }})
  }
}
export function editItem(row) {
  if (this.type === 'person') {
    this.fd.tools.goDetail.call(this, 'mzProcessDetail', { query: { id: row.id, page: 'edit' }})
  } else {
    this.fd.tools.goDetail.call(this, 'mzProcessDetailDepart', { query: { id: row.id, page: 'edit' }})
  }
}
export function deleteItem(row) {
  this.$confirm('删除后该流程的设置内容将无法恢复，请问确定删除《' + row.name + '》流程设置吗?', '删除流程', {
    type: 'warning'
  }).then(() => {
    this.fd.req({
      url: 'api/democratic-flows/' + row.id,
      method: 'delete'
    }).then((d) => {
      if (this.type === 'person') {
        this.getPersonList()
      } else {
        this.getDepartList()
      }
      this.$message({
        type: 'success',
        message: '删除成功'
      })
    })
  })
}
export function searchByKeyword(val) {
  this[this.type + 'Params'].keyword = val
  this[this.type + 'Params'].offset = 0
  if (this.type === 'person') {
    this.getPersonList()
  } else {
    this.getDepartList()
  }
}
export function currentChange(val) {
  this[this.type + 'Params'].offset = (val - 1) * this[this.type + 'Params'].limit
  if (this.type === 'person') {
    this.getPersonList()
  } else {
    this.getDepartList()
  }
}
export function sizeChange(val) {
  this[this.type + 'Params'].limit = val
  this[this.type + 'Params'].offset = 0
  if (this.type === 'person') {
    this.getPersonList()
  } else {
    this.getDepartList()
  }
}
export function seeDetail(row, column) {
  if (column.property === 'name') {
    if (this.type === 'person') {
      this.fd.tools.goDetail.call(this, 'mzProcessDetail', { query: { id: row.id, page: 'detail' }})
    } else {
      this.fd.tools.goDetail.call(this, 'mzProcessDetailDepart', { query: { id: row.id, page: 'detail' }})
    }
  }
}
