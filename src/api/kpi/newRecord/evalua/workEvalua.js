export function currentChange(val) {
  this.personParams.offset = (val - 1) * this.personParams.limit
  this.getJudgeTotal(this.type)
}
export function sizeChange(val) {
  this.personParams.limit = val
  this.personParams.offset = 0
  this.getJudgeTotal(this.type)
}
export function currentChangeDepart(val) {
  this.departParams.offset = (val - 1) * this.departParams.limit
  this.getDepartTotal(this.type)
}
export function sizeChangeDepart(val) {
  this.departParams.limit = val
  this.departParams.offset = 0
  this.getDepartTotal(this.type)
}
// 刷新时清空条件
export function refreshCondition() {
  this.personParams.orderField = ''
  this.personParams.orderType = ''
  if (this.$refs.tableOpt) {
    this.$refs.tableOpt.$children[0].clearSort()
  }
  if (this.$refs.judgeOpt) {
    this.$refs.judgeOpt.$children[0].clearSort()
  }
  this.personParams.limit = 10
  this.personParams.offset = 0
}
// 刷新所有数据
export function refreshAll() {
  this.getJudgeTotal()
}
export function refreshAllDepart() {
  this.getDepartTotal()
}
export function sortByNum1(column) {
  this.departParams.orderField = column.prop
  this.departParams.orderType = column.order
  this.getDepartTotal()
}
export function sortByNum2(column) {
  this.personParams.orderField = column.prop
  this.personParams.orderType = column.order
  this.getJudgeTotal()
}
// 部门的表格数据
export function getDepartTotal() {
  this.departLoading = true
  let url = ''
  url = 'api/job-evaluations?type=' + this.departParams.type + '&offset=' + this.departParams.offset + '&limit=' + this.departParams.limit
  const data = this.fd.tools.merge(true, {}, this.departQuery, this.departParams)
  this.fd.req({
    url: url,
    method: 'post',
    data: data
  }).then((d) => {
    const data = d.data || {}
    this.departOpt.data = data.data
    this.totalDepart = data.total
    this.departLoading = false
  }).catch(error => {
    console.log(error)
    this.departLoading = false
  })
}
// 个人的表格数据
export function getJudgeTotal() {
  this.judgeLoading = true
  let url = ''
  url = 'api/job-evaluations?type=' + this.personParams.type + '&offset=' + this.personParams.offset + '&limit=' + this.personParams.limit
  const data = this.fd.tools.merge(true, {}, this.query, this.personParams)
  this.fd.req({
    url: url,
    method: 'post',
    data: data
  }).then((d) => {
    const data = d.data || {}
    this.personOpt.data = data.data
    this.total = data.total
    this.judgeLoading = false
  }).catch(error => {
    console.log(error)
    this.judgeLoading = false
  })
}
// 表格中指标和子指标的反查
// 部门-表格中跳转详情
export function countPeg(row, column, cell, event) {
  if (!this.elements.assessmentProgram && !this.elements.averageScore) {
    return
  }
  const obj = {
    schemaId: row.schemaId,
    schemaStatus: row.status,
    schemaBlockType: row.schemaBlockType
  }
  localStorage.setItem('obj', JSON.stringify(obj))
  if (column.property === 'avgScore') {
    if (this.elementsDetailDepart[row.status] && this.elementsDetailDepart[row.schemaBlockType]) {
      this.$router.push({ name: 'tableDetailDepart', query: obj })
    } else {
      this.$message({
        type: 'warning',
        message: '您没有查看权限！'
      })
    }
  }

  if (column.property === 'schemaName') {
    this.$router.push({ name: 'checkProjectDepart-projectDetailDepart', query: obj })
  }
}
// 个人-表格中跳转详情
export function countPersonPeg(row, column, cell, event) {
  if (!this.elements.assessmentProgram && !this.elements.averageScore) {
    return
  }
  const obj = {
    schemaId: row.schemaId,
    schemaStatus: row.status,
    schemaBlockType: row.schemaBlockType
  }
  localStorage.setItem('obj', JSON.stringify(obj))
  if (column.property === 'avgScore') {
    if (this.elementsDetail[row.status] && this.elementsDetail[row.schemaBlockType]) {
      this.$router.push({ name: 'tableDetail', query: obj })
    } else {
      this.$message({
        type: 'warning',
        message: '您没有查看权限！'
      })
      return
    }
  }
  if (column.property === 'schemaName') {
    this.$router.push({ name: 'checkProject-projectDetail', query: obj })
  }
}
export function getWidth(name) {
  const l = 16
  return (name.length + 1) * l + 40
}
// 根据接口返回的数据字段匹配生成表头数据列
