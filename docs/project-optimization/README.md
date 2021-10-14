# 14.项目优化

## 14.1 保持组件的状态

> 结合 vue 内置的 keep-alive 组件，可以实现组件的状态保持。
> 官方文档地址：https://cn.vuejs.org/v2/api/#keep-alive

### 14.1.1 实现 Main 组件的状态保持

1. 在 `App.vue` 组件中，在 `<router-view>` 路由占位符之外包裹一层 `<keep-alive>` 组件，从而实现 `Main` 组件的状态保持：

```html
<template>
  <div>
    <!-- 路由占位符 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
```

2. 通过步骤 1，的确实现了 `Main` 组件的状态保持。但是随之而来的：详情页也被缓存了，导致了文章数据不会动态刷新的问题。

3. 可以在 `ArticleDetail.vue` 组件中，定义 `watch` 侦听器来监视 `props` 中 `id` 值的变化，从而动态请求文章的详情数据：

```js
watch: {
  id() {
    // 只要 id 值发生了变化，就清空旧的文章信息
    this.article = null
    // 并重新获取文章的详情数据
    this.initArticleInfo()
  }
},
```

### 14.1.2 实现 Home 组件的状态保持

> 点击 `tabBar` 实现 `Home` 页面和 `User` 页面切换展示的时候，发现 `Home` 组件的状态每次都会被刷新

1. 在 `Main.vue` 组件中，在 `<router-view>` 路由占位符之外包裹一层 `<keep-alive>` 组件，从而实现 `Home` 组件的状态保持：

```html
<template>
  <div>
    <!-- 路由占位符 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>

    <!-- TabBar 区域 -->
    <van-tabbar route>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
```

2. 通过步骤 1，的确实现了 `Home` 组件的状态保持。但是随之而来的，`User.vue` 组件也被缓存了，导致修改用户头像后，头像不刷新的问题。
3. 可以在被缓存的 `User.vue` 组件中，声明 `activated` 和 `deactivated` 声明周期函数，来监听组件被激活和被缓存的状态变化：

```js
created() {
  // 把下面这一行注释掉，因为 activated 在组件首次加载时也会调用一次
  // this.initUserInfo()
},

// 被激活了
activated() {
  // 只要组件被激活了，就重新初始化用户的信息
  this.initUserInfo()
},
```

### 14.1.3 实现 SearchResult 组件的状态保持

1. 在 `SearchResult.vue` 组件中，通过 `watch` 侦听器监视 `props` 中 `kw` 关键词的变化，从而动态请求文章的搜索结果：

```js
watch: {
  kw() {
    // 1. 重置关键数据
    this.page = 1
    this.artList = []
    this.loading = false
    this.finished = false
    
    // 2. 请求数据
    this.initSearchResult()
  }
},
```

### 14.1.4 记录首页文章列表的滚动位置

> 当 Home.vue 组件和 User.vue 进行切换展示时，需要记录 Home.vue 中文章列表的滚动位置

1. 在 `/src/router/index.js` 路由模块中，为 `Home` 组件的路由规则添加 `meta` 元信息：

```js
{
  path: '',
  component: Home,
  name: 'home',
  meta: { isRecord: true, top: 0 }
}
```

2. 在 `Home.vue` 组件中，声明 `beforeRouteLeave` 这个组件内的守卫，用来记录当前组件在纵向上滚动的距离：

```js
// 导航离开该组件的对应路由时调用
// 可以访问组件实例 `this`
beforeRouteLeave(to, from, next) {
  from.meta.top = window.scrollY
  next()
}
```

3. 在 `/src/router/index.js` 路由模块中，声明 `router.afterEach()` 这个全局后置钩子，用来读取路由元数据中的 `top` 值，并赋值给浏览器的滚动条：

```js
// 全局后置钩子
router.afterEach((to, from) => {
  // 如果当前的路由的元信息中，isRecord 的值为 true
  if (to.meta.isRecord) {
    setTimeout(() => {
      // 则把元信息中的 top 值设为滚动条纵向滚动的位置
      window.scrollTo(0, to.meta.top)
    }, 0)
  }
})
```

### 14.1.5 解决 ArtList 组件的 key 冲突问题

1. 导致问题的原因：
  1.1  一进入 `ArtList.vue` 组件中，会立即触发 `created` 生命周期函数，请求文章列表的数据。
  1.2  由于 `data` 中的 `loading` 值的默认值为 `false`，因此一进入页面，会立即触发一次 `<van-list>` 组件的 `load` 事件
  1.3 这样就导致了发起重复请求的问题
2. 解决方案： 把 `ArtList.vue` 组件内的 `loading` 默认值，从 `false` 重置为 `true` 即可。
3. 这样，只通过 `created` 发起了首页的数据请求，并没有再次使用 `<van-list>` 额外请求数据。

### 14.1.6 记录文章详情页滚动的位置

1. 在路由模块中，为文章详情页的路由规则添加路由元信息：

```js
// 文章详情的路由规则
{ 
  path: '/article/:id', 
  component: ArticleDetail, 
  name: 'art-detail', 
  props: true, 
  meta: { isRecord: true, top: 0 } 
}
```

2. 在 `ArticleDetail.vue` 组件中，声明 `beforeRouteLeave` 这个组件内的守卫，用来记录当前组件在纵向上滚动的距离：

```js
beforeRouteLeave(to, from, next) {
  from.meta.top = window.scrollY
  setTimeout(() => {
    next()
  }, 0)
}
```

### 14.1.7 记录 SearchResult 组件的滚动位置

1. 在路由模块中，为搜索结果页的路由规则添加路由元信息：

```js
// 搜索结果页的路由规则
{
  path: '/search/:kw',
  component: SearchResult,
  name: 'search-result',
  props: true,
  meta: { isRecord: true, top: 0 }
}
```

2. 在 `SearchResult.vue` 组件中，声明 `beforeRouteLeave` 这个组件内的守卫，用来记录当前组件在纵向上滚动的距离：

```js
beforeRouteLeave(to, from, next) {
  from.meta.top = window.scrollY
  setTimeout(() => {
    next()
  }, 0)
}
```

### 14.1.8 记录每个 tabs 的滚动位置

> 当 Home.vue 组件中的频道选中项发生变化的时候，需要记录每个频道下列表的滚动位置。

1. 在 `/src/views/Home/Home.vue` 组件中，为 `<van-tabs>` 绑定 `before-change` 属性：

```html
<!-- 频道列表的标签页 -->
<van-tabs v-model="active" sticky offset-top="1.22666667rem" :before-change="beforeTabsChange">
  <!-- 循环渲染用户的频道 -->
  <van-tab v-for="item in userChannel" :key="item.id" :title="item.name">
    <art-list :channel-id="item.id"></art-list>
  </van-tab>
</van-tabs>
```

2. 在 `Home.vue` 组件中定义名为 `nameToTop` 的对象，用来存储频道名称和滚动条位置之间的对应关系：

```js
// “频道名称”和“滚动条位置”之间的对应关系，格式 { '推荐': 211, 'html': 30, '开发者资讯': 890 }
const nameToTop = {}
```

3. 在 `Home.vue` 组件的 `methods` 中定义 `beforeTabsChange` 方法：

```js
// tabs 发生切换之前，触发此方法
beforeTabsChange() {
  // 把当前"频道名称"对应的"滚动条位置"记录到 nameToTop 对象中
  const name = this.channels[this.active].name
  nameToTop[name] = window.scrollY

  // return true 表示允许进行标签页的切换
  return true
},
```

4. 在 `/src/views/Home/Home.vue` 组件中，为 `<van-tabs>` 绑定 `change` 属性：

```html
<!-- 频道列表的标签页 -->
<van-tabs v-model="active" sticky offset-top="1.22666667rem" :before-change="beforeTabsChange" @change="onTabsChange">
  <!-- 循环渲染用户的频道 -->
  <van-tab v-for="item in userChannel" :key="item.id" :title="item.name">
    <art-list :channel-id="item.id"></art-list>
  </van-tab>
</van-tabs>
```

5. 在 `Home.vue` 组件的 `methods` 中定义 `onTabsChange` 方法：

```js
// 当 tabs 切换完毕之后，触发此方法
onTabsChange() {
  // 等 DOM 更新完毕之后，根据记录的"滚动条位置"，调用 window.scrollTo() 方法进行滚动
  this.$nextTick(() => {
    const name = this.channels[this.active].name
    window.scrollTo(0, nameToTop[name] || 0)
  })
}
```

## 14.2 详情页代码高亮

> 基于 highlight.js 美化详情页的代码片段

1. 运行如下的命令，在项目中安装 `highlight.js`：

```bash
npm i highlight.js@10.6.0 -S
```

2. 在 `index.html` 页面的 `<head>` 标签中引入 `highlight.js` 的样式表：

```html
<link rel="stylesheet" href="https://cdn.staticfile.org/highlight.js/10.6.0/styles/default.min.css" />
```

3. 在 `ArticleDetail.vue` 组件中导入 `highlight.js` 模块：

```js
// 导入 highlight.js 模块
import hljs from 'highlight.js'
```

4. 在 `ArticleDetail.vue` 组件的 `updated` 声明周期函数中，对位置内容进行高亮处理：

```js
// 1. 当组件的 DOM 更新完毕之后
updated() {
  // 2. 判断是否有文章的内容
  if (this.article) {
    // 3. 对文章的内容进行高亮处理
    hljs.highlightAll()
  }
}
```

## 14.3 分支的合并与提交

1. 将修改过后的文件加入暂存区，并进行本地的 `commit` 提交：

```bash
git add .
git commit -m "完成了项目优化"
```

2. 将本地的 `optimize` 分支首次推送到 `Gitee` 仓库中：

```bash
git push -u origin optimize
```

3. 将本地的 `optimize` 分支合并到本地的 `master` 主分支，并推送 `master` 分支到 `Gitee` 仓库：

```bash
git checkout master
git merge optimize
git push
```

4. 删除本地的 `optimize` 子分支：

```bash
git branch -d optimize
```

5. 基于 `master` 主分支，新建 `publish` 分支，准备实现项目的打包发布：

```bash
git checkout -b publish
```
