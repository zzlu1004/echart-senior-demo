export function addLine() {
  if (this.hasActive) {
    this.$message({
      type: 'warning',
      message: '方案生效期间不支持任何操作。'
    })
    return
  }
  this.editLineTitle = '新增业务线'
  this.editLineDialog = true
  this.getdepartsData()
  this.$nextTick(() => {
    this.resetForm('lineForm')
    this.lineFrom.id = ''
    this.lineFrom.name = ''
    this.lineFrom.departIds = []
    this.disabled_edit = false
  })
}
export function searchByKeyword(val) {
  this.keyword = val
  this.getLineData()
}
// 新建编辑业务线保存
export function saveLine() {
  if (this.hasActive) {
    this.$message({
      type: 'warning',
      message: '方案生效期间不支持任何操作。'
    })
    return
  }
  this.$refs.lineForm.validate((valid) => {
    if (valid) {
      const type = this.lineFrom.id ? 'put' : 'post'
      this.fd.req({
        type: type,
        url: 'api/business-line',
        data: {
          id: this.lineFrom.id,
          departIds: this.lineFrom.departIds,
          name: this.lineFrom.name,
          keyword: '',
          limit: 0,
          offset: 0
        }
      }).then(response => {
        this.editLineDialog = false
        this.getLineData()
      }).catch(error => {
        console.log('saveLine', error)
      })
    } else {
      return false
    }
  })
}
// 获取业务线表格内容
export function getLineData() {
  this.loading = true
  this.fd.req({
    type: 'get',
    url: 'api/business-line',
    data: {
      keyword: this.keyword,
      limit: 0,
      offset: 0
    }
  }).then(response => {
    const data = response.data
    this.lineData = data.data
    this.loading = false
  }).catch(error => {
    console.log('getLineData', error)
  })
}
// 获取业务线涉及部门
export function getdepartsData() {
  this.fd.req({
    type: 'get',
    url: 'api/business-line/departs'
  }).then(response => {
    const data = response.data
    this.departs = data
    this.loading = false
  }).catch(error => {
    console.log('getLineData', error)
  })
}
// 删除业务线
export function deleteLine(data) {
  if (this.hasActive) {
    this.$message({
      type: 'warning',
      message: '方案生效期间不支持任何操作。'
    })
    return
  }
  this.$confirm('是否确定要删除该业务线?', '刪除业务线', {
    type: 'warning'
  }).then(() => {
    this.fd.req({
      url: 'api/business-line/' + data.id,
      method: 'delete'
    }).then((d) => {
      this.getLineData()
      this.$message({
        type: 'success',
        message: '删除成功'
      })
    })
  }).catch(() => {})
}
// 编辑业务线
export function editLine(row) {
  if (this.hasActive) {
    this.$message({
      type: 'warning',
      message: '方案生效期间不支持任何操作。'
    })
    return
  }
  this.editLineTitle = '编辑业务线'
  this.editLineDialog = true
  this.rowId = row.id
  this.getdepartsData()
  this.$nextTick(() => {
    this.$refs['lineForm'].resetFields()
    this.lineFrom = this.fd.tools.merge(true, {}, row)
  })
}
