// 表单验证
const validator = {
  // 仅限输入数字
  onlyNum(callback, value, description){
    let pattern = /[^0-9]/g
    if(pattern.test(value)){
      return(callback((description && new Error(description)) || new Error('请输入数字')))
    }
  },
  // 仅限输入中文、英文、数字
  onlyCnEnNum(value, description){
    let pattern = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g
    if(pattern.test(value)){
      return((description && new Error(description)) || new Error('请输入英文、中文、数字'))
    }
  },
  // 大于限制的字符字数
  greaterThanStringLength(value, length, description){
    if(value.length > length){
      return((description && new Error(description)) || new Error('输入字符长度不低于' + length + '个'))
    }
  },
  // 小于或等于限制的字符字数
  lessThanOrEqualToStringLength(value, length, description){
    if(value.length <= length){
      return((description && new Error(description)) || new Error('输入字符长度不超过' + length + '个'))
    }
  },
  // 不能为空
  notEmpty(callback, value, description){
    const getType = function(obj){
      if(obj == null){
        return String(obj);
      }
      return typeof obj === 'object' || typeof obj === 'function' ?
        obj.constructor && obj.constructor.name && obj.constructor.name.toLowerCase() ||
        /function\s(.+?)\(/.exec(obj.constructor)[1].toLowerCase():
        typeof obj
    }
    if((getType(value) === 'string' && value.length === 0) || getType(value) === 'undefined' || getType(value) === 'null'){
      return(callback((description && new Error(description)) || new Error('输入不能为空')))
    }
  },
  // 仅限输入非负浮点数
  onlyFloat(callback, value, description){
    let pattern = /^\d+(\.\d+)?$/g
    if(!pattern.test(value)){
      return(callback((description && new Error(description)) || new Error('请输入有效数值')))
    }
  },
  // 限制数字值的区间边界（可以等于边界值）
  limitNum(callback, value, startNum, endNum, description){
    if(value < startNum || value > endNum){
      return(callback((description && new Error(description)) || new Error('请输入有效数值')))
    }
  },
  // 手机号码
  telephone(rule, value, callback){
    let pattern = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[35678]|18[0-9]|19[89])\d{8}$/
    if(!value){
      callback(new Error('请输入手机号码'))
    }
    if(!pattern.test(value)){
      callback(new Error('请输入正确的手机号'))
    }
    callback()
  },
  // 密码
  password(rule, value, callback){
    // 密码为6-20位字母数字组合
    // let pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
    if(!value){
      callback(new Error('请输入登录密码'))
    }
    if(value.length <8 || value.length > 25){
      callback(new Error('密码为8-25位'))
    }
    callback()
  },
  // 登录验证码
  verificationCode(rule, value, callback){
    if(!value){
      callback(new Error('请输入验证码'))
    }
    if(value.length !== 4){
      callback(new Error('请输入4位验证码'))
    }
    callback()
  }
}

export default validator

