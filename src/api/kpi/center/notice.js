export function currentChange(page) {
  if (this.type === 'my') {
    this.myParams.offset = (page - 1) * this.myParams.limit
    this.getMyNotice()
  } else {
    this.params.offset = (page - 1) * this.params.limit
    this.getNoticeList()
  }
}
export function sizeChange(limit) {
  if (this.type === 'my') {
    this.myParams.limit = limit
    this.getMyNotice()
  } else {
    this.params.limit = limit
    this.getNoticeList()
  }
}
export function getNoticeList() {
  this.fd.req({
    type: 'get',
    url: 'api/notices/bulletins',
    data: this.params
  }, 'basic_url').then(response => {
    const data = response.data || {}
    let index = 0
    for (const item of data.data) {
      item.index = index + this.params.offset
      index++
    }
    this.noticeOption.data = data.data || []
    this.total = data.total || 0
    this.tableObj[this.type] = 1
  }).catch(error => {
    console.log(error)
  })
}
export function getMyNotice() {
  this.fd.req({
    type: 'get',
    url: 'api/notices/manage/bulletins',
    data: this.myParams
  }, 'basic_url').then(response => {
    const data = response.data || {}
    let index = 0
    for (const item of data.data) {
      if (item.status === '6') {
        item.isedit = false
        item.isdelete = false
        item.isrecall = true
      } else {
        item.isedit = true
        item.isdelete = true
        item.isrecall = false
      }
      item.index = index + this.params.offset
      index++
    }
    this.myOption.data = data.data || []
    this.myTotal = data.total || 0
    this.tableObj[this.type] = 1
  }).catch(error => {
    console.log(error)
  })
}
export function searchByKeyword(val) {
  if (this.type === 'my') {
    this.myParams.keyword = val
    this.myParams.offset = 0
    this.getMyNotice()
  } else {
    this.params.keyword = val
    this.params.offset = 0
    this.getNoticeList()
  }
}
export function addNotice() {
  this.fd.tools.goDetail.call(this, 'editNotice')
}
export function editNotice(row) {
  this.fd.tools.goDetail.call(this, 'editNotice', { query: { id: row.id }})
}
export function seeDetail(row, column) {
  if (column.property === 'title') {
    this.fd.tools.goDetail.call(this, 'noticeDetail', { query: { id: row.id, type: this.type, index: row.index }})
  }
}
export function deleteNotice(row) {
  this.$confirm('删除后该公告的内容将无法恢复，请问确认删除已选中的公告吗？', '删除公告', {
    type: 'warning'
  }).then(() => {
    this.fd.req({
      url: 'api/notices/' + row.id,
      method: 'delete'
    }, 'basic_url').then(() => {
      this.$message({
        type: 'success',
        message: '删除成功'
      })
      this.getMyNotice()
      this.getNoticeList()
    })
  })
}
export function recallNotice(row) {
  this.$confirm('撤回后该条公告将变成草稿状态，请问确认撤回已选中的公告吗？', '撤回公告', {
    type: 'warning'
  }).then(() => {
    this.fd.req({
      url: 'api/notices/' + row.id + '/withdraw',
      method: 'put'
    }, 'basic_url').then(() => {
      this.$message({
        type: 'success',
        message: '撤回成功'
      })
      this.getMyNotice()
      this.getNoticeList()
    })
  })
}
