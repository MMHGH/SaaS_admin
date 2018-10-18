export default {
  'format-tree-node': {
    componentUpdated: function(el, binding, vnode, oldVnode){
      function checkGroupElement(el){
        for(let i = 0; i < el.children.length; i++){
          if(el.children[i].getAttribute('role') === 'group' && el.children[i].children.length > 0){
            return true
          }
        }
        return false
      }
      function checkElementSibling(el){
        for(let i = 0, children = el.parentElement.children; i < children.length; i++){
          if(checkGroupElement(children[i])){
            return children[i]
          }
        }
      }
      let elArray = []
      function formatTreeNode(el){
        if(el.getAttribute('role') === 'group' && el.children.length <= 0){
          elArray.push({el: el, parentEl: el.parentElement, prevEl: el.previousElementSibling})
          return
        }
        Array.prototype.slice.call(el.children).forEach(item => {
          if(item.getAttribute('role') === 'group' || item.getAttribute('role') === 'treeitem'){
            formatTreeNode(item)
          }
        })
      }
      formatTreeNode(el)
      elArray.forEach((item, index, array) => {
        if(item.parentEl.nextElementSibling){
          if(checkElementSibling(item.parentEl)){
            delete array[index]
          }
        }
      })
      elArray.forEach(item => {
        item.parentEl.style.display = 'inline-block'
        item.prevEl.style.background = 'transparent'
      })
    }
  }
}
