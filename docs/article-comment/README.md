# 9.文章评论

## 9.1 封装 ArtCmt 评论组件

1. 在 `/src/components/` 目录下新建 `ArtCmt` 文件夹，并在其下新建 `ArtCmt.vue` 组件：

```html
<template>
  <div>评论组件</div>
</template>

<script>
export default {
  name: 'ArtCmt'
}
</script>

<style lang="less" scoped></style>
```

2. 在 `ArticleDetail.vue` 组件中，导入 `ArtCmt.vue` 评论组件：

```js
// 导入文章的评论组件
import ArtCmt from '@/components/ArtCmt/ArtCmt.vue'
```

3. 在 `ArticleDetail.vue` 组件中，基于 `components` 节点进行组件的注册：

```js
components: {
  // 注册文章评论组件
  ArtCmt
}
```

4. 在 `ArticleDetail.vue` 组件中，和文章信息区域平级，在它的后面使用 `<art-cmt>` 组件：

```html
<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />

    <!-- 文章信息区域 -->
    <div class="article-container" v-if="article">
      <!-- 省略其它的 DOM 结构 -->
    </div>

    <!-- 文章的评论组件 -->
    <art-cmt></art-cmt>
  </div>
</template>
```

## 9.2 渲染评论组件的基础结构

1. 在 `ArtCmt.vue` 组件中声明如下的模板结构：

```html
<template>
  <div>
    <!-- 评论列表 -->
    <div class="cmt-list">
      <!-- 评论的 Item 项 -->
      <div class="cmt-item">
        <!-- 头部区域 -->
        <div class="cmt-header">
          <!-- 头部左侧 -->
          <div class="cmt-header-left">
            <img src="" alt="" class="avatar">
            <span class="uname">zs</span>
          </div>
          <!-- 头部右侧 -->
          <div class="cmt-header-right">
            <van-icon name="like" size="16" color="red" />
            <van-icon name="like-o" size="16" color="gray" />
          </div>
        </div>
        <!-- 主体区域 -->
        <div class="cmt-body">
          基于字体的图标集，可以通过 Icon 组件使用，也可以在其他组件中通过 icon 属性引用。基于字体的图标集，可以通过 Icon 组件使用，也可以在其他组件中通过 icon 属性引用。
        </div>
        <!-- 尾部区域 -->
        <div class="cmt-footer">3天前</div>
      </div>
    </div>
  </div>
</template>
```

2. 在 `ArtCmt.vue` 组件的 `<style>` 节点下声明如下的样式，用来美化组件的 `DOM`结构：

```less
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
```

## 9.3 渲染评论列表的数据

> 带有评论的文章链接地址：
> http://localhost:8080/#/article/1323206783581290496

### 9.3.1 封装获取文章评论的 API

1. 在 `/src/api/articleAPI.js` 模块中，定义名为 `getCmtListAPI` 的方法：

```js
// 获取文章下评论数据的 API
export const getCmtListAPI = (artId, offset) => {
  return request.get('/v1_0/comments', {
    params: {
      // a 表示获取文章下的评论
      type: 'a',
      // 文章的 Id
      source: artId,
      // 获取评论数据的偏移量，值为评论的 id。表示从此 id 的数据向后取，不传表示从第一页开始读取数据
      offset
    }
  })
}
```

### 9.3.2 为评论组件封装 artId 属性

1. 在 `ArtCmt.vue` 组件的 `props` 节点下，封装 `artId` 属性：

```js
export default {
  name: 'ArtCmt',
  props: {
    // 文章的 Id（小驼峰命名法）
    artId: {
      type: [String, Number],
      required: true
    }
  }
}
```

2. 在 `ArticleDetail.vue` 组件中使用 `<art-cmt>` 组件时为其动态绑定 `art-id` 属性的值：

```html
<!-- 文章的评论组件（ art-id 是短横线命名法 ） -->
<art-cmt :art-id="id"></art-cmt>
```

### 9.3.3 请求评论列表的数据

1. 在 `ArtCmt.vue` 组件中，按需导入 `articleAPI.js` 中的 `getCmtListAPI` 方法：

```js
// 按需导入 API
import { getCmtListAPI } from '@/api/articleAPI.js'
```

2. 在 `ArtCmt.vue` 组件的 `data` 中，声明如下的两个数据项：

```js
data() {
  return {
    // 文章的评论列表数据
    cmtlist: [],
    // 偏移量
    offset: null
  }
}
```

3. 在 `ArtCmt.vue` 组件的 `methods` 中定义名为 `initCmtList` 的方法：

```js
methods: {
  // 初始化评论列表的数据
  async initCmtList() {
    // 调用 API 接口
    const { data: res } = await getCmtListAPI(this.artId, this.offset)
    if (res.message === 'OK') {
      // 为偏移量赋值
      this.offset = res.data.last_id
      // 为列表数据赋值
      this.cmtlist = res.data.results
    }
  }
}
```

4. 在 `ArtCmt.vue` 组件的 `created` 中调用 `initCmtList` 方法：

```js
created() {
  this.initCmtList()
}
```

### 9.3.4 渲染评论列表的数据

1. 在 ArtCmt.vue 组件的模板结构中，基于 v-for 指令循环渲染每条评论的数据：

```html
<template>
  <div>
    <!-- 评论列表 -->
    <div class="cmt-list">
      <!-- 评论的 Item 项 -->
      <div class="cmt-item" v-for="item in cmtlist" :key="item.com_id.toString()">
        <!-- 头部区域 -->
        <div class="cmt-header">
          <!-- 头部左侧 -->
          <div class="cmt-header-left">
            <img :src="item.aut_photo" alt="" class="avatar">
            <span class="uname">{{item.aut_name}}</span>
          </div>
          <!-- 头部右侧 -->
          <div class="cmt-header-right">
            <van-icon name="like" size="16" color="red" v-if="item.is_liking" />
            <van-icon name="like-o" size="16" color="gray" v-else />
          </div>
        </div>
        <!-- 主体区域 -->
        <div class="cmt-body">{{item.content}}</div>
        <!-- 尾部区域 -->
        <div class="cmt-footer">{{item.pubdate | dateFormat}}</div>
      </div>
    </div>
  </div>
</template>
```

### 9.3.5 实现评论列表的上拉加载

1. 在 `ArtCmt.vue` 组件的 `data` 中定义如下两个数据项：

```js
data() {
  return {
    // 省略其它的数据项...

    // 是否正在请求上拉加载的数据
    loading: false,
    // 所有数据是否加载完毕了
    finished: false
  }
}
```

2. 在 `ArtCmt.vue` 组件的模板结构中，将带有 `class="cmt-list"` 类名的 `<div>` 元素替换为 `<van-list>` 组件：

```html
<template>
  <div>
    <!-- 评论列表 -->
    <van-list class="cmt-list" v-model="loading" :finished="finished" finished-text="没有更多评论了" :immediate-check="false" @load="onLoad">
      <!-- 评论的 Item 项 -->
    </van-list>
  </div>
</template>
```

3. 在 `ArtCmt.vue` 组件的 `methods` 中定义名为 `onLoad` 方法：

```js
methods: {
  // 上拉加载
  onLoad() {
    this.initCmtList()
  }
}
```

4. 进一步改造 `initCmtList`方法：

```js
// 初始化评论列表的数据
async initCmtList() {
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
```

## 9.4 评论的点赞和取消点赞

### 9.4.1 实现评论的点赞功能

1. 在 `articleAPI.js` 模块中，声明评论点赞的 `API` 接口：

```js
// 评论点赞的 API
export const addLikeCmtAPI = cmtId => {
  return request.post('/v1_0/comment/likings', {
    target: cmtId
  })
}
```

2. 在 `ArtCmt.vue` 中按需导入评论点赞的 `API` 接口：

```js
// 按需导入 API
import { getCmtListAPI, addLikeCmtAPI } from '@/api/articleAPI.js'
```

3. 在 `ArtCmt.vue` 组件中，为 `name="like-o"` 的 `<van-icon>` 图标绑定点击事件处理函数，并把当前评论作为参数传递进去：

```html
<van-icon name="like-o" size="16" color="gray" v-else @click="addLike(item)" />
```

4. 在 `ArtCmt.vue` 组件的 `methods` 中声明 `addLike` 方法：

```js
methods: {
  // 评论点赞
  async addLike(cmt) {
    // 1. 调用 API 接口
    const { data: res } = await addLikeCmtAPI(cmt.com_id.toString())

    if (res.message === 'OK') {
      // 2. 在客户端，将点赞的状态设置为 true
      cmt.is_liking = true
    }
  }
}
```

### 9.4.2 实现评论的取消点赞功能

1. 在 `articleAPI.js` 模块中，声明评论取消点赞的 `API` 接口：

```js
// 评论取消点赞的 API
export const delLikeCmtAPI = cmtId => {
  return request.delete(`/v1_0/comment/likings/${cmtId}`)
}
```

2. 在 `ArtCmt.vue` 中按需导入评论取消点赞的 `API` 接口：

```js
// 按需导入 API
import { getCmtListAPI, addLikeCmtAPI, delLikeCmtAPI } from '@/api/articleAPI.js'
```

3. 在 `ArtCmt.vue` 组件中，为 `name="like"` 的 `<van-icon>` 图标绑定点击事件处理函数，并把当前评论作为参数传递进去：

```html
<van-icon name="like" size="16" color="red" v-if="item.is_liking" @click="delLike(item)" />
```

4. 在 `ArtCmt.vue` 组件的 `methods` 中声明 `delLike` 方法：

```js
methods: {
  // 评论取消点赞
  async delLike(cmt) {
    // 1. 调用 API 接口（注意：由于取消点赞的 API 没有响应体，不需要进行解构赋值）
    const res = await delLikeCmtAPI(cmt.com_id.toString())

    if (res.status === 204) {
      // 2. 在客户端，将点赞的状态设置为 false
      cmt.is_liking = false
    }
  }
}
```

## 9.5 发布评论

### 9.5.1 渲染发布评论的基础结构

1. 在 `ArtCmt.vue` 组件中，和“评论列表”的 `DOM` 结构平级，声明“评论区域”的 `DOM` 结构：

```html
<!-- 底部添加评论区域 - 1 -->
<div class="add-cmt-box van-hairline--top">
  <van-icon name="arrow-left" size="18" @click="$router.back()" />
  <div class="ipt-cmt-div">发表评论</div>
  <div class="icon-box">
    <van-badge :content="0" :max="99">
      <van-icon name="comment-o" size="20" />
    </van-badge>
    <van-icon name="star-o" size="20" />
    <van-icon name="share-o" size="20" />
  </div>
</div>

<!-- 底部添加评论区域 - 2 -->
<div class="cmt-box van-hairline--top">
  <textarea placeholder="友善评论、理性发言、阳光心灵"></textarea>
  <van-button type="default" disabled>发布</van-button>
</div>
```

2. 美化评论区域的样式：

```less
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
```

### 9.5.2 实现底部两个评论区域的按需展示

1. 在 `ArtCmt.vue` 组件的 `data` 中定义名为 `showBox1` 的布尔值：

```js
data() {
  return {
    // 省略其它数据项...

    // 是否展示评论区域1（如果值为 true 则展示评论区域1；如果值为 false 则展示评论区域2）
    isShowBox1: true
  }
}
```

2. 在 `ArtCmt.vue` 组件的 `DOM` 结构中，基于 `v-if` 和 `v-else` 按需渲染评论区域的两个盒子

```html
<!-- 底部添加评论区域 - 1 -->
<div class="add-cmt-box van-hairline--top" v-if="isShowBox1"></div>

<!-- 底部添加评论区域 - 2 -->
<div class="cmt-box van-hairline--top" v-else></div>
```

3. 在 `ArtCmt.vue` 组件的第 1 个评论区域中，为 `class="ipt-cmt-div"` 的 `div` 元素绑定点击事件处理函数：

```html
<div class="ipt-cmt-div" @click="showBox2">发表评论</div>
```

4. 在 `ArtCmt.vue` 组件的 `methods` 中定义 `showBox2` 方法：

```js
// 展示第二个评论区域
showBox2() {
  this.isShowBox1 = false
},
```

5. 在 `ArtCmt.vue` 组件的第 2 个评论区域中，为 `textarea` 元素绑定点击事件处理函数：

```html
<textarea placeholder="友善评论、理性发言、阳光心灵" @blur="hideBox2"></textarea>
```

6. 在 `ArtCmt.vue` 组件的 `methods` 中定义 `hideBox2` 方法：

```js
// 隐藏第二个评论区域
hideBox2() {
  this.isShowBox1 = true
}
```

### 9.5.3 发表评论的输入框自动获得焦点

1. 在 `ArtCmt.vue` 组件中，进一步改造 `showBox2` 方法：

```js
// 展示第二个评论区域
showBox2() {
  // 隐藏评论区域1，展示评论区域2
  this.isShowBox1 = false

  // 1. 将回调函数延迟到下次 DOM 更新完毕之后执行
  this.$nextTick(() => {
    // 2. 通过 ref 获取到 textarea 的引用
    this.$refs.iptCmt.focus()
  })
},
```

2. 动态控制 `ArtCmt.vue` 组件外层容器底部的 `padding` 距离：

```html
<template>
  <div :class="isShowBox1 ? 'art-cmt-container-1' : 'art-cmt-container-2'">
    <!-- 省略其它代码... -->
  </div>
</template>
```

### 9.5.4 动态渲染评论的总数量

1. 在 `ArtCmt.vue` 组件的 `data` 节点下，声明 `cmtCount` 属性，表示当前文章下的总评论数量：

```js
data() {
  return {
    // 省略其它的数据项...

    // 当前文章的总评论数
    cmtCount: 0,
  }
}
```

2. 在 `ArtCmt.vue` 组件的模板结构中，为“评论区域 1”中的 `<van-badge>` 组件动态绑定 `content` 属性值：

```html
<!-- 底部添加评论区域 - 1 -->
<div class="add-cmt-box van-hairline--top" v-if="isShowBox1">
  <van-icon name="arrow-left" size="18" @click="$router.back()" />
  <div class="ipt-cmt-div" @click="showBox2">发表评论</div>
  <div class="icon-box">
    <!-- 渲染评论的数量 -->
    <van-badge :content="cmtCount" :max="99">
      <van-icon name="comment-o" size="20" />
    </van-badge>
    <van-icon name="star-o" size="20" />
    <van-icon name="share-o" size="20" />
  </div>
</div>
```

3. 改造 `ArtCmt.vue` 组件中的 `initCmtList` 方法，当获取评论列表数据的接口调用成功之后，立即为 `data` 中的 `cmtCount` 属性赋值：

```js
// 初始化评论列表的数据
async initCmtList() {
  // 调用 API 接口
  const { data: res } = await getCmtListAPI(this.artId, this.offset)
  if (res.message === 'OK') {
    // 为总评论数赋值
    this.cmtCount = res.data.total_count
    // 为列表数据赋值
    this.cmtlist = [...this.cmtlist, ...res.data.results]

    // 为偏移量赋值
    this.offset = res.data.last_id
    // 将 loading 重置为 false
    this.loading = false
    // 判断所有数据是否加载完毕
    if (res.data.results.length === 0) {
      this.finished = true
    }
  }
},
```

### 9.5.5 获取用户填写的评论内容

1. 在 `ArtCmt.vue` 组件的 `data` 中定义名为 `cmt` 的数据项，表示用户填写的评论内容：

```js
data() {
  return {
    // 省略其它数据项...

    // 用户填写的评论内容
    cmt: ''
  }
}
```

2. 在 `ArtCmt.vue` 组件的模板结构中，为“评论区域 2”中的`<textarea>` 元素应用 `v-model` 双向数据绑定的指令：

```html
<!-- 底部添加评论区域 - 2 -->
<div class="cmt-box van-hairline--top" v-else>
  <textarea placeholder="友善评论、理性发言、阳光心灵" @blur="hideBox2" ref="iptCmt" v-model.trim="cmt"></textarea>
  <van-button type="default" disabled>发布</van-button>
</div>
```

3. 动态控制发布按钮的禁用状态：

```html
<van-button type="default" :disabled="cmt.length === 0">发布</van-button>
```

4. 为发布按钮绑定 `click` 点击事件处理函数：

```html
<van-button type="default" :disabled="cmt.length === 0" @click="pubCmt">发布</van-button>
```

5. 在 `ArtCmt.vue` 组件中，定义名为 `pubCmt` 的点击事件处理函数：

```js
// 点击了发布评论的按钮
pubCmt() {
  console.log(this.cmt)
}
```

6. 在 `ArtCmt.vue` 组件中，进一步改造 `hideBox2` 方法，将隐藏第二个评论区域的代码放到 `setTimeout` 延时器中：

```js
// 隐藏第二个评论区域
hideBox2() {
  // 当文本框失去焦点时，延迟 100ms 再隐藏第二个评论区域
  // 目的：让发布评论的按钮能正常响应用户的点击事件
  setTimeout(() => {
    // 隐藏第二个评论区域
    this.isShowBox1 = true
    // 清空用户输入的评论内容
    this.cmt = ''
  }, 100)
},
```

### 9.5.6 实现发布评论的功能

1. 在 `articleAPI.js` 模块中，定义名为 `pubCommentAPI` 的方法：

```js
// 发表评论的 API（形参中的 artId 是文章的 id；content 是评论的内容）
export const pubCommentAPI = (artId, content) => {
  return request.post('/v1_0/comments', {
    target: artId,
    content
  })
}
```

2. 在 `ArtCmt.vue` 组件中，按需导入发布评论的 `API` 接口：

```js
// 按需导入 API
import { getCmtListAPI, addLikeCmtAPI, delLikeCmtAPI, pubCommentAPI } from '@/api/articleAPI.js'
```

3. 在 `ArtCmt.vue` 组件中，进一步改造 `pubCmt` 方法：

```js
// 点击了发布评论的按钮
async pubCmt() {
  // 调用 API 接口
  const { data: res } = await pubCommentAPI(this.artId, this.cmt)
  if (res.message === 'OK') {
    // 评论数自增 +1
    this.cmtCount += 1
    // 将接口返回的、最新的评论内容，unshift 追加到 cmtlist 中
    this.cmtlist.unshift(res.data.new_obj)
    // 提示用户发表评论成功
    this.$toast.success('发表评论成功')
  }
}
```

4. 动态给响应回来的数据添加 `is_liking` 属性：

```js
// 点击了发布评论的按钮
async pubCmt() {
  // 调用 API 接口
  const { data: res } = await pubCommentAPI(this.artId, this.cmt)
  if (res.message === 'OK') {
    this.cmtCount += 1
    // 动态给响应回来的数据添加 is_liking 属性
    res.data.new_obj.is_liking = false
    this.cmtlist.unshift(res.data.new_obj)
    this.$toast.success('发表评论成功')
  }
}
```

## 9.6 平滑滚动到评论列表区域

1. 运行如下的命令，安装 `popmotion` 这个依赖包：

```bash
npm install popmotion@9.3.5 -S
```

2. 在 `ArtCmt.vue` 组件中，从 `popmotion` 中按需导入 `animate` 函数：

```js
// 从 popmotion 中按需导入 animate 动画函数
import { animate } from 'popmotion'
```

3. 在 `ArtCmt.vue` 组件中，为 `name="comment-o"` 的 `<van-icon>` 组件绑定点击事件处理函数：

```html
<van-icon name="comment-o" size="20" @click="scrollToCmtList" />
```

4. 在 `ArtCmt.vue` 组件的 `methods` 节点下声明 `scrollToCmtList` 方法：

```js
// 滚动到评论的列表区域
scrollToCmtList() {
  // 1. 当前滚动条的位置
  const now = window.scrollY
  // 2. 目标位置（文章信息区域的高度）
  const dist = document.querySelector('.article-container').offsetHeight

  // 3. 实现滚动动画
  animate({
    from: now, // 当前的位置
    to: dist,  // 目标位置
    onUpdate: latest => window.scrollTo(0, latest)
  })
}
```

## 9.7 分支的合并与提交

1. 将修改过后的文件加入暂存区，并进行本地的 `commit` 提交：

```bash
git add .
git commit -m "完成了文章评论的功能"
```

2. 将本地的 `art-cmt` 分支首次推送到 `Gitee` 仓库中：

```bash
git push -u origin art-cmt
```

3. 将本地的 `art-cmt` 分支合并到本地的 `master` 主分支，并推送 `master` 分支到 `Gitee` 仓库：

```bash
git checkout master
git merge art-cmt
git push
```

4. 删除本地的 `art-cmt` 子分支：

```bash
git branch -d art-cmt
```

5. 基于 `master` 主分支，新建 `user` 分支，准备开发个人中心相关的功能：

```bash
git checkout -b user
```
