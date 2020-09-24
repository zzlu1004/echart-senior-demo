import request from '@/utils/request'
import Vue from 'vue'
import echart from '@/utils/echarts'
import Cookies from 'js-cookie'
import tools from '@/utils/tools'
import data from '@/utils/data'
export function req(defaultOpt, urlType = 'project_url') {
  var type = defaultOpt.method || defaultOpt.type
  if (type.toLowerCase() === 'get') { // 大小写get都可以
    defaultOpt = data.changeObjKey(defaultOpt, { data: 'params', type: 'method' })
  } else {
    defaultOpt = data.changeObjKey(defaultOpt, { params: 'data', type: 'method' })
  }
  defaultOpt.url = encodeURI(window.config[urlType] + defaultOpt.url)
  return request(defaultOpt)
}

const session = {
  set(Obj) {
    Cookies.set('sessionName', Obj)
  },
  get() {
    return Cookies.getJSON('sessionName')
  }
}
Vue.prototype.fd = {
  req,
  data,
  echart,
  tools,
  session
}
