export function refreshList() {
  this.getList()
}
export function searchByKeyword(val) {
  this.keyword = val
  this.offset = 0
  this.getList()
}
export function getList() {
  this.tableOpt.loading = true
  this.fd.req({
    type: 'get',
    url: 'api/weight',
    data: {
      limit: this.limit,
      offset: this.offset,
      keyword: this.keyword
    }
  }).then(response => {
    const d = response.data
    const data = d.data
    for (const item of data) {
      // item.status 表示 这个权重系数是否被占用, 2: 启用中
      item.edit = item.status === this.forbid || item.isUse === '1' || item.isUse === '2'
      item.delete = item.status === this.forbid || item.isUse === '1' || item.isUse === '2'
      item.enabled = item.isUse === '1' || item.isUse === '2' || item.status === 1
      item.cancel = item.isUse === '0' || item.isUse === '3' || item.isUse === '2' || item.status === 1
      item.enable_enabled = this.elements.enabled && (item.isUse === '0' || item.isUse === '3' || item.isUse === null)
      item.enable_cancel = this.elements.cancel && item.isUse === '1'
      item.enable_edit = this.elements.edit
      item.enable_copy = this.elements.copy
      item.enable_delete = this.elements.delete
    }
    this.tableOpt.data = data
    this.total = d.total
    this.tableOpt.loading = false
  }).catch(error => {
    console.log('getList', error)
  })
}

export function currentChange(page) {
  this.offset = (page - 1) * this.limit
  this.getList()
}

export function sizeChange(limit) {
  this.limit = limit
  this.refreshList()
}
export function caseCurrentChange(page) {
  this.offset = (page - 1) * this.limit
  this.getTableData()
}

export function caseSizeChange(limit) {
  this.limit = limit
  this.getTableData()
}
export function addCoefficient() {
  this.addCoefficientDialog = true
  this.$nextTick(() => {
    this.resetForm('detailForm')
    this.formData.name = ''
  })
}
export function editCoefficient(data) {
  if (data.status !== this.forbid) {
    this.$router.push({ name: 'weightCoefficient-coefficientDetail', query: { id: data.id }, params: { behavior: 'edit' }})
  }
}
export function showCoefficient(data) {
  this.$router.push({ name: 'weightCoefficient-coefficientDetail', query: { id: data.id }, params: { behavior: 'show' }})
}
export function copyCoefficient(data) {
  this.$confirm('请问确定复制《' + data.name + '》权重系数吗?', '复制权重系数', {
    type: 'info'
  }).then(() => {
    this.fd.req({
      type: 'POST',
      url: 'api/weight/' + data.id + '/copy'
    }).then(response => {
      this.$message({
        type: 'success',
        message: '复制成功'
      })
      this.refreshList()
    }).catch(error => {
      console.log('copyCoefficient', error)
    })
  }).catch(() => {})
}
export function deleteCoefficient(data) {
  if (data.status !== this.forbid) {
    this.$confirm('删除后该权重系数的设置内容将无法恢复, 请问确定删除《' + data.name + '》系数设置吗?', '删除权重系数', {
      type: 'warning'
    }).then(() => {
      this.fd.req({
        type: 'delete',
        url: 'api/weight/' + data.id
      }).then(response => {
        this.refreshList()
      }).catch(error => {
        console.log('deleteCoefficient', error)
      })
    }).catch(() => {})
  }
}

// 取消编辑
export function cancelEdit() {
  if (this.firstShow) {
    this.isShow = true
    this.fd.tools.merge(true, this.formData, this.oldData)
    this.roleCancel = !this.roleCancel
  } else {
    this.goBack()
  }
}
export function detailEdit() {
  this.fd.tools.merge(true, this.oldData, this.formData)
  this.isShow = false
}
export function saveNewCoefficient() {
  this.$refs.detailForm.validate((valid) => {
    if (valid) {
      this.fd.req({
        url: 'api/weight',
        method: 'post',
        data: {
          name: this.formData.name
        }
      }).then((d) => {
        this.addCoefficientDialog = false
        this.editCoefficient(d.data)
      })
    }
  })
}
export function validateCoefficient() {
  this.$refs.detailForm.validate((valid) => {
    if (valid) {
      this.validate = !this.validate
    }
  })
}
export function validateBack(flag) {
  if (flag) {
    this.refresh = !this.refresh
    this.isShow = true
  }
}
export function editCoefficientCase() {
  this.fd.req({
    url: 'api/weight',
    method: 'put',
    data: {
      id: this.id,
      name: this.formData.name,
      weightmodelId: this.weightmodelId
    }
  }).then((d) => {
  })
}
export function validateCoefficientRole() {
  this.$refs.roleForm.validate((valid) => {
    if (valid) {
      this.$emit('validateBack', true)
    } else {
      this.$message({
        type: 'warning',
        message: '办案角色权重必填，请填写完整后统一保存'
      })
    }
  })
}
export function editCoefficientRole() {
  const data = []
  for (const item of this.formData.courts) {
    const form = item.form
    for (const li of form) {
      if (li.type === '1' || li.type === 1) {
        data.push({
          weightId: this.id,
          collegiateBenchId: li.id,
          value: parseFloat(li.value)
        })
      }
    }
  }
  this.fd.req({
    url: 'api/weight/collegiate/' + this.id,
    method: 'put',
    data: data
  }).then((d) => {
    this.getRoles(this.id)
  })
}
export function getRoles(id) {
  if (id) {
    this.fd.req({
      type: 'get',
      url: 'api/weight/collegiate/' + id
    }).then(response => {
      this.formData.courts = response.data
      this.formData.init_courts = JSON.parse(JSON.stringify(response.data))
    }).catch(error => {
      console.log('getRoles', error)
    })
  }
}
// 获取案件权重体系左下方树的数据
export function getModelTree(modelId) {
  this.fd.req({
    type: 'get',
    url: 'api/weight/page/' + modelId
  }).then(response => {
    this.treeData = this.fd.data.changeToTree(response.data, 'id', 'parentId')
    const firstLeaf = getFirstLeaf(this.treeData)
    this.$nextTick(() => {
      if (this.$refs.leftModelTree) {
        this.$refs.leftModelTree.setCurrentKey(firstLeaf.id)
        this.treeSelect(firstLeaf, this.$refs.leftModelTree.getNode(firstLeaf.id))
      }
    })
  }).catch(error => {
    console.log('getModelTree', error)
  })
}
function getFirstLeaf(data) {
  data = data || []
  let back = {}
  if (data[0] && data[0].children && data[0].children.length > 0) {
    back = getFirstLeaf(data[0].children)
  } else if (data[0]) {
    back = JSON.parse(JSON.stringify(data[0]))
  }
  return back
}
// 案件权重体系左下方树选择发生变化
export function treeSelect(data, node) {
  if (node.isLeaf) {
    this.offset = 0
    this.selectItemId = data.id
    this.selectItem = node
    this.getHeads(data)
    this.getTableData()
  }
}
export function getTableData() {
  const options = {
    lock: true,
    text: '数据正在加载中',
    target: document.querySelector('#dynamicTable')
  }
  this.loading = this.$loading(options)
  this.fd.req({
    type: 'get',
    url: 'api/weight/kpi',
    data: {
      pageId: this.selectItemId,
      keyword: this.keywords,
      weightId: this.id,
      weightmodelId: this.weightmodelId,
      startTime: this.timeRange[0],
      endTime: this.timeRange[1],
      limit: this.limit,
      offset: this.offset,
      orderField: this.orderField,
      orderType: this.orderType
    }
  }).then(response => {
    this.allData = response.data.data
    this.loading.close()
    this.tableData = response.data.data
    this.total = response.data.total
  }).catch(error => {
    this.tableData = []
    this.total = 0
    console.log('getTableData', error)
  })
}
export function getHeads(data) {
  this.fd.req({
    type: 'get',
    url: 'api/weight/model/page/tableHeader/' + this.weightmodelId,
    data: {
      pageId: data.id
    }
  }).then(response => {
    this.heads = response.data
  }).catch(error => {
    console.log('getHeads', error)
  })
}
// 获取模型系数详情
export function getWeightDetail(id) {
  this.fd.req({
    type: 'get',
    url: 'api/weight/' + id
  }).then(response => {
    const data = response.data || {}
    this.formData.name = data.name
    this.formData.status = data.status || 0
    this.formData.isUse = data.isUse || '0'
    this.formData.weightmodelId = data.weightmodelId || ''
    // 拥有编辑权限，关联方案状态不为已生效，启用状态为未启用或者启用失效
    this.canEdit = this.elements.edit && this.formData.status !== this.forbid && (this.formData.isUse === '0' || this.formData.isUse === '3')
  }).catch(error => {
    console.log('getWeightDetail', error)
  })
}
// 案件权重体系表格列点击事件
export function rowClick(column) {
  this.orderField = column.prop || ''
  this.orderType = column.order || ''
  this.getTableData()
}
// 案件权重体系表格数据刷新后需要保存
export function dataRefresh() {

}
// 案件列表检索
export function searchTable() {
  this.offset = 0
  this.getTableData()
}
// 导出权重系数表格
export function exportTable() {
  const html = this.$refs.dynamicTable.$el.childNodes[0].innerHTML
  const name = this.name + getNodeName(this.selectItem) + '_' + this.timeRange[0] + '至' + this.timeRange[1]
  const params = {
    pageId: this.selectItemId,
    keyword: this.keywords,
    weightId: this.id,
    weightmodelId: this.weightmodelId,
    startTime: this.timeRange[0],
    endTime: this.timeRange[1],
    limit: this.limit,
    offset: this.offset,
    orderField: this.orderField,
    orderType: this.orderType
  }
  this.fd.tools.downloadByHtml({ divContent: html, fileName: name, headerName: name, type: 'complex', ...params }, 'api/weight/kpi/download', 'post')
}
// 导出全部权重系数表格
export function exportAllTable() {
  const html = this.$refs.dynamicTable.$el.childNodes[0].innerHTML
  const name = this.name + '_全部因素' + '_' + this.timeRange[0] + '至' + this.timeRange[1]
  const params = {
    pageId: this.selectItemId,
    keyword: this.keywords,
    weightId: this.id,
    weightmodelId: this.weightmodelId,
    startTime: this.timeRange[0],
    endTime: this.timeRange[1],
    limit: this.limit,
    offset: this.offset,
    orderField: this.orderField,
    orderType: this.orderType
  }
  this.fd.tools.downloadByHtml({ divContent: html, fileName: name, headerName: name, type: 'complex', ...params }, 'api/weight/kpis/download', 'post')
}
function getNodeName(node, name = '') {
  console.log()
  if (node) {
    name = '_' + node.data.label + name
    if (node.level > 1) {
      return getNodeName(node.parent, name)
    }
  }
  return name
}
export function cellClick(row, column, cell, event) {
  if (column.property === 'name') {
    this.showCoefficient(row)
  }
}
export function cancelCoefficient(data) {
  if (!data.cancel) {
    const options = {
      lock: true,
      text: '正在取消启用中,请稍等......'
    }
    this.loading = this.$loading(options)
    this.fd.req({
      type: 'put',
      url: 'api/weight/' + data.id + '/inactive'
    }).then(response => {
      this.$message({
        type: 'success',
        message: response.message
      })
      this.loading.close()
      this.getList()
    }).catch(error => {
      this.loading.close()
      console.log('cancelCoefficient', error)
    })
  }
}
// 权重系数启用校验
export function checkCoefficient(data) {
  if (!data.enabled) {
    this.loading = this.$loading({
      lock: true,
      text: '正在校验中，请稍等...'
    })
    this.fd.req({
      type: 'get',
      url: 'api/weight/' + data.id + '/active/check'
    }).then(res => {
      this.loading.close()
      if (res && res.code === 200 && !res.data.isAccess) {
        this.checkCoefficientDialog = true
        this.checkErrorList = res.data.data
      } else {
        this.startCoefficient(data)
      }
    })
  }
}

export function startCoefficient(data) {
  if (!data.enabled) {
    const options = {
      lock: true,
      text: '正在启用中,请稍等......'
    }
    this.loading = this.$loading(options)
    this.fd.req({
      type: 'put',
      url: 'api/weight/' + data.id + '/active'
    }).then(response => {
      this.$message({
        type: 'success',
        message: response.message
      })
      this.loading.close()
      this.getList()
    }).catch(error => {
      this.loading.close()
      console.log('startCoefficient', error)
    })
  }
}
export function handleCheckChange() {
  this.$nextTick(() => {
    const ref = this.$refs.modelTree
    this.defaultCheckKeys = [...ref.getCheckedKeys(), ...ref.getHalfCheckedKeys()]
    this.getTableHead(this.heads)
  })
}
export function getTableHead(data = this.heads) {
  const selects = data.filter((item, d) => {
    return this.defaultCheckKeys.indexOf(item.id) > -1
  })
  this.tableTree = []
  this.$nextTick(() => {
    this.tableTree = this.fd.data.changeToTree(selects, 'id', 'parentId')
  })
}
export function uploadSuccess(data) {
  this.loading.close()
  this.getTableData()
  this.$message({
    type: data.code > 299 ? 'error' : 'success',
    message: data.message
  })
}
export function uploadError(data) {
  this.loading.close()
  this.$message({
    type: 'error',
    message: data.message
  })
}
export function onProgress() {
  const options = {
    lock: true,
    text: '文件正在导入读取数据中,请稍后......'
  }
  this.loading = this.$loading(options)
}
export function beforeUpload(data) {
  if (!this.weightmodelId) {
    this.$message({
      type: 'warning',
      message: '请选择权重模型。'
    })
    return false
  } else if (!this.selectItemId) {
    this.$message({
      type: 'warning',
      message: '请选择一个具体的权重因素。'
    })
    return false
  } else {
    document.getElementById('file').click()
  }
}
export function inputFilter(newFile, oldFile, prevent) {
  if (!/\.(xlsx|xls)$/i.test(newFile.name)) {
    this.$message.error('只支持Excel格式的文件!')
    return prevent()
  }
  // const isLt10M = newFile.size / 1024 / 1024 < 10
  // if (!isLt10M) {
  //   this.$message.error('上传附件大小不能超过 10MB!')
  //   return prevent()
  // }
  this.$refs.upload.active = true
}
export function inputFile(newFile, oldFile) {
  this.$refs.upload.active = true
  if (newFile && newFile.progress) {
    this.onProgress()
  }
  if (newFile && (newFile.success || newFile.error)) {
    this.uploadSuccess(newFile.response)
  }
  if (newFile && newFile.error) {
    this.uploadError(newFile.response)
  }
}
