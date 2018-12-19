import axios from 'axios'
import router from '../router'
import formatterURL from '../util/formatterURL'
import loadingInstance from '../util/loadingInstance'
import service from '../config/service'

import { Message } from 'element-ui';
import api from '../config/api'

// 请求队列
let apiLock = {};

// axios 配置
axios.defaults.timeout = service.TIMEOUT
axios.defaults.withCredentials = service.WITH_CREDENTIALS
axios.defaults.baseURL = service.BASE_URL
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
axios.defaults.headers.post['Content-Type'] = service.CONTENT_TYPE

// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    // 设置请求锁
    // console.log(apiLock, config);
    let apiLockIndex = config.url.replace(config.baseURL, '');
    apiLockIndex = config.url.replace('@root', '/api');
    if (apiLock[apiLockIndex] && apiLock[apiLockIndex] == true && config.canBatch !== true) return Promise.reject('end');
    apiLock[apiLockIndex] = true;

    // 请求发送前
    // 启动loading
    if(router.history.current.name === 'Login'){
      // 启动登录页loading
      loadingInstance.loginOpen()
    }
    else
    {
      // 启动常规页面loading
      loadingInstance.open()
    }
    // 格式化URL
    config.url = formatterURL.formatterURL(config.url)
    // 唯一请求 ID （ 生成 GUID ）
    config.headers['X-RequestID'] = (guid => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8)
        return v.toString(16)
      })
    })()
    return config
  },
  error => {
    // 请求错误前
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  response => {

    // 恢复请求锁
    let _config = response.config;
    // console.log(apiLock, _config);
    let apiLockIndex = _config.url.replace(_config.baseURL, '');
    apiLock[apiLockIndex] = false;

    // 响应数据前
    // 关闭loading
    loadingInstance.close()
    let data = response.data
    if(data.code === api.statusCode.notAuthority){
      Message({message: '您没有权限！', type: 'error'})
      router.push({
        name: 'Login',
        query: {redirect: router.currentRoute.fullPath}
      })
      return
    }
    if(data.code === api.statusCode.loginElsewhere){
      Message({message: '您的账号在其他地方登录，请修改密码或重新登录！', type: 'error'})
      router.push({
        name: 'Login',
        query: {redirect: router.currentRoute.fullPath}
      })
      return
    }
    return response
  },
  error => {
    // 恢复请求锁
    if (error === 'end') return;
    let config = error.config || error;
    // console.log(apiLock, config);
    let apiLockIndex = config.url.replace(config.baseURL, '');
    apiLock[apiLockIndex] = false;

    // 响应错误前
    // 关闭loading
    loadingInstance.close()
    return Promise.reject(error)
  }
)

export default axios




