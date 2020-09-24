import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/element-ui.scss'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import App from './App'
import router from 'router'
import store from './store'
import * as filters from '@/utils/filters' // 全局filter
import '@/icons' // icon
import '@/permission' // 权限
// import './mock' // 该项目所有请求使用mockjs模拟
import './utils/common.js'
import './styles/commen.scss'// 引入常用的css
import './styles/iconfont/iconfont.css'// 引入常用的at字体图标
import './styles/fd-iconfont/iconfont.css'// 引入fd-icon字体图标
import './styles/fonts/font.css'// 引入常用的css
import FdSearch from '@/components/input/fdSearch'
import 'ie9-oninput-polyfill'
// require styles

window.Promise = Promise
Vue.use(ElementUI, { locale })
Vue.component(FdSearch.name, FdSearch)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

document.head.getElementsByTagName('title')[0].innerText = store.getters.config.title
