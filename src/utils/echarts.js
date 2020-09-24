import tools from './tools'
import Data from './data'
import code from '@/components/echarts/src/codeMap/code'
// import store from '@/store'

const departId = '34'
// const departId = store.getters.user.departId || '34'
const codeMap = code[departId]
const color_bar = ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0', '#3436C7', '#223273', '#578DC6',
  '#9CCF25', '#AC662E', '#BC2F5C', '#6D7C9D', '#51599D', '#5D71CB', '#304B94']
const color_line = ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0', '#3436C7', '#223273', '#578DC6',
  '#9CCF25', '#AC662E', '#BC2F5C', '#6D7C9D', '#51599D', '#5D71CB', '#304B94']
const color_pie = ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0', '#3436C7', '#223273', '#578DC6',
  '#9CCF25', '#AC662E', '#BC2F5C', '#6D7C9D', '#51599D', '#5D71CB', '#304B94']
const color_title = '#404040' // 标题
const color_text = '#8b8b8b' // 默认文本颜色
const color_bg = '#fff' // 背景色
const color_axisTick = '#ebebeb' // 坐标轴刻度线
const color_axisLine = '#ebebeb' // 轴线
const color_axisLabel = '#8b8b8b' // 坐标轴刻度标签
const color_splitLine = '#ebebeb' // 坐标轴里面的辅助线
const pictorialBarList = ['rgba(26,149,231,0.2)', 'rgba(0,200,83,0.2)', 'rgba(255,191,0,0.2)', 'rgba(239,65,51,0.2)']
// 文本属性
const textStyle = {
  color: color_text,
  fontFamily: 'Microsoft YaHei',
  fontSize: '14'
}
// 标题
const title = {
  text: '',
  top: '5',
  left: '10',
  textStyle: {
    fontSize: '16',
    fontWeight: 'normal',
    color: color_title
  }
}
// 背景色
const backgroundColor = color_bg
// 图例-上方右对齐
const legend = {
  data: [],
  top: '0',
  icon: 'circle',
  itemHeight: '10',
  type: 'scroll', // 图例多的时候出现滚动条
  width: '70%', // 图例最多占一半的宽度
  selectedMode: false, // 图标不可点
  right: '60', // 图例居中对齐
  textStyle: {
    fontSize: '14'
  }
}
// 笛卡尔坐标轴下图表的间距
const grid = {
  containLabel: true, // 区域是否包含坐标轴的刻度标签。
  left: '32',
  top: '35', // 上部需要放置坐标轴名称和图例
  bottom: '75', // 下边会有拖动轴
  right: '32'
}
// 坐标轴刻度不显示
const axisTickHide = {
  show: false
}
// 坐标轴刻度相关
const axisTick = {
  show: true,
  // interval: 0,
  // length: 5,
  alignWithLabel: true,
  inside: true,
  lineStyle: {
    color: color_axisTick
  }
}
// 坐标轴轴线不显示
const axisLine_y = {
  lineStyle: {
    color: color_axisLine,
    width: 2
  }
}
// 坐标轴轴线
const axisLine = {
  lineStyle: {
    color: color_axisLine
  }
}
// 坐标轴刻度标签
const axisLabel = {
  color: color_axisLabel,
  formatter: function(value) {
    let back = value
    if (value && value.length > 6) {
      back = value.substring(0, 5) + '...'
    }
    return back
  }
}
// 坐标轴在 grid 区域中的分隔线不显示
const splitLineHide = {
  show: false
}
// 坐标轴在 grid 区域中的分隔线
const splitLine = {
  show: true,
  lineStyle: {
    color: color_splitLine,
    type: 'dotted'
  }
}

const xAxis = {
  type: 'category',
  data: [],
  axisTick,
  splitLine: splitLineHide,
  axisLine,
  axisLabel,
  nameLocation: 'end',
  name: ''
}
const yAxis = {
  type: 'value',
  splitLine,
  axisLabel,
  axisTick: axisTickHide,
  axisLine: axisLine_y,
  name: ''
}
const commonOpt = {
  textStyle,
  title,
  legend,
  backgroundColor
}
const polar = {

}
const angleAxis = {

}
const radiusAxis = {
  type: 'category',
  data: [],
  z: 10
}
const series_wordCloud = {
  type: 'wordCloud',
  shape: 'circle',
  sizeRange: [12, 18],
  gridSize: 6,
  left: 'center',
  top: 'center',
  width: '96%',
  height: '50%',
  rotationRange: [0, 0],
  textStyle: {
    normal: {
      // Color can be a callback function or a color string
      color: '#666'
      // color: function() {
      //   // Random color
      //   return 'rgb(' + [
      //     Math.round(Math.random() * 120 + 135),
      //     Math.round(Math.random() * 120 + 135),
      //     Math.round(Math.random() * 120 + 135)
      //   ].join(',') + ')'
      // }
    },
    emphasis: {
      shadowBlur: 10,
      shadowColor: '#333'
    }
  }
}
const series_hbar = {
  type: 'bar',
  barMaxWidth: '20px',
  data: []
}
// 旭日图
const series_sunburst = {
  type: 'sunburst',
  data: [],
  center: ['50%', '50%'],
  radius: ['15%', '75%'],
  label: {
    show: false
  },
  levels: [
    {
      // 留给数据下钻点的空白配置
    },
    // 第一层
    {
      r0: '20%',
      r: '40%',
      label: {
        show: false
      }
    },
    // 第二层
    {
      r0: '40%',
      r: '65%',
      label: {
        position: 'outside',
        padding: 3,
        silent: false
      }
    }
  ]
}
const series_bar = {
  ...series_hbar,
  barGap: 0
}

const series_line = {
  type: 'line',
  name: '',
  data: []
}
const series_pie = {
  type: 'pie',
  radius: ['0%', '55%'],
  center: ['50%', '50%'],
  data: [],
  label: {
    normal: {
      show: true,
      formatter: '{b}:\n{c} ({d}%)'
    }
  },
  labelLine: {
    normal: {
      show: true
    }
  }
}
const series_pie_m = {
  type: 'pie',
  clockWise: true,
  itemStyle: {
    normal: {
      label: {
        show: true,
        position: 'outside'
      },
      labelLine: {
        show: true
      }
    }
  },
  hoverAnimation: false
}

const series_scatter = {
  type: 'scatter',
  name: '',
  data: []
}
const series_map = {
  type: 'map',
  selectedMode: 'single',
  label: {
    normal: {
      show: true
    },
    emphasis: {
      show: true
    }
  },
  itemStyle: {
    areaColor: '#e1e1e1'
  },
  data: []
}
const series_radar = {
  type: 'radar',
  areaStyle: { normal: {}},
  itemStyle: {},
  data: []
}
const series_polarBar = {
  type: 'bar',
  data: [],
  coordinateSystem: 'polar',
  name: '',
  stack: ''
}
const echartOpt = {
  mix: {
    color: color_bar,
    tooltip: { trigger: 'axis' },
    grid,
    xAxis,
    series: []
  },
  vbar: {
    color: color_bar,
    tooltip: { trigger: 'axis' },
    grid,
    xAxis: {
      ...xAxis
    },
    yAxis,
    series: series_bar
  },
  hbar: {
    color: color_bar,
    tooltip: { trigger: 'axis' },
    grid: tools.merge(true, {}, grid, { right: '80px' }),
    xAxis: {
      ...yAxis,
      axisLine: {
        show: false
      }
    },
    yAxis: tools.merge(true, {}, xAxis, { inverse: true }),
    series: series_hbar
  },
  pictorialBar: {
    grid: tools.merge(true, {}, grid),
    xAxis,
    yAxis,
    series: {
      type: 'pictorialBar'
    }
  },
  pie: {
    animation: false,
    calculable: true,
    color: color_pie,
    series: series_pie
  },
  pie_m: {
    animation: false,
    calculable: true,
    color: color_pie,
    series: series_pie_m
  },
  line: {
    color: color_line,
    grid,
    xAxis,
    yAxis,
    tooltip: { trigger: 'axis' },
    series: series_line
  },
  // 散点图
  scatter: {
    color: color_bar,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    grid,
    xAxis: {
      type: 'value',
      axisTick,
      splitLine: splitLineHide,
      axisLine,
      axisLabel,
      name: ''
    },
    yAxis: {
      type: 'value',
      axisTick,
      splitLine: splitLineHide,
      axisLine,
      axisLabel,
      name: ''
    },
    series: series_scatter
  },
  // 地图
  map: {
    animation: false,
    visualMap: {
      min: 0,
      max: 1000,
      hoverLink: false,
      show: false,
      color: ['#3a8dfb', '#39fdef'],
      textStyle: { color: '#fff' }
    },
    series: series_map
  },
  // 散点图和地图结合
  'scatter-map': {
    animation: true,
    visualMap: {
      show: false,
      min: 0,
      max: 12,
      text: ['高', '低'], // 文本，默认为数值文本
      seriesIndex: [1],
      inRange: {
        color: ['#224786', '#e8e6f8']
      }
    }
  },
  // 桑基图
  sankey: {
    series: {
      type: 'sankey',
      data: {}
    }
  },
  // 雷达图
  radar: {
    color: color_line,
    tooltip: {},
    radar: {
      center: ['50%', '50%'],
      radius: '50%',
      name: {
        textStyle: {
          color: color_axisLabel,
          padding: [3, 5]
        }
      },
      splitArea: {
        areaStyle: {
          color: 'rgba(255,255,255,0)'
        }
      },
      indicator: []
    },
    series: series_radar
  },
  // 漏斗图
  funnel: {
    calculable: true,
    color: color_line,
    series: {
      name: '',
      type: 'funnel',
      funnelAlign: 'center',
      data: []
    }
  },
  // 仪表盘
  gauge: {
    grid: {
      bottom: 'auto'
    }
  },
  // 180度的
  polarBar: {
    polar,
    radiusAxis,
    angleAxis,
    series_polarBar
  },
  // 旭日图
  sunburst: {
    color: color_pie,
    series: series_sunburst,
    tooltip: {
      formatter: (p) => {
        if (p.name) {
          return p.marker + p.name + '：' + p.value
        } else {
          return '返回上一级'
        }
      }
    }
  },
  // 文字云
  wordCloud: {
    series: series_wordCloud
  }
}

const echart = {
  getDefaultOption,
  refreshOption,
  dealChart_vbar,
  dealChart_hbar,
  dealChart_mix,
  dealChart_line,
  dealChart_scatter,
  dealChart_pie,
  dealChart_pie_m,
  dealChart_map,
  dealChart_scatter_map,
  dealChart_sankey,
  dealChart_radar,
  dealChart_funnel,
  dealChart_gauge,
  dealChart_pictorialBar,
  dealChart_polarBar,
  dealChart_sunburst,
  dealChart_wordCloud,
  getCodeMap,
  getCityName,
  getCityCode,
  getCityPath,
  getPrevCode,
  getDefaultyAxis,
  getColors
}
function getColors(type) {
  return echartOpt[type].color
}
function getDefaultyAxis(opt) {
  return { ...yAxis, ...opt }
}
function getCodeMap() {
  return codeMap
}
function getCityName(code) {
  return codeMap.code[code]
}
function getCityCode(name) {
  return codeMap.city[name]
}
function getPrevCode(code) {
  if (code.length > 2) {
    code = code.substring(0, code.length - 2)
  }
  return code
}
function getCityPath(code) {
  const add = []
  for (let i = departId.length; i <= code.length;) {
    const id = code.substring(0, i)
    add.push({ code: id, name: codeMap.code[id] })
    i += 2
  }
  return add
}

function getChartClasses(data) {
  const series = Data.classify(data, 'seriesName')
  // series[key] 的数组转换成obj
  for (const key in series) {
    series[key] = Data.classify(series[key], 'name')
  }
  // 获取所有横坐标
  const category = Data.getDifByKey(data, 'name')
  const seriesList = Data.getDifByKey(data, 'seriesName')
  return { series, category, seriesList }
}
// 对echart数据做简单的分类
function dealChart(options, opt) {
  const { series, category, seriesList } = getChartClasses(options.data)
  // 取对应的类型的series做模板配置
  const seriesItem = tools.merge(true, {}, echartOpt[options.type].series, options.opt.series)
  if (options.stack) {
    seriesItem.stack = 'seriesName'
    if (options.type === 'line') {
      seriesItem.areaStyle = { normal: { opacity: 0.5 }}
    }
  }
  // 保存需要重新生成的series
  const serieses = getChartSeries(seriesList, category, series, seriesItem)
  return { category, seriesList, serieses }
}
function getChartSeries(seriesList, category, series, seriesItem) {
  const serieses = []
  for (const seriesKey of seriesList) {
    const item = tools.merge(true, {}, seriesItem, { name: seriesKey })
    item.data = []
    for (const xName of category) {
      if (series[seriesKey][xName]) {
        const items = Data.changeObjKey(series[seriesKey][xName][0], { id: 'ids' })
        item.data.push(items)
      } else {
        item.data.push({ name: xName, value: '' })
      }
    }
    serieses.push(item)
  }
  return serieses
}
// function getScatterSeries(seriesList, category, series, seriesItem) {
//   const serieses = []
//   let yIndex = 0
//   let xIndex = 0
//   for (const seriesKey of seriesList) {
//     xIndex = 0
//     const item = tools.merge(true, {}, seriesItem, { name: seriesKey })
//     item.data = []
//     for (const xName of category) {
//       if (series[seriesKey][xName]) {
//         const items = [xIndex, yIndex, series[seriesKey][xName][0].value]
//         item.data.push(items)
//       } else {
//         item.data.push([xIndex, yIndex, '0'])
//       }
//       xIndex++
//     }
//     yIndex++
//     serieses.push(item)
//   }
//   return serieses
// }
// 横坐标很多的时候显示拖动category：横坐标，options.end：true显示最后的，默认显示前20条
function showDataZoom(category, options, opt, orient) {
  orient = orient || 'horizontal'
  const length = orient === 'vertical' ? 5 : 12
  if (options.dataZoom) {
    if (category.length > length) {
      // const rate = Data.getRate(length, category.length)
      opt.dataZoom = [{
        type: 'inside',
        bottom: 10,
        start: 0,
        end: 50,
        orient: orient
      }, {
        bottom: 10,
        start: 0,
        end: 50,
        textStyle: {
          color: 'rgba(0,0,0,0)'
        },
        [orient === 'vertical' ? 'width' : 'height']: '20px',
        orient: orient,
        zoomLock: false,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }]
    } else {
      opt.dataZoom = []
    }
  } else {
    opt.dataZoom = []
  }
}
function dealChart_vbar(options, opt) {
  const { category, seriesList, serieses } = dealChart(options, opt)
  opt.xAxis.data = category
  opt.legend.data = seriesList
  opt.series = serieses
  if (options.orient === 'vertical') {
    showDataZoom(seriesList, options, opt, options.orient)
  } else {
    showDataZoom(category, options, opt, options.orient)
  }
}
function dealChart_hbar(options, opt) {
  const { category, seriesList, serieses } = dealChart(options, opt)
  opt.yAxis.data = category
  opt.legend.data = seriesList
  opt.series = serieses
  if (options.orient === 'vertical') {
    showDataZoom(category, options, opt, options.orient)
  } else {
    showDataZoom(seriesList, options, opt, options.orient)
  }
}
function dealChart_line(options, opt) {
  const { category, seriesList, serieses } = dealChart(options, opt)
  opt.xAxis.data = category
  opt.legend.data = seriesList
  opt.series = serieses
  if (options.orient === 'vertical') {
    showDataZoom(seriesList, options, opt, options.orient)
  } else {
    showDataZoom(category, options, opt, options.orient)
  }
}
function dealChart_scatter(options, opt) {
  const data = []
  options.data.forEach((item) => {
    data.push({ name: item.name, value: [item.x, item.y, item.value] })
  })
  opt.series.data = data
}
// function dealChart_scatter(options, opt) {
//   const data = options.data
//   // const count = Data.getCount(data, 'value') // 获取总量
//   const { series, category, seriesList } = getChartClasses(data)
//   opt.xAxis.data = category
//   opt.yAxis.data = seriesList
//   opt.legend.data = seriesList
//   const seriesItem = tools.merge(true, {
//     'symbolSize': val => val[2] ? Math.floor(val[2] / 2) : val[2]
//     // 'symbolSize': val => val[2] ? (Data.getBaseLog(10, val[2] / count) * 10) : val[2]
//   }, series_scatter, opt.series)
//   const categorys = category.sort((a, b) => a - b)
//   const serieses = getScatterSeries(seriesList, categorys, series, seriesItem)
//   if (options.orient === 'vertical') {
//     showDataZoom(seriesList, options, opt, options.orient)
//   } else {
//     showDataZoom(categorys, options, opt, options.orient)
//   }
//   opt.series = serieses
// }
function dealChart_pie(options, opt) {
  opt.legend.data = Data.getDifByKey(options.data, 'name')
  opt.series.data = options.data
  delete opt.yAxis
}
function dealChart_pie_m(options, opt) {
  const data = options.data
  const color = opt.color || color_pie
  const seriesObjs = []
  const r = options.radius || 150
  const width = 15
  const startAngle = 60
  const leng = data.length
  const placeHolderStyle = {
    normal: {
      label: {
        show: false
      },
      labelLine: {
        show: false
      },
      color: 'rgba(255, 255, 255, 0)',
      borderColor: 'rgba(255, 255,255, 0.5)',
      borderWidth: 1,
      borderType: 'dashed'
    }
  }
  for (let i = 0; i < leng; i++) {
    const seriesObj = {
      name: data[i].name,
      radius: [r - 1 - i * width, r - i * width],
      startAngle: startAngle * (leng - i - 1),
      itemStyle: {
        normal: {
          color: color[i],
          labelLine: {
            length: i * width + width
          },
          borderColor: color[i],
          borderWidth: width * 0.6
        }
      },
      data: [data[i], {
        value: data[i].value / data[i].rate - data[i].value,
        name: '',
        itemStyle: placeHolderStyle
      }]
    }
    tools.merge(true, seriesObj, echartOpt[options.type].series, opt.series)
    seriesObjs.push(seriesObj)
  }
  opt.series = seriesObjs
}
function dealChart_map(options, opt) {
  const minMax = Data.getMinMax(options.data, 'value')
  opt.visualMap.min = minMax.min
  opt.visualMap.max = minMax.max
  const selectName = options.selectName
  const data = options.data
  for (const item of data) {
    if (item.name === selectName) {
      item.selected = true
      break
    }
  }
  opt.series.data = data
  delete opt.legend
}
function dealChart_scatter_map(options, opt) {

}
function dealChart_polarBar(options, opt) {
  const { category, serieses } = dealChart(options, opt)
  const max = Data.getMinMax(options.data, 'value').max * 2.2
  opt.radiusAxis.data = category
  opt.angleAxis.max = max
  opt.series = serieses
}
// 旭日图
function dealChart_sunburst(options, opt) {
  const series = Data.changeToTree(options.data, 'id', 'pid')
  opt.series.data = series
}

function dealChart_wordCloud(options, opt) {
  opt.series.data = options.data
}
function dealChart_funnel(options, opt) {
  opt.series.data = options.data
}
function dealChart_gauge(options, opt) {
  const data = options.data
  const series = []
  series.push(getGaugeItem(data, name, opt))
  opt.series = series
}
function getGaugeItem(data, name, opt) {
  const obj = tools.merge(true, {
    name: name,
    type: 'gauge',
    splitNumber: 4,
    radius: '70%',
    min: data.min || 0,
    max: data.max || 100,
    axisLine: { // 坐标轴线
      lineStyle: {
        color: [[0.09, '#1B95E7'], [0.82, '#1B95E7'], [1, '#1B95E7']],
        width: 8
      }
    },
    axisLabel: { // 坐标轴小标记
      show: true
    },
    axisTick: { // 坐标轴小标记
      length: 2, // 属性length控制线长
      lineStyle: { // 属性lineStyle控制线条样式
        color: '#e5f3ff'
      }
    },
    splitLine: { // 分隔线
      length: 6, // 属性length控制线长
      lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
        color: '#e5f3ff',
        width: 1
      }
    },
    title: {},
    detail: {},
    pointer: {
      length: '60%',
      width: 2
    },
    data: [data]
  }, opt)
  return obj
}
function dealChart_pictorialBar(options, opt) {
  const data = options.data
  let max = options.max
  // const color = options.color || 'rgba(58,139,250,0.6)'
  const dir = options.direction || 'xAxis'
  const symbolSize = dir === 'xAxis' ? [20, 5] : [5, 20]
  const axis = []
  const maxData = []
  if (!max) {
    max = Data.getMinMax(options.data, 'value').max
    max = Math.floor(max * 1.1)
    const str = max.toString()
    max = (parseInt(str.charAt(0)) + 1) * Math.pow(10, str.length - 1)
  }
  for (let i = 0; i < data.length; i++) {
    axis.push(data[i].name)
    maxData.push(max)
  }
  const series = [{
    type: 'bar',
    // itemStyle: {
    //   normal: {
    //     color: 'rgba(26,149,231,0.2)',
    //     borderWidth: '1',
    //     borderColor: 'rgba(26,149,231,0.2)'
    //   }
    // },
    tooltip: {
      show: false
    },
    itemStyle: {
      // 通常情况下：
      normal: {
        // 每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
        color: function(params) {
          var colorList = pictorialBarList
          return colorList[params.dataIndex]
        },
        borderWidth: '1'
      }
    },
    barGap: '-70%',
    barWidth: 30,
    data: maxData,
    animation: false
  }, {
    type: 'pictorialBar',
    symbol: 'rect',
    symbolSize: symbolSize,
    symbolRepeat: true,
    z: 9,
    itemStyle: {
      normal: {
        color: '#1b95e7'
      }
    },
    label: {
      normal: {
        color: '#1b95e7',
        show: true,
        position: 'top',
        fontSize: 12
      }
    },
    data: data
  }]
  opt.series = series
  opt[dir].data = axis
}
function dealChart_radar(options, opt) {
  const radar = options.data.radar || []
  const { series } = getChartClasses(options.data.series)
  const opt_series = []
  const legend_data = []
  let j = 0
  for (const key in series) {
    const seriesItem = tools.merge(true, {}, echartOpt[options.type].series, options.opt.series)
    legend_data.push(key)
    seriesItem.name = key
    // console.log(Object.values(series[key])[0].seriesColor)
    const seriesFirst = Object.values(series[key])
    // console.log(seriesFirst[0][0])
    // 配置颜色 和 透明度，先这样处理，后期优化
    if (seriesFirst && seriesFirst[0] && seriesFirst[0][0] && seriesFirst[0][0].seriesColor) {
      seriesItem.itemStyle.color = seriesFirst[0][0].seriesColor
      seriesItem.lineStyle = { width: 1 }
      seriesItem.areaStyle.normal.opacity = 0.3
    } else {
      seriesItem.itemStyle.color = color_line[j]
    }
    seriesItem.data = []
    const item = []
    for (let i = 0; i < radar.length; i++) {
      item.push(series[key][radar[i].name] ? series[key][radar[i].name][0].value : '')
    }
    seriesItem.data.push(item)
    opt_series.push(seriesItem)
    j++
  }
  opt.radar.indicator = radar
  opt.series = opt_series
  opt.legend.data = legend_data
  // console.log(JSON.stringify(options))
  // console.log(JSON.stringify(opt))
}
function dealChart_sankey(options, opt) {
  opt.series.data = options.data.data
  opt.series.links = options.data.links
}
function dealChart_mix(options, opt) {
  opt.xAxis.data = Data.getValuesByKey(options.data, 'name')
  opt.series = []
  const types = options.types
  for (let i = 0; i < types.length; i++) {
    const item = tools.merge(true, {}, echartOpt[types[i].type].series, options.opt.series[i])
    item.data = Data.getValuesByKey(options.data, types[i].key)
    opt.series.push(item)
  }
  opt.legend.data = opt.series
  showDataZoom(opt.xAxis.data, options, opt, options.orient)
}
function getDefaultOption(type, opt, mapCode) {
  if (type === 'mix') {
    const option = tools.merge(true, { yAxis: [] }, commonOpt, echartOpt[type], opt)
    for (let i = 0; i < option.yAxis.length; i++) {
      option.yAxis[i] = tools.merge(true, {}, yAxis, option.yAxis[i])
    }
    return option
  } else if (type === 'sankey' || type === 'polarBar') {
    return tools.merge(true, {}, echartOpt[type], opt)
  } else if (type === 'map') {
    return tools.merge(true, {}, echartOpt[type], {
      series: {
        name: getCityName(mapCode),
        map: mapCode
      }
    }, opt)
  } else {
    return tools.merge(true, {}, echartOpt[type], commonOpt, opt)
  }
}
function refreshOption(options, opt) {
  opt.legend = opt.legend || tools.merge(true, {}, legend)
  echart['dealChart_' + options.type](options, opt)
}
// colors: 颜色, dir: 渐变色的方向，x: y
export function getLinear(colors = ['#0d2fee', '#06ff00'], dir = 'x') {
  return {
    type: 'linear',
    x: 0,
    y: dir === 'x' ? 0 : 1,
    x2: dir === 'x' ? 1 : 0,
    y2: 0,
    colorStops: [{
      offset: 0, color: colors[0] // 0% 处的颜色
    }, {
      offset: 1, color: colors[1] // 100% 处的颜色
    }],
    globalCoord: false // 缺省为 false
  }
}
export default echart
