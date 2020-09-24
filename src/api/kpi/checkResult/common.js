/**
 * 动态改变表头：
 * @param defaultTree:表示固定的表头（非树结构），dataHeader:接口返回的表头（非树结构）,val是当前改变后的表头
 */
export function changeTableCols(defaultTree, dataHeader, val) {
  const defaultTreeCheck = [] // 当前改变后固定表头的数据
  const defaultTreeCols = [] // 当前改变后固定表头只包含id的数据-用于v-model中显示
  let dataHeaderCheck = []
  const dataHeaderCheckLast = []
  const dataHeaderCols = []
  let dataHeaderTreeCheck = []
  let changedTableHeader = []
  // 处理固定表头选中后的数据
  for (const key in defaultTree) {
    if (val.indexOf(defaultTree[key].id) > -1) {
      defaultTreeCheck.push(defaultTree[key])
      defaultTreeCols.push(defaultTree[key].id)
    }
  }
  // 处理接口返回的表头数据
  for (const key in dataHeader) {
    if (val.indexOf(dataHeader[key].id) > -1) {
      dataHeaderCheck.push(dataHeader[key])
      dataHeaderCols.push(dataHeader[key].id)
    }
  }
  // 处理顺序
  for (const key in dataHeaderCheck) {
    const parentId = dataHeader[key].parentId
    if (parentId) {
      const indexOf = dataHeader.findIndex(item => {
        return item.id === parentId
      })
      if (indexOf > -1) {
        dataHeaderCheckLast.push(dataHeader[indexOf])
      }
    }
  }
  dataHeaderCheck = dataHeaderCheck.concat(dataHeaderCheckLast)
  dataHeaderTreeCheck = this.fd.data.changeToTree(dataHeaderCheck)
  changedTableHeader = defaultTreeCheck.concat(dataHeaderTreeCheck)
  return changedTableHeader
}
