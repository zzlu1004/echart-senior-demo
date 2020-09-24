export function getNoticeList(url) {
  this.fd.req({
    type: 'get',
    url: url,
    data: this.params
  }, 'basic_url').then(response => {
    const data = response.data || {}
    let index = 0
    for (const item of data.data) {
      item.index = index + this.params.offset
      index++
    }
    this.noticeArr = data.data || []
    const length = this.noticeArr.length
    this.prev = this.noticeArr[0] || {}
    this.next = this.noticeArr[length - 1] || {}
    this.total = data.total
  }).catch(error => {
    console.log(error)
  })
}
export function getArr() {
  let url = ''
  if (this.type === 'all') {
    url = 'api/notices/bulletins'
  } else {
    url = 'api/notices/manage/bulletins'
  }
  this.getNoticeList(url)
}
export function goBack() {
  this.$router.push({ name: 'notice' })
}
// 通知详情查询
export function getDetail() {
  this.fd.req({
    type: 'get',
    url: 'api/notices/' + this.noticeId
  }, 'basic_url').then(response => {
    const data = response.data || {}
    this.noticeData = data
  }).catch(error => {
    console.log(error)
  })
}
// 通知详情附件查询
export function getAttById() {
  this.fd.req({
    type: 'get',
    url: 'api/attachments/owners/' + this.noticeId
  }, 'basic_url').then(response => {
    const data = response.data || []
    this.attachments = data
  }).catch(error => {
    console.log(error)
  })
}
export function prevNotice(row) {
  // 从第一条数据进来只能查询两条数据，其他的都是查询三条数据
  if (this.params.offset === 0) {
    if (this.params.limit - 3 === 0) {
      this.params.limit = 2
    } else {
      return
    }
  } else {
    this.params.offset--
  }
  this.noticeId = row.id
  this.getArr()
  this.getDetail()
  this.getAttById()
}
export function nextNotice(row) {
  // 从第一条数据进来只能查询两条数据，其他的都是查询三条数据
  if (this.params.limit - 2 === 0) {
    this.params.limit = 3
  } else {
    this.params.offset++
  }
  this.noticeId = row.id
  this.getArr()
  this.getDetail()
  this.getAttById()
}
