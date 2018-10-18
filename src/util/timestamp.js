// 时间戳处理
const timestamp = {
  // 时间戳转换为日期
  getDateByTimestamp(timestamp){
    let date = new Date(timestamp)
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    let d = date.getDate()
    return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)
    // return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + date.toTimeString().substr(0, 8)
  },
  // 时间戳转换为日期 + 时间
  getTimeByTimestamp(timestamp){
    // 时间为空则返回空
    const getType = function(obj){
      if(obj == null){
        return String(obj);
      }
      return typeof obj === 'object' || typeof obj === 'function' ?
        obj.constructor && obj.constructor.name && obj.constructor.name.toLowerCase() ||
        /function\s(.+?)\(/.exec(obj.constructor)[1].toLowerCase():
        typeof obj
    }
    if((getType(timestamp) === 'string' && timestamp.length === 0) || getType(timestamp) === 'undefined' || getType(timestamp) === 'null'){
      return ''
    }
    let date = new Date(timestamp)
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    let d = date.getDate()
    let hh = date.getHours()
    let mm = date.getMinutes()
    let ss = date.getSeconds()
    return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + (hh < 10 ? '0' + hh : hh) + ':' + (mm < 10 ? '0' + mm : mm) + ':' + (ss < 10 ? '0' + ss : ss)
  },
  // 时间戳转换为剩余时间，type 1：未来至今，2：过去至今
  getExpireTimeByTimestamp(timestamp, type){
    let time = new Date(timestamp).getTime()
    let now = new Date().getTime()
    let expireTime = now - time
    switch(type){
      case 1: expireTime = time - now; break;
      case 2: expireTime = now - time; break;
    }
    let d = expireTime / (3600 * 24 * 1000)
    let hh = expireTime % (3600 * 24 * 1000) / (3600 * 1000)
    let mm = expireTime % (3600 * 24 * 1000) % (3600 * 1000) / (60 * 1000)
    return Math.floor(d) + '天' + Math.floor(hh) + '小时' + Math.floor(mm) + '分'
  },
}
export default timestamp

