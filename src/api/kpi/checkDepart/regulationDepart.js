export function addRegulation() {
  this.fd.tools.goDetail.call(this, 'addRegulationDepart', { query: { id: '' }})
}
export function getRegulationList({ orderField = 'createTime', orderType = 'descending' } = {}) {
  this.loading = true
  this.fd.req({
    type: 'get',
    url: 'api/dept/blocks',
    data: {
      offset: this.offset,
      limit: this.limit,
      blockName: this.blockName,
      orderField,
      orderType
    }
  }).then(response => {
    const data = response.data
    this.lists = data.data
    this.total = data.total
  }).catch(error => {
    console.log('getRegulationList', error)
  }).then(() => {
    this.loading = false
  })
}
export function currentChange(page) {
  this.offset = (page - 1) * this.limit
  this.getRegulationList({ orderField: this.sort, orderType: this.order })
}
export function refreshList() {
  this.getRegulationList({ orderField: this.sort, orderType: this.order })
}
export function getList(val) {
  this.blockName = val
  this.offset = 0
  this.getRegulationList({ orderField: this.sort, orderType: this.order })
}
export function sizeChange(limit) {
  this.offset = 0
  this.limit = limit
  this.getRegulationList({ orderField: this.sort, orderType: this.order })
}
// 细则列表点击跳转到细则详情页面
export function rowClick(row, event, column) {
  if (column.property === 'name') {
    this.fd.tools.goDetail.call(this, 'regulationDetailDepart', { query: { id: row.id }})
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
  if (row.status !== this.forbid) {
    this.fd.tools.goDetail.call(this, 'addRegulationDepart', { query: { id: row.id, schemaId: this.schemaId }})
  }
}
// 复制细则
export function copyRegulation(row) {
  this.$confirm('请问确定复制《' + row.name + '》细则设置吗？', '复制细则', {
    type: 'info'
  }).then(() => {
    this.fd.req({
      url: 'api/dept/blocks/' + row.id + '/copy',
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
        url: 'api/dept/blocks/' + row.id,
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
    url: 'api/dept/blocks/' + this.id + '/menus',
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
    url: 'api/dept/blocks/' + this.id + '/indexes2',
    data: {
      schemaId: this.schemaId
    }
  }).then(response => {
    this.indexData = response.data
  }).catch(error => {
    console.log('getRegulationIndexs', error)
  })
}// 获取关联方案列表
export function getRegulationSchemas() {
  this.schemaLoading = true
  this.fd.req({
    type: 'get',
    url: 'api/dept/blocks/' + this.id + '/schemas',
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
    url: 'api/dept/blocks/' + this.id,
    data: {
      schemaId: this.schemaId
    }
  }).then(response => {
    const data = response.data
    for (const key in data) {
      this.$set(this.regulation, key, data[key])
    }
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
