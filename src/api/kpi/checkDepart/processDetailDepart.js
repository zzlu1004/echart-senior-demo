export function getFlowById(id) {
  this.fd.req({
    type: 'get',
    url: 'api/dept/flow/' + id
  }).then(response => {
    const data = response.data || {}
    this.processForm.name = data.name || ''
    this.processForm.id = data.id || ''
    this.processForm.statusId = data.statusId || ''
    this.processForm.content = data.content || ''
    // 历史数据的null默认为单填报流程
    this.processForm.fillType = data.fillType || 'k10036-01'
    // 单填报流程公式表单为processForm,多填报流程为multiForm
    this[this.formulaMap[this.processForm.fillType]].fillFormula = data.fillFormula || ''
    this[this.formulaMap[this.processForm.fillType]].formula = data.formula || ''
    // 获取该流程下面的填报人，审核人节点
    this.fd.req({
      type: 'get',
      url: 'api/dept/flow/' + id + '/nodes'
    }).then(response => {
      const data = response.data || {}
      this[this.formMap[this.processForm.fillType]].reporters = data.reporters || []
      this.visible[data.reporters[0].id] = false
      this[this.formMap[this.processForm.fillType]].checkers = data.checkers
      for (const item of data.checkers) {
        this.visible[item.id] = false
      }
    }).catch(error => {
      console.log(error)
    })
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
  this.$router.push({ name: 'checkProcessDepart' })
}
export function sureOperate() {
  var handleData = () => {
    const type = (this.page === 'add') ? 'post' : 'put'
    // 当为多填报流程的时候，继承multiForm表单填报指标公式和审核指标公式，否则直接用processForm的formula
    if (this.processForm.fillType === 'k10036-02') {
      this.processForm = this.fd.tools.merge(true, {}, this.processForm, this.multiForm)
    }
    this.fd.req({
      type: type,
      url: 'api/dept/flow',
      data: this.fd.tools.merge(true, {}, this.processForm, this[this.formMap[this.processForm.fillType]])
    }).then(response => {
      this.$router.push({ name: 'checkProcessDepart' })
    }).catch(error => {
      console.log(error)
    })
  }
  this.$refs['processForm'].validate((valid) => {
    if (this[this.formMap[this.processForm.fillType]].reporters.length === 0) {
      this.$message({
        type: 'error',
        message: '请选择填报人'
      })
    } else {
      if (valid) {
        // 当为单填报流程的时候，校验processForm_2表单的指标分数设置
        if (this.processForm.fillType === 'k10036-01') {
          this.$refs['processForm_2'].validate((valid) => {
            if (valid) {
              handleData()
            } else {
              return false
            }
          })
        } else {
          // 当为多填报流程的时候，校验processForm_3表单的填报指标公式，processForm_4表单的审核指标公式
          this.$refs['processForm_3'].validate((valid) => {
            if (valid) {
              this.$refs['processForm_4'].validate((valid) => {
                if (valid) {
                  handleData()
                } else {
                  return false
                }
              })
            } else {
              return false
            }
          })
        }
      } else {
        return false
      }
    }
  })
}
export function showBtn(id, flag) {
  this.$set(this.visible, id, flag)
}
export function deleteFlowPeople(peopleType, index) {
  this[this.formMap[this.processForm.fillType]][peopleType].splice(index, 1)
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
  if (staffType === '4') {
    formData.roleName = roleName
    formData.roleId = roleId
  // 指定成员
  } else if (staffType === '3') {
    formData.staffId = staffId
    formData.staffName = this.personMap[staffId]
  // 指定团队
  } else if (staffType === '5') {
    formData.teamType = teamType
  }
  // 考核对象本人， 指定成员
  if (staffType === '1' || staffType === '3') {
    formData.approvalType = 'k10029-01'
  }
  // 校验是否选择了人员类型
  this.$refs.peopleForm.validate((valid) => {
    if (valid) {
      this.processVisible = false
      const flowNode = { flowId: this.flowId }
      flowNode.staffType = staffType
      if (this.modelTitle === '设置填报人') {
        // 填报人reporters流程提交，level固定为1
        flowNode.level = 1
        flowNode.nodeType = '填报人'
        const reporters = this.fd.tools.merge(true, {}, formData, flowNode)
        if (!(JSON.stringify(this.editItem) === '{}')) {
          // 编辑节点时只改变所有数组中当前位置的数据
          const editReporter = this.fd.tools.merge(true, {}, this.editItem, reporters)
          this[this.formMap[this.processForm.fillType]].reporters[this.editIndex] = editReporter
        } else {
          // 新增节点时往已有数组中添加一组新增的数据
          this[this.formMap[this.processForm.fillType]].reporters.push(reporters)
          // 填报人reporters流程提交，level为1，fillLevel累加
          this[this.formMap[this.processForm.fillType]].reporters.forEach((item, i) => {
            item.fillLevel = i + 1
          })
        }
      } else {
        flowNode.nodeType = '审批人'
        const checkers = this.fd.tools.merge(true, {}, formData, flowNode)
        if (!(JSON.stringify(this.editItem) === '{}')) {
          // 编辑节点时只改变所有数组中当前位置的数据
          const editChecker = this.fd.tools.merge(true, {}, this.editItem, checkers)
          this[this.formMap[this.processForm.fillType]].checkers[this.editIndex] = editChecker
        } else {
          // 新增节点时往已有数组中添加一组新增的数据
          this[this.formMap[this.processForm.fillType]].checkers.push(checkers)
          // 审核人checkers流程提交，level从2开始累加
          this[this.formMap[this.processForm.fillType]].checkers.forEach((item, i) => {
            item.level = i + 2
          })
        }
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

// 添加填报人
export function addInformant() {
  this.processVisible = true
  this.modelTitle = '设置填报人'
  this.modelType = '填报人类别'
  this.model = '填报'
  this.$nextTick(() => {
    this.clearForm()
  })
}
// 编辑填报人节点
export function editInformant(item, index) {
  if (this.page === 'detail') {
    return
  }
  this.editIndex = index
  this.processVisible = true
  this.modelTitle = '设置填报人'
  this.modelType = '填报人类别'
  this.model = '填报'
  this.$nextTick(() => {
    this.resetForm('peopleForm')
    this.editItem = item
    resetValue(this.peopleForm, item)
  })
}
function resetValue(target, obj) {
  for (const key in target) {
    target[key] = obj[key] || ''
  }
}
// 添加审核人
export function addAuditor() {
  this.processVisible = true
  this.modelTitle = '设置审核人'
  this.modelType = '审核人类别'
  this.model = '审核'
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
  this.modelTitle = '设置审核人'
  this.modelType = '审核人类别'
  this.model = '审核'
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
