export function changeLabeltoValue() {
  // 将age内的自定义输入的label转为后台所需的value
  if (this.query.age.length) {
    this.query.age.forEach((item, i) => {
      if (this.ageMap[item]) {
        this.query.age[i] = this.ageMap[item]
      }
    })
  }
  // 将legalPositionDate内的自定义输入的label转为后台所需的value
  if (this.query.legalPositionDate.length) {
    this.query.legalPositionDate.forEach((item, i) => {
      if (this.legalPositionDateMap[item]) {
        this.query.legalPositionDate[i] = this.legalPositionDateMap[item]
      }
    })
  }
}
export function changeValuetoLabel() {
  // 将age内后台所需的value的转回到自定义输入的label来显示到select框中
  if (this.query.age.length) {
    this.query.age.forEach((item, i) => {
      if (this.ageIdMap[item]) {
        this.query.age[i] = this.ageIdMap[item]
      }
    })
  }
  // 将legalPositionDate内后台所需的value的转回到自定义输入的label来显示到select框中
  if (this.query.legalPositionDate.length) {
    this.query.legalPositionDate.forEach((item, i) => {
      if (this.legalPositionDateIdMap[item]) {
        this.query.legalPositionDate[i] = this.legalPositionDateIdMap[item]
      }
    })
  }
}
// 法院选择触发事件
export function courtNodeClick(data) {
  this.query.companyId = data.code
  this.query.companyName = data.label
  this.showDepartTree = false
}
// 刷新页面所有数据
export function refreshAll() {
  if (this.elements.total) {
    this.getData_total()
  }
  this.showKeys.forEach((item, index) => {
    this['getData_' + item](this.chartMap[item])
  })
}
// 根据配置权限获取用户能看到的图标
export function getShowData() {
  this.chartSort.forEach((item, index) => {
    if (this.elements[item]) {
      this.showData.push(this.chartMap[item])
      this.showKeys.push(item)
    }
  })
}
// 下载
export function downloadTotal() {
  // 需转化age和legalPositionDate的value值
  this.changeLabeltoValue()
  this.fd.tools.downloadByHtml(this.query, 'api/staff-analysis/download', 'post')
  console.log(this.query.age)
  this.$nextTick(function() {
    this.changeValuetoLabel()
  })
}
export function getData_personType(item) {
  this.getData(item, 'staff-type')
}
export function getData_workYear(item) {
  this.getData(item, 'work-seniority')
}
export function getData_degree(item) {
  this.getData(item, 'degree')
}
export function getData_age(item) {
  this.getData(item, 'age')
}
export function getData_educational(item) {
  this.getData(item, 'edu')
}
export function getData_duty(item) {
  this.getData(item, 'legal-position')
}
export function getData_sex(item) {
  this.getData(item, 'sex')
}
export function getData_level(item) {
  this.getData(item, 'judge-level')
}
export function getData_rank(item) {
  this.getData(item, 'level')
}
export function getData_politics(item) {
  this.getData(item, 'politics')
}
export function getData_legalPositionDate(item) {
  this.getData(item, 'level-date')
}
export function getData(item, key) {
  // 需转化age和legalPositionDate的value值
  this.changeLabeltoValue()
  this.fd.req({
    type: 'post',
    url: 'api/staff-analysis/' + key,
    data: this.query
  }).then(response => {
    item.allData = response.data
    this.$nextTick(function() {
      this.changeValuetoLabel()
    })
  }).catch(error => {
    console.log('getData_' + key, error)
  })
}
export function getData_total() {
  this.changeLabeltoValue()
  this.fd.req({
    type: 'post',
    url: 'api/staff-analysis/stats',
    data: this.query
  }).then(response => {
    const data = response.data
    this.totalRight.data = data.echartData
    const gaugeVo = data.gaugeVo || {}
    this.totalLeft.data = { name: '人员总数', ...this.fd.data.changeObjKey(gaugeVo, { maxValue: 'max', minValue: 'min', statValue: 'value' }) }
    this.$nextTick(function() {
      this.changeValuetoLabel()
    })
  }).catch(error => {
    console.log('getData_total', error)
  })
}
// 获取筛选条件内的筛选数据
export function getQueryData() {
  this.fd.req({
    type: 'get',
    url: 'api/staff-analysis/conditions',
    data: {
      companyId: this.query.companyId
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
      for (var i in this.query.age) {
        if (!Number(this.query.age[i])) {
          this.query.age.splice(i, 1)
        }
      }
      this.query.age.push(ageName)
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
      for (var i in this.query.legalPositionDate) {
        if (!Number(this.query.legalPositionDate[i])) {
          this.query.legalPositionDate.splice(i, 1)
        }
      }
      this.query.legalPositionDate.push(legalPositionDateName)
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

