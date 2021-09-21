<template>
  <div class="home">
    <!-- 头部区域 -->
    <van-nav-bar fixed>
      <!-- 左侧的插槽 -->
      <template #left>
        <img src="../../assets/toutiao_logo.png" alt="logo" class="logo" />
      </template>
      <!-- 右侧的插槽 -->
      <template #right>
        <van-icon name="search" color="white" size="18" />
      </template>
    </van-nav-bar>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style>
/*  */
.home {
  padding-top: 46px;
  padding-bottom: 50px;
}

.home .van-nav-bar {
  background-color: #007bff;
}

/* log样式 */
.home .logo {
  height: 80%;
}
</style>
