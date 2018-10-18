import Vue from 'vue'
import { MessageBox } from 'element-ui'
import { Notification } from 'element-ui'
import { Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import api from '../config/api'
import router from '@/router'
import loadingInstance from '../util/loadingInstance'


const service = {
  post(parameter, configParameter){
    // 参数
    let confirmText = parameter.confirmText || null,
      url = (parameter && parameter.url) || null,
      params = (parameter && parameter.params) || null,
      successHook = (parameter && parameter.successHook) || null,
      successMessage = (parameter && parameter.successMessage) || null,
      successCloseHook = (parameter && parameter.successCloseHook) || null,
      errorHook = (parameter && parameter.errorHook) || null,
      errorMessage = (parameter && parameter.errorMessage) || null,
      errorCloseHook = (parameter && parameter.errorCloseHook) || null,
      config = {
        confirm: configParameter ? configParameter.confirm : false,
        successNotification: configParameter ? configParameter.successNotification : false,
        errorNotification: configParameter ? (configParameter.errorNotification === false ? configParameter.errorNotification : true) : true
      }
    // 初始 post 函数
    function resourcePost(){
      axios.post(url, params)
        .then((response) => {
          // 请求成功
          let data = response.data
          if(data.code === api.statusCode.sessionInvalid){
            // // 没有权限或者 session 失效
            // Message({message: '登录超时，请重新登录！', type: 'error'})
            // router.push({
            //   name: 'Login',
            //   query: {redirect: router.currentRoute.fullPath}
            // })
          }
          else if(data.code === api.statusCode.success){
            // 钩子函数
            successHook && successHook(data.data, response)
            // 成功提示
            if(config.successNotification){
              if(!config.confirm){
                loadingInstance.open() // 启动loading
              }
              Message({message: successMessage || data.message,})
              successCloseHook && successCloseHook(data.data, response)
            }
          }
          else{
            // 钩子函数
            errorHook && errorHook(data.data, response)
            // 失败提示
            if(config.errorNotification){
              if(!config.confirm){
                loadingInstance.open() // 启动loading
              }
              Message({message: errorMessage || data.message, type: 'error'})
              errorCloseHook && errorCloseHook(data.data, response)
            }
          }
        })
        .catch((error) => {
          // 请求失败
        })
    }
    // confirm 配置
    if(config.confirm){
      MessageBox.confirm(confirmText, '提示', {confirmButtonText: '确定', cancelButtonText: '取消'})
        .then(() => {
          loadingInstance.open() // 启动loading
          resourcePost()
        })
        .catch(() => {})
    }
    else{ resourcePost() }
  },
  postWithConfirm(parameter){
    this.post(parameter, {
      confirm: true,
      successNotification: true,
    })
  }
}

export default service




