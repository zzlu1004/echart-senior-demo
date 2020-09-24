export function getTargetConById() {
  this.fd.req({
    url: 'api/evaluations/flows/detail',
    method: 'get',
    data: this.params
  }).then((d) => {
    if (!d.data) {
      return
    }
    const data = d.data || {}
    this.targetCon = data
    // 填报和审核右侧的主体内容
    data.nodes.forEach((d, i) => {
      if (d.level === 1) {
        this.fillNodes.push(d)
      } else {
        this.checkNodes.push(d)
      }
    })
    // console.log('this.fillNodes', this.fillNodes)
    // 填报和审核左侧的导航菜单
    this.menuOpt.menuList = []
    // 填报
    this.fillNodes.forEach((d, i) => {
      // 单填报流程显示填报，多填报流程显示填报1，填报2，。。。
      this.menuOpt.menuList.push({ id: 'node_' + d.id, text: data.fillType === 'k10036-01' ? '填报' : '填报' + (i + 1) })
    })
    // 审核
    this.checkNodes.forEach((d, i) => {
      this.menuOpt.menuList.push({ id: 'node_' + d.id, text: '审核' + (i + 1) })
    })
    this.menuOpt.menuList.push({ id: 'node_score', text: '得分' })
  })
}
