export function saveNotice(data) {
  const data2 = this.noticeId ? data : this.fd.tools.merge(true, {}, data, { id: this.id })
  if (new Date(this.serverTime).getTime() > new Date(data.releaseDate).getTime()) {
    this.$message({
      type: 'error',
      message: '预定发布时间不能小于当前时间！'
    })
    return
  }
  this.$refs['noticeForm'].validate((valid) => {
    if (valid) {
      const type = this.noticeId ? 'put' : 'post'
      this.fd.req({
        type: type,
        url: 'api/notices',
        data: data2
      }, 'basic_url').then(response => {
        const data = response.data || {}
        this.noticeData = data
        this.action = process.env.BASE_API + window.config.zuul_url + window.config.basic_url + 'api/attachments/owners/' +
          this.id + '?Authorization=' + this.$store.getters.token
        this.$nextTick(() => {
          this.$refs.upload.active = true
        })
        if (!this.isAddAttach) {
          this.goBack()
        }
      }).catch(error => {
        console.log(error)
      })
    } else {
      return false
    }
  })
}
export function addAttach() {
  document.getElementById('file').click()
  this.isAddAttach = true
}
// 时间转成指定的日期格式
export function toLocaleString(date) {
  function addZero(num) {
    if (num < 10) {
      return '0' + num
    } else {
      return num
    }
  }
  return date.getFullYear() + '-' + addZero(date.getMonth() + 1) + '-' + addZero(date.getDate()) + ' ' + addZero(date.getHours()) + ':' + addZero(date.getMinutes()) + ':' + addZero(date.getSeconds())
}
export function getUuid() {
  this.fd.req({
    type: 'get',
    url: 'api/uuid'
  }, 'basic_url').then(response => {
    const data = response.data || ''
    this.id = data
    this.action = process.env.BASE_API + window.config.zuul_url + window.config.basic_url + 'api/attachments/owners/' +
      this.id + '?Authorization=' + this.$store.getters.token
  }).catch(error => {
    console.log(error)
  })
}
export function getCurrentDate() {
  this.fd.req({
    type: 'get',
    url: 'api/current/date'
  }, 'basic_url').then(response => {
    const data = response.data || ''
    this.noticeForm.releaseDate = data
  }).catch(error => {
    console.log(error)
  })
}
export function saveDraft() {
  this.noticeForm.status = '4'
  this.saveNotice(this.noticeForm)
}
export function publishNotice() {
  this.noticeForm.status = '6'
  this.saveNotice(this.noticeForm)
}
// 通知详情查询
export function getDetail() {
  this.fd.req({
    type: 'get',
    url: 'api/notices/' + this.noticeId
  }, 'basic_url').then(response => {
    const data = response.data || {}
    this.noticeForm = {
      id: data.id,
      title: data.title,
      releaseDate: data.releaseDate,
      content: data.content,
      type: data.type,
      projectCode: data.projectCode,
      status: data.status
    }
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
    const files = []
    for (const item of data) {
      files.push({
        name: item.attachmentName,
        id: item.id
      })
    }
    this.fileList = files
  }).catch(error => {
    console.log(error)
  })
}
export function handleRemove(file) {
  this.fd.req({
    url: 'api/attachments/' + file.id,
    method: 'delete'
  }, 'basic_url').then(() => {
    this.$refs.upload.remove(file)
  })
}
