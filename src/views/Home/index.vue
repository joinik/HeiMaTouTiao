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
    <!-- 频道列表的标签页 -->
    <van-tabs v-model="active" sticky offset-top="1.22666667rem">
      <van-tab title="标签 1">内容 1</van-tab>
      <van-tab title="标签 2">内容 2</van-tab>
      <van-tab title="标签 3">内容 3</van-tab>
      <van-tab title="标签 4">内容 4</van-tab>
      <van-tab title="标签 5">内容 5</van-tab>
      <van-tab title="标签 6">内容 6</van-tab>
      <van-tab title="标签 7">内容 7</van-tab>
      <van-tab title="标签 8">内容 8</van-tab>
    </van-tabs>
    <!-- 频道管理的小图标 -->
    <van-icon name="plus" size="16" class="plus" />
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      // 标签页激活项的索引
      active: 0
    }
  }
}
</script>

<style scoped>
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

/* 为 tabs 容器设置右 padding */
/deep/ .van-tabs__wrap  {
  padding-right: 36px;
  background-color: white;
}

/* .// 频道管理小图标的定位 */
.home .plus {
  position: fixed;
  top: 58px;
  right: 10px;
  z-index: 999;
}
</style>
