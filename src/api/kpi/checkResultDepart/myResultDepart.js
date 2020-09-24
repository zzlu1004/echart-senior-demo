export function getSchemas() {
  if (!this.elements.active && !this.elements.finished) {
    return
  }
  this.fd.req({
    type: 'get',
    url: 'api/dept/schemas/publiced/current-user',
    data: {
      schemaStatus: this.schemaStatus
    }
  }).then(response => {
    const data = response.data || {}
    this.schemaOpt = data
    this.params.schemaId = data.length > 0 ? data[0].id : ''
    if (!this.elements.check && !this.elements.total) {
      this.type = 'k10015-04'
    }
    this.isnull = (this.params.schemaId === '')
    this.getDepart(this.params.schemaId)
  }).catch(error => {
    console.log(error)
  })
}
export function changeType(val) {
  this.type = val.name
  this.getTargetList()
}
export function getDepart(id) {
  if (!this.params.schemaId) {
    return
  }
  this.fd.req({
    type: 'get',
    url: 'api/depart/schemas/' + id,
    data: {
      staffId: this.staffId,
      departTypes: ''
    }
  }).then(response => {
    const data = response.data || {}
    this.schemaDepartOpt = data
    this.params.departId = data.length > 0 ? data[0].id : ''
    if (!this.isnull) {
      this.getTargetList()
    }
  }).catch(error => {
    console.log(error)
  })
}
export function getTargetList() {
  // const options = {
  //   lock: true,
  //   text: '数据正在加载中',
  //   target: document.querySelector('#myResult')
  // }
  // this.loading = this.$loading(options)
  this.params.schemaBlockType = this.type
  this.fd.req({
    type: 'get',
    url: 'api/dept/assessmet/result/' + this.params.departId,
    data: this.params
  }).then(response => {
    const data = response.data || {}
    this.userInfo = data.userInfo || {}
    this.allScore = data.allScore || ''
    this.grade = data.grade || {}
    this.schema = data.schema || {}
    this.fileName = (this.userInfo.departName ? this.userInfo.departName : '') + (this.schema.schemaName ? this.schema.schemaName : '') + this.typesMap[this.type] + '考核结果'
    this.targetMenus = data.header || []
    this.indexData = data.scores || []
    // this.loading.close()
  }).catch(error => {
    console.log(error)
  })
}
export function downloadMyResult() {
  window.$('#myResult').find('.el-popover').remove()
  const html = document.getElementById('myResult').outerHTML
  this.fd.tools.downloadByHtml({ divContent: html, fileName: this.fileName, headerName: this.fileName, type: 'simple' }, 'api/html/download', 'post')
}
export function refreshAll() {
  if (!this.params.schemaId || !this.params.departId) {
    this.$message({
      type: 'warning',
      message: '查询条件都不能为空'
    })
    return
  }
  this.getTargetList()
}
export function showPeg(row) {
  if (!this.elements.peg) {
    return
  }
  this.showId = row.id
  this.$nextTick(() => {
    this.showEdit = true
    this.getPegValue({ departId: row.departId }, row)
  })
}
export function emitParentType(type) {
  this.type = type
}
export function emitParentTypeByMyresult(type) {
  this.type = type
  this.getTargetList()
}
// 部门反查页的审判绩效民主测评指标反查跳转
export function stafftargetPeg(row, it) {
  // 1：指标反查
  if (it.kpiType === '1') {
    // 审判绩效指标反查调到个人详情页
    if (it.kpiId === 'zb005001' || it.kpiId === 'b081') {
      this.type = 'k10015-02'
      this.$emit('emitParentType', this.type)
    } else {
      this.moralPeg(row, it)
    }
    // 5：民主测评指标值反查
  } else if (it.kpiType === '5') {
    this.mzIndexDepartPeg(row, it)
    // 2：案件数反查 4：标记指标反查
  } else if (it.kpiType === '2' || it.kpiType === '4') {
    // 审判绩效指标反查调到个人详情页
    if (it.kpiId === 'zb005001' || it.kpiId === 'b081') {
      this.type = 'k10015-02'
      this.$emit('emitParentType', this.type)
    } else {
      this.casePeg(row, it)
    }
    // 3：工作量反查
  } else if (it.kpiType === '3') {
    // 审判绩效指标反查调到个人详情页
    if (it.kpiId === 'zb005001' || it.kpiId === 'b081') {
      this.type = 'k10015-02'
      this.$emit('emitParentType', this.type)
    } else {
      this.cbrWorkPeg(row, it)
    }
  } else {
    // 审判绩效指标反查调到个人详情页
    if (it.kpiId === 'zb005001' || it.kpiId === 'b081') {
      this.type = 'k10015-02'
      this.$emit('emitParentType', this.type)
      // 民主测评指标反查调到个人详情页
    } else if (it.kpiId === 'zb005006' || it.kpiId === 'b080') {
      this.type = 'k10015-03'
      this.$emit('emitParentType', this.type)
    }
    // k10033-02：案件工作量反查
    if (it.kpiType === 'k10033-02') {
      this.cbrWorkPeg(row, it)
      // k10033-01：案件数反查 k10033-03：审理时间指数反查 k10033-04：后审指标反查
    } else if (it.kpiType === 'k10033-01' || it.kpiType === 'k10033-03' || it.kpiType === 'k10033-04' || it.kpiType === 'k10033-05' || it.kpiType === 'k10033-06' || it.kpiType === 'k10033-07') {
      this.casePeg(row, it)
    }
  }
}
