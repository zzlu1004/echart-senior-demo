// 获取部门信息已经人员数量
export function getDepartMembers() {
  this.fd.req({
    type: 'get',
    url: 'api/staff/staffDeparts'
  }).then(response => {
    const data = response.data
    this.members = this.fd.data.changeToTree(data, 'id', 'parentId')
  }).catch(error => {
    console.log('getDepartMenbers', error)
  })
}
// 人员列表选中发生变化
export function selectionChange(data) {
  this.selectData = data
}
// 调整部门设置弹框显示
export function changeDepart() {
  if (this.hasActive) {
    this.$message({
      type: 'warning',
      message: '方案生效期间不支持任何操作。'
    })
    return
  }
  if (this.selectData.length > 0) {
    this.changeDepartDialog = true
    this.$nextTick(() => {
      this.resetForm('departForm')
      this.departForm.departId = ''
      this.departForm.departName = ''
    })
  } else {
    this.$message({
      type: 'warning',
      message: '请选择需要调整部门的人员'
    })
  }
}
// 保存部门修改信息
export function saveChangeDepart() {
  if (this.hasActive) {
    this.$message({
      type: 'warning',
      message: '方案生效期间不支持任何操作。'
    })
    return
  }
  this.$refs.departForm.validate((valid) => {
    if (valid) {
      this.fd.req({
        type: 'put',
        url: 'api/staff/' + this.getSelectIds(this.selectData) + '/depart/' + this.departForm.departId,
        data: {
          ids: this.getSelectIds(this.selectData)
        }
      }).then(response => {
        this.changeDepartDialog = false
        this.getDepartMembers()
        this.refreshPersons()
      }).catch(error => {
        console.log('saveChangeDepart', error)
      })
    } else {
      return false
    }
  })
}
// 调解部门弹框部门树选中触发的事件
export function departNodeClick(data) {
  this.departForm.departId = data.id
  this.departForm.departName = data.name
  this.showDepartTree = false
}
// 新增人员弹框部门树选中触发的事件
export function personNodeClick(data) {
  if (this.elements.changeDepart) {
    this.personForm.departId = data.id
    this.personForm.departName = data.name
    this.personDepartTree = false
  }
}
// 新增人员弹框单位树选中触发的事件
export function companyNodeClick(data) {
  this.personForm.companyId = data.id
  this.personForm.companyName = data.label
  this.personCompanyTree = false
}
// 人员列表点击跳转到人员详情页面
export function rowClick(row, event, column) {
  if (column.label === '姓名') {
    this.fd.tools.goDetail.call(this, 'personalDetail', { query: { id: row.id }})
  }
}
export function showResult(result) {
  this.loading.close()
  this.checking = false
  if (result.verfiyFail) {
    this.fd.tools.goDetail.call(this, 'resultInfo', { query: { result: result }})
  } else {
    this.$message({
      type: 'success',
      message: '导入成功'
    })
    this.refreshPersons()
    this.getDepartMembers()
  }
}
// 左侧部门选中
export function departSelect(data) {
  this.departId = data.id
  this.refreshPersons()
}
export function searchByKeyword(val) {
  this.keyword = val
  this.offset = 0
  this.getPersons()
}

export function currentChange(page) {
  this.offset = (page - 1) * this.limit
  this.getPersons()
}

export function sizeChange(limit) {
  this.offset = 0
  this.limit = limit
  this.getPersons()
}
export function batchDeletePerson() {
  if (this.hasActive) {
    this.$message({
      type: 'warning',
      message: '方案生效期间不支持任何操作。'
    })
    return
  }
  if (this.selectData.length > 0) {
    this.$confirm('删除后该人员的设置内容将无法恢复，请问确认删除已选中的人员?', '删除人员', {
      type: 'warning'
    }).then(() => {
      this.fd.req({
        url: 'api/staff/' + this.getSelectIds(this.selectData),
        method: 'delete'
      }).then((d) => {
        this.refreshPersons()
        this.getDepartMembers()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      })
    }).catch(() => {})
  } else {
    this.$message({
      type: 'warning',
      message: '请选择需要删除的人员'
    })
  }
}
// 导出人员信息
export function downloadExcel() {
  if (this.persons.length > 0) {
    this.fd.tools.download('', 'api/staff/downloadExcel', {
      departId: this.departId,
      keyword: this.keyword
    })
  } else {
    this.$message({
      type: 'info',
      message: '没有可导出人员'
    })
  }
}
// 导出人员模板
export function downloadExcelTemplate() {
  this.fd.tools.download('', 'api/staff/downloadExcelTemplate')
}
// 导入人员信息成功
export function uploadSuccess(data) {
  this.showResult(data)
}
// 人员导入前
export function beforeUpload(data) {
  if (this.hasActive) {
    this.$message({
      type: 'warning',
      message: '方案生效期间不支持任何操作。'
    })
    return false
  } else {
    document.getElementById('file').click()
  }
}
export function addPerson() {
  if (this.hasActive) {
    this.$message({
      type: 'warning',
      message: '方案生效期间不支持任何操作。'
    })
    return
  }
  this.addPersonDialog = true
  this.$nextTick(() => {
    this.resetForm('personForm')
    this.personForm = {
      'name': '',
      'idCard': '',
      'companyId': '',
      'companyName': '',
      'departId': '',
      'departName': '',
      'typeId': '',
      'isAccess': '',
      'resourceId': '',
      'legalPositionId': '',
      'chairId': '',
      'levelId': '',
      judgeLevelId: '',
      'addressShort': '',
      'sexId': '',
      'nationId': '',
      'degreeId': '',
      'startWorkDate': '',
      'partyDate': '',
      'companyDate': '',
      'leaveDate': '',
      'comments': ''
    }
  })
}
export function savePersonMsg() {
  this.$refs.personForm.validate((valid) => {
    if (valid) {
      this.fd.req({
        type: 'post',
        url: 'api/staff',
        data: this.personForm
      }).then(response => {
        this.addPersonDialog = false
        this.refreshPersons()
        this.getDepartMembers()
      }).catch(error => {
        console.log('savePersonMsg', error)
      })
    } else {
      return false
    }
  })
}
export function onProgress() {
  this.checking = true
  const options = {
    lock: true,
    text: '文件正在导入读取数据中,请稍后......'
  }
  this.loading = this.$loading(options)
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
    this.uploadSuccess(newFile.response)
  }
}
