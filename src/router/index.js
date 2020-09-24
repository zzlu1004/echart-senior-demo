import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constant = [
  // { path: '/client', component: _import('clientViews/resourcesCenter/resourcesCenter'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constant
})
/*
 *  删除业务代码，只保留前端代码规范和示例代码。
 * */
export const async = [{ path: '*', redirect: '/404', hidden: true }]
export const router = {
  group: {
    name: 'group',
    component: _import('system/group'),
    meta: { title: '分组管理', icon: 'example' }
  },
  resource: {
    name: 'resource',
    component: _import('system/resource'),
    meta: { title: '资源管理', icon: 'example' }
  },
  user: {
    name: 'user',
    component: _import('system/user'),
    meta: { title: '用户管理', icon: 'example' }
  },
  operationLog: {
    name: 'operationLog',
    component: _import('system/operationLog'),
    meta: { title: '操作日志', icon: 'example' }
  },
  loginLog: {
    name: 'loginLog',
    component: _import('system/loginLog'),
    meta: { title: '登录日志', icon: 'example' }
  },
  sysVersion: {
    name: 'sysVersion',
    component: _import('system/sys_version'),
    meta: { title: '版本管理', icon: 'example' }
  }
}
