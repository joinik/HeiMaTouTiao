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
      <!-- 循环渲染用户的频道 -->
      <van-tab v-for="item in userChannel" :key="item.id" :title="item.name">{{ item.name }}</van-tab>
    </van-tabs>
    <!-- 频道管理的小图标 -->
    <van-icon name="plus" size="16" class="plus" />
  </div>
</template>

<script>
// 按需导入 API 接口
import { getUserChannelAPI } from '@/API/homeAPI'
export default {
  name: 'Home',
  data () {
    return {
      // 标签页激活项的索引
      active: 0,
      // 用户的频道列表数组
      userChannel: []
    }
  },
  methods: {
    async initUserChannel () {
      console.log(111)
      // 1. 调用 API 接口
      const { data: res } = await getUserChannelAPI()
      console.log(res)
      // 2. 判断请求是否成功
      if (res.message === 'OK') {
        // 3. 为用户的频道列表赋值
        this.userChannel = res.data.channels
      }
    }

  },
  created () {
    this.initUserChannel()
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
/deep/ .van-tabs__wrap {
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
