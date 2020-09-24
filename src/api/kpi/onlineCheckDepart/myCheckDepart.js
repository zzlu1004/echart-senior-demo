export function searchByKeyword(val) {
  this.params.keyword = val
  this.getMyList()
}
export function submitCheck(row) {
  const obj = {
    isFill: !row.auth.isFill,
    resource: 'my',
    checkType: 'report',
    page: 'edit'
  }
  localStorage.setItem('obj', JSON.stringify(obj))
  this.fd.tools.goDetail.call(this, 'myReportListDepart', { query: {
    schemaId: row.schemaId, blockId: row.blockId,
    schemaBlockType: row.schemaBlockType, departId: row.departId }})
}
export function seeDetail(row) {
  const obj = {
    isFill: !row.auth.isFill,
    resource: 'my',
    checkType: 'report'
  }
  localStorage.setItem('obj', JSON.stringify(obj))
  this.fd.tools.goDetail.call(this, 'myReportListDepart', { query: {
    schemaId: row.schemaId, blockId: row.blockId,
    schemaBlockType: row.schemaBlockType, departId: row.departId }})
}
export function getMyList() {
  const options = {
    lock: true,
    text: '数据正在加载中',
    target: document.querySelector('#myCheckTable')
  }
  this.loading = this.$loading(options)
  this.fd.req({
    url: 'api/dept/evaluations/current-user',
    method: 'GET',
    data: Object.assign({}, this.params, { statusId: this.statusId })
  }).then((d) => {
    this.loading.close()
    const data = d.data || []
    const list = []
    for (const item of data) {
      const obj = {
        schemaName: item.schemaName,
        schemaId: item.schemaId,
        statusId: item.statusId,
        reportRange: item.startTime + '至' + item.endTime,
        deadlineTime: item.deadlineTime,
        rowspan: item.blocks.length
      }
      const obj2 = {
        schemaId: item.schemaId
      }
      const childs = item.blocks
      childs.forEach((d, i) => {
        const auth = {}
        d.completeRate = d.complete + '/' + d.total
        auth.isFill = (d.complete >= d.total)
        d.auth = auth
        d.checkType = this.typesMap[d.schemaBlockType]
        if (i === 0) {
          list.push({ ...obj, ...d })
        } else {
          list.push({ ...obj2, ...d })
        }
      })
    }
    this.checkData = list
  })
}

