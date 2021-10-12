# 7.文章搜索

## 7.1 基于路由渲染搜索组件

1. 在 `/src/views/` 目录下新建 `Search` 文件夹，并在其下新建 `Search.vue` 组件：

```vue
<template>
  <div>
    <!-- Header 头部区域 -->
    <div class="search-header">
      <!-- 后退图标 -->
      <van-icon name="arrow-left" color="white" size="18" class="goback" />
      <!-- 搜索组件 -->
      <van-search v-model.trim="kw" placeholder="请输入搜索关键词" background="#007BFF" shape="round" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      // 搜索关键词
      kw: ''
    }
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
</style>
```

2. 在 `/src/router/index.js` 路由模块中，导入搜索组件：

```js
import Search from '@/views/Search/Search.vue'
```

3. 在路由模块中的 `routes` 数组中，声明搜索组件的路由规则：

```js
const routes = [
  // 省略其它的路由规则...

  // 搜索组件的路由规则
  { path: '/search', component: Search, name: 'search' }
]
```

4. 在 `/src/views/Home/Home.vue` 组件中，为搜索的小图标绑定点击事件处理函数，通过编程式导航 `API` 跳转到搜索页：

```html
<van-icon name="search" color="white" size="18" @click="$router.push('/search')" />
```

5. 点击搜索页的后退图标，通过编程式导航 API 实现后退操作：

```html
<!-- 后退图标 -->
<van-icon name="arrow-left" color="white" size="18" class="goback" @click="$router.back()" />
```

## 7.2 搜索框自动获得焦点

1. 在 `Search.vue` 组件的 `mounted` 生命周期函数中，并通过 `DOM` 操作查找到 `input` 输入框，使其获得焦点：

```js
mounted() {
  const ipt = document.querySelector('input[type=search]')
  ipt && ipt.focus()
}
```

> 关于 Vue2 组件的的生命周期，请参考 [Vue2 的官方文档](https://cn.vuejs.org/v2/guide/instance.html#生命周期图示)

## 7.3 实现输入框的防抖

> 节流：单位时间内，重复的操作只会触发 1 次
> 防抖：频繁触发某个操作时，仅触发最后 1 次

1. 在 `Search.vue` 组件的 `data` 节点下，声明 `timerId`，用来存储延时器的 id：

```js
data() {
  return {
    // 延时器的 Id
    timerId: null
  }
}
```

2. 监听搜索组件的 `input` 输入事件：

```html
<!-- 搜索组件 -->
<van-search v-model.trim="kw" placeholder="请输入搜索关键词" background="#007BFF" shape="round" ref="searchRef" @input="onInput" />
```

3. 在 `Search.vue` 组件的 `methods` 中声明 `onInput` 方法：

```js
methods: {
  // 搜索组件的输入事件
  onInput() {
    // 每次触发，都会打印 kw 的值
    console.log(this.kw)
  }
}
```

4. 在 `onInput` 方法中，将 `console.log(this.kw)` 放到延时器中：

```js
methods: {
  // 搜索组件的输入事件
  onInput() {
    // 1. 开启延时器，将延时器的 id 存储到 this.timerId 中
    this.timerId = setTimeout(() => {
      console.log(this.kw)
    }, 500)
  }
}
```

5. 在触发 `onInput` 方法时，立即清除掉上次的延时器，从而实现输入框的防抖操作：

```js
methods: {
  // 搜索组件的输入事件
  onInput() {
    // 2. 清除上次的延时器
    clearTimeout(this.timerId)

    // 1. 开启延时器，将延时器的 id 存储到 this.timerId 中
    this.timerId = setTimeout(() => {
      console.log(this.kw)
    }, 500)
  }
}
```

6. 如果触发 onInput 事件时 this.kw 的值为空字符串，则不开启延时器：

```js
methods: {
  // 搜索组件的输入事件
  onInput() {
    // 2. 清除上次的延时器
    clearTimeout(this.timerId)

    // 3. 如果输入的内容为空，则 return 出去，不开启延时器
    if (this.kw.length === 0) return

    // 1. 开启延时器，将延时器的 id 存储到 this.timerId 中
    this.timerId = setTimeout(() => {
      console.log(this.kw)
    }, 500)
  }
}

```

## 7.4 搜索建议

### 7.4.1 请求搜索建议的列表数据

1. 在 `/src/api/` 目录下，新建 `searchAPI.js` 模块，并定义请求搜索建议的 API 接口：

```js
import request from '@/utils/request.js'

// 获取搜索建议列表数据的 API
export const getSuggestListAPI = kw => {
  return request.get('/v1_0/suggestion', {
    // 注意：GET 请求的参数，要通过 params 提供
    params: {
      q: kw
    }
  })
}
```

2. 在 `Search.vue` 组件中，按需导入 `getSuggestListAPI` 接口：

```js
// 按需导入 API 接口
import { getSuggestListAPI } from '@/api/searchAPI.js'
```

3. 在 `Search.vue` 组件的 `data` 中声明 `suggestList` 数组，用来存放搜索的建议列表数据：

```js
data() {
  return {
    // 搜索建议列表
    suggestList: []
  }
}
```

4. 在 `Search.vue` 组件的 `methods` 中声明 `initSuggestList` 方法：

```js
// 请求搜索建议列表数据的方法
async initSuggestList() {
  // 调用 API 接口
  const { data: res } = await getSuggestListAPI(this.kw)
  if (res.message === 'OK') {
    // 为 suggestList 数据赋值
    this.suggestList = res.data.options
  }
}
```

5. 在搜索组件的 `@input` 事件处理函数中，调用 `initSuggestList` 方法：

```js
// 搜索组件的输入事件
onInput() {
  // 清除上次的延时器
  clearTimeout(this.timerId)

  // 如果输入的内容为空，则 return 出去，不开启延时器
  if (this.kw.length === 0) return

  // 重新开启新的延时器
  this.timerId = setTimeout(() => {
    // 请求建议列表的数据
    this.initSuggestList()
  }, 500)
},
```

### 7.4.2 渲染搜索建议的 DOM 结构

## 7.5 高亮搜索关键词

### 7.5.1 字符串的 replace 方法

### 7.5.2 定义高亮关键词的方法

### 7.5.3 实现关键词的高亮功能

## 7.6 搜索历史

### 7.6.1 渲染搜索历史的 DOM 结构

### 7.6.2 将搜索关键词存为搜索历史

### 7.6.3 持久化存储搜索历史

### 7.6.4 清空搜索历史记录

## 7.7 搜索结果

### 7.7.1 跳转到搜索结果页

### 7.7.2 基于路由渲染搜索结果页

### 7.7.3 封装搜索文章列表数据的 API

### 7.7.4 搜索文章列表的数据

### 7.7.5 渲染搜索结果的列表数据

### 7.7.6 实现上拉加载更多

### 7.7.7 自定义关闭按钮的显示与隐藏

## 7.8 分支的合并与提交
