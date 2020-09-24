// 获取页面所有接口
export function getAll() {
  this.getBasicInfo()
  this.getUserPhoto()
  this.getResume()
  this.getReward()
  this.getStudy()
  // this.getCause()
  // this.getIndex()
  this.getTag()
  this.getUserDetail()
  this.getWeight()
  this.getCaseQuantity()
  this.getCaseWorkload()
  this.getTrend()
  this.getEvaluationList()
  this.getEvaluationDimension()
  // this.getEffectCard()
  // this.getTargetSelected()
}
export function getBasicInfo() {
  this.fd.req({
    url: 'api/portrait/' + this.userDataId + '/info',
    method: 'get'
  }).then((d) => {
    const data = d.data || {}
    this.isJudge = data.typeId === 'k10003-01'
    this.userInfo = data
    if (this.isJudge) {
      this.getTargetSelected()
      this.getEffectData()
    }
  })
}
// 获取人员头像
export function getUserPhoto() {
  this.fd.req({
    url: 'api/user/photo/data',
    method: 'get',
    data: {
      userId: this.userDataId
    }
  }, 'uaa_url').then((d) => {
    const data = d.data || []
    this.photoUrl = data[0].userPhoto
  })
}
// 获取人员个人履历
export function getResume() {
  this.fd.req({
    url: 'api/staff/resumes',
    data: {
      staffId: this.userDataId
    },
    method: 'get'
  }).then((d) => {
    const data = d.data || {}
    this.resumeData = data.data || []
  })
}
// 获取人员表彰奖励
export function getReward() {
  this.fd.req({
    url: 'api/portrait/' + this.userDataId + '/rewards',
    method: 'get'
  }).then((d) => {
    const data = d.data || {}
    this.rewardData = data
  })
}
// // 获取人员学习拓展
// export function getStudy() {
//   this.fd.req({
//     url: 'api/portrait/' + this.userDataId + '/learning-expand',
//     method: 'get'
//   }).then((d) => {
//     const data = d.data || {}
//     this.studyData = data
//   })
// }

// 获取人员学习拓展
export function getStudy() {
  this.fd.req({
    url: 'api/portrait/' + this.userDataId + '/learning-expand/' + this.studyType,
    method: 'get'
  }).then((d) => {
    console.log(d)
    const data = d.data || {}
    this.studyData = data
  })
}

// 综合标签
export function getTag() {
  this.fd.req({
    url: 'api/portrait/' + this.userDataId + '/labels',
    method: 'get'
  }).then((d) => {
    const data = d.data || {}
    this.tagData = [{
      id: 'rewardLabel1',
      name: data.rewardLabel1,
      value: data.rewardLabel1
    }, {
      id: 'rewardLabel2',
      name: data.rewardLabel2,
      value: data.rewardLabel2
    }, {
      id: 'moreCase',
      name: '办案多',
      value: data.moreCase
    }, {
      id: 'fastCase',
      name: '办案快',
      value: data.fastCase
    }, {
      id: 'highPublic',
      name: '司法公开程度高',
      value: data.highPublic
    }, {
      id: 'seniorJudge',
      name: '资深法官',
      value: data.seniorJudge
    }, {
      id: 'youngJudge',
      name: '青年法官',
      value: data.youngJudge
    }, {
      id: 'moreTraining',
      name: '调训培训多',
      value: data.moreTraining
    }]
    const tagData5 = []
    for (const item of this.tagData) {
      if (item.value) {
        tagData5.push(item)
      }
    }
    this.tagData5 = tagData5.slice(0, 5)
  })
}

// 获取承办案件数
export function getCaseQuantity() {
  const [startTime, endTime] = this.timePick || ['', '']
  this.fd.req({
    url: 'api/portrait/' + this.userDataId + '/analysis/case/quantity',
    method: 'get',
    data: {
      startTime,
      endTime
    }
  }).then(res => {
    const { caseCount, caseCountYoy, reasons } = res.data
    this.caseData = {
      caseCount: caseCount || 0,
      caseCountYoy: caseCountYoy || 0
    }
    for (const item of reasons) {
      item.value = item.count || 0
    }
    this.barOptionTop5.data = reasons
  })
}
// 获取承办案件工作量
export function getCaseWorkload() {
  const [startTime, endTime] = this.timePick || ['', '']
  this.fd.req({
    url: 'api/portrait/' + this.userDataId + '/analysis/case/workload',
    method: 'get',
    data: {
      weightId: this.coefficientSelected,
      startTime,
      endTime
    }
  }).then(res => {
    const { workload,
      workloadYoy,
      departCount,
      departRank,
      courtCount,
      courtRank,
      courtMaxWorkload,
      courtAvgWorkload,
      departMaxWorkload,
      departAvgWorkload } = res.data
    this.workloadData = {
      workload: workload || 0,
      workloadYoy: workloadYoy || 0,
      departCount: departCount || 0,
      departRank: departRank || 0,
      courtCount: courtCount || 0,
      courtRank: courtRank || 0
    }
    const data = [
      {
        name: '全院最高',
        value: courtMaxWorkload
      }, {
        name: '部门最高',
        value: departMaxWorkload
      }, {
        name: '全院平均',
        value: courtAvgWorkload
      }, {
        name: '部门均值',
        value: departAvgWorkload
      }
    ]
    this.barOptionPersonal.data = data
    this.barOptionPersonal.opt.series.markLine.data[0].yAxis = workload || 0
    this.barOptionPersonal.opt.series.markLine.label.normal.formatter = `个人值：${workload || 0}件`
  })
}

// 获取办案数量月度趋势图数据
export function getTrend() {
  const [startTime, endTime] = this.timePick || ['', '']
  this.fd.req({
    url: 'api/portrait/' + this.userDataId + '/analysis/case/trend',
    method: 'get',
    data: {
      weightId: this.coefficientSelected,
      startTime,
      endTime
    }
  }).then(res => {
    for (const item of res.data) {
      item.name = item.month
    }
    this.trendOption.data = res.data
  })
}

// 获取权重系数列表
export function getWeight() {
  this.fd.req({
    url: 'api/weight',
    method: 'get',
    data: {
      status: '1',
      limit: 0,
      offset: 0
    }
  }).then(res => {
    this.coefficientOptions = res.data.data
  })
}

// 获取历次考评结果统计列表
export function getEvaluationList() {
  this.fd.req({
    url: 'api/portrait/' + this.userDataId + '/analysis/evaluation/history',
    method: 'get'
  }).then(res => {
    const { data } = res
    data.forEach((v, i) => {
      v['index'] = i + 1
      v['cycle'] = `${v.startTime}至${v.endTime}`
    })
    this.tableOpt.data = data
  })
}

// 获取考评各项维度分析统计
export function getEvaluationDimension() {
  this.fd.req({
    url: 'api/portrait/' + this.userDataId + '/analysis/evaluation/dimension',
    method: 'get',
    data: {
      schemaId: this.radarSelected
    }
  }).then(res => {
    const { data } = res
    const radar = []
    const series = []
    data.forEach(v => {
      radar.push({
        max: v.maxScore,
        name: v.indexName,
        mix: v.minScore
      })
      series.push({
        value: v.score,
        name: v.indexName,
        seriesName: '本人',
        seriesColor: '#5c89ff'
      })
      series.push({
        value: v.departAvg,
        name: v.indexName,
        seriesName: '部门平均',
        seriesColor: '#66ddee'
      })
      series.push({
        value: v.courtAvg,
        name: v.indexName,
        seriesName: '全院平均',
        seriesColor: '#ffa42d'
      })
    })
    this.radarOption.data = { radar, series }
  })
}

// 获取办案质效-指标卡片接口
export function getEffectCard() {
  const [startTime, endTime] = this.timePick || ['', '']
  const { indexIds } = this
  this.effectLoading = true
  this.fd.req({
    url: 'api/portrait/' + this.userDataId + '/analysis/effect/card',
    method: 'get',
    data: {
      indexIds: indexIds.join(','),
      startTime,
      endTime
    }
  }).then(res => {
    this.effectLoading = false
    this.effectData = res.data.map(v => {
      const echartData = [{
        name: '个人值',
        value: v.value
      }, {
        name: '部门值',
        value: v.departValue
      }, {
        name: '全院值',
        value: v.courtValue
      }]
      const data = JSON.parse(JSON.stringify(this.barOptionEffect))
      data.opt.title.text = v.indexName
      data.indexId = v.indexId
      data.indexName = v.indexName
      data.data = echartData
      return data
    })
  }).catch(() => {
    this.effectLoading = false
  })
}

// 获取办案质效-指标卡片接口(详情)
export function getEffectDetail(indexId, name) {
  const [startTime, endTime] = this.timePick || ['', '']
  this.effectDetailLoading = true
  this.fd.req({
    url: 'api/portrait/' + this.userDataId + '/analysis/effect/detail',
    method: 'get',
    data: {
      indexId,
      startTime,
      endTime
    }
  }).then(res => {
    this.effectDetailLoading = false
    const { data } = res
    data.forEach(v => {
      v.name = v.month
    })
    this.trendOptionDetail.data = data
    this.trendOptionDetail.opt.title.text = name
  }).catch(() => {
    this.effectDetailLoading = false
  })
}

// 获取所有指标
export function getTargetList() {
  // let url = 'api/indexes'
  let url = 'api/portrait/effect/index'
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
      isAccess: this.indexType === 'newSystem' ? 'yes' : 'no',
      offset: 0,
      limit: 0
    }
  }).then((d) => {
    if (this.indexType === 'marked') {
      this.indexData = d.data.data || []
    } else {
      this.indexData = d.data
    }
  })
}

// 获取已选指标
export function getTargetSelected() {
  this.fd.req({
    url: 'api/portrait/effect/index/selected',
    method: 'get'
  }).then(res => {
    const { data } = res
    const indexData = []
    data.forEach(v => {
      indexData.push({
        ...v,
        menuName: v.name,
        indexType: '1'
      })
    })
    this.indexData = indexData
    this.effectDataSelected = indexData.filter(v => (v.pid !== null))
  })
}

// 保存已选指标
export function saveTargetList() {
  const data = []
  const targets = this.$refs.target.menusTree
  var sort = 1
  targets.forEach((v, i) => {
    v.targets.forEach((t, j) => {
      data.push({
        id: t.id,
        name: t.menuName,
        sort: sort++
      })
    })
  })
  this.btnLoading = true
  this.fd.req({
    url: 'api/portrait/effect/index',
    method: 'post',
    data
  }).then(res => {
    this.btnLoading = false
    this.$message({
      type: 'success',
      message: '保存成功'
    })
    this.targetSystem = false
    this.effectDataSelected = data
    this.effectPage = 1
    this.getEffectData()
  })
}

// 设置指标类别右侧指标分类展开隐藏
export function showTarget(index, show) {
  this.$set(this.targetData[index], 'show', show)
  this.targetData = this.fd.tools.merge(true, {}, this.targetData, this.targetData)
}

// 办案数量本年，近三年切换
export function changeType(val) {
  this.type = val
  this.getCause()
}
// 办案质效本年，近三年切换
export function changeType2(val) {
  this.type2 = val
  this.getIndex()
}
// 工作量
export function getWorkload() {
  this.fd.req({
    url: 'api/portrait/' + this.userDataId + '/analysis/workload',
    method: 'get',
    data: {
      type: this.type
    }
  }).then((d) => {
    // const data = d.data || {}
    // this.workData = data
    // this.pieOption.data = [
    //   {
    //     name: '承办人',
    //     value: data.cbrWorkload,
    //     rate: parseFloat(data.cbrWorkload / data.workload * 100).toFixed(2)
    //   }, {
    //     name: '审判长',
    //     value: data.spzWorkload,
    //     rate: parseFloat(data.spzWorkload / data.workload * 100).toFixed(2)
    //   }, {
    //     name: '合议庭成员',
    //     value: data.hytWorkload,
    //     rate: parseFloat(data.hytWorkload / data.workload * 100).toFixed(2)
    //   }
    // ]
  })
}
// 指标
export function getIndex() {
  this.fd.req({
    url: 'api/portrait/' + this.userDataId + '/analysis/index',
    method: 'get',
    data: {
      type: this.type2
    }
  }).then((d) => {
    const data = d.data || {}
    const indexes = data.indexes || []
    // this.indexOpt.data = indexes
    const vbarData = []
    for (const item of indexes) {
      for (const key in item) {
        if (key === 'value') {
          vbarData.push({
            id: item.id,
            seriesName: '本人',
            name: item.name,
            value: item.id === 'zb003007' ? this.fd.data.saveFloat(item.value * 100, 2) : this.fd.data.saveFloat(item.value, 2)
          })
        } else if (key === 'departAvgValue') {
          vbarData.push({
            id: item.id,
            seriesName: '部门值',
            name: item.name,
            value: item.id === 'zb003007' ? this.fd.data.saveFloat(item.departAvgValue * 100, 2) : this.fd.data.saveFloat(item.departAvgValue, 2)
          })
        }
      }
    }
    // this.vbarOpt.data = vbarData
    const testData = [
      {
        name: '2020-01',
        value1: 100,
        value2: 12,
        value3: 7,
        value4: 8
      }, {
        name: '2020-02',
        value1: 110,
        value2: 10,
        value3: 5,
        value4: 1
      }, {
        name: '2020-03',
        value1: 150,
        value2: 6,
        value3: 7,
        value4: 8
      }, {
        name: '2020-04',
        value1: 100,
        value2: 3,
        value3: 8,
        value4: 5
      }
    ]
    // this.trendOption.data = testData
    this.trendOptionDetail.data = testData
  })
}
export function getReason() {
  this.fd.req({
    url: 'api/portrait/' + this.userDataId + '/analysis/reason',
    method: 'get',
    data: {
      type: this.type
    }
  }).then((d) => {
    const data = d.data || {}
    const reasons = data.reasons || []
    for (const item of reasons) {
      item.value = item.count
    }
    // console.log(reasons)
    // this.barOption.data = reasons
    // this.barOptionTop5.data = reasons
    // this.barOptionPersonal.data = reasons
    // this.caseOpt.data = reasons
    // this.workloads = {
    //   'hytWorkload': data.hytWorkload,
    //   'cbrWorkload': data.cbrWorkload,
    //   'spzWorkload': data.spzWorkload
    // }
  })
}
export function getCause() {
  this.getWorkload()
  this.getReason()
}
export function currentNodeClick(data) {
  this.studyType = 'train'
  this.effectData = []
  this.state = ''
  if (data.id) {
    this.userDataId = data.id
    this.getAll()
  }
}
