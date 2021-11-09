<template>
  <div class="search-result-container">
    <!-- 点击实现后退效果 -->
    <van-nav-bar title="搜索结果" left-arrow @click-left="$router.back()" fixed />
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多数据了"
      @load="onLoad"
      :immediate-check="false"
    >
      <article-item
        v-for="item in searchList"
        :key="item.art_id"
        :article="item"
        @remove-article="removeArticle"
        :closable="false"
      ></article-item>
    </van-list>
  </div>
</template>

<script>
// 按需导入 API 方法
import { getSearchResultAPI } from '@/API/searchAPI.js'
import ArticleItem from '../../components/ArticleItem/ArticleItem.vue'

export default {
  name: 'SearchResult',
  components: {
    ArticleItem
  },
  data () {
    return {
      // 页码值
      page: 1,
      // 搜索的结果
      searchList: [],
      // 是否正在进行上拉加载的数据请求
      loading: false,
      // 所有数据是否已经加载完毕
      finished: false
    }
  },
  props: ['kw'],
  watch: {
    kw () {
      // 1. 重置关键数据
      this.page = 1
      this.artList = []
      this.loading = false
      this.finished = false

      // 2. 请求数据
      this.initSearchResult()
    }
  },
  methods: {
    async initSearchList () {
      // console.log(this.kw, this.page)
      // 调用 API 接口
      const { data: res } = await getSearchResultAPI(this.kw, this.page)

      if (res.message === 'OK') {
        // 1. 拼接数据：“旧数据”在前，“新数据”在后
        this.searchList = [...this.searchList, ...res.data.results]
        // 2. 将 loading 设置为 false
        this.loading = false
        // 3. 判断数据是否加载完毕
        if (res.data.results.length === 0) {
          this.finished = true
        }
        // 4. 让页码值 +1
        this.page += 1
      }
    },
    onLoad () {
      console.log('触发了上拉加载更多')
      this.initSearchList()
    },
    // 从文章列表中移除指定 id 的文章
    removeArticle (id) {
      // 1. 炸楼操作
      this.artlist = this.artlist.filter(item => item.art_id.toString() !== id)
      // 2. 判断剩余数据的文章数量是否小于 10
      if (this.artlist.length < 10) {
        // 主动请求下一页数据
        this.initArtList()
      }
    }
  },
  created () {
    this.initSearchList()
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>
