import { isNumber } from '@/utils/validate'
export function getPeopleListToTab() {
  this.fd.req({
    url: 'api/assessments/users',
    method: 'GET',
    data: this.peopleParams
  }).then((d) => {
    const data = d.data || {}
    this.total = data.total || 0
    this.show1 = this.peopleParams.offset > 0
    this.show2 = this.peopleParams.offset < (this.total - this.peopleParams.limit)
  })
}
// 获取上一个下一个记录的列表
export function getPeopleList() {
  this.fd.req({
    url: 'api/assessments/users',
    method: 'GET',
    data: this.peopleParams
  }).then((d) => {
    const data = d.data || {}
    const schema = data.data.length ? data.data[0] : {}
    this.total = data.total || 0
    this.show1 = this.peopleParams.offset > 0
    this.show2 = this.peopleParams.offset < (this.total - this.peopleParams.limit)
    this.staffId = schema.staffId
    this.params.blockId = schema.blockId
    this.params.schemaId = schema.schemaId
    this.params.schemaBlockType = schema.schemaBlockType
    this.isnext = schema.complete < schema.total
    // 点击上一个，下一个，需要重新从人员列表中获取staffId
    this.getTargetByUrlId()
  })
}
export function getTargetByUrlId() {
  const paramsData = {
    blockId: this.params.blockId || '',
    schemaId: this.params.schemaId || '',
    schemaBlockType: this.params.schemaBlockType || '',
    type: 'approve'
  }
  const url = 'api/assessments/users/' + this.staffId
  this.getTargetById(url, paramsData)
}
export function getTargetById(url, paramsData) {
  const options = {
    lock: true,
    text: '数据正在加载中',
    target: document.querySelector('#check-table')
  }
  this.loading = this.$loading(options)
  this.fd.req({
    url: url,
    method: 'GET',
    data: paramsData
  }).then((d) => {
    this.loading.close()
    const data = d.data || {}
    this.detailRule = data.schemaBlock || {}
    this.staffName = this.detailRule.staffName
    this.targetMenus = data.menus || []
    this.revocationId = []
    for (const item of data.indexes) {
      // 填报值
      if (item.fillScore === 0) {
        item.fillScore = item.fillScore + ''
      }
      // 草稿分
      if (item.draftScore === 0) {
        item.draftScore = item.draftScore + ''
      }
      // 草稿分
      if (item.draftScore === 0) {
        item.draftScore = item.draftScore + ''
      }
      // 前一流程的分数
      if (item.preScore === 0) {
        item.preScore = item.preScore + ''
      }
      if (item.approveRevocable) {
        this.revocationId.push(item.preNodeId)
      }
      item.approveScore = item.approveScore || item.preScore || ''
      item.red = false
    }
    this.indexData = data.indexes || []
  })
}
// 点击审核按钮
export function fillTable() {
  this.obj.page = 'edit'
  this.edit = true
}
// 查看按钮进入流程考核节点详情
export function seeRegularDetail(row, resource) {
  this.fd.tools.goDetail.call(this, 'checkDetail', { query: { id: row.schemaFlowId, resource: resource }})
}
// 校验审核分数值是否超出分数范围
export function checkApproveScore(item) {
  const value = 'approveScore'
  if ((!isNumber(item[value]) && item[value]) || item.valueMax < parseFloat(item[value]) || item.valueMin > parseFloat(item[value])) {
    item.red = true
    this.isRed = true
  } else {
    item.red = false
    this.isRed = false
  }
}
export function refreshData(data) {
  if (data === '撤回') {
    const obj = {
      isCheck: true,
      type: this.obj.type,
      resource: this.obj.resource,
      checkType: this.obj.checkType,
      page: this.obj.page
    }
    localStorage.setItem('obj', JSON.stringify(obj))
    this.isnext = true
  }
  this.getTargetByUrlId()
}
// 点击上一个按钮查看上一个人员
export function prevPeople() {
  this.peopleParams.offset--
  this.getPeopleList()
}
// 点击下一个按钮查看下一个人员
export function nextPeople() {
  this.peopleParams.offset++
  this.getPeopleList()
}
export function watchTarget() {
  // 取反获取指标体系中最终所有的指标配置
  this.getTargetMsg = !this.getTargetMsg
}
export function getRedDanger(isRed) {
  if (isRed) {
    return
  } else {
    this.$confirm('是否确定提交指标值?', '提交指标', {
      type: 'info'
    }).then(() => {
      this.typeName = 'submit'
      // 取反获取指标体系中最终所有的指标配置
      this.getTargetMsg = !this.getTargetMsg
    })
  }
}
export function getTragetData(targetsMsg, isRed) {
  if (isRed) {
    return
  }
  const data = []
  for (const key in targetsMsg) {
    if (!targetsMsg[key].schemaFlowId) {
      continue
    }
    if (targetsMsg[key].red) {
      return
    }
    if (targetsMsg[key].approveEditable) {
      if (this.typeName === 'submit' && !this.fd.data.boolean((targetsMsg[key].approveScore))) {
        this.$message.error('存在未完成审核的指标，请全部审核完成后统一提交。')
        return
      }
      data.push({
        schemaFlowId: targetsMsg[key].schemaFlowId,
        nextNodeId: targetsMsg[key].approveNodeId,
        score: targetsMsg[key].approveScore
      })
    }
  }
  if (!data.length) {
    this.$message({
      type: 'error',
      message: '当前没有可提交的指标'
    })
    return
  }
  const msg = this.typeName === 'submit' ? '提交成功' : '草稿保存成功'
  this.fd.req({
    url: 'api/evaluations/current-user/' + this.typeName + '?actionType=approve',
    method: 'put',
    data: data
  }).then((d) => {
    this.$message({
      type: 'success',
      message: msg
    })
    if (!isRed) {
      this.edit = false
      const obj = {
        isCheck: false,
        type: this.obj.type,
        resource: this.obj.resource,
        checkType: this.obj.checkType,
        page: this.obj.page
      }
      if (this.typeName === 'submit') {
        obj.isCheck = false
        this.isnext = false
      } else {
        obj.isCheck = true
        this.isnext = true
      }
      localStorage.setItem('obj', JSON.stringify(obj))
      this.getTargetByUrlId()
    }
  })
}
// 回退
export function goback() {
  this.$router.push({ name: this.resource === 'other' ? 'otherCheck' : 'myCheck' })
}
// 保存草稿
export function saveDraft() {
  this.typeName = 'save'
  // 取反获取指标体系中最终所有的指标配置
  this.getTargetMsg = !this.getTargetMsg
}
// 保存提交
export function saveSubmit() {
  this.isRedDanger = !this.isRedDanger
}
// 查看附件
export function seeAttachment(row) {
  this.visible = true
  this.modelTitle = '材料说明'
  this.attachForm = {
    staffName: this.staffName || '',
    menuName: row.menuName || '',
    isAddAttach: false,
    fillNodeActionId: row.fillNodeActionId, // 用来判断当前登录人 是不是 多人审核当中的一个人，显示 上传按钮
    fillNodeActions: row.fillNodeActions
  }
}
// 撤回指标
export function recallTarget(row) {
  this.$confirm('撤回后该指标需要重新审核提交，请问确定撤回《' + row.menuName + '》指标吗?', '撤回指标', {
    type: 'warning'
  }).then(() => {
    this.fd.req({
      url: 'api/evaluations/current-user/flows/' + row.preNodeId + '/withdraw',
      method: 'put'
    }).then((d) => {
      this.$message({
        type: 'success',
        message: '撤回成功'
      })
      this.$emit('refreshData', '撤回')
    })
  })
}
export function revocationAll() {
  this.$confirm('全部撤回后所有可撤回的指标需要重新审核提交,请问确定撤回全部的指标吗?', '全部撤回', {
    type: 'warning'
  }).then(() => {
    this.fd.req({
      url: 'api/evaluations/current-user/flows/users/withdraw',
      method: 'put',
      data: {
        schemaFlowNodeIds: this.revocationId
      }
    }).then((d) => {
      this.$message({
        type: 'success',
        message: '撤回成功'
      })
      this.refreshData('撤回')
    })
  })
}
export function downloadFile(fileObj) {
  window.location.href = process.env.BASE_API + window.config.zuul_url + window.config.basic_url + 'api/attachments/' + fileObj.id + '?Authorization=' + this.$store.getters.token
}
export function handleRemove(file, fileList) {
  this.fd.req({
    url: 'api/attachments/' + file.uid,
    method: 'delete'
  }, 'basic_url').then(() => {
    this.$emit('refreshData', fileList)
  })
}
export function handleSuccess() {
  this.$emit('refreshData', {})
}
export function handlePreview(file) {
}
export function handleExceed(files, fileList) {
  this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
}
export function beforeRemove(file, fileList) {
  return this.$confirm(`确定移除 ${file.name}？`)
}
export function beforeAvatarUpload(file) {
  // const isJPG = file.type === 'image/jpg' || file.type === 'image/jpeg' ||
  // file.type === 'image/png' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
  // file.type === 'application/pdf' || file.type === 'application/x-zip-compressed' || file.type === 'application/rar' ||
  // file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel' ||
  // file.type === 'application/msword' || /\.rar$/.test(file.name)
  const isJPG = /\.rar$/.test(file.name) || /\.zip$/.test(file.name) || /\.doc$/.test(file.name) || /\.docx$/.test(file.name) ||
    /\.pdf$/.test(file.name) || /\.jpg$/.test(file.name) || /\.png$/.test(file.name) || /\.xlsx$/.test(file.name) ||
    /\.xls$/.test(file.name)
  const isLt2M = file.size / 1024 / 1024 < 10
  if (!isJPG) {
    this.$message.error('上传附件的格式暂不支持!')
  }
  if (!isLt2M) {
    this.$message.error('上传附件大小不能超过 10MB!')
  }
  return isJPG && isLt2M
}
