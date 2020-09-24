export function tableSelect() {

}
export function getDepartData() {
  this.fd.req({
    type: 'get',
    url: 'api/depart',
    data: {
      departId: this.departId
    }
  }).then(response => {
    const data = response.data
    this.departData = data
  }).catch(error => {
    console.log('getDepartData', error)
  })
}
export function resetForm(formName) {
  this.$refs[formName].resetFields()
}

export function getSelectIds(data) {
  const ids = []
  for (const item of data) {
    ids.push(item.id)
  }
  return ids.join()
}

export function getAllPerson() {
  this.fd.req({
    type: 'get',
    url: 'api/staff',
    data: {
      offset: 0,
      limit: 0,
      departId: '',
      keyword: ''
    }
  }).then(response => {
    const data = response.data
    this.allPerson = data.data
  }).catch(error => {
    console.log('getAllPerson', error)
  })
}
// 获取部门人员列表
export function getPersons() {
  this.tableLoading = true // 人员管理-表格loading
  this.fd.req({
    type: 'get',
    url: 'api/staff',
    data: {
      offset: this.offset,
      limit: this.limit,
      departId: this.departId,
      keyword: this.keyword
    }
  }).then(response => {
    const data = response.data
    this.tableLoading = false
    this.persons = data.data
    this.total = data.total
  }).catch(error => {
    console.log('getPersons', error)
  })
}

export function refreshPersons() {
  this.offset = 0
  this.getPersons()
}

export function gotoDepart() {
  this.$router.push({ name: 'depart' })
}
export function gotoPersonal() {
  this.$router.push({ name: 'personal' })
}

export function getActiveSchemas() {
  this.fd.req({
    type: 'get',
    url: 'api/schemas/has-active/check'
  }).then(response => {
    this.hasActive = response.data || false
  }).catch(error => {
    console.log('getPersons', error)
  })
}
