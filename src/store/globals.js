import data from '@/utils/data'
import { getSelectOption, getCourts, getAllCourts, getServerTime } from '@/api/login'
import { getLocalStorage, setLocalStorage } from '@/utils/auth'

const config = window.config
// import mock from '@/mock/login'
const date = new Date().toJSON().substring(0, 10)
let lastMonth = new Date().getMonth()
lastMonth = lastMonth === 0 ? '12' : (lastMonth < 10 ? '0' + lastMonth : '' + lastMonth)
const globals = {
  state: {
    selects: {},
    height: window.innerHeight,
    width: window.innerWidth,
    size: window.innerHeight * window.innerWidth,
    date: date,
    msec: 0,
    year: date.substring(0, 4),
    lastYear: new Date().getFullYear() - 1,
    month: date.substring(5, 7),
    lastMonth: lastMonth,
    day: date.substring(8, 10),
    court: [],
    allCourt: [],
    notice: 0,
    config: config,
    IE9: navigator.userAgent.indexOf('MSIE 9.0') > -1,
    isIE: !!window.ActiveXObject || 'ActiveXObject' in window
  },
  mutations: {
    setSelects: (state, selects) => {
      state.selects = selects
    },
    setMsec: (state, msec) => {
      state.msec = msec
    },
    court: (state, court) => {
      state.court = court
    },
    classify: (state, court) => {
      state.classify = court
    },
    allCourt: (state, court) => {
      state.allCourt = court
    },
    setHeight: state => {
      state.height = window.innerHeight
      state.width = window.innerWidth
      state.size = state.height * state.width
    },
    setNotice: (state, notice) => {
      state.notice = notice
    }
  },
  actions: {
    GetOptions({ commit }) {
      return new Promise((resolve, reject) => {
        const selects = getLocalStorage('selects')
        if (!selects) {
          getSelectOption().then(res => {
            const datas = res.data
            const menuDatas = data.classify(datas, 'parentId')
            // debugger
            setLocalStorage('selects', menuDatas)
            commit('setSelects', menuDatas)
            resolve()
          }).catch(error => {
            reject(error)
          })
        } else {
          commit('setSelects', selects)
          resolve()
        }
      })
    },
    GetMsec({ commit }) {
      return new Promise((resolve, reject) => {
        const msec = getLocalStorage('msec')
        if (!msec) {
          getServerTime().then(res => {
            const date = res.data
            const timeReg = parseFloat(new Date().getTime()) - parseFloat(new Date(date).getTime())
            setLocalStorage('msec', timeReg)
            commit('setMsec', timeReg)
            resolve()
          }).catch(error => {
            reject(error)
          })
        } else {
          commit('setMsec', msec)
          resolve()
        }
      })
    },
    GetCourts({ commit }) {
      return new Promise((resolve, reject) => {
        let court = getLocalStorage('court')
        if (!court) {
          getCourts().then(res => {
            const datas = res.data
            court = data.changeToTree(datas)
            setLocalStorage('court', court)
            commit('court', court)
            resolve()
          }).catch(error => {
            reject(error)
          })
        } else {
          commit('court', court)
          resolve()
        }
        let allCourt = getLocalStorage('allCourt')
        if (!allCourt) {
          getAllCourts().then(res => {
            const datas = res.data
            allCourt = data.changeToTree(datas)
            commit('allCourt', allCourt)
            setLocalStorage('allCourt', allCourt)
          }).catch(e => {})
        } else {
          commit('allCourt', allCourt)
        }
      })
    },
    WindowResize({ commit }) {
      commit('setHeight')
    }
    // RefreshNotice({ commit }) {
    //   return new Promise((resolve, reject) => {
    //     getNoticeCount().then(res => {
    //       commit('setNotice', res.data)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // }
  }
}

export default globals
