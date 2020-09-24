export function getFlowById(id) {
  this.fd.req({
    type: 'get',
    url: 'api/democratic-flows/' + id
  }).then(response => {
    const data = response.data || {}
    this.processForm.name = data.name || ''
    this.processForm.id = data.id || ''
    this.processForm.statusId = data.statusId || ''
    this.processForm.remarks = data.remarks || ''
    this.setForm.nodes = data.nodes || []
  }).catch(error => {
    console.log(error)
  })
}
export function showApproveDes() {
  this.approveShow = true
  this.fillShow = false
}
export function showFillDes() {
  this.approveShow = false
  this.fillShow = true
}
export function cancelOperate() {
  this.goBack()
}
export function sureOperate() {
  var handleData = () => {
    const type = (this.page === 'add') ? 'post' : 'put'
    this.fd.req({
      type: type,
      url: 'api/democratic-flows',
      data: this.fd.tools.merge(true, {}, this.processForm, this.setForm)
    }).then(response => {
      this.goBack()
    }).catch(error => {
      console.log(error)
    })
  }
  this.$refs['processForm'].validate((valid) => {
    if (this.processForm.name === '') {
      return
    }
    if (this.setForm.nodes.length === 0) {
      this.$message({
        type: 'error',
        message: '请输入测评人流程'
      })
      return
    }
    if (valid) {
      handleData()
    } else {
      console.log('error submit!!')
    }
  })
}
export function showBtn(id, flag) {
  this.$set(this.visible, id, flag)
}
export function deleteFlowPeople(peopleType, index) {
  this.setForm[peopleType].splice(index, 1)
}
export function sureSave() {
  const {
    staffType,
    roleName,
    roleId,
    staffId,
    higherLevel,
    approvalType,
    teamType
  } = this.peopleForm
  const formData = { higherLevel, approvalType }
  // 填报人类别不同，传参不同
  // 指定角色
  if (staffType === 'k10018-04') {
    formData.roleName = roleName
    formData.roleId = roleId
  // 指定成员
  } else if (staffType === 'k10018-03') {
    formData.staffId = staffId
    formData.staffName = this.personMap[staffId]
  // 指定团队
  } else if (staffType === 'k10018-05') {
    formData.teamType = teamType
  }
  // 考核对象本人， 指定成员
  if (staffType === 'k10018-01' || staffType === 'k10018-03') {
    formData.approvalType = 'k10029-01'
  }
  // 校验是否选择了人员类型
  this.$refs.peopleForm.validate((valid) => {
    if (valid) {
      this.processVisible = false
      const flowNode = { flowId: this.flowId }
      flowNode.staffType = staffType
      const nodes = this.fd.tools.merge(true, {}, formData, flowNode)
      if (!(JSON.stringify(this.editItem) === '{}')) {
        // 编辑节点时只改变所有数组中当前位置的数据
        const editChecker = this.fd.tools.merge(true, {}, this.editItem, nodes)
        this.setForm.nodes[this.editIndex] = editChecker
      } else {
        // 新增节点时往已有数组中添加一组新增的数据
        this.setForm.nodes.push(nodes)
        // nodes流程提交，level从1开始累加
        this.setForm.nodes.forEach((item, i) => {
          item.level = i + 1
        })
      }
    } else {
      return false
    }
  })
}
// 清空填报人审批人表单
export function clearForm() {
  this.resetForm('peopleForm')
  this.editItem = {}
  this.peopleForm = {
    staffType: '',
    roleName: '',
    roleId: '',
    staffId: '',
    higherLevel: 'k10028-01',
    approvalType: 'k10029-01',
    teamType: 'k10031-01'
  }
}
function resetValue(target, obj) {
  for (const key in target) {
    target[key] = obj[key] || ''
  }
}
// 添加审核人
export function addAuditor() {
  this.processVisible = true
  this.$nextTick(() => {
    this.clearForm()
  })
}
// 编辑审核人节点数据
export function editAuditor(item, index) {
  if (this.page === 'detail') {
    return
  }
  this.editIndex = index
  this.processVisible = true
  this.$nextTick(() => {
    this.resetForm('peopleForm')
    this.editItem = item
    resetValue(this.peopleForm, item)
  })
}
// 指定成员选中
export function departSelect(data) {
  this.peopleForm.staffId = data.id
  this.peopleForm.staffName = data.label
  this.personCompanyTree = false
}
export function roleSelect(data) {
  this.peopleForm.roleId = data.id
  this.peopleForm.roleName = data.label
  this.personCompanyTree = false
}
export function getAllPerson() {
  this.fd.req({
    type: 'get',
    url: 'api/staff',
    data: {
      offset: 0,
      limit: 0,
      departId: '',
      keyword: ''
    }
  }).then(response => {
    const data = response.data
    this.allPerson = data.data
    for (const item of data.data) {
      this.personMap[item.id] = item.name
    }
  }).catch(error => {
    console.log('getAllPerson', error)
  })
}
export function getRoles() {
  this.loading = true
  this.fd.req({
    type: 'get',
    url: 'api/role-staff/roles'
  }).then(response => {
    const resData = response.data
    const data = []
    for (const item of resData) {
      if (item.id !== '8') { // 部门考核，民主测评 选择角色时不需要部门正式干警
        data.push(item)
      }
    }
    this.roles = this.fd.data.changeToTree(data, 'id', 'parentId')
    const selected = this.roles[0]
    this.loading = false
    console.log()
    if (selected) {
      this.$nextTick(() => {
        if (this.$refs.roleTree) {
          this.$refs.roleTree.setCurrentKey(selected.id)
        }
      })
    }
  }).catch(error => {
    console.log('getRoles', error)
  })
}
