export function currentNodeClick(data) {
  if (data.id) {
    this.fd.tools.goDetail.call(this, 'portraits', { query: { 'homeUserId': data.id }})
  } else {
    this.state = ''
  }
}
export function getUserDetail() {
  this.fd.req({
    type: 'post',
    url: 'api/staff/all',
    data: this.params
  }).then((d) => {
    this.userDetail = d.data
    // 保留模糊搜索的数据源
    this.restaurants = this.userDetail.map((item, index) => {
      const json = {}
      json.value = `${item.departName} | ${item.typeId === 'k10003-01' ? '员额法官' : '法官助理'} | ${item.name}`
      json.id = item.id
      return json
    })
  })
}
export function createFilter(queryString) {
  return (restaurant) => {
    return (restaurant.value.indexOf(queryString) !== -1)
  }
}
export function querySearch(queryString, cb) {
  const restaurants = this.restaurants
  let results = []
  if (queryString) {
    if (restaurants.filter(this.createFilter(queryString)).length !== 0) {
      results = restaurants.filter(this.createFilter(queryString))
    } else {
      results = [{ value: '未匹配到人员信息', id: '' }]
    }
  } else {
    results = restaurants
  }
  // 调用 callback 返回建议列表的数据
  cb(results)
}
