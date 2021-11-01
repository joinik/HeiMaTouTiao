<template>
  <div>
    <!-- 评论列表 -->
    <div class="cmt-list">
      <van-list
        class="cmt-list"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多评论了"
        :immediate-check="false"
        @load="onLoad"
      >
        <!-- 评论的 Item 项 -->
        <div class="cmt-item" v-for="item in cmtlist" :key="item.com_id.toString()">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="item.aut_photo" alt class="avatar" />
              <span class="uname">{{ item.aut_name }}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon name="like" size="16" color="red" v-if="item.is_liking" />
              <van-icon name="like-o" size="16" color="gray" v-else />
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">{{ item.content }}</div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{ item.pubdate | dateFormat }}</div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>

// 按需导入 API
import { getCmtListAPI } from '@/API/articleAPI.js'
export default {
  name: 'ArtCmt',
  props: {
    // 文章的 Id（小驼峰命名法）
    artId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      // 文章的评论列表数据
      cmtlist: [],
      // 偏移量
      offset: null,
      // 是否正在请求上拉加载的数据
      loading: false,
      // 所有数据是否加载完毕了
      finished: false
    }
  },
  methods: {
    // 初始化评论列表的数据
    async initCmtList () {
      // 调用 API 接口
      const { data: res } = await getCmtListAPI(this.artId, this.offset)
      if (res.message === 'OK') {
        // 为偏移量赋值
        this.offset = res.data.last_id

        // 1. 数据拼接：“旧数据”在前，“新数据”在后
        this.cmtlist = [...this.cmtlist, ...res.data.results]
        // 2. 将 loading 重置为 false
        this.loading = false

        // 3. 判断所有数据是否加载完毕
        if (res.data.results.length === 0) {
          this.finished = true
        }
      }
    },
    // 上拉加载
    onLoad () {
      this.initCmtList()
    }
  },
  created () {
    this.initCmtList()
  }
}
</script>

<style lang="less" scoped>
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}
</style>
