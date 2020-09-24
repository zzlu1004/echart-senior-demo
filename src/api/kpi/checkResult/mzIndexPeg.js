export function getRuleDetailById() {
  const options = {
    lock: true,
    text: '数据正在加载中',
    target: document.querySelector('#rule-report-table')
  }
  // api/assessmet/result/democratic/index/999888/detail?staffId=10000022&schemaId=413952053388247040&schemaBlockType=k10015-04
  this.loading = this.$loading(options)
  this.fd.req({
    url: 'api/assessmet/result/democratic/index/' + this.id + '/detail',
    method: 'GET',
    data: this.params
  }).then((d) => {
    const data = d.data || {}
    this.refreshTableData(data)
  })
  this.loading.close()
}
export function refreshTableData(data) {
  this.isShow = false
  if (!data) {
    return
  }
  data.scores.push({
    total: '得票',
    gear_id: '1234567'
  })
  const tableD = []
  tableD.push(data)
  this.tableData = tableD
  this.$nextTick(() => {
    this.dataTree = this.fd.data.changeToTree(data.menus, 'menuId', 'pid')
    this.tree = this.dataTree
    this.isShow = true
  })
  this.loading.close()
}
export function onProgress() {
  const options = {
    lock: true,
    text: '文件正在导入读取数据中,请稍后......'
  }
  this.loading = this.$loading(options)
}
