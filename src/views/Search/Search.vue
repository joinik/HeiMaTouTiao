<template>
  <div>
    <!-- Header 头部区域 -->
    <div class="search-header">
      <!-- 后退图标 -->
      <van-icon name="arrow-left" color="white" size="18" class="goback" @click="$router.back()" />
      <!-- 搜索组件 -->
      <van-search
        v-model.trim="kw"
        placeholder="请输入搜索关键词"
        background="#007BFF"
        @input="onInput"
        shape="round"
      />
    </div>
    <!-- 搜索建议 -->
    <div class="sugg-list">
      <div class="sugg-item" v-for="(item, i) in suggestList" :key="i">{{ item }}</div>
    </div>
  </div>
</template>

<script>
// 按需导入 API 接口
import { getSuggestListAPI } from '@/API/searchAPI.js'

export default {
  name: 'Search',
  data () {
    return {
      // 搜索关键词
      kw: '',
      // 延时器的 Id
      timerId: null,
      // 搜索建议列表
      suggestList: []
    }
  },
  methods: {
    onInput () {
      // 2. 清除上次的延时器
      clearTimeout(this.timerId)

      // 3. 如果输入的内容为空，则 return 出去，不开启延时器
      if (this.kw.length === 0) {
        // 清空搜索建议的列表数据
        this.suggestList = []

        return
      }

      // 1. 开启延时器，将延时器的 id 存储到 this.timerId 中
      this.timerId = setTimeout(() => {
        // 请求建议列表的数据
        this.initSuggestList()
      }, 500)
    },
    // 请求搜索建议列表数据的方法
    async initSuggestList () {
      // 调用 API 接口
      const { data: res } = await getSuggestListAPI(this.kw)
      if (res.message === 'OK') {
        // 为 suggestList 数据赋值
        this.suggestList = res.data.options
      }
    }
  },
  mounted () {
    const ipt = document.querySelector('input[type=search]')
    ipt && ipt.focus()
  }
}
</script>

<style lang="less" scoped>
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  // 后退按钮
  .goback {
    padding-left: 14px;
  }
  // 搜索组件
  .van-search {
    flex: 1;
  }
}

.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
