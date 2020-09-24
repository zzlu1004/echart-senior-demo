import store from '@/store'
import { parseTime } from './filters'
import img_404 from '@/assets/404_images/404.png'
// import { req } from './common'
let dateId = new Date().getTime()
const monthDays = {
  '0': '31',
  '1': '29',
  '2': '31',
  '3': '30',
  '4': '31',
  '5': '30',
  '6': '31',
  '7': '31',
  '8': '30',
  '9': '31',
  '10': '30',
  '11': '31'
}
const year = new Date().getFullYear()
const monthQuarter = {
  '0': [year + '-01-01', year + '-03-31'],
  '1': [year + '-01-01', year + '-03-31'],
  '2': [year + '-01-01', year + '-03-31'],
  '3': [year + '-04-01', year + '-06-30'],
  '4': [year + '-04-01', year + '-06-30'],
  '5': [year + '-04-01', year + '-06-30'],
  '6': [year + '-07-01', year + '-09-30'],
  '7': [year + '-07-01', year + '-09-30'],
  '8': [year + '-07-01', year + '-09-30'],
  '9': [year + '-10-01', year + '-12-31'],
  '10': [year + '-10-01', year + '-12-31'],
  '11': [year + '-10-01', year + '-12-31']
}
const month = new Date().getMonth()
const today = parseTime(new Date(), '{y}-{m}-{d}')
const timeRange = {
  'year': [year + '-01-01', year + '-12-31'],
  'quarter': monthQuarter[month],
  'half': month > 5 ? [year + '-07-01', year + '-12-31'] : [year + '-01-01', year + '-06-30'],
  'month': [firstDayOfMonth(), endDayOfMonth()],
  'week': [firstDayOfWeek(), endDayOfWeek()],
  'today': [today, today]
}
const tools = {
  getId() {
    return '' + dateId++
  },
  merge,
  type,
  mapSelects,
  param2Obj,
  removeImg,
  getImage,
  trampoline,
  firstDayOfYear,
  firstDayOfMonth,
  endDayOfMonth,
  firstDayOfWeek,
  endDayOfWeek,
  getTimeRange,
  getTime,
  getPointOfSegment,
  download,
  download2,
  downloadStatic,
  downloadByHtml,
  changeTimeAmOrPm,
  getNowTime,
  tablePrint,
  getStringWidth,
  setStorage,
  getStorage,
  goDetail
}
function goDetail(code, params = {}) {
  this.$router.push({
    path: this.$route.path + '/' + code,
    ...params
  })
}
const selectMap = {}
let originalParams = {}
/**
 * 对象拷贝
 * @param {Boolean} 是否深度拷贝
 * @param [...Object] 需要继承的对象
 * @return {Object}
 **/
function merge(deep, target, ...sources) {
  return window.$.extend(deep, target, ...sources)
}
/**
 * 获取线段的随机一个点
 * @param start 起点
 * @param end 终点
 * @return [] 坐标
 **/
function getPointOfSegment(start, end) {
  const x = start[0]
  const y = start[1]
  return [x + Math.random() * (end[0] - x), y + Math.random() * (end[1] - y)]
}
/**
 * 父级页面进入子级页面，存储父级页面的参数
 * @param {String} key
 * @param {Object} value
 **/
function setStorage(value = {}) {
  originalParams = merge(true, {}, value)
}
/**
 * 子级页面返回父级页面，获取父级页面的参数，渲染父级页面，保留页面操作
 * @param {String} key
 * @param {Object} value
 **/
function getStorage(ey) {
  const back = merge(true, {}, originalParams)
  originalParams = {}
  return back
}
/**
 * 获取服务器上图片
 * @param attId
 * @return String
 **/
function getImage(attId) {
  // return 'http://192.168.0.212:8017/api/attachments/' + attId + '/image?Authorization=' + store.getters.token
  const imgUrl = 'url("' +
    process.env.BASE_API + window.config.basic_url + 'api/attachments/' + attId + '/image?Authorization=' + store.getters.token +
    '"),url(' + img_404 + ')'
  return imgUrl
}
/**
 * 判断数据类型
 * @param 待判断参数
 * @return 返回参数类型
 **/
function type(params) {
  return Object.prototype.toString.apply(params).replace(/[\[\]]/g, '').split(/\s+/)[1]
}
/**
 * 判断数据类型
 * @param 带html标签的字符串
 * @return 删除里面img元素后的字符串
 **/
function removeImg(data) {
  return data.replace(/<img\s[^\>]*?>/g, '').replace(/<h\d>/g, '').replace(/<p>/g, '').replace(/<\/\S{1,4}>/g, '</br>')
}
/**
 * 获取url携带的参数
 * @param url
 * @return object
 **/
function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}
/**
 * 蹦床函数，采用“循环”换掉“递归”
 * @param function
 * @return 函数执行结果
 **/
function trampoline(f) {
  while (f && f instanceof Function) {
    f = f()
  }
  return f
}
/**
 * 获取下拉框的id和value的映射关系
 * @param key 需要返回哪个拉下选项集
 * @return map
 **/
function mapSelects(key) {
  const map = {}
  if (selectMap[key]) {
    return selectMap[key]
  }
  const list = store.getters.selects[key] || []
  for (const item of list) {
    map[item.id] = item.name
  }
  selectMap[key] = map
  return map
}
function firstDayOfYear(date = new Date()) {
  return new Date(date).getFullYear() + '-01-01'
}
function firstDayOfMonth(date = new Date()) {
  return parseTime(date, '{y}-{m}') + '-01'
}
function endDayOfMonth(date = new Date()) {
  let day = monthDays[new Date(date).getMonth()]
  const yearM = parseTime(date, '{y}-{m}')
  const monthDay = new Date(yearM + '-' + day)
  if (day === '29' && monthDay.getMonth() === 2) {
    day = '28'
  }
  return yearM + '-' + day
}
function firstDayOfWeek(date = new Date()) {
  date = new Date(parseTime(date, '{y}-{m}-{d}'))
  const times = date.getTime()
  const dayLong = 86400000
  let week = date.getDay() - 1
  week = week < 0 ? 6 : week
  const start = times - week * dayLong
  return parseTime(new Date(start), '{y}-{m}-{d}')
}
function endDayOfWeek(date = new Date()) {
  date = new Date(parseTime(date, '{y}-{m}-{d}'))
  const times = date.getTime()
  const dayLong = 86400000
  let week = date.getDay() - 1
  week = week < 0 ? 6 : week
  const end = times + (7 - week) * dayLong
  return parseTime(new Date(end), '{y}-{m}-{d}')
}
function getTimeRange(time) {
  if (time) {
    const startD = parseTime(time[0], '{y}-{m}-{d}')
    const start = new Date(startD)
    const startM = start.getMonth()
    const endD = parseTime(time[1], '{y}-{m}-{d}')
    const end = new Date(endD)
    const endM = end.getMonth()
    const nextDayM = new Date(end.getTime() + 86400000).getMonth()
    const dateD = parseTime(new Date(), '{y}-{m}-{d}')
    const date = new Date(dateD)
    if (date.getTime() >= start.getTime() && date.getTime() <= end.getTime()) {
      if (/01$/.test(startD)) { // 年，半年，季，月的开始时间都是01日
        if (/01-01$/.test(startD)) { // 一月1号开始的判断是本年或者上半年或者第一季
          if (/12-31$/.test(endD)) {
            return 'year'
          } else if (/06-30$/.test(endD)) {
            return 'half'
          } else if (/03-31$/.test(endD)) {
            return 'quarter'
          }
        } else if (endM !== nextDayM) { // endD是月份的最后一天
          if (/12-31$/.test(endD) && /07-01$/.test(startD)) {
            return 'half' // 下半年
          } else if (startM % 3 === 0 && startM - startM === 2) {
            return 'quarter'
          } else if (startM - startM === 0) {
            return 'month'
          }
        }
      }
      // 本日和本周也可能是1号也可能不是一号
      if (startD === endD === dateD) {
        return 'today'
      } else if (start.getDay() === 1 && end.getDay() === 0) {
        return 'week'
      }
    } else {
      return ''
    }
  } else {
    return ''
  }
}
function getTime(type) {
  return timeRange[type]
}
function changeTimeAmOrPm(date = new Date()) {
  const hours = new Date(date).getHours()
  if (hours > 17) {
    return '晚上'
  } else if (hours > 11) {
    return '下午'
  } else {
    return '上午'
  }
}
function download(id, url, params) {
  let href = process.env.BASE_API
  if (url) {
    href += (window.config.project_url + url)
  } else {
    href += ('/zuul' + window.config.basic_url + 'api/attachments/' + id)
  }
  href += '?'
  if (params) {
    for (const key in params) {
      if (params[key] === null) {
        href = href + key + '=&'
      } else {
        href = href + key + '=' + params[key] + '&'
      }
    }
  }
  href += 'Authorization=' + store.getters.token
  location.href = encodeURI(href)
}
// 地址中不需要 project_url: '/kpi/'
function download2(id, url, params) {
  let href = process.env.BASE_API
  if (url) {
    href += url
  } else {
    href += ('/zuul' + window.config.basic_url + 'api/attachments/' + id)
  }
  href += '?'
  if (params) {
    for (const key in params) {
      if (params[key] === null) {
        href = href + key + '=&'
      } else {
        href = href + key + '=' + params[key] + '&'
      }
    }
  }
  href += 'Authorization=' + store.getters.token
  location.href = encodeURI(href)
}
function downloadByHtml(data, url, requestType) {
  let href = process.env.BASE_API
  var method = requestType || 'get'
  if (typeof (data) === 'string') {
    data = {}
  }
  if (url) {
    href += (window.config.project_url + url)
  } else {
    href += ('/zuul' + window.config.basic_url + 'api/attachments/owners/batch')
  }
  href += '?Authorization=' + store.getters.token
  if (href && data) {
    let inputs = ''
    for (const key in data) {
      inputs += "<input type='hidden' enctype='application/x-www-form-urlencoded' name='" + key + "' value = '" + (method === 'get' ? encodeURI(data[key]) : data[key]) + "' />"
    }
    var node = document.createElement('form')
    node.setAttribute('id', 'downloadForm')
    if (document.body.append) {
      document.body.append(node)
    } else if (document.body.appendChild) {
      document.body.appendChild(node)
    }
    // document.getElementsByTagName('form')[0].setAttribute('id', 'downloadForm')
    const obj = document.getElementById('downloadForm')
    obj.setAttribute('action', href)
    obj.setAttribute('method', method)
    obj.innerHTML = inputs
    obj.submit()
    if (obj.remove) {
      obj.remove()
    } else {
      obj.parentNode.removeChild(obj)
    }
  }
}
function tablePrint($table) {
  const width = 1100
  const br = ''// <div style="page-break-after: always;"></div>'
  const $width = 1100
  const num = Math.floor($width / width) + ($width % width === 0 ? 0 : 1)
  const $dom = window.$('<div>')
  for (let i = 0; i < num; i++) {
    if (i !== 0) {
      $dom.append(br)
    }
    const $clone = $table.clone().css({ 'height': 'auto' })
    $clone.find('.el-table--scrollable-y').css({ 'height': 'auto' })
    $clone.find('.el-table__body-wrapper').css({ 'height': 'auto' })
    $clone.css({ 'margin-left': (-i * width + 'px') })
    $clone.find('colgroup').remove()
    $dom.append(window.$('<div>').css({ 'position': 'relative', overflow: 'hidden', width: width + 'px' }).append($clone))
  }
  $dom.printArea({ extraCss: 'static/print/printTable.css' })
}
export function downloadStatic(url) {
  location.href = encodeURI(url)
}
export function getNowTime() {
  return new Date().getTime() + parseFloat(store.getters.globals.msec)
}
export function getStringWidth(str) {
  const widthObj = {
    '案由': 150,
    '案号': 200,
    '部门': 150,
    '所在部门': 150,
    '承办部门': 150,
    '姓名': 100,
    '法官': 100,
    '序号': 60,
    '操作2': 150,
    '操作3': 200
  }
  return widthObj[str] || (str.length * 16 + 48) // (16: 排序按钮的宽度 + 32：右边距)
}
export default tools
