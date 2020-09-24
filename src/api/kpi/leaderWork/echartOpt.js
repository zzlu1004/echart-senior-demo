// import { getLinear } from '../../../utils/echarts'
export const pie_m = {
  type: 'pie_m',
  chart: {},
  chartOption: {},
  data: [],
  opt: {
    // color: [getLinear(['#0d2fee', '#FACC14'], 'y'),
    //   getLinear(['#0d2fee', '#2EC299'], 'y'),
    //   getLinear(['#0d2fee', '#4FB4FF'], 'y'),
    //   getLinear(['#0d2fee', '#FF92F1'], 'y')]
  }
}
export const pie_m2 = {
  data: [], // 生成图标的数据
  type: 'pie', // 图标类型
  chartOption: {}, // 全量的默认配置
  chart: null, // echart.init后生成的echart对象
  opt: { // 覆盖默认配置，规则参照echart官网
    series: {
      // center: ['50%', '55%'],
      radius: ['50%', '80%'],
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
    },
    legend: {
      show: false
    }
  }
}
export const hbar = {
  type: 'hbar',
  chart: {},
  chartOption: {},
  data: [],
  opt: {
    grid: {
      bottom: '20',
      left: '10',
      right: '30',
      top: '10'
    },
    // color: [
    //   getLinear(['#00d1f7', '#2ad793'], 'x'),
    //   getLinear(['#0D30E8', '#FACC14'], 'x'),
    //   getLinear(['#0d2fee', '#2EC299'], 'x'),
    //   getLinear(['#0d2fee', '#4FB4FF'], 'x'),
    //   getLinear(['#0d2fee', '#FF92F1'], 'x')],
    legend: {
      show: false
    },
    yAxis: {
      axisTick: {
        length: 3
      }
    },
    xAxis: {
      axisLabel: {
        formatter: '{value}'
      },
      axisTick: {
        show: false
      },
      boundaryGap: false
    },
    series: {
      barWidth: 18,
      label: {
        normal: {
          show: true,
          position: 'right',
          formatter: '{c}'
        }
      },
      itemStyle: {
        normal: {
          barBorderRadius: 9
        }
      }
    }
  }
}
export const map = {
  type: 'map',
  mapCode: window.config.cityCode,
  chart: {},
  chartOption: {},
  data: [],
  opt: {
    textStyle: {
      // color: '#fff',
      fontFamily: 'PingFangSC-Regular',
      fontSize: '12'
    },
    visualMap: {
      min: 100,
      max: 400
    },
    series: {
      top: 40,
      bottom: 0,
      itemStyle: {
        normal: {
          borderColor: '#ffe73f',
          borderWidth: 1
        },
        emphasis: {
          areaColor: '#ffe73f',
          opacity: 1
        }
      },
      label: {
        normal: {
          // color: '#fff',
          fontSize: 16
        },
        emphasis: {
          // color: '#fff',
          fontSize: 14
        }
      },
      data: window.config.cities
    }
  }
}
export const gauge = {
  type: 'gauge',
  chart: {},
  chartOption: {},
  data: {},
  opt: {
    tooltip: {
      show: false,
      trigger: 'none'
    }
  }
}
export function getGaugeItem(data, name, rate) {
  return {
    name: name,
    type: 'gauge',
    min: 0,
    max: 100,
    splitNumber: 10,
    radius: '60%',
    axisLine: { // 坐标轴线
      lineStyle: { // 属性lineStyle控制线条样式
        // color: [[1, {
        //   colorStops: [{
        //     offset: 0,
        //     color: '#facc14'
        //   }, {
        //     offset: 1,
        //     color: 'rgba(19, 194, 194, 0.5)'
        //   }],
        //   x: 0,
        //   x2: 1,
        //   y: 0,
        //   y2: 0
        // }]],
        width: 10
      }
    },
    axisLabel: { // 坐标轴小标记
      show: false
    },
    axisTick: { // 坐标轴小标记
      length: 4, // 属性length控制线长
      lineStyle: { // 属性lineStyle控制线条样式
        // color: '#e5f3ff'
      }
    },
    splitLine: { // 分隔线
      length: 6, // 属性length控制线长
      lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
        // color: '#e5f3ff',
        width: 2
      }
    },
    title: {
      show: false,
      textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        fontSize: '12'
        // color: '#e5f3ff'
      },
      offsetCenter: [0, '145%']
    },
    detail: {
      show: false,
      offsetCenter: [0, '100%'], // x, y，单位px
      textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        fontSize: 14,
        fontWeight: 'bold'
        // color: '#fff'
      },
      formatter: param => {
        return param + '%'
      }
    },
    pointer: {
      length: '60%',
      width: 5
    },
    tooltip: {
      show: false
    },
    data: [{ name: data.name, value: data.rate }]
  }
}
export const vbar = {
  type: 'vbar',
  chart: {},
  chartOption: {},
  data: [],
  opt: {
    // color: [getLinear(['#453ee9', '#03cdf7'], 'y'),
    //   getLinear(['#00d1f7', '#2cd78f'], 'y'),
    //   getLinear(['#0d2fee', '#2EC299'], 'y'),
    //   getLinear(['#0d2fee', '#FF92F1'], 'y')],
    legend: {
      show: false
    },
    grid: {
      left: '10',
      top: '10', // 上部需要放置坐标轴名称和图例
      bottom: '10', // 下边会有拖动轴
      right: '10'
    },
    tooltip: {
      show: true
    },
    yAxis: {
      name: '人',
      axisLabel: {
        formatter: param => param
      }
    },
    xAxis: {
      axisLabel: {
        formatter: function(param) {
          const paramsNum = param.length
          const limitNum = 5
          const newParam = []
          if (paramsNum > limitNum) {
            for (var i = 0; i < paramsNum; i += limitNum) {
              newParam.push(param.substring(i, i + limitNum))
            }
          } else {
            newParam.push(param)
          }
          return newParam.join('\n')
        }
      },
      boundaryGap: true
    },
    series: {
      label: {
        normal: {
          position: 'top',
          formatter: '{c}',
          show: false
        }
      }
    }
  }
}
export const vbar_2 = {
  type: 'vbar',
  chart: {},
  chartOption: {},
  data: [],
  opt: {
    // color: [getLinear(['#4461ea', '#03cdf7'], 'y'),
    //   getLinear(['#0D30E8', '#FACC14'], 'y'),
    //   getLinear(['#0d2fee', '#2EC299'], 'y'),
    //   getLinear(['#0d2fee', '#FF92F1'], 'y')],
    legend: {
      show: false
    },
    grid: {
      left: '10',
      top: '30', // 上部需要放置坐标轴名称和图例
      bottom: '10', // 下边会有拖动轴
      right: '20'
    },
    // tooltip: {
    //   show: false
    // },
    yAxis: {
      name: '人',
      axisLabel: {
        formatter: param => param
      }
    },
    xAxis: {
      axisLabel: {
        formatter: function(param) {
          const paramsNum = param.length
          const limitNum = 5
          const newParam = []
          if (paramsNum > limitNum) {
            for (var i = 0; i < paramsNum; i += limitNum) {
              newParam.push(param.substring(i, i + limitNum))
            }
          } else {
            newParam.push(param)
          }
          return newParam.join('\n')
        }
      },
      boundaryGap: true
    },
    series: {
      barWidth: 20,
      label: {
        normal: {
          position: 'top',
          formatter: '{c}'
        }
      },
      itemStyle: {
        normal: {
          barBorderRadius: 0
          // color: getLinear(['#0d2fee', '#06ff00'], 'y')
        }
      }
    }
  }
}
// 柱子太多时显示tooltip，不在柱子上显示数字
export const vbar_3 = {
  type: 'vbar',
  chart: {},
  stack: true, // 堆积图
  dataZoom: {
    show: true,
    start: '0%',
    end: '100%',
    borderColor: 'transparent'
  },
  chartOption: {},
  data: [],
  opt: {
    // color: ['#453ee9', '#704cff', '#4461ea', '#6e8fff', '#00d1f7', '#2cd78e'],
    grid: {
      bottom: '40',
      left: ' 10',
      right: '20',
      top: '30'
    },
    tooltip: {
      trigger: 'item',
      formatter: function(param) {
        return param.data.name + ' ' + param.data.seriesName + ': ' + param.data.value
      }
      // formatter: '{a0}: {c0}<br /> {a1}: {c1}<br />{a2}: {c2}<br />{a3}: {c3}<br />{a4}: {c4}'
    },
    yAxis: {
      name: '人',
      axisLabel: {
        formatter: param => param
      }
    },
    series: {
      barWidth: 20,
      itemStyle: {
        normal: {
          opacity: 1
        }
      },
      label: {
        normal: {
          show: false
        }
      }
    }
  }
}
export const vbar_4 = {
  type: 'vbar',
  chart: {},
  stack: true, // 堆积图
  dataZoom: true, // 显示拖动
  chartOption: {},
  data: [],
  opt: {
    // color: [getLinear(['#4461ea', '#03cdf7'], 'y'),
    //   getLinear(['#0D30E8', '#FACC14'], 'y'),
    //   getLinear(['#0d2fee', '#2EC299'], 'y'),
    //   getLinear(['#0d2fee', '#FF92F1'], 'y')],
    tooltip: {
      show: true,
      formatter: function(param) {
        var str = param[0].name + '</br>'
        for (var item of param) {
          if (item.data.seriesName && item.data.value) {
            str += item.data.seriesName + ' : ' + item.data.value + '人' + '</br>'
          }
        }
        return str
      }
    },
    grid: {
      bottom: '10',
      left: ' 10',
      right: '20',
      top: '10'
    },
    series: {
      barWidth: 20,
      itemStyle: {
        normal: {
          opacity: 0.6
        }
      },
      label: {
        normal: {
          show: false
        }
      }
    }
  }
}
export const line = {
  data: [], // 生成图标的数据
  type: 'line', // 图标类型
  // dataZoom: true, // 只要超过12条就会展示拖动条
  chartOption: {}, // 全量的默认配置
  chart: null, // echart.init后生成的echart对象
  opt: {
    grid: {
      left: '5',
      top: '30', // 上部需要放置坐标轴名称和图例
      bottom: '5', // 下边会有拖动轴
      right: '20'
    },
    tooltip: {
      trigger: 'axis',
      formatter: (param) => {
        let back = param[0].name + '<br/>'
        param.forEach((item) => {
          if (item.value && item.value !== '0') {
            back += (item.seriesName + ': ' + item.value + '<br/>')
          }
        })
        return back
      }
    },
    // color: [getLinear(['#704bfe', '#ff0071'], 'x'),
    //   getLinear(['#00d1f5', '#2cd78e'], 'x'),
    //   getLinear(['#0d2fee', '#4FB4FF'], 'y'),
    //   getLinear(['#0d2fee', '#2EC299'], 'y')],
    yAxis: {
      name: '人',
      axisLabel: {
        // color: '#fff',
        formatter: param => param,
        interval: 0
      },
      axisTick: {
        lineStyle: {
          // color: 'rgba(162,181,205,0.25)'
        }
      }
    },
    series: {
      yAxisIndex: 0,
      smooth: true,
      barBorderRadius: 0
    }
  } // 覆盖默认配置，规则参照echart官网
}
export const funnel = {
  type: 'funnel',
  chart: {},
  chartOption: {},
  data: [],
  opt: {
    backgroundColor: '',
    series: {
      left: 20,
      top: 40,
      bottom: 50,
      width: '160',
      minSize: '45px',
      label: {
        formatter: function(param) {
          return parseInt(param.data.rate) + '%'
        },
        position: 'inside'
      },
      gap: 2,
      itemStyle: {
        normal: {
          borderWidth: 0
        }
      },
      labelLine: {
        show: false
      }
    },
    // color: [getLinear(['rgba(58, 141, 251, 0.3)', '#3a8dfb'], 'y'),
    //   getLinear(['rgba(18, 242, 226, 0.3)', '#12f2e2'], 'y'),
    //   getLinear(['rgba(47, 194, 91, 0.3)', '#2fc25b'], 'y'),
    //   getLinear(['rgba(221, 198, 40, 0.3)', '#ddc628'], 'y'),
    //   getLinear(['rgba(226, 93, 161, 0.3)', '#39fedf'], 'y')
    // ],
    tooltip: {
      show: false
    },
    legend: {
      show: false
    }
  }
}
export const sunburst = {
  type: 'sunburst',
  chart: {},
  chartOption: {},
  data: [],
  opt: {
    radius: ['30%', '90%'],
    // color: ['#453ee9', '#2cd78e', '#f3bf56', '#704cff', '#4461ea', '#00d1f7'],
    series: [{
      label: {
        show: false
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      itemStyle: {
        borderColor: 'rgba(244,244,234,0.2)'
      }
    }]
  }
}
export const rose = {
  type: 'pie',
  chart: {},
  chartOption: {},
  data: [],
  opt: {
    legend: {
      show: false
    },
    series: {
      radius: [70, 120],
      roseType: 'area',
      label: {
        normal: {
          show: true,
          position: 'outside',
          formatter: '{b}:\n{c}件 ({d}%)'
        },
        emphasis: {
          show: true,
          formatter: '{b}:\n{c}件 ({d}%)'
        }
      },
      labelLine: {
        normal: {
          show: true,
          length: 30,
          length2: 40
        }
      }
    }
  }
}
export const halfPie = {
  type: 'halfPie',
  chart: {},
  chartOption: {},
  data: [],
  opt: {
    legend: {
      show: false
    },
    series: {}
  }
}
export const radar = {
  type: 'radar',
  chart: {},
  chartOption: {},
  data: {
    radar: [],
    series: []
  },
  opt: {
    // grid: {
    //   left: '5',
    //   top: '30', // 上部需要放置坐标轴名称和图例
    //   bottom: '0', // 下边会有拖动轴
    //   right: '20'
    // },
    // color: ['rgb(0, 209, 247)'],
    legend: {
      show: false
    },
    textStyle: {
      // color: '#fff',
      // fontFamily: 'PingFangSC-Regular', // 注意：改变echarts的字体为'腾讯体'，该字体需事先装在电脑中
      fontSize: 12
    },
    radar: {
      radius: '60%',
      shape: 'default',
      splitNumber: 6,
      axisLine: {
        lineStyle: {
          // color: '#006c87',
          opacity: 0.4
        }
      },
      splitLine: {
        lineStyle: {
          color: '#fff',
          opacity: 0.4
        }
      },
      splitArea: {
        areaStyle: {
          // color: 'rgba(17,105,127,0)'
        }
      }
    },
    series: {
      radius: '60%',
      symbolSize: 0,
      areaStyle: {
        normal: {
          // color: 'rgb(0, 209, 247)'
        }
      }
    }
  }
}
export const mix = {
  data: [],
  type: 'mix', // 图标类型
  chartOption: {}, // 全量的默认配置
  chart: null,
  types: [{ type: 'vbar', key: 'value' }, { type: 'line', key: 'rate' }],
  opt: {
    grid: {
      left: ' 10',
      right: '15',
      top: '30'
    },
    // color: [
    //   getLinear(['#4461ea', '#03cdf7'], 'y'),
    //   '#f3bf56',
    //   getLinear(['#0d2fee', '#2EC299'], 'y'),
    //   getLinear(['#0d2fee', '#FF92F1'], 'y')],
    tooltip: {
      // formatter: '{b}<br/>{a0}: {c0}件<br/>{a1}: {c1}件<br/>{a2}: {c2}件<br/>{a3}: {c3}%'
    },
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
    },
    legend: {
      show: true,
      right: '60' // 图例居中对齐
    },
    series: [{
      yAxisIndex: 0
    }, {
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
}
export const caseMix = {
  dataZoom: true,
  data: [],
  type: 'mix', // 图标类型
  chartOption: {}, // 全量的默认配置
  chart: null,
  types: [{ type: 'vbar', key: 'value' }, { type: 'line', key: 'rate' }],
  opt: {
    tooltip: {
      // formatter: '{b}<br/>{a0}: {c0}件<br/>{a1}: {c1}件<br/>{a2}: {c2}件<br/>{a3}: {c3}%'
    },
    series: [{
      yAxisIndex: 0
    }, {
      yAxisIndex: 1
    }]
  }
}

export const barMix = {
  data: [],
  type: 'mix', // 图标类型
  chartOption: {}, // 全量的默认配置
  chart: null,
  types: [{ type: 'vbar', key: 'rate' }, { type: 'line', key: 'value' }],
  opt: {
    tooltip: {
      // formatter: '{b}<br/>{a0}: {c0}件<br/>{a1}: {c1}件<br/>{a2}: {c2}件<br/>{a3}: {c3}%'
    },
    series: [{
      yAxisIndex: 0
    }, {
      yAxisIndex: 1
    }]
  }
}

export const pictorialBar = {
  type: 'pictorialBar',
  chart: {},
  chartOption: {},
  data: [],
  opt: {}
}

export const scatter = {
  data: [], // 生成图标的数据
  type: 'scatter', // 横向柱图
  chartOption: {}, // 全量的默认配置
  chart: null, // echart.init后生成的echart对象
  opt: { // 覆盖默认配置，规则参照echart官网
    tooltip: {
      axisPointer: {
        type: 'cross'
      }
    },
    series: {}
  }
}

export const wordCloud = {
  data: [], // 生成图标的数据
  type: 'wordCloud', // 文字云
  chartOption: {}, // 全量的默认配置
  chart: null, // echart.init后生成的echart对象
  opt: { // 覆盖默认配置，规则参照echart官网
  }
}
