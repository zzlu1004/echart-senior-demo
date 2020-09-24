/**
 * 打开新增对话框
 */
export function showAddTrialTeam() {
  if (this.hasActive) {
    this.$message({
      type: 'warning',
      message: '方案生效期间不支持任何操作。'
    })
    return
  }
  this.dialogVisible = true
  this.$nextTick(() => {
    this.resetForm('trialTeamItem')
    this.trialTeamItem = {
      name: null,
      id: null,
      judges: [],
      assistants: [],
      clerks: [],
      departs: [],
      leaders: [],
      principals: [],
      caseScope: null
    }
  })
  this.modelTitle = '新增审判团队'
}

/**
 * 打开编辑对话框
 */
export function showEditTrialTeam(row) {
  if (this.hasActive) {
    this.$message({
      type: 'warning',
      message: '方案生效期间不支持任何操作。'
    })
    return
  }
  this.dialogVisible = true
  this.$nextTick(() => {
    this.resetForm('trialTeamItem')
    this.trialTeamItem = {
      name: row.name,
      id: row.id,
      judges: row.judges,
      assistants: row.assistants,
      clerks: row.clerks,
      departs: row.departs,
      leaders: row.leaders,
      principals: row.principals,
      caseScope: row.caseScope
    }
    this.modelTitle = this.trialTeamItem.id ? '编辑审判团队' : '新增审判团队'
  })
}
/**
 * 编辑审判团队
 */
export function saveTrialTeam() {
  if (this.hasActive) {
    this.$message({
      type: 'warning',
      message: '方案生效期间不支持任何操作。'
    })
    return
  }
  this.$refs['trialTeamItem'].validate((valid) => {
    if (valid) {
      let type = 'post'
      let typeName = '新增'
      if (this.trialTeamItem.id) {
        type = 'put'
        typeName = '编辑'
      }
      this.fd.req({
        method: type,
        url: 'api/trial-teams',
        data: this.trialTeamItem
      }).then(res => {
        if (res && res.code === 200) {
          this.dialogVisible = false
          this.$message.success(typeName + '成功')
          this.getTrialTeams()
        } else {
          this.$message.error(res.msg)
        }
      })
    } else {
      return false
    }
  })
}

/**
 * 删除审判团队
 */
export function deleteTrialTeam(row) {
  if (this.hasActive) {
    this.$message({
      type: 'warning',
      message: '方案生效期间不支持任何操作。'
    })
    return
  }
  this.$confirm('确认删除《' + row.name + '》审判团队信息吗?', '刪除审判团队', {
    type: 'warning'
  }).then(() => {
    this.fd.req({
      url: 'api/trial-teams/' + row.id,
      method: 'delete'
    }).then((d) => {
      this.getTrialTeams()
      this.$message({
        type: 'success',
        message: '删除成功'
      })
    })
  }).catch(() => {})
}

/**
 * 关键字查询
 */
export function searchByKeyword(val) {
  if (this.teamType === 'case') {
    this.trialCaseTeam.offset = 0
    this.trialCaseTeam.keyword = val
    this.getTrialCaseTeam()
  } else if (this.teamType === 'team') {
    this.trialTeam.offset = 0
    this.trialTeam.keyword = val
    this.getTrialTeams()
  }
}

/**
 * 获取综合及业务部门下参与考核且未删除人员
 */
export function getAccessBizStaffs() {
  this.fd.req({
    method: 'get',
    url: 'api/trial-teams/staffs'
  }).then(res => {
    this.staffData = res.data
  })
}

/**
 * 查询审判团队
 */
export function getTrialTeams() {
  this.teamLoading = true
  this.fd.req({
    method: 'get',
    url: 'api/trial-teams',
    data: {
      offset: this.trialTeam.offset,
      limit: this.trialTeam.limit,
      keyword: this.trialTeam.keyword
    }
  }).then(res => {
    this.teamOpt.data = res.data.data || []
    this.trialTeam.total = res.data.total
    this.teamLoading = false
  })
}

/**
 * 查询统计审判组织（案件）
 */
export function getTrialCaseTeam() {
  this.caseLoading = true
  this.fd.req({
    method: 'get',
    url: 'api/trial-teams/cases',
    data: {
      offset: this.trialCaseTeam.offset,
      limit: this.trialCaseTeam.limit,
      startTime: this.trialCaseTeam.startTime,
      endTime: this.trialCaseTeam.endTime,
      keyword: this.trialCaseTeam.keyword,
      orderField: this.trialCaseTeam.orderField,
      orderType: this.trialCaseTeam.orderType
    }
  }).then(res => {
    const data = res.data.data || []
    this.caseTeamOpt.data = data
    this.trialCaseTeam.total = res.data.total || 0
    this.caseLoading = false
  })
}

export function currentChange(page) {
  if (this.teamType === 'case') {
    this.trialCaseTeam.offset = (page - 1) * this.trialCaseTeam.limit
    this.getTrialCaseTeam()
  } else if (this.teamType === 'team') {
    this.trialTeam.offset = (page - 1) * this.trialTeam.limit
    this.getTrialTeams()
  }
}

export function sizeChange(limit) {
  if (this.teamType === 'case') {
    this.trialCaseTeam.offset = 0
    this.trialCaseTeam.limit = limit
    this.getTrialCaseTeam()
  } else if (this.teamType === 'team') {
    this.trialTeam.offset = 0
    this.trialTeam.limit = limit
    this.getTrialTeams()
  }
}

export function radioChangeCase() {
  if (this.teamType === 'case') {
    this.getTrialCaseTeam()
  } else if (this.teamType === 'team') {
    this.getTrialTeams()
  }
}

export function toLocaleDate(time) {
  function addZero(num) {
    if (num < 10) {
      return '0' + num
    } else {
      return num
    }
  }
  // 按自定义拼接格式返回
  return time.getFullYear() + '-' + addZero(time.getMonth() + 1)
}
export function toStartDate(time) {
  return time.getFullYear() + '-01'
}

export function sortByNum(column) {
  this.trialCaseTeam.orderField = column.prop
  this.trialCaseTeam.orderType = column.order
  this.getTrialCaseTeam()
}

export function gotoCaseCountPegging(row, column, cell, event) {
  if (!this.elements.casePeg) {
    return
  }
  if (column.property === 'caseCount') {
    const selfMsg = { departName: row.departNames, judgeNames: row.judgeNames, assistantNames: row.assistantNames, clerkNames: row.clerkNames, index: column.label, label: column.label, value: row[column.property] }
    const obj = {
      params: {
        groupId: row.groupId,
        startTime: this.trialCaseTeam.startTime,
        endTime: this.trialCaseTeam.endTime
      },
      selfMsg: selfMsg
    }
    localStorage.setItem('params', JSON.stringify(obj))
    this.fd.tools.goDetail.call(this, 'trialTeamPeg', { query: { id: row.groupId, type: this.type }})
  }
}
