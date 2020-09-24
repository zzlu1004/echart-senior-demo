import tools from '../../../utils/tools'
// import { getLinear } from '../../utils/echarts'
import { vbar_3, mix, vbar_2, hbar, vbar, line, pie_m2, caseMix } from './echartOpt'
// 获奖人次
export const rewardNum = tools.merge(true, {
  opt: {
    grid: {
      bottom: '0'
    },
    yAxis: [{
      name: '人次',
      type: 'value',
      axisLabel: {
        formatter: param => param,
        interval: 0
      },
      axisTick: {
        lineStyle: {
        }
      }
    }, {
      name: '人',
      type: 'value',
      axisLabel: {
        formatter: param => param,
        interval: 0
      },
      axisTick: {
        lineStyle: {
        }
      }
    }],

    series: [{
      type: 'line',
      name: '表彰奖励人次',
      yAxisIndex: 0,
      smooth: true,
      showSymbol: false,
      barBorderRadius: 0,
      label: {
        normal: {
          show: false
        }
      }
    }, {
      type: 'line',
      name: '获奖人数',
      yAxisIndex: 1,
      showSymbol: false,
      smooth: true,
      barBorderRadius: 0,
      label: {
        normal: {
          show: false
        }
      }
    }]
  }
}, caseMix)
// 获奖人次5年
export const rewardNum2 = tools.merge(true, {
  opt: {
    grid: {
      bottom: '0'
    },
    yAxis: [{
      name: '人次',
      type: 'value',
      axisLabel: {
        formatter: param => param,
        interval: 0
      },
      axisTick: {
        lineStyle: {
        }
      }
    }, {
      name: '人',
      type: 'value',
      axisLabel: {
        formatter: param => param,
        interval: 0
      },
      axisTick: {
        lineStyle: {
        }
      }
    }],

    series: [{
      type: 'line',
      name: '表彰奖励人次',
      yAxisIndex: 0,
      smooth: true,
      showSymbol: false,
      barBorderRadius: 0,
      label: {
        normal: {
          show: false
        }
      },
      itemStyle: {
        normal: {
          lineStyle: {
            width: 4
          }
        }
      }
    }, {
      type: 'line',
      name: '获奖人数',
      yAxisIndex: 1,
      showSymbol: false,
      smooth: true,
      barBorderRadius: 0,
      itemStyle: {
        normal: {
          lineStyle: {
            width: 4
          }
        }
      },
      label: {
        normal: {
          show: false
        }
      }
    }]
  }
}, caseMix)
// 部门人员分布
export const departPeople = tools.merge(true, {

}, vbar_3, {
  opt: {
    tooltip: {
      trigger: 'axis',
      formatter: (param) => {
        let back = param[0].name + '<br/>' + param[0].data.rate + ':' + param[0].data.total + '<br/>'
        param.forEach((item) => {
          if (item.value && item.value !== '0') {
            back += (item.seriesName + ': ' + item.value + '<br/>')
          }
        })
        return back
      }
    }
  }
})
// 人员画像
export const nonageSun = {
  type: 'sunburst',
  chart: {},
  chartOption: {},
  data: [],
  opt: {
    radius: ['30%', '90%'],
    tooltip: {
      trigger: 'item',
      formatter: (param) => {
        // const back = `${param.data.name}: ${param.data.rate}`
        const back = param.data.name + ' : ' + param.data.rate
        return back
      }
    }
  }
}
// 学历专业
export const educationSun = tools.merge(true, {
  opt: {
    series: {
      center: ['53%', '55%'],
      radius: ['60%', '70%'],
      label: {
        normal: {
          show: false
        },
        emphasis: {
          show: false
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      }
    }
  }
}, pie_m2)
// 性别分布
export const sexRate = tools.merge(true, {
  opt: {
    tooltip: {
      trigger: 'axis',
      formatter: (param) => {
        let back = ''
        param.forEach((item) => {
          if (item.value && item.value !== '0') {
            back += (item.seriesName + ': ' + item.value + '人' + '<br/>占比：' + item.data.rate + '%')
          }
        })
        return back
      }
    }
  }
}, vbar, {
  stack: true,
  count: true
})
// 文字云
export const wordCloudOpt = {
  data: [], // 生成图标的数据
  type: 'wordCloud', // 文字云
  chartOption: {}, // 全量的默认配置
  chart: null, // echart.init后生成的echart对象
  opt: { // 覆盖默认配置，规则参照echart官网
  }
}
// 进院出院人数
export const enterExit = tools.merge(true, {}, line)
// 培训人次
export const personNum = tools.merge(true, {
  types: [{ type: 'vbar', key: 'value' }, { type: 'line', key: 'rate' }],
  opt: {
    grid: {
      bottom: '0'
    },
    tooltip: {},
    yAxis: [{
      name: '人次',
      type: 'value'
    }, {
      name: '人',
      type: 'value'
    }],
    series: [{ type: 'bar', name: '调训培训人次' }, { type: 'line', name: '参与人数', yAxisIndex: 1 }]
  }
}, mix)
// 培训人次5年
export const personNum2 = tools.merge(true, {
  types: [{ type: 'vbar', key: 'value' }, { type: 'line', key: 'rate' }],
  opt: {
    grid: {
      bottom: '0'
    },
    tooltip: {},
    yAxis: [{
      name: '人次',
      type: 'value'
    }, {
      name: '人',
      type: 'value'
    }],
    series: [{ type: 'bar', name: '调训培训人次' }, { type: 'line', name: '参与人数', yAxisIndex: 1 }]
  }
}, mix)
// 职级分布
export const rankData = tools.merge(true, {
  opt: {
    tooltip: {
      trigger: 'axis',
      formatter: (param) => {
        let back = ''
        param.forEach((item) => {
          if (item.value && item.value !== '0') {
            back += (item.seriesName + ': ' + item.value + '人' + '<br/>占比：' + item.data.rate + '%')
          }
        })
        return back
      }
    }
  }
}, vbar_2, {
  stack: true
})
// 获奖地区
export const rewardRate = tools.merge(true, {}, hbar)
// 获奖地区5年
export const rewardRate2 = tools.merge(true, {}, hbar)
// 出院原因
export const exitReason = tools.merge(true, {}, vbar_2)
// 队伍调训培训情况
export const training = tools.merge(true, {}, pie_m2)
// 队伍调训培训情况3年
export const training2 = tools.merge(true, {}, pie_m2)
// 部门人员分布
export function getDepartPeople() {
  this.fd.req({
    url: 'api/team-overview/staff-type',
    method: 'get'
  }).then((d) => {
    const data = d.data || {}
    this.departPeople.data = data
  })
}
// 队伍基础概况总数据
export function getTotalData() {
  this.fd.req({
    url: 'api/team-overview',
    method: 'get'
  }).then((d) => {
    const data = d.data || {}
    this.totalData = data
    const tagsAll = data.echartsVos
    // console.log(tagsAll)
    const tagsData = []
    for (const item of tagsAll) {
      tagsData.push([{
        name: item.name
      }, {
        unit: this.unitMap[item.name],
        value: item.value,
        rate: item.rate ? item.rate : ' '
      }])
    }
    this.tags = tagsData
  })
}
// 部门人员动态总数据
export function getDepartTotalData() {
  this.fd.req({
    url: 'api/team-overview/staff-dynamic',
    method: 'get'
  }).then((d) => {
    const data = d.data || {}
    const tagsAll2 = data.companyCount
    const tagsAll = data.totalVos
    const enterReasonData = data.companyType
    const tagsData = []
    for (const item of tagsAll) {
      tagsData.push([{
        name: item.name
      }, {
        unit: this.unitMap[item.name],
        value: item.value
      }])
    }
    this.departTags = tagsData
    // 进院类型表格
    this.enterReason = enterReasonData
    // 进院人数折线图
    this.enterExit.data = tagsAll2
  })
}

// 获取人员画像
export function getPortrayalData() {
  this.fd.req({
    url: 'api/team-overview/staff-describe',
    method: 'get'
  }).then((d) => {
    const data = d.data || {}
    const chartData = data.chartData || []
    const tableData = data.tableData || []
    // 遍历后添加颜色
    const colors = this.fd.echart.getColors('sunburst')
    chartData.forEach((item, i) => {
      item.value = parseFloat(item.value)
    })
    tableData.forEach((item, i) => {
      this.$set(item, 'color', colors[i])
    })
    const treeData = this.fd.data.changeToTree(chartData, 'name', 'seriesName')
    // 外层增加透明度
    for (const item of treeData) {
      addOpacity(item, 0.4)
    }
    this.describeSun.chartOption.series.data = treeData
    this.describeSun.chart.setOption(this.describeSun.chartOption, true)
    this.describeOption.data = tableData
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
// 获取性别分布
export function getSexRate() {
  this.fd.req({
    url: 'api/team-overview/sex',
    method: 'get'
  }).then((d) => {
    const data = d.data || {}
    // console.log(data.echartsVos)
    this.sexRate.data = data
  })
}
// 获取年龄结构分布
export function getAgeData() {
  this.fd.req({
    url: 'api/team-overview/age-type',
    method: 'get'
  }).then((d) => {
    const data = d.data || []
    const ageDatas = []
    for (const item of data) {
      ageDatas.push({
        name: item.name,
        value: parseFloat(item.value), // 现人数
        forecast: parseFloat(item.count), // 预测人数
        rate: item.rate, // 预测人数
        yoy: item.yoy // 预测人数
      })
    }
    this.ageData = ageDatas
  })
}
// 出院原因
export function getExitReason() {
  this.exitReason.data = window.show.exitReason
}
// 职级分布
export function getRankData() {
  this.fd.req({
    url: 'api/team-overview/level',
    method: 'get'
  }).then((d) => {
    const data = d.data || {}
    // console.log(data.echartsVos)
    this.rankData.data = data
  })
}
// 获取学历专业
// 获取文字云数据
export function getEducationData() {
  this.fd.req({
    url: 'api/team-overview/degree-major',
    method: 'get'
  }).then((d) => {
    const data = d.data || {}
    const chartData = data.degreeId || []
    const tableData = data.degreeId || []
    // 遍历后添加颜色
    const colors = this.fd.echart.getColors('pie')
    chartData.forEach((item, i) => {
      item.value = parseFloat(item.value)
    })
    tableData.forEach((item, i) => {
      this.$set(item, 'color', colors[i])
    })
    const treeData = this.fd.data.changeToTree(chartData, 'name', 'seriesName')
    // 外层增加透明度
    addOpacity(treeData, 0.4)
    this.educationSun.data = treeData
    this.educationData.data = tableData
    const degreeCloud = data.major
    this.wordCloudOpt.data = degreeCloud
  })
  // 添加透明度(递归)
  function addOpacity(treeData, opacity) {
    for (const item of treeData) {
      if (item.children) {
        for (const itemChild of item.children) {
          itemChild.itemStyle = { opacity: opacity }
          addOpacity(item.children, 0.4)
        }
      }
    }
  }
}
// 队伍调训培训情况
export function getTrainingData() {
  this.fd.req({
    url: 'api/team-overview/team-situation/train?year=one',
    method: 'get'
  }).then((d) => {
    const data = d.data || {}
    // tags总数
    const tagsAll = data.totalVos
    // console.log(data)
    const tagsData = []
    for (const item of tagsAll) {
      tagsData.push([{
        name: item.name
      }, {
        unit: this.unitMap[item.name],
        value: item.value,
        yoy: item.rate ? item.rate : ' '
      }])
    }
    this.tags = tagsData
    // 饼图加table
    const trainingData = data.typeEchartsVo || []
    const table2Data = data.typeEchartsVo || []
    // 遍历后添加颜色
    const colors = this.fd.echart.getColors('pie')
    trainingData.forEach((item, i) => {
      item.value = parseFloat(item.value)
    })
    table2Data.forEach((item, i) => {
      this.$set(item, 'color', colors[i])
    })
    const treeingData = this.fd.data.changeToTree(trainingData, 'name', 'seriesName')
    // 外层增加透明度
    addOpacity(treeingData, 0.4)
    this.trainingData.data = treeingData
    this.training.data = table2Data
    // 柱状折线混合图
    const personNumData = data.echartsVos
    // console.log(personNumData)
    this.personNum.data = personNumData
  })
  // 添加透明度(递归)
  function addOpacity(treeData, opacity) {
    for (const item of treeData) {
      if (item.children) {
        for (const itemChild of item.children) {
          itemChild.itemStyle = { opacity: opacity }
          addOpacity(item.children, 0.4)
        }
      }
    }
  }
}
// 队伍调训培训情况3年
export function getTrainingData2() {
  this.fd.req({
    url: 'api/team-overview/team-situation/train?year=three',
    method: 'get'
  }).then((d) => {
    const data = d.data || {}
    // // tags总数
    const tagsAll = data.totalVos
    // console.log(data)
    const tagsData = []
    for (const item of tagsAll) {
      tagsData.push([{
        name: item.name
      }, {
        unit: this.unitMap[item.name],
        value: item.value
      }])
    }
    this.tags32 = tagsData
    // 饼图加table
    const trainingData = data.typeEchartsVo || []
    const table2Data = data.typeEchartsVo || []
    // 遍历后添加颜色
    const colors = this.fd.echart.getColors('pie')
    trainingData.forEach((item, i) => {
      item.value = parseFloat(item.value)
    })
    table2Data.forEach((item, i) => {
      this.$set(item, 'color', colors[i])
    })
    const treeingData = this.fd.data.changeToTree(trainingData, 'name', 'seriesName')
    // 外层增加透明度
    addOpacity(treeingData, 0.4)
    this.trainingData2.data = treeingData
    this.training2.data = table2Data
    // 柱状折线混合图
    const personNumData = data.echartsVos
    this.personNum2.data = personNumData
  })
  // 添加透明度(递归)
  function addOpacity(treeData, opacity) {
    for (const item of treeData) {
      if (item.children) {
        for (const itemChild of item.children) {
          itemChild.itemStyle = { opacity: opacity }
          addOpacity(item.children, 0.4)
        }
      }
    }
  }
}
// 队伍表彰奖励情况
export function getRewardNum() {
  this.fd.req({
    url: 'api/team-overview/team-situation/reward?year=one',
    method: 'get'
  }).then((d) => {
    const data = d.data || {}
    // tags总数
    const tagsAll = data.totalVos
    // console.log(data)
    const tagsData = []
    for (const item of tagsAll) {
      // if (item.rate === null) {
      //   item.rate = ''
      // }
      tagsData.push([{
        name: item.name
      }, {
        unit: this.unitMap[item.name],
        value: item.value,
        yoy: item.rate ? item.rate : ' '
      }])
    }
    this.tags2 = tagsData
    // 饼图加table
    const rewardRateData = data.typeEchartsVo
    this.rewardRate.chart.resize()
    this.rewardRate.data = rewardRateData
    // 柱状折线混合图
    const rewardNumData = data.echartsVos
    this.rewardNum.data = rewardNumData
    this.rewardNum.chart.resize()
  })
}
// 队伍表彰奖励情况3年
export function getRewardNum2() {
  this.fd.req({
    url: 'api/team-overview/team-situation/reward?year=three',
    method: 'get'
  }).then((d) => {
    const data = d.data || {}
    // tags总数
    const tagsAll = data.totalVos
    // console.log(data)
    const tagsData = []
    for (const item of tagsAll) {
      tagsData.push([{
        name: item.name
      }, {
        unit: this.unitMap[item.name],
        value: item.value
      }])
    }
    this.tags42 = tagsData
    // 饼图加table
    this.$nextTick(() => {
      const rewardRateData = data.typeEchartsVo
      this.rewardRate2.data = rewardRateData
      // 柱状折线混合图
      const rewardNumData = data.echartsVos
      // console.log(personNumData)
      this.rewardNum2.data = rewardNumData
    })
  })
}
// 个人榜单3年
export function getListNum2() {
  this.fd.req({
    url: 'api/team-overview/person-list?year=three',
    method: 'get',
    data: this.params
  }).then((d) => {
    const data = d.data || {}
    this.tableOpt2.data = data
  })
}
// 个人榜单5年
export function getListNum() {
  this.fd.req({
    url: 'api/team-overview/person-list?year=one',
    method: 'get',
    data: this.params
  }).then((d) => {
    const data = d.data || {}
    this.tableOpt.data = data
  })
}
export function sortByNum(column) {
  this.params.orderField = column.prop
  this.params.orderType = column.order
  this.getListNum()
  this.getListNum2()
}
