import { isNumber } from '@/utils/validate'
export function getAllRuleToTab() {
  this.fd.req({
    url: 'api/evaluations/' + this.params.schemaId + '/blocks',
    method: 'get',
    data: this.ruleParams
  }).then((d) => {
    const data = d.data || {}
    this.blocksData = data.data.length ? data.data[0] : {}
    this.total = data.total
    this.show1 = this.ruleParams.offset > 0
    this.show2 = this.ruleParams.offset < (this.total - this.ruleParams.limit)
  })
}
export function getAllRuleIds() {
  this.fd.req({
    url: 'api/evaluations/' + this.params.schemaId + '/blocks',
    method: 'get',
    data: this.ruleParams
  }).then((d) => {
    const data = d.data || {}
    this.blocksData = data.data.length ? data.data[0] : {}
    this.total = data.total
    this.show1 = this.ruleParams.offset > 0
    this.show2 = this.ruleParams.offset < (this.total - this.ruleParams.limit)
    this.id = this.blocksData.blockId
    this.params.schemaId = this.blocksData.schemaId
    this.params.schemaBlockType = this.blocksData.schemaBlockType
    this.isFill = this.blocksData.complete < this.blocksData.total
    // 点击上一个，下一个，需要重新从细则内容中获取
    this.getRuleDetailById()
  })
}
// 查看细则上一个
export function previousRule() {
  this.ruleParams.offset--
  this.getAllRuleIds()
}
// 查看细则下一个
export function nextRule() {
  this.ruleParams.offset++
  this.getAllRuleIds()
}
export function getRuleDetailById() {
  const options = {
    lock: true,
    text: '数据正在加载中',
    target: document.querySelector('#rule-report-table')
  }
  this.loading = this.$loading(options)
  this.fd.req({
    url: 'api/assessments/blocks/' + this.id,
    method: 'GET',
    data: this.params
  }).then((d) => {
    const data = d.data || {}
    this.refreshTableData(data)
  })
}
export function refreshTableData(data) {
  this.isShow = false
  if (!data) {
    return
  }
  this.detailRule = data.schemaBlock || {}
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
  this.indexTotal = data.menus.length
  this.targetType = this.fd.data.classify(data.menus, 'menuType')
  this.withDrawStaffs = data.withDrawStaffs || []
  this.withDrawIndexs = data.withDrawIndexs || []
  this.$nextTick(() => {
    this.tree = this.fd.data.changeToTree(data.menus, 'menuId', 'pid')
    this.isShow = true
  })
  this.loading.close()
}
// 校验填报分数值
export function checkFillScore(row, indexId) {
  const value = 'fillScore' + indexId
  if (!isNumber(row[value]) && row[value]) {
    row['red' + indexId] = true
    this.isRed = true
  } else if (parseFloat(row.indexVal['index' + indexId].valueMax) < parseFloat(row[value]) ||
    parseFloat(row.indexVal['index' + indexId].valueMin) > parseFloat(row[value])) {
    row['red' + indexId] = true
    this.isRed = true
  } else {
    row['red' + indexId] = false
    this.isRed = false
  }
}
export function getRed(isRed) {
  this.indexCount++
  this.redMap.push(isRed)
}
// 保存草稿
export function saveDraft() {
  this.typeName = 'save'
  this.indexCount = 0
  this.redMap = []
  this.redFlag = !this.redFlag
  this.$nextTick(() => {
    if (this.indexCount === this.indexTotal && this.redMap.includes(true)) {
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
      this.getTragetData(this.typeName, data)
    }
  })
}
// 保存提交
export function saveSubmit() {
  this.typeName = 'submit'
  this.indexCount = 0
  this.redMap = []
  this.redFlag = !this.redFlag
  this.$nextTick(() => {
    const isRed = (this.indexCount === this.indexTotal && this.redMap.includes(true))
    this.getUnfillIndexCnt(this.typeName, isRed)
  })
}
export function getUnfillIndexCnt(type, isRed) {
  if (isRed) {
    return
  }
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
      this.getTragetData(type, data)
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
      this.getTragetData(type, data)
    })
  }
}
export function getTragetData(type, data) {
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
    this.getRuleDetailById()
  }).catch((error) => {
    if (error.response.data.data) {
      this.visible = true
      const data = error.response.data.data
      this.errorMsg = data
    }
  })
}
// 点击填报按钮
export function fillTable() {
  this.obj.page = 'edit'
  this.edit = true
}
// 从细则进入的考核列表点击人名进入人员填报页面
export function seeCheckDetail(schema, row) {
  // 用于处理 按细则进入细则相关人员填报页面 如果该细则下面有待填报的记录 isFill为true，但点击了一条不能填报的人员记录，此刻需要记录
  // 这个细则的isFill，不然，会被当前人员不能填报影响，所以用originalFill来记录原先细则是否可以填报，如果细则不可以填报，则下面所有
  // 人员都不能填报
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
    index: row.index, staffId: row.staffId, blockId: schema.blockId,
    schemaBlockType: schema.schemaBlockType, schemaId: schema.schemaId }})
}
export function downloadTableDetail() {
  const data = {
    schemaId: this.params.schemaId,
    blockId: this.id,
    schemaBlockType: this.params.schemaBlockType,
    type: 'fill'
  }
  const url = 'api/assessments/blocks/' + this.id + '/export'
  this.fd.tools.download('', url, data)
}
export function inputTableDetail() {
  const html = document.getElementById('tableDetail').outerHTML
  this.fd.tools.downloadByHtml({ divContent: html, fileName: this.fileName, type: 'complex' }, 'api/html/download', 'post')
}
export function handleExceed(files, fileList) {
  this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
}
export function beforeAvatarUpload(file) {
  const isJPG = /\.xlsx$/.test(file.name) || /\.xls$/.test(file.name)
  // const isJPG = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isJPG) {
    this.$message.error('只支持Excel格式的文件!')
  }
  if (!isLt10M) {
    this.$message.error('上传附件大小不能超过 10MB!')
  }
  return isJPG && isLt10M
}
export function uploadSuccess(data) {
  this.loading.close()
  this.$message.success('导入成功!')
  this.refreshTableData(data.data)
}
// 批量撤回
export function revocationBatch() {
  this.revocationDialog = true
  this.resetForm = !this.resetForm
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
  this.getRuleDetailById()
}
