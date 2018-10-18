<template>
  <div class="wrapper">
    <!-- 左侧导航 -->
    <home-aside></home-aside>
    <!-- 右侧主内容区 -->
    <home-main>
      <router-view slot="router-view"></router-view>
    </home-main>
  </div>
</template>
<script>
import homeAside  from "@/components/HomeAside"
import homeMain  from "@/components/HomeMain"

export default {
  components: {
    homeAside,
    homeMain
  }
}
</script>
<style scoped></style>
