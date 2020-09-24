import router from 'router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { getToken } from '@/utils/auth' // 验权
import { Message } from 'element-ui'

const client = []
const whiteList = ['/login', '/loading', '/authredirect', ...client]// 不重定向白名单

router.beforeEach((to, from, next) => {
  NProgress.start() // 开启Progress
  if (getToken()) { // 判断是否有token
    if (to.params.goBack !== undefined) {
      if (to.params.goBack !== 0) {
        from.params.goBack = to.params.goBack
        router.go(to.params.goBack)
      }
      next(false)
    } else if (from.params.goBack !== undefined) {
      const paths = from.path.split('/')
      const path = paths.slice(0, paths.length + from.params.goBack).join('/')
      if (to.path !== path) {
        from.params.goBack = undefined
        next({
          path: path
        })
      } else {
        next()
      }
    } else if (to.path === '/login') {
      next()
      NProgress.done() // router在hash模式下 手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    } else {
      if (!store.getters.name) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetOptions') // 获取功能下拉选项
        store.dispatch('GetMsec') // 获取服务器时间
        store.dispatch('GetUserInfo') // 获取用户信息
          .then(d => store.dispatch('GenerateRoutes'), () => {
            // 获取用户菜单权限
            store.dispatch('FedLogOut').then(() => {
              Message.error('验证失败,请重新登录')
              next({ path: '/login' })
            })
          })
          .then(d => store.dispatch('GetCourts'))
          .then(() => {
            if (store.getters.defaultRouter === '/') {
              store.dispatch('FedLogOut').then(() => {
                Message.warning('请先联系管理员分配页面权限')
                next({ path: '/login' })
              })
            } else {
              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            }
            if (to.path === '/') {
              next({ path: store.getters.defaultRouter })// 设置用户默认跳转的页面,默认跳转到 {path:'/'}
            } else {
              next({ path: to.fullPath })// 刷新后不改变当前页面
            }
          })
      } else {
        if (to.path === '/') {
          next({ path: store.getters.defaultRouter })// 设置用户默认跳转的页面,默认跳转到 {path:'/'}
        } else {
          next()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // router在hash模式下 手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    }
  }
})
router.afterEach(() => {
  NProgress.done() // 结束Progress
})
