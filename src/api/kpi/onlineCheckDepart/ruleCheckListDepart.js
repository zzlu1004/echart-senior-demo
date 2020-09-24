import { isNumber } from '@/utils/validate'
export function getAllRuleToTab() {
  this.fd.req({
    url: 'api/dept/evaluations/' + this.params.schemaId + '/blocks',
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
export function getAllRuleIds() {
  this.fd.req({
    url: 'api/dept/evaluations/' + this.params.schemaId + '/blocks',
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
    this.isCheck = this.blocksData.complete < this.blocksData.total
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
export function fillReport() {
  this.fillClick = 'fillReport'
  this.edit = true
}
export function fillCheck() {
  this.fillClick = 'fillCheck'
  this.edit = true
}
export function getRuleDetailById() {
  const options = {
    lock: true,
    text: '数据正在加载中',
    target: document.querySelector('#rule-report-table')
  }
  this.loading = this.$loading(options)
  this.fd.req({
    url: 'api/dept/assessments/blocks/' + this.id,
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
      indexObj['index' + info.indexId] = info || {}
      if (info.fillScore === 0) {
        info.fillScore = info.fillScore + ''
      }
      if (info.draftScore === 0) {
        info.draftScore = info.draftScore + ''
      }
      // 前一流程的分数
      if (info.preScore === 0) {
        info.preScore = info.preScore + ''
      }
      item['fillScore' + info.indexId] = info.fillScore || ''
      item['red' + info.indexId] = false
      if (info.approveScore === null) {
        info.approveScore = (info.preScore || '') + ''
      }
      item['approveScore' + info.indexId] = (info.approveScore + '') || (info.preScore + '')
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
  // this.heads = list
}
// 校验填报+审核分数值
export function checkApproveScore(row, indexId) {
  const value = 'approveScore' + indexId
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
      this.getTragetData(this.typeName, this.redMap.includes(true))
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
    if (this.indexCount === this.indexTotal && this.redMap.includes(true)) {
      return
    } else {
      this.$confirm('是否确定提交指标值?', '提交指标', {
        type: 'info'
      }).then(() => {
        this.getTragetData(this.typeName, this.redMap.includes(true))
      })
    }
  })
}
export function getTragetData(type, isRed) {
  if (isRed) {
    return
  }
  const data = []
  for (const item of this.tableData) {
    for (const info of item.indexes) {
      if (info.approveEditable) {
        if (type === 'submit' && !this.fd.data.boolean((item['approveScore' + info.indexId]))) {
          this.$message.error('存在未完成审核的指标，请全部审核完成后统一提交。')
          return
        }
        data.push({
          schemaFlowId: info.schemaFlowId,
          nextNodeId: info.approveNodeId,
          score: item['approveScore' + info.indexId]
        })
      }
    }
  }
  if (data.length === 0) {
    this.$message.error('暂无可提交的记录')
    return
  }
  const msg = type === 'submit' ? '提交成功' : '草稿保存成功'
  this.fd.req({
    url: 'api/dept/evaluations/current-user/' + type + '?actionType=approve',
    method: 'put',
    data: data
  }).then((d) => {
    this.$message({
      type: 'success',
      message: msg
    })
    this.edit = false
    const obj = {
      isCheck: true,
      resource: 'check'
    }
    if (this.typeName === 'submit') {
      // 提交成功后，原先存储在localstorage中的isFill是置成false的，表示这个表格不可以编辑（填报）
      obj.isCheck = false
      this.isCheck = false
    } else {
      // 保存草稿成功后，原先存储在localstorage中的isFill是置成true的，表示这个表格还可以编辑（填报）
      obj.isCheck = true
      this.isCheck = true
    }
    localStorage.setItem('obj', JSON.stringify(obj))
    this.getRuleDetailById()
  })
}
// 从细则进入的考核列表点击人名进入人员审核页面
export function seeCheckDetail(schema, row) {
  const originalCheck = this.obj.isCheck
  const obj = {
    isCheck: row.approveEditable,
    type: 'people',
    checkType: 'check',
    resource: 'other',
    page: this.obj.page,
    from: 'rule'
  }
  if (originalCheck) {
    obj.originalCheck = originalCheck
  }
  localStorage.setItem('obj', JSON.stringify(obj))
  this.$router.push({ name: 'otherCheckDepart-checkListDepart', query: {
    index: row.index, departId: row.departId,
    blockId: schema.blockId, schemaBlockType: schema.schemaBlockType,
    schemaId: schema.schemaId }})
}
// 点击审核按钮
export function fillTable() {
  this.obj.page = 'edit'
  this.edit = true
}
export function downloadTableDetail() {
  const data = {
    schemaId: this.params.schemaId,
    blockId: this.id,
    schemaBlockType: this.params.schemaBlockType,
    type: 'approve'
  }
  const url = 'api/dept/assessments/blocks/' + this.id + '/export'
  this.fd.tools.download('', url, data)
}
export function inputTableDetail() {
  const html = document.getElementById('tableDetail').outerHTML
  this.fd.tools.downloadByHtml({ divContent: html, fileName: this.fileName, type: 'complex' }, 'api/dept/html/download', 'post')
}
export function inputFilter(newFile, oldFile, prevent) {
  if (!/\.(xlsx|xls)$/i.test(newFile.name)) {
    this.$message.error('只支持Excel格式的文件!')
    return prevent()
  }
  const isLt10M = newFile.size / 1024 / 1024 < 10
  if (!isLt10M) {
    this.$message.error('上传附件大小不能超过 10MB!')
    return prevent()
  }
  this.$refs.upload.active = true
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
    isCheck: true,
    resource: 'check'
  }
  this.isCheck = true
  // 撤回成功后，原先存储在localstorage中的isFill是置成true的，表示这个表格还可以编辑（填报）
  localStorage.setItem('obj', JSON.stringify(obj))
  this.getRuleDetailById()
}
