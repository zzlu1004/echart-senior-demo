function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return '--'
  }
  // 参数time处理（解决ie下兼容问题）
  const reg = new RegExp(cFormat.replace(/{y}/g, '\\d{4}').replace(/{(m|d|h|i|s)+}/g, '\\d{2}'))
  if (reg.test(time) && Object.prototype.toString.apply(time).substring(8, 14) === 'String') {
    return time.match(reg)[0]
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else if (/^\d+$/.test(time)) {
    date = new Date(parseInt(time))
  } else { // '2018-01-11 00:00:00'
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['日', '一', '二', '三', '四', '五', '六'][value]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option = '{y}-{m}-{d}') {
  // time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  } else if (diff < 3600 * 24 * 3) {
    return '2天前'
  } else if (diff < 3600 * 24 * 4) {
    return '3天前'
  } else if (diff < 3600 * 24 * 5) {
    return '4天前'
  } else if (diff < 3600 * 24 * 6) {
    return '5天前'
  } else if (diff < 3600 * 24 * 7) {
    return '6天前'
  } else if (diff < 3600 * 24 * 8) {
    return '一周前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

/* 数字 格式化*/
export function nFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function thousands(num) {
  if (num === null || num === undefined) {
    num = '--'
  }
  let back = ''
  if (parseFloat(num) < 1000) {
    back = '' + num
  } else {
    const arr = ('' + num).split('.')
    const int = arr[0].split('').reverse()
    const arr2 = []
    for (let i = 0; i < int.length; i++) {
      arr2.push(int[i])
      if (i % 3 === 2) {
        arr2.push(',')
      }
    }
    back = arr2.reverse().join('').replace(/^,/, '') + (arr[1] ? ('.' + arr[1]) : '')
  }
  return back
}

export function showArray(arr = [], key) {
  if (typeof arr === 'string') {
    arr = JSON.parse(arr || '[]')
  }
  const back = []
  if (key) {
    if (key === 'departNamess') {
      arr.forEach(item => {
        if (item) {
          back.push(item)
        }
      })
      return back.join(' | ')
    } else {
      arr.filter(item => {
        if (item) {
          back.push(item[key])
        }
      })
      return back.join('、')
    }
  }
}
export function showArray2(arr = [], key) {
  if (typeof arr === 'string') {
    arr = JSON.parse(arr || '[]')
  }
  const back = []
  if (key) {
    arr.filter(item => {
      if (item) {
        back.push(item[key])
      }
    })
  }
  return back.join(' | ')
}
export function noString(value, defaultV = '--') {
  if (value === null || value === undefined) {
    value = defaultV
  }
  return value
}
export function showLabel(value, colon = ':') {
  return value.replace(/:$/, '') + colon
}
