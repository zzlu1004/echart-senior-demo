export function tabCheck(data) {
  this.tab = data.id
  this.getMenus()
}
export function getUserInfo() {
  this.fd.req({
    type: 'get',
    url: 'api/staff/' + this.userId
  }).then(response => {
    const allData = response.data || {}
    this.isJudge = allData.typeId === 'k10003-01' // 是否是员额法官
    // this.isJudge = true // 是否是员额法官
    // this.tab = (this.elements.portrait && this.isJudge) ? 'portrait' : 'info'
    this.tab = 'info'
    this.getMenus()
  }).catch(error => {
    console.log(error)
  })
}
export function getMenus() {
  const menu1 = [{
    id: 'info',
    name: '基本信息',
    active: this.tab === 'info',
    icon: 'icon-gerenzhongxin'
  }, {
    id: 'score',
    name: '工作业绩',
    active: this.tab === 'score',
    icon: 'icon-yejibaobiao'
  }, {
    id: 'quality',
    name: '工作质效',
    active: this.tab === 'quality',
    icon: 'icon-ccgl-zhiliangshigu-6'
  }, {
    id: 'check',
    name: '工作考评',
    active: this.tab === 'check',
    icon: 'icon-kaopingrenwu'
  }, {
    id: 'study',
    name: '学习拓展',
    active: this.tab === 'study',
    icon: 'icon-xuexi'
  }, {
    id: 'rewardPunish',
    name: '工作奖惩',
    active: this.tab === 'rewardPunish',
    icon: 'icon-zhiliangrenzheng'
  }]
  /* const menu2 = [{
    id: 'portrait',
    name: '人物画像',
    active: this.tab === 'portrait',
    icon: 'portrait'
  }, {
    id: 'info',
    name: '基本信息',
    active: this.tab === 'info',
    icon: 'icon-gerenzhongxin'
  }, {
    id: 'score',
    name: '工作业绩',
    active: this.tab === 'score',
    icon: 'icon-yejibaobiao'
  }, {
    id: 'quality',
    name: '工作质效',
    active: this.tab === 'quality',
    icon: 'icon-ccgl-zhiliangshigu-6'
  }, {
    id: 'check',
    name: '工作考评',
    active: this.tab === 'check',
    icon: 'icon-kaopingrenwu'
  }, {
    id: 'study',
    name: '学习拓展',
    active: this.tab === 'study',
    icon: 'icon-xuexi'
  }, {
    id: 'rewardPunish',
    name: '工作奖惩',
    active: this.tab === 'rewardPunish',
    icon: 'icon-zhiliangrenzheng'
  }]*/
  // this.menuData = this.isJudge ? menu2 : menu1
  this.menuData = menu1
}
