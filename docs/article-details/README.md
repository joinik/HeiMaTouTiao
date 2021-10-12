# 8. 文章详情

## 8.1 通过路由渲染文章详情组件

1. 在 `/src/views/` 目录下新建 `ArticleDetail` 文件夹，并在其下新建 `ArticleDetail.vue` 组件：

```html
<template>
  <div>文章详情组件</div>
</template>

<script>
export default {
  name: 'ArticleDetail'
}
</script>

<style lang="less" scoped></style>
```

2. 在 `/src/router/index.js` 模块中导入 `ArticleDetail.vue` 组件：

```js
// 导入文章详情组件
import ArticleDetail from '@/views/ArticleDetail/ArticleDetail.vue'
```

3. 在路由模块的 `routes` 数组中，声明如下的路由规则：

```js
const routes = [
  // 省略其它的路由规则...

  // 文章详情的路由规则
  { path: '/article/:id', component: ArticleDetail, name: 'art-detail' }
]
```

4. 在 `/src/components/ArtItem/ArtItem.vue` 组件中，为根节点的 `div` 元素绑定 `@click` 事件处理函数，通过编程式导航跳转到文章详情页：

```html
<template>
  <div @click="$router.push('/article/' + artId)">
    <van-cell>
      <!-- 省略其它的 DOM 结构 -->
    </van-cell>
  </div>
</template>
```

## 8.2 渲染文章详情页的基础布局

1. 在 `ArticleDetail.vue` 组件中，声明如下的 `DOM` 布局结构：

```html
<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />

    <!-- 文章信息区域 -->
    <div class="article-container">
      <!-- 文章标题 -->
      <h1 class="art-title">小程序</h1>

      <!-- 用户信息 -->
      <van-cell center title="张三" label="3天前">
        <template #icon>
          <!-- 头像 -->
          <img src="" alt="" class="avatar">
        </template>
        <template #default>
          <div>
            <!-- 是否关注了作者 -->
            <van-button type="info" size="mini">已关注</van-button>
            <van-button icon="plus" type="info" size="mini" plain>关注</van-button>
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content">好好学习, 天天向上</div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box">
        <van-button icon="good-job" type="danger" size="small">已点赞</van-button>
        <van-button icon="good-job-o" type="danger" plain size="small">点赞</van-button>
      </div>
    </div>
  </div>
</template>
```

2. 在 `ArticleDetail.vue` 组件的 `<style>` 节点下，声明如下的样式

```css
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}
```

## 8.3 路由规则开启 props 传参

1. 在 `/src/router/index.js` 路由模块中，为文章详情的路由规则添加 `props: true` 选项：

```js
const routes = [
  // 省略其它的路由规则...

  // 文章详情的路由规则
  { path: '/article/:id', component: ArticleDetail, name: 'art-detail', props: true }
]
```

2. 在 `ArticleDetail.vue` 组件中，通过 `props` 节点接收路由的参数：

```js
export default {
  name: 'ArticleDetail',
  // props 中的 id 是文章的 id（已经调用了大数的 .toString() 方法）
  props: ['id']
}
```

## 8.4 请求文章的详情数据

1. 在 `/src/api/` 目录下新建 `articleAPI.js` 模块：

```js
import request from '@/utils/request.js'

// 获取文章详情的 API（形参中的 id 是文章的 id）
export const getArticleDetailAPI = id => {
  return request.get(`/v1_0/articles/${id}`)
}
```

2. 在 `ArticleDetail.vue` 组件中，按需导入 `API` 接口：

```js
// 按需导入 API 接口
import { getArticleDetailAPI } from '@/api/articleAPI.js'
```

3. 在 `ArticleDetail.vue` 组件的 `data` 节点下，定义名为 `article` 的数据节点，用来存储文章的信息：

```js
data() {
  return {
    // 文章的信息对象
    article: null
  }
},
```

4. 在 `ArticleDetail.vue` 组件的 `methods` 中定义名为 `initArticle` 的方法：

```js
methods: {
  // 初始化文章的数据
  async initArticle() {
    // 1. 调用 API 接口
    const { data: res } = await getArticleDetailAPI(this.id)
    if (res.message === 'OK') {
      // 2. 转存数据
      this.article = res.data
    }
  }
}
```

5. 在 `ArticleDetail.vue` 组件的 `created` 中调用 `initArticle` 方法：

```js
created() {
  this.initArticle()
},
```

## 8.5 渲染文章的详情数据

1. 在 `ArticleDetail.vue` 组件的模板结构中，渲染文章的详情数据：

```html
<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />

    <!-- 文章信息区域 -->
    <div class="article-container">
      <!-- 文章标题 -->
      <h1 class="art-title">{{article.title}}</h1>

      <!-- 用户信息 -->
      <van-cell center :title="article.aut_name" :label="article.pubdate | dateFormat">
        <template #icon>
          <!-- 头像 -->
          <img :src="article.aut_photo" alt="" class="avatar">
        </template>
        <template #default>
          <div>
            <!-- 是否关注了作者 -->
            <van-button type="info" size="mini" v-if="article.is_followed">已关注</van-button>
            <van-button icon="plus" type="info" size="mini" plain v-else>关注</van-button>
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="article.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box">
        <van-button icon="good-job" type="danger" size="small" v-if="article.attitude === 1">已点赞</van-button>
        <van-button icon="good-job-o" type="danger" plain size="small" v-else>点赞</van-button>
      </div>
    </div>
  </div>
</template>
```

2. 在 `ArticleDetail.vue` 组件刚加载时，如果网速较慢，则 `data` 中的 `article` 等于 `null`。为了防止 `DOM` 闪烁的问题，可以为文章信息区域的 `div` 应用 `v-if` 指令：

```html
<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />

    <!-- 文章信息区域 -->
    <div class="article-container" v-if="article">
      <!-- 省略其它的 DOM 结构 -->
    </div>
  </div>
</template>
```

## 8.6 实现关注和取消关注的功能

### 8.6.1 实现关注功能

1. 在 `/src/api/articleAPI.js` 模块中，定义名为 `followUserAPI` 的接口：

```js
// 关注用户的 API（形参中的 userId 是文字作者的 id）
export const followUserAPI = userId => {
  return request.post('/v1_0/user/followings', {
    target: userId
  })
}
```

2. 在 `ArticleDetail.vue` 组件中按需导入 `followUserAPI` 方法：

```js
// 按需导入 API 接口
import { getArticleDetailAPI, followUserAPI } from '@/api/articleAPI.js'
```

3. 在 `ArticleDetail.vue` 组件的 `methods` 节点下声明 `setFollow` 的方法:

```js
methods: {
  // 关注作者
  async setFollow() {
    // 调用关注作者的 API 接口
    const { data: res } = await followUserAPI(this.article.aut_id.toString())
    if (res.message === 'OK') {
      // 提示用户成功
      this.$toast.success('关注成功！')
      // 手动更改关注的状态
      this.article.is_followed = true
    }
  }
}
```

4. 为关注的按钮绑定点击事件处理函数：

```html
<van-button icon="plus" type="info" size="mini" plain v-else @click="setFollow">关注</van-button>
```

### 8.6.2 实现取消关注功能

1. 在 `/src/api/articleAPI.js` 模块中，定义名为 `unfollowUserAPI` 的接口：

```js
// 取消关注用户的 API
export const unfollowUserAPI = userId => {
  return request.delete(`/v1_0/user/followings/${userId}`)
}
```

2. 在 `ArticleDetail.vue` 组件中按需导入 `unfollowUserAPI` 方法：

```js
// 按需导入 API 接口
import { getArticleDetailAPI, followUserAPI, unfollowUserAPI } from '@/api/articleAPI.js'
```

3. 在 `ArticleDetail.vue` 组件的 `methods` 节点下声明 `setUnfollow` 的方法:

```js
methods: {
  // 取关作者
  async setUnfollow() {
    // 1. 调用 API 接口
    const res = await unfollowUserAPI(this.article.aut_id.toString())

    // 2. 判断响应的状态码
    if (res.status === 204) {
      // 2.1 提示用户
      this.$toast.success('取关成功！')
      // 2.2 手动更改关注的状态
      this.article.is_followed = false
    }
  }
}
```

4. 为**已关注**的按钮绑定点击事件处理函数：

```html
<van-button type="info" size="mini" v-if="article.is_followed" @click="setUnfollow">已关注</van-button>
```

## 8.7 实现点赞和取消点赞的功能

### 8.7.1 实现点赞功能

1. 在 `/src/api/articleAPI.js` 模块中，定义名为 `addLikeAPI` 的接口：

```js
// 点赞的 API（形参中的 artId 是文章的 Id）
export const addLikeAPI = artId => {
  return request.post('/v1_0/article/likings', {
    target: artId
  })
}
```

2. 在 `ArticleDetail.vue` 组件中按需导入 `addLikeAPI` 方法：

```js
// 按需导入 API 接口
import { getArticleDetailAPI, followUserAPI, unfollowUserAPI, addLikeAPI } from '@/api/articleAPI.js'
```

3. 在 `ArticleDetail.vue` 组件的 `methods` 节点下声明 `setLike` 的方法:

```js
methods: {
  // 文章点赞
  async setLike() {
    // 调用 API 接口
    const { data: res } = await addLikeAPI(this.id)
    if (res.message === 'OK') {
      // 提示用户
      this.$toast.success('点赞成功！')
      // 手动变更点赞的状态
      this.article.attitude = 1
    }
  }
}
```

4. 为点赞的按钮绑定点击事件处理函数：

```html
<van-button icon="good-job-o" type="danger" plain size="small" v-else @click="setLike">点赞</van-button>
```

### 8.7.2 实现取消点赞功能

1. 在 `/src/api/articleAPI.js` 模块中，定义名为 `delLikeAPI` 的接口：

```js
// 取消点赞的 API（形参中的 artId 是文章的 Id）
export const delLikeAPI = artId => {
  return request.delete(`/v1_0/article/likings/${artId}`)
}
```

2. 在 `ArticleDetail.vue` 组件中按需导入 `delLikeAPI` 方法：

```js
// 按需导入 API 接口
import { getArticleDetailAPI, followUserAPI, unfollowUserAPI, addLikeAPI, delLikeAPI } from '@/api/articleAPI.js'
```

3. 在 `ArticleDetail.vue` 组件的 `methods` 节点下声明 `setDislike` 的方法:

```js
methods: {
  // 取消点赞
  async setDislike() {
    // 调用 API 接口
    const res = await delLikeAPI(this.id)
    if (res.status === 204) {
      // 提示用户
      this.$toast.success('取消点赞成功！')
      // 手动变更点赞的状态
      this.article.attitude = -1
    }
  }
}
```

4. 为已点赞的按钮绑定点击事件处理函数：

```html
<van-button icon="good-job" type="danger" size="small" v-if="article.attitude === 1" @click="setDislike">已点赞</van-button>
```

## 8.8 分支的合并与提交

1. 将修改过后的文件加入暂存区，并进行本地的 `commit` 提交：

```bash
git add .
git commit -m "完成了文章详情的功能"
```

2. 将本地的 `art-detail` 分支首次推送到 `Gitee` 仓库中：

```bash
git push -u origin art-detail
```

3. 将本地的 `art-detail` 分支合并到本地的 `master` 主分支，并推送 `master` 分支到 `Gitee` 仓库：

```bash
git checkout master
git merge art-detail
git push
```

4. 删除本地的 `art-detail` 子分支：

```bash
git branch -d art-detail
```

5. 基于 `master` 主分支，新建 `art-cmt` 分支，准备开发文章评论相关的功能：

```bash
git checkout -b art-cmt
```
