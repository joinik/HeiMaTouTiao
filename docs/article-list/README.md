# 4.文章列表

## 4.1 封装文章列表组件

1. 在`/src/components`目录下，新建ArtList文件夹，并在其下新建`ArticleList.vue`组件：

```vue
<template>
  <div>文章列表组件</div>
</template>

<script>
export default {
  // 大驼峰命名法：每个单词的首字母大写
  name: 'ArticleList'
}
</script>

<style lang="less" scoped></style>
```

2. 在`/src/views/Home/index.vue`组件中导入、注册、并使用`ArtList.vue`组件：

导入:

```js
import ArtList from '@/components/ArtList/ArtList.vue'
```

注册 `ArtList.vue` 组件：

```js
components: {
  ArtList
}
```

使用 `ArtList.vue` 组件：

```vue
<!-- 频道列表的标签页 -->
<van-tabs v-model="active" sticky offset-top="1.22666667rem">
  <!-- 循环渲染用户的频道 -->
  <van-tab v-for="item in userChannel" :key="item.id" :title="item.name">
    <!-- 在每一个用户频道下，渲染出对应的“文章列表组件” -->
    <art-list></art-list>
  </van-tab>
</van-tabs>
```

## 4.2 封装channelled属性

1. 在`ArtList.vue`组件的`props`节点下，封装`channelId`属性：

```js
export default {
  name: 'ArtList',
  props: {
    // 频道 Id（小驼峰命名法：第一个单词全部小写，后面的单词首字母大写）
    channelId: {
      type: Number, // 数值类型
      required: true // 必填项
    }
  }
}
```

2. 在`Home.vue`组件中使用`ArtList.vue`组件时，通过属性绑定的形式，为其提供必填的`channel-id`属性值：

```vue
<van-tabs v-model="active" sticky offset-top="1.22666667rem">
  <van-tab v-for="item in userChannel" :key="item.id" :title="item.name">
    <!-- 注意：Vue 官方建议在绑定 props 时，把“小驼峰”的属性名，改造成“短横线”的形式使用 -->
    <art-list :channel-id="item.id"></art-list>
  </van-tab>
</van-tabs>
```

3. 在`ArtList.vue`组件中，通过**插值表达式**渲染props接收到的`channelId`：

```vue
<template>
  <div>文章列表组件 --- {{channelId}}</div>
</template>
```

## 4.3 请求文章列表的数据

1. 在`/src/api/homeAPI.js`模块中,封装名为`getArtListAPI`的API接口:

```js
// 根据频道 Id 请求频道下的文章列表数据
export const getArtListAPI = (id, time) => {
  return request.get('/v1_0/articles', {
    params: {
      channel_id: id, // 频道的 Id
      timestamp: time, // 时间戳
    }
  })
}
```

2. 在`ArtList.vue`组件中，从`/src/api/homeAPI.js`模块中按需导入`getArtListAPI`接口：

```js
// 按需导入 API 接口
import { getArtListAPI } from '@/api/homeAPI'
```

3. 在`ArtList.vue`组件的data中，声明`artlist`数组，用来存放文章的列表数据。同时声明一个初始的时间戳`timestamp`：

```js
data() {
  return {
    // 文章列表的数组
    artlist: [],
    // 时间戳。初始的默认值为当前的时间戳
    timestamp: Date.now()
  }
}
```

4. 在`ArtList.vue`组件的methods中，定义名为`iniArtList`的方法，根据`channelId`和`timestamp`请求对应的文章列表数据：

```js
methods: {
  // 初始化文章的列表数据
  async initArtList() {
    // 请求 API 接口
    const { data: res } = await getArtListAPI(this.channelId, this.timestamp)
    if (res.message === 'OK') {
      // 为时间戳重新赋值
      this.timestamp = res.data.pre_timestamp
      // 为 artlist 赋值
      this.artlist = res.data.results
    }
  }
}
```

5. 在`ArtList.vue`组件的`created`声明周期中，调用`initArtList`方法：

```js
created() {
  // 在组件创建的时候，请求文章的列表数据
  this.initArtList()
},
```

## 4.4 封装文章Item项组件

### 4.4.1 初步封装 ArtItem 组件

1. 在 `/src/components/` 目录下新建 `ArtItem` 文件夹，并在其下新建 `ArtItem.vue` 组件：

```vue
<template>
  <div>文章 Item 组件</div>
</template>

<script>
export default {
  name: 'ArtItem'
}
</script>

<style lang="less" scoped></style>
```

2. 在 `ArtList.vue` 组件中导入、注册、并使用`ArtItem.vue` 组件：

导入 `ArtItem.vue` 组件：

```js
import ArtItem from '@/components/ArtItem/ArtItem.vue'
```

注册 `ArtItem.vue` 组件：

```js
components: {
  ArtItem
}
```

使用 `ArtItem.vue` 组件：

```vue
<template>
  <div>
    <!-- 循环渲染文章的列表 -->
    <art-item v-for="item in artlist" :key="item.art_id"></art-item>
  </div>
</template>
```

### 4.4.2 渲染 ArtItem 组件的布局结构

1. 在 `ArtItem.vue`

```vue
<template>
  <div>
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>文章的标题噢</span>
          <!-- 单张图片 -->
          <img src="https://www.escook.cn/vuebase/pics/1.png" alt="" class="thumb">
        </div>
        <!-- 三张图片 -->
        <div class="thumb-box">
          <img src="https://www.escook.cn/vuebase/pics/2.png" alt="" class="thumb">
          <img src="https://www.escook.cn/vuebase/pics/2.png" alt="" class="thumb">
          <img src="https://www.escook.cn/vuebase/pics/2.png" alt="" class="thumb">
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <span>作者 &nbsp;&nbsp; 0评论 &nbsp;&nbsp; 发布日期</span>
          <!-- 关闭按钮 -->
          <van-icon name="cross" />
        </div>
      </template>
    </van-cell>
  </div>
</template>
```

2. 在 `ArtItem.vue` 组件中，通过如下的 class 类名美化布局：

```css
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
```

### 4.4.3 为 ArtItem组件封装 props

1. 在 `ArtItem.vue` 组件的 `props` 节点下，声明 `article` 属性：

```js
export default {
  name: 'ArtItem',
  props: {
    // 文章的信息对象
    article: {
      type: Object, // 数据类型
      required: true // 必填项
    }
  }
}
```

2. 基于 `props` 接收到的 `article` 对象，渲染文章的信息：

```vue
<template>
  <div>
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{article.title}}</span>
          <!-- 单张图片 -->
          <img alt="" class="thumb" v-if="article.cover.type === 1" :src="article.cover.images[0]">
        </div>
        <!-- 三张图片 -->
        <div class="thumb-box" v-if="article.cover.type === 3">
          <img alt="" class="thumb" v-for="(item, index) in article.cover.images" :key="index" :src="item" >
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <span>{{article.aut_name}} &nbsp;&nbsp; {{article.comm_count}}评论 &nbsp;&nbsp; {{article.pubdate}}</span>
          <!-- 关闭按钮 -->
          <van-icon name="cross" />
        </div>
      </template>
    </van-cell>
  </div>
</template>
```

3. 在 `ArtList.vue` 组件中，通过 `v-for` 指令循环渲染 `ArtItem` 组件时，动态绑定 `article` 属性的值：

```vue
<!-- 循环渲染文章的列表 -->
<art-item v-for="item in artlist" :key="item.art_id" :article="item"></art-item>
```

## 4.5 上拉加载更多

> 基于 Vant 的 [List 列表](https://vant-contrib.gitee.io/vant/#/zh-CN/list)组件，可以轻松实现列表的上拉加载更多效果

### 4.5.1 初步使用List列表组件

1. 在 `ArtList.vue` 组件的 `data` 中，声明如下的两个数据项：

```js
data() {
  return {
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
}
```

2. 在 `ArtList.vue` 组件的模板结构中，使用 `<van-list>` 组件将 `<art-item>` 组件包裹起来：

```vue
<template>
  <div>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <!-- 循环渲染文章的列表 -->
      <art-item v-for="item in artlist" :key="item.art_id" :article="item"></art-item>
    </van-list>
  </div>
</template>
```

3. 在 `ArtList.vue` 组件的 `methods` 中声明 `onLoad` 函数如下：

```js
methods: {
  // 加载更多的数据
  onLoad() {
    console.log('触发了上拉加载更多')
  }
}
```

### 4.5.2 防止首次加载时触发 load 事件

1. 在浏览器中经过测试，发现：`<van-list>`组件首次加载的时候，会自动触发一次 `@load` 事件。
2. 经过翻阅 Vant 的官方文档，发现可以为 `<van-list>` 组件绑定 `:immediate-check="false"`属性，即可防止首次加载时触发 load 事件：

```vue
<template>
  <div>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
      <!-- 循环渲染文章的列表 -->
      <art-item v-for="item in artlist" :key="item.art_id" :article="item"></art-item>
    </van-list>
  </div>
</template>
```

### 4.5.3 实现上拉加载更多

1. 在 `<van-list>` 组件的 `@load="onLoad"` 事件处理函数中，调用 `initArtList`方法：

```js
// 加载更多的数据
onLoad() {
  console.log('触发了上拉加载更多')
  this.initArtList()
}
```

2. 改造 `methods` 中的 `initArtList` 函数，每当下一页数据请求回来之后，需要进行新旧数据的拼接操作：

```js
// 初始化文章的列表数据
async initArtList() {
  // 请求 API 接口
  const { data: res } = await getArtListAPI(this.channelId)
  if (res.message === 'OK') {
    // 为时间戳重新赋值
    this.timestamp = res.data.pre_timestamp
    // 1. 上拉加载更多时，应该是“旧数据”在前，“新数据”在后
    this.artlist = [...this.artlist, ...res.data.results]
  }
},
```

3. 当下一页数据请求回来之后，应该重置 `data` 中的 `loading` 为 `false`，否则下次触发“上拉加载更多”的时候，无法正常发起数据请求：

```js
// 初始化文章的列表数据
async initArtList() {
  // 请求 API 接口
  const { data: res } = await getArtListAPI(this.channelId,this.timestamp)
  if (res.message === 'OK') {
    // 为时间戳重新赋值
    this.timestamp = res.data.pre_timestamp
    // 1. 上拉加载更多时，应该是“旧数据”在前，“新数据”在后
    this.artlist = [...this.artlist, ...res.data.results]
    // 2. 重置 loading 为 false
    this.loading = false
  }
},
```

4. 当下一页数据请求回来之后，根据请求的结果，判断所有数据是否已加载完毕：

```js
// 初始化文章的列表数据
async initArtList() {
  // 请求 API 接口
  const { data: res } = await getArtListAPI(this.channelId,this.timestamp)
  if (res.message === 'OK') {
    // 为时间戳重新赋值
    this.timestamp = res.data.pre_timestamp
    // 1. 上拉加载更多时，应该是“旧数据”在前，“新数据”在后
    this.artlist = [...this.artlist, ...res.data.results]
    // 2. 重置 loading 为 false
    this.loading = false
    // 3. 判断所有的数据是否已加载完毕
    if (res.data.pre_timestamp === null) {
      this.finished = true
    }
  }
},
```

## 4.6 下拉刷新

> 基于 Vant 的 [PullRefresh 下拉刷新](https://vant-contrib.gitee.io/vant/#/zh-CN/pull-refresh)组件，可以轻松实现列表的下拉刷新效果

### 4.6.1 初步使用 PullRefresh 组件

1. 在 `ArtList.vue` 组件的 `data` 中声明如下的数据项：

```js
data() {
  return {
    // 省略其它的数据项...

    // 是否正在进行下拉刷新的请求
    isLoading: false
  }
}
```

2. 在 `ArtList.vue` 组件的模板结构中，在 `<van-list>` 之外包裹实现下拉刷新的 `<van-pull-refresh>` 组件：

```vue
<template>
  <div>
    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- 上拉加载更多 -->
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
        <!-- 循环渲染文章的列表 -->
        <art-item v-for="item in artlist" :key="item.art_id" :article="item"></art-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
```

在 `ArtList.vue` 组件的 `methods` 中，声明 `@refresh` 的事件处理函数 `onRefresh`：

```js
methods: {
  // 下拉刷新
  onRefresh() {
    console.log('触发了下拉刷新')
  }
}
```

### 4.6.2 请求下拉刷新的数据

1. 在 `ArtList.vue` 组件 `methods` 节点下的 `onRefresh` 方法中，调用 `initArtList` 函数请求下拉刷新的数据：

```js
// 下拉刷新
onRefresh() {
  this.initArtList(true)
}
```

2. 改造 `methods` 中的 `initArtList` 函数，通过形参接收调用者传递过来的值：

```js
methods: {
  // 初始化文章的列表数据
  // 如果 isRefresh 的值为 true，证明是下拉刷新，在最终拼接数据时，应该是“新数据”在前，“旧数据”在后
  // 如果 isRefresh 的值不为 true，证明不是下拉刷新，则拼接数据时，应该是“旧数据”在前，“新数据”在后
  async initArtList(isRefresh) {
    // 省略其它代码...
  }
}
```

3. 进一步改造 `initArtList` 函数，根据 `isRefresh` 的值，来决定如何拼接请求到的数据：

```js
// 初始化文章的列表数据
async initArtList(isRefresh) {
  // 请求 API 接口
  const { data: res } = await getArtListAPI(this.channelId)
  if (res.message === 'OK') {
    // 为时间戳重新赋值
    this.timestamp = res.data.pre_timestamp
    // 判断是否为下拉刷新
    if (isRefresh) {
      // 下拉刷新
      // 1. “新数据”在前，“旧数据”在后
      this.artlist = [...res.data.results, ...this.artlist]
      // 2. 重置 isLoading 为 false
      this.isLoading = false
    } else {
      // 上拉加载
      // 1. “旧数据”在前，“新数据”在后
      this.artlist = [...this.artlist, ...res.data.results]
      // 2. 重置 loading 为 false
   this.loading = false
    }

    // 3. 判断所有的数据是否已加载完毕
    if (res.data.pre_timestamp === null) {
      this.finished = true
    }
  }
}
```

4. 没有更多数据时，禁用下拉刷新的效果：

```vue
<!-- 下拉刷新 -->
<van-pull-refresh v-model="isLoading" @refresh="onRefresh" :disabled="finished"></van-pull-refresh>
```

## 4.7 格式化时间

> 基于 [day.js](https://dayjs.fenxianglu.cn/) 可以方便的实现相对时间的计算

1. 安装 `day.js` 包：

```bash
npm install dayjs --save
```

2. 在 `main.js` 入口文件中导入 `day.js` 相关的模块：

```js
// 导入 dayjs 的核心模块
import dayjs from 'dayjs'

// 导入计算相对时间的插件
import relativeTime from 'dayjs/plugin/relativeTime'

// 导入中文语言包
import zh from 'dayjs/locale/zh-cn'
```

3. 在 `main.js` 入口文件中，配置`插件和语言包`：

```js
// 配置“计算相对时间”的插件
dayjs.extend(relativeTime)

// 配置中文语言包
dayjs.locale(zh)
```

4. 在 `main.js` 入口文件中，定义格式化时间的`全局过滤器`：

```js
// dt 参数是文章的发表时间
Vue.filter('dateFormat', dt => {
  // 调用 dayjs() 得到的是当前的时间
  // .to() 方法的返回值，是计算出来的“相对时间”
  return dayjs().to(dt)
})
```

5. 在 `ArtItem.vue` 组件中，使用`全局过滤器格式化时间`：

```vue
<!-- label 区域的插槽 -->
<template #label>
  <div class="label-box">
    <span>{{article.aut_name}} &nbsp;&nbsp; {{article.comm_count}}评论 &nbsp;&nbsp; {{article.pubdate | dateFormat}}</span>
    <!-- 关闭按钮 -->
    <van-icon name="cross" />
  </div>
</template>
```

## 4.8 文章列表图片的懒加载

> 基于 Vant 的 [Lazyload 懒加载](https://vant-contrib.gitee.io/vant/#/zh-CN/lazyload)，可以轻松实现列表中图片的懒加载效果

1. 在 `main.js` 入口文件中，按需导入 `Lazyload` 指令：

```js
import Vant, { Lazyload } from 'vant'
```

2. 在` main.js` 中将 `Lazyload` 注册为全局可用的指令：

```js
Vue.use(Lazyload)
```

3. 在 `ArtItem.vue` 组件中，删除 `<img>` 标签的 `src 属性`，并应用 `v-lazy 指令`，指令的值是要展示的图片地址：

```vue
<!-- 单张图片 -->
<img alt="" class="thumb" v-if="article.cover.type === 1" v-lazy="article.cover.images[0]">

<!-- 三张图片 -->
<div class="thumb-box" v-if="article.cover.type === 3">
  <img alt="" class="thumb" v-for="(item, index) in article.cover.images" :key="index" v-lazy="item">
</div>
```

## 4.9 分支的合并和提交

1. 将修改过后的文件加入暂存区，并进行本地的 `commit` 提交：

```bash
git add .
git commit -m "实现了文章列表的功能"
```

2. 将本地的 `artlist` 分支首次推送到 Gitee 仓库中：

```bash
git push -u origin artlist
```

3. 将本地的 `artlist` 分支合并到本地的 `master` 主分支，并推送 master 分支到 Gitee 仓库：

```bash
git checkout master
git merge artlist
git push
```

4. 删除本地的 `artlist` 子分支：

```bash
git branch -d artlist
```

5. 基于 `master` 主分支，新建 `feedback` 分支，准备开发反馈操作相关的功能：

```bash
git checkout -b feedback
```

