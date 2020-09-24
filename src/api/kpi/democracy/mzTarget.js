export function typeChange() {
  this.getTargetData(this.type)
}
export function addTarget() {
  this.targetFrom.id = ''
  this.targetFrom.name = ''
  this.targetFrom.targets = []
  this.editTargetTitle = '新增指标'
  this.editTargetDialog = true
  this.$nextTick(() => {
    this.resetForm('targetForm')
    this.targetFrom.id = ''
    this.targetFrom.name = ''
    this.targetFrom.remarks = ''
    this.targetFrom.flowId = ''
    this.targetFrom.collectionIds = []
    this.targetFrom.indexExpression = ''
    this.disabled_edit = false
  })
}
export function addTargets() {
  if (this.targetFrom.targets.length === 10) {
    this.$message({
      type: 'warning',
      message: '指标不超过10个！'
    })
    return
  }
  this.targetFrom.targets.push({
    id: '',
    name: '',
    indexExpression: '',
    flowId: '',
    collectionIds: []
  })
}
// 新建编辑指标保存
export function saveTarget() {
  this.$refs.targetForm.validate((valid) => {
    if (valid) {
      const type = this.targetFrom.id ? 'put' : 'post'
      this.fd.req({
        type: type,
        url: 'api/democratic-indexes',
        data: {
          id: this.targetFrom.id,
          collectionIds: this.targetFrom.collectionIds,
          name: this.targetFrom.name,
          remarks: this.targetFrom.remarks,
          indexExpression: this.targetFrom.indexExpression,
          flowId: this.targetFrom.flowId,
          keyword: this.type === 'depart' ? this.departParams.keyword : this.personParams.keyword,
          limit: this.type === 'depart' ? this.departParams.limit : this.personParams.limit,
          offset: this.type === 'depart' ? this.departParams.offset : this.personParams.offset,
          type: this.type
        }
      }).then((response) => {
        this.editTargetDialog = false
        this.getTargetData(this.type)
      }).catch(error => {
        console.log('saveTarget', error)
      })
    } else {
      return false
    }
  })
}
// 获取指标表格内容
export function getTargetData(type) {
  this.loading = true
  this.fd.req({
    type: 'get',
    url: 'api/democratic-indexes',
    data: {
      keyword: type === 'depart' ? this.departParams.keyword : this.personParams.keyword,
      limit: type === 'depart' ? this.departParams.limit : this.personParams.limit,
      offset: type === 'depart' ? this.departParams.offset : this.personParams.offset,
      paging: true,
      type: this.type
    }
  }).then(response => {
    const data = response.data
    let index = 0
    for (const item of data.data) {
      item.index = ++index
      // 判断显示编辑、删除按钮，isPublic === '1'是已公示状态
      if (item.isPublic === '1') {
        item.isedit = true
      } else {
        item.isedit = false
      }
    }
    this.targetData = data.data
    type === 'depart' ? this.departParams.total = data.total : this.personParams.total = data.total
    this.loading = false
  }).catch(error => {
    this.loading = false
    console.log('getTargetData', error)
  })
}
// 删除指标
export function deleteTarget(data) {
  this.$confirm('是否确定要删除该指标?', '刪除指标', {
    type: 'warning'
  }).then(() => {
    this.fd.req({
      url: 'api/democratic-indexes/' + data.id,
      method: 'delete'
    }).then((d) => {
      this.getTargetData(this.type)
      this.$message({
        type: 'success',
        message: '删除成功'
      })
    })
  }).catch(() => {})
}
// 编辑指标
export function editTarget(row) {
  this.targetFrom.id = ''
  this.targetFrom.name = ''
  this.targetFrom.remarks = ''
  this.targetFrom.flowId = ''
  this.targetFrom.collectionIds = []
  this.targetFrom.indexExpression = ''
  this.editTargetTitle = '编辑指标'
  this.editTargetDialog = true
  this.rowId = row.id
  this.$nextTick(() => {
    this.$refs['targetForm'].resetFields()
    console.log(row)
    this.targetFrom.id = row.id
    this.targetFrom.name = row.name
    this.targetFrom.remarks = row.remarks
    // 后台返回的空数据位null，放到select选择框会因为合适不正确报错，所以需判断后指定格式
    if (row.flowId) {
      this.targetFrom.flowId = row.flowId
    } else {
      this.targetFrom.flowId = ''
    }
    if (!row.collectionIds) {
      this.targetFrom.collectionIds = []
    } else {
      this.targetFrom.collectionIds = row.collectionIds
    }
    this.targetFrom.indexExpression = row.indexExpression
  })
}
export function copyTarget(item) {
  const row = this.fd.tools.merge(true, {}, item)
  this.$confirm('请问确定复制《' + row.name + '》指标吗?', '复制指标', {
    type: 'info'
  }).then(() => {
    this.fd.req({
      url: 'api/democratic-indexes/' + row.id + '/copy',
      method: 'POST'
    }).then((d) => {
      this.getTargetData(this.type)
      this.$message({
        type: 'success',
        message: '复制成功'
      })
    })
  })
}
export function seeTarget(row, column, cell, event) {
  // const row = this.fd.tools.merge(true, {}, this.dataMap[row1.id])
  this.editTargetDialog = true
  // 初始化为基础值的页签高亮
  this.editTargetTitle = '查看指标'
  this.$nextTick(() => {
    this.resetForm('targetForm')
    this.targetFrom.id = row.id
    this.targetFrom.name = row.name
    this.targetFrom.remarks = row.remarks
    this.targetFrom.flowId = row.flowId
    this.targetFrom.collectionIds = row.collectionIds
    this.targetFrom.indexExpression = row.indexExpression
  })
}

export function getCollectionData() {
  this.fd.req({
    type: 'get',
    url: 'api/collections',
    data: {
      type: this.type,
      paging: false
    }
  }).then(response => {
    const data = response.data
    this.collections = data
  }).catch(error => {
    console.log('getGearData', error)
  })
}

export function getPersonalFlows() {
  this.fd.req({
    url: 'api/democratic-flows',
    method: 'get',
    data: {
      type: 'personal',
      paging: false
    }
  }).then((d) => {
    this.personalFlows = d.data || []
  })
}

export function getDepartFlows() {
  this.fd.req({
    url: 'api/democratic-flows',
    method: 'get',
    data: {
      type: 'depart',
      paging: false
    }
  }).then((d) => {
    this.departFlows = d.data || []
  })
}
export function sizeChange(limit) {
  if (this.type === 'depart') {
    this.departParams.limit = limit
    this.departParams.offset = 0
  } else {
    this.personParams.limit = limit
    this.personParams.offset = 0
  }
  this.getTargetData(this.type)
}
export function currentChange(page) {
  if (this.type === 'depart') {
    this.departParams.offset = (page - 1) * this.departParams.limit
  } else {
    this.personParams.offset = (page - 1) * this.personParams.limit
  }
  this.getTargetData(this.type)
}
export function searchByKeyword(val) {
  if (this.type === 'depart') {
    this.departParams.keyword = val
    this.departParams.offset = 0
  } else {
    this.personParams.keyword = val
    this.personParams.offset = 0
  }
  this.getTargetData(this.type)
}
