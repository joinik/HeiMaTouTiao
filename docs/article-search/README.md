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

1. 在 `Search.vue` 组件中，和 `Header` 头部区域平级，基于 `v-for` 指令循环渲染出搜索建议的 `DOM` 结构：

```html
<template>
  <div>
    <!-- Header 头部区域 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon name="arrow-left" color="white" size="18" class="goback" @click="$router.back()" />
      <!-- 搜索组件 -->
      <van-search v-model.trim="kw" placeholder="请输入搜索关键词" background="#007BFF" shape="round" ref="searchRef" @input="onInput" />
    </div>

    <!-- 搜索建议 -->
    <div class="sugg-list">
      <div class="sugg-item" v-for="(item, i) in suggestList" :key="i">{{item}}</div>
    </div>

    <!-- 搜索历史 -->
  </div>
</template>
```

2. 在 `Search.vue` 组件的 `<style>` 节点下，通过以下的样式美化搜索建议区域的样式：

```less
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
```

3. 修改 `Search.vue` 组件 `methods` 节点下的 `onInput` 方法，当搜索关键词变成空字符串的时候，清空 `data` 中的 `suggestList` 数组：

```js
// 搜索组件的输入事件
onInput() {
  clearTimeout(this.timerId)

  // 输入的搜索关键词为空
  if (this.kw.length === 0) {
    // 清空搜索建议的列表数据
    this.suggestList = []
    return
  }

  this.timerId = setTimeout(() => {
    this.initSuggestList()
  }, 500)
},
```

## 7.5 高亮搜索关键词

> 要想实现搜索关键词的高亮效果，需要用到字符串的 replace 方法以及正则

### 7.5.1 字符串的 replace 方法

1. 将字符串中的 `js` 替换为 `javascript`：

```js
// 待处理的字符串
const str = 'JS ArrayBuffer about js'

const newStr = str.replace('js', 'javascript')
console.log(newStr) // JS ArrayBuffer about javascript

// 缺点：无法正常处理大小写问题
```

2. 通过正则进行字符串的替换：

```js
// 待处理的字符串
const str = 'JS ArrayBuffer about js'

// replace 方法的第一个形参，可以接收正则表达式进行匹配
// 可以通过修饰符 i 来忽略大小写
const newStr = str.replace(/js/i, 'javascript')
console.log(newStr) // javascript ArrayBuffer about js

// 缺点：只能匹配第一个满足条件的字符串，无法从前到后进行全局匹配
```

3. 为正则表达式指定 `g` 修饰符：

```js
// 待处理的字符串
const str = 'JS ArrayBuffer about js'

// replace 方法的第一个形参，可以接收正则表达式进行匹配
// 可以通过修饰符 i 来忽略大小写；通过 g 来进行全局匹配
const newStr = str.replace(/js/gi, 'javascript')
console.log(newStr) // javascript ArrayBuffer about javascript

// 缺点：正则中要匹配的文本只能写死，无法动态创建正则表达式
```

4. 通过 `new RegExp()` 来动态创建正则表达式：

```js
// 关键词
const kw = 'js'
// 待处理的字符串
const str = 'JS ArrayBuffer about js'

// 1. 动态创建正则表达式
const reg = new RegExp(kw, 'ig')
// 2. 调用字符串的 replace 进行替换
const newStr = str.replace(reg, 'javascript')

// 3. 替换的结果 javascript ArrayBuffer about javascript
console.log(newStr)

// 缺点：无法拿到每一次正则匹配的结果
```

5. 将 `replace` 方法的第二个参数指定为回调函数：

```js
// 关键词
const kw = 'js'
// 待处理的字符串
const str = 'JS ArrayBuffer about js'

// 1. 动态创建正则表达式
const reg = new RegExp(kw, 'ig')
// 2. 调用字符串的 replace 进行替换，第二个参数为回调函数。其中 val 是匹配到的值
const newStr = str.replace(reg, val => {
  return `<span>${val}</span>`
})

// 3. 替换的结果 <span>JS</span> ArrayBuffer about <span>js</span>
console.log(newStr)
```

### 7.5.2 定义高亮关键词的方法

1. 在 `Search.vue` 组件的 `methods` 节点下，声明高亮搜索关键词的方法:

```js
// 高亮搜索关键词的方法，形参中的 arr 是搜索建议的数组
hlightKeywords(arr) {
  // 循环数组中的每一项
  arr.forEach((item, index) => {
    arr[index] = `索引：${index}；Item：${item}`
  })
}
```

2. 当请求到搜索建议的列表数据之后，先调用 `hlightKeywords` 方法进行关键词的高亮，再把数据赋值给 `suggestList`：

```js
// 请求搜索建议列表数据的方法
async initSuggestList() {
  // 调用 API 接口
  const { data: res } = await getSuggestListAPI(this.kw)
  if (res.message === 'OK') {
    // 1. 调用 hlightKeywords 方法，对关键词进行高亮处理
    this.hlightKeywords(res.data.options)

    // 2. 将高亮的结果，赋值给 suggestList
    this.suggestList = res.data.options
  }
}
```

### 7.5.3 实现关键词的高亮功能

1. `在 hlightKeywords` 方法中，根据用户输入的搜索关键词，动态创建正则表达式：

```js
// 高亮搜索关键词的方法，形参中的 arr 是搜索建议的数组
hlightKeywords(arr) {
  // 1. 根据用户输入的 kw，动态创建正则表达式
  const reg = new RegExp(this.kw, 'ig')

  // 循环数组中的每一项
  arr.forEach((item, index) => {
    // 2. TODO：调用字符串的 replace 方法，进行关键词的高亮处理
  })
}
```

2. 调用字符串的 `replace` 方法，对关键词进行高亮处理：

```js
// 高亮搜索关键词的方法，形参中的 arr 是搜索建议的数组
hlightKeywords(arr) {
  // 1. 根据用户输入的 kw，动态创建正则表达式
  const reg = new RegExp(this.kw, 'ig')

  // 循环数组中的每一项
  arr.forEach((item, index) => {
    // 2. 调用字符串的 replace 方法进行关键字的高亮处理
    arr[index] = item.replace(reg, val => {
      return `<span style="color: red; font-weight: bold;">${val}</span>`
    })
  })
}
```

3. 在 `Search.vue` 组件中，循环渲染搜索的建议列表时，将 插值表达式替换为 `v-html` 指令，从而渲染出带标签和样式的内容：

```html
<!-- 搜索建议 -->
<div class="sugg-list">
  <div class="sugg-item" v-for="(item, i) in suggestList" :key="i" v-html="item"></div>
</div>
```

## 7.6 搜索历史

### 7.6.1 渲染搜索历史的 DOM 结构

1. 在 `Search.vue` 组件的 `data` 中定义如下的假数据：

```js
data() {
  return {
    // 搜索历史
    history: ['API', 'java', 'css', '前端', '后台接口', 'python']
  }
}
```

2. 在 `Search.vue` 组件中，和搜索建议平级，在搜索建议之后渲染搜索历史的 `DOM` 结构：

```html
<!-- 搜索历史 -->
<div class="search-history">
  <!-- 标题 -->
  <van-cell title="搜索历史">
    <!-- 使用 right-icon 插槽来自定义右侧图标 -->
    <template #right-icon>
      <van-icon name="delete" class="search-icon" />
    </template>
  </van-cell>

  <!-- 历史列表 -->
  <div class="history-list">
    <span class="history-item" v-for="(tag, i) in history" :key="i">{{tag}}</span>
  </div>
</div>
```

3. 在 `Search.vue` 组件的 `<style>`节点下，通过如下的样式美化搜索历史的 DOM 结构：

```css
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
```

4. 根据搜索关键字 `kw` 的 `length` 是否为 `0`，再结合 `v-if` 和 `v-else` 指令，实现搜索建议和搜索历史的按需展示：

```html
<!-- 搜索建议 -->
<div class="sugg-list" v-if="kw.length != 0"></div>

<!-- 搜索历史 -->
<div class="search-history" v-else></div>
```

### 7.6.2 将搜索关键词存为搜索历史

1. 在 `Search.vue` 组件中，将 `data` 节点下的 `history` 数组清空：

```js
data() {
  return {
    // 省略其它的数据项...

    // 搜索历史
    history: []
  }
}
```

2. 修改`initSuggestList` 方法，把搜索关键词存储到 `history` 数组中：

```js
// 请求搜索建议列表数据的方法
async initSuggestList() {
  // 调用 API 接口
  const { data: res } = await getSuggestListAPI(this.kw)
  if (res.message === 'OK') {
    // 高亮搜索建议中的搜索关键词
    this.hlightKeywords(res.data.options)
    // 为 suggestList 数据赋值
    this.suggestList = res.data.options

    // 把搜索关键词加入到搜索历史中
    const newHistory = this.history.filter(item => item !== this.kw)
    newHistory.unshift(this.kw)
    this.history = newHistory
  }
},
```

### 7.6.3 持久化存储搜索历史

1. 定义 `watch` 侦听器，监视 `history` 数组的变化，并把它持久化存储到 `localStorage` 中：

```js
watch: {
  // 监视历史记录的变化
  history(newVal) {
    // 持久化存储到本地
    localStorage.setItem('history', JSON.stringify(newVal))
  }
}
```

2. 当 `Search.vue` 组件首次被加载时，读取 `localStorage` 中的历史记录，并赋值给 `data` 中的 `history`：

```js
data() {
  return {
    // 省略其它数据项...

    // 搜索历史
    history: JSON.parse(localStorage.getItem('history') || '[]')
  }
}
```

### 7.6.4 清空搜索历史记录

1. 在搜索历史的标题中，为删除的小图标绑定点击事件处理函数：

```html
<!-- 标题 -->
<van-cell title="搜索历史">
  <!-- 使用 right-icon 插槽来自定义右侧图标 -->
  <template #right-icon>
    <!-- 在带年纪事件处理函数中，直接将 history 数组清空即可 -->
    <van-icon name="delete" class="search-icon" @click="history = []" />
  </template>
</van-cell>
```

## 7.7 搜索结果

### 7.7.1 跳转到搜索结果页

1. 在 `Search.vue` 组件中，为搜索建议项绑定 `click` 点击事件处理函数：

```html
<!-- 搜索建议 -->
<div class="sugg-list" v-if="kw.length != 0">
  <div class="sugg-item" v-for="(item, i) in suggestList" :key="i" v-html="item" @click="gotoSearchResult">{{item}}</div>
</div>
```

2. 在 `Search.vue` 组件中，为历史记录中的每一项，绑定 `click` 点击事件处理函数：

```html
<!-- 历史记录 -->
<div class="history-list">
  <span class="history-item" v-for="(tag, i) in history" :key="i" @click="gotoSearchResult">{{tag}}</span>
</div>
```

3. 在 `Search.vue` 组件的 `methods` 中，声明 `gotoSearchResult` 方法如下：

```js
// 跳转到搜索结果页
gotoSearchResult(e) {
  // e.currentTarget 是当正在触发事件的那个元素
  // console.log(e.currentTarget.innerText)

  // 1. 获取用户当前点击的搜索建议项的内容
  const kw = e.currentTarget.innerText

  // 2. 通过编程式导航 API，跳转到搜索结果页
  this.$router.push('/search/' + kw)
}
```

### 7.7.2 基于路由渲染搜索结果页

1. 在 `/src/views/` 目录下，新建 `SearchResult` 文件夹，并在其下新建 `SearchResult.vue` 组件：

```html
<template>
  <div class="search-result-container">
    <!-- 点击实现后退效果 -->
    <van-nav-bar title="搜索结果" left-arrow @click-left="$router.back()" fixed />
  </div>
</template>

<script>
export default {
  name: 'SearchResult'
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>
```

2. 在 `/src/router/index.js` 路由模块中，导入搜索结果页的组件，并在 `routes` 中声明对应的路由规则：

```js
// 导入搜索结果页
import SearchResult from '@/views/SearchResult/SearchResult.vue'

const routes = [
  // 省略其它的路由规则...

  // 搜索结果页
  { path: '/search/:kw', component: SearchResult, name: 'search-result' }
]
```

3. 在 `/src/cover.less` 中，对 `NavBar` 中的小图标颜色进行主题定制：

```less
// 设置 NavBar 组件中小图标的颜色值
@nav-bar-icon-color: @white;
```

### 7.7.3 封装搜索文章列表数据的 API

1. 在 `/src/api/searchAPI.js` 模块中，封装 `getSearchResultAPI` 方法，用来根据关键词搜索文章的列表数据

```js
// 封装搜索文章数据的 API
export const getSearchResultAPI = (kw, page) => {
  return request.get('/v1_0/search', {
    params: {
      q: kw, // 搜索关键词
      page // 页码值
    }
  })
}
```

2. 在 `SearchResult.vue` 组件的 `data` 中定义 `page` 页码值：

```js
data() {
  return {
    // 页码值
    page: 1
  }
}
```

3. 在 `/src/router/index.js` 路由模块中，为搜索结果页的路由规则添加 `props: true` 选项：

```js
const routes = [
  // 省略其它的路由规则...

  // 搜索结果页
  { path: '/search/:kw', component: SearchResult, name: 'search-result', props: true }
]
```

### 7.7.4 搜索文章列表的数据

1. 在 `SearchResult.vue` 组件中，按需导入 `API` 方法：

```js
// 按需导入 API 方法
import { getSearchResultAPI } from '@/api/searchAPI.js'
```

2. 在 `SearchResult.vue` 组件的 `data` 中，定义名为 `searchList` 的数组：

```js
data() {
  return {
    // 搜索的结果
    searchList: []
  }
}
```

3. 在 `SearchResult.vue` 组件的 `methods` 中定义名为 `initSearchList` 的方法：

```js
methods: {
  // 获取搜索的结果
  async initSearchList() {
    // 调用 API 接口
    const { data: res } = await getSearchResultAPI(this.kw, this.page)

    if (res.message === 'OK') {
      // 为 searchList 赋值
      this.searchList = res.data.results
    }
  }
}
```

4. 在 `SearchResult.vue` 组件的 `created` 生命周期函数中，调用 `initSearchList` 方法搜索文章的列表数据：

```js
created() {
  this.initSearchList()
},
```

### 7.7.5 渲染搜索结果的列表数据

1. 在 `SearchResult.vue` 组件中，导入`ArtItem.vue` 组件：

```js
// 导入文章的 Item 项组件
import ArtItem from '@/components/ArtItem/ArtItem.vue'
```

2. 在 `SearchResult.vue` 组件中，通过 `components` 节点对导入的 `ArtItem.vue` 组件进行注册：

```js
components: {
  // 注册组件
  ArtItem
}
```

3. 在 `SearchResult.vue` 组件的模板结构中，基于 `v-for` 指令循环渲染 `ArtItem.vue` 组件：

```html
<template>
  <div class="search-result-container">
    <!-- 点击实现后退效果 -->
    <van-nav-bar title="搜索结果" left-arrow @click-left="$router.back()" fixed />

    <!-- 文章的 Item 项 -->
    <art-item v-for="item in searchList" :key="item.art_id.toString()" :article="item"></art-item>
  </div>
</template
```

### 7.7.6 实现上拉加载更多

1. 在 `SearchResult.vue` 组件的 `data` 中声明如下的两个数据项：

```js
data() {
  return {
    // 省略其它数据项...

    // 是否正在进行上拉加载的数据请求
    loading: false,
    // 所有数据是否已经加载完毕
    finished: false
  }
}
```

2. 在 `SearchResult.vue` 组件中，使用 `<van-list>` 组件把 `<art-item>` 组件包裹起来：

```html
<!-- 上拉加载更多 -->
<van-list v-model="loading" :finished="finished" finished-text="没有更多数据了" @load="onLoad" :immediate-check="false">
  <!-- 文章的 Item 项 -->
  <art-item v-for="item in searchList" :key="item.art_id.toString()" :article="item"></art-item>
</van-list>
```

3. 在 `SearchResult.vue` 组件的 `methods` 中定义 `onLoad` 方法：

```js
methods: {
  // 触发了上拉加载更多
  onLoad() {
    this.initSearchList()
  }
}
```

4. 进一步改造 `methods` 中的 `initSearchList` 方法：

```js
// 获取搜索的结果
async initSearchList() {
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
```

### 7.7.7 自定义关闭按钮的显示与隐藏

1. 在 `/src/components/ArtItem` 目录下的 `ArtItem.vue` 组件中，新增名为 `closable` 的 `prop` 属性：

```js
props: {
  // 是否展示关闭按钮
  closable: {
    type: Boolean,
    // 默认值为 true，表示展示关闭按钮
    default: true
  }
}
```

2. 使用 `v-if` 动态控制关闭按钮的展示与隐藏：

```html
<!-- 关闭按钮 -->
<van-icon name="cross" @click.stop="show = true" v-if="closable" />
```

3. 在 `SearchResult.vue` 组件中使用 `ArtItem.vue` 组件时，不展示关闭按钮：

```html
<!-- 上拉加载更多 -->
<van-list v-model="loading" :finished="finished" finished-text="没有更多数据了" @load="onLoad" :immediate-check="false">
  <!-- 文章的 Item 项 -->
  <art-item v-for="item in searchList" :key="item.art_id.toString()" :article="item" :closable="false"></art-item>
</van-list>
```

## 7.8 分支的合并与提交

1. 将修改过后的文件加入暂存区，并进行本地的 commit 提交：

```bash
git add .
git commit -m "完成了文章搜索功能"
```

2. 将本地的 search 分支首次推送到 Gitee 仓库中：

```bash
git push -u origin search
```

3. 将本地的 search 分支合并到本地的 master 主分支，并推送 master 分支到 Gitee 仓库：

```bash
git checkout master
git merge search
git push
```

4. 删除本地的 search 子分支：

```bash
git branch -d search
```

5. 基于 master 主分支，新建 art-detail 分支，准备开发文章详情相关的功能：

```bash
git checkout -b art-detail
```
