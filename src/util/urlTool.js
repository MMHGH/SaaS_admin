export const urlTool = {
  /**
   * 获取当前的URL参数
   * @param
   * @returns {Object} 参数键值对对象
   */
  getQueryStringArgs: function(){
    let
      searchIndex = location.hash.lastIndexOf('?'),
      qs = searchIndex > -1 ? location.hash.substring(searchIndex + 1) : '',
      args = {},
      items = qs.length ? qs.split('&') : [],
      item = null,
      name = null,
      value = null,
      i = 0,
      len = items.length
    for(i=0; i<len; i++){
      item = items[i].split('=')
      name = decodeURIComponent(item[0])
      value = decodeURIComponent(item[1])
      if(name.length){
        args[name] = value
      }
    }
    return args
  },
  /**
   * 给当前的URL添加/更新新的参数
   * @param obj 参数键值对
   * @returns {string} 新的参数
   */
  setQueryStringArgs: function(obj){
    if(!obj) return
    let objMap = new Map()
    let i, temp
    for(i=0, temp = Object.keys(obj); i<temp.length; i++){
      objMap.set(temp[i], obj[temp[i]])
    }
    let
      searchIndex = location.hash.lastIndexOf('?'),
      qs = searchIndex > -1 ? location.hash.substring(searchIndex + 1) : '',
      args = {},
      items = qs.length ? qs.split('&') : [],
      item = null,
      name = null,
      value = null,
      len = items.length
    for(i=0; i<len; i++){
      item = items[i].split('=')
      name = decodeURIComponent(item[0])
      value = decodeURIComponent(item[1])
      if(name.length){
        if(objMap.get(name)){
          args[name] = objMap.get(name)
          objMap.delete(name)
        }else{
          args[name] = value
        }
      }
    }
    for(let val of objMap){
      args[val[0]] = val[1]
    }
    if(Object.keys(args).length === 0) return
    let nqs = ''
    for(i=0, temp = Object.keys(args); i<temp.length; i++){
      i === 0 ? nqs += '?' : nqs += '&'
      nqs += `${encodeURIComponent(temp[i])}=${encodeURIComponent(args[temp[i]])}`
    }
    location.hash = location.hash.substring(0, searchIndex >= 0 ? searchIndex : undefined).concat(nqs)
    return nqs
  }
}

