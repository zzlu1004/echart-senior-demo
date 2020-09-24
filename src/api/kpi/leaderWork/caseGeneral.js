import tools from '../../../utils/tools'
import { radar, sunburst, caseMix, scatter, barMix } from './echartOpt'

// 全院 雷达图
export const radarOption = tools.merge(true, {}, radar, {
  opt: {
    grid: {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    },
    radar: {
      axisLine: {
        lineStyle: {
          opacity: 0.3,
          color: '#666'
        }
      },
      splitLine: {
        lineStyle: {
          opacity: 0.3,
          color: '#666'
        }
      }
    },
    tooltip: {
      formatter: function(d) {
        const param = radarOption.data.series
        let back = param[0].seriesName + '<br/>'
        param.forEach(item => {
          let value = (item.value - 0).toFixed(2)
          if (item.name === '一审判决改判率' || item.name === '再审案件改判率') {
            value = (100 - item.value).toFixed(2)
          }
          back += (item.name + ': ' + value + '<br/>')
        })
        return back
      }
    }
  }
})

// 全院 旭日图
export const nonageSun = tools.merge(true, {}, sunburst, {
  opt: {
    grid: {
      bottom: 200
    },
    tooltip: {
      trigger: 'item',
      formatter: (param) => {
        const back = `${param.data.name}: ${param.data.rate}`
        return back
      }
    }
  }
})
export const nonageSun1 = tools.merge(true, {}, sunburst, {
  opt: {
    tooltip: {
      trigger: 'item',
      formatter: (param) => {
        const back = `${param.data.name}: ${param.data.rate}`
        return back
      }
    }
  }
})

// 员额法官 折线图
export const lineOption = tools.merge(true, {}, caseMix, {
  opt: {
    grid: {
      bottom: '50',
      left: '10',
      right: '40',
      top: '40'
    },
    xAxis: {
      type: 'category',
      data: [],
      axisLabel: {
        formatter: function(value) {
          let back = value
          if (value && value.length > 6) {
            back = value.substring(0, 10)
          }
          return back
        }
      }
    },
    legend: {
      data: [],
      top: '0',
      icon: 'circle',
      itemHeight: '10',
      type: 'scroll', // 图例多的时候出现滚动条
      width: '70%', // 图例最多占一半的宽度
      selectedMode: false, // 图标不可点
      right: 'center', // 图例居中对齐
      textStyle: {
        fontSize: '14'
      }
    },
    yAxis: [{
      name: '案件数',
      nameTextStyle: {
        fontSize: 12
      },
      type: 'value',
      axisLabel: {
        fontSize: 12,
        interval: 0
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'line'
        }
      }
    }, {
      name: '工作量',
      type: 'value',
      axisLabel: {
        fontSize: 12,
        interval: 0,
        formatter: '{value}.00'
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'line'
        }
      }
    }],

    series: [{
      type: 'line',
      name: '承办案件数',
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
            width: 2
          }
        }
      }
    }, {
      type: 'line',
      name: '参办案件工作量',
      yAxisIndex: 1,
      showSymbol: false,
      smooth: true,
      barBorderRadius: 0,
      itemStyle: {
        normal: {
          lineStyle: {
            width: 2
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
})

// 员额法官 柱状图
export const barOption = tools.merge(true, {
  dataZoom: true,
  opt: {
    grid: {
      bottom: '40',
      left: '35',
      right: '35',
      top: '30'
    },
    legend: {
      data: [],
      top: '0',
      icon: 'circle',
      itemHeight: '10',
      type: 'scroll', // 图例多的时候出现滚动条
      width: '70%', // 图例最多占一半的宽度
      selectedMode: false, // 图标不可点
      right: 'center', // 图例居中对齐
      textStyle: {
        fontSize: '14'
      }
    },
    yAxis: [
      {
        name: '案件数',
        type: 'value',
        splitLine: {
          show: true,
          lineStyle: {
            type: 'line'
          }
        }
      }, {
        name: '工作量',
        type: 'value',
        axisLabel: {
          formatter: '{value}.00'
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'line'
          }
        }
      }
    ],
    series: [
      {
        type: 'bar',
        name: '',
        yAxisIndex: 0,
        label: {
          normal: {
            show: false
          }
        },
        barMaxWidth: 30
      }, {
        type: 'bar',
        name: '',
        yAxisIndex: 1,
        barMaxWidth: 30
      }
    ]
  }
}, caseMix)

// 员额法官 柱状和折线图
export const loadOption = tools.merge(true, {

}, barMix, {
  dataZoom: true,
  types: [{ type: 'vbar', key: 'rate' }, { type: 'line', key: 'value' }],
  opt: {
    grid: {
      bottom: '40',
      left: '30',
      right: '40',
      top: '50'
    },
    legend: {
      data: [],
      top: '0',
      icon: 'circle',
      itemHeight: '10',
      type: 'scroll', // 图例多的时候出现滚动条
      width: '70%', // 图例最多占一半的宽度
      selectedMode: false, // 图标不可点
      right: 'center', // 图例居中对齐
      textStyle: {
        fontSize: '14'
      }
    },
    tooltip: {},
    yAxis: [{
      name: '%',
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          type: 'line'
        }
      }
    }, {
      name: '人',
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          type: 'line'
        }
      }
    }],
    series: [{
      type: 'bar',
      name: '负荷占比',
      yAxisIndex: 0,
      label: {
        normal: {
          show: false
        }
      }
    }, {
      type: 'line',
      name: '部门人数',
      yAxisIndex: 1,
      itemStyle: {
        normal: {
          lineStyle: {
            width: 2
          }
        }
      }
    }]
  }
})

export const scatterOpt = tools.merge(true, {}, scatter, {
  opt: {
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'none'
      },
      show: true,
      formatter: function(params) {
        const scatterOptData = scatterOpt.data
        if (params.value.length > 1) {
          if (params.value[0] || params.value[1]) {
            // console.log('scatterOptData', scatterOptData)
            let back = ''
            scatterOptData.forEach((item, index) => {
              console.log(item.x)
              console.log(params.value[0])
              if (item.x === params.value[0] && item.y === params.value[1]) {
                back += (item.name + '<br/>' + scatterOpt.opt.xAxis.name + ': ' + item.x + '<br/>' + scatterOpt.opt.yAxis.name + ': ' + item.y + '<br/>')
              }
            })
            return back
          }
        } else {
          return '全院人均 : ' + params.value
        }
      }
    },
    opacity: 0.8,
    grid: {
      right: 150,
      left: 45,
      top: 40,
      bottom: 0
    },
    xAxis: {
      type: 'value',
      name: '',
      axisLabel: {
        fontSize: 12,
        formatter: '{value}.00',
        interval: 0
      },
      axisTick: {
        lineStyle: {
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '',
      nameGap: 25,
      axisLabel: {
        fontSize: 12,
        formatter: param => param,
        interval: 0
      },
      axisTick: {
        lineStyle: {
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'line'
        }
      }
    },
    series: {
      symbolSize: 20,
      markLine: {
        lineStyle: {
          normal: {
            type: 'dashed'
          }
        },
        label: {
          show: true,
          formatter: '{b}: {d}'
        },
        symbol: 'none',
        data: [
          {
            type: 'average',
            valueIndex: 0,
            name: '平均值',
            label: {
              show: true,
              formatter: (params) => {
                return '全院人均'
              }
            }
          },
          {
            type: 'average',
            valueIndex: 1,
            label: {
              show: true,
              formatter: (params) => {
                return ''
              }
            }
          }
        ]
      }
    }
  }
})

export const scatterOpt1 = tools.merge(true, {}, scatter, {
  opt: {
    grid: {
      right: 100,
      left: 35,
      top: 30,
      bottom: 20
    },
    opacity: 0.8,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none'
      },
      show: true,
      formatter: function(params) {
        let back = ''
        params.forEach(item => {
          if (item.value[2]) {
            back += (item.name + '<br/>' + '办案数量: ' + item.value[0] + '<br/>' + '团队人员数量: ' + item.value[1] + '<br/>' + '办案工作量: ' + item.value[2] + '<br/>')
          }
        })
        return back
      }
    },
    xAxis: {
      type: 'value',
      name: '办案数量'
    },
    yAxis: {
      type: 'value',
      name: '团队人员数量',
      axisLabel: {
        fontSize: 12,
        formatter: param => param,
        interval: 0
      },
      axisTick: {
        show: true,
        lineStyle: {
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'line'
        }
      }
    },
    series: {
      symbolSize: function(dataItem) {
        return dataItem[2] * 3
      }
    }
  }
})

// 办案概况汇总
export function getRadarData() {
  this.fd.req({
    url: 'api/case-overview/total',
    method: 'get',
    data: this.pParams
  }).then((d) => {
    const data = d.data || {}
    const tagsAll = data.totalVos
    const tagsAll2 = data.echartsVos
    // tag图
    const tagsData = []
    for (const item of tagsAll) {
      tagsData.push([{
        name: item.name
      }, {
        unit: this.unitMap[item.name],
        value: item.value
      }])
    }
    this.tags = tagsData
    // 雷达图
    const radarData = []
    for (const item of tagsAll2) {
      radarData.push({
        name: item.name,
        max: 100
      })
    }
    const seriesData = []
    for (const item of tagsAll2) {
      seriesData.push({
        name: item.name,
        value: item.value,
        seriesName: '办案情况汇总'
      })
    }
    this.radarOption.data.radar = radarData
    this.radarOption.data.series = seriesData
    const data1 = this.fd.tools.merge(true, {}, this.radarOption.data)
    data1.series.forEach((item, index) => {
      if (item.name === '一审判决改判率' || item.name === '再审案件改判率') {
        item.value = 100 - item.value
      }
    })
    this.radarOption.data = data1
    console.log(this.radarOption)
  })
}
// 案件类型分布--案件数
export function getPortrayalData() {
  this.fd.req({
    url: 'api/case-overview/type-distribution?type=case',
    method: 'get',
    data: this.pParams
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
    // this.describeSun.data = treeData
    this.describeSun.chartOption.series.data = treeData
    this.describeSun.chart.setOption(this.describeSun.chartOption, true)
    this.describeOption.data = tableData
    this.totalData = data.total
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
// 案件类型分布--案件工作量
export function getPortrayalData2() {
  this.fd.req({
    url: 'api/case-overview/type-distribution?type=workload',
    method: 'get',
    data: this.pParams
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
    addOpacity(treeData, 0.4)
    this.describeSun2.chartOption.series.data = treeData
    this.describeSun2.chart.setOption(this.describeSun2.chartOption, true)
    this.describeOption2.data = tableData
    this.totalData2 = data.total
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
// 员额法官，法官助理，书记员的办案情况汇总
export function getJudgeTotal() {
  this.lineOption.data = []
  this.tagsData = []
  let url = ''
  if (this.type === 'yefg') {
    url = 'api/case-overview/total/staff-type?staffType=judge'
  } else if (this.type === 'fgzl') {
    url = 'api/case-overview/total/staff-type?staffType=assistant'
  } else if (this.type === 'sjy') {
    url = 'api/case-overview/total/staff-type?staffType=clerk'
  }
  this.fd.req({
    url: url,
    method: 'get',
    data: this.pParams
  }).then((d) => {
    const data = d.data || {}
    const dataBar = data.echartsVos
    const dataLoad = data.totalVos
    const tagsData = []
    for (const item of dataLoad) {
      tagsData.push([{
        name: item.name
      }, {
        unit: this.unitMap[item.name],
        value: item.value,
        yoy: item.rate
      }])
    }
    this.lineOption.data = dataBar
    this.tagsData = tagsData
  })
}
// 员额法官，法官助理，书记员的部门人员办案量
export function getJudgeTotal2() {
  this.barOption.data = []
  const o1 = { type: 'rate' }
  const o2 = this.pParams
  const obj = Object.assign(o1, o2)
  let url = ''
  if (this.type === 'yefg') {
    url = 'api/case-overview/depart/case-workload?staffType=judge'
  } else if (this.type === 'fgzl') {
    url = 'api/case-overview/depart/case-workload?staffType=assistant'
  } else if (this.type === 'sjy') {
    url = 'api/case-overview/depart/case-workload?staffType=clerk'
  }
  this.fd.req({
    url: url,
    method: 'get',
    data: obj
  }).then((d) => {
    const data = d.data || []
    this.barOption.data = data
  })
}
// 员额法官，法官助理，书记员的部门人员办案量
export function getJudgeTotal3() {
  this.loadOption.data = []
  const o1 = { type: 'load' }
  const o2 = this.pParams
  const obj = Object.assign(o1, o2)
  let url = ''
  if (this.type === 'yefg') {
    url = 'api/case-overview/depart/case-workload?staffType=judge'
  } else if (this.type === 'fgzl') {
    url = 'api/case-overview/depart/case-workload?staffType=assistant'
  } else if (this.type === 'sjy') {
    url = 'api/case-overview/depart/case-workload?staffType=clerk'
  }
  this.fd.req({
    url: url,
    method: 'get',
    data: obj
  }).then((d) => {
    const data = d.data || []
    this.loadOption.data = data
  })
}
// 员额法官，法官助理，书记员的办案详情散点图
export function getCaseTotal() {
  this.scatterOpt.data = []
  let url = ''
  if (this.type === 'yefg') {
    url = 'api/case-overview/case-detail/dot?staffType=judge'
  } else if (this.type === 'fgzl') {
    url = 'api/case-overview/case-detail/dot?staffType=assistant'
  } else if (this.type === 'sjy') {
    url = 'api/case-overview/case-detail/dot?staffType=clerk'
  }
  this.fd.req({
    url: url,
    method: 'get',
    data: this.pParams
  }).then((d) => {
    const data = d.data || {}
    const dotData = data.chartData
    const tagsData = []
    for (const item of dotData) {
      tagsData.push({
        name: item.name,
        y: item.caseCount,
        x: item.workload,
        value: item.avgWorkload
      })
    }
    this.scatterOpt.data = tagsData
  })
}
// 员额法官，法官助理，书记员的办案详情表格
export function getCaseTotal2() {
  this.tableOpt.data = []
  let url = ''
  if (this.type === 'yefg') {
    url = 'api/case-overview/case-detail/table?staffType=judge'
  } else if (this.type === 'fgzl') {
    url = 'api/case-overview/case-detail/table?staffType=assistant'
  } else if (this.type === 'sjy') {
    url = 'api/case-overview/case-detail/table?staffType=clerk'
  }
  this.fd.req({
    url: url,
    method: 'get',
    data: this.pParams
  }).then((d) => {
    const data = d.data || []
    this.tableOpt.data = data
  })
}
// 审判团队分析表格
export function getTaleData2() {
  this.tableOpt.data = []
  this.fd.req({
    url: 'api/case-overview/trial-team/table',
    method: 'get',
    data: this.pParams
  }).then((d) => {
    const data = d.data || []
    this.tableOpt.data = data
  })
}
export function sortByNum(column) {
  this.pParams.orderField = column.prop
  this.pParams.orderType = column.order
  this.getCaseTotal2()
}
export function sortByNum2(column) {
  this.pParams.orderField = column.prop
  this.pParams.orderType = column.order
  this.getTaleData2()
}
// 审判团队分析散点图
export function getPostJudgeData() {
  this.scatterMax = []
  this.fd.req({
    url: 'api/case-overview/trial-team/dot',
    method: 'get',
    data: this.pParams
  }).then((d) => {
    const data = d.data || {}
    const dotData = data.chartData
    const dotData2 = data.total
    const tagsData = []
    for (const item of dotData) {
      tagsData.push({
        name: item.name,
        'x': item.caseCount,
        'y': item.staffCount,
        value: item.workload
      })
      this.scatterMax.push(item.workload)
    }
    const maxAvg = Math.max.apply(null, this.scatterMax) / 100
    this.scatterOpt1.data = tagsData
    this.scatterOpt1.opt.series = {
      symbolSize: (val, params) => {
        return Math.log10(val[2] / maxAvg) * 25
      }
    }
    this.judgeTotal = dotData2
  })
}
export function toStartDate(time) {
  return time.getFullYear() + '-01'
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
export function refreshAll() {
  this.isRefresh = !this.isRefresh
}
// 页签选择
export function choosePage(key) {
  this.page = key
}
