import { login, loginByToken, logout, getUserInfo, getUserElements, getTokenIdByUsername } from '@/api/login'
import { getToken, setToken, removeToken, getLocalStorage, setLocalStorage, clearLocalStorage } from '@/utils/auth'
// import dataMethods from '@/utils/data'

const user = {
  state: {
    user: '',
    userInformation: {},
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    elements: {},
    defaultRouter: '/', // 存放用户默认页面
    setting: {
      articlePlatform: []
    },
    permissionMenu: [],
    origionPermissionMenu: []
  },

  mutations: {
    SET_USER: (state, user) => {
      state.userInformation = user
    },
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ELEMENTS: (state, elements) => {
      state.elements = elements
    },
    SET_DEFAULTROUTER: (state, defaultRouter) => {
      state.defaultRouter = defaultRouter || '/'
    },
    SET_PERMISSION_MENU: (state, treeList) => {
      state.permissionMenu = treeList
    },
    SET_ORIGION_PERMISSION_MENU: (state, list) => {
      state.origionPermissionMenu = list
    }
  },
  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      localStorage.clear() // 登录前把本地缓存数据删除
      commit('SET_NAME', '')// 登录成功后重新获取用户信息
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          commit('SET_TOKEN', data.token)
          // 登录成功后重新获取用户信息
          setToken(data.token)
          resolve()
        }).catch(error => {
          console.log('mockLogin-error', error)
          reject(error)
        })
      })
    },
    // 用tokenId登录-和信
    LoginByTokenId({ commit }, tokenId) {
      localStorage.clear() // 登录前把本地缓存数据删除
      commit('SET_NAME', '')// 登录成功后重新获取用户信息
      return new Promise((resolve, reject) => {
        loginByToken(tokenId).then(response => {
          const data = response.data
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        }).catch(error => {
          console.log('mockLogin-error', error)
          reject(error)
        })
      })
    },
    // 用tokenId登录-数魔方
    LoginByCude({ commit }, tokenId) {
      localStorage.clear() // 登录前把本地缓存数据删除
      commit('SET_NAME', '')// 登录成功后重新获取用户信息
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', tokenId)
        setToken(tokenId)
        resolve()
      })
    },
    // 用loginName登录-数魔方2.0
    LoginByLoginName({ commit }, userName) {
      localStorage.clear() // 登录前把本地缓存数据删除
      commit('SET_NAME', '')// 登录成功后重新获取用户信息
      return new Promise((resolve, reject) => {
        getTokenIdByUsername(userName).then(response => {
          const data = response.data
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // {"code":200,"message":"用户信息查询成功","data":{"id":"128697000018313216","userName":"小王","loginName":"admin","departId":"001","departName":null,"sortId":1,"password":"admin","passwordChgTimes":0,"salt":"001","userLevel":"001","employeeNum":"001","userMobile":null,"userEmail":null,"userStatus":null,"comments":null,"userBirthdate":null,"userSex":null,"userIdcard":null,"userPhoto":null,"workDate":null,"workDuty":null,"workTelephone":null,"partyId":null,"undeletableFlag":null,"createTime":1513912556000,"createUser":"null","updateTime":1513912556000,"updateUser":"null"}}
    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        const user = getLocalStorage('user')
        if (user) {
          const data = JSON.parse(user)
          commit('SET_ROLES', [data.loginName])
          commit('SET_USER', data)
          commit('SET_NAME', data.id)
          commit('SET_AVATAR', data.userName)
          resolve()
        } else {
          getUserInfo().then(response => {
            const data = response.data
            setLocalStorage('user', data)
            commit('SET_ROLES', [data.loginName])
            commit('SET_USER', data)
            commit('SET_NAME', data.id)
            commit('SET_AVATAR', data.userName)
            resolve(response)
          }).catch(error => {
            reject(error)
          })
        }
        const elements = getLocalStorage('elements')
        if (elements) {
          const data = JSON.parse(elements)
          commit('SET_ELEMENTS', data)
        } else {
          getUserElements().then(response => {
            const data = response.data || []
            const pageElements = {}
            data.forEach(function(v, k) {
              if (!pageElements[v.parentResourceCode]) {
                pageElements[v.parentResourceCode] = {}
              }
              pageElements[v.parentResourceCode][v.resourceCode] = true
            })
            setLocalStorage('elements', pageElements)
            commit('SET_ELEMENTS', pageElements)
          }).catch(error => {
            reject(error)
          })
        }
      })
    },
    // 设置默认路由
    SetDefaultRouter({ commit }, router) {
      commit('SET_DEFAULTROUTER', router)
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_NAME', '')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        clearLocalStorage()
        removeToken()
        resolve()
      })
    },
    Reset({ commit }) {
      return new Promise(resolve => {
        setLocalStorage('selects', '')
        setLocalStorage('user', '')
        setLocalStorage('court', '')
        setLocalStorage('allCourt', '')
        commit('SET_NAME', '')
        resolve()
      })
    },
    GetPermissionMenu({ commit }) {
      return new Promise((resolve, reject) => {
        // getPermissionMenu()
        //   .then(res => {
        //     const { data } = res.data
        //     const treeListdata = dataMethods.listToTree(data, {
        //       idKey: 'id',
        //       parentKey: 'parentId'
        //     })
        //     commit('SET_ORIGION_PERMISSION_MENU', data)
        //     commit('SET_PERMISSION_MENU', treeListdata)
        //     resolve()
        //   })
        //   .catch(error => {
        //     reject(error)
        //   })
      })
    }
  }
}

export default user
