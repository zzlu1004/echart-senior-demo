export function addRegulation() {
  if (this.type === 'personal') {
    this.fd.tools.goDetail.call(this, 'addMzRegulation', { query: { id: '', type: this.type }})
  } else if (this.type === 'depart') {
    this.fd.tools.goDetail.call(this, 'addMzRegulationDepart', { query: { id: '', type: this.type }})
  }
}
export function typeChange() {
  this.getMzRegulationList(this.type)
}
export function getMzRegulationList(val, { orderField = 'createTime', orderType = 'descending' } = {}) {
  const data = val === 'depart' ? this.departParams : this.personParams
  this.loading = true
  this.fd.req({
    type: 'get',
    url: 'api/democratic-blocks',
    data: Object.assign({}, data, { orderField, orderType })
  }).then(response => {
    const data = response.data
    this.lists = data.data
    val === 'depart' ? this.departParams.total = data.total : this.personParams.total = data.total
    this.loading = false
  }).catch(error => {
    console.log('getMzRegulationList', error)
  })
}
export function currentChange(page) {
  if (this.type === 'depart') {
    this.departParams.offset = (page - 1) * this.departParams.limit
  } else {
    this.personParams.offset = (page - 1) * this.personParams.limit
  }
  this.getMzRegulationList(this.type, { orderField: this.sort, orderType: this.order })
}
export function refreshList() {
  this.getMzRegulationList(this.type, { orderField: this.sort, orderType: this.order })
}
export function getList(val) {
  if (this.type === 'depart') {
    this.departParams.keyword = val
    this.departParams.offset = 0
  } else {
    this.personParams.keyword = val
    this.personParams.offset = 0
  }
  this.getMzRegulationList(this.type, { orderField: this.sort, orderType: this.order })
}
export function sizeChange(limit) {
  if (this.type === 'depart') {
    this.departParams.limit = limit
    this.departParams.offset = 0
  } else {
    this.personParams.limit = limit
    this.personParams.offset = 0
  }
  this.getMzRegulationList(this.type, { orderField: this.sort, orderType: this.order })
}
// 细则列表点击跳转到细则详情页面
export function rowClick(row, event, column) {
  if (column.property === 'name') {
    if (this.type === 'personal') {
      this.fd.tools.goDetail.call(this, 'mzRegulationDetail', { query: { id: row.id, type: this.type }})
    } else if (this.type === 'depart') {
      this.fd.tools.goDetail.call(this, 'mzRegulationDetailDepart', { query: { id: row.id, type: this.type }})
    }
  }
}
// 关联方案列表
export function showSchemas(schemas) {
  const list = []
  for (const item of schemas) {
    if (item.statusId !== 2) {
      list.push(item.name + '<span style="color:' + this.statusColor[item.statusId] + '">（' + (this.statusName[item.statusId] || item.status) + '）</span>')
    }
  }
  return list.join('<br/>')
}
// 编辑细则
export function editRegulation(row) {
  if (this.personParams || this.departParams) {
    console.log(111)
    if (row.status !== this.forbid) {
      if (this.type === 'personal') {
        this.fd.tools.goDetail.call(this, 'addMzRegulation', { query: { id: row.id, schemaId: this.schemaId, type: this.type }})
      } else if (this.type === 'depart') {
        this.fd.tools.goDetail.call(this, 'addMzRegulationDepart', { query: { id: row.id, schemaId: this.schemaId, type: this.type }})
      }
    }
  } else {
    console.log(222)
    if (row.status !== this.forbid) {
      console.log(333)
      // this.fd.tools.goDetail.call(this, 'addMzRegulation', { query: { id: row.id, schemaId: this.schemaId, type: this.type }})
      // person为个人考核，考核方案反查过来的type
      if (this.type === 'personal' || this.type === 'person') {
        this.fd.tools.goDetail.call(this, 'addMzRegulation', { query: { id: row.id, schemaId: this.schemaId, type: this.type }})
      } else if (this.type === 'depart') {
        this.fd.tools.goDetail.call(this, 'addMzRegulationDepart', { query: { id: row.id, schemaId: this.schemaId, type: this.type }})
      }
    }
  }
}
// 复制细则
export function copyRegulation(row) {
  this.$confirm('请问确定复制《' + row.name + '》细则设置吗？', '复制细则', {
    type: 'info'
  }).then(() => {
    this.fd.req({
      url: 'api/democratic-blocks/' + row.id + '/copy',
      method: 'post'
    }).then((d) => {
      this.refreshList()
      this.$message({
        type: 'success',
        message: '复制成功'
      })
    })
  }).catch(() => {})
}
// 删除细则
export function deleteRegulation(row) {
  if (row.status !== this.forbid) {
    this.$confirm('删除后该细则的内容将无法恢复,请问确定删除《' + row.name + '》细则设置吗?', '删除细则', {
      type: 'warning'
    }).then(() => {
      this.fd.req({
        url: 'api/democratic-blocks/' + row.id,
        method: 'delete'
      }).then((d) => {
        this.refreshList()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      })
    }).catch(() => {})
  }
}
// 获取指标目录
export function getRegulationMenus() {
  this.targetLoading = true
  this.fd.req({
    type: 'get',
    url: 'api/democratic-blocks/' + this.id + '/menus',
    data: {
      schemaId: this.schemaId
    }
  }).then(response => {
    this.menus = response.data
    this.targetLoading = false
  }).catch(error => {
    console.log('getRegulationMenus', error)
  })
}
// 获取指标配置信息
export function getRegulationIndexs() {
  this.fd.req({
    type: 'get',
    url: 'api/democratic-blocks/' + this.id + '/indexes2',
    data: {
      schemaId: this.schemaId,
      type: this.type
    }
  }).then(response => {
    const resData = response.data
    this.indexData = resData
  }).catch(error => {
    console.log('getRegulationIndexs', error)
  })
}// 获取关联方案列表
export function getRegulationSchemas() {
  this.schemaLoading = true
  this.fd.req({
    type: 'get',
    url: 'api/democratic-blocks/' + this.id + '/schemas',
    data: {
      schemaId: this.schemaId
    }
  }).then(response => {
    this.allSchemas = response.data
    this.schemaLoading = false
  }).catch(error => {
    console.log('getRegulationSchemas', error)
  })
}
export function getRegulationDetail() {
  this.fd.req({
    type: 'get',
    url: 'api/democratic-blocks/' + this.id,
    data: {
      schemaId: this.schemaId
    }
  }).then(response => {
    const data = response.data
    for (const key in data) {
      this.$set(this.regulation, key, data[key])
    }
    console.log('this.regulation', this.regulation)
  }).catch(error => {
    console.log('getRegulationDetail', error)
  })
}
export const statusName = {
  active: '生效中',
  inactive: '未生效',
  0: '草稿',
  1: '已生效',
  2: '已结束',
  3: '正在结束',
  4: '正在生效'
}
export const statusColor = {
  active: '#00924c',
  inactive: '#1b95e7',
  0: '#e09a00',
  1: '#00924c',
  2: '#1b95e7',
  3: '#ff7733',
  4: '#22bbee'
}
