import request from '@/utils/request'
// import Cookies from 'js-cookie'
// import { accessedRouterMap } from '@/mock/mockData'
// 登录密码加密
// import { getProductName, decrypt } from '@/api/common'
// export function login(username, password) {
//   return request({
//     url: '/api/auth/token',
//     method: 'post',
//     data: {
//       loginName: username,
//       password: decrypt(password.trim())
//     }
//   })
// }
// 登录密码不加密
import { getProductName } from '@/api/common'
export function login(username, password) {
  return request({
    url: '/api/auth/token',
    method: 'post',
    data: {
      loginName: username,
      password: password
    }
  })
}
export function loginByToken(tokenId) {
  return request({
    url: '/api/auth/hexinSso/token',
    method: 'get',
    params: {
      tokenId: tokenId
    }
  })
}

export function getTokenIdByUsername(username) {
  return request({
    url: '/api/auth/sgb/token',
    method: 'post',
    data: {
      loginName: username
    }
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getServerTime() {
  return request({
    url: window.config.basic_url + 'api/date',
    method: 'get'
  })
}

export function getUserInfo() {
  return request({
    url: window.config.uaa_url + 'api/user',
    method: 'get'
  })
}

export function getUserElements() {
  return request({
    url: window.config.uaa_url + 'api/user/resources/element',
    method: 'get',
    params: {
      product: getProductName()
    }
  })
}

export function getAsyncRouter() {
  return request({
    url: window.config.uaa_url + 'api/user/resources/menu',
    method: 'get',
    params: {
      product: getProductName()
    }
  })
}

export function getSelectOption() {
  return request({
    url: window.config.project_url + 'api/codes/product',
    method: 'get',
    params: {
      product: getProductName()
    }
  })
}

export function getCourts() {
  return request({
    url: window.config.uaa_url + 'api/groups',
    method: 'get',
    params: {
      product: getProductName()
    }
  })
}
export function getAllCourts() {
  return request({
    // kpi获取单位接口
    url: window.config.project_url + 'api/depart/company',
    method: 'get',
    params: {
      product: getProductName()
    }
  })
}
// 获取用户的菜单
export function getTestAsyncRouter() {
  return request({
    url: window.config.uaa_url + 'api/user/resources/menu',
    method: 'get',
    params: {
      product: getProductName() + ',system'
    }
  })
}
