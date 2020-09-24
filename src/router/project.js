import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
import { constant, async, router } from './index'
Vue.use(Router)
/* Layout */
import Layout from 'layout'
/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [...constant,
  { path: '/login', component: _import('login/login'), hidden: true },
  { path: '/loading', component: _import('login/loading'), hidden: true },
  {
    path: '/personal',
    component: Layout,
    name: '个人中心',
    hidden: true,
    children: [{
      path: 'setting',
      component: _import('setting/setting'),
      name: 'setting',
      hidden: true
    }]
  }]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
/*
 *  删除业务代码，只保留前端代码规范和示例代码。
 * */
export const asyncRouterMap = async
export const asyncRouter = {
  home: {
    name: 'home',
    component: _import('kpi/homeNew'),
    meta: { title: '首页', icon: 'example' },
    elements: [{
      resourceCode: 'judge',
      resourceName: '员额法官（业绩趋势+工作概览）',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'assistant',
      resourceName: '法官助理（业绩趋势+工作概览）',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'clerk',
      resourceName: '书记员（业绩趋势+工作概览）',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'other',
      resourceName: '司法行政人员（业绩趋势+工作概览）',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'projectInfo',
      resourceName: '方案信息',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'growRecord',
      resourceName: '成长档案',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'notice',
      resourceName: '通知公告-图标',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'onlineCheck',
      resourceName: '在线考核-图标',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'record',
      resourceName: '我的档案-图标',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'workResult',
      resourceName: '工作业绩-图标',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'study',
      resourceName: '学习拓展-图标',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'quality',
      resourceName: '工作质效-图标',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'reward',
      resourceName: '工作奖惩-图标',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  depart: {
    name: 'depart',
    component: _import('kpi/record/depart'),
    meta: { title: '部门管理', icon: 'example' },
    elements: [{
      resourceCode: 'add',
      resourceName: '新增',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'edit',
      resourceName: '编辑',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'delete',
      resourceName: '删除',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'sort',
      resourceName: '排序',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'changeParent',
      resourceName: '修改父级',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  businessLine: {
    name: 'businessLine',
    component: _import('kpi/record/businessLine'),
    meta: { title: '业务线管理', icon: 'example' },
    elements: [{
      resourceCode: 'add',
      resourceName: '新增',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'edit',
      resourceName: '编辑',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'delete',
      resourceName: '删除',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'changeParent',
      resourceName: '修改父级',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  roles: {
    name: 'roles',
    component: _import('kpi/record/roles'),
    meta: { title: '角色管理', icon: 'example' },
    elements: [{
      resourceCode: 'add',
      resourceName: '新增',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'edit',
      resourceName: '编辑',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'delete',
      resourceName: '删除',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  personal: {
    name: 'personal',
    component: _import('kpi/record/personal'),
    meta: { title: '人员管理', icon: 'example' },
    elements: [{
      resourceCode: 'add',
      resourceName: '添加人员',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'edit',
      resourceName: '详情的编辑新增',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'delete',
      resourceName: '批量删除',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'export',
      resourceName: '全部导出',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'import',
      resourceName: '批量导入',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'changeDepart',
      resourceName: '调整部门',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  personalDetail: {
    name: 'personalDetail',
    component: _import('kpi/record/personalDetail'),
    meta: { title: '人员详情', icon: 'example' },
    elements: [{
      resourceCode: 'add',
      resourceName: '新增',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'edit',
      resourceName: '编辑',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'basic',
      resourceName: '基本信息',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'resume',
      resourceName: '简历信息',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'education',
      resourceName: '学习经历',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'family',
      resourceName: '家庭信息',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'lawDuty',
      resourceName: '法律职务',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'changeDepart',
      resourceName: '部门变更',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  resultInfo: {
    name: 'resultInfo',
    component: _import('kpi/record/resultInfo'),
    meta: { title: '导入结果提示', icon: 'example' }
  },
  checkProcess: {
    name: 'checkProcess',
    component: _import('kpi/check/checkProcess'),
    meta: { title: '考核流程', icon: 'example' },
    elements: [{
      resourceCode: 'add',
      resourceName: '新增',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'edit',
      resourceName: '编辑',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'delete',
      resourceName: '删除',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'copy',
      resourceName: '复制',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  processDetail: {
    name: 'processDetail',
    component: _import('kpi/check/processDetail'),
    meta: { title: '考核流程详情', icon: 'example' }
  },
  target: {
    name: 'target',
    component: _import('kpi/check/target'),
    meta: { title: '考核指标', icon: 'example' },
    elements: [{
      resourceCode: 'addType',
      resourceName: '新增类别',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'add',
      resourceName: '新增',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'edit',
      resourceName: '编辑',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'delete',
      resourceName: '删除',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'copy',
      resourceName: '复制',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'sort',
      resourceName: '排序',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'report',
      resourceName: '综合填报',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'newSystem',
      resourceName: '新系统测算',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'system',
      resourceName: '旧系统测算',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'download',
      resourceName: '下载',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  indicatorSetting: {
    name: 'indicatorSetting',
    component: _import('kpi/check/indicatorSetting'),
    meta: { title: '指标详情', icon: 'example' }
  },
  indicatorSettingDepart: {
    name: 'indicatorSettingDepart',
    component: _import('kpi/checkDepart/indicatorSettingDepart'),
    meta: { title: '指标详情', icon: 'example' }
  },
  regulations: {
    name: 'regulations',
    component: _import('kpi/check/regulations'),
    meta: { title: '考核细则', icon: 'example' },
    elements: [{
      resourceCode: 'add',
      resourceName: '新增',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'edit',
      resourceName: '编辑',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'delete',
      resourceName: '删除',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'copy',
      resourceName: '复制',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'export',
      resourceName: '导出',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'import',
      resourceName: '导入',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  weightCoefficient: {
    name: 'weightCoefficient',
    component: _import('kpi/check/weight/coefficient'),
    meta: { title: '权重系数', icon: 'example' },
    elements: [{
      resourceCode: 'add',
      resourceName: '新增',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'edit',
      resourceName: '编辑',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'delete',
      resourceName: '删除',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'copy',
      resourceName: '复制',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'enabled',
      resourceName: '启用',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'cancel',
      resourceName: '取消启用',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'export',
      resourceName: '导出',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'import',
      resourceName: '导入',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  coefficientDetail: {
    name: 'coefficientDetail',
    component: _import('kpi/check/weight/coefficientDetail'),
    meta: { title: '权重系数详情', icon: 'example' }
  },

  selfTarget: {
    name: 'selfTarget',
    component: _import('kpi/check/selfTarget'),
    meta: { title: '自定义指标', icon: 'example' },
    elements: [{
      resourceCode: 'add',
      resourceName: '新增',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'edit',
      resourceName: '编辑',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'delete',
      resourceName: '删除',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'import',
      resourceName: '导入',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'sort',
      resourceName: '排序',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'export',
      resourceName: '导出',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  weightModel: {
    name: 'weightModel',
    component: _import('kpi/check/weight/weightModel'),
    meta: { title: '权重模型', icon: 'example' },
    elements: [{
      resourceCode: 'add',
      resourceName: '新增',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'edit',
      resourceName: '编辑',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'delete',
      resourceName: '删除',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'copy',
      resourceName: '复制',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'enabled',
      resourceName: '启用',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'cancel',
      resourceName: '取消启用',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'sort',
      resourceName: '排序',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  model_criList: {
    name: 'model_criList',
    component: _import('kpi/check/weight/model_criList'),
    meta: { title: '常规因素-刑事-列表', icon: 'example' }
  },
  model_civList: {
    name: 'model_civList',
    component: _import('kpi/check/weight/model_civList'),
    meta: { title: '常规因素-民事-列表', icon: 'example' }
  },
  model_civtList: {
    name: 'model_civtList',
    component: _import('kpi/check/weight/model_civtList'),
    meta: { title: '常规因素-民特-列表', icon: 'example' }
  },
  model_admList: {
    name: 'model_admList',
    component: _import('kpi/check/weight/model_admList'),
    meta: { title: '常规因素-行政-列表', icon: 'example' }
  },
  model_exeList: {
    name: 'model_exeList',
    component: _import('kpi/check/weight/model_exeList'),
    meta: { title: '常规因素-执行-列表', icon: 'example' }
  },
  model_fixedList: {
    name: 'model_fixedList',
    component: _import('kpi/check/weight/model_fixedList'),
    meta: { title: '固定因素-列表', icon: 'example' }
  },
  model_floatList: {
    name: 'model_floatList',
    component: _import('kpi/check/weight/model_floatList'),
    meta: { title: '浮动因素-列表', icon: 'example' }
  },
  addRegulation: {
    name: 'addRegulation',
    component: _import('kpi/check/addRegulation'),
    meta: { title: '考核细则', icon: 'example' }
  },
  regulationDetail: {
    name: 'regulationDetail',
    component: _import('kpi/check/regulationDetail'),
    meta: { title: '考核细则', icon: 'example' }
  },
  addMzRegulation: {
    name: 'addMzRegulation',
    component: _import('kpi/democracy/addMzRegulation'),
    meta: { title: '考核细则', icon: 'example' }
  },
  mzRegulationDetail: {
    name: 'mzRegulationDetail',
    component: _import('kpi/democracy/mzRegulationDetail'),
    meta: { title: '考核细则', icon: 'example' }
  },
  addMzRegulationDepart: {
    name: 'addMzRegulationDepart',
    component: _import('kpi/democracy/addMzRegulationDepart'),
    meta: { title: '考核细则', icon: 'example' }
  },
  mzRegulationDetailDepart: {
    name: 'mzRegulationDetailDepart',
    component: _import('kpi/democracy/mzRegulationDetailDepart'),
    meta: { title: '考核细则', icon: 'example' }
  },
  checkProject: {
    name: 'checkProject',
    component: _import('kpi/check/checkProject'),
    meta: { title: '考核方案', icon: 'example' },
    elements: [{
      resourceCode: 'add',
      resourceName: '新增',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'edit',
      resourceName: '编辑',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'delete',
      resourceName: '删除',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'effect',
      resourceName: '生效',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'close',
      resourceName: '结束',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'copy',
      resourceName: '复制',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'cancel',
      resourceName: '取消生效',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  addProject: {
    name: 'addProject',
    component: _import('kpi/check/addProject'),
    meta: { title: '新增考核', icon: 'example' }
  },
  projectDetail: {
    name: 'projectDetail',
    component: _import('kpi/check/projectDetail'),
    meta: { title: '方案详情', icon: 'example' },
    elements: [{
      resourceCode: 'k10015-01',
      resourceName: '综合绩效',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'k10015-02',
      resourceName: '审判绩效',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'k10015-03',
      resourceName: '民主测评',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'k10015-04',
      resourceName: '新民主测评',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  myCheck: {
    name: 'myCheck',
    component: _import('kpi/onlineCheck/myCheck'),
    meta: { title: '我的考核', icon: 'example' }
  },
  checkProgress: {
    name: 'checkProgress',
    component: _import('kpi/onlineCheck/checkProgress'),
    meta: { title: '考核进度', icon: 'example' },
    elements: [{
      resourceCode: 'k10015-01',
      resourceName: '综合绩效',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'k10015-02',
      resourceName: '审判绩效',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'k10015-03',
      resourceName: '民主测评',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'k10015-04',
      resourceName: '新民主测评',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  checkProgressDepart: {
    name: 'checkProgressDepart',
    component: _import('kpi/onlineCheckDepart/checkProgressDepart'),
    meta: { title: '考核进度', icon: 'example' },
    elements: [{
      resourceCode: 'k10015-01',
      resourceName: '综合绩效',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'k10015-02',
      resourceName: '审判绩效',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'k10015-03',
      resourceName: '民主测评',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'k10015-04',
      resourceName: '新民主测评',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  otherCheck: {
    name: 'otherCheck',
    component: _import('kpi/onlineCheck/otherCheck'),
    meta: { title: '其他考核', icon: 'example' }
  },
  myReportList: {
    name: 'myReportList',
    component: _import('kpi/onlineCheck/myReportList'),
    meta: { title: '我的考核填报详情', icon: 'example' },
    elements: [{
      resourceCode: 'see',
      resourceName: '查看',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  checkList: {
    name: 'checkList',
    component: _import('kpi/onlineCheck/checkList'),
    meta: { title: '其他考核待审核按人员详情', icon: 'example' },
    elements: [{
      resourceCode: 'see',
      resourceName: '查看',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  reportList: {
    name: 'reportList',
    component: _import('kpi/onlineCheck/reportList'),
    meta: { title: '其他考核待填报按人员详情', icon: 'example' },
    elements: [{
      resourceCode: 'see',
      resourceName: '查看',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  ruleCheckList: {
    name: 'ruleCheckList',
    component: _import('kpi/onlineCheck/ruleCheckList'),
    meta: { title: '其他考核待审核按细则详情', icon: 'example' }
  },
  ruleReportList: {
    name: 'ruleReportList',
    component: _import('kpi/onlineCheck/ruleReportList'),
    meta: { title: '其他考核待填报按细则详情', icon: 'example' }
  },
  planReportList: {
    name: 'planReportList',
    component: _import('kpi/onlineCheck/planReportList'),
    meta: { title: '其他考核待填报按方案详情', icon: 'example' }
  },
  mzReportList: {
    name: 'mzReportList',
    component: _import('kpi/onlineCheck/mzReportList'),
    meta: { title: '其他考核民主测评按细则详情', icon: 'example' }
  },
  mzReportListDepart: {
    name: 'mzReportListDepart',
    component: _import('kpi/onlineCheckDepart/mzReportListDepart'),
    meta: { title: '其他考核民主测评按细则详情', icon: 'example' }
  },
  checkDetail: {
    name: 'checkDetail',
    component: _import('kpi/onlineCheck/checkDetail'),
    meta: { title: '考核详情查看详情', icon: 'example' }
  },
  // 部门考核--在线考核
  myCheckDepart: {
    name: 'myCheckDepart',
    component: _import('kpi/onlineCheckDepart/myCheckDepart'),
    meta: { title: '我的考核', icon: 'example' }
  },
  otherCheckDepart: {
    name: 'otherCheckDepart',
    component: _import('kpi/onlineCheckDepart/otherCheckDepart'),
    meta: { title: '其他考核', icon: 'example' }
  },
  myReportListDepart: {
    name: 'myReportListDepart',
    component: _import('kpi/onlineCheckDepart/myReportListDepart'),
    meta: { title: '我的考核填报详情', icon: 'example' },
    elements: [{
      resourceCode: 'see',
      resourceName: '查看',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  checkListDepart: {
    name: 'checkListDepart',
    component: _import('kpi/onlineCheckDepart/checkListDepart'),
    meta: { title: '其他考核待审核按人员详情', icon: 'example' },
    elements: [{
      resourceCode: 'see',
      resourceName: '查看',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  reportListDepart: {
    name: 'reportListDepart',
    component: _import('kpi/onlineCheckDepart/reportListDepart'),
    meta: { title: '其他考核待填报按人员详情', icon: 'example' },
    elements: [{
      resourceCode: 'see',
      resourceName: '查看',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  ruleCheckListDepart: {
    name: 'ruleCheckListDepart',
    component: _import('kpi/onlineCheckDepart/ruleCheckListDepart'),
    meta: { title: '其他考核待审核按细则详情', icon: 'example' },
    elements: [{
      resourceCode: 'see',
      resourceName: '查看',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  ruleReportListDepart: {
    name: 'ruleReportListDepart',
    component: _import('kpi/onlineCheckDepart/ruleReportListDepart'),
    meta: { title: '其他考核待填报按细则详情', icon: 'example' }
  },
  checkDetailDepart: {
    name: 'checkDetailDepart',
    component: _import('kpi/onlineCheckDepart/checkDetailDepart'),
    meta: { title: '考核详情查看详情', icon: 'example' }
  },
  judeWork: {
    name: 'judeWork',
    component: _import('kpi/performance/judeWork'),
    meta: { title: '办案工作量', icon: 'example' },
    elements: [{
      resourceCode: 'depart',
      resourceName: '部门',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'judge',
      resourceName: '员额法官',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'assistant',
      resourceName: '法官助理',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'clerk',
      resourceName: '书记员',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'peg',
      resourceName: '数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  caseCountPeg: {
    name: 'caseCountPeg',
    component: _import('kpi/performance/caseCountPeg'),
    meta: { title: '案件详情', icon: 'example' }
  },
  workloadPeg: {
    name: 'workloadPeg',
    component: _import('kpi/performance/workloadPeg'),
    meta: { title: '办案工作量详情', icon: 'example' }
  },
  assistloadPeg: {
    name: 'assistloadPeg',
    component: _import('kpi/performance/assistloadPeg'),
    meta: { title: '工作量详情', icon: 'example' }
  },
  myResult: {
    name: 'myResult',
    component: _import('kpi/checkResult/myResult'),
    meta: { title: '我的结果', icon: 'example' },
    elements: [{
      resourceCode: 'total',
      resourceName: '综合绩效',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'check',
      resourceName: '审判绩效',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'peg',
      resourceName: '数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'active',
      resourceName: '生效中',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'finished',
      resourceName: '已结束',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  myResultDepart: {
    name: 'myResultDepart',
    component: _import('kpi/checkResultDepart/myResultDepart'),
    meta: { title: '我的结果', icon: 'example' },
    elements: [{
      resourceCode: 'total',
      resourceName: '综合绩效',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'check',
      resourceName: '审判绩效',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'peg',
      resourceName: '数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'active',
      resourceName: '生效中',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'finished',
      resourceName: '已结束',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  tableDetail: {
    name: 'tableDetail',
    component: _import('kpi/checkResult/tableDetail'),
    meta: { title: '明细报表', icon: 'example' },
    elements: [{
      resourceCode: 'k10015-01',
      resourceName: '综合绩效',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'k10015-02',
      resourceName: '审判绩效',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'k10015-03',
      resourceName: '民主测评',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'k10015-04',
      resourceName: '新民主测评',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'active',
      resourceName: '已生效',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'finished',
      resourceName: '已结束',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'public',
      resourceName: '已公示',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'peg',
      resourceName: '数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'average',
      resourceName: '指标均值',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  tableDetailDepart: {
    name: 'tableDetailDepart',
    component: _import('kpi/checkResultDepart/tableDetailDepart'),
    meta: { title: '明细报表', icon: 'example' },
    elements: [{
      resourceCode: 'k10015-01',
      resourceName: '综合绩效',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'k10015-02',
      resourceName: '审判绩效',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'k10015-03',
      resourceName: '民主测评',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'k10015-04',
      resourceName: '新民主测评',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'active',
      resourceName: '已生效',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'finished',
      resourceName: '已结束',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'public',
      resourceName: '已公示',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'peg',
      resourceName: '数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  staffDetail: {
    name: 'staffDetail',
    component: _import('kpi/checkResult/staffDetail'),
    meta: { title: '部门详情', icon: 'example' }
  },
  moralPeg: {
    name: 'moralPeg',
    component: _import('kpi/checkResult/moralPeg'),
    meta: { title: '个人详情', icon: 'example' }
  },
  mzIndexPeg: {
    name: 'mzIndexPeg',
    component: _import('kpi/checkResult/mzIndexPeg'),
    meta: { title: '个人详情', icon: 'example' }
  },
  mzIndexDepartPeg: {
    name: 'mzIndexDepartPeg',
    component: _import('kpi/checkResultDepart/mzIndexDepartPeg'),
    meta: { title: '部门详情', icon: 'example' }
  },
  moralPegDepart: {
    name: 'moralPeg',
    component: _import('kpi/checkResultDepart/components/moralPegDepart'),
    meta: { title: '部门个人详情', icon: 'example' }
  },
  targetCasePeg: {
    name: 'targetCasePeg',
    component: _import('kpi/checkResult/targetCasePeg'),
    meta: { title: '案件详情', icon: 'example' }
  },
  targetCasePegDepart: {
    name: 'targetCasePegDepart',
    component: _import('kpi/checkResultDepart/components/targetCasePegDepart'),
    meta: { title: '部门案件详情', icon: 'example' }
  },
  staffDetailDepart: {
    name: 'staffDetailDepart',
    component: _import('kpi/checkResultDepart/components/staffDetailDepart'),
    meta: { title: '部门详情', icon: 'example' }
  },
  personalMsg: {
    name: 'personalMsg',
    component: _import('kpi/center/personalMsg'),
    meta: { title: '个人信息', icon: 'example' },
    elements: [{
      resourceCode: 'basic',
      resourceName: '基本信息',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'resume',
      resourceName: '简历信息',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'education',
      resourceName: '学习经历',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'family',
      resourceName: '家庭信息',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'lawDuty',
      resourceName: '法律职务',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'change',
      resourceName: '部门变更',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  notice: {
    name: 'notice',
    component: _import('kpi/center/notice'),
    meta: { title: '通知公告', icon: 'example' },
    elements: [{
      resourceCode: 'all',
      resourceName: '全部',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'my',
      resourceName: '我的',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  noticeDetail: {
    name: 'noticeDetail',
    component: _import('kpi/center/noticeDetail'),
    meta: { title: '公告详情', icon: 'example' }
  },
  editNotice: {
    name: 'editNotice',
    component: _import('kpi/center/editNotice'),
    meta: { title: '编辑公告', icon: 'example' }
  },
  totalWork: {
    name: 'totalWork',
    component: _import('kpi/newRecord/totalWork'),
    meta: { title: '综合工作', icon: 'example' },
    elements: [{
      resourceCode: 'writing',
      resourceName: '办文汇总',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'ruleSystem',
      resourceName: '规章制度',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'specialWork',
      resourceName: '专项工作',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'workSummary',
      resourceName: '工作总结',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'researchReport',
      resourceName: '调研报告',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'runMeeting',
      resourceName: '会议材料',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'typeOther',
      resourceName: '其他',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'depart',
      resourceName: '部门',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'person',
      resourceName: '个人',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'writingPeg',
      resourceName: '办文汇总数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'ruleSystemPeg',
      resourceName: '规章制度数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'specialWorkPeg',
      resourceName: '专项工作数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'workSummaryPeg',
      resourceName: '工作总结数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'researchReportPeg',
      resourceName: '调研报告数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'runMeetingPeg',
      resourceName: '会议材料数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'typeOtherPeg',
      resourceName: '其他数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  workQuality: {
    name: 'workQuality',
    component: _import('kpi/qualityEfficiency/workQuality'),
    meta: { title: '办案公正', icon: 'example' },
    elements: [{
      resourceCode: 'depart',
      resourceName: '部门',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'judge',
      resourceName: '员额法官',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'peg',
      resourceName: '数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  workEfficiency: {
    name: 'workEfficiency',
    component: _import('kpi/qualityEfficiency/workEfficiency'),
    meta: { title: '办案效率', icon: 'example' },
    elements: [{
      resourceCode: 'depart',
      resourceName: '部门',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'judge',
      resourceName: '员额法官',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'peg',
      resourceName: '数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  workEffect: {
    name: 'workEffect',
    component: _import('kpi/qualityEfficiency/workEffect'),
    meta: { title: '办案效果', icon: 'example' },
    elements: [{
      resourceCode: 'depart',
      resourceName: '部门',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'judge',
      resourceName: '员额法官',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'peg',
      resourceName: '数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  judicialOpen: {
    name: 'judicialOpen',
    component: _import('kpi/qualityEfficiency/judicialOpen'),
    meta: { title: '司法公开', icon: 'example' },
    elements: [{
      resourceCode: 'depart',
      resourceName: '部门',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'judge',
      resourceName: '员额法官',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'peg',
      resourceName: '数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  workQeTargetPeg: {
    name: 'workQeTargetPeg',
    component: _import('kpi/qualityEfficiency/workQeTargetPeg'),
    meta: { title: '案件详情', icon: 'example' }
  },
  otherWork: {
    name: 'otherWork',
    component: _import('kpi/newRecord/otherWork'),
    meta: { title: '其他', icon: 'example' },
    elements: [{
      resourceCode: 'depart',
      resourceName: '部门',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'person',
      resourceName: '个人',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'peg',
      resourceName: '数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  studyDevelop: {
    name: 'studyDevelop',
    component: _import('kpi/newRecord/studyDevelop'),
    meta: { title: '学习拓展', icon: 'example' },
    elements: [{
      resourceCode: 'peg',
      resourceName: '数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  workQE: {
    name: 'workQE',
    component: _import('kpi/newRecord/workQE'),
    meta: { title: '工作质效', icon: 'example' },
    elements: [{
      resourceCode: 'workQuality',
      resourceName: '办案公正',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'workEfficiency',
      resourceName: '办案效率',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'workEffect',
      resourceName: '办案效果',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'judicialOpen',
      resourceName: '司法公开',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'workQualityPeg',
      resourceName: '办案公正数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'workEfficiencyPeg',
      resourceName: '办案效率数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'workEffectPeg',
      resourceName: '办案效果数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'judicialOpenPeg',
      resourceName: '司法公开数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  workReward: {
    name: 'workReward',
    component: _import('kpi/newRecord/workReward'),
    meta: { title: '工作奖惩', icon: 'example' },
    elements: [{
      resourceCode: 'peg',
      resourceName: '数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  train: {
    name: 'train',
    component: _import('kpi/newRecord/study/train'),
    meta: { title: '调训培训', icon: 'example' },
    elements: [{
      resourceCode: 'depart',
      resourceName: '部门',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'person',
      resourceName: '个人',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'peg',
      resourceName: '数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  judgeTrain: {
    name: 'judgeTrain',
    component: _import('kpi/newRecord/study/judgeTrain'),
    meta: { title: '法官培训', icon: 'example' },
    elements: [{
      resourceCode: 'depart',
      resourceName: '部门',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'person',
      resourceName: '个人',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'peg',
      resourceName: '数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  cadrePartTime: {
    name: 'cadrePartTime',
    component: _import('kpi/newRecord/study/cadrePartTime'),
    meta: { title: '干部兼职', icon: 'example' },
    elements: [{
      resourceCode: 'depart',
      resourceName: '部门',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'person',
      resourceName: '个人',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'peg',
      resourceName: '数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  studyTotalPeg: {
    name: 'studyTotalPeg',
    component: _import('kpi/newRecord/study/studyTotalPeg'),
    meta: { title: '工作详情', icon: 'example' }
  },
  reward: {
    name: 'reward',
    component: _import('kpi/newRecord/workReward/reward'),
    meta: { title: '表彰奖励', icon: 'example' },
    elements: [{
      resourceCode: 'depart',
      resourceName: '部门',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'person',
      resourceName: '个人',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'peg',
      resourceName: '数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  workEvalua: {
    name: 'workEvalua',
    component: _import('kpi/newRecord/evalua/workEvalua'),
    meta: { title: '工作考评', icon: 'example' },
    elements: [{
      resourceCode: 'depart',
      resourceName: '部门',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'personal',
      resourceName: '个人',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'averageScore',
      resourceName: '平均分详情',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'assessmentProgram',
      resourceName: '考核方案详情',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  totalWorkPeg: {
    name: 'totalWorkPeg',
    component: _import('kpi/newRecord/totalWorkPeg'),
    meta: { title: '发文详情', icon: 'example' }
  },
  workResult: {
    name: 'workResult',
    component: _import('kpi/newRecord/workResult'),
    meta: { title: '工作业绩', icon: 'example' },
    elements: [{
      resourceCode: 'total',
      resourceName: '综合工作',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'work',
      resourceName: '办案工作',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'writing',
      resourceName: '办文汇总',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'ruleSystem',
      resourceName: '规章制度',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'specialWork',
      resourceName: '专项工作',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'workSummary',
      resourceName: '工作总结',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'researchReport',
      resourceName: '调研报告',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'runMeeting',
      resourceName: '会议材料',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'typeOther',
      resourceName: '其他',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'judge',
      resourceName: '员额法官',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'assistant',
      resourceName: '法官助理',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'clerk',
      resourceName: '书记员',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'other',
      resourceName: '其他',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'totalPeg',
      resourceName: '综合工作数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'workPeg',
      resourceName: '办案工作数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'otherPeg',
      resourceName: '其他数据反查',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  recordQuery: {
    name: 'recordQuery',
    component: _import('kpi/record/recordQuery'),
    meta: { title: '档案查询', icon: 'example' },
    elements: [{
      resourceCode: 'result',
      resourceName: '考核结果',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  portraits: {
    name: 'portraits',
    component: _import('kpi/record/portraits'),
    meta: { title: '人物画像详情页', icon: 'example' },
    elements: [{
      resourceCode: 'chooseTarget',
      resourceName: '选择指标',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  portraitHome: {
    name: 'portraitHome',
    component: _import('kpi/record/portraitHome'),
    meta: { title: '人物画像首页', icon: 'example' },
    elements: []
  },
  // {
  //   resourceCode: 'portrait',
  //     resourceName: '人物画像',
  //   resourceType: 'button',
  //   requestUrl: '',
  //   requestType: 'get'
  // },
  recordDetail: {
    name: 'recordDetail',
    component: _import('kpi/record/recordDetail'),
    meta: { title: '档案详情', icon: 'example' },
    elements: [{
      resourceCode: 'info',
      resourceName: '基本信息',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'score',
      resourceName: '工作业绩',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'quality',
      resourceName: '工作质效',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'check',
      resourceName: '工作考评',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'study',
      resourceName: '学习拓展',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'rewardPunish',
      resourceName: '工作奖惩',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  caseOverview: {
    name: 'caseOverview',
    component: _import('kpi/leaderWork/caseOverview'),
    meta: { title: '办案概况', icon: 'example' },
    elements: [{
      resourceCode: 'allOrg',
      resourceName: '全院',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'postJudge',
      resourceName: '员额法官',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'JudgeAssistant',
      resourceName: '法官助理',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'clerks',
      resourceName: '书记员',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  teamOverview: {
    name: 'teamOverview',
    component: _import('kpi/leaderWork/teamOverview'),
    meta: { title: '队伍概况', icon: 'example' }
  },
  teamBuild: {
    name: 'teamBuild',
    component: _import('kpi/leaderWork/teamBuild'),
    meta: { title: '队伍建设', icon: 'example' }
  },
  recordAnalyze: {
    name: 'recordAnalyze',
    component: _import('kpi/record/recordAnalyze'),
    meta: { title: '档案分析', icon: 'example' },
    elements: [{
      resourceCode: 'total',
      resourceName: '汇总统计',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'personType',
      resourceName: '人员类型',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'workYear',
      resourceName: '工作年限',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'degree',
      resourceName: '学位',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'age',
      resourceName: '年龄',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'educational',
      resourceName: '学历',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'duty',
      resourceName: '法律职务',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'sex',
      resourceName: '性别',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'level',
      resourceName: '等级',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'rank',
      resourceName: '职级',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'politics',
      resourceName: '政治面貌',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'legalPositionDate',
      resourceName: '任职年限',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  levelPublic: {
    name: 'levelPublic',
    component: _import('kpi/onlineCheck/levelPublic'),
    meta: { title: '评档公示', icon: 'example' }
  },
  levelPublicDepart: {
    name: 'levelPublicDepart',
    component: _import('kpi/onlineCheckDepart/levelPublicDepart'),
    meta: { title: '评档公示', icon: 'example' }
  },
  publicDetail: {
    name: 'publicDetail',
    component: _import('kpi/onlineCheck/publicDetail'),
    meta: { title: '公示详情', icon: 'example' }
  },
  publicDetailDepart: {
    name: 'publicDetailDepart',
    component: _import('kpi/onlineCheckDepart/publicDetailDepart'),
    meta: { title: '公示详情', icon: 'example' }
  },
  trialTeam: {
    name: 'trialTeam',
    component: _import('kpi/record/trialTeam'),
    meta: { title: '团队管理', icon: 'example' },
    elements: [
      {
        resourceCode: 'casePeg',
        resourceName: '办案数量反查',
        resourceType: 'button',
        requestUrl: '',
        requestType: 'get'
      }
    ]
  },
  trialTeamPeg: {
    name: 'trialTeamPeg',
    component: _import('kpi/record/trialTeamPeg'),
    meta: { title: '案件详情', icon: 'example' }
  },
  checkProcessDepart: {
    name: 'checkProcessDepart',
    component: _import('kpi/checkDepart/checkProcessDepart'),
    meta: { title: '考核流程', icon: 'example' },
    elements: [{
      resourceCode: 'add',
      resourceName: '新增',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'edit',
      resourceName: '编辑',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'delete',
      resourceName: '删除',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'copy',
      resourceName: '复制',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  processDetailDepart: {
    name: 'processDetailDepart',
    component: _import('kpi/checkDepart/processDetailDepart'),
    meta: { title: '考核流程详情', icon: 'example' }
  },
  targetDepart: {
    name: 'targetDepart',
    component: _import('kpi/checkDepart/targetDepart'),
    meta: { title: '考核指标', icon: 'example' },
    elements: [{
      resourceCode: 'addType',
      resourceName: '新增类别',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'add',
      resourceName: '新增',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'edit',
      resourceName: '编辑',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'delete',
      resourceName: '删除',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'copy',
      resourceName: '复制',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'sort',
      resourceName: '排序',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'report',
      resourceName: '综合填报',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'newSystem',
      resourceName: '新系统测算',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'download',
      resourceName: '下载',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  regulationsDepart: {
    name: 'regulationsDepart',
    component: _import('kpi/checkDepart/regulationsDepart'),
    meta: { title: '考核细则', icon: 'example' },
    elements: [{
      resourceCode: 'add',
      resourceName: '新增',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'edit',
      resourceName: '编辑',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'delete',
      resourceName: '删除',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'copy',
      resourceName: '复制',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'export',
      resourceName: '导出',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'import',
      resourceName: '导入',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  addRegulationDepart: {
    name: 'addRegulationDepart',
    component: _import('kpi/checkDepart/addRegulationDepart'),
    meta: { title: '考核细则', icon: 'example' }
  },
  regulationDetailDepart: {
    name: 'regulationDetailDepart',
    component: _import('kpi/checkDepart/regulationDetailDepart'),
    meta: { title: '考核细则', icon: 'example' }
  },
  checkProjectDepart: {
    name: 'checkProjectDepart',
    component: _import('kpi/checkDepart/checkProjectDepart'),
    meta: { title: '考核方案', icon: 'example' },
    elements: [{
      resourceCode: 'add',
      resourceName: '新增',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'edit',
      resourceName: '编辑',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'delete',
      resourceName: '删除',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'effect',
      resourceName: '生效',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'close',
      resourceName: '结束',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'copy',
      resourceName: '复制',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'cancel',
      resourceName: '取消生效',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  addProjectDepart: {
    name: 'addProjectDepart',
    component: _import('kpi/checkDepart/addProjectDepart'),
    meta: { title: '新增考核', icon: 'example' }
  },
  projectDetailDepart: {
    name: 'projectDetailDepart',
    component: _import('kpi/checkDepart/projectDetailDepart'),
    meta: { title: '方案详情', icon: 'example' },
    elements: [{
      resourceCode: 'k10015-01',
      resourceName: '综合绩效',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'k10015-02',
      resourceName: '审判绩效',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'k10015-03',
      resourceName: '民主测评',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'k10015-04',
      resourceName: '新民主测评',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  mzProcess: {
    name: 'mzProcess',
    component: _import('kpi/democracy/mzProcess'),
    meta: { title: '测评流程', icon: 'example' },
    elements: [{
      resourceCode: 'add',
      resourceName: '新增',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'edit',
      resourceName: '编辑',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'delete',
      resourceName: '删除',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'copy',
      resourceName: '复制',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  mzProcessDetail: {
    name: 'mzProcessDetail',
    component: _import('kpi/democracy/mzProcessDetail'),
    meta: { title: '测评流程详情', icon: 'example' }
  },
  mzProcessDetailDepart: {
    name: 'mzProcessDetailDepart',
    component: _import('kpi/democracy/mzProcessDetailDepart'),
    meta: { title: '部门测评流程详情', icon: 'example' }
  },
  mzTarget: {
    name: 'mzTarget',
    component: _import('kpi/democracy/mzTarget'),
    meta: { title: '测评指标', icon: 'example' },
    elements: [{
      resourceCode: 'add',
      resourceName: '新增',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'edit',
      resourceName: '编辑',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'copy',
      resourceName: '复制',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'delete',
      resourceName: '删除',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'depart',
      resourceName: '部门',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'person',
      resourceName: '个人',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  gearHouse: {
    name: 'gearHouse',
    component: _import('kpi/democracy/gearHouse'),
    meta: { title: '档位库', icon: 'example' },
    elements: [{
      resourceCode: 'add',
      resourceName: '新增',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'edit',
      resourceName: '编辑',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'delete',
      resourceName: '删除',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  mzRegulations: {
    name: 'mzRegulations',
    component: _import('kpi/democracy/mzRegulations'),
    meta: { title: '考核细则', icon: 'example' },
    elements: [{
      resourceCode: 'add',
      resourceName: '新增',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'edit',
      resourceName: '编辑',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'delete',
      resourceName: '删除',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'copy',
      resourceName: '复制',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'export',
      resourceName: '导出',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'import',
      resourceName: '导入',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'depart',
      resourceName: '部门',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'person',
      resourceName: '个人',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  help: {
    name: 'help',
    component: _import('kpi/help/help'),
    meta: { title: '帮助中心', icon: 'example' },
    elements: [{
      resourceCode: 'add',
      resourceName: '新增',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'edit',
      resourceName: '编辑',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'delete',
      resourceName: '删除',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'showDetail',
      resourceName: '预览',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }, {
      resourceCode: 'download',
      resourceName: '下载',
      resourceType: 'button',
      requestUrl: '',
      requestType: 'get'
    }]
  },
  ...router
}
