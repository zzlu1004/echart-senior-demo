import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
// import { getToken } from '@/utils/auth'

// 创建axios实例
// axios.defaults.headers.post['Content-Type'] = 'application/json'
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 60000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  const token = store.getters.token
  if (token) {
    config.headers['Authorization'] = token

    // 这里主要是为了兼容IE9
    var browser = navigator.appName
    var b_version = navigator.appVersion
    if (browser === 'Netscape' && b_version.indexOf(';') < 0) { // 火狐
    } else {
      if (b_version.indexOf(';') < 0) {
        return config
      }
      var version = b_version.split(';')
      var trim_Version = version[1].replace(/[ ]/g, '')
      if (browser === 'Microsoft Internet Explorer' && trim_Version === 'MSIE9.0') {
        if (config.url.indexOf('?') > 0) {
          config.url = config.url + '&token=' + token
        } else {
          config.url = config.url + '?token=' + token
        }
      }
    }
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const resp = response.data
    if (resp.code > 299) {
      Message.error({ message: resp.message, duration: 5000 })
      return Promise.reject('error')
    }
    return resp
  },
  // {
  // /**
  // * code为非20000是抛错 可结合自己业务进行修改
  // */
  //   const res = response.data
  //   console.log('response', res)
  //   if (res.code !== 20000) {
  //     Message({
  //       message: res.data,
  //       type: 'error',
  //       duration: 5 * 1000
  //     })
  //
  //     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //       MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //         confirmButtonText: '重新登录',
  //         cancelButtonText: '取消',
  //         type: 'warning'
  //       }).then(() => {
  //         store.dispatch('FedLogOut').then(() => {
  //           location.reload()// 为了重新实例化vue-router对象 避免bug
  //         })
  //       })
  //     }
  //     return Promise.reject('error')
  //   } else {
  //     return response.data
  //   }
  // },
  error => {
    console.log('err' + error)// for debug
    // 个人考核和部门考核，校验填报材料说明提交失败时弹出“报错提醒”模态框，与此处的message框重复，特设code412，不弹出message
    if (error.response.data.code === 412) {
      return Promise.reject(error)
    } else {
      const resp = error.response.data
      const message = resp ? resp.message || error.message : error.message
      Message({
        message: message,
        type: 'error'
      })
      return Promise.reject(error)
    }
  }
)

export default service
