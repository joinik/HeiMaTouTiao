<template>
  <div class="search-result-container">
    <!-- 点击实现后退效果 -->
    <van-nav-bar title="搜索结果" left-arrow @click-left="$router.back()" fixed />
  </div>
</template>

<script>
export default {
  name: 'SearchResult'
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>