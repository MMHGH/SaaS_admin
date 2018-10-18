// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from './server/http'
import service from './server/service'
import VueAxios from 'vue-axios'
// import './server/mock'
import api from './config/api'
import validator from './util/validator'
import timestamp from './util/timestamp'
import { urlTool } from './util/urlTool'
import store from './store'

Vue.use(ElementUI)
Vue.use(VueAxios, axios)

Vue.prototype.$api = api
Vue.prototype.$validator = validator
Vue.prototype.$timestamp = timestamp
Vue.prototype.$service = service
Vue.prototype.$urlTool = urlTool

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  axios,
  store,
  components: { App },
  template: '<App/>'
})


