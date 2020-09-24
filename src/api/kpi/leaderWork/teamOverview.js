// 开始时间和结束时间的限制
export function changeStartTime() {
  this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
    disabledDate: (time) => {
      const disabledDate = time.getTime() > new Date(this.params.endTime).getTime()
      return disabledDate
    }
  })
}
export function changeEndTime() {
  this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
    disabledDate: (time) => {
      const disabledDate = time.getTime() < new Date(this.params.startTime).getTime()
      return disabledDate
    }
  })
}
// 左边卡片法院数据
export function getTotalData() {
  this.fd.req({
    url: 'api/analysis/depart/stats',
    method: 'get',
    data: this.Pparams
  }).then((d) => {
    const data = d.data || {}
    this.courtObj = data
  })
}
