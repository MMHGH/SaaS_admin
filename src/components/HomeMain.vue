<template>
  <main class="home-main" id="home-main">
    <transition name="fade" mode="out-in">
      <slot name="router-view"></slot>
    </transition>
  </main>
</template>

<script>
export default {
  name: 'home-main',
}
</script>

<style>
  /* 右侧主内容区 */
  .home-main{position: absolute;top: 0;left: 0;margin-left: 140px;background-color: #fff;overflow: auto;min-width: 1200px;width: calc(100% - 140px);height: 100%;box-sizing: border-box;}

  /* 面包屑 */
  .home-main>div>.header,
  .home-main>div>.main{background-color: #fff;margin: 5px;padding: 10px;}
  .home-main>div>.header .el-breadcrumb{line-height: 24px;font-size: 18px;font-weight: 400;vertical-align: middle;}
  .home-main>div>.header .el-breadcrumb__item:last-child .el-breadcrumb__inner{font-size: 16px;color: #409eff;}

  /* 路由切换动效 */
  .home-main .fade-enter-active, .fade-leave-active {transition: all .25s;}
  .home-main .fade-enter, .fade-leave-active {opacity: 0;}

  /* 补丁 element-ui el-form */
  .home-main .el-form-item.is-success .el-input__inner, .el-form-item.is-success .el-input__inner:focus,
  .home-main .el-form-item.is-success .el-textarea__inner, .el-form-item.is-success .el-textarea__inner:focus{border-color: rgb(220, 223, 230);}

  /* 补丁 element-ui el-tree */
  .home-main .el-tree-node{white-space: normal;}
  .home-main .el-tree-node__content{height: auto;}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>


