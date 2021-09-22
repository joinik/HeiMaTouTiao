<template>
  <div class="article-list">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <!-- 循环渲染文章的列表 -->
      <article-item v-for="item in artlist" :key="item.art_id" :article="item"></article-item>
    </van-list>
  </div>
</template>

<script>
// 导入ArtcleItem
import ArticleItem from '@/components/ArticleItem'
// 按需导入 API 接口
import { getArtListAPI } from '@/API/homeAPI'

export default {
  // 大驼峰命名法：每个单词的首字母大写
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    // 频道 Id(小驼峰命名法：第一个单词全部小写，后面的单词首字母大写)
    channelId: {
      type: Number, // 数值类型
      required: true
    }
  },
  data () {
    return {
      // 文章列表的数组
      artlist: [],
      // 时间戳。初始的默认值为当前的时间戳
      timestamp: Date.now(),
      // loading 表示是否正在进行上拉加载的请求
      //   每当触发 List 组件的上拉加载更多时，List 组件会自动把 loading 设为 true
      //   每当下一页的数据请求回来以后，需要程序员手动的把 loading 设为 false，
      //   否则：再次触发上拉加载更多时，不会发起请求！！
      loading: false,

      // finished 表示所有数据是否加载完毕
      //    false 表示还有下一页的数据
      //    true  表示所有数据都已加载完毕
      finished: false
    }
  },
  methods: {
    // 初始化文章的列表数据
    async initArtList () {
      // 请求 API 接口
      const { data: res } = await getArtListAPI(this.channelId, this.timestamp)
      if (res.message === 'OK') {
        // 为时间戳重新赋值
        this.timestamp = res.data.pre_timestamp
        // 为 artlist 赋值
        this.artlist = res.data.results
      }
    },
    // 加载更多的数据
    onLoad () {
      console.log('触发了上拉加载更多')
    }
  },
  created () {
    // 在组件创建的时候，请求文章的列表数据
    this.initArtList()
  }
}
</script>

<style lang="less" scoped>
</style>
