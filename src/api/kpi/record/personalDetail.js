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
// 导入信息成功
export function uploadError(data) {
  this.loading.close()
  this.$message({
    type: 'error',
    message: '导入失败'
  })
}
export function goAnchor(data) {
  const selector = data.id
  this.menu = selector
  const anchor = this.$refs[selector][0] || this.$refs[selector]
  data.dom.scrollTop = anchor.offsetTop
}
// 查看干部任免表
export function seeCadres() {
  this.cadres = true
  this.loading = true
  this.getLeaderPhoto()
  // const id = this.userId || this.staffId || this.userInfo.id
  // this.fd.req({
  //   url: 'api/staff/appointments/' + id,
  //   method: 'get'
  // }).then((d) => {
  //   const data = d.data || {}
  //   if (data.families.length < 7) {
  //     setFamilies()
  //   }
  //   function setFamilies() {
  //     data.families.push({
  //       id: '', relationship: '', name: '', age: '', politicalStatus: '', companyName: ''
  //     })
  //     if (data.families.length < 7) {
  //       setFamilies(data.families.length)
  //     }
  //   }
  //   this.cadreData = data
  // })
}
// 打印干部任免表
export function printCadres() {
  window.$('#cadre').printArea({ extraCss: 'static/print/cadre.css' })
}
// 下载干部任免表
export function downloadCadres() {
  const id = this.userId || this.staffId || this.userInfo.id
  this.fd.tools.download('', 'api/staff/appointments/' + id + '/export')
}
// 新增人员弹框部门树选中触发的事件
export function departNodeClick(data) {
  this.changeForm.departId = data.id
  this.changeForm.departName = data.name
  this.personDepartTree = false
}
export function changeStartLaw() {
  this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
    disabledDate: (time) => {
      const disabledDate = time.getTime() > new Date(this.lawForm.endDate).getTime()
      return disabledDate
    }
  })
}
export function changeEndLaw() {
  this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
    disabledDate: (time) => {
      const disabledDate = time.getTime() < new Date(this.lawForm.startDate).getTime()
      return disabledDate
    }
  })
}
export function changeStartDepart() {
  this.startDateDepartOpt = Object.assign({}, this.startDateDepartOpt, {
    disabledDate: (time) => {
      const disabledDate = time.getTime() > new Date(this.changeForm.endDate).getTime()
      return disabledDate
    }
  })
}
export function changeEndDepart() {
  this.endDateDepartOpt = Object.assign({}, this.endDateDepartOpt, {
    disabledDate: (time) => {
      const disabledDate = time.getTime() < new Date(this.changeForm.startDate).getTime()
      return disabledDate
    }
  })
}
export function changeStartPeo() {
  this.startDatePeopleOpt = Object.assign({}, this.startDatePeopleOpt, {
    disabledDate: (time) => {
      const disabledDate = time.getTime() > new Date(this.personForm.leaveDate).getTime()
      return disabledDate
    }
  })
}
export function changeEndPeo() {
  this.endDatePeopleOpt = Object.assign({}, this.endDatePeopleOpt, {
    disabledDate: (time) => {
      const disabledDate = time.getTime() < new Date(this.personForm.companyDate).getTime()
      return disabledDate
    }
  })
}
export function getUserPhoto() {
  const id = this.userId || this.staffId || this.userInfo.id
  this.fd.req({
    url: 'api/user/photo/data',
    method: 'get',
    data: {
      userId: id
    }
  }, 'uaa_url').then((d) => {
    const data = d.data || []
    this.photoUrl = data[0].userPhoto
  })
}
export function getLeaderPhoto() {
  this.leaderUrl = []
  const id = this.userId || this.staffId || this.userInfo.id
  this.fd.req({
    url: 'api/staff/appointments/' + id + '/preview/png',
    method: 'get'
  }).then((d) => {
    const data = d.data || []
    this.leaderUrl = data
    this.loading = false
  })
}
// 获取人员基本信息
export function getBasicInfo() {
  const id = this.userId || this.staffId || this.userInfo.id
  this.fd.req({
    url: 'api/staff/' + id,
    method: 'get'
  }).then((d) => {
    const data = d.data || {}
    this.userInfo = data
  })
}
// 保存人员基本信息
export function saveBasicInfo() {
  this.$refs.personForm.validate((valid) => {
    if (valid) {
      this.fd.req({
        type: 'put',
        url: 'api/staff',
        data: this.personForm
      }).then(response => {
        this.getBasicInfo()
        this.addPersonDialog = false
      }).catch(error => {
        console.log(error)
      })
    } else {
      return false
    }
  })
}
// 编辑人员基本信息
export function editBasicInfo() {
  this.addPersonDialog = true
  this.$nextTick(() => {
    this.resetForm('personForm')
    for (const key in this.userInfo) {
      this.$set(this.personForm, key, this.userInfo[key])
    }
    this.personCompanyTree = false
  })
}
// 取消人员信息的编辑
export function cancelBasicInfo() {
  this.addPersonDialog = false
}

// 获取法律职务列表
export function getLawDuty() {
  this.loading = true
  const params = {
    limit: 3,
    offset: this.lawOption.data.length,
    userId: this.userInfo.id,
    legalPositionId: this.userInfo.legalPositionId
  }
  this.fd.req({
    url: 'api/legel-position',
    method: 'get',
    data: params
  }).then((d) => {
    const data = d.data.data || []
    let index = params.offset
    for (const item of data) {
      if (index === 0 || !this.elements.edit) {
        item.isedit = false
        item.noedit = true
      } else {
        item.isedit = true
        item.noedit = false
      }
      item.index = ++index
      this.lawOption.data.push(item)
    }
    this.loading = false
    this.lawTotal = d.data.total
  })
}
// 新增法律职务
export function addLawDuty() {
  this.addPersonDutyDialog = true
  this.$nextTick(() => {
    this.resetForm('lawForm')
    this.lawForm = {
      startDate: '',
      endDate: '',
      legalPositionId: ''
    }
  })
}
// 编辑法律职务
export function editLawDuty(item) {
  this.addPersonDutyDialog = true
  this.$nextTick(() => {
    this.resetForm('lawForm')
    this.lawForm.id = item.id
    this.lawForm.startDate = item.startDate
    this.lawForm.endDate = item.endDate
    this.lawForm.legalPositionId = item.legalPositionId
  })
}
// 删除法律职务
export function deleteLawDuty(item) {
  this.$confirm('确认删除该条《法律职务》人员信息吗?', '删除', {
    type: 'warning'
  }).then(() => {
    this.fd.req({
      url: 'api/legel-position/' + item.id,
      method: 'delete'
    }).then((d) => {
      this.lawOption.data = []
      this.getLawDuty()
    })
  })
}
// 保存部门职务
export function saveLawDuty() {
  const params = this.fd.tools.merge(true, { staffId: this.userInfo.id }, this.lawForm)
  const type = params.id ? 'put' : 'POST'
  this.$refs.lawForm.validate((valid) => {
    if (valid) {
      this.fd.req({
        type: type,
        url: 'api/legel-position',
        data: params
      }).then(response => {
        this.lawOption.data = []
        this.getLawDuty()
        this.addPersonDutyDialog = false
      }).catch(error => {
        console.log('saveLawDuty', error)
      })
    } else {
      return false
    }
  })
}
// 导出部门职务
export function downloadLawDuty() {
  this.fd.tools.download('', 'api/legel-position/download', {
    userId: this.userInfo.id,
    userName: this.userInfo.name,
    legalPositionId: this.userInfo.legalPositionId,
    ...this.params
  })
}
// 获取部门变更
export function getDepart() {
  this.loading = true
  const params = {
    limit: 3,
    offset: this.changeOption.data.length,
    userId: this.userInfo.id,
    departId: this.userInfo.departId
  }
  this.fd.req({
    url: 'api/staff-depart',
    method: 'get',
    data: params
  }).then((d) => {
    const data = d.data.data || []
    let index = params.offset
    for (const item of data) {
      if (index === 0 || !this.elements.edit) {
        item.isedit = false
        item.noedit = true
      } else {
        item.isedit = true
        item.noedit = false
      }
      item.index = ++index
      this.changeOption.data.push(item)
    }
    this.loading = false
    this.changeTotal = d.data.total
  })
}
// 保存部门变更
export function saveDepart() {
  const params = this.fd.tools.merge(true, { staffId: this.userInfo.id }, this.changeForm)
  const type = params.id ? 'put' : 'POST'
  this.$refs.changeForm.validate((valid) => {
    if (valid) {
      this.fd.req({
        type: type,
        url: 'api/staff-depart',
        data: params
      }).then(response => {
        this.changeOption.data = []
        this.getDepart()
        this.addPersonDepartDialog = false
      }).catch(error => {
        console.log(error)
      })
    } else {
      return false
    }
  })
}
// 新增部门变更
export function addDepartChange() {
  if (this.hasActive) {
    this.$message({
      type: 'warning',
      message: '方案生效期间不支持任何操作。'
    })
    return
  }
  this.addPersonDepartDialog = true
  this.$nextTick(() => {
    this.resetForm('changeForm')
    this.changeForm = {
      startDate: '',
      endDate: '',
      departName: ''
    }
  })
}
// 编辑部门变更
export function editDepart(item) {
  if (this.hasActive) {
    this.$message({
      type: 'warning',
      message: '方案生效期间不支持任何操作。'
    })
    return
  }
  this.addPersonDepartDialog = true
  this.$nextTick(() => {
    this.resetForm('changeForm')
    this.changeForm.id = item.id
    this.changeForm.startDate = item.startDate
    this.changeForm.endDate = item.endDate
    this.changeForm.departId = item.departId
    this.changeForm.departName = item.departName
  })
}
// 删除部门变更
export function deleteDepart(item) {
  if (this.hasActive) {
    this.$message({
      type: 'warning',
      message: '方案生效期间不支持任何操作。'
    })
    return
  }
  this.$confirm('确认删除该条《部门变更》人员信息吗?', '删除', {
    type: 'warning'
  }).then(() => {
    this.fd.req({
      url: 'api/staff-depart/' + item.id,
      method: 'delete'
    }).then((d) => {
      this.changeOption.data = []
      this.getDepart()
    })
  })
}
// 导出部门变更
export function downloadDepartChange() {
  this.fd.tools.download('', 'api/staff-depart/download', {
    userId: this.userInfo.id,
    userName: this.userInfo.name,
    departId: this.userInfo.departId,
    ...this.params
  })
}
// 获取简历
export function getResume() {
  const params = {
    limit: 3,
    offset: this.resumeOption.data.length,
    staffId: this.userInfo.id
  }
  this.fd.req({
    url: 'api/staff/resumes',
    method: 'get',
    data: params
  }).then((d) => {
    const data = d.data.data || d.data || []
    let index = params.offset
    for (const item of data) {
      item.isEdit = this.elements.edit
      item.index = ++index
      this.resumeOption.data.push(item)
    }
    this.total = d.data.total || d.data.length || 0
  })
}
// 新增简历
export function addResume() {
  this.addResumeDialog = true
  this.$nextTick(() => {
    this.resetForm('resumeForm')
    this.formData = {
      startDate: '',
      endDate: '',
      departName: '',
      companyName: '',
      position: '',
      level: '',
      isAssume: '',
      witness: '',
      comments: ''
    }
  })
}
// 下载简历
export function downloadResume() {
  this.fd.tools.download('', 'api/staff/resume/export', {
    staffId: this.userInfo.id,
    staffName: this.userInfo.name
  })
}
// 编辑简历
export function editResume(item) {
  this.addResumeDialog = true
  this.$nextTick(() => {
    this.resetForm('resumeForm')
    for (const key in item) {
      this.$set(this.formData, key, item[key])
    }
  })
}
// 删除简历信息
export function deleteResume(item) {
  this.$confirm('确认删除该条《简历信息》人员信息吗?', '删除', {
    type: 'warning'
  }).then(() => {
    this.fd.req({
      url: 'api/staff/resume/' + item.id,
      method: 'delete'
    }).then((d) => {
      this.resumeOption.data = []
      this.getResume()
    })
  })
}
// 保存简历信息
export function saveResume() {
  const params = this.fd.tools.merge(true, { staffId: this.userInfo.id }, this.formData)
  const type = params.id ? 'put' : 'POST'
  this.$refs.resumeForm.validate((valid) => {
    if (valid) {
      this.fd.req({
        type: type,
        url: 'api/staff/resume',
        data: params
      }).then(response => {
        this.resumeOption.data = []
        this.getResume()
        this.addResumeDialog = false
      }).catch(error => {
        console.log('saveResume', error)
      })
    } else {
      return false
    }
  })
}
// 获取家庭信息
export function getFamily() {
  const params = {
    limit: 3,
    offset: this.familyOption.data.length,
    staffId: this.userInfo.id
  }
  this.fd.req({
    url: 'api/staff/familys',
    method: 'get',
    data: params
  }).then((d) => {
    const data = d.data.data || d.data || []
    let index = params.offset
    for (const item of data) {
      item.isEdit = this.elements.edit
      item.index = ++index
      this.familyOption.data.push(item)
    }
    this.total = d.data.total || d.data.length || 0
  })
}
// 新增家庭信息
export function addFamily() {
  this.addFamilyDialog = true
  this.$nextTick(() => {
    this.resetForm('familyForm')
    this.formData = {
      name: '',
      relationship: '',
      brithDate: '',
      politicalStatus: '',
      phone: '',
      postalCode: '',
      address: '',
      companyName: '',
      housingArea: '',
      isLate: ''
    }
  })
}
// 删除家庭信息
export function deleteFamily(item) {
  this.$confirm('确认删除该条《家庭信息》人员信息吗?', '删除', {
    type: 'warning'
  }).then(() => {
    this.fd.req({
      url: 'api/staff/family/' + item.id,
      method: 'delete'
    }).then((d) => {
      this.familyOption.data = []
      this.getFamily()
    })
  })
}
// 下载家庭信息
export function downloadFamily() {
  this.fd.tools.download('', 'api/staff/family/export', {
    staffId: this.userInfo.id,
    staffName: this.userInfo.name
  })
}
// 编辑家庭信息
export function editFamily(item) {
  this.addFamilyDialog = true
  this.$nextTick(() => {
    this.resetForm('familyForm')
    for (const key in item) {
      this.$set(this.formData, key, item[key])
    }
  })
}
// 保存家庭信息信息
export function saveFamily() {
  const params = this.fd.tools.merge(true, { staffId: this.userInfo.id }, this.formData)
  const type = params.id ? 'put' : 'POST'
  this.$refs.familyForm.validate((valid) => {
    if (valid) {
      this.fd.req({
        type: type,
        url: 'api/staff/family',
        data: params
      }).then(response => {
        this.familyOption.data = []
        this.getFamily()
        this.addFamilyDialog = false
      }).catch(error => {
        console.log('saveFamily', error)
      })
    } else {
      return false
    }
  })
}

// 获取学习经历
export function getEducation() {
  const params = {
    limit: 3,
    offset: this.educationOption.data.length,
    staffId: this.userInfo.id
  }
  this.fd.req({
    url: 'api/staff/degrees',
    method: 'get',
    data: params
  }).then((d) => {
    const data = d.data.data || d.data || []
    let index = params.offset
    for (const item of data) {
      item.isEdit = this.elements.edit
      item.index = ++index
      this.educationOption.data.push(item)
    }
    this.total = d.data.total || d.data.length || 0
  })
}
// 新增学习经历
export function addEducation() {
  this.addEducationDialog = true
  this.$nextTick(() => {
    this.resetForm('educationForm')
    this.formData = {
      degreeName: '',
      academicDegree: '',
      major: '',
      majorDetail: '',
      schoolName: '',
      educationType: '',
      schoolType: '',
      leaningType: '',
      entranceDate: '',
      graduationDate: '',
      schoolSystem: '',
      companyName: '',
      schoolCountry: '',
      preDegreeName: '',
      isInfo: ''
    }
  })
}
// 下载学习经历
export function downloadEducation() {
  this.fd.tools.download('', 'api/staff/degree/export', {
    staffId: this.userInfo.id,
    staffName: this.userInfo.name
  })
}
// 编辑学习经历
export function editEducation(item) {
  this.addEducationDialog = true
  this.$nextTick(() => {
    this.resetForm('educationForm')
    for (const key in item) {
      this.$set(this.formData, key, item[key])
    }
  })
}
// 删除学习经历
export function deleteEducation(item) {
  this.$confirm('确认删除该条《学习经历》人员信息吗?', '删除', {
    type: 'warning'
  }).then(() => {
    this.fd.req({
      url: 'api/staff/degree/' + item.id,
      method: 'delete'
    }).then((d) => {
      this.educationOption.data = []
      this.getEducation()
    })
  })
}
// 保存学习经历信息
export function saveEducation() {
  const params = this.fd.tools.merge(true, { staffId: this.userInfo.id }, this.formData)
  const type = params.id ? 'put' : 'POST'
  this.$refs.educationForm.validate((valid) => {
    if (valid) {
      this.fd.req({
        type: type,
        url: 'api/staff/degree',
        data: params
      }).then(response => {
        this.educationOption.data = []
        this.getEducation()
        this.addEducationDialog = false
      }).catch(error => {
        console.log('saveEducation', error)
      })
    } else {
      return false
    }
  })
}
// 其实日期变化
export function changeEndDate() {
  if (this.formData.startDate) {
    this.endDateOpt = Object.assign({}, this.endDateOpt, {
      disabledDate: (time) => {
        const disabledDate = time.getTime() < new Date(this.formData.startDate).getTime()
        return disabledDate
      }
    })
  }
}
// 结束日期变化
export function changeStartDate() {
  if (this.formData.endDate) {
    this.startDateOpt = Object.assign({}, this.startDateOpt, {
      disabledDate: (time) => {
        const disabledDate = time.getTime() > new Date(this.formData.endDate).getTime()
        return disabledDate
      }
    })
  }
}
// 导入前
export function beforeUpload(data) {
  // 文件上传
  window.$('.' + data + ' #file').click()
}
// 导入中
export function onProgress() {
  const options = {
    lock: true,
    text: '文件正在导入读取数据中,请稍后......'
  }
  this.loading = this.$loading(options)
}
