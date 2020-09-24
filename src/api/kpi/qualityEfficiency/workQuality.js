// 获取质效指标下拉框列表
export function getTargetOpt() {
  this.fd.req({
    url: 'api/analysis/quality/' + this.typeId,
    method: 'get'
  }).then((d) => {
    const data = d.data || []
    this.targetOpt = data
    for (const item of data) {
      this.targetMap[item.id] = item.name
      this.targetDesc[item.id] = item.content
    }
    this.params.startTime = this.toStartDate(new Date(this.fd.tools.getNowTime()))
    this.params.endTime = this.toLocaleDate(new Date(this.fd.tools.getNowTime()))
    if (data.length > 0) {
      this.params.indexId = data[0].id
    } else {
      this.params.indexId = ''
    }
    this.isSuccess = true
    this.isFlag = !this.isFlag
  })
}
export function currentChange(val) {
  this.judgeParams.offset = (val - 1) * this.judgeParams.limit
  this.getJudgeTotal(this.type)
}
export function sizeChange(val) {
  this.judgeParams.limit = val
  this.judgeParams.offset = 0
  this.getJudgeTotal(this.type)
}
export function toLocaleDate(time) {
  function addZero(num) {
    if (num < 10) {
      return '0' + num
    } else {
      return num
    }
  }
  const aaa = time.getDate() + ''
  if (aaa.length === 1) {
    this.nowDate = '0' + time.getDate()
  } else if (aaa.length === 2) {
    this.nowDate = time.getDate()
  }
  // 按自定义拼接格式返回
  return time.getFullYear() + '-' + addZero(time.getMonth() + 1) + '-' + this.nowDate
}
export function toStartDate(time) {
  return time.getFullYear() + '-01' + '-01'
}
// 刷新时清空条件
export function refreshCondition() {
  this.params.orderField = ''
  this.params.orderType = ''
  if (this.$refs.tableOpt) {
    this.$refs.tableOpt.$children[0].clearSort()
  }
  if (this.$refs.judgeOpt) {
    this.$refs.judgeOpt.$children[0].clearSort()
  }
  this.judgeParams.limit = 10
  this.judgeParams.offset = 0
}
// 刷新所有数据
export function refreshAll() {
  this.flag = 1
  this.isFlag = !this.isFlag
}
export function sortByNum1(column) {
  this.params.orderField = column.prop
  this.params.orderType = column.order
  this.getDepartTotal()
}
export function sortByNum2(column) {
  this.params.orderField = column.prop
  this.params.orderType = column.order
  this.getJudgeTotal()
}
export function searchByKeyword(val) {
  this.params.keyword = val
  if (this.type === 'judge') {
    this.judgeParams.offset = 0
    this.getJudgeTotal()
  } else {
    this.getDepartTotal()
  }
}
// 法官统计的表格数据
export function getDepartTotal() {
  this.departLoading = true
  if (!this.params.indexId) {
    return
  }
  let url = ''
  url = 'api/analysis/quality/index/' + this.type
  this.params = this.fd.tools.merge(true, {}, this.params)
  const data = this.fd.tools.merge(true, {}, this.params)
  this.fd.req({
    url: url,
    method: 'get',
    data: data
  }).then((d) => {
    const data = d.data || {}
    this.tableOpt.data = data.data
    this.departLoading = false
  })
}
export function getJudgeTotal() {
  this.judgeLoading = true
  if (!this.params.indexId) {
    return
  }
  let url = ''
  url = 'api/analysis/quality/index/' + this.type
  this.params = this.fd.tools.merge(true, {}, this.params, this.judgeParams)
  const data = this.fd.tools.merge(true, {}, this.params)
  this.fd.req({
    url: url,
    method: 'get',
    data: data
  }).then((d) => {
    const data = d.data || {}
    this.tableOpt.data = data.data
    this.total = data.total
    this.judgeLoading = false
  })
}
// 表格中指标和子指标的反查
export function countPeg(row, column) {
  if (!this.elements.peg) {
    return
  }
  let selfMsg = {}
  if (column.property !== 'name') {
    // 所有的父级指标都不可以反查，除了超审限案件数没有子指标
    if (!(column.property === 'zb002011' || column.property === 'zb002012' || column.property === 'zb003001' ||
      column.property === 'zb003002' || column.property === 'zb003007' || column.property === 'zb004001' ||
      column.property === 'zb004002' || column.property === 'zb003010' ||
      column.property === 'zb005004' || column.property === 'zb005002')) {
      selfMsg = { departName: row.name, index: column.label, label: column.label,
        value: row[column.property], targetName: this.targetMap[this.params.indexId] }
      const obj = {
        params: {
          indexId: column.property,
          startTime: this.params.startTime,
          endTime: this.params.endTime
        },
        selfMsg: selfMsg
      }
      localStorage.setItem('params', JSON.stringify(obj))
      this.fd.tools.goDetail.call(this, 'workQeTargetPeg', { query: { id: row.id, type: this.type,
        resource: this.typeId }})
    }
  }
}
export function getWidth(name) {
  const l = 16
  return (name.length + 1) * l + 40
}
// 自定义列表联动表格的表头显示
export function changeCols(val) {
  const indexId = this.type + '-' + this.params.indexId
  const opt = this.tableOpt
  const check = this.checkboxName
  opt.columns = []
  for (const item of check) {
    if (val.indexOf(item) > -1) {
      let obj = {}
      if (item === 'departName' || item === 'name') {
        obj = {
          field: item,
          title: this.columsObj[indexId][item],
          sortable: 'custom',
          minWidth: 140
        }
      } else {
        // 所有的父级指标都不可以反查，除了超审限案件数没有子指标
        if (item === 'zb002011' || item === 'zb002012' || item === 'zb003001' || item === 'zb003002' || item === 'zb003007' ||
          item === 'zb004001' || item === 'zb004002' || item === 'zb003010' ||
          item === 'zb005004' || item === 'zb005002') {
          obj = {
            field: item,
            title: this.columsObj[indexId][item],
            align: 'right',
            sortable: 'custom',
            minWidth: this.getWidth(this.columsObj[indexId][item]),
            formatter: (row, value) => {
              value = value === undefined ? '' : value
              return value
            }
          }
        } else {
          obj = {
            field: item,
            title: this.columsObj[indexId][item],
            align: 'right',
            sortable: 'custom',
            minWidth: this.getWidth(this.columsObj[indexId][item]),
            formatter: (row, value) => {
              value = value === undefined ? '' : value
              return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>'
                : value
            }
          }
        }
      }
      opt.columns.push(obj)
    }
  }
}
export function downloadTable() {
  this.fileName = this.pageMap[this.typeId] + '_' + this.targetMap[this.params.indexId] + '_' + this.typeMap[this.type] + '_'
  const url = 'api/analysis/quality/index/' + this.type + '/download'
  const data = this.fd.tools.merge(true, { fileName: this.fileName }, this.params)
  this.fd.tools.download('', url, data)
}
// 根据接口返回的数据字段匹配生成表头数据列
export function getColumns() {
  const indexId = this.type + '-' + this.params.indexId
  // 清空表格表头
  this.tableOpt.columns = []
  // 清空已选中的自定义列表数据
  this.checkedCols = []
  // 清空自定义列表所有数据
  this.checkbox = []
  this.checkboxName = []
  for (const key in this.columsObj[indexId]) {
    let obj = {}
    if (key === 'departName' || key === 'name') {
      obj = {
        field: key,
        title: this.columsObj[indexId][key],
        sortable: 'custom',
        minWidth: 140
      }
    } else {
      // 所有的父级指标都不可以反查，除了超审限案件数没有子指标
      if (key === 'zb002011' || key === 'zb002012' || key === 'zb003001' || key === 'zb003002' || key === 'zb003007' ||
        key === 'zb004001' || key === 'zb004002' || key === 'zb003010' ||
        key === 'zb005004' || key === 'zb005002') {
        obj = {
          field: key,
          title: this.columsObj[indexId][key],
          align: 'right',
          sortable: 'custom',
          minWidth: this.getWidth(this.columsObj[indexId][key]),
          formatter: (row, value) => {
            value = value === undefined ? '' : value
            return value
          }
        }
      } else {
        obj = {
          field: key,
          title: this.columsObj[indexId][key],
          align: 'right',
          sortable: 'custom',
          minWidth: this.getWidth(this.columsObj[indexId][key]),
          formatter: (row, value) => {
            value = value === undefined ? '' : value
            return this.elements.peg ? '<span class="color-blue pointer">' + value + '</span>'
              : value
          }
        }
      }
    }
    this.tableOpt.columns.push(obj)
    this.checkbox.push({
      field: key,
      title: this.columsObj[indexId][key]
    })
    this.checkedCols.push(obj.field)
    this.checkboxName.push(obj.field)
  }
}
