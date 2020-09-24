export function getProjects() {
  this.fd.req({
    type: 'get',
    url: 'api/schemas',
    data: {
      offset: this.offset,
      limit: this.limit,
      schemaName: this.keywords
    }
  }).then(response => {
    const data = response.data
    const schemas = []
    for (const item of data.data) {
      schemas.push({
        ...item,
        effect: this.elements.effect && (item.statusId === 0 || item.statusId === null), // 生效
        inoperative: this.elements.cancel && (item.statusId === 1), // 取消生效
        end: this.elements.close && (item.statusId === 1), // 结束
        edit: this.elements.edit && (item.statusId === 0), // 编辑
        copy: this.elements.copy && (true), // 复制
        delete: this.elements.delete && (item.statusId === 0 || item.statusId === null), // 删除
        enable_edit: this.elements.edit,
        enable_delete: this.elements.delete,
        enable_copy: this.elements.copy
      })
    }
    this.schemas = schemas
    this.total = data.total
  }).catch(error => {
    console.log('getProjects', error)
  })
}
// 生效
export function activeSchemas(data) {
  this.fd.req({
    type: 'put',
    url: 'api/schemas/' + data.id + '/active'
  }).then(response => {
    this.loading.close()
    this.$message({
      type: 'success',
      message: '方案正在生效'
    })
    this.getProjects()
  }).catch(error => {
    this.loading.close()
    console.log('activeSchemas', error)
  })
}
export function checkSchemas(data) {
  this.$confirm('请问确定生效《' + data.name + '》方案设置吗?', '生效方案', {
    type: 'info'
  }).then(() => {
    this.loading = this.$loading({
      lock: true,
      text: '正在校验中，请稍等...',
      spinner: 'el-icon-loading'
    })
    this.fd.req({
      type: 'get',
      url: 'api/schemas/' + data.id + '/active/check',
      data: {
        schemaId: data.id
      }
    }).then(response => {
      const d = response.data
      let success = true
      for (const item of d) {
        if (item.success === false) {
          success = false
          break
        }
      }
      if (success) {
        // this.loading.text = '方案生效中，请稍等...'
        this.activeSchemas(data)
      } else {
        // 校验失败显示失败内容
        this.loading.close()
        this.errorMsg = this.fd.data.classify(d, 'series')
        this.projectCheckError = true
      }
    }).catch(error => {
      this.loading.close()
      console.log('checkSchemas', error)
    })
  }).catch(() => {})
}
// 取消生效
export function cancelSchemas(data) {
  if (data.refreshStatus === '1') {
    this.$message({
      type: 'warning',
      message: '该方案的明细报表数据正在更新中，不可以取消生效。'
    })
    return
  }
  this.$confirm('取消后该方案将暂停生效,中止绩效考评。请问确定取消《' + data.name + '》方案生效吗?', '取消方案', {
    type: 'warning'
  }).then(() => {
    this.fd.req({
      type: 'put',
      url: 'api/schemas/' + data.id + '/inactive'
    }).then(response => {
      this.getProjects()
    }).catch(error => {
      console.log('cancelSchemas', error)
    })
  }).catch(() => {})
}
// 结束
export function finishSchemas(data) {
  this.fd.req({
    type: 'put',
    url: 'api/schemas/' + data.id + '/finish'
  }).then(response => {
    this.loading.close()
    this.$message({
      type: 'success',
      message: response.message
    })
    setTimeout(() => {
      this.getProjects()
    }, 500)
  }).catch(error => {
    console.log('cancelSchemas', error)
  })
}
// 结束方案前的校验
export function checkFinish(data) {
  if (data.refreshStatus === '1') {
    this.$message({
      type: 'warning',
      message: '该方案的明细报表数据正在更新中，不可以结束。'
    })
    return
  }
  this.$confirm('请问确定结束《' + data.name + '》方案设置吗?', '结束方案', {
    type: 'info'
  }).then(() => {
    this.loading = this.$loading({
      lock: true,
      text: '正在校验中，请稍等...',
      spinner: 'el-icon-loading'
    })
    this.fd.req({
      type: 'get',
      url: 'api/schemas/' + data.id + '/finish/check',
      data: {
        schemaId: data.id
      }
    }).then(response => {
      const d = response.data
      let success = true
      for (const item of d) {
        if (item.success === false) {
          success = false
          break
        }
      }
      if (success) {
        // this.loading.text = '方案结束中，请稍等...'
        this.finishSchemas(data)
      } else {
        // 校验失败显示失败内容
        this.loading.close()
        this.errorMsg = this.fd.data.classify(d, 'series')
        this.finishCheckError = true
      }
    }).catch(error => {
      this.loading.close()
      console.log('checkSchemas', error)
    })
  }).catch(() => {})
}
// 复制
export function copySchemas(data) {
  this.$confirm('请问确定复制《' + data.name + '》方案设置吗?', '复制方案', {
    type: 'info'
  }).then(() => {
    this.fd.req({
      type: 'POST',
      url: 'api/schemas/' + data.id + '/copy'
    }).then(response => {
      this.getProjects()
    }).catch(error => {
      console.log('cancelSchemas', error)
    })
  }).catch(() => {})
}
// 删除
export function deleteSchemas(data) {
  if (data.delete) {
    this.$confirm('删除后该方案的设置内容将无法恢复, 请问确定删除《' + data.name + '》方案设置吗?', '删除方案', {
      type: 'warning'
    }).then(() => {
      this.fd.req({
        type: 'delete',
        url: 'api/schemas/' + data.id
      }).then(response => {
        this.getProjects()
      }).catch(error => {
        console.log('deleteSchemas', error)
      })
    }).catch(() => {})
  }
}
// 编辑
export function editSchemas(data) {
  if (data.edit) {
    this.fd.tools.goDetail.call(this, 'addProject', { query: { id: data.id }})
  }
}
// 新增
export function addSchemas() {
  this.fd.tools.goDetail.call(this, 'addProject')
}
// 关键词搜索
export function searchByKeyword(val) {
  this.keywords = val
  this.offset = 0
  this.getProjects()
}

// 刷新方案列表
export function refreshProjects() {
  this.offset = 0
  this.getProjects()
}

export function currentChange(page) {
  this.offset = (page - 1) * this.limit
  this.getProjects()
}

export function sizeChange(limit) {
  this.limit = limit
  this.refreshProjects()
}

export function getProjectDetail(id) {
  this.tableLoading = true
  this.fd.req({
    type: 'get',
    url: 'api/schemas/' + id
  }).then(response => {
    const data = response.data || {}
    this.projectForm.name = data.name
    this.projectForm.statusId = data.statusId
    // 方案结束的时候需要给schemaId赋值
    if (data.statusId === 2) {
      this.schemaId = id
    }
    if (this.projectForm.updateTime === '') {
      this.projectForm.updateTime = data.updateTime
    }
    this.projectForm.deadlineTime = data.deadlineTime
    this.projectForm.content = data.content
    this.projectForm.weightId = data.weightId
    this.projectForm.startTime = data.startTime
    this.projectForm.endTime = data.endTime
    const map = this.fd.data.classify(data.blocks, 'schemaBlockType')
    const blocks = []
    for (const item of this.blocksName) {
      blocks.push({ id: item.id, data: (map[item.id] || []) })
    }
    this.blocks = blocks
    this.tableLoading = false
  }).catch(error => {
    console.log('getProjects', error)
  })
}
// 新增细则
export function addRegulation(obj = {}, editIndex = -1) {
  this.projectDialog = true
  this.editIndex = editIndex
  // 新增细则当前编辑的细则下标改为-1
  this.resetForm('regulationForm')
  this.$nextTick(() => {
    this.regForm.blockId = obj.blockId || ''
    this.regForm.blockName = obj.blockName || ''
    this.regForm.id = obj.id || ''
    this.regForm.schemaBlockType = obj.schemaBlockType || ''
    if (obj.typeIds) {
      this.regForm.typeIds = obj.typeIds.split(',')
    } else {
      this.regForm.typeIds = []
    }
    if (obj.chairIds) {
      this.regForm.chairIds = obj.chairIds.split(',')
    } else {
      this.regForm.chairIds = []
    }
    if (obj.officeIds) {
      this.regForm.officeIds = obj.officeIds.split(',')
    } else {
      this.regForm.officeIds = this.officialPolice.map(item => (item.id))
    }
    if (obj.staffs) {
      this.regForm.staffs = this.fd.data.getValuesByKey(obj.staffs, 'staffId')
      this.exception = [...this.regForm.staffs]
    } else {
      this.regForm.staffs = []
      this.exception = []
    }
  })
}
export function editRegulation(data, scope) {
  this.addRegulation(data, scope.$index)
}
export function deleteRegulation(data) {
  this.$confirm('请问确定删除《' + this.regMap[data.blockId] ? this.regMap[data.blockId].name : data.blockName + '》细则设置吗?', '删除细则', {
    type: 'warning'
  }).then(() => {
    if (data.id) {
      this.fd.req({
        type: 'delete',
        url: 'api/schemas/blocks/' + data.id,
        data: data
      }).then(response => {
        const blocks = this.blocks
        for (const item of blocks) {
          if (item.id === this.blockId) {
            item.data.forEach((block, index) => {
              if (block.blockId === data.blockId) {
                item.data.splice(index, 1)
              }
            })
          }
        }
      }).catch(e => {
        console.log('saveRegAlone', e)
      })
    } else {
      const blocks = this.blocks
      for (const item of blocks) {
        if (item.id === this.blockId) {
          item.data.forEach((block, index) => {
            if (block.blockId === data.blockId) {
              item.data.splice(index, 1)
            }
          })
        }
      }
    }
  }).catch(() => {})
}
// 保存新增方案
export function saveProject() {
  const type = this.id ? 'put' : 'post'
  const form = this.projectForm
  const blocks = []
  for (const item of this.fd.data.getValuesByKey(this.blocks, 'data')) {
    blocks.push(...item)
  }
  form.blocks = blocks
  this.$refs.projectForm.validate((valid) => {
    if (valid) {
      const data = {
        name: form.name,
        content: form.content,
        startTime: form.startTime,
        endTime: form.endTime,
        statusId: 0,
        deadlineTime: form.deadlineTime,
        weightId: form.weightId,
        blocks: form.blocks
      }
      if (this.id) {
        data.id = this.id
      }
      this.fd.req({
        type: type,
        url: 'api/schemas',
        data: data
      }).then(response => {
        this.$message({
          type: 'success',
          message: response.message
        })
        this.goBack()
      }).catch(e => {
      })
    }
  })
}
// 保存新增细则
export function saveRegulation() {
  this.$refs.regulationForm.validate((valid) => {
    if (valid) {
      const blocks = this.blocks
      let obj = {}
      // 判断细则是否存在，存在的时候表示为编辑修改
      const item = blocks[this.blocksMap[this.blockId]]
      const form = this.regForm
      const selectStaffs = this.getStaff(form.staffs)
      obj = {
        blockId: form.blockId,
        blockName: form.blockName,
        typeIds: form.typeIds ? form.typeIds.join() : '',
        chairIds: form.chairIds ? form.chairIds.join() : '',
        officeIds: form.officeIds ? form.officeIds.join() : '',
        staffs: selectStaffs,
        schemaBlockType: this.blockId
      }
      if (form.id) {
        obj.id = form.id
      }
      if (this.editIndex > -1) {
        const block = item.data[this.editIndex]
        block.blockId = form.blockId
        block.blockName = form.blockName
        block.typeIds = form.typeIds ? form.typeIds.join() : ''
        block.chairIds = form.chairIds ? form.chairIds.join() : ''
        block.officeIds = form.officeIds ? form.officeIds.join() : ''
        block.staffs = selectStaffs
      } else {
        item.data.unshift(obj)
      }
      // 修改方案的时候细则单独保存 this.id 是方案的id
      if (this.id) {
        obj.schemaId = this.id
        this.saveRegAlone(obj)
      } else {
        this.projectDialog = false
      }
    } else {
      return false
    }
  })
}
export function saveRegAlone(data) {
  const type = data.id ? 'put' : 'post'
  this.fd.req({
    type: type,
    url: 'api/schemas/blocks',
    data: data
  }).then(response => {
    data.id = response.data.id
    this.projectDialog = false
  }).catch(e => {
    console.log('saveRegAlone', e)
  })
}
export function getStaff(ids) {
  const back = []
  for (const id of ids) {
    if (this.isSelectAble(this.staffMap[id])) {
      back.push({ staffId: id, departName: this.staffMap[id].departName })
    }
  }
  return back
}
// 汇总已选人员的信息
export function getSelectStaff(data) {
  data = data || []
  const depart = this.fd.data.classify(data, 'departName')
  const departs = []
  for (const key in depart) {
    departs.push({ name: key, staff: depart[key] })
  }
  return departs
}

// 获取所有细则
export function getRegulationList() {
  this.fd.req({
    type: 'get',
    url: 'api/blocks/list',
    data: {
      offset: 0,
      limit: 0,
      schemaId: this.id
    }
  }).then(response => {
    this.regulations = response.data
    this.reg = this.fd.data.arrayToObj(this.regulations, 'id')
    // this.$nextTick(() => {
    //   this.combineReg()
    //   // this.getAllStaff()
    // })
    this.fd.req({
      type: 'get',
      url: 'api/blocks/democratic/list',
      data: {
        offset: 0,
        limit: 0,
        schemaId: this.id,
        type: 'personal'
      }
    }).then(response => {
      this.regulationsMz = response.data
      this.regDe = this.fd.data.arrayToObj(this.regulationsMz, 'id')
      this.$nextTick(() => {
        this.combineReg()
        // this.getAllStaff()
      })
    }).catch(error => {
      console.log('getRegulationList', error)
    })
  }).catch(error => {
    console.log('getRegulationList', error)
  })
}
export function combineReg() {
  this.regMap = Object.assign(this.reg, this.regDe)
  this.getAllStaff()
}
// 全选人员
export function selectStaff(data) {
  const name = data.name
  let staffs = []
  for (const item of this.staffDeparts) {
    if (item.name === name) {
      staffs = item.staff
      break
    }
  }
  for (const item of staffs) {
    if (this.regForm.staffs.indexOf(item.id) < 0 && this.isSelectAble(item)) {
      this.regForm.staffs.push(item.id)
    }
  }
}
// 取消全选人员
export function unselectStaff(data) {
  const name = data.name
  let staffs = []
  // 获取需要被全部取消选中的人员
  for (const item of this.staffDeparts) {
    if (item.name === name) {
      staffs = item.staff
      break
    }
  }
  for (const item of staffs) {
    const index = this.regForm.staffs.indexOf(item.id)
    if (index > -1 && this.isSelectAble(item)) {
      this.regForm.staffs.splice(index, 1)
    }
  }
}
export function getStaffCount(index) {
  const data = index ? this.staffDeparts[index] : this.regForm.staffs
  let count = 0
  for (const item of data) {
    if (this.isSelectAble(this.staffMap[item])) {
      count++
    }
  }
  return count
}
export function getAllStaff(val) {
  this.staffName = val
  this.fd.req({
    type: 'get',
    url: 'api/staff/schemas',
    data: {
      keyword: this.staffName,
      schemaId: this.id
    }
  }).then(response => {
    const data = response.data
    if (!this.staffName) {
      this.staffMap = this.fd.data.arrayToObj(data, 'id')
    }
    const depart = this.fd.data.classify(data, 'departName')
    const departs = []
    for (const key in depart) {
      departs.push({ name: key, staff: depart[key] })
    }
    this.staffDeparts = departs
    if (this.id) {
      this.getProjectDetail(this.id)
      this.projectTitle = '编辑细则'
    }
  }).catch(error => {
    console.log('getAllStaff', error)
  })
}
// 判断员工是否可以备选
export function isSelectAble(staff) {
  // 考核对象选中，部门正副职相同，同一个细则类型下没有被选中
  // return (staff && (this.regForm.typeIds.indexOf(staff.typeId) > -1) && (this.regForm.chairIds.indexOf((staff.chairId || 'other')) > -1) && this.showStaff(staff))
  const isAble = staff && (this.regForm.typeIds.indexOf(staff.typeId) > -1) && (this.regForm.chairIds.indexOf((staff.chairId || 'other')) > -1) && this.showStaff(staff)
  const isAbleByofficialPolice = staff.officialPolice ? this.regForm.officeIds.indexOf(staff.officialPolice) > -1 : true

  return isAble && isAbleByofficialPolice
}
// 同一个细则类型下用户只能被一个细则选中
export function showStaff(staff) {
  let flag = true
  const blocks = this.blocks
  const item = blocks[this.blocksMap[this.blockId]]
  const staffs = this.fd.data.getValuesByKey(item.data, 'staffs')
  const selects = []
  for (const items of staffs) {
    selects.push(...items)
  }
  const selectIds = this.fd.data.getValuesByKey(selects, 'staffId')
  // 已选中的，但不在列外内的（列外：当前细则已经被选中的，需要暂存，被选中情况会随着页面操作发生变化）
  if (selectIds && selectIds.indexOf(staff.id) > -1 && this.exception.indexOf(staff.id) < 0) {
    flag = false
  }
  return flag
}
export function showRegulation(regs) {
  const blocks = this.blocks
  const back = []
  const item = blocks[this.blocksMap[this.blockId]]
  if (item) {
    const ids = this.fd.data.getValuesByKey(item.data, 'blockId')
    for (const li of regs) {
      // 没有被选中，或者当前被编辑的细则都可以选择
      if (ids.indexOf(li.id) < 0 || this.regForm.blockId === li.id) {
        back.push(li)
      }
    }
  }
  return back
}
// 跳到细则详情页面
export function goRegulationDetail(row) {
  // this.fd.tools.goDetail.call(this, 'regulationDetail', { query: query })
  // k10015-04新民主测评，跳转到民主测评考核细则下
  if (row.schemaBlockType === 'k10015-04') {
    const query = { id: row.blockId, schemaId: this.schemaId, type: 'person' }
    this.$router.push({ name: 'mzRegulations-mzRegulationDetail', query: query })
  } else {
    const query = { id: row.blockId, schemaId: this.schemaId }
    this.$router.push({ name: 'regulations-regulationDetail', query: query })
  }
}
// 查看方案详情
export function showSchemaDetail(data) {
  this.fd.tools.goDetail.call(this, 'projectDetail', { query: { id: data.id }})
}
export function editProject() {
  this.fd.tools.goDetail.call(this, 'addProject', { query: { id: this.id }})
}
// 获取权重系数
export function getCoefficientList() {
  this.fd.req({
    type: 'get',
    url: 'api/weight/active',
    data: {
      limit: 0,
      offset: 0,
      keyword: '',
      schemaId: this.id
    }
  }).then(response => {
    const data = response.data
    this.weight = data
    this.weightMap = this.fd.data.arrayToObj(data, 'id')
  }).catch(error => {
    console.log('getList', error)
  })
}

