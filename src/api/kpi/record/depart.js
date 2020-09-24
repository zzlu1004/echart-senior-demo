export function dragend(data) {
  data.forEach((item, i) => {
    item.sort = i
  })
  this.newSorts = data
}
export function addDepart() {
  if (this.hasActive) {
    this.$message({
      type: 'warning',
      message: '方案生效期间不支持任何操作。'
    })
    return
  }
  this.editDepartTitle = '新增部门'
  this.editDepartDialog = true
  this.$nextTick(() => {
    this.resetForm('departForm')
    this.departFrom.name = ''
    this.departFrom.id = ''
    this.departFrom.pid = this.treeDepart[0].id
    this.departFrom.parentName = this.treeDepart[0].name
    this.departFrom.headId = ''
    this.departFrom.staffIds = []
    this.departFrom.appointStaff = ''
    this.departFrom.departType = 'k10027-99'
    this.disabled_edit = false
  })
}
// 选择父级部门
export function handleNodeClick(data) {
  if (!this.disabled_edit && this.departFrom.id !== data.id) {
    this.departFrom.pid = data.id
    this.departFrom.parentName = data.name
    this.showDepartTree = false
  }
}
// 新建编辑部门保存
export function saveDepart() {
  if (this.hasActive) {
    this.$message({
      type: 'warning',
      message: '方案生效期间不支持任何操作。'
    })
    return
  }
  const departFrom = {
    departType: this.departFrom.departType,
    headId: this.departFrom.headId,
    appointStaff: this.departFrom.appointStaff,
    id: this.departFrom.id,
    name: this.departFrom.name,
    parentName: this.departFrom.parentName,
    pid: this.departFrom.pid
  }
  this.$refs.departForm.validate((valid) => {
    if (valid) {
      if (this.fd.data.getParentCount(this.departFrom.pid, this.dataMap) < 5) {
        const type = this.departFrom.id ? 'put' : 'post'
        this.fd.req({
          type: type,
          url: 'api/depart',
          data: { depart: departFrom, staffIds: this.departFrom.staffIds }
        }).then(response => {
          this.editDepartDialog = false
          this.getDepartData()
        }).catch(error => {
          console.log('saveDepart', error)
        })
      } else {
        this.$message({
          type: 'info',
          message: '部门层级最多只能有5级。'
        })
      }
    } else {
      return false
    }
  })
}
// 排序
export function sortChild(d) {
  if (this.hasActive) {
    this.$message({
      type: 'warning',
      message: '方案生效期间不支持任何操作。'
    })
    return
  }
  this.sortDepartDialog = true
  this.oldSorts = this.fd.tools.merge(true, {}, d.children)
  const data = this.fd.tools.merge(true, {}, d)
  this.$set(this.sortDepart, 'data', data.data)
  this.$set(this.sortDepart, 'children', data.children)
}
export function saveSort() {
  const edit = []
  this.newSorts.forEach((item, i) => {
    if (item.id !== this.oldSorts[i].id) {
      edit.push({ id: item.id, sort: item.sort })
    } else if (item.sort !== this.oldSorts[i].sort) {
      edit.push({ id: item.id, sort: item.sort })
    }
  })
  this.fd.req({
    url: 'api/depart/move',
    method: 'put',
    data: edit
  }).then((d) => {
    this.getDepartData()
    this.sortDepartDialog = false
  })
}
// 部门列表选中发生变化
export function selectChange(id, flag) {
  this.dataMap[id].isSelected = flag
}
// 删除部门
export function verifyDeleteDepart() {
  if (this.hasActive) {
    this.$message({
      type: 'warning',
      message: '方案生效期间不支持任何操作。'
    })
    return
  }
  let count = 0
  const deletes = []
  for (const key in this.dataMap) {
    if (this.dataMap[key].isSelected) {
      count++
      if (this.dataMap[key].total > 0) {
        this.$message({
          type: 'warning',
          message: '该部门当前有所属人员，暂不可进行删除操作。请在【人员管理】中清空部门人员。'
        })
        return false
      } else {
        deletes.push(key)
      }
    }
  }
  if (count === 0) {
    this.$message({
      type: 'info',
      message: '请选择需要删除的部门。'
    })
    return false
  }
  this.deleteDepart(deletes)
}
export function getDepartData() {
  this.loading = true
  this.fd.req({
    type: 'get',
    url: 'api/depart',
    data: {
      departId: this.departId
    }
  }).then(response => {
    const data = response.data
    this.departData = data
    this.loading = false
  }).catch(error => {
    console.log('getDepartData', error)
  })
}
// 删除部门
export function deleteDepart(data) {
  if (this.hasActive) {
    this.$message({
      type: 'warning',
      message: '方案生效期间不支持任何操作。'
    })
    return
  }
  this.$confirm('是否确定要删除该部门?', '刪除部门', {
    type: 'warning'
  }).then(() => {
    this.fd.req({
      url: 'api/depart/' + data.join(),
      method: 'delete'
    }).then((d) => {
      this.getDepartData()
      this.$message({
        type: 'success',
        message: '删除成功'
      })
    })
  }).catch(() => {})
}
// 编辑部门
export function editDepart(row) {
  if (this.hasActive) {
    this.$message({
      type: 'warning',
      message: '方案生效期间不支持任何操作。'
    })
    return
  }
  const data = this.dataMap[row.data.id]
  this.editDepartDialog = true
  this.editDepartTitle = '设置部门信息'
  this.disabled_edit = row.data.disabled_edit
  const staffIds = []
  data.leader.forEach((item, i) => {
    staffIds.push(item.staffId)
  })
  this.$nextTick(() => {
    this.resetForm('departForm')
    this.$set(this.departFrom, 'name', data.name)
    this.$set(this.departFrom, 'id', data.id)
    this.$set(this.departFrom, 'headId', data.headId)
    this.$set(this.departFrom, 'staffIds', staffIds)
    this.$set(this.departFrom, 'pid', data.pid)
    this.$set(this.departFrom, 'departType', data.departType)
    this.$set(this.departFrom, 'appointStaff', data.appointStaff)
    if (this.dataMap[data.pid]) {
      this.$set(this.departFrom, 'parentName', this.dataMap[data.pid].name)
    } else {
      this.$set(this.departFrom, 'parentName', '')
    }
  })
}
// 部门的所有sortId重新排序
export function refreshSort(data, original) {
  const allData = JSON.stringify({ data })
  const matchs = allData.match(/\"id\"\:\"s*[^,]+\"/g)
  const edit = []
  matchs.forEach((item, index) => {
    const id = item.replace('"id":"', '').replace('"', '')
    const sort = index + 1
    if (original[id].sort !== sort) {
      original[id].sort = sort
      edit.push({ id, sort })
    }
  })
  if (edit.length > 0) {
    this.fd.req({
      url: 'api/depart/move',
      method: 'put',
      data: edit
    }).then((d) => {
      // this.getDepartData()
    })
  }
}
