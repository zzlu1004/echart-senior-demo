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
// 获取消息通知
export function getNotice() {
  this.fd.req({
    type: 'get',
    url: 'api/notices/bulletins',
    data: {
      keyword: '',
      limit: 5,
      offset: 0,
      type: 'bulletin',
      projectCode: 'kpi'
    }
  }, 'basic_url').then(response => {
    this.notices = response.data.data
  }).catch(error => {
    console.log('getNotice', error)
  })
}
// 获取已生效方案
export function getActiveSchemas() {
  this.fd.req({
    type: 'get',
    url: 'api/home/schemas'
  }).then(response => {
    this.actives = response.data
    if (this.actives.length > 0) {
      const data = this.actives[0]
      this.dateRange = [this.fd.tools.firstDayOfMonth(new Date(data.startTime)), this.fd.tools.firstDayOfMonth(new Date(data.endTime))]
      this.schemaId = data.id
    }
  }).catch(error => {
    console.log('getActiveSchemas', error)
  })
}
// 获取考核进度
export function getSchemasProgress() {
  this.fd.req({
    type: 'get',
    url: 'api/home/evaluations/schedules',
    data: {
      schemaId: this.schemaId,
      type: this.type
    }
  }).then(response => {
    this.progress = response.data
  }).catch(error => {
    console.log('getSchemasProgress', error)
  })
  // 待办事项
  this.fd.req({
    type: 'get',
    url: 'api/home/evaluations/todos',
    data: {
      schemaId: this.schemaId,
      type: this.type
    }
  }).then(response => {
    this.todos = response.data
    this.todoOption.data = this.todos
  }).catch(error => {
    console.log('getSchemasProgress', error)
  })
}
// 获取在线考核
export function getEvaluations() {
  this.fd.req({
    type: 'get',
    url: 'api/home/evaluations'
  }).then(response => {
    const data = response.data
    this.onlines = data
  }).catch(error => {
    console.log('getEvaluations', error)
  })
}
// 获取考核结果、
export function getCheckResult() {
  this.fd.req({
    type: 'get',
    url: 'api/home/result'
  }).then(response => {
    const data = response.data
    this.results = data.score || []
    this.$nextTick(() => {
      this.resultSchema = data.schema || {}
      this.levelOpt.data = data.level || []
      // 因为横坐标是一个连续值, series的data用的是二维数组，xAxis.data 不需要设置
      const score = []
      for (const item of this.results) {
        score.push([item.name, item.value])
      }
      if (this.scoreOpt.chart) {
        this.scoreOpt.chartOption.series.data = score
        this.scoreOpt.chart.setOption(this.scoreOpt.chartOption, true)
      }
    })
  }).catch(error => {
    console.log('getCheckResult', error)
  })
}
// 获取工作量案件数
export function getWorkCase() {
  this.fd.req({
    type: 'get',
    url: 'api/home/analysis',
    data: {
      weightId: this.modelId,
      ...this.timeRange
    }
  }).then(response => {
    const data = response.data || {}
    this.analyze = data.scatter
    this.$nextTick(() => {
      const d = []
      for (const item of this.analyze) {
        d.push([item.caseNum, item.workload, 1, item.name])
      }
      if (this.workOpt.chart) {
        this.workOpt.chartOption.series.data = d
        this.workOpt.chart.setOption(this.workOpt.chartOption, true)
      }
      this.dealBasic(data.caseFactor)
    })
  }).catch(error => {
    console.log('getWorkCase', error)
  })
}
// 获取基础案件因素
export function dealBasic(data) {
  for (const item of data) {
    item.workload = this.fd.data.saveFloat(item.workload, 2)
  }
  this.basicOpt.data = data
}
export function getActiveModel() {
  this.fd.req({
    type: 'get',
    url: 'api/weight/active'
  }).then(response => {
    this.activeModel = response.data || {}
    this.modelId = this.activeModel[0].id
  }).catch(error => {
    console.log('getActiveModel', error)
  })
}
