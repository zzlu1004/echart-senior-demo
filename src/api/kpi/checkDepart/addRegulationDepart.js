
// 新建指标体系
export function saveTargetSystem() {
  // 获取最新的指标体系目录信息
  this.getMenus = !this.getMenus
}
// 获取所有指标
export function getTargetList() {
  let url = 'api/dept/indexes'
  if (this.indexType === 'marked') {
    url = 'api/remark-indexes'
  }
  this.fd.req({
    url: url,
    method: 'get',
    data: {
      indexType: this.indexType,
      indexName: this.indexName,
      keyword: this.indexName,
      isAccess: this.indexType === 'newSystem' ? 'yes' : 'no'
    }
  }).then((d) => {
    if (this.indexType === 'marked') {
      this.indexData = d.data.data || []
    } else {
      this.indexData = d.data
    }
  })
}
// 设置指标类别按钮点击
export function setTargetType() {
  this.targetSystem = true
}
// 设置指标类别右侧指标分类展开隐藏
export function showTarget(index, show) {
  this.$set(this.targetData[index], 'show', show)
  this.targetData = this.fd.tools.merge(true, {}, this.targetData, this.targetData)
}
// 新增细则保存
export function saveRegulation() {
  this.$refs.regulationForm.validate((valid) => {
    if (valid) {
      // 取反获取指标体系中最终所有的指标配置
      this.getTargetMsg = !this.getTargetMsg
    } else {
      return false
    }
  })
}
export function goRegulation() {
  this.$router.push({ name: 'regulationsDepart' })
}
// 刷新指标体系中指标的配置信息
export function refreshTargetMsg(msg) {
  // 指标配置
  const targetData = []
  const menus = []
  for (const key in msg) {
    const { id: indexId, id: menuId, indexFlowId, weight, valueMax, valueMin, checkFormula, formula, formulaId, indexSetupValue, flows, updateUser, updateTime, pid, menuName, menuType, blockId, comments, createTime, createUser, ruleType, menuLevel } = msg[key]
    targetData.push({
      indexId, indexFlowId, formula, formulaId, weight, valueMax, valueMin, checkFormula, indexSetupValue, flows, menuType
    })
    menus.push({
      updateUser, updateTime, pid, menuId, menuName, blockId, comments, createTime, createUser, formula, formulaId, ruleType, menuLevel, menuType
    })
  }
  // 去除非指标行
  const indexData = []
  targetData.forEach((item, i) => {
    if (item.menuType === '1') {
      indexData.push(item)
    }
  })
  // 为目录加上sort字段
  const menusData = []
  menus.forEach((item, i) => {
    menusData.push({ ...item, sort: i })
  })
  this.fd.req({
    type: this.id ? 'put' : 'post',
    url: 'api/dept/blocks',
    data: {
      id: this.id,
      ...this.regulation,
      indexes: indexData,
      menus: menusData
    }
  }).then(response => {
    this.goBack()
  }).catch(error => {
    console.log('saveDepart', error)
  })
}
// 表格中编辑的信息及时更新到dataMap
export function refreshTarget(data) {
  for (const key in data) {
    const item = data[key]
    const li = this.targetMap[item.id]
    if (li) {
      li.weight = item.weight
      li.formula = item.formula
      li.formulaId = item.formulaId
      li.valueMax = item.valueMax
      li.valueMin = item.valueMin
      li.checkFormula = item.checkFormula
      li.indexSetupValue = item.indexSetupValue
    }
  }
}
