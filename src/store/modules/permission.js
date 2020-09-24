import { constantRouterMap, asyncRouterMap, asyncRouter } from 'router'
// import { getAsyncRouter } from '@/api/login'
import { getTestAsyncRouter } from '@/api/login'
import data from '@/utils/data'
import store from '@/store'
import Layout from 'layout'
// import Layout from '@/views/layout/layout_v'
// import { mergeMockRoutes } from '@/utils/auth'

/**
 * 过滤掉空的目录和系统不支持的页面
 * @param asyncRouter 代码支持的模块
 * @param menuData 数据返回的目录
 */
function filterAsyncRouter(menuData) {
  menuData = menuData || []
  const back = {
    menus: [],
    routers: [],
    menuMap: {}
  }
  const menu = []
  menuData.forEach(function(v, k) {
    // 页面在支持的路径中或者不是页面
    if (asyncRouter[v.resourceCode] || v.resourceType !== 'page') {
      menu.push(v)
    }
    back.menuMap[v.resourceCode] = v
  })
  // console.log(menu)
  const menus = data.changeToTree(menu, 'id', 'parentId')
  // console.log(menus)
  back.menus = filterMenus(menus)
  const defaultRouter = getDefaultRouter(back.menus[0])
  back.routers = getAsyncRouter(menus)
  store.dispatch('SetDefaultRouter', defaultRouter)
  return back
}
// 获取默认路由
function getDefaultRouter(item = {}, path = '/') {
  if (item.children) {
    path = getDefaultRouter(item.children[0], path + item.resourceCode + '/')
  } else {
    path = path + item.resourceCode
  }
  return path
}
// 过滤不显示的菜单
function filterMenus(menus) {
  menus = JSON.parse(JSON.stringify(menus))
  const back = menus.filter((item, index) => {
    // 本身隐藏的不显示, 本身类型不是页面，又没有子集的不显示
    if (item.routeHidden === '1' || (item.resourceType !== 'page' && !item.children)) {
      return false
    } else if (item.resourceType === 'page') { // 页面且不隐藏，不论是否有子页面，子页面是否隐藏
      // 菜单中存子页面
      item.children = null
      return true
    }
    // 如果本身是menu,有子集，但子集都隐藏，或者子集只有目录，没有页面，该节点不返回
    const hidden = getChildrenHidden(item.children)
    if (hidden) {
      return false
    } else { // 本身有子集，且子集中有需要显示的
      item.children = filterMenus(item.children)
      return true
    }
  })
  return back
}
// 获取子集隐藏情况
function getChildrenHidden(children) {
  let hidden = true // 默认节点隐藏
  for (const item of children) {
    // 子集有页面且不隐藏，该节点显示，满足显示条件的时候直接返回结果，结束循环
    if (item.resourceType === 'page' && item.routeHidden !== '1') {
      hidden = false
      break
    } else if (item.type !== 'page' && item.children && item.children.length > 0) { // 非页面，且有子集。说明不是空目录
      hidden = getChildrenHidden(item.children)
      if (!hidden) {
        break
      }
    }
  }
  return hidden
}
// 处理最终显示的路由，生成path路径
function getAsyncRouter(menus) {
  const routers = []
  for (const item of menus) {
    routers.push(...getAsyncPath(item))
  }
  return routers
}
function getAsyncPath(item, path = '', parentName = '') {
  const routers = []
  if (item.children) {
    for (const li of item.children) {
      routers.push(...getAsyncPath(li, (path + item.resourceCode + '/'), (item.resourceType === 'page' ? asyncRouter[item.resourceCode].name : '')))
    }
  }
  // 只有页面才有有效的路径
  if (item.resourceType === 'page') {
    routers.push({
      meta: { title: item.resourceName, icon: item.iconClass },
      code: item.resourceCode,
      name: (parentName ? (parentName + '-') : '') + asyncRouter[item.resourceCode].name,
      component: asyncRouter[item.resourceCode].component,
      path: path + item.resourceCode
    })
  }
  return routers
}
const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    SET_MENUMAP: (state, map) => {
      state.menuMap = map
    }
  },
  actions: {
    GenerateRoutes({ commit, state }) {
      return new Promise((resolve, reject) => {
        getTestAsyncRouter().then(res => {
          // 获取支持的路由 {menus: // 只包含目录和显示的页面，routers //页面支持的路由 }
          const filters = filterAsyncRouter(res.data)
          // console.log(filters)
          const routers = [{
            component: Layout,
            path: '/',
            children: [...filters.routers]
          }, ...asyncRouterMap]
          commit('SET_ROUTERS', routers)
          commit('SET_MENUMAP', filters.menuMap)
          commit('SET_MENUS', filters.menus)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default permission
