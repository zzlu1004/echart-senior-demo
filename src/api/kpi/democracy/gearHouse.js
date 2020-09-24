export function addGear() {
  this.gearFrom.id = ''
  this.gearFrom.collectionName = ''
  this.gearFrom.gears = []
  this.editGearTitle = '新增档位'
  this.editGearDialog = true
  this.$nextTick(() => {
    this.resetForm('gearForm')
    this.gearFrom.id = ''
    this.gearFrom.collectionName = ''
    this.gearFrom.gears = [{
      id: '',
      gearName: '',
      collectId: ''
    }]
    this.disabled_edit = false
  })
}
export function addGears() {
  if (this.gearFrom.gears && this.gearFrom.gears.length === 10) {
    this.$message({
      type: 'warning',
      message: '档位不超过10个！'
    })
    return
  }
  this.gearFrom.gears.push({
    id: '',
    gearName: '',
    collectId: ''
  })
}
// 新建编辑档位保存
export function saveGear() {
  if (!this.gearFrom.collectionName) {
    this.$message({
      type: 'error',
      message: '请输入档位名称'
    })
    return
  }
  if (this.gearFrom.gears.length === 1 && this.gearFrom.gears[0].gearName === '') {
    this.$message({
      type: 'error',
      message: '请输入至少一个档位'
    })
    return
  }
  this.$refs.gearForm.validate((valid) => {
    if (valid) {
      // 校验去除输入档位名称的空值
      const gearGroup = []
      if (this.gearFrom.gears.length > 1) {
        this.gearFrom.gears.forEach((item, index) => {
          if (item.gearName) {
            gearGroup.push(item)
          }
        })
      }
      // 校验去除相同的档位名称
      this.flag = false
      const gearGroup2 = []
      gearGroup.forEach((item) => {
        gearGroup2.push(item.gearName)
      })
      for (var i = 0; i < gearGroup2.length; i++) {
        for (var j = i + 1; j < gearGroup2.length; j++) {
          if (gearGroup2[i] === gearGroup2[j]) {
            this.flag = true
            this.commonGear = gearGroup2[i]
            break
          }
        }
      }
      if (this.flag) {
        this.$message({
          type: 'error',
          message: '重复的档位名称:' + this.commonGear
        })
        return
      }
      // 添加sortId字段给后台
      const gearDatas = []
      gearGroup.forEach((item, i) => {
        gearDatas.push({ ...item, sortId: i })
      })
      const type = this.gearFrom.id ? 'put' : 'post'
      this.fd.req({
        type: type,
        url: 'api/collections',
        data: {
          id: this.gearFrom.id,
          gears: gearDatas,
          collectionName: this.gearFrom.collectionName
        }
      }).then(response => {
        this.editGearDialog = false
        this.getGearData()
      }).catch(error => {
        console.log('saveGear', error)
      })
    } else {
      return false
    }
  })
}
// 获取档位表格内容
export function getGearData() {
  this.loading = true
  this.fd.req({
    type: 'get',
    url: 'api/collections',
    data: {
      limit: this.limit,
      offset: this.offset,
      keyword: this.keyword,
      paging: true
    }
  }).then(response => {
    const data = response.data
    this.gearData = data.data
    // 解决了删除dialog输入框中的值同时删除表格中内容的问题
    this.gearData.forEach((item, i) => {
      item.gears.forEach((items, i) => {
        items.names = items.gearName
      })
    })
    this.total = data.total
    this.loading = false
  }).catch(error => {
    console.log('getGearData', error)
  })
}
// 删除档位
export function deleteGear(data) {
  this.rerelatedIndexes = ''
  if (data.indexs && data.indexs.length > 0) {
    data.indexs.forEach((item) => {
      this.rerelatedIndexes += ' 《 ' + item.name + ' 》 '
    })
    this.$confirm(' “ ' + data.collectionName + ' ” ' + '已关联：' + this.rerelatedIndexes + '，若确认删除，请检查以上指标的规则是否合理。', '刪除档位', {
      type: 'warning'
    }).then(() => {
      this.fd.req({
        url: 'api/collections/' + data.id,
        method: 'delete'
      }).then((d) => {
        this.getGearData()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      })
    }).catch(() => {})
  } else {
    this.$confirm('确认删除档位集合' + ' “ ' + data.collectionName + ' ” ' + '吗？', '刪除档位', {
      type: 'warning'
    }).then(() => {
      this.fd.req({
        url: 'api/collections/' + data.id,
        method: 'delete'
      }).then((d) => {
        this.getGearData()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      })
    }).catch(() => {})
  }
}
// 编辑档位
export function editGear(row) {
  // 同一为了解决了删除dialog输入框中的值同时删除表格中内容的问题，由于表格里gears的gearName被删除，需要用names重新赋值
  row.gears.forEach((items, i) => {
    items.gearName = items.names
  })
  this.gearFrom.id = ''
  this.gearFrom.collectionName = ''
  this.gearFrom.gears = []
  this.editGearTitle = '编辑档位'
  this.editGearDialog = true
  this.rowId = row.id
  this.$nextTick(() => {
    this.$refs['gearForm'].resetFields()
    const gearGroup = []
    if (row.gears.length > 1) {
      row.gears.forEach((item, index) => {
        if (item.gearName) {
          gearGroup.push(item)
        }
      })
    }
    this.gearFrom.id = row.id
    this.gearFrom.collectionName = row.collectionName
    this.gearFrom.gears = gearGroup || []
  })
}
export function currentChange(val) {
  this.offset = (val - 1) * this.limit
  this.getGearData()
}
export function sizeChange(val) {
  this.limit = val
  this.offset = 0
  this.getGearData()
}
export function searchByKeyword(val) {
  this.keyword = val
  this.getGearData()
}
export function cancelGear() {
  this.$refs['gearForm'].resetFields()
  this.editGearDialog = false
}
