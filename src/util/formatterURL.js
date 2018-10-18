import url from '../config/url'
// 格式化URL
const formatterURL = {
  formatterHost(host){
    let env = process.env.NODE_ENV
    return url[host] ? url[host][env] : null
  },
  formatterURL(url){
    if(url.indexOf('@') == 0){
      let pathIndex = url.indexOf('/')
      let OriginalHost = url.substr(1,pathIndex - 1)
      let finalHost  = this.formatterHost(OriginalHost) ? this.formatterHost(OriginalHost) : OriginalHost
      let path  = url.substr(pathIndex)
      return finalHost + path
    }
    return url
  }
}
export default formatterURL

