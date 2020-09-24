import { showArray } from '@/utils/filters'
export function getRoles() {
  this.loading = true
  this.fd.req({
    type: 'get',
    url: 'api/role-staff/roles'
  }).then(response => {
    const data = response.data
    this.roles = this.fd.data.changeToTree(data, 'id', 'parentId')
    const selected = this.roles[0]
    this.loading = false
    if (selected) {
      this.$nextTick(() => {
        if (this.$refs.roleTree) {
          this.$refs.roleTree.setCurrentKey(selected.id)
        }
        this.roleSelect(selected)
      })
    }
  }).catch(error => {
    console.log('getRoles', error)
  })
}
// 左侧角色选中
export function roleSelect(data) {
  this.roleId = data.id
  this.roleName = data.label
  this.manageForm.roleId = data.id
  this.offset = 0
  this.getPersons()
}
export function getPersons() {
  this.fd.req({
    type: 'get',
    url: 'api/role-staff',
    data: {
      offset: this.offset,
      limit: this.limit,
      roleId: this.roleId,
      keyword: this.keyword
    }
  }).then(response => {
    const data = response.data
    this.persons = data.data
    this.total = data.total
  }).catch(error => {
    console.log('getRoles', error)
  })
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

// 人员列表选中发生变化
export function selectionChange(data) {
  this.selectData = data
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
    this.$confirm('是否确认删除所选人员?', '提示', {
      type: 'warning'
    }).then(() => {
      this.fd.req({
        url: 'api/role-staff/' + this.getSelectIds(this.selectData),
        method: 'delete'
      }).then((d) => {
        this.refreshPersons()
        this.getRoles()
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

export function getRolePerson() {
  this.fd.req({
    type: 'get',
    url: 'api/role-staff/staffs',
    data: {
      roleId: this.roleId
    }
  }).then(response => {
    const data = response.data
    this.allPerson = data
  }).catch(error => {
    console.log('getPersons', error)
  })
}
// 获取分管院领导可选部门
export function getChargeDepart() {
  this.fd.req({
    type: 'get',
    url: 'api/role-staff/role/depart'
  }).then(response => {
    this.chargeDepart = response.data
  }).catch(error => {
    console.log('getPersons', error)
  })
}

export function addPerson() {
  if (this.hasActive) {
    this.$message({
      type: 'warning',
      message: '方案生效期间不支持任何操作。'
    })
    return
  }
  if (this.roleId) {
    this.getRolePerson()
    if (this.roleName === this.speRole) {
      this.addChargeDialog = true
      this.getChargeDepart()
      this.$nextTick(() => {
        this.personForm.name = ''
        this.departs = []
        this.resetForm('chargeForm')
      })
    } else {
      this.addPersonDialog = true
      this.$nextTick(() => {
        this.personForm.names = []
        this.resetForm('personForm')
      })
    }
  } else {
    this.$message({
      type: 'info',
      message: '请先选择一个基础角色'
    })
  }
}
// 分配管理
export function showManage(data) {
  if (this.hasActive) {
    this.$message({
      type: 'warning',
      message: '方案生效期间不支持任何操作。'
    })
    return
  }
  this.manageDialog = true
  this.getChargeDepart()
  this.departs = this.fd.data.getValuesByKey(data.departs, 'id')
  this.selfDeparts = this.fd.data.getValuesByKey(data.departs, 'id')
  this.manageForm.staffId = data.staffId
  this.manageForm.name = data.name
  this.manageForm.typeName = data.typeName
  this.manageForm.departName = data.departName
  this.manageForm.idCard = data.idCard
}
export function initTreeDepart() {
  this.$refs.departTree.setCheckedNodes(this.departs)
}
export function departNodeCheck() {
  const data = this.$refs.departTree.getCheckedNodes('id')
  this.departs = data
  this.departsName = showArray(data, 'name')
}
export function saveManageMsg() {
  this.fd.req({
    url: 'api/role-staff/leader',
    method: 'put',
    data: {
      staffId: this.manageForm.staffId,
      roleId: this.manageForm.roleId,
      comments: '',
      departId: this.departs.join()
    }
  }).then((d) => {
    this.manageDialog = false
    this.refreshPersons()
  })
}
export function saveAddPerson() {
  if (this.hasActive) {
    this.$message({
      type: 'warning',
      message: '方案生效期间不支持任何操作。'
    })
    return
  }
  const flag = this.roleName === this.speRole
  const key = flag ? 'chargeForm' : 'personForm'
  this.$refs[key].validate((valid) => {
    if (valid) {
      this.fd.req({
        type: 'post',
        url: 'api/role-staff',
        data: {
          staffId: flag ? this.personForm.name : this.personForm.names.join(),
          roleId: this.roleId,
          departId: flag ? this.departs.join() : ''
        }
      }).then(response => {
        this.addPersonDialog = false
        this.addChargeDialog = false
        this.getRoles()
        this.refreshPersons()
      }).catch(error => {
        console.log('saveChangeDepart', error)
      })
    } else {
      return false
    }
  })
}
