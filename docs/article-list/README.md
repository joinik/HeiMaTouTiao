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
2. 在`Home.vue`组件中使用`ArtList.vue`组件时，通过属性绑定的形式，为其提供必填的`channel-id`属性值：
3. 在`ArtList.vue`组件中，通过**插值表达式**渲染props接收到的`channelId`：

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

1. 在浏览器中经过测试，发现：<van-list>组件首次加载的时候，会自动触发一次 @load 事件。
2. 经过翻阅 Vant 的官方文档，发现可以为 <van-list> 组件绑定 :immediate-check="false" 属性，即可防止首次加载时触发 load 事件：

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

## 4.6 下拉刷新

## 4.7 格式化时间

## 4.8 文章列表图片的懒加载

## 4.9 分支的合并和提交
