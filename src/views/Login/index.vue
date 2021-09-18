<template>
  <div class="login">
    <!-- NavBar 组件：只需提供 title 标题 -->
    <van-nav-bar title="黑马头条 - 登录" fixed />
  </div>
</template>

<script>
export default {
  // name是当前组件的名称(建议为每个组件都指定唯一的name名称)
  name: 'Login'
}
</script>

<style>
.login {
  padding-top: 46px;
}

.login .van-nav-bar {
  background-color: #007bff;
}

.van-nav-bar .van-nav-bar__title {
  color: white;
  font-size: 16px;
}
</style>
