// 获取表头配置
export function getHeads() {
  this.fd.req({
    type: 'get',
    url: 'api/weight/model/page/tableHeader',
    data: {
      pageId: this.pageId
    }
  }).then(response => {
    const data = response.data
    this.heads = data
    if (data.length > 0) {
      this.pageData.headId = data[0].id
    }
    this.headMap = this.fd.data.arrayToObj(data, 'id')
    this.getModelMsg()
  }).catch(error => {
    console.log('getHeads', error)
  })
}
export function getModelMsg() {
  this.fd.req({
    type: 'get',
    url: 'api/weight/model/page/' + this.modelId,
    data: {
      pageId: this.pageId
    }
  }).then(response => {
    const data = response.data
    this.pageData.id = data.id
    this.pageData.headId = data.pageTableheadId
    this.pageData.customType = data.customType
    this.pageData.otherDefault = data.otherDefault
    this.pageData.levelId = data.levelId
  }).catch(error => {
    console.log('getModelMsg', error)
  })
}
// 获取全量案由
export function getSummary() {
  this.fd.req({
    type: 'get',
    url: 'api/weight/model/page/case/reason',
    data: {
      pageId: this.pageId
    }
  }).then(response => {
    this.summary = response.data
    if (this.summary) {
      this.summary.forEach(d => {
        const key = d.id + this.summaryIdSubfix
        this.summaryNames[key] = d.label
      })
      this.flag = true
    }
  }).catch(error => {
    console.log('getSummary', error)
  })
}
// 获取指标数量
export function getCount() {
  this.fd.req({
    type: 'get',
    url: 'api/weight/model/page/' + this.modelId + '/count/kpi',
    data: {
      pageId: this.pageId
    }
  }).then(response => {
    this.total = response.data.count
  }).catch(error => {
    console.log('getCount', error)
  })
  return 0
}
// 搜索案由
export function searchSummary() {
  const summary = []
  this.summary.forEach((d, i) => {
    if (d.label.indexOf(this.summaryName) > -1) {
      summary.push(d)
    }
  })
  this.summaryList = summary
}

export function getLevels(d, levels = []) {
  const idMap = this.fd.data.arrayToObj(d, 'id')
  const pids = this.fd.data.classify(d, 'parentId')
  const first = []
  for (const item of d) {
    if (!idMap[item.parentId]) {
      first.push(item)
    }
  }
  this.getAllLevels(first, idMap, pids, levels)
  return levels
}
export function getAllLevels(first, idMap, pids, levels) {
  levels.push(first)
  const next = []
  for (const item of first) {
    if (pids[item.id]) {
      next.push(...pids[item.id])
    }
  }
  if (next.length > 0) {
    this.getAllLevels(next, idMap, pids, levels)
  }
}

export function addModelDetail() {
  this.title = '新增指标'
  this.isShow = false
  this.typeDialog = true
  this.resetForm('detailForm')
  this.$nextTick(() => {
    this.formData.id = ''
    this.formData.typeId = this.types[0].id
    this.formData.displayName = ''
    this.formData.expression = '权重系数'
    this.formData.content = ''
    this.formData.formula = ''
    this.formData.ruleId = this.ruleType[0].id
    if (this.admType) {
      this.formData.formulaId = []
    }
    this.formData.summaries = this.fd.data.getValuesByKey(this.summaryData[0], 'id')
  })
}
export function editModelDetail(data) {
  this.title = '编辑指标'
  this.isShow = false
  this.typeDialog = true
  this.editKpiId = data.kpiId
  this.resetForm('detailForm')
  this.$nextTick(() => {
    this.formData.id = data.id
    this.formData.typeId = data.typeId
    this.formData.displayName = data.displayName || data.name
    this.formData.expression = data.expression
    this.formData.content = data.content
    this.formData.ruleId = data.ruleId
    this.formData.kpiId = data.kpiId
    this.formData.formula = ''
    if (data.ruleId === 'k10025-03') {
      this.formData.formula = data.formula
    } else if (data.ruleId === 'k10025-02') {
      this.formData.formulaId = (data.formula || '').split(',')
    } else {
      this.formData.summaries = (data.formula || '').split(',')
    }
  })
}
export function showModelTargetDetail(data) {
  this.title = '查看指标'
  this.isShow = true
  this.typeDialog = true
  this.editKpiId = data.kpiId
  this.resetForm('detailForm')
  this.$nextTick(() => {
    this.formData.id = data.id
    this.formData.typeId = data.typeId
    this.formData.displayName = data.displayName || data.name
    this.formData.expression = data.expression
    this.formData.content = data.content
    this.formData.ruleId = data.ruleId
    this.formData.kpiId = data.kpiId
    if (data.ruleId === 'k10025-03') {
      this.formData.formula = data.formula
    } else if (data.ruleId === 'k10025-02') {
      this.formData.formulaId = (data.formula || '').split(',')
    } else {
      this.formData.summaries = (data.formula || '').split(',')
    }
  })
}
// 自定义分类弹框保存
export function saveType(obj) {
  this.$refs.detailForm.validate((valid) => {
    if (valid) {
      let type = 'post'
      const data = {
        name: this.formData.displayName,
        content: this.formData.content,
        weightmodelId: this.modelId,
        pageId: this.pageId,
        typeId: this.formData.typeId,
        ruleId: this.formData.ruleId,
        kpiId: this.formData.kpiId,
        expression: this.formData.expression
      }
      if (this.formData.ruleId === 'k10025-03') {
        data.formula = this.formData.formula
      } else if (this.formData.ruleId === 'k10025-02') {
        data.formula = this.formData.formulaId.join()
      } else {
        data.formula = obj.join()
      }
      if (this.formData.id) {
        data.id = this.formData.id
        type = 'put'
      }
      this.fd.req({
        url: 'api/weight/model/page/kpi',
        method: type,
        data: data
      }).then((d) => {
        this.typeDialog = false
        this.refreshDetailList()
      })
    }
  })
}
// 表头，案件分类等信息的保存
export function saveModel() {
  let type = 'post'
  const data = {
    weightmodelId: this.modelId,
    pageId: this.pageId,
    pageTableheadId: this.pageData.headId,
    otherDefault: this.pageData.otherDefault,
    customType: this.pageData.customType,
    levelId: this.pageData.levelId
  }
  if (this.pageData.id) {
    data.id = this.pageData.id
    type = 'put'
  }
  this.fd.req({
    url: 'api/weight/model/page',
    method: type,
    data: data
  }).then((d) => {
    this.pageData.id = d.data.id
    this.getCount()
    this.$message({
      type: 'success',
      message: '保存成功'
    })
  })
}
