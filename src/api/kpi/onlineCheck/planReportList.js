// 获取细则下拉框选项内容
export function getXzOptions(flag) {
  this.fd.req({
    url: 'api/evaluations/' + this.params.schemaId + '/blocks',
    method: 'get',
    data: this.ruleParams
  }).then((d) => {
    const data = d.data || {}
    this.blocksOptions = data.data || []
    this.filterBlockOptions = this.blocksOptions.filter((item) => {
      return item.schemaBlockType === this.params.schemaBlockType
    })
    if (flag !== true) {
      this.params.blockIds = []
      if (this.filterBlockOptions.length > 0) {
        this.params.blockIds.push(this.filterBlockOptions[0].blockId)
      }
    }
    // if (this.params.blockIds.length > 0) {
    //   const index = this.blocksOptions.findIndex(item => {
    //     return item.blockId === this.params.blockIds[0]
    //   })
    //   if (index > -1) {
    //     this.isFill = this.blocksOptions[index].complete < this.blocksOptions[index].total
    //     console.log('是否可填报###', this.isFill)
    //   }
    // }
    this.getPlanDetailById()
  })
}
// 获取按方案查询详情
export function getPlanDetailById() {
  const options = {
    lock: true,
    text: '数据正在加载中',
    target: document.querySelector('#rule-report-table')
  }
  this.loading = this.$loading(options)
  this.fd.req({
    url: 'api/assessments/schemas/' + this.params.schemaId,
    method: 'GET',
    data: {
      staffType: this.params.staffTypeIds,
      schemaBlockType: this.params.schemaBlockType,
      blockIds: this.params.blockIds.join(','),
      type: 'fill'
    }
  }).then((d) => {
    const data = d.data || {}
    this.loading.close()
    this.refreshTableData(data)
  })
}
export function refreshTableData(data) {
  if (!data) {
    return
  }
  for (const item of data.staffs) {
    const indexObj = {}
    let approveEditable = false
    let fillEditable = false
    for (const info of item.indexes) {
      if (info.fillScore === 0) {
        info.fillScore = info.fillScore + ''
      }
      if (info.draftScore === 0) {
        info.draftScore = info.draftScore + ''
      }
      indexObj['index' + info.indexId] = info || {}
      item['fillScore' + info.indexId] = info.fillScore || ''
      item['red' + info.indexId] = false
      if (info.approveScore === null) {
        info.approveScore = (info.fillScore || '') + ''
      }
      item['approveScore' + info.indexId] = info.approveScore + ''
      if (!fillEditable) {
        fillEditable = info.fillEditable
      }
      if (!approveEditable) {
        approveEditable = info.approveEditable
      }
    }
    item.indexVal = indexObj
    item.approveEditable = approveEditable
    item.fillEditable = fillEditable
  }
  this.tableData = data.staffs
  this.tree = this.fd.data.changeToTree(data.menus, 'menuId', 'pid')
  this.withDrawStaffs = data.withDrawStaffs || []
  this.withDrawIndexs = data.withDrawIndexs || []
  this.indexTotal = data.menus.length
  // 处理底部按钮显示问题
  this.dealBtnShow()
}

// 处理底部按钮显示问题
export function dealBtnShow() {
  // this.params.blockIds 细则id -- 数组
  // this.blocksOptions 每个细则下面填报的数据
  let total = 0
  let complete = 0
  if (this.params.blockIds.length > 0) {
    for (let i = 0; i < this.params.blockIds.length; i++) {
      const item = this.params.blockIds[i]
      const index = this.blocksOptions.findIndex(itemBlock => {
        return itemBlock.blockId === item
      })
      if (index > -1) {
        total = total + this.blocksOptions[index].total
        complete = complete + this.blocksOptions[index].complete
      }
    }
  } else {
    for (let i = 0; i < this.blocksOptions.length; i++) {
      total = total + this.blocksOptions[i].total
      complete = complete + this.blocksOptions[i].complete
    }
  }
  this.isFill = complete < total
  console.log('是否可填报', complete, total)
}
// 点击查询
export function clickBtn() {
  // this.getPlanDetailById()
  this.getXzOptions(true)
}

// 重置
export function resetBtn() {
  this.params.blockIds = []
  this.params.blockIds.push(this.blocksOptions[0].blockId)
  this.params.staffTypeIds = this.$store.getters.selects['k10003'][0].id
  this.params.schemaBlockType = this.schemaBlockTypeOpt[0].id
  // this.getPlanDetailById()
  this.getXzOptions()
}

// 批量撤回
export function revocationBatch() {
  this.revocationDialog = true
  this.resetForm = !this.resetForm
}

// 导出
export function downloadTableDetail() {
  const data = {
    schemaId: this.params.schemaId,
    blockIds: this.params.blockIds.join(','),
    schemaBlockType: this.params.schemaBlockType,
    staffType: this.params.staffTypeIds,
    type: 'fill'
  }
  const url = 'api/assessments/schemas/' + this.params.schemaId + '/export'
  this.fd.tools.download('', url, data)
}

// 保存草稿：前端校验：没有标红的字段才可提交
export function saveDraft() {
  this.typeName = 'save'
  this.refFlagCount = 0 // 记录红框的个数
  const tableData = JSON.parse(JSON.stringify(this.tableData))
  tableData.forEach(item => {
    for (const info of item.indexes) {
      if (item['red' + info.indexId]) {
        this.refFlagCount++
      }
    }
  })
  if (this.refFlagCount > 0) {
    return
  } else {
    const data = []
    for (const item of this.tableData) {
      for (const info of item.indexes) {
        // 用item['fillScore' + info.indexId]可以实时监听value值的变化，多层一直找，无法监听变化
        if (info.fillEditable) {
          data.push({
            schemaFlowId: info.schemaFlowId,
            nextNodeId: info.fillNodeId,
            staffId: info.staffId,
            staffName: info.staffName,
            indexId: info.indexId,
            indexName: info.indexName,
            indexSort: info.indexSort,
            attachmentOwnerId: info.attachmentOwnerId,
            uploadZero: info.uploadZero,
            uploadNonzero: info.uploadNonzero,
            fillNodeActionId: info.fillNodeActionId,
            score: item['fillScore' + info.indexId]
          })
        }
      }
    }
    this.getTargetData(this.typeName, data)
  }
}

export function getTargetData(type, data) {
  if (data.length === 0) {
    this.$message.error('暂无可提交的记录')
    return
  }
  const msg = type === 'submit' ? '提交成功' : '草稿保存成功'
  this.fd.req({
    url: 'api/evaluations/current-user/' + type + '?actionType=fill',
    method: 'put',
    data: data
  }).then((d) => {
    this.$message({
      type: 'success',
      message: msg
    })
    this.edit = false
    const obj = {
      isFill: true,
      resource: 'report'
    }
    if (type === 'submit') {
      // 提交成功后，原先存储在localstorage中的isFill是置成false的，表示这个表格不可以编辑（填报）
      obj.isFill = false
      this.isFill = false
    } else {
      // 保存草稿成功后，原先存储在localstorage中的isFill是置成true的，表示这个表格还可以编辑（填报）
      obj.isFill = true
      this.isFill = true
    }
    localStorage.setItem('obj', JSON.stringify(obj))
    // this.getPlanDetailById()
    this.getXzOptions(true)
  }).catch((error) => {
    if (error.response.data.data) {
      this.visible = true
      const data = error.response.data.data
      this.errorMsg = data
    }
  })
}

// 提交
export function saveSubmit() {
  this.typeName = 'submit'
  this.refFlagCount = 0 // 记录红框的个数
  const tableData = JSON.parse(JSON.stringify(this.tableData))
  tableData.forEach(item => {
    for (const info of item.indexes) {
      if (item['red' + info.indexId]) {
        this.refFlagCount++
      }
    }
  })
  if (this.refFlagCount > 0) {
    return
  } else {
    this.getUnfillIndexCnt(this.typeName)
  }
}

export function getUnfillIndexCnt(type) {
  let count = 0
  const data = []
  for (const item of this.tableData) {
    for (const info of item.indexes) {
      // 用item['fillScore' + info.indexId]可以实时监听value值的变化，多层一直找，无法监听变化
      const fillScore = (type === 'submit') ? (item['fillScore' + info.indexId] || info.valueMin) : item['fillScore' + info.indexId]
      if (info.fillEditable) {
        // this.fd.data.boolean((item['fillScore' + info.indexId]))为false，表示fillscore没有输入值，未完成的数量+1
        if (type === 'submit' && !this.fd.data.boolean((item['fillScore' + info.indexId]))) {
          count++
        }
        data.push({
          schemaFlowId: info.schemaFlowId,
          nextNodeId: info.fillNodeId,
          staffId: info.staffId,
          staffName: info.staffName,
          indexId: info.indexId,
          indexName: info.indexName,
          indexSort: info.indexSort,
          attachmentOwnerId: info.attachmentOwnerId,
          uploadZero: info.uploadZero,
          uploadNonzero: info.uploadNonzero,
          fillNodeActionId: info.fillNodeActionId,
          score: fillScore
        })
      }
    }
  }
  // 存在没有填报的指标，默认补充为最小值
  if (count) {
    this.$confirm('存在' + count + '个没有填报的指标值，系统将默认为指标的最小值，是否确认提交指标值?', '提交指标', {
      type: 'info',
      cancelButtonText: '取消',
      distinguishCancelAndClose: true
    }).then(() => {
      // 取反获取指标体系中最终所有的指标配置
      this.getTargetData(type, data)
    }).catch(action => {
      if (action === 'cancel') {
        // 取反获取指标体系中最终所有的指标配置
        // this.getTragetData(type, data)
      }
    })
    // 所有指标都已填报完毕，触发确认提交的提示语
  } else {
    this.$confirm('是否确定提交指标值?', '提交指标', {
      type: 'info'
    }).then(() => {
      // 取反获取指标体系中最终所有的指标配置
      this.getTargetData(type, data)
    })
  }
}
// 填报
export function fillTable() {
  this.obj.page = 'edit'
  this.edit = true
}
export function saveSuccess() {
  this.revocationDialog = false
  const obj = {
    isFill: true,
    resource: 'report'
  }
  this.isFill = true
  // 撤回成功后，原先存储在localstorage中的isFill是置成true的，表示这个表格还可以编辑（填报）
  localStorage.setItem('obj', JSON.stringify(obj))
  // this.getPlanDetailById()
  this.getXzOptions(true)
}

export function uploadSuccess(data) {
  this.loading.close()
  this.$message.success('导入成功!')
  this.refreshTableData(data.data)
}

export function seeCheckDetail(schema, row) {
  const originalFill = this.obj.isFill
  const obj = {
    isFill: row.fillEditable,
    type: 'people',
    checkType: 'report',
    page: this.obj.page,
    resource: 'other',
    from: 'rule' // 细则列表按人员点进去进入人员填报页面，再返回做这样一个标志用来区分originalFill
  }
  if (originalFill) {
    obj.originalFill = originalFill
  }
  localStorage.setItem('obj', JSON.stringify(obj))
  this.$router.push({ name: 'otherCheck-reportList', query: {
    index: row.index, staffId: row.staffId,
    blockId: this.params.blockIds.join(','), schemaBlockType: this.params.schemaBlockType,
    schemaId: this.params.schemaId }})
}
