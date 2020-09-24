const today = new Date(parseTime(new Date()))
const months = {}
const dayLong = 86400000
function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d}'
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
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}
function getMonth(time = today) {
  return parseTime(time, '{y}-{m}')
}
function getDay(time = today) {
  return parseTime(time, '{y}-{m}-{d}')
}
function getWeek(time) {
  const date = new Date(time)
  const times = date.getTime()
  let week = date.getDay() - 1
  week = week < 0 ? 6 : week
  const start = times - week * dayLong
  const weeks = []
  for (let i = 0; i < 7; i++) {
    weeks.push(new Date(start + i * dayLong))
  }
  return weeks
}
export function getMonths(month = getMonth()) {
  month = /^\d{4}-\d{2}$/.test(month) ? month : getMonth(month)
  if (months[month]) {
    return months[month]
  }
  let days = []
  let time = new Date(month).getTime()
  const endTime = time + 36 * dayLong
  while (time < endTime) {
    days = days.concat(getWeek(time))
    time += 7 * dayLong
  }
  months[month] = {
    month: month,
    days: days
  }
  return months[month]
}
export function getWeeks(time = getDay()) {
  return {
    day: getDay(time),
    weeks: getWeek(time)
  }
}
export function prevWeeks(day) {
  const weeks = this.getWeeks(new Date(day).getTime() - 7 * dayLong)
  return weeks
}
export function nextWeeks(day) {
  const weeks = this.getWeeks(new Date(day).getTime() + 7 * dayLong)
  return weeks
}
export function prevMonth(month) {
  return getMonths(new Date(getMonth(month)).getTime() - 20 * dayLong)
}
export function nextMonth(month) {
  return getMonths(new Date(getMonth(month)).getTime() + 35 * dayLong)
}

export function getToday() {
  return today
}
