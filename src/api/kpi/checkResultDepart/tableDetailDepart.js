export function courtNodeClick(data) {
  this.baseParams.companyId = data.code
  this.companyName = data.label
  this.showDepartTree = false
}
// 分页
export function currentChange(val) {
  let selfParams = {}
  if (this.category === 'total') {
    this.totalParams.offset = (val - 1) * this.totalParams.limit
    selfParams = this.fd.tools.merge(true, {}, this.totalParams)
    if (this.isChangeTotalCols) {
      this.flag = false
      this.getTotalResult(selfParams)
    } else {
      this.flag = true
      this.getTotalResult(selfParams)
    }
  } else {
    this.detailTParams.offset = (val - 1) * this.detailTParams.limit
    selfParams = this.fd.tools.merge(true, {}, this.detailTParams)
    if (this.isChangeDetailCols) {
      this.flagDetail = false
      this.getDetailResult(selfParams)
    } else {
      this.flagDetail = true
      this.getDetailResult(selfParams)
    }
  }
}
// 改变一页展示条数
export function sizeChange(val) {
  let selfParams = {}
  // 通过this.category判断当前为汇总表还是明细表
  if (this.category === 'total') {
    this.totalParams.limit = val
    this.totalParams.offset = 0
    selfParams = this.fd.tools.merge(true, {}, this.totalParams)
    // this.isChangeTotalCols判断是否进行了自定义操作，为false加载全部后端接口表头，为true加载自定义表头
    if (this.isChangeTotalCols) {
      this.flag = false
      this.getTotalResult(selfParams)
    } else {
      this.flag = true
      this.getTotalResult(selfParams)
    }
  } else {
    this.detailTParams.limit = val
    this.detailTParams.offset = 0
    selfParams = this.fd.tools.merge(true, {}, this.detailTParams)
    if (this.isChangeDetailCols) {
      this.flagDetail = false
      this.getDetailResult(selfParams)
    } else {
      this.flagDetail = true
      this.getDetailResult(selfParams)
    }
  }
}
export function getDepartData(schemaId) {
  this.fd.req({
    type: 'get',
    url: 'api/depart',
    data: { schemaId: schemaId }
  }).then(response => {
    const data = response.data
    this.departData = data
    data.forEach((item, i) => {
      this.departsMap[item.id] = item.name
    })
    if (this.$route.query.schemaId) {
      this.$nextTick(() => {
        this.clickBtn() // 获取方案下拉框
      })
    }
  }).catch(error => {
    console.log('getDepartData', error)
  })
}
export function printTable() {
  if (this.category === 'total') {
    this.getTotalResult2()
  } else {
    this.getDetailResult2()
  }
}
export function printTableHead() {
  // 打印的表头名称
  let departsName = ''
  this.peopleParams.departIds.forEach((item, i) => {
    departsName += this.departsMap[item]
    departsName += (i === this.peopleParams.departIds.length - 1) ? '' : '/'
  })
  this.printTitle = this.schemaName +
    this.schemaBlockMap[this.baseParams.schemaBlockType] + this.categoryMap[this.category] + (this.peopleParams.departIds.length === 0 ? '（全院）' : '（' + departsName + '）')
}
export function getTotalResult(selfParams) {
  this.totalCheckedCols = []
  this.totalCheckbox = []
  this.totalCheckboxName = []
  this.totalCheckboxDetail = []
  this.tableTotalLoading = true
  this.baseParams.companyId = ''
  this.params = this.fd.tools.merge(true, {}, selfParams, this.peopleParams, this.baseParams)
  this.fd.req({
    url: 'api/dept/assessmet/result',
    method: 'POST',
    data: this.params
  }).then((d) => {
    const data = d.data || {}
    this.schema = data.schema || {}
    // 新民主测评指标值反查页，为获取方案信息
    localStorage.setItem('schema', JSON.stringify(this.schema))
    this.timeRange.startTime = this.schema.schemaStartTime ? this.schema.schemaStartTime : ''
    this.timeRange.endTime = this.schema.schemaEndTime ? this.schema.schemaEndTime : ''
    this.treeTotal = this.isOrder ? this.treeTotal : []
    this.treeTotal2 = []
    const defaultTree = [
      {
        id: 'departName',
        label: '考核对象',
        field: 'departName'
      }, {
        id: 'allScore',
        label: '分数',
        width: '80px',
        field: 'allScore'
      }, {
        id: 'rank',
        label: '排名',
        width: '80px',
        field: 'rank'
      }, {
        id: 'gradeName',
        label: '评档',
        width: '80px',
        field: 'gradeName'
      }]
    this.$nextTick(() => {
      // 汇总表的表头
      this.tableTotalLoading = false
      // this.flag为true加载全部后端接口表头，flag为false加载自定义表头
      if (this.flag) {
        const headTree = []
        data.header.forEach((item, i) => {
          if (!item.parentId) {
            headTree.push({
              id: 'index_' + item.id + '_total',
              label: item.label,
              field: 'index_' + item.id + '_total'
            })
          }
        })
        if (this.treeTotal.length === 0) {
          this.treeTotal = defaultTree.concat(headTree)
        }
        // 添加自定义列表
        for (const key in this.treeTotal) {
          this.totalCheckbox.push({
            field: this.treeTotal[key].id,
            title: this.treeTotal[key].label
          })
          this.totalCheckedCols.push(this.treeTotal[key].id)
          this.totalCheckboxName.push(this.treeTotal[key].id)
          this.totalCheckboxDetail.push({
            field: this.treeTotal[key].id,
            title: this.treeTotal[key].label
          })
        }
      } else {
        this.treeTotal = this.changeHeader
        // 添加自定义列表
        this.totalCheckedCols = this.changeCheck
        const headTree = []
        data.header.forEach((item, i) => {
          if (!item.parentId) {
            headTree.push({
              id: 'index_' + item.id + '_total',
              label: item.label,
              field: 'index_' + item.id + '_total'
            })
          }
        })
        this.treeTotal2 = defaultTree.concat(headTree)
        console.log('headTree', headTree)
        for (const key in this.treeTotal2) {
          this.totalCheckbox.push({
            field: this.treeTotal2[key].id,
            title: this.treeTotal2[key].label
          })
          this.totalCheckboxName.push(this.treeTotal2[key].id)
          this.totalCheckboxDetail.push({
            field: this.treeTotal2[key].id,
            title: this.treeTotal2[key].label
          })
        }
      }
      this.totalData = JSON.parse(JSON.stringify(data)).scores
      this.totalOriginalData = JSON.parse(JSON.stringify(data)).scores
      this.totalTotal = data.total
    })
    this.grades = data.grades || []
    if (data.averange) {
      this.averange.statValue = data.averange.statValue || 0
    } else {
      this.averange.statValue = 0
    }
    if (data.usersCount) {
      this.usersCount.statValue = data.usersCount.statValue || 0
      this.usersCount.maxValue = data.usersCount.maxValue || 0
    } else {
      this.usersCount.statValue = 0
    }
    this.schemaName = data.schema && data.schema.schemaName ? data.schema.schemaName : ''
  })
}
export function getTotalResult2() {
  // 重新请求数据，取消条数限制
  this.baseParams.companyId = ''
  this.params = this.fd.tools.merge(true, {}, this.totalParamsDisply, this.peopleParams, this.baseParams)
  this.fd.req({
    url: 'api/dept/assessmet/result',
    method: 'POST',
    data: this.params
  }).then((d) => {
    this.tableDisplay = true
    const data = d.data || {}
    this.totalData2 = JSON.parse(JSON.stringify(data)).scores
    this.printTableHead()
    this.$nextTick(() => {
      const html = window.$('#tableTotalDisply')
      this.fd.tools.tablePrint(html)
      this.tableDisplay = false
    })
  })
}
export function getDetailResult(selfParams) {
  this.detailCheckedColsRoot = []
  this.detailCheckedColsMom = []
  this.detailCheckedCols = []
  this.detailCheckbox = []
  this.detailCheckboxName = []
  this.detailCheckboxDetail = []
  this.detailCheckboxRoot = []
  this.detailCheckboxNameRoot = []
  this.detailCheckboxDetailRoot = []
  this.detailCheckboxMom = []
  this.detailCheckboxNameMom = []
  this.detailCheckboxDetailMom = []
  this.dataMom = []
  this.tableDetailLoading = true // 表格无数据时显示loading
  this.baseParams.companyId = ''
  this.params = this.fd.tools.merge(true, {}, selfParams, this.peopleParams, this.baseParams) // 调用tool.js合并参数方法
  this.fd.req({
    url: 'api/dept/assessmet/result',
    method: 'POST',
    data: this.params
  }).then((d) => {
    const data = d.data || {}
    this.schema = data.schema || {}
    this.timeRange.startTime = this.schema.schemaStartTime ? this.schema.schemaStartTime : ''
    this.timeRange.endTime = this.schema.schemaEndTime ? this.schema.schemaEndTime : ''
    this.tree = this.isOrder ? this.tree : [] // 当前进入false
    const defaultTree = [ // 设置固定列
      {
        id: 'departName',
        label: '考核对象',
        field: 'departName'
      }, {
        id: 'allScore',
        label: '分数',
        width: '80px',
        field: 'allScore'
      }, {
        id: 'rank',
        label: '排名',
        width: '80px',
        field: 'rank'
      }, {
        id: 'gradeName',
        label: '评档',
        width: '80px',
        field: 'gradeName'
      }]
    this.$nextTick(() => {
      // 明细表的表头
      this.tableDetailLoading = false // 表格有数据时关闭loading
      if (this.flagDetail) {
        if (this.tree.length === 0) {
          this.tree = defaultTree.concat(this.fd.data.changeToTree(data.header)) // this.tree为明细表的表头； defaultTree为上面设置的固定列的值 ;当前得到this.tree为具有id和label的对象数组
          this.treeExcept = this.fd.data.changeToTree(data.header) // 得到自定义列表的表头，除掉了defaultTree
        }
        this.changeNum++
        // 添加自定义列表
        for (const key in data.header) {
          if (data.header[key].isRoot) {
            this.detailCheckboxRoot.push({
              field: data.header[key].id,
              title: data.header[key].label
            })
            this.detailCheckedColsRoot.push(data.header[key].id)
            this.detailCheckboxNameRoot.push(data.header[key].id)
          }
          // 获取含有底层指标的目录
          if (data.header[key].parentId === null) {
            this.dataMom.push({
              id: data.header[key].id,
              title: data.header[key].label,
              label: data.header[key].label,
              parentId: data.header[key].parentId
            })
          }
        }
        for (const key in defaultTree) {
          this.detailCheckboxMom.push({
            field: defaultTree[key].id,
            title: defaultTree[key].label
          })
          this.detailCheckedColsMom.push(defaultTree[key].id)
          this.detailCheckboxNameMom.push(defaultTree[key].id)
        }
        this.detailCheckbox = this.detailCheckboxMom.concat(this.detailCheckboxRoot)
        this.detailCheckedCols = this.detailCheckedColsMom.concat(this.detailCheckedColsRoot)
        this.detailCheckboxName = this.detailCheckboxNameMom.concat(this.detailCheckboxNameRoot)
      } else {
        this.tree = this.changeDetailHeader
        // 添加自定义列表
        // detailCheckedCols显示的选中的选项
        this.detailCheckedCols = this.changeDetailCheck
        for (const key in data.header) {
          if (data.header[key].isRoot) {
            this.detailCheckboxRoot.push({
              field: data.header[key].id,
              title: data.header[key].label
            })
            this.detailCheckboxNameRoot.push(data.header[key].id)
          }
          // 获取含有底层指标的目录
          if (data.header[key].parentId === null) {
            this.dataMom.push({
              id: data.header[key].id,
              title: data.header[key].label,
              label: data.header[key].label,
              parentId: data.header[key].parentId
            })
          }
        }
        for (const key in defaultTree) {
          this.detailCheckboxMom.push({
            field: defaultTree[key].id,
            title: defaultTree[key].label
          })
          this.detailCheckboxNameMom.push(defaultTree[key].id)
        }
        this.detailCheckbox = this.detailCheckboxMom.concat(this.detailCheckboxRoot)
        this.detailCheckboxName = this.detailCheckboxNameMom.concat(this.detailCheckboxNameRoot)
      }
      this.detailCheckboxDetail = this.treeExcept
      // 明细表中的数据
      this.tableData = JSON.parse(JSON.stringify(data)).scores
      this.OriginalData = JSON.parse(JSON.stringify(data)).scores
      // 获取的是分页的数据
      this.detailTotal = data.total
      // const OriginalData = this.OriginalData.concat([])
      // this.tableData = OriginalData.slice(this.detailTParams.offset, this.detailTParams.offset + this.detailTParams.limit)
    })
    this.grades = data.grades || [] // 获取的是页面中ABCD档的等级和数据
    // 获取平均分数
    if (data.averange) {
      this.averange.statValue = data.averange.statValue || 0
    } else {
      this.averange.statValue = 0
    }
    // 获取考核人数
    if (data.usersCount) {
      this.usersCount.statValue = data.usersCount.statValue || 0
      this.usersCount.maxValue = data.usersCount.maxValue || 0
    } else {
      this.usersCount.statValue = 0
    }
    // 获取表名
    this.schemaName = data.schema && data.schema.schemaName ? data.schema.schemaName : ''
  })
}
export function getDetailResult2() {
  this.baseParams.companyId = ''
  this.params = this.fd.tools.merge(true, {}, this.totalParamsDisply, this.peopleParams, this.baseParams) // 调用tool.js合并参数方法
  this.fd.req({
    url: 'api/dept/assessmet/result',
    method: 'POST',
    data: this.params
  }).then((d) => {
    this.tableDisplay = true
    const data = d.data || {}
    this.tableData2 = JSON.parse(JSON.stringify(data)).scores
    this.printTableHead()
    this.$nextTick(() => {
      const html = window.$('#tableDetailDisply')
      this.fd.tools.tablePrint(html)
      this.tableDisplay = false
    })
  })
}
export function sortByNum(column, prop, order) {
  this.isOrder = true
  let selfParams = {}
  if (this.category === 'total') {
    this.totalParams.orderField = column.prop
    this.totalParams.orderType = column.order
    selfParams = this.fd.tools.merge(true, {}, this.totalParams)
    if (this.isChangeTotalCols) {
      this.flag = false
      this.getTotalResult(selfParams)
    } else {
      this.flag = true
      this.getTotalResult(selfParams)
    }
  } else {
    this.detailTParams.orderField = column.prop
    this.detailTParams.orderType = column.order
    selfParams = this.fd.tools.merge(true, {}, this.detailTParams)
    if (this.isChangeDetailCols) {
      this.flagDetail = false
      this.getDetailResult(selfParams)
    } else {
      this.flagDetail = true
      this.getDetailResult(selfParams)
    }
  }
}
// 获取明细报表内容
export function refreshAll(val) {
  this.fd.req({
    type: 'get',
    url: 'api/dept/schemas/status-list',
    data: { status: val }
  }).then(response => {
    const data = response.data || []
    this.schemaOpt = data
    if (this.$route.query.schemaId) {
      this.baseParams.schemaId = this.$route.query.schemaId
    } else {
      this.baseParams.schemaId = data[0] ? data[0].id : ''
    }
    this.params2.weightId = data[0] ? data[0].weightId : ''
    for (const item of data) {
      this.weightMap[item.id] = item.weightId
      this.schemaMap[item.id] = item.name
    }
    this.schemaId = this.baseParams.schemaId
    this.getDepartData(this.schemaId) // 获取部门下拉框
  }).catch(error => {
    console.log(error)
  })
}
// 获取已生效的方案作为下拉框
export function getSchemas(val) {
  this.fd.req({
    type: 'get',
    url: 'api/dept/schemas/status-list',
    data: { status: val }
  }).then(response => {
    const data = response.data || []
    this.schemaOpt = data
    this.baseParams.schemaId = data[0] ? data[0].id : ''
    this.params2.weightId = data[0] ? data[0].weightId : ''
    for (const item of data) {
      this.weightMap[item.id] = item.weightId
      this.schemaMap[item.id] = item.name
    }
    this.schemaId = this.baseParams.schemaId
    this.getDepartData(this.schemaId) // 获取部门下拉框
  }).catch(error => {
    console.log(error)
  })
}
export function searchByKeyword(val) {
  let selfParams = {}
  if (this.category === 'total') {
    this.totalParams.keyword = val
    this.totalParams.offset = 0
    selfParams = this.fd.tools.merge(true, {}, this.totalParams)
    this.getTotalResult(selfParams)
  } else {
    this.detailTParams.keyword = val
    this.detailTParams.offset = 0
    selfParams = this.fd.tools.merge(true, {}, this.detailTParams)
    this.getDetailResult(selfParams)
  }
}
export function clickBtn() {
  // 是否点击了排序清空 表头需要重新获取
  this.isOrder = false
  // 汇总表的操作条件重置
  let selfParams = {}
  this.totalParams.orderField = ''
  this.totalParams.keyword = ''
  this.totalParams.orderType = ''
  this.totalParams.offset = 0
  this.totalParams.limit = 10
  selfParams = this.fd.tools.merge(true, {}, this.totalParams)
  this.$nextTick(() => {
    this.flag = true
    this.getTotalResult(selfParams)
  })
  // 明细表的操作条件重置
  let selfParams2 = {}
  this.detailTParams.orderField = ''
  this.detailTParams.orderType = ''
  this.detailTParams.keyword = ''
  this.detailTParams.offset = 0
  this.detailTParams.limit = 10
  selfParams2 = this.fd.tools.merge(true, {}, this.detailTParams)
  this.$nextTick(() => {
    this.flagDetail = true
    this.getDetailResult(selfParams2)
  })
}
export function staffNamePeg(row) {
  localStorage.setItem('timeRange', JSON.stringify(this.timeRange))
  this.fd.tools.goDetail.call(this, 'staffDetailDepart', { query: {
    id: row.departId,
    schemaId: this.params.schemaId,
    companyId: this.params.companyId,
    schemaBlockType: this.params.schemaBlockType,
    weightId: this.params.weightId,
    type: this.baseParams.schemaBlockType
  }})
}
// 指标反查
export function targetPeg(row, it) {
  // 1：指标反查
  if (it.kpiType === '1') {
    // 审判绩效指标反查调到个人详情页
    if (it.kpiId === 'zb005001' || it.kpiId === 'b081') {
      localStorage.setItem('timeRange', JSON.stringify(this.timeRange))
      this.fd.tools.goDetail.call(this, 'staffDetailDepart', { query: {
        id: row.departId,
        schemaId: this.params.schemaId,
        companyId: this.params.companyId,
        schemaBlockType: this.params.schemaBlockType,
        weightId: this.params.weightId,
        type: 'k10015-02'
      }})
    } else {
      this.moralPeg(row, it)
    }
    // 5：新民主测评指标值反查
  } else if (it.kpiType === '5') {
    // 审判绩效指标反查调到个人详情页
    this.mzIndexDepartPeg(row, it)
    // 2：案件数反查 4：标记指标反查
  } else if (it.kpiType === '2' || it.kpiType === '4') {
    // 审判绩效指标反查调到个人详情页
    if (it.kpiId === 'zb005001' || it.kpiId === 'b081') {
      localStorage.setItem('timeRange', JSON.stringify(this.timeRange))
      this.fd.tools.goDetail.call(this, 'staffDetailDepart', { query: {
        id: row.departId,
        schemaId: this.params.schemaId,
        companyId: this.params.companyId,
        schemaBlockType: this.params.schemaBlockType,
        weightId: this.params.weightId,
        type: 'k10015-02'
      }})
    } else {
      this.casePeg(row, it)
    }
    // 3：工作量反查
  } else if (it.kpiType === '3') {
    // 审判绩效指标反查调到个人详情页
    if (it.kpiId === 'zb005001' || it.kpiId === 'b081') {
      localStorage.setItem('timeRange', JSON.stringify(this.timeRange))
      this.fd.tools.goDetail.call(this, 'staffDetailDepart', { query: {
        id: row.departId,
        schemaId: this.params.schemaId,
        companyId: this.params.companyId,
        schemaBlockType: this.params.schemaBlockType,
        weightId: this.params.weightId,
        type: 'k10015-02'
      }})
    } else {
      this.cbrWorkPeg(row, it)
    }
  } else {
    // 审判绩效指标反查调到个人详情页
    if (it.kpiId === 'zb005001' || it.kpiId === 'b081') {
      localStorage.setItem('timeRange', JSON.stringify(this.timeRange))
      this.fd.tools.goDetail.call(this, 'staffDetailDepart', { query: {
        id: row.departId,
        schemaId: this.params.schemaId,
        companyId: this.params.companyId,
        schemaBlockType: this.params.schemaBlockType,
        weightId: this.params.weightId,
        type: 'k10015-02'
      }})
      // 民主测评指标反查调到个人详情页
    } else if (it.kpiId === 'zb005006' || it.kpiId === 'b080') {
      localStorage.setItem('timeRange', JSON.stringify(this.timeRange))
      this.fd.tools.goDetail.call(this, 'staffDetailDepart', { query: {
        id: row.departId,
        schemaId: this.params.schemaId,
        companyId: this.params.companyId,
        schemaBlockType: this.params.schemaBlockType,
        weightId: this.params.weightId,
        type: 'k10015-03'
      }})
    } else if (it.kpiId === 'b109') {
      // 新民主测评特殊指标，没有kpiType
      localStorage.setItem('timeRange', JSON.stringify(this.timeRange))
      this.fd.tools.goDetail.call(this, 'staffDetailDepart', { query: {
        id: row.departId,
        schemaId: this.params.schemaId,
        companyId: this.params.companyId,
        schemaBlockType: this.params.schemaBlockType,
        weightId: this.params.weightId,
        type: 'k10015-04'
      }})
    }
    // k10033-02：案件工作量反查
    if (it.kpiType === 'k10033-02') {
      this.cbrWorkPeg(row, it)
    // k10033-01：案件数反查 k10033-03：审理时间指数反查 k10033-04：后审指标反查
    } else if (it.kpiType === 'k10033-01' || it.kpiType === 'k10033-03' || it.kpiType === 'k10033-04' || it.kpiType === 'k10033-05' || it.kpiType === 'k10033-06' || it.kpiType === 'k10033-07') {
      this.casePeg(row, it)
    }
  }
}
// 新民主测评指标值反查
export function mzIndexDepartPeg(row, it) {
  const obj = {
    departId: row.departId,
    departName: row.departName,
    indexId: it.kpiId,
    indexName: it.kpiName,
    schemaId: this.params.schemaId,
    schemaBlockType: this.params.schemaBlockType
  }
  localStorage.setItem('params', JSON.stringify(obj))
  this.fd.tools.goDetail.call(this, 'mzIndexDepartPeg', { query: { id: it.kpiId }})
}
// 结案案件数的反查
export function casePeg(row, it) {
  const selfMsg = { departName: row.departName, index: it.kpiName, value: it.approvalScore }
  const obj = {
    params: {
      departId: row.departId,
      startTime: this.timeRange.startTime,
      endTime: this.timeRange.endTime,
      schemaId: this.params.schemaId,
      schemaBlockType: this.params.schemaBlockType
    },
    selfMsg: selfMsg
  }
  localStorage.setItem('params', JSON.stringify(obj))
  this.fd.tools.goDetail.call(this, 'targetCasePegDepart', { query: { id: it.kpiId, kpiType: it.kpiType, type: 'case' }})
}
// 承办人工作量的反查
export function cbrWorkPeg(row, it) {
  const selfMsg = { departName: row.departName, index: it.kpiName, value: it.approvalScore }
  const obj = {
    params: {
      departId: row.departId,
      startTime: this.timeRange.startTime,
      endTime: this.timeRange.endTime,
      schemaId: this.params.schemaId,
      weightId: this.params.weightId || '',
      schemaBlockType: this.params.schemaBlockType
    },
    selfMsg: selfMsg
  }
  localStorage.setItem('params', JSON.stringify(obj))
  this.fd.tools.goDetail.call(this, 'targetCasePegDepart', { query: { id: it.kpiId, kpiType: it.kpiType, type: 'workload' }})
}
// 道德品行的反查
export function moralPeg(row, it) {
  const obj = {
    departId: row.departId,
    indexId: it.kpiId,
    schemaId: this.params.schemaId,
    schemaBlockType: this.params.schemaBlockType
  }
  localStorage.setItem('params', JSON.stringify(obj))
  this.fd.tools.goDetail.call(this, 'moralPegDepart', { query: { id: it.kpiId }})
}
export function downloadTableDetail() {
  this.schemaName = this.schema.schemaName || ''
  // 下载表格的名称
  this.fileName = this.schemaName +
    this.schemaBlockMap[this.baseParams.schemaBlockType] + this.categoryMap[this.category] + '_'
  // 下载的标题名称
  let departsName = ''
  this.peopleParams.departIds.forEach((item, i) => {
    departsName += this.departsMap[item]
    departsName += (i === this.peopleParams.departIds.length - 1) ? '' : '/'
  })
  this.headerName = this.schemaName +
    this.schemaBlockMap[this.baseParams.schemaBlockType] + this.categoryMap[this.category] + (this.peopleParams.departIds.length === 0 ? '（全院）' : '（' + departsName + '）')
  let params = {}
  let selfParams = {}
  if (this.category === 'total') {
    selfParams = this.fd.tools.merge(true, {}, this.totalParams)
  } else {
    selfParams = this.fd.tools.merge(true, { type: this.columns }, this.detailTParams)
  }
  params = this.fd.tools.merge(true, { fileName: this.fileName, headerName: this.headerName, isDepart: true }, selfParams, this.peopleParams, this.baseParams)
  this.fd.tools.downloadByHtml(params, 'api/html/download/' + this.category, 'post')
}
// 明细报表指标值反查
export function showPeg(row, target) {
  if (!this.elementsPeg) {
    return
  }
  this.getPegValue(row, target)
}
export function getPegValue(row, target) {
  const data = this.fd.tools.merge(true, {}, { departId: row.departId }, {
    schemaId: this.params.schemaId,
    schemaBlockType: this.params.schemaBlockType
  })
  this.fd.req({
    url: 'api/dept/assessmet/result/index/' + target.id,
    method: 'get',
    data: data
  }).then((d) => {
    const data = d.data || []
    this.popoverOpt = data
  })
}
export function getAlignStyle(prop) {
  if (prop === 'departName' || prop === 'staffName' || prop === 'gradeName') {
    return 'left'
  } else {
    return 'right'
  }
}
export function changeCols(val) {
  this.cols = []
  if (val.length === 0) {
    this.cols = []
    return
  }
  for (const item of this.checkboxName) {
    if (val.indexOf(item) > -1) {
      this.cols.push({ id: item, name: this.colObj[item] })
    }
  }
}
// 汇总表自定义列表联动表格的表头显示
export function changeTotalCols(val) {
  this.isChangeTotalCols = true
  this.treeTotal = []
  const check = this.totalCheckboxDetail
  for (let i = 0; i < check.length; i++) {
    if (val.indexOf(check[i].field) > -1) {
      this.treeTotal.push({
        field: check[i].field,
        title: check[i].title
      })
    }
  }
  // 汇总表的表头
  this.tableTotalLoading = false
  const headTreeSelf = []
  const headcols = []
  this.treeTotal.forEach((item, i) => {
    headTreeSelf.push({
      id: item.field,
      label: item.title,
      field: item.field
    })
    headcols.push(item.field)
  })
  this.treeTotal = headTreeSelf
  this.changeHeader = headTreeSelf
  this.changeCheck = headcols
}
// 明细表自定义列表联动表格的表头显示
export function changeDetailCols(val) {
  const treeBox = []
  this.isChangeDetailCols = true
  this.detailCols = []
  this.treeFin = []
  this.detailOtherCols = []
  this.treeSum = []
  this.defaultTreeT = []
  this.detailColsT = []
  // this.treeMom = []
  const checkMom = this.detailCheckboxDetail
  checkMom.forEach((item, i) => {
    if (item.children) {
      const check = item.children
      check.forEach((items, i) => {
        if (val.indexOf(items.id) > -1) {
          treeBox.push({
            id: items.id,
            title: items.label,
            label: items.label,
            parentId: items.parentId
          })
          this.detailCols.push(items.id)
        }
      })
    } else {
      if (val.indexOf(item.id) > -1) {
        treeBox.push({
          id: item.id,
          title: item.label,
          label: item.label
        })
        this.detailOtherCols.push(item.id)
      }
    }
  })
  // 遍历所有无parentId的父指标和含有parentId的底层指标，留下含有底层指标的父指标
  this.treeMom = []
  const a = this.dataMom
  const b = treeBox
  for (var x = 0; x < a.length; x++) {
    for (var j = 0; j < b.length; j++) {
      if (a[x].id === b[j].parentId) {
        this.treeMom.push(a[x])
        break
      }
    }
  }
  // 合并遍历后的所有父指标和底层指标，做成树结构
  this.treeSum = treeBox.concat(this.treeMom)
  this.treeFin = this.fd.data.changeToTree(this.treeSum)
  console.log('this.treeFin:', this.treeFin)
  const defaultTree = [
    {
      id: 'departName',
      label: '考核对象',
      field: 'departName'
    }, {
      id: 'allScore',
      label: '分数',
      width: '80px',
      field: 'allScore'
    }, {
      id: 'rank',
      label: '排名',
      width: '80px',
      field: 'rank'
    }, {
      id: 'gradeName',
      label: '评档',
      width: '80px',
      field: 'gradeName'
    }]
  for (const key in defaultTree) {
    if (val.indexOf(defaultTree[key].id) > -1) {
      this.defaultTreeT.push({
        id: defaultTree[key].id,
        title: defaultTree[key].label,
        label: defaultTree[key].label,
        field: defaultTree[key].id
      })
      this.detailColsT.push(defaultTree[key].id)
    }
  }
  // 汇总表的表头
  this.tableTotalLoading = false
  this.tree = []
  this.$nextTick(() => {
    console.log('this.treeFin:', this.treeFin)
    this.tree = this.defaultTreeT.concat(this.treeFin)
    this.changeDetailHeader = this.defaultTreeT.concat(this.treeFin) // 为了获取点击分页菜单时，得到之前表格中所有表头
    this.changeDetailCheck = this.detailColsT.concat(this.detailCols, this.detailOtherCols) // 为了获取选中的底层指标，显示到自定义列表的选中按钮中
  })
  this.changeNum++
}
