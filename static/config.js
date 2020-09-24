window.config = {
  loginName: '智慧绩效管理', // 登录页面
  projectName: '智慧绩效管理', // 系统左上角显示名称
  title: '智慧绩效管理', // 浏览器title
  phone: '运维人员：18666899008',
  website: 'http://www.future-data.cn',
  systemKey: 'fd-kpi',
  uaa_url: '/uaa/',
  basic_url: '/basic/',
  zuul_url: '',
  project_url: '/kpi/',
  // 登录页支持多个系统切换，projects是每个系统信息的汇总
  projects: {
    kpi: {
      name: '绩效管理平台',
      // url: 'http://localhost:9875/'
      url: 'http://192.168.0.204:8083/fd-kpi-111/'
    }
  },
  cubeUrl: '/performance/workPerformance/judeWork',
  oldCubeUrl: '/performance/workPerformance/judeWork/workloadPeg',
  oldCubeUrlAssist: '/performance/workPerformance/judeWork/assistloadPeg'
}
