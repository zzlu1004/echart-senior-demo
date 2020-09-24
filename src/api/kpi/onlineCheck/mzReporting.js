// kpiCard触发父组件的seeRuleDetail
export function emitSeeRuleDetail(row, pRow) {
  this.$emit('seeRuleDetail', row, pRow)
}

// kpiCard触发父组件的seeCheckRuleDetail
export function emitSeeCheckRuleDetail(row, pRow) {
  this.$emit('seeCheckRuleDetail', row, pRow)
}
// 其他考核--民主测评的细则查看
export function seeRuleDetail(row, pRow) {
  // 该条记录是否可以填报取决于该条记录已完成数量是否达到需要填报的总数，小于表示还可以继续填报，大于等于就说明该条记录不能继续填报了
  row.isFill = row.complete >= row.total
  const obj = {
    isFill: !row.isFill
  }
  localStorage.setItem('obj', JSON.stringify(obj))
  // blocks为同一方案下的所有细则，为查看页面的上一个和下一个功能
  this.cardData.forEach((item, index) => {
    if (item.schemaId === pRow.schemaId) {
      this.blocks = item.blocks
    }
  })
  this.blocks.forEach((item, index) => {
    if (item.blockId === row.blockId) {
      this.index = index
    }
  })
  localStorage.setItem('blocks', JSON.stringify(this.blocks))
  this.fd.tools.goDetail.call(this, 'mzReportList', { query: {
    index: this.index, blockId: row.blockId, blockName: row.blockName,
    schemaBlockType: row.schemaBlockType, schemaId: pRow.schemaId }})
}
// 其他考核--民主测评的细则填报
export function fillXz(row, pRow) {
  this.cardData.forEach((item, index) => {
    if (item.schemaId === pRow.schemaId) {
      this.blocks = item.blocks
    }
  })
  this.blocks.forEach((item, index) => {
    if (item.blockId === row.blockId) {
      this.index = index
    }
  })
  row.isFill = row.complete >= row.total
  const obj = {
    isFill: !row.isFill,
    page: 'edit'
  }
  localStorage.setItem('obj', JSON.stringify(obj))
  localStorage.setItem('blocks', JSON.stringify(this.blocks))
  this.fd.tools.goDetail.call(this, 'mzReportList', { query: {
    index: this.index, blockId: row.blockId, blockName: row.blockName,
    schemaBlockType: row.schemaBlockType, schemaId: pRow.schemaId }})
}
export function searchByKeyword(val) {
  this.searchVal = val
  if (this.type === 'people') {
    this.getOtherList(this.statusId)
  } else {
    this.getxzList(this.statusId)
  }
}
export function gotoDetailByName(row, column, cell, event) {
  if (column.property === 'staffName') {
    if (this.checkType === 'to_mz') {
      this.seeReportDetail(row)
    }
  }
}
// 获取民主测评-按细则列表
export function getxzList(statusId = '1') {
  this.fd.req({
    url: 'api/assessments/democratic/blocks',
    method: 'GET',
    data: { keyword: this.searchVal, statusId: statusId }
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
export function getOtherCnt() {
  this.fd.req({
    url: 'api/assessments/counts',
    method: 'GET'
  }).then((d) => {
    const data = d.data || {}
    this.reportCnt = data.fillCount || 0
    this.checkCnt = data.approvalCount || 0
    this.democraticCnt = data.democraticCount || 0
  })
}
