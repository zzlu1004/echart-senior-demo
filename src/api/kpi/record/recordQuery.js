export function courtNodeClick(data) {
  this.params.companyId = data.code
  this.companyName = data.label
  this.showDepartTree = false
}
export function foldCard() {
  this.isOpen = !this.isOpen
}
export function changeLabeltoValue() {
  // 将age内的自定义输入的label转为后台所需的value
  if (this.params.age.length) {
    this.params.age.forEach((item, i) => {
      if (this.ageMap[item]) {
        this.params.age[i] = this.ageMap[item]
      }
    })
  }
  // 将legalPositionDate内的自定义输入的label转为后台所需的value
  if (this.params.legalPositionDate.length) {
    this.params.legalPositionDate.forEach((item, i) => {
      if (this.legalPositionDateMap[item]) {
        this.params.legalPositionDate[i] = this.legalPositionDateMap[item]
      }
    })
  }
}
export function changeValuetoLabel() {
  // 将age内后台所需的value的转回到自定义输入的label来显示到select框中
  if (this.params.age.length) {
    this.params.age.forEach((item, i) => {
      if (this.ageIdMap[item]) {
        this.params.age[i] = this.ageIdMap[item]
      }
    })
  }
  // 将legalPositionDate内后台所需的value的转回到自定义输入的label来显示到select框中
  if (this.params.legalPositionDate.length) {
    this.params.legalPositionDate.forEach((item, i) => {
      if (this.legalPositionDateIdMap[item]) {
        this.params.legalPositionDate[i] = this.legalPositionDateIdMap[item]
      }
    })
  }
}
export function getDepartList() {
  this.changeLabeltoValue()
  this.fd.req({
    type: 'post',
    url: 'api/staff/all',
    data: this.params
  }).then(response => {
    const data = response.data
    const sort = new Set(this.fd.data.getValuesByKey(data, 'departName'))
    const classify = this.fd.data.classify(data, 'departName')
    const cardData = []
    sort.forEach((item, index) => {
      cardData.push({ key: item, value: classify[item] })
    })
    this.cardData = cardData
    this.$nextTick(function() {
      this.changeValuetoLabel()
    })
  }).catch(error => {
    console.log(error)
  })
}
export function searchByKeyword(val) {
  this.params.keyword = val
  this.getDepartList()
}
export function gotoPeg(item) {
  this.fd.tools.goDetail.call(this, 'recordDetail', { query: { id: item.id, name: item.name }})
}
export function showMore(data) {
  this.limit = data.length
}
// 滚动条变化后事件
export function handleScroll() {
  const scrollTop = this.scrollDom.scrollTop + this.height
  const hidden = document.getElementsByClassName('photoHidden')
  const ids = []
  const doms = {}
  for (const item of hidden) {
    const itemTop = item.offsetTop
    if (itemTop < scrollTop) {
      if (!(item.className.indexOf('getting') > -1)) {
        item.setAttribute('class', 'photoHidden getting')
        const id = item.getAttribute('staffId')
        doms[id] = item
        ids.push(id)
      }
    }
  }
  this.getStaffPhoto(doms, ids)
}
export function getMorePhoto(className) {
  const hidden = document.getElementsByClassName(className)
  const ids = []
  const doms = {}
  for (const item of hidden) {
    const id = item.getAttribute('staffId')
    doms[id] = item
    ids.push(id)
  }
  this.getStaffPhoto(doms, ids)
}
export function getStaffPhoto(doms, ids) {
  if (ids.length > 0) {
    this.fd.req({
      type: 'get',
      url: 'api/users/photo/data',
      data: {
        userIds: ids.join()
      }
    }, 'uaa_url').then(response => {
      const data = this.fd.data.arrayToObj(response.data, 'id')
      ids.forEach((item, index) => {
        const userPhoto = data[item] && data[item].userPhoto
        if (userPhoto) {
          const img = doms[item].getElementsByTagName('img')[0]
          img.setAttribute('src', userPhoto)
        }
      })
    }).catch(error => {
      console.log(error)
    })
  }
}

export function getQueryData() {
  this.fd.req({
    type: 'get',
    url: 'api/staff-analysis/conditions',
    data: {
      companyId: this.params.companyId
    }
  }).then(response => {
    const data = response.data
    this.types = data.staffTypes
    this.departTypes = data.departTypes
    this.departData = data.departs
    this.age = data.age
    this.legalPositionDate = data.legalPositionDate
    this.degree = data.degree
    this.edu = data.edu
    this.grade = data.grade
    this.legalPosition = data.legalPosition
    this.level = data.level
    this.sex = data.sex
    this.politics = data.politics
    this.workSeniority = data.workSeniority
  }).catch(error => {
    console.log('getData_total', error)
  })
}
// 自定义年龄
export function addAge(formName) {
  this.ageMap = {}
  // 当自定义输入的数据验证成功
  this.$refs[formName].validate((valid) => {
    if (valid) {
      // 转化为select输入框内展示的文字形式label
      let ageName = ''
      if (this.ruleForm.startAge === '') {
        ageName = this.ruleForm.endAge + '岁及以下'
      } else if (this.ruleForm.endAge === '') {
        ageName = this.ruleForm.startAge + '岁及以上'
      } else {
        ageName = this.ruleForm.startAge + '-' + this.ruleForm.endAge + '岁'
      }
      // 转化为后台所需的格式value
      const ageId = this.ruleForm.startAge + '~' + this.ruleForm.endAge
      for (var i in this.params.age) {
        if (!Number(this.params.age[i])) {
          this.params.age.splice(i, 1)
        }
      }
      this.params.age.push(ageName)
      // 将value和label关联
      this.ageMap[ageName] = ageId
      this.ageIdMap[ageId] = ageName
      this.showEdit = false
    } else {
      console.log('age error submit!!')
      return false
    }
  })
}
// 自定义任职年限
export function addYear(formName) {
  this.legalPositionDateMap = {}
  // 当自定义输入的数据验证成功
  this.$refs[formName].validate((valid) => {
    if (valid) {
      // 转化为select输入框内展示的文字形式label
      let legalPositionDateName = ''
      if (this.ruleFormYear.startYear === '') {
        legalPositionDateName = this.ruleFormYear.endYear + '年及以下'
      } else if (this.ruleFormYear.endYear === '') {
        legalPositionDateName = this.ruleFormYear.startYear + '年及以上'
      } else {
        legalPositionDateName = this.ruleFormYear.startYear + '-' + this.ruleFormYear.endYear + '年'
      }
      // 转化为后台所需的格式value
      const legalPositionDateId = this.ruleFormYear.startYear + '~' + this.ruleFormYear.endYear
      for (var i in this.params.legalPositionDate) {
        if (!Number(this.params.legalPositionDate[i])) {
          this.params.legalPositionDate.splice(i, 1)
        }
      }
      this.params.legalPositionDate.push(legalPositionDateName)
      // 将value和label关联
      this.legalPositionDateMap[legalPositionDateName] = legalPositionDateId
      this.legalPositionDateIdMap[legalPositionDateId] = legalPositionDateName
      this.showYearEdit = false
    } else {
      console.log('legalPositionDate error submit!!')
      return false
    }
  })
}
