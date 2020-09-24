import { isNumber } from '@/utils/validate'
// 页面刚进来query带入了一个id，不需要重新从人员列表中获取staffId
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
    this.isfirst = schema.complete < schema.total
    // 点击上一个，下一个，需要重新从人员列表中获取staffId
    this.getTargetByUrlId()
  })
}
// 通过id 获取方案信息 以及 表格中待填报的数据
export function getTargetByUrlId() {
  let paramsData = {}
  let url = ''
  // 其他考核--待填报的接口
  if (this.resource === 'other') {
    paramsData = {
      blockId: this.params.blockId || '',
      schemaId: this.params.schemaId || '',
      schemaBlockType: this.params.schemaBlockType || '',
      type: 'fill'
    }
    url = 'api/assessments/users/' + this.staffId
  } else {
    // 我的考核--待填报的接口
    paramsData = this.fd.tools.merge(true, {}, { type: 'fill' }, this.params)
    url = 'api/evaluations/current-user/details'
  }
  this.getTargetById(url, paramsData)
}
export function getTargetById(url, paramsData) {
  const options = {
    lock: true,
    text: '数据正在加载中',
    target: document.querySelector('#report-table')
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
      if (item.fillScore === 0) {
        item.fillScore = item.fillScore + ''
      }
      if (item.fillRevocable) {
        this.revocationId.push(item.fillNodeId)
      }
      item.red = false
    }
    this.indexData = data.indexes || []
    // 同一为了解决了删除dialog输入框中的值同时删除表格中内容的问题，前端新增contentDetail字段进行有无材料说明图标的判断
    this.indexData.forEach((item, i) => {
      item.fillNodeActions.forEach((items, i) => {
        items.contentDetail = items.content
      })
    })
  })
}
// 待填报列表中查看详情
export function seeRegularDetail(row, resource) {
  this.fd.tools.goDetail.call(this, 'checkDetail', { query: { id: row.schemaFlowId, resource: resource }})
}
// 校验填报+审核分数值
export function checkFillScore(item) {
  if ((!isNumber(item.fillScore) && item.fillScore) || item.valueMax < parseFloat(item.fillScore) || item.valueMin > parseFloat(item.fillScore)) {
    item.red = true
    this.isRed = true
  } else {
    item.red = false
    this.isRed = false
  }
}
export function refreshData(data) {
  // 撤回成功后，原先存储在localstorage中的isFill是置成true的，表示这个表格还可以编辑（填报）
  if (data === '撤回') {
    const obj = {
      isFill: true,
      type: this.obj.type,
      resource: this.obj.resource,
      checkType: this.obj.checkType,
      page: 'detail'
    }
    localStorage.setItem('obj', JSON.stringify(obj))
    this.isfirst = true
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
export function getUnfillIndexCnt(targetsMsg) {
  let count = 0
  for (const key in targetsMsg) {
    if (!targetsMsg[key].schemaFlowId) {
      continue
    }
    if (targetsMsg[key].red) {
      return
    }
    if (targetsMsg[key].fillEditable) {
      // 只要fillScore为null即为false，count累加1
      if (!this.fd.data.boolean((targetsMsg[key].fillScore))) {
        count++
      }
    }
  }
  // 存在没有填报的指标，默认补充为最小值
  if (count) {
    this.$confirm('存在' + count + '个没有填报的指标值，系统将默认为指标的最小值，是否确认提交指标值?', '提交指标', {
      type: 'info',
      cancelButtonText: '取消',
      distinguishCancelAndClose: true
    }).then(() => {
      this.typeName = 'submit'
      // 取反获取指标体系中最终所有的指标配置
      this.getTargetMsg = !this.getTargetMsg
    }).catch(action => {
      if (action === 'cancel') {
        // this.typeName = 'draft'
        // 取反获取指标体系中最终所有的指标配置
        // this.getTargetMsg = !this.getTargetMsg
      }
    })
  // 所有指标都已填报完毕，触发确认提交的提示语
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
    const fillScore = (this.typeName === 'submit') ? (targetsMsg[key].fillScore || targetsMsg[key].valueMin) : targetsMsg[key].fillScore
    if (!targetsMsg[key].schemaFlowId) {
      continue
    }
    if (targetsMsg[key].red) {
      return
    }
    if (targetsMsg[key].fillEditable) {
      data.push({
        schemaFlowId: targetsMsg[key].schemaFlowId,
        nextNodeId: targetsMsg[key].fillNodeId,
        staffId: this.detailRule.staffId,
        staffName: this.detailRule.staffName,
        indexId: targetsMsg[key].menuId,
        indexName: targetsMsg[key].indexName,
        indexSort: targetsMsg[key].indexSort,
        attachmentOwnerId: targetsMsg[key].attachmentOwnerId,
        uploadZero: targetsMsg[key].uploadZero,
        uploadNonzero: targetsMsg[key].uploadNonzero,
        fillNodeActionId: targetsMsg[key].fillNodeActionId,
        score: fillScore
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
    url: 'api/evaluations/current-user/' + this.typeName + '?actionType=fill',
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
        isFill: true,
        type: this.obj.type,
        resource: this.obj.resource,
        checkType: this.obj.checkType,
        page: this.obj.page
      }
      if (this.typeName === 'submit') {
        // 提交成功后，原先存储在localstorage中的isFill是置成false的，表示这个表格不可以编辑（填报）
        obj.isFill = false
        obj.page = 'detail' // 提交成功后，点击查看 返回填报列表页不应该是编辑页面，应该是查看页面
        this.isfirst = false
      } else {
        // 保存草稿成功后，原先存储在localstorage中的isFill是置成true的，表示这个表格还可以编辑（填报）
        obj.isFill = true
        obj.page = 'detail' // 提交成功后，点击查看 返回填报列表页不应该是编辑页面，应该是查看页面
        this.isfirst = true
      }
      localStorage.setItem('obj', JSON.stringify(obj))
      this.getTargetByUrlId()
    }
  }).catch(error => {
    if (error.response.data.data) {
      this.visible = true
      const data = error.response.data.data
      this.errorMsg = data
    }
  })
}
// 点击填报按钮
export function fillTable() {
  this.obj.page = 'edit'
  this.edit = true
}
// 回退
export function goback() {
  this.$router.push({ name: this.resource === 'other' ? 'otherCheck' : 'myCheck' })
}
export function getRedDanger(isRed) {
  // 输入框有非法值或者是超出范围值的红色提醒
  if (isRed) {
    return
  } else {
    // 触发是否还有未填报的指标函数emit
    this.unfill = !this.unfill
  }
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
  const files = []
  const fillNodeActions = []
  for (const it of row.fillNodeActions) {
    // 当前处理人的id === 节点中某个id，表示这个人可以操作附件材料，编辑的时候只有当前人的信息 其他人都没有
    if (it && (it.id === row.fillNodeActionId)) {
      if (it.attachments) {
        for (const info of it.attachments) {
          files.push({
            id: info.id,
            name: info.attachmentName
          })
        }
      }
      fillNodeActions.push(it)
      // 正常情况一个人只会参与一个填报节点，但是多填报情况下灰出现一个人填报多个节点的情况，只显示 一个即可，直接跳出循环
      break
    }
  }
  this.attachForm = {
    staffName: this.staffName || '',
    menuName: row.menuName || '',
    isAddAttach: false,
    myAttachments: files,
    fillNodeActionId: row.fillNodeActionId, // 用来判断当前登录人 是不是 多人填报当中的一个人，显示 上传按钮
    fillNodeActions: fillNodeActions,
    firstName: row.firstName
  }
}
// 增加附件--补充材料
export function addAttachment(row) {
  this.currentItem = row
  this.visible = true
  this.modelTitle = '补充材料'
  const files = []
  const fillNodeActions = []
  for (const it of row.fillNodeActions) {
    // 当前处理人的id === 节点中某个id，表示这个人可以操作附件材料，编辑的时候只有当前人的信息 其他人都没有
    if (it.id === row.fillNodeActionId) {
      if (it && it.attachments) {
        for (const info of it.attachments) {
          files.push({
            id: info.id,
            name: info.attachmentName
          })
        }
      }
      fillNodeActions.push(it)
      // 正常情况一个人只会参与一个填报节点，但是多填报情况下灰出现一个人填报多个节点的情况，只显示 一个即可，直接跳出循环
      break
    }
  }
  // 同一为了解决了删除dialog输入框中的值同时删除表格中内容的问题，前端新增contentDetail字段进行有无材料说明图标的判断
  fillNodeActions.forEach((items, i) => {
    items.content = items.contentDetail
  })
  this.attachForm = {
    staffName: this.staffName || '',
    menuName: row.menuName || '',
    isAddAttach: false,
    myAttachments: files,
    fillNodeActionId: row.fillNodeActionId, // 用来判断当前登录人 是不是 多人填报当中的一个人，显示 上传按钮
    fillNodeActions: fillNodeActions,
    firstName: row.firstName
  }
  this.action = process.env.BASE_API + window.config.zuul_url + window.config.basic_url + 'api/attachments/owners/' + this.currentItem.attachmentOwnerId +
    '?Authorization=' + this.$store.getters.token
}
export function sureAddAttach() {
  this.$refs.attachForm.validate((valid) => {
    if (valid) {
      let content = ''
      if (this.attachForm.fillNodeActions.length === 0) {
        content = this.fillNodeActionsContent
      } else {
        for (const it of this.attachForm.fillNodeActions) {
          if (it.id === this.attachForm.fillNodeActionId) {
            content = it.content
          }
        }
      }
      this.fd.req({
        url: 'api/evaluations/current-user/' + this.currentItem.fillNodeActionId + '/content',
        method: 'put',
        data: { content: content }
      }).then((d) => {
        this.visible = false
        // 文件上传
        this.action = process.env.BASE_API + window.config.zuul_url + window.config.basic_url + 'api/attachments/owners/' + this.currentItem.attachmentOwnerId +
          '?Authorization=' + this.$store.getters.token
        this.$refs.upload.active = true
        if (!this.attachForm.isAddAttach) {
          this.$emit('refreshAttach', this.currentItem.menuId, this.targetsMsg)
        }
      })
    } else {
      return false
    }
  })
}
export function addAttachBtn() {
  document.getElementById('file').click()
  this.attachForm.isAddAttach = true
}
// 撤回指标
export function recallTarget(row) {
  this.$confirm('撤回后该指标需要重新填报提交，请问确定撤回《' + row.menuName + '》指标吗?', '撤回指标', {
    type: 'warning'
  }).then(() => {
    this.fd.req({
      url: 'api/evaluations/current-user/flows/' + row.fillNodeId + '/withdraw',
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
  this.$confirm('全部撤回后所有可撤回的指标需要重新填报提交,请问确定撤回全部的指标吗?', '全部撤回', {
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
  window.location.href = process.env.BASE_API + '/zuul/basic/api/attachments/' + fileObj.id + '?Authorization=' + this.$store.getters.token
}
export function handleRemove(file, fileList) {
  this.fd.req({
    url: 'api/attachments/' + file.id,
    method: 'delete'
  }, 'basic_url').then(() => {
    this.$refs.upload.remove(file)
    this.$nextTick(() => {
      this.$emit('refreshAttach', this.currentItem.menuId, this.targetsMsg)
    })
  })
}
export function handleSuccess(response, file, fileList) {
  this.$emit('refreshAttach', this.currentItem.menuId, this.targetsMsg)
}
// 上传附件只走局部刷新
export function refreshAttach(id, targetsMsg) {
  let paramsData = {}
  let url = ''
  // 其他考核--待填报的接口
  if (this.resource === 'other') {
    paramsData = {
      blockId: this.$route.query.blockId || '',
      schemaId: this.$route.query.schemaId || '',
      schemaBlockType: this.$route.query.schemaBlockType || '',
      type: 'fill'
    }
    this.staffId = this.$route.query.staffId
    url = 'api/assessments/users/' + this.staffId
  } else {
    // 我的考核--待填报的接口
    paramsData = this.fd.tools.merge(true, {}, { type: 'fill' }, this.params)
    url = 'api/evaluations/current-user/details'
  }
  this.fd.req({
    url: url,
    method: 'GET',
    data: paramsData
  }).then((d) => {
    const data = d.data || {}
    for (const item of data.indexes) {
      if (item.indexId === id) {
        // 同一为了解决了删除dialog输入框中的值同时删除表格中内容的问题，前端新增contentDetail字段进行有无材料说明图标的判断
        item.fillNodeActions.forEach((items, i) => {
          items.contentDetail = items.content
        })
        targetsMsg[id].fillNodeActions = item.fillNodeActions
        targetsMsg[id].attachmentCount = item.attachmentCount
      }
    }
  })
}
export function handlePreview(file) {
}
export function handleExceed(files, fileList) {
  this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
}
export function beforeRemove(file, fileList) {
  return this.$confirm(`确定移除 ${file.name}？`)
}
export function inputFilter(newFile, oldFile, prevent) {
  if (!newFile) {
    return
  }
  if (!/\.(rar|zip|doc|docx|pdf|jpg|png|xlsx|xls)$/i.test(newFile.name)) {
    this.$message.error('上传附件的格式暂不支持!')
    return prevent()
  }
  const isLt10M = newFile.size / 1024 / 1024 < 10
  if (!isLt10M) {
    this.$message.error('上传附件大小不能超过 10MB!')
    return prevent()
  }
}
export function inputFile(newFile, oldFile) {
  if (newFile && newFile.success) {
    this.$emit('refreshAttach', this.currentItem.menuId, this.targetsMsg)
  }
}
export function beforeAvatarUpload(file) {
  // rar、zip、doc、docx、pdf、jpg、png、xlsx、xls
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
