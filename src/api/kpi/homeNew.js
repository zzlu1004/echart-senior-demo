
// import { thousands } from '../../utils/filters'
// 获取首页登录人员-部门，人员类型
export function getBasicInfo() {
  this.fd.req({
    url: 'api/staff/' + this.userId + '/info',
    method: 'get'
  }).then((d) => {
    const data = d.data || {}
    this.userInfo = data
  })
}
// 获取在线考核数量
export function getTotalMsg() {
  this.fd.req({
    type: 'get',
    url: 'api/home/todo/stats'
  }).then(response => {
    this.todoOnline = response.data
  }).catch(error => {
    console.log('getTotalMsg', error)
  })
}
// 获取未读消息通知
export function getUnreadNotice() {
  this.fd.req({
    type: 'get',
    url: 'api/notices/bulletins/unread/stats',
    data: {
      projectCode: 'kpi'
    }
  }, 'basic_url').then(response => {
    this.todoNotice = response.data
  }).catch(error => {
    console.log('getUnreadNotice', error)
  })
}
// 获取消息通知列表
export function getNotice() {
  this.fd.req({
    type: 'get',
    url: 'api/notices/bulletins',
    data: {
      keyword: '',
      limit: 10,
      offset: 0,
      type: 'bulletin',
      projectCode: 'kpi'
    }
  }, 'basic_url').then(response => {
    const Data = response.data || {}
    const data = Data.data || []
    let index = 0
    for (const item of data) {
      item.index = index + 0
      index++
    }
    this.notices = data
  }).catch(error => {
    console.log('getNotice', error)
  })
}
// 查看通知公告详情
export function seeNoticeDetail(row) {
  // this.fd.tools.goDetail.call(this, 'noticeDetail', { query: { id: row.id, index: row.index }})
  this.$router.push({ name: 'notice-noticeDetail', query: { id: row.id, index: row.index, type: 'all' }})
}
export function goPage(name) {
  this.$router.push({ name: name })
}
export function selectProject(index) {
  this.active = index
  this.refreshProject(index)
}
export function getDisabled(id) {
  // 方案信息模块 是否 有激活可看见的方案
  const hasProject = (this.projectStatus.nonStart || this.projectStatus.active ||
    this.projectStatus.finished || this.projectStatus.publiced)
  // 有激活可看见的方案，此时的未开始不可点击
  if (hasProject) {
    if (id === 'nonStart') {
      return true
    }
    // 无激活可看见的方案，此时的未开始可点击，默认就是未开始
  } else {
    if (id === 'nonStart') {
      return false
    }
  }
  // 当前状态下无方案，页签不可点击
  if (!this.projectStatus[id]) {
    return true
    // 当前状态下有方案，页签可点击
  } else {
    return false
  }
}
// 获取方案信息
export function refreshProject(index) {
  const schema = this.projectStatus[index + 'Schemas'] || []
  this.currentProject = schema.length ? schema[this[index + 'Index']] : {}
  if (index === 'nonStart') {
    return
  } else if (index === 'active') {
    // 格式化我的考核进度占比
    // 填报（我的）进度
    this.currentProject.myFillProgress = (this.currentProject.myFillComplete / this.currentProject.myFillTotal) ? (this.currentProject.myFillComplete / this.currentProject.myFillTotal) * 100 : 0
    // 填报（其他）进度
    this.currentProject.otherFillProgress = (this.currentProject.otherFillComplete / this.currentProject.otherFillTotal) ? (this.currentProject.otherFillComplete / this.currentProject.otherFillTotal) * 100 : 0
    // 审核（我的）进度
    this.currentProject.approvalProgress = (this.currentProject.approvalComplete / this.currentProject.approvalTotal) ? (this.currentProject.approvalComplete / this.currentProject.approvalTotal) * 100 : 0
    // 已完成进度
    this.currentProject.totalProgress = (this.currentProject.myFillComplete + this.currentProject.otherFillComplete + this.currentProject.approvalComplete) /
    (this.currentProject.myFillTotal + this.currentProject.otherFillTotal + this.currentProject.approvalTotal) ? Math.floor((this.currentProject.myFillComplete + this.currentProject.otherFillComplete + this.currentProject.approvalComplete) /
    (this.currentProject.myFillTotal + this.currentProject.otherFillTotal + this.currentProject.approvalTotal) * 100) : 0
  } else if (index === 'publiced') {
    this.refreshPublicedInfo()
  }
  this.prevDisabled = this[index + 'Index'] === 0
  this.nextDisabled = this[index + 'Index'] === schema.length - 1
}
// 上一个方案
export function prevProject(status) {
  // 点击上一个，下一个按钮要去除禁用
  this.nextDisabled = false
  // 禁用事件阻止
  if (this.prevDisabled) {
    return
  }
  const projectArr = this.projectStatus[status + 'Schemas'] || []
  this[this.active + 'Index']--
  this.currentProject = projectArr[this[this.active + 'Index']]
  // 在点击完之后如果index=0,立马禁用按钮，必须放在index-- 之后
  this.refreshProject(this.active)
  if (!this[this.active + 'Index']) {
    this.prevDisabled = true
    return
  }
}
// 下一个方案
export function nextProject(status) {
  this.prevDisabled = false
  if (this.nextDisabled) {
    return
  }
  const projectArr = this.projectStatus[status + 'Schemas'] || []
  this[this.active + 'Index']++
  this.currentProject = projectArr[this[this.active + 'Index']]
  this.refreshProject(this.active)
  if (this[this.active + 'Index'] === projectArr.length - 1) {
    this.nextDisabled = true
    return
  }
}
// 刷新结果公示中的方案
export function refreshPublicedInfo() {
  this.levelOption.data = []
  this.levelOpt.data = []
  this.scoreOpt.data = {}
  // 结果公示中方案
  const chartData = this.currentProject.grades || []
  const tableData = (this.currentProject.grades || []).concat([])
  if (chartData.length) {
    this.levelOpt.opt.title.text = ['{a|我的档位}', '{b|' + (this.currentProject.gradeName || '--') + '}{b| 档}'].join('\n')
  }
  this.$nextTick(() => {
    if (this.levelOpt.chart) {
      this.levelOpt.chart.resize()
    }
  })
  this.$nextTick(() => {
    if (this.scoreOpt.chart) {
      this.scoreOpt.chart.resize()
    }
  })
  // 遍历后添加颜色
  const colors = this.fd.echart.getColors('pie')
  tableData.forEach((item, i) => {
    this.$set(item, 'color', colors[i])
  })
  this.$nextTick(() => {
    this.levelOption.data = tableData
    this.levelOpt.data = chartData
    this.scoreOpt.opt.min = (this.currentProject.minScore ? this.currentProject.minScore : 0)
    this.scoreOpt.opt.max = (this.currentProject.maxScore ? this.currentProject.maxScore : 100)
    this.scoreOpt.data = {
      name: '我的分数',
      value: this.currentProject.myScore === null ? '--' : this.currentProject.myScore
    }
  })
}
// 获取方案信息状态
export function getProjectInfo() {
  this.fd.req({
    type: 'get',
    url: 'api/home/v2/schemas'
  }).then(response => {
    this.projectStatus = response.data
    this.$emit('refreshProjectLevel', this.projectStatus.active, this.projectStatus.publiced)
    if (this.projectStatus.active) {
      this.active = 'active'
    } else if (this.projectStatus.publiced) {
      this.active = 'publiced'
    } else if (this.projectStatus.finished) {
      this.active = 'finished'
    } else {
      this.active = 'nonStart'
    }
    this.refreshProject(this.active)
  }).catch(error => {
    console.log('getProjectInfo', error)
  })
}
// 判断方案是否有进行中和公示中的方案，有的话 方案信息模块就在业绩趋势和工作概览之上，否则在最下方
export function refreshProjectLevel(activeCnt, publicedCnt) {
  this.hasActiveProject = (activeCnt || publicedCnt)
}
// 获取成长档案
export function getGrowRecord() {
  this.fd.req({
    type: 'get',
    url: 'api/home/growth-file'
  }).then(response => {
    const data = response.data || []
    data.forEach((item) => {
      this.$set(this.growObj, item.id, item.count) // 深度监听对象值变化，作业面及时渲染
    })
  }).catch(error => {
    console.log('getGrowRecord', error)
  })
}
// 获取业绩趋势（员额法官，法官助理，书记员，司法行政人员）
export function getPerformanceTrend() {
  const typeObj = {
    'judge': 'JUDGE',
    'assistant': 'ASSISTANT',
    'clerk': 'CLERK',
    'other': 'ADMINISTRATOR'
  }
  this.fd.req({
    url: 'api/home/performances/' + typeObj[this.type],
    method: 'get'
  }).then((d) => {
    const data = d.data || {}
    this[this.type + 'Obj'] = data
    this[this.type + 'TrendOpt'].data = data.chartData || []
  })
}
// 获取工作概览（员额法官，法官助理，书记员）
export function getWorkList() {
  const typeObj = {
    'judge': 'JUDGE',
    'assistant': 'ASSISTANT',
    'clerk': 'CLERK',
    'other': 'ADMINISTRATOR'
  }
  this.fd.req({
    url: 'api/home/work-overview/' + typeObj[this.type],
    method: 'get'
  }).then((d) => {
    const data = d.data || {}
    const tableData = data.chartData || []
    const chartData = (data.chartData || []).concat([])
    const colors = this.fd.echart.getColors('pie')
    tableData.forEach((item, i) => {
      this.$set(item, 'color', colors[i])
    })
    // if (chartData.length && this[this.type + 'CaseRateOpt']) {
    //   this.$nextTick(() => {
    //     this[this.type + 'CaseRateOpt'].opt.title.text = ['{a|总量}', '{b|' + thousands(data.total) + '}{a| 件}'].join('\n')
    //   })
    // }
    this[this.type + 'CaseRateObj'] = data
    this[this.type + 'CaseRateOption'].data = tableData || []
    this[this.type + 'CaseRateOpt'].data = chartData || []
  })
}
// 获取工作类型旭日图数据（司法行政人员）
export function getWorkListOther() {
  const typeObj = {
    'judge': 'JUDGE',
    'assistant': 'ASSISTANT',
    'clerk': 'CLERK',
    'other': 'ADMINISTRATOR'
  }
  this.fd.req({
    url: 'api/home/work-overview/' + typeObj[this.type],
    method: 'get'
  }).then((d) => {
    const data = d.data || {}
    const chartData = data.chartData || []
    // 遍历后添加颜色
    const colors = this.fd.echart.getColors('sunburst')
    const sunData = []
    chartData.forEach((item, i) => {
      item.value = parseFloat(item.value)
      if (!item.pid) {
        sunData.push(item)
      }
    })
    // 办文办公汇总数据只有2条，但是加上小分类实际上有10多条，所以需要遍历表格data来加上对应的颜色
    sunData.forEach((item, i) => {
      this.$set(item, 'color', colors[i])
    })
    const treeData = this.fd.data.changeToTree(chartData, 'id', 'pid')
    // 外层增加透明度
    for (const item of treeData) {
      addOpacity(item, 0.4)
    }
    this.workTypeOpt.data = treeData
    this.workTypeOption.data = sunData
  })
  // 添加透明度(递归)
  function addOpacity(item, opacity) {
    if (item.children) {
      for (const itemChild of item.children) {
        itemChild.itemStyle = { opacity: opacity }
        addOpacity(item.children, opacity)
      }
    }
  }
}
export function getCaseTime() {
  this.fd.req({
    type: 'get',
    url: 'api/home/case/updata/time'
  }).then(response => {
    const data = response.data || []
    this.caseTime = data
  }).catch(error => {
    console.log('getCaseTime', error)
  })
}
