export function changeIndexModels() {
  if (this.indexModels === 'normal') {
    this.getAllTarget()
  } else if (this.indexModels === 'property') {
    this.getPropertyTarget()
  } else if (this.indexModels === 'special') {
    this.getSpecialPropertyTarget()
  }
}

export function getAllTarget(params) {
  const limit = this.indexModels === 'normal' ? this.normal.limit : this.indexModels === 'property' ? this.property.limit : this.specialProperty.limit
  const offset = this.indexModels === 'normal' ? this.normal.offset : this.indexModels === 'property' ? this.property.offset : this.specialProperty.offset
  const keywords = this.indexModels === 'normal' ? this.normal.keywords : this.indexModels === 'property' ? this.property.keywords : this.specialProperty.keywords
  this.tableLoading1 = true
  this.fd.req({
    type: 'get',
    url: 'api/remark-indexes',
    data: params || {
      indexModel: this.indexModels,
      offset: offset,
      limit: limit,
      keyword: keywords
    }
  }).then(response => {
    const data = response.data.data
    for (const item of data) {
      item.forbid = item.status === 'active'
      item.export = this.elements.export
      item.import = this.elements.import
      item.edit = this.elements.edit
      item.delete = this.elements.delete
    }
    data.forEach((item, index) => {
      item.index = index + 1
      item.forbid = item.status === 'active'
      item.export = this.elements.export
      item.import = this.elements.import
      item.edit = this.elements.edit
      item.delete = this.elements.delete
    })
    if (this.indexModels === 'normal') {
      this.targetOption.data = data
      this.normal.total = response.data.total
    } else if (this.indexModels === 'special') {
      this.targetSpecialPropertyOption.data = data
      this.specialProperty.total = response.data.total
    }

    this.tableLoading1 = false
  }).catch(error => {
    console.log('getWeightModel', error)
  })
}

export function getPropertyTarget(params) {
  this.tableLoading2 = true
  this.fd.req({
    type: 'get',
    url: 'api/remark-indexes',
    data: params || {
      indexModel: 'property',
      offset: this.property.offset,
      limit: this.property.limit,
      keyword: this.property.keywords
    }
  }).then(response => {
    const data = response.data.data
    for (const item of data) {
      item.forbid = item.status === 'active'
      item.export = this.elements.export
      item.import = this.elements.import
      item.edit = this.elements.edit
      item.delete = this.elements.delete
    }
    data.forEach((item, index) => {
      item.index = index + 1
      item.forbid = item.status === 'active'
      item.export = this.elements.export
      item.import = this.elements.import
      item.edit = this.elements.edit
      item.delete = this.elements.delete
    })
    this.targetPropertyOption.data = data
    this.property.total = response.data.total
    this.tableLoading2 = false
  }).catch(error => {
    console.log('getWeightModel', error)
  })
}

// 特殊属性标记
export function getSpecialPropertyTarget(params) {
  this.tableLoading3 = true
  this.fd.req({
    type: 'get',
    url: 'api/remark-indexes',
    data: params || {
      indexModel: 'special',
      offset: this.specialProperty.offset,
      limit: this.specialProperty.limit,
      keyword: this.specialProperty.keywords
    }
  }).then(response => {
    const data = response.data.data
    for (const item of data) {
      item.forbid = item.status === 'active'
      item.export = this.elements.export
      item.import = this.elements.import
      item.edit = this.elements.edit
      item.delete = this.elements.delete
    }
    data.forEach((item, index) => {
      item.index = index + 1
      item.forbid = item.status === 'active'
      item.export = this.elements.export
      item.import = this.elements.import
      item.edit = this.elements.edit
      item.delete = this.elements.delete
    })
    this.targetSpecialPropertyOption.data = data
    this.specialProperty.total = response.data.total
    this.tableLoading3 = false
  }).catch(error => {
    console.log('getWeightModel', error)
  })
}
// 搜索自定义指标
export function searchByKeyword(val) {
  if (this.indexModels === 'normal') {
    const params = {
      indexModel: 'normal',
      keyword: val,
      offset: this.normal.offset,
      limit: this.normal.limit
    }
    this.getAllTarget(params)
  } else if (this.indexModels === 'property') {
    const params = {
      indexModel: 'property',
      keyword: val,
      offset: this.property.offset,
      limit: this.property.limit
    }
    this.getPropertyTarget(params)
  } else if (this.indexModels === 'special') {
    this.specialProperty.offset = 0
    this.getSpecialPropertyTarget()
  }
}
// 新增自定义指标
export function addSelfTarget(indexModel = '2') {
  this.title = '新增标记指标'
  this.typeDialog = true
  if (indexModel === '4') {
    this.indexModel = [{
      id: '4',
      name: '人员'
    }]
  } else {
    this.indexModel = [{
      id: '2',
      name: '普通案件'
    }, {
      id: '1',
      name: '系列案件'
    }]
  }

  this.$nextTick(() => {
    this.$refs.detailForm.resetFields()
    this.formData.characterName = ''
    this.formData.name = ''
    this.formData.content = ''
    this.formData.indexModel = indexModel
    delete this.formData.id
  })
}
// 编辑自定义指标
export function editSelfTarget(row) {
  if (row.forbid) {
    return
  }
  this.title = '编辑标记指标'
  this.typeDialog = true
  if (row.indexModel === '4') {
    this.indexModel = [{
      id: '4',
      name: '人员'
    }]
  } else {
    this.indexModel = [{
      id: '2',
      name: '普通案件'
    }, {
      id: '1',
      name: '系列案件'
    }]
  }
  this.$nextTick(() => {
    this.$refs.detailForm.resetFields()
    this.formData.characterName = row.characterName
    this.formData.name = row.name
    this.formData.content = row.content
    this.formData.indexModel = row.indexModel
    this.formData.id = row.id
  })
}
// 删除自定义指标
export function deleteSelfTarget(data) {
  if (data.forbid) {
    return
  }
  if (data.delete) {
    this.$confirm('删除后该指标的设置内容将无法恢复, 请问确定删除《' + data.characterName + '》标记指标吗?', '删除标记指标', {
      type: 'warning'
    }).then(() => {
      this.fd.req({
        type: 'delete',
        url: 'api/remark-indexes/' + data.id
      }).then(response => {
        this.getAllTarget()
      }).catch(error => {
        console.log('deleteSelfTarget', error)
      })
    }).catch(() => {})
  }
}
// 导入
export function importSelfTarget(row) {
  console.log(row)
  // 文件上传
  this.actionPath = process.env.BASE_API + window.config.project_url + 'api/remark-indexes/' + row.id + '/import?Authorization=' +
    this.$store.getters.token
  document.getElementById('file').click()
}
// 导出
export function exportSelfTarget(row) {
  this.fd.tools.download('', 'api/remark-indexes/' + row.id + '/export')
}
export function inputFilter(newFile, oldFile, prevent) {
  this.$refs.upload.active = true
}
export function inputFile(newFile, oldFile) {
  this.$refs.upload.active = true
  if (newFile && newFile.progress) {
    this.onProgress()
  }
  if (newFile && newFile.success) {
    this.uploadSuccess()
  }
  if (newFile && newFile.error) {
    this.uploadError()
  }
}
// 导入人员信息成功
export function uploadSuccess(data) {
  this.loading.close()
  this.$message({
    type: 'success',
    message: '导入成功'
  })
}
// 导入人员信息成功
export function uploadError(data) {
  this.loading.close()
  this.$message({
    type: 'error',
    message: '导入失败'
  })
}
export function onProgress() {
  const options = {
    lock: true,
    text: '文件正在导入,请稍后......'
  }
  this.loading = this.$loading(options)
}
// 保存标记指标
export function saveSelfTarget() {
  this.$refs.detailForm.validate((valid) => {
    if (valid) {
      let type = 'post'
      if (this.formData.id) {
        type = 'put'
      }
      this.fd.req({
        url: 'api/remark-indexes',
        method: type,
        data: this.formData
      }).then((d) => {
        this.typeDialog = false
        if (this.indexModels === 'normal') {
          this.getAllTarget()
        } else if (this.indexModels === 'property') {
          this.getPropertyTarget()
        } else if (this.indexModels === 'special') {
          this.getSpecialPropertyTarget()
        }
      })
    }
  })
}
// 排序
export function sortList() {
  this.sortDialog = true
  const data = this.targetOption.data
  this.oldSorts = JSON.parse(JSON.stringify(data))
  this.sortData = JSON.parse(JSON.stringify(data))
}
// 拖动
export function dragend(data) {
  data.forEach((item, i) => {
    item.sort = i
  })
  this.newSorts = data
}
// 指标排序
export function saveSort() {
  const edit = []
  this.newSorts.forEach((item, i) => {
    if (item.id !== this.oldSorts[i].id) {
      edit.push({ id: item.id, sort: item.sort })
    }
  })
  this.fd.req({
    url: 'api/indexes/sort',
    method: 'put',
    data: edit
  }).then((d) => {
    this.getAllTarget()
    this.sortDialog = false
  })
}
export function currentChange(page) {
  if (this.indexModels === 'normal') {
    this.normal.offset = (page - 1) * this.normal.limit
    this.getAllTarget()
  } else if (this.indexModels === 'property') {
    this.property.offset = (page - 1) * this.property.limit
    this.getPropertyTarget()
  } else if (this.indexModels === 'special') {
    this.specialProperty.offset = (page - 1) * this.specialProperty.limit
    this.getSpecialPropertyTarget()
  }
}
export function sizeChange(limit) {
  if (this.indexModels === 'normal') {
    this.normal.offset = 0
    this.normal.limit = limit
    this.getAllTarget()
  } else if (this.indexModels === 'property') {
    this.property.offset = 0
    this.property.limit = limit
    this.getPropertyTarget()
  } else if (this.indexModels === 'special') {
    this.specialProperty.offset = 0
    this.specialProperty.limit = limit
    this.getSpecialPropertyTarget()
  }
}
