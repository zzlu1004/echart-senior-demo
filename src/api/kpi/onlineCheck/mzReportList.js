export function getAllRuleIds() {
  const data = this.blockGroup || {}
  // this.blocksData = data.length ? data[0] : {}
  this.total = data.length ? data.length : 0
  this.show1 = this.index > 0
  this.show2 = this.index < (this.total - 1)
  this.id = data[this.index].blockId
  this.blockName = data[this.index].blockName
  // this.params.schemaId = data[this.index].schemaId
  // this.params.schemaBlockType = data[this.index].schemaBlockType
  this.isFill = data[this.index].complete < data[this.index].total
  // 点击上一个，下一个，需要重新从细则内容中获取
  this.getRuleDetailById()
}
// 查看细则上一个
export function previousRule() {
  this.index--
  this.getAllRuleIds()
}
// 查看细则下一个
export function nextRule() {
  this.index++
  this.getAllRuleIds()
}
export function getRuleDetailById() {
  this.gearChooseArr = []
  this.isactive = []
  this.gearNum = []
  const options = {
    lock: true,
    text: '数据正在加载中',
    target: document.querySelector('#rule-report-table')
  }
  this.loading = this.$loading(options)
  this.fd.req({
    url: 'api/assessments/democratic/blocks/' + this.id,
    method: 'GET',
    data: this.params
  }).then((d) => {
    const data = d.data || {}
    this.refreshTableData(data)
  })
  this.loading.close()
}
export function refreshTableData(data) {
  this.isShow = false
  if (!data) {
    return
  }
  this.detailRule = data.schemaBlock || {}
  this.totalNum = data.staffs.length
  this.tableData = data.staffs
  this.indexTotal = data.menus.length
  this.targetType = this.fd.data.classify(data.menus, 'menuType')
  this.allStatus = data.allStatus || []
  this.withDrawIndexs = data.withDrawIndexs || []
  this.params.blockId = data.schemaBlock.blockId
  this.$nextTick(() => {
    const defaultTree = [ // 设置固定列
      {
        menuId: 'staffName',
        menuName: '姓名',
        field: 'staffName'
      }]
    this.dataTree = this.fd.data.changeToTree(data.menus, 'menuId', 'pid')
    this.tree = defaultTree.concat(this.dataTree)
    this.isShow = true
  })
  this.tableData.forEach((item, index) => {
    item.indexes.forEach((items, index) => {
      if (items.gearName) {
        this.isactive.push({
          flowNodeActionId: items.flowNodeActionId,
          gearName: items.gearName,
          status: items.status
        })
        this.gearChooseArr.push({
          id: items.flowNodeActionId,
          schemaFlowNodeId: items.schemaFlowNodeId,
          collectionId: items.collectionId,
          gearName: items.gearName,
          gearId: items.gearId
        })
      }
      if (items.gears && items.gears !== []) {
        this.gearNum.push('1')
      }
    })
  })
  this.loading.close()
}
// 保存草稿
export function saveDraft() {
  if (this.allStatus === 'completed') {
    return
  } else {
    this.typeName = 'save'
    if (this.gearChooseArr.length === 0) {
      this.$message.error('暂无可保存草稿的记录')
      return
    }
    this.getTragetData(this.typeName)
  }
}
// 保存提交
export function saveSubmit() {
  this.typeName = 'submit'
  if (this.gearChooseArr.length !== this.gearNum.length) {
    this.$message.error('请填报所有档位')
    return
  }
  this.getTragetData(this.typeName)
}
export function getTragetData(type) {
  const msg = type === 'submit' ? '提交成功' : '草稿保存成功'
  this.fd.req({
    url: 'api/evaluations/democratic/current-user/' + type,
    method: 'put',
    data: this.gearChooseArr
  }).then((d) => {
    this.$message({
      type: 'success',
      message: msg
    })
    this.edit = false
    const obj = {
      isFill: true,
      isWithdraw: true,
      resource: 'report'
    }
    if (type === 'submit') {
      // 提交成功后，原先存储在localstorage中的isFill是置成false的，表示这个表格不可以编辑（填报）
      obj.isFill = false
      this.isWithdraw = false
      this.isFill = false
    } else {
      // 保存草稿成功后，原先存储在localstorage中的isFill是置成true的，表示这个表格还可以编辑（填报）
      obj.isFill = true
      this.isWithdraw = true
      this.isFill = true
    }
    localStorage.setItem('obj', JSON.stringify(obj))
    this.getRuleDetailById()
    this.gearChooseArr = []
  })
}
export function inputTableDetail() {
  const html = document.getElementById('tableDetail').outerHTML
  this.fd.tools.downloadByHtml({ divContent: html, fileName: this.fileName, type: 'complex' }, 'api/html/download', 'post')
}
export function onProgress() {
  const options = {
    lock: true,
    text: '文件正在导入读取数据中,请稍后......'
  }
  this.loading = this.$loading(options)
}
export function chooseGear(val, row) {
  if (!this.edit) {
    return
  }
  // 不能选自己
  // if (row.gearId === val.id) {
  //   return
  // } else {
  //   row.gearId = val.id
  // }
  // 同一档位库下保留1个档位
  this.gearChooseArr.forEach((item, index) => {
    if (item.id === row.flowNodeActionId) {
      this.gearChooseArr.splice(index, 1)
    }
  })
  const data = {
    id: row.flowNodeActionId,
    schemaFlowNodeId: row.schemaFlowNodeId,
    collectionId: row.collectionId,
    gearId: val.id,
    gearName: val.gearName
  }
  this.gearChooseArr.push(data)
  this.$emit('showbox', this.gearChooseArr)
}
export function withdrawAll(val) {
  this.fd.req({
    url: 'api/evaluations/democratic/current-user/withdraw/all?schemaId=' + this.params.schemaId + '&blockId=' + this.params.blockId + '&schemaBlockType=' + this.params.schemaBlockType,
    method: 'PUT'
  }).then((d) => {
    this.$message({
      type: 'success',
      message: '撤回成功，可重新选择并提交'
    })
    this.edit = true
    this.isFill = true
    const obj = {
      isFill: true,
      page: 'edit'
    }
    localStorage.setItem('obj', JSON.stringify(obj))
    this.getRuleDetailById()
  })
}
export function resetAll(val) {
  this.getRuleDetailById()
}
// 点击填报按钮
export function fillTable() {
  this.obj.page = 'edit'
  this.edit = true
}
