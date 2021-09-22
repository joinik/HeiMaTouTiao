<template>
  <div class="article-item">
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{ article.title }}</span>
          <!-- 单张图片 -->
          <img alt class="thumb" v-if="article.cover.type === 1" v-lazy="article.cover.images[0]" />
        </div>
        <!-- 三张图片 -->
        <div class="thumb-box" v-if="article.cover.type === 3">
          <img
            alt
            class="thumb"
            v-for="(item, index) in article.cover.images"
            :key="index"
            v-lazy="item"
          />
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <span>{{ article.aut_name }} &nbsp;&nbsp; {{ article.comm_count }}评论 &nbsp;&nbsp; {{ article.pubdate | dateFormat }}</span>
          <!-- 关闭按钮 -->
          <van-icon name="cross" @click.stop="show = true" />
        </div>
      </template>
    </van-cell>

    <!-- 反馈的动作面板 -->
    <van-action-sheet v-model="show" cancel-text="取消" :closeable="false">
      <div class="content">
       <van-cell :title="item.name" clickable class="center-title" v-for="item in actions" :key="item.name" />
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
export default {
  name: 'ArticleItem',
  props: {
    // 文章的信息对象
    article: {
      type: Object, // 数据类型
      required: true // 必填项
    }
  },
  data () {
    return {
      // 是否展示反馈面板
      show: false,
      // 第一个面板的可选项列表
      actions: [
        { name: '不感兴趣' },
        { name: '反馈垃圾内容' },
        { name: '拉黑作者' }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.thumb {
  // 矩形黄金比例：0.618
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.thumb-box {
  display: flex;
  justify-content: space-between;
}

.center-title {
  text-align: center;
}
</style>
