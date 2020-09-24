export function refreshWeightModel() {
  this.offset = 0
  this.getWeightModel()
}
export function searchByKeywords(val) {
  this.keywords = val
  this.offset = 0
  this.getWeightModel()
}
export function getWeightModel(params) {
  this.fd.req({
    type: 'get',
    url: 'api/weight/model',
    data: params || {
      limit: this.limit,
      offset: this.offset,
      keyword: this.keywords
    }
  }).then(response => {
    const data = response.data
    this.models = data.data
    this.total = data.total
  }).catch(error => {
    console.log('getWeightModel', error)
  })
}
// 处理权重模型列表数据
export function dealWithModel(data) {
  for (const item of data) {
    item.status = item.status || 0
    item.isUse = item.isUse || '0'
    // 未生效为启用
    const level_1 = item.status !== 1 && (item.isUse === '0' || item.isUse === '3')
    item.edit = level_1
    item.delete = level_1
    item.enabled = (item.isUse === '0' || item.isUse === '3') && item.status !== 1
    item.cancel = item.isUse === '1' && item.status !== 1
    item.enable_enabled = this.elements.enabled && (item.isUse === '0' || item.isUse === '3')
    item.enable_cancel = this.elements.cancel && item.isUse === '1'
    item.enable_edit = this.elements.edit
    item.enable_copy = this.elements.copy
    item.enable_delete = this.elements.delete
  }
  return data
}

export function currentChange(page) {
  this.offset = (page - 1) * this.limit
  this.getWeightModel()
}

export function sizeChange(limit) {
  this.limit = limit
  this.refreshWeightModel()
}

export function showModelDetail(data) {
  this.modelTitle = '模型详情'
  this.editModelDialog = true
  this.resetForm('modelForm')
  this.$nextTick(() => {
    this.modelForm.id = data.id
    this.modelForm.name = data.name
    this.modelForm.content = data.content
  })
}

export function deleteModel(data) {
  if (data.delete) {
    this.$confirm('删除后该权重模型的设置内容将无法恢复, 请问确定删除《' + data.name + '》权重设置吗?', '删除权重模型', {
      type: 'warning'
    }).then(() => {
      this.fd.req({
        type: 'delete',
        url: 'api/weight/model/' + data.id
      }).then(response => {
        this.refreshWeightModel()
      }).catch(error => {
        console.log('deleteModel', error)
      })
    }).catch(() => {})
  }
}

export function editModel(data) {
  if (data.edit) {
    this.modelTitle = '编辑模型'
    this.editModelDialog = true
    this.resetForm('modelForm')
    this.$nextTick(() => {
      this.modelForm.id = data.id
      this.modelForm.name = data.name
      this.modelForm.content = data.content
    })
  }
}

// 启用校验
export function checkModel(data) {
  if (data.enabled) {
    this.loading = this.$loading({
      lock: true,
      text: '正在校验中，请稍等...'
    })
    this.fd.req({
      type: 'get',
      url: 'api/weight/model/' + data.id + '/active/check'
    }).then(res => {
      this.loading.close()
      if (res && res.code === 200 && !res.data.isAccess) {
        this.checkModelDialog = true
        this.checkErrorList = res.data.data
      } else {
        this.startModel(data)
      }
    })
  }
}

// 启用模型
export function startModel(data) {
  if (data.enabled) {
    const options = {
      lock: true,
      text: '正在启用中,请稍等......'
    }
    this.loading = this.$loading(options)
    this.fd.req({
      type: 'put',
      url: 'api/weight/model/' + data.id + '/active'
    }).then(response => {
      this.$message({
        type: 'success',
        message: response.message
      })
      this.loading.close()
      this.getWeightModel()
    }).catch(error => {
      this.loading.close()
      console.log('startModel', error)
    })
  }
}
// 取消启用
export function cancelModel(data) {
  if (data.cancel) {
    const options = {
      lock: true,
      text: '正在取消启用中,请稍等......'
    }
    this.loading = this.$loading(options)
    this.fd.req({
      type: 'put',
      url: 'api/weight/model/' + data.id + '/inactive'
    }).then(response => {
      this.$message({
        type: 'success',
        message: response.message
      })
      this.loading.close()
      this.getWeightModel()
    }).catch(error => {
      this.loading.close()
      console.log('cancelModel', error)
    })
  }
}

export function addWeightModel() {
  this.modelTitle = '新增模型'
  this.editModelDialog = true
  this.$nextTick(() => {
    this.resetForm('modelForm')
    this.modelForm.id = ''
    this.modelForm.name = ''
    this.modelForm.content = ''
  })
}

export function copyModel(data) {
  this.$confirm('请问确定复制《' + data.name + '》权重设置吗?', '复制权重模型', {
    type: 'info'
  }).then(() => {
    this.fd.req({
      type: 'POST',
      url: 'api/weight/model/' + data.id + '/copy'
    }).then(response => {
      this.$message({
        type: 'success',
        message: '复制成功'
      })
      this.getWeightModel()
    }).catch(error => {
      console.log('copyModel', error)
    })
  }).catch(() => {})
}
// 保存权重模型
export function saveModel() {
  this.$refs.modelForm.validate((valid) => {
    if (valid) {
      let type = 'post'
      const data = {
        name: this.modelForm.name,
        content: this.modelForm.content
      }
      if (this.modelForm.id) {
        data.id = this.modelForm.id
        type = 'put'
      }
      this.fd.req({
        url: 'api/weight/model',
        method: type,
        data: data
      }).then((d) => {
        this.editModelDialog = false
        if (this.modelForm.id) {
          this.getWeightModel()
        } else {
          this.refreshWeightModel()
        }
      })
    }
  })
}
// 跳转到常规 浮动等详情页面
export function showDetailPage(page, data) {
  this.fd.tools.goDetail.call(this, this.pageMap[page.pageId], { query: { id: data.id, pageId: page.pageId, mypageName: data.name, edit: data.edit + '' }})
}
// 取消编辑
export function cancelEdit() {
  if (this.firstShow) {
    this.isShow = true
    this.fd.tools.merge(true, this.formData, this.oldData)
  } else {
    this.goBack()
  }
}
// 编辑指标
export function detailEdit() {
  this.fd.tools.merge(true, this.oldData, this.formData)
  this.isShow = false
}
// 页面类型对应关系
export const pageMap = {
  1: 'modelDetail_special',
  2: 'modelDetail_cri',
  3: 'modelDetail_civ',
  4: 'modelDetail_adm',
  5: 'modelDetail_exe',
  6: 'modelDetail_fixed',
  7: 'modelDetail_float'
}

export function refreshDetailList() {
  // this.offset = 0
  // 要进行排序，没有支持分页
  this.getDetailList()
}

export function getDetailList() {
  this.loading = true
  this.fd.req({
    type: 'get',
    url: 'api/weight/model/page/kpi',
    data: {
      limit: 0,
      offset: 0,
      pageId: this.pageId,
      weightmodelId: this.modelId,
      keyword: this.keywords
    }
  }).then(response => {
    const data = response.data
    this.list = data.data
    // 常规模型指标总数有单独的接口获取
    if (!this.getCount) {
      this.total = data.total
    }
    this.hasXLA = false
    for (const item of this.list) {
      if (item.name === '系列案件数' || item.name === '系列案件2' || item.indexModel === '1') {
        this.hasXLA = true
        break
      }
    }
    this.loading = false
  }).catch(error => {
    console.log('getDetailList', error)
  })
}
export function searchByKeyword(val) {
  this.keywords = val
  this.getDetailList()
}
export function downloadTable() {
  const params = {
    limit: 0,
    offset: 0,
    keyword: this.keywords,
    pageId: this.pageId,
    weightmodelId: this.modelId,
    fileName: '案件权重模型_' + this.mypageName + '_' + this.pageName1 + '_'
  }
  this.fd.tools.download('', 'api/weight/model/page/all-kpi/export', params)
}
export function kpiChangeReady() {
  let data = this.kpiMap[this.formData.kpiId]
  // 标记指标需要显示改指标已经配置信息
  if (this.formData.typeId === 'k10021-02') {
    data = this.selfMap[this.formData.kpiId]
    this.formData.formula = '\'标记指标\''
  } else {
    this.formData.formula = data.formula
  }
  this.formData.name = data.name
  this.formData.displayName = data.displayName
  this.formData.content = data.content
}
// 新增指标
export function addModelDetail(title) {
  if (this.getAllTarget) {
    this.getAllTarget()
  }
  this.editKpiId = ''
  this.title = '新增' + (title || '指标')
  this.isShow = false
  this.typeDialog = true
  this.resetForm('detailForm')
  this.$nextTick(() => {
    for (const key in this.formData) {
      if (key === 'typeId') {
        this.formData.typeId = this.types[0].id
      } else if (key === 'expression') {
        this.formData.expression = '权重系数'
      } else if (key === 'caseTypes') {
        this.formData.caseTypes = []
      } else {
        this.formData[key] = ''
      }
    }
  })
}
// 查看指标
export function showModelTargetDetail(data, title) {
  console.log(data)
  if (this.getAllTarget) {
    this.getAllTarget(data.id)
  }
  this.editKpiId = data.kpiId
  this.title = '查看' + (title || '指标')
  this.isShow = true
  this.typeDialog = true
  this.resetForm('detailForm')
  this.$nextTick(() => {
    for (const key in this.formData) {
      if (key === 'displayName') {
        this.formData[key] = data.displayName
      } else {
        this.formData[key] = data[key]
      }
    }
  })
}
// 编辑指标
export function editModelDetail(data, title) {
  if (this.getAllTarget) {
    this.getAllTarget(data.id)
  }
  this.editKpiId = data.kpiId
  this.title = '编辑' + (title || '指标')
  this.isShow = false
  this.typeDialog = true
  this.resetForm('detailForm')
  this.$nextTick(() => {
    for (const key in this.formData) {
      if (key === 'displayName') {
        this.formData[key] = data.displayName
      } else {
        this.formData[key] = data[key]
      }
    }
  })
}
// 删除指标
export function deleteModelList(data, title = '删除指标') {
  this.$confirm('删除后该指标的设置内容将无法恢复, 请问确定删除《' + data.displayName + '》' + (title === '删除指标' ? '指标吗?' : '预制指标吗'), title, {
    type: 'warning'
  }).then(() => {
    this.fd.req({
      type: 'delete',
      url: 'api/weight/model/page/kpi/' + data.id
    }).then(response => {
      this.refreshDetailList()
    }).catch(error => {
      console.log('deleteModelList', error)
    })
  }).catch(() => {})
}

export function sortList(data) {
  this.sortDialog = true
  this.oldSorts = JSON.parse(JSON.stringify(data))
  this.sortData = JSON.parse(JSON.stringify(data))
}

export function dragend(data) {
  data.forEach((item, i) => {
    item.sort = i
  })
  this.newSorts = data
}
// 指标排序
export function saveSort() {
  const edit = []
  this.newSorts.forEach((item, i) => {
    if (item.id !== this.oldSorts[i].id) {
      edit.push({ id: item.id, sort: item.sort })
    }
  })
  this.fd.req({
    url: 'api/weight/model/page/kpi/sort',
    method: 'put',
    data: edit
  }).then((d) => {
    this.refreshDetailList()
    this.sortDialog = false
  })
}
// 权重指标编辑保存
export function saveDetailPage() {
  this.$refs.detailForm.validate((valid) => {
    if (valid) {
      let type = 'post'
      const data = {
        name: this.formData.displayName,
        content: this.formData.content,
        weightmodelId: this.modelId,
        pageId: this.pageId,
        typeId: this.formData.typeId,
        kpiId: this.formData.kpiId,
        formula: this.formData.formula,
        expression: this.formData.expression,
        caseTypes: this.formData.caseTypes
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
// 获取指标详情
export function getKPIDetail() {
  this.fd.req({
    type: 'get',
    url: 'api/weight/model/page/kpi/' + this.id
  }).then(response => {
    const data = response.data
    for (const key in this.formData) {
      this.formData[key] = data[key]
    }
  }).catch(error => {
    console.log('getKPIDetail', error)
  })
}
// 获取所有可选指标
export function getAllTarget(id) {
  this.fd.req({
    type: 'get',
    url: 'api/weight/model/page/dim/kpi',
    data: {
      type: id ? 'update' : 'add',
      id: id,
      weightmodelId: this.modelId
    }
  }).then(response => {
    this.targets = response.data
  }).catch(error => {
    console.log('getAllTarget', error)
  })
}
// 选择的预制指标发生变化
export function kpiChange() {
  const data = this.kpiMap[this.formData.kpiId]
  this.formData.formula = data.formula
}
// 选择的标记指标发生变化
export function selfKpiChange(data) {
  this.formData.displayName = (this.selfMap[data] || {}).name
  this.formData.content = (this.selfMap[data] || {}).content
}
// 指标类型发生变化的时候
export function typeChange() {
  this.formData.kpiId = ''
  this.formData.displayName = ''
  this.formData.content = ''
}
export function getCaseType() {
  this.fd.req({
    type: 'get',
    url: 'api/weight/model/page/dim/kpi/type',
    data: {
      kpiType: 4
    }
  }).then(response => {
    this.caseTypes = response.data
    this.casesMap = this.fd.data.arrayToObj(response.data, 'id')
  }).catch(error => {
    console.log('getCaseType', error)
  })
}
// 获取标记指标-固定因素
export function getFixedSelfTarget() {
  this.fd.req({
    type: 'get',
    url: 'api/remark-indexes',
    data: {
      offset: 0,
      limit: 0,
      indexModel: 'normal'
    }
  }).then(response => {
    const data = response.data.data || []
    this.selfs = data.filter((item) => {
      return item.indexModel === '2' || item.indexModel === '1'
    })
  }).catch(error => {
    console.log('getFixedSelfTarget', error)
  })
}
// 获取标记指标
export function getSelfTarget() {
  this.fd.req({
    type: 'get',
    url: 'api/remark-indexes',
    data: {
      offset: 0,
      limit: 0,
      indexModel: 'normal'
    }
  }).then(response => {
    const data = response.data.data || []
    this.selfs = data.filter((item) => {
      // item.indexModel === '2'普通案件
      return item.indexModel === '2'
    })
  }).catch(error => {
    console.log('getSelfTarget', error)
  })
}
// 判断标记指标是否可以选择
export function canSelectTargets(id) {
  return this.ids.indexOf(id) < 0 || id === this.editKpiId
}
// 判断预制指标是否可以选择
export function canSelectReadys(id) {
  // 指标没有选择，同时该指标为标记指标中的系列案指标，且没有任何一个系列案指标被选择
  let flag = true
  if (this.hasXLA) {
    // 如果当前编辑的是预制指标，则所有的预制指标都能选，否则只能选普通案件，系列案件2ts002003 系列案件数ts002001
    if (this.editKpiId) {
      const kpi = this.kpiMap[this.editKpiId]
      if (kpi) {
        // 当编辑的是系列案的时候，系列案的选项都要出现
        if ((kpi.id === 'ts002001' || kpi.id === 'ts002003')) {
          flag = true
          // 当编辑的是普通案件的时候，系列案的选项不能出现
        } else {
          if (id === 'ts002001' || id === 'ts002003') {
            flag = false
          }
        }
      }
    } else {
    // 新增时候只能选择普通案件
      if (id === 'ts002001' || id === 'ts002003') {
        flag = false
      }
    }
    if (flag) {
      flag = this.ids.indexOf(id) < 0 || id === this.editKpiId
    }
  }
  // if (this.selfMap[id]) {
  //   // hasXLA为true表示表格中已经选择过预制指标中的系列案件数或者是系列案件2或者是类型为系列案的标记指标
  //   if (this.hasXLA) {
  //     if (id === 'ts002001' || id === 'ts002003') {
  //       flag = false
  //     }
  //     // 有选择系列案预制指标。只能选择普通案件，或者正在编辑, 或者当前编辑的正好就是系列案
  //     flag = this.selfMap[id].indexModel === '2' || id === this.editKpiId
  //     // 当前编辑为标记，且编辑的这个为系列案
  //     if (this.selfMap[this.editKpiId] && this.selfMap[this.editKpiId].indexModel === '1') {
  //       flag = true
  //     }
  //     const kpi = this.kpiMap[this.editKpiId]
  //     // 如果当前编辑的是规则判断，则所有的标记指标都能选，否则只能选普通案件, 系列案件2ts002003 系列案件数ts002001
  //     if (kpi && (kpi.id === 'ts002001' || kpi.id === 'ts002003')) {
  //       flag = true
  //     }
  //   }
  //   // 可选的前提下判断是否已经被选择过了，或者正在编辑,普通案件选过也不能重复选择
  //   if (flag) {
  //     flag = this.ids.indexOf(id) < 0 || id === this.editKpiId
  //   }
  // }
  return flag
}
