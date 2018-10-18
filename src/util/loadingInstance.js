import { Loading } from 'element-ui'

// loading
const loading = Loading.service()
loading.close()
const loadingInstance = {
  $self: loading,
  $el: loading.$el,
  $spinner: loading.$el.querySelector('.el-loading-spinner'),
  open: function(){
    this.$self.$el.style.background = 'rgba(255, 255, 255, 0)'
    // this.$spinner.style.display = 'none'
    this.$spinner.style.boxSizing = 'borderBox'
    this.$spinner.style.paddingLeft = '140px'
  },
  loginOpen: function(){
    this.$self.$el.style.background = 'rgba(255, 255, 255, 0)'
    // this.$spinner.style.display = 'none'
    this.$spinner.style.boxSizing = 'borderBox'
    this.$spinner.style.paddingLeft = '0px'
  },
  close: function(){
    this.$self.close()
  },
}
export default loadingInstance
