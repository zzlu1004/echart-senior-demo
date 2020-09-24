// 其他考核--待填报的人员查看
export function seeReportDetail(row) {
  const obj = {
    isFill: !row.isFill,
    type: 'people',
    resource: 'other',
    checkType: 'report'
  }
  localStorage.setItem('obj', JSON.stringify(obj))
  this.fd.tools.goDetail.call(this, 'reportList', { query: {
    index: row.index, staffId: row.staffId, blockId: row.blockId,
    schemaBlockType: row.schemaBlockType, schemaId: row.schemaId }})
}
// 其他考核--待填报的人员填报
export function reportFill(row) {
  const obj = {
    isFill: !row.isFill,
    type: 'people',
    resource: 'other',
    checkType: 'report',
    page: 'edit'
  }
  localStorage.setItem('obj', JSON.stringify(obj))
  this.fd.tools.goDetail.call(this, 'reportList', { query: {
    index: row.index, staffId: row.staffId,
    blockId: row.blockId, schemaBlockType: row.schemaBlockType,
    schemaId: row.schemaId }})
}
// 其他考核--待审核的人员查看
export function seeCheckDetail(row) {
  // isFill是用来判断按钮是否置灰，true置灰表示不可以编辑
  const obj = {
    isCheck: !row.isFill,
    type: 'people',
    resource: 'other',
    checkType: 'check'
  }
  localStorage.setItem('obj', JSON.stringify(obj))
  this.fd.tools.goDetail.call(this, 'checkList', { query: {
    index: row.index, staffId: row.staffId,
    blockId: row.blockId, schemaBlockType: row.schemaBlockType,
    schemaId: row.schemaId }})
}
// 其他考核--待审核的人员审核
export function checkFill(row) {
  const obj = {
    isCheck: !row.isFill,
    type: 'people',
    resource: 'other',
    checkType: 'check',
    operateType: 'check',
    page: 'edit'
  }
  localStorage.setItem('obj', JSON.stringify(obj))
  this.fd.tools.goDetail.call(this, 'checkList', { query: {
    index: row.index, staffId: row.staffId,
    blockId: row.blockId, schemaBlockType: row.schemaBlockType,
    schemaId: row.schemaId }})
}
// kpiCard触发父组件的seeRuleDetail
export function emitSeeRuleDetail(row, pRow) {
  this.$emit('seeRuleDetail', row, pRow)
}

// kpiCard触发父组件的seeCheckRuleDetail
export function emitSeeCheckRuleDetail(row, pRow) {
  this.$emit('seeCheckRuleDetail', row, pRow)
}
// 其他考核--待填报的细则查看
export function seeRuleDetail(row, pRow) {
  // 该条记录是否可以填报取决于该条记录已完成数量是否达到需要填报的总数，小于表示还可以继续填报，大于等于就说明该条记录不能继续填报了
  row.isFill = row.complete >= row.total
  const obj = {
    isFill: !row.isFill
  }
  localStorage.setItem('obj', JSON.stringify(obj))
  this.fd.tools.goDetail.call(this, 'ruleReportList', { query: {
    index: row.offset, blockId: row.blockId,
    schemaBlockType: row.schemaBlockType, schemaId: pRow.schemaId }})
}
// 其他考核--待审核的细则查看
export function seeCheckRuleDetail(row, pRow) {
  row.isFill = row.complete >= row.total
  const obj = {
    isCheck: !row.isFill
  }
  localStorage.setItem('obj', JSON.stringify(obj))
  this.fd.tools.goDetail.call(this, 'ruleCheckList', { query: {
    index: row.offset, blockId: row.blockId,
    schemaBlockType: row.schemaBlockType, schemaId: pRow.schemaId }})
}
export function seePlanCheckDetail(row) {
  row.isFill = row.complete >= row.total
  const obj = {
    isFill: !row.isFill
  }
  localStorage.setItem('obj', JSON.stringify(obj))
  const planObj = {
    schemaName: row.schemaName,
    startTime: row.startTime,
    endTime: row.endTime,
    deadlineTime: row.deadlineTime
  }
  localStorage.setItem('planObj', JSON.stringify(planObj))
  this.fd.tools.goDetail.call(this, 'planReportList', { query: {
    schemaBlockType: row.schemaBlockType, schemaId: row.schemaId }})
}
// 其他考核--待填报的细则填报
export function fillXz(row, pRow) {
  row.isFill = row.complete >= row.total
  const obj = {
    isFill: !row.isFill,
    page: 'edit'
  }
  localStorage.setItem('obj', JSON.stringify(obj))
  this.fd.tools.goDetail.call(this, 'ruleReportList', { query: {
    index: row.offset, blockId: row.blockId,
    schemaBlockType: row.schemaBlockType, schemaId: pRow.schemaId }})
}
// 其他考核--根据方案填报
export function fillPlan(row, pRow) {
  row.isFill = row.complete >= row.total
  const obj = {
    isFill: !row.isFill,
    page: 'edit'
  }
  localStorage.setItem('obj', JSON.stringify(obj))
  const planObj = {
    schemaName: row.schemaName,
    startTime: row.startTime,
    endTime: row.endTime,
    deadlineTime: row.deadlineTime
  }
  localStorage.setItem('planObj', JSON.stringify(planObj))
  this.fd.tools.goDetail.call(this, 'planReportList', { query: {
    schemaBlockType: row.schemaBlockType, schemaId: pRow.schemaId }})
}
// 其他考核--待审核的细则审核
export function checkXz(row, pRow) {
  const obj = {
    isCheck: !row.isFill,
    page: 'edit'
  }
  localStorage.setItem('obj', JSON.stringify(obj))
  this.fd.tools.goDetail.call(this, 'ruleCheckList', { query: {
    index: row.offset, blockId: row.blockId,
    schemaBlockType: row.schemaBlockType, schemaId: pRow.schemaId }})
}
export function searchByKeyword(val) {
  this.params.keyword = val
  this.params.offset = 0
  if (this.type === 'people') {
    this.getOtherList(this.statusId)
  } else if (this.type === 'detail') {
    this.getxzList(this.statusId)
  } else {
    this.getPlanList(this.statusId)
  }
}
export function gotoDetailByName(row, column, cell, event) {
  if (column.property === 'staffName') {
    if (this.checkType === 'to_fill') {
      this.seeReportDetail(row)
    } else {
      this.seeCheckDetail(row)
    }
  }
}
export function getCheckType(type = 'to_fill') {
  this.params.type = type || 'to_fill'
}
export function refreshOtherCheck(type) {
  this.$emit('getCheckType', type)
}
export function getOtherList(statusId = '1') {
  this.loading = true
  this.fd.req({
    url: 'api/assessments/users',
    method: 'GET',
    data: Object.assign({}, this.params, { type: this.checkType, statusId })
  }).then((d) => {
    const data = d.data.data || []
    let index = this.params.offset
    for (const item of data) {
      item.index = index
      index++
      item.isFill = (item.complete >= item.total)
    }
    this.loading = false
    this.reportOption[this.checkType].data = data
    this.total = d.data.total
  })
}
export function getxzList(statusId = '1') {
  this.fd.req({
    url: 'api/assessments/blocks',
    method: 'GET',
    data: { keyword: this.params.keyword, type: this.checkType, statusId: statusId }
  }).then((d) => {
    const data = d.data || []
    for (const item of data) {
      if (item.synthesises) {
        for (const info of item.synthesises) {
          info.notFill = (info.complete >= info.total)
        }
      }
      if (item.judges) {
        for (const info of item.judges) {
          info.notFill = (info.complete >= info.total)
        }
      }
      if (item.democracies) {
        for (const info of item.democracies) {
          info.notFill = (info.complete >= info.total)
        }
      }
      if (item.departs) {
        for (const info of item.departs) {
          info.notFill = (info.complete >= info.total)
        }
      }
    }
    this.cardData = data
  })
}
// 获取按方案列表
export function getPlanList(statusId) {
  this.fd.req({
    url: 'api/assessments/schemas',
    method: 'GET',
    data: { keyword: this.params.keyword, type: this.checkType, statusId: statusId }
  }).then((d) => {
    const data = d.data || []
    for (const item of data) {
      item.notFill = (item.complete >= item.total)
    }
    this.planData = data
  })
}
export function getOtherCnt() {
  this.fd.req({
    url: 'api/assessments/counts',
    method: 'GET',
    data: { statusId: this.statusId }
  }).then((d) => {
    const data = d.data || {}
    this.reportCnt = data.fillCount || 0
    this.checkCnt = data.approvalCount || 0
    this.democraticCnt = data.democraticCount || 0
  })
}
export function currentChange(val) {
  this.params.offset = (val - 1) * this.params.limit
  this.getOtherList(this.statusId)
}
export function sizeChange(val) {
  this.params.limit = val
  this.params.offset = 0
  this.getOtherList(this.statusId)
}
