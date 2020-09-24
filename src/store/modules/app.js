import Cookies from 'js-cookie'
const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')
    },
    language: Cookies.get('language') || 'zh'
  },
  mutations: {
    toggleSideBar: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    setLanguage: (state, language) => {
      state.language = language
      Cookies.set('language', language)
    }
  },
  actions: {
    ToggleSideBar({ commit }) {
      commit('toggleSideBar')
    },
    SetLanguage({ commit }, language) {
      commit('setLanguage', language)
    }
  }
}

export default app
