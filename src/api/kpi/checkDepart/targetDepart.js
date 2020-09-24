export function searchByKeyword(val) {
  this.params.indexName = val
  this.getTargetList(this.params.indexType)
}
export function addTargetType() {
  this.targetVsible = true
  this.modelTitle = '指标类别设置'
  this.$nextTick(() => {
    this.resetForm('targetTypeForm')
    this.targetTypeForm = {
      name: '',
      content: '',
      isLeaf: 0
    }
  })
}
export function orderTarget(d) {
  this.modelTitle = '指标排序'
  const data = this.fd.tools.merge(true, {}, d)
  if (!data.children) {
    this.$message({
      type: 'warning',
      message: '该类别下无指标可排序'
    })
    return
  }
  this.oldSorts = this.fd.tools.merge(true, {}, data.children)
  this.$set(this.sortTarget, 'data', data.data)
  this.$set(this.sortTarget, 'children', data.children)
  this.targetVsible = true
}
export function orderTargetType(d) {
  const data = this.fd.tools.merge(true, {}, d)
  this.targetVsible = true
  this.modelTitle = '指标类别排序'
  this.oldSorts = this.fd.tools.merge(true, {}, data.children)
  this.$set(this.sortTarget, 'data', data.data)
  this.$set(this.sortTarget, 'children', data.children)
}
export function addTarget(item) {
  this.modelTitle = '指标设置'
  const row = this.fd.tools.merge(true, {}, item.data)
  this.targetForm = {
    name: '',
    content: '',
    isLeaf: 1,
    pid: row.id,
    isPositive: '',
    valueMin: '',
    valueMax: '',
    flowIds: [],
    uploadZero: '',
    uploadNonzero: ''
  }
  // 新系统测算，指标设置和查看，跳转到新页面
  if (this.params.indexType === 'newSystem') {
    this.fd.tools.goDetail.call(this, 'indicatorSettingDepart', { query: this.targetForm })
  } else {
    this.targetVsible = true
    this.$nextTick(() => {
      this.targetForm = {
        name: '',
        content: '',
        isLeaf: 1,
        pid: row.id,
        isPositive: '',
        valueMin: '',
        valueMax: '',
        flowIds: [],
        uploadZero: '',
        uploadNonzero: ''
      }
      this.resetForm('targetForm')
    })
  }
}
export function seeTarget(row1, column, cell, event) {
  const row = this.fd.tools.merge(true, {}, this.dataMap[row1.id])
  if (column.property === 'name' && row.isLeaf) {
    this.modelTitle = '指标详情'
    this.targetForm = {
      modelTitle: '指标详情',
      id: row.id,
      name: row.name,
      content: row.content,
      isLeaf: row.isLeaf,
      pid: row.pid,
      indexType: row.indexType,
      isPositive: row.isPositive,
      valueMin: row.valueMin,
      valueMax: row.valueMax,
      flowIds: row.flowIds,
      uploadZero: row.uploadZero === '1' ? '是' : '否',
      uploadNonzero: row.uploadNonzero === '1' ? '是' : '否',
      indexLevel: row.indexLevel,
      isAccess: row.isAccess,
      dataDetail: row.dataDetail,
      indexScope: row.indexScope,
      indexExpression: row.indexExpression,
      departExpression: row.departExpression,
      departScope: row.departScope,
      departPersonalScope: row.departPersonalScope,
      // 新增业务线规则
      businessExpression: row.businessExpression,
      businessScope: row.businessScope,
      businessAvgNumeratorExpression: row.businessAvgNumeratorExpression,
      businessAvgNumeratorScope: row.businessAvgNumeratorScope,
      businessAvgDenominatorExpression: row.businessAvgDenominatorExpression,
      businessAvgDenominatorScope: row.businessAvgDenominatorScope,
      businessPersonalScope: row.businessPersonalScope,
      businessAvgPersonalScope: row.businessAvgPersonalScope,
      courtExpression: row.courtExpression,
      courtScope: row.courtScope,
      courtPersonalScope: row.courtPersonalScope,
      courtAvgNumeratorExpression: row.courtAvgNumeratorExpression,
      courtAvgNumeratorScope: row.courtAvgNumeratorScope,
      courtAvgDenominatorExpression: row.courtAvgDenominatorExpression,
      courtAvgDenominatorScope: row.courtAvgDenominatorScope,
      courtAvgPersonalScope: row.courtAvgPersonalScope
    }
    // 新系统测算，指标设置和查看，跳转到新页面
    if (this.params.indexType === 'newSystem') {
      this.fd.tools.goDetail.call(this, 'indicatorSettingDepart', { query: this.targetForm })
    } else {
      this.targetVsible = true
      this.$nextTick(() => {
        this.targetForm = {
          modelTitle: '指标详情',
          id: row.id,
          name: row.name,
          content: row.content,
          isLeaf: row.isLeaf,
          pid: row.pid,
          indexType: row.indexType,
          isPositive: row.isPositive,
          valueMin: row.valueMin,
          valueMax: row.valueMax,
          flowIds: row.flowIds,
          uploadZero: row.uploadZero === '1' ? '是' : '否',
          uploadNonzero: row.uploadNonzero === '1' ? '是' : '否',
          indexLevel: row.indexLevel,
          isAccess: row.isAccess,
          dataDetail: row.dataDetail,
          indexScope: row.indexScope,
          indexExpression: row.indexExpression,
          departExpression: row.departExpression,
          departScope: row.departScope,
          departPersonalScope: row.departPersonalScope,
          // 新增业务线规则
          businessExpression: row.businessExpression,
          businessScope: row.businessScope,
          businessAvgNumeratorExpression: row.businessAvgNumeratorExpression,
          businessAvgNumeratorScope: row.businessAvgNumeratorScope,
          businessAvgDenominatorExpression: row.businessAvgDenominatorExpression,
          businessAvgDenominatorScope: row.businessAvgDenominatorScope,
          businessPersonalScope: row.businessPersonalScope,
          businessAvgPersonalScope: row.businessAvgPersonalScope,
          courtExpression: row.courtExpression,
          courtScope: row.courtScope,
          courtPersonalScope: row.courtPersonalScope,
          courtAvgNumeratorExpression: row.courtAvgNumeratorExpression,
          courtAvgNumeratorScope: row.courtAvgNumeratorScope,
          courtAvgDenominatorExpression: row.courtAvgDenominatorExpression,
          courtAvgDenominatorScope: row.courtAvgDenominatorScope,
          courtAvgPersonalScope: row.courtAvgPersonalScope
        }
        this.resetForm('targetForm')
      })
    }
  }
}
export function editTarget(item) {
  const row = this.fd.tools.merge(true, {}, item.data)
  this.modelTitle = (row.isLeaf === 0) ? '指标类别设置' : '指标设置'
  if (row.isLeaf === 0) {
    this.targetVsible = true
    this.$nextTick(() => {
      this.resetForm('targetTypeForm')
      this.targetTypeForm = { id: row.id, name: row.name, content: row.content, isLeaf: row.isLeaf, indexType: row.indexType }
    })
  } else {
    this.targetForm = {
      modelTitle: '指标设置',
      id: row.id,
      name: row.name,
      content: row.content,
      isLeaf: row.isLeaf,
      pid: row.pid,
      indexType: row.indexType,
      isPositive: row.isPositive,
      valueMin: row.valueMin,
      valueMax: row.valueMax,
      flowIds: row.flowIds,
      uploadZero: row.uploadZero === '1' ? '是' : '否',
      uploadNonzero: row.uploadNonzero === '1' ? '是' : '否',
      indexLevel: row.indexLevel,
      isAccess: row.isAccess,
      dataDetail: row.dataDetail,
      indexScope: row.indexScope,
      indexExpression: row.indexExpression,
      departExpression: row.departExpression,
      departScope: row.departScope,
      departPersonalScope: row.departPersonalScope,
      // 新增业务线规则
      businessExpression: row.businessExpression,
      businessScope: row.businessScope,
      businessAvgNumeratorExpression: row.businessAvgNumeratorExpression,
      businessAvgNumeratorScope: row.businessAvgNumeratorScope,
      businessAvgDenominatorExpression: row.businessAvgDenominatorExpression,
      businessAvgDenominatorScope: row.businessAvgDenominatorScope,
      businessPersonalScope: row.businessPersonalScope,
      businessAvgPersonalScope: row.businessAvgPersonalScope,
      courtExpression: row.courtExpression,
      courtScope: row.courtScope,
      courtPersonalScope: row.courtPersonalScope,
      courtAvgNumeratorExpression: row.courtAvgNumeratorExpression,
      courtAvgNumeratorScope: row.courtAvgNumeratorScope,
      courtAvgDenominatorExpression: row.courtAvgDenominatorExpression,
      courtAvgDenominatorScope: row.courtAvgDenominatorScope,
      courtAvgPersonalScope: row.courtAvgPersonalScope
    }
    // 新系统测算，指标设置和查看，跳转到新页面
    if (this.params.indexType === 'newSystem') {
      this.fd.tools.goDetail.call(this, 'indicatorSettingDepart', { query: this.targetForm })
    } else {
      this.targetVsible = true
      this.$nextTick(() => {
        this.targetForm = {
          modelTitle: '指标设置',
          id: row.id,
          name: row.name,
          content: row.content,
          isLeaf: row.isLeaf,
          pid: row.pid,
          indexType: row.indexType,
          isPositive: row.isPositive,
          valueMin: row.valueMin,
          valueMax: row.valueMax,
          flowIds: row.flowIds,
          uploadZero: row.uploadZero === '1' ? '是' : '否',
          uploadNonzero: row.uploadNonzero === '1' ? '是' : '否',
          indexLevel: row.indexLevel,
          isAccess: row.isAccess,
          dataDetail: row.dataDetail,
          indexScope: row.indexScope,
          indexExpression: row.indexExpression,
          departExpression: row.departExpression,
          departScope: row.departScope,
          departPersonalScope: row.departPersonalScope,
          // 新增业务线规则
          businessExpression: row.businessExpression,
          businessScope: row.businessScope,
          businessAvgNumeratorExpression: row.businessAvgNumeratorExpression,
          businessAvgNumeratorScope: row.businessAvgNumeratorScope,
          businessAvgDenominatorExpression: row.businessAvgDenominatorExpression,
          businessAvgDenominatorScope: row.businessAvgDenominatorScope,
          businessPersonalScope: row.businessPersonalScope,
          businessAvgPersonalScope: row.businessAvgPersonalScope,
          courtExpression: row.courtExpression,
          courtScope: row.courtScope,
          courtPersonalScope: row.courtPersonalScope,
          courtAvgNumeratorExpression: row.courtAvgNumeratorExpression,
          courtAvgNumeratorScope: row.courtAvgNumeratorScope,
          courtAvgDenominatorExpression: row.courtAvgDenominatorExpression,
          courtAvgDenominatorScope: row.courtAvgDenominatorScope,
          courtAvgPersonalScope: row.courtAvgPersonalScope
        }
        this.resetForm('targetForm')
      })
    }
  }
}
export function copyTarget(item) {
  const row = this.fd.tools.merge(true, {}, item.data)
  this.$confirm('请问确定复制《' + row.name + '》指标吗?', '复制指标', {
    iconClass: 'xjss'
  }).then(() => {
    this.fd.req({
      url: 'api/dept/indexes/' + row.id + '/copy',
      method: 'POST'
    }).then((d) => {
      this.getTargetList(this.params.indexType)
      this.getTargetCount()
      this.$message({
        type: 'success',
        message: '复制成功'
      })
    })
  })
}
export function getTargetCount() {
  this.fd.req({
    url: 'api/dept/indexes/stats',
    method: 'get'
  }).then((d) => {
    const data = d.data || {}
    this.systemCnt = data.system
    this.reportCnt = data.report
    // this.markedCnt = data.marked
    this.newSystemCnt = data.newSystem
    this.democraticCnt = data.democratic
    this.newSystemAccessCnt = data.newSystemAccess
  })
}
export function getTargetList(type) {
  this.params.indexType = type
  this.params.indexName = this[this.valObj[type]]
  this[type + 'Loading'] = true
  this.fd.req({
    url: 'api/dept/indexes',
    method: 'get',
    data: this.params
  }).then((d) => {
    const data = d.data || []
    this.pOrderOpt = [] // 存在系统测算和综合填报 ，所以获取数据后先清空存储移动的对象
    for (const item of data) {
      item.isadd = (item.isLeaf === 0) && (item.status === 'inactive') && this.elements.add
      item.issort = (item.isLeaf === 0) && (item.status === 'inactive') && this.elements.sort
      item.isChild = !(item.isLeaf === 0) && this.elements.copy
      item.edit = this.elements.edit
      item.isedit = !(item.status === 'inactive')
      if (type === 'newSystem') {
        item.isdelete = item.deletable !== '0' && this.elements.delete
        item.edit = item.edit && !(item.id === 'b081' || item.id === 'b080')
        item.isedit = item.isedit || item.id === 'b081' || item.id === 'b080'
      } else {
        item.isdelete = this.elements.delete
      }
      if (item.pid === 'report' || item.pid === 'system' || item.pid === 'newSystem') {
        this.pOrderOpt.push(item)
      }
      item.flowIds = []
      for (const info of item.flows) {
        item.flowIds.push(info.flowId)
      }
    }
    this[type + 'TargetData'] = data
    this[type + 'Loading'] = false
  })
}
export function saveSort() {
  const edit = []
  this.newSorts.forEach((item, i) => {
    if (item.id !== this.oldSorts[i].id) {
      edit.push({ id: item.id, sort: item.sort })
    }
  })
  this.fd.req({
    url: 'api/dept/indexes/sort',
    method: 'put',
    data: edit
  }).then((d) => {
    this.getTargetList(this.params.indexType)
    this.targetVsible = false
  })
}
export function sureSave() {
  if (this.modelTitle === '指标类别排序' || this.modelTitle === '指标排序') {
    this.saveSort()
  } else {
    const form = (this.modelTitle === '指标类别设置') ? 'targetTypeForm' : 'targetForm'
    this.$refs[form].validate((valid) => {
      if (valid) {
        this.loading = true
        this.targetForm.uploadZero = this.targetForm.uploadZero === '是' ? '1' : '0'
        this.targetForm.uploadNonzero = this.targetForm.uploadNonzero === '是' ? '1' : '0'
        const data = (this.modelTitle === '指标类别设置') ? this.targetTypeForm : this.targetForm
        const type = data.id ? 'put' : 'post'
        if (this.modelTitle === '指标设置') {
          data.flows = []
          for (const info of data.flowIds) {
            data.flows.push({
              flowId: info
            })
          }
        }
        this.fd.req({
          url: 'api/dept/indexes',
          method: type,
          data: this.fd.tools.merge(true, { indexType: this.params.indexType }, data)
        }).then(() => {
          if (this.params.indexType === 'newSystem') {
            if (this.modelTitle === '指标类别设置') {
              this.targetVsible = false
              this.getTargetList(this.params.indexType)
              this.params.indexType = 'newSystem'
              this.getTargetCount()
            } else {
              this.getTargetList(this.params.indexType)
              this.params.indexType = 'newSystem'
              this.getTargetCount()
              this.goBack()
              this.loading = false
            }
          } else {
            this.targetVsible = false
            this.getTargetList(this.params.indexType)
            this.getTargetCount()
          }
        }).catch(error => {
          this.loading = false
          console.log(error)
        })
      } else {
        return false
      }
    })
  }
}
export function deleteTarget(item) {
  const row = this.fd.tools.merge(true, {}, item.data)
  const pRow = this.fd.tools.merge(true, {}, this.dataMap[row.pid])
  if (item.children && item.children.length > 0) {
    this.$message({
      type: 'warning',
      message: '该类别下有指标，不可删除'
    })
    return
  }
  const title = (row.isLeaf === 0) ? '删除指标类别' : '删除指标'
  const content = (row.isLeaf === 0) ? '删除后该指标类别的设置内容将无法恢复，请问确定删除《' + row.name + '》指标类别吗?' : '删除后该指标的设置内容将无法恢复，请问确定删除《' + pRow.name + '》指标类别下的《' + row.name + '》指标吗?'
  if (this.params.indexType === 'newSystem' && row.indexType === '4' && row.isLeaf === 1 && row.indexLevel === 'k10032-01') {
    for (const indexItem of this[this.params.indexType + 'TargetData']) {
      if (indexItem.isLeaf === 1 && indexItem.indexExpression && indexItem.indexExpression.indexOf('#{' + row.name + '}') > -1) {
        this.$alert('该指标被其他指标引用，不可删除！<br/>可搜索该指标名称，了解指标被引用情况', title, {
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(() => {
        })
        return
      }
    }
  }
  this.$confirm(content, title, {
    type: 'warning'
  }).then(() => {
    this.fd.req({
      url: 'api/dept/indexes/' + row.id,
      method: 'delete'
    }).then((d) => {
      this.getTargetList(this.params.indexType)
      this.getTargetCount()
    })
  })
}
export function getAllProcess() {
  this.fd.req({
    url: 'api/dept/flow',
    method: 'get',
    data: this.flowParam
  }).then((d) => {
    const data = d.data.data || []
    this.relate = data
  })
}

// 下载表格
export function downloadTable(type) {
  this.params.indexType = type
  this.params.indexName = this[this.valObj[type]]
  const url = 'api/dept/indexes/download'
  this.fd.tools.download('', url, this.params)
}
