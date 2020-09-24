export function sortByNum(column) {
  this.params.orderField = column.prop
  this.params.orderType = column.order
  this.getAllResult()
}
// 页面刷新时获取表头及表格内容
export function refreshAllResult() {
  this.loading = true
  let url = ''
  if (this.type === 'case') {
    // k10033-01：案件数反查接口 k10033-03：审理时间指数反查接口 k10033-04：后审指标反查接口 k10033-05: 文书上网数反查k10033-06:庭审直播数反查 k10033-07:开庭排期数反查
    if (this.kpiType === 'k10033-01' || this.kpiType === 'k10033-03' || this.kpiType === 'k10033-04' || this.kpiType === 'k10033-05' || this.kpiType === 'k10033-06' || this.kpiType === 'k10033-07') {
      url = 'api/dept/assessmet/result/index/kpi/' + this.indexId + '/detail'
    } else {
      url = 'api/dept/assessmet/result/index/kpi/' + this.indexId
    }
  } else if (this.type === 'workload') {
    // k10033-02：案件工作量反查接口
    if (this.kpiType === 'k10033-02') {
      url = 'api/dept/assessmet/result/index/kpi/' + this.indexId + '/detail'
    } else {
      url = 'api/dept/assessmet/result/index/kpi/workload/' + this.indexId
    }
  }
  this.fd.req({
    url: url,
    method: 'get',
    data: this.params
  }).then((d) => {
    const data = d.data || {}
    this.total = data.total || 0
    // 获取表格
    this.caseOpt.data = data.data
    this.loading = false
    // 获取表头
    this.getColumns(data.columns)
  })
}
// 获取表格
// getAllResult单独摘出来，不加载表头函数，方便在调取查询、分页函数时保留自定义列表信息
export function getAllResult() {
  this.loading = true
  let url = ''
  if (this.type === 'case') {
    // k10033-01：案件数反查接口 k10033-03：审理时间指数反查接口 k10033-04：后审指标反查接口 k10033-05: 文书上网数反查k10033-06:庭审直播数反查 k10033-07:开庭排期数反查
    if (this.kpiType === 'k10033-01' || this.kpiType === 'k10033-03' || this.kpiType === 'k10033-04' || this.kpiType === 'k10033-05' || this.kpiType === 'k10033-06' || this.kpiType === 'k10033-07') {
      url = 'api/dept/assessmet/result/index/kpi/' + this.indexId + '/detail'
    } else {
      url = 'api/dept/assessmet/result/index/kpi/' + this.indexId
    }
  } else if (this.type === 'workload') {
    // k10033-02：案件工作量反查接口
    if (this.kpiType === 'k10033-02') {
      url = 'api/dept/assessmet/result/index/kpi/' + this.indexId + '/detail'
    } else {
      url = 'api/dept/assessmet/result/index/kpi/workload/' + this.indexId
    }
  }
  this.fd.req({
    url: url,
    method: 'get',
    data: this.params
  }).then((d) => {
    const data = d.data || {}
    this.total = data.total || 0
    this.caseOpt.data = data.data
    this.loading = false
  })
}
export function downloadTable() {
  let url = ''
  let titleName = ''
  if (this.type === 'case') {
    // k10033-01：案件数反查接口 k10033-03：审理时间指数反查接口 k10033-04：后审指标反查接口 k10033-05: 文书上网数反查k10033-06:庭审直播数反查 k10033-07:开庭排期数反查
    if (this.kpiType === 'k10033-01' || this.kpiType === 'k10033-03' || this.kpiType === 'k10033-04' || this.kpiType === 'k10033-05' || this.kpiType === 'k10033-06' || this.kpiType === 'k10033-07') {
      url = 'api/dept/assessmet/result/index/kpi/' + this.indexId + '/detail/download'
    } else {
      url = 'api/dept/assessmet/result/index/kpi/' + this.indexId + '/download'
    }
  } else if (this.type === 'workload') {
    // k10033-02：案件工作量反查接口
    if (this.kpiType === 'k10033-02') {
      url = 'api/dept/assessmet/result/index/kpi/' + this.indexId + '/detail/download'
    } else {
      url = 'api/dept/assessmet/result/index/kpi/workload/' + this.indexId + '/download'
    }
  }
  titleName = `${this.selfMsg.departName}_${this.selfMsg.index}反查表`
  const fileName = this.selfMsg.departName + this.params.startTime + '至' + this.params.endTime + this.selfMsg.index + '_'
  const data = this.fd.tools.merge(true, { fileName: fileName, keyword: this.cParams.keyword, titleName: titleName }, this.pParams.params)
  this.fd.tools.download('', url, data)
}
