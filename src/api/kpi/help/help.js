// 获取操作列表
export function getList() {
  this.$router.push({ query: { indexModels: this.indexModels }}) // 用于传值控制不同页面icon
  const indexModel = this.indexModels === 'manual' ? '1' : '2'
  const keywords = this.indexModels === 'manual' ? this.manual.keywords : this.video.keywords
  this.tableLoading1 = true
  this.fd.req({
    type: 'get',
    url: 'api/operationmanual',
    data: {
      serviceId: 'kpi',
      manualType: indexModel,
      keyword: keywords
    }
  }, 'basic_url').then(response => {
    const data = response.data
    const schemas = []
    for (const item of data) {
      schemas.push({
        ...item,
        showDetail: this.elements.showDetail && (this.indexModels === 'manual'), // 预览
        download: this.elements.download && true, // 下载
        edit: this.elements.edit && true, // 编辑
        delete: this.elements.delete && true // 删除
      })
    }
    this.schemas = schemas
  }).catch(error => {
    console.log('getList', error)
  })
}
// 预览
export function showOperationDetail(data) {
  this.fd.req({
    type: 'get',
    url: 'api/attachments/owners/' + data.id
  }, 'basic_url').then(response => {
    const data = response.data || []
    const files = []
    for (const item of data) {
      files.push({
        name: item.attachmentName,
        id: item.id
      })
    }
    let href = process.env.BASE_API
    href += ('/zuul' + window.config.basic_url + 'api/attachments/' + files[0].id + '/pdf')
    href += '?'
    href += 'Authorization=' + this.$store.getters.token
    window.open(href, '_blank')
  }).catch(error => {
    console.log(error)
  })
}
// 编辑
export function editOperation(data) {
  this.helpForm.id = ''
  this.operationId = ''
  this.helpForm.sort = ''
  this.helpForm.manualName = ''
  this.editHelpTitle = this.indexModels === 'manual' ? '编辑手册' : '编辑视频'
  this.editHelpDialog = true
  this.$nextTick(() => {
    this.helpForm.id = data.id
    this.operationId = data.id
    this.helpForm.sort = data.sort
    this.helpForm.manualName = data.manualName
    this.getAttById()
    this.isAdd = false
  })
}
// 新增
export function addHelp() {
  this.helpForm.id = ''
  this.operationId = ''
  this.helpForm.sort = ''
  this.helpForm.manualName = ''
  this.editHelpTitle = this.indexModels === 'manual' ? '新增手册' : '新增视频'
  this.editHelpDialog = true
  this.$nextTick(() => {
    this.helpForm.id = ''
    this.operationId = ''
    this.helpForm.sort = ''
    this.helpForm.manualName = ''
    this.fileList = []
    this.isAdd = true
    this.showBtnImg = true
    this.noneBtnImg = false
  })
}

// 确认新增\修改
export function saveHelp() {
  const data2 = this.fd.tools.merge(true, {}, this.helpForm, { id: this.operationId }, { serviceId: 'kpi' }, { manualType: this.indexModels === 'manual' ? '1' : '2' })
  if (this.fileList !== undefined && this.fileList !== null && (this.fileList.length <= 0 || this.fileList.length > 1)) {
    this.$message({
      type: 'error',
      message: '请选择一个文件！'
    })
    return
  }
  const file = this.fileList[0]
  if (this.indexModels === 'manual' && ((!/\.(pdf)$/i.test(file.name)) || (file.size !== undefined && file.size !== null && !(file.size / 1024 / 1024 < 10)))) {
    this.$message.error('只可上传PDF格式，最大不超过10M。')
    return
  }
  if (this.indexModels === 'video' && ((!/\.(mp4|avi|wmv)$/i.test(file.name)) || (file.size !== undefined && file.size !== null && !(file.size / 1024 / 1024 < 50)))) {
    this.$message.error('可上传MP4,AVI,WMV格式，视频最大不超过50M。')
    return
  }
  this.$refs['helpForm'].validate((valid) => {
    if (valid) {
      const type = this.operationId ? 'put' : 'post'
      this.fd.req({
        type: type,
        url: 'api/operationmanual',
        data: data2
      }, 'basic_url').then(response => {
        this.operationId = response.data.id
        this.$nextTick(() => {
          this.$refs.upload.submit()
          if (file.size !== undefined && file.size !== null && (file.size > 0)) {
            this.loading = this.$loading({
              lock: true,
              text: '正在上传中，请稍等...'
            })
          }
        })
        if (!this.isAdd) {
          this.editHelpDialog = false
          this.getList()
        }
      }).catch(error => {
        console.log(error)
      })
    } else {
      return false
    }
  })
}
// 取消新增弹框
export function cancelHelp() {
  // 验证修改状态下是否上传了文件，未上传文件不允许取消
  if (!this.isAdd) {
    this.fd.req({
      type: 'get',
      url: 'api/attachments/owners/' + this.operationId
    }, 'basic_url').then(response => {
      const data = response.data || []
      const files = []
      for (const item of data) {
        files.push({
          name: item.attachmentName,
          id: item.id
        })
      }
      this.fileList = files
      if (this.fileList !== undefined && this.fileList !== null && (this.fileList.length <= 0 || this.fileList.length > 1)) {
        this.showBtnImg = true
        this.noneBtnImg = false
        this.$message({
          type: 'error',
          message: '未上传文件无法取消！'
        })
        return
      } else {
        this.$refs['helpForm'].resetFields()
        this.editHelpDialog = false
        this.fileList = []
        this.showBtnImg = true
        this.noneBtnImg = false
      }
    }).catch(error => {
      console.log(error)
    })
  } else {
    this.$refs['helpForm'].resetFields()
    this.editHelpDialog = false
    this.fileList = []
    this.showBtnImg = true
    this.noneBtnImg = false
  }
}
// 选择文件
export function addAttach() {
  document.getElementById('file').click()
}
// 删除文件处理
export function handleRemove(file) {
  this.fd.req({
    url: 'api/attachments/' + file.id,
    method: 'delete'
  }, 'basic_url').then(() => {
    this.$refs.upload.clearFiles()
    this.fileList = []
    this.showBtnImg = true
    this.noneBtnImg = false
  })
}
// 获取详情附件
export function getAttById() {
  this.fd.req({
    type: 'get',
    url: 'api/attachments/owners/' + this.operationId
  }, 'basic_url').then(response => {
    const data = response.data || []
    const files = []
    for (const item of data) {
      files.push({
        name: item.attachmentName,
        id: item.id
      })
    }
    this.fileList = files
    this.noneBtnImg = this.fileList.length >= this.limitCountImg
  }).catch(error => {
    console.log(error)
  })
}
// 下载
export function downloadOperation(data) {
  let href = process.env.BASE_API
  href += ('/zuul' + window.config.basic_url + 'api/operationmanual/file/' + data.id)
  href += '?'
  href += 'Authorization=' + this.$store.getters.token
  location.href = encodeURI(href)
}
// 删除
export function deleteOperation(data) {
  if (data.delete) {
    this.$confirm('确定删除 ' + data.manualName + ' 吗?', '删除', {
      type: 'warning'
    }).then(() => {
      this.fd.req({
        type: 'delete',
        url: 'api/operationmanual/' + data.id
      }, 'basic_url').then(response => {
        this.getList()
      }).catch(error => {
        console.log('deleteOperation', error)
      })
    }).catch(() => {})
  }
}
// 文件变更处理
export function fileChange(file, fileList) {
  this.fileList = fileList
  this.noneBtnImg = fileList.length >= this.limitCountImg
}
