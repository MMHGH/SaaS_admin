<template>
  <div id="app" :style=" { height: screenHeight + 'px' } ">
    <router-view></router-view>
  </div>
</template>

<script>
let WIN = (function(){return this || (0, eval)('this')})(),
  DOC = WIN.document
const HEIGHT = WIN.innerHeight > 0 ? WIN.innerHeight : DOC.documentElement.clientHeight
export default {
  name: 'App',
  data () {
    return {
      screenHeight: HEIGHT
    }
  }
}
</script>

<style>
#app {
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
}
body, textarea, input, button, select, keygen, legend{font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;color: #606266;}
</style>
