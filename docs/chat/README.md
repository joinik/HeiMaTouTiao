# 11.小思同学

## 11.1 认识websocked

### 11.1.1 什么是 websocket

和 http 协议类似，websocket 也是是一个网络通信协议，是用来满足前后端数据通信的。

### 11.1.2 websocket 相比于 HTTP 的优势

HTTP 协议：客户端与服务器建立通信连接之后，服务器端只能被动地响应客户端的请求，无法主动给客户端发送消息。

websocket 协议：客户端与服务器建立通信连接之后，服务器端可以主动给客户端推送消息了！！！

### 11.1.3 websocket 主要的应用场景

需要服务端主动向客户端发送数据的场景，比如我们现在要做的智能聊天

### 11.1.4 HTTP 协议和 websocket 协议对比图

![11-1.01881d8f](./images/11-1.01881d8f.png)

## 11.2 渲染聊天页面的基础布局

### 11.2.1 渲染小思同学的页面

1. 在 `/src/views/Chat` 目录下新建 `Chat.vue` 组件：

```vue
<template>
  <div class="container">
    <!-- 固定导航 -->
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小思同学"></van-nav-bar>

    <!-- 聊天主体区域 -->
    <div class="chat-list">
      <div>
        <!-- 左侧是机器人小思 -->
        <div class="chat-item left">
          <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
          <div class="chat-pao">hi，你好！我是小思</div>
        </div>

        <!-- 右侧是当前用户 -->
        <div class="chat-item right">
          <div class="chat-pao">我是编程小王子</div>
          <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
        </div>
      </div>
    </div>

    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="word" placeholder="说点什么...">
        <template #button>
          <span @click="send()" style="font-size:12px;color:#999">提交</span>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Chat',
  data() {
    return {
      // 用户输入的聊天内容
      word: ''
    }
  },
  methods: {
    // 提交按钮的点击事件处理函数
    send() {
      // 如果输入的聊天内容为空，则 return 出去
      if (!this.word) return

      // 打印输出用户填写的聊天内容
      console.log(this.word)
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: '';
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
```

2. 在 `/src/router/index.js` 路由模块中，导入 `Chat.vue` 组件并声明小思聊天的路由规则：

```js
// 导入小思同学的组件页面
import Chat from '@/views/Chat/Chat.vue'

const routes = [
  // 小思聊天的路由规则
  { path: '/chat', component: Chat, name: 'chat' }
]
```

3. 在 `/src/views/User/User.vue` 组件中，为小思同学对应的 `van-cell` 组件添加 `to` 属性：

```html
<van-cell icon="chat-o" title="小思同学" is-link to="/chat" />
```

### 11.2.2 动态渲染聊天消息

1. 在 `data` 中声明 `list` 数组，用来存放机器人和用户的聊天消息：

```js
data() {
  return {
    // 用户填写的内容
    word: '',
    // 所有的聊天消息
    list: [
      // 1. 只根据 name 属性，即可判断出这个消息应该渲染到左侧还是右侧
      { name: 'xs', msg: 'hi，你好！我是小思' },
      { name: 'me', msg: '我是编程小王子' }
    ]
  }
},
```

2. 基于 `v-for` 指令，动态渲染聊天消息的 `DOM` 结构：

```html
<!-- 聊天主体区域 -->
<div class="chat-list">
  <div v-for="(item, index) in list" :key="index">
    <!-- 左侧是机器人小思 -->
    <div class="chat-item left" v-if="item.name === 'xs'">
      <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
      <div class="chat-pao">{{item.msg}}</div>
    </div>

    <!-- 右侧是当前用户 -->
    <div class="chat-item right" v-else>
      <div class="chat-pao">{{item.msg}}</div>
      <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
    </div>
  </div>
</div>
```

### 11.2.3 动态渲染用户头像

1. 在 `/src/store/index.js` 的 `vuex` 模块中，定义名为 `userAvatar` 的 `getter` 节点：

```js
getters: {
  // 用户头像的计算属性
  userAvatar(state) {
    // 默认的头像地址
    let imgSrc = 'https://img.yzcdn.cn/vant/cat.jpeg'

    // 如果用户信息对象中包含 photo 属性的值，则为 imgSrc 重新赋值
    if (state.userInfo.photo) {
      imgSrc = state.userInfo.photo
    }

    return imgSrc
  }
}
```

2. 在 `Chat.vue` 组件中按需导入 `mapGetters` 辅助函数：

```js
// 按需导入辅助函数
import { mapGetters } from 'vuex'
```

3. 在 `Chat.vue` 组件的 `computed` 节点下调用 `mapGetters` 辅助函数，把 `userAvatar` 映射到当前组件中使用：

```js
computed: {
  ...mapGetters(['userAvatar'])
}
```

4. 动态渲染用户的头像：

```html
<!-- 右侧是当前用户 -->
<div class="chat-item right" v-else>
  <div class="chat-pao">我是编程小王子</div>
  <van-image fit="cover" round :src="userAvatar" />
</div>
```

## 11.3 向 list 数组中追加消息

1. 点击提交按钮时，把用户填写的消息内容存储到 `list` 数组中：

```js
// 提交按钮的点击事件处理函数
send() {
  // 如果输入的聊天内容为空，则 return 出去
  if (!this.word) return

  // 1. 将用户填写的消息存储到 list 数组中
  this.list.push({ name: 'me', msg: this.word })
  // 2. 清空文本框中的消息内容
  this.word = ''
}
```

2. 测试无误之后，将 `list` 数组中的“假数据”清空：

```js
data() {
  return {
    // 所有的聊天消息
    list: []
  }
}
```

## 11.4 socket.io-client 的基本使用

> 参考 [socket.io-client](https://socket.io/docs/v4/client-initialization/)的官方文档进行配置和使用

### 11.4.1 安装和配置 socket.io-client

1. 在项目中运行如下的命令，安装 `websocket` 客户端相关的包

```bash
npm i socket.io-client@4.0.0 -S

# 如果 npm 无法成功安装 socket.io-client，可以尝试用 yarn 来装包
# yarn add socket.io-client@4.0.0
```

2. 在 `Chat.vue` 组件中，从 `socket.io-client` 模块内按需导入 `io` 方法：

```js
// 按需导入 io 方法：调用 io('url') 方法，即可创建 websocket 连接的实例
import { io } from 'socket.io-client'
```

3. 事先定义变量 `socket`，用来接收 `io()`方法创建的 `socket` 实例：

```js
let socket = null
```

### 11.4.2 创建和销毁 socket 实例

1. 在 Chat.vue 组件的 created 生命周期函数中，创建 websocket 实例对象：

```js
created() {
  // 创建客户端 websocket 的实例
  socket = io('ws://www.liulongbin.top:9999')
}
```

2. 在 Chat.vue 组件的 beforeDestroy 生命周期函数中，关闭 websocket 连接并销毁 websocket 实例对象：

```js
// 组件被销毁之前，清空 sock 对象
beforeDestroy() {
  // 关闭连接
  socket.close()

  // 销毁 websocket 实例对象
  socket = null
}
```

### 11.4.3 监听连接的建立和关闭

1. 在 `Chat.vue` 组件的 `created` 生命周期函数中，调用 `socket.on('connect', fn)` 方法，可以监听到 `socket` 连接成功的事件：

```js
// 建立连接的事件
socket.on('connect', () => console.log('connect: websocket 连接成功！'))
```

2. 在 `Chat.vue` 组件的 `created` 生命周期函数中，调用 `socket.on('disconnect', fn)` 方法，可以监听到 `socket` 连接关闭的事件：

```js
// 关闭连接的事件
socket.on('disconnect', () => console.log('disconnect: websocket 连接关闭！'))
```

### 11.4.4 接收服务器发送的消息

1. 在 `Chat.vue` 组件的 `created` 生命周期函数中，调用 `socket.on('message', fn)` 方法，即可监听到服务器发送到客户端的消息：

```js
// 接收到消息的事件
socket.on('message', msg => console.log(msg))
```

2. 将服务器发送到客户端的消息，存储到 `Chat.vue` 组件的 `list` 数组中：

```js
// 接收到消息的事件
socket.on('message', msg => {
  // 把服务器发送过来的消息，存储到 list 数组中
  this.list.push({ name: 'xs', msg })
})
```

### 11.4.5 向服务器发送消息

1. 客户端调用 socket.emit('send', '消息内容') 方法，即可向 websocket 服务器发送消息：

```js
// 提交按钮的点击事件处理函数
send() {
  // 如果输入的聊天内容为空，则 return 出去
  if (!this.word) return

  // 向服务器发送消息
  socket.emit('send', this.word)
  // 将用户填写的消息存储到 list 数组中
  this.list.push({ name: 'me', msg: this.word })
  // 清空文本框中的消息内容
  this.word = ''
}
```

## 11.5 自动滚动到底部

> 使用 [Element.scrollIntoView()](https://developer.mozilla.org/zh-CN/docs/web/api/element/scrollintoview) 方法可以轻松实现滚动到底部的操作

1. 在 `methods` 中声明 `scrollToBottom` 方法：

```js
// 滚动到页面底部
scrollToBottom() {
  // 1. 获取到所有的聊天 Item 项
  const chatItem = document.querySelectorAll('.chat-item')
  // 2. 获取到最后一项对应的 DOM 元素
  const lastItem = chatItem[chatItem.length - 1]

  // 3. 滚动元素的父容器，使被调用 scrollIntoView() 的元素对用户可见
  lastItem.scrollIntoView({
    behavior: 'smooth',
    // 定义垂直方向的对齐（end 表示元素的底端将和其所在滚动区的可视区域的底端对齐）
    block: 'end'
  })
}
```

2. 在 `Chat.vue` 组件中定义 `watch` 侦听器，监视 `list` 数组的变化，从而自动滚动到页面底部：

```js
watch: {
  list() {
    // 监视到 list 数据变化后，等 DOM 更新完毕，再执行滚动到底部的操作
    this.$nextTick(() => {
      this.scrollToBottom()
    })
  }
}
```

## 11.6 分支的合并与提交

1. 将修改过后的文件加入暂存区，并进行本地的 `commit` 提交：

```bash
git add .
git commit -m "完成了聊天功能"
```

2. 将本地的 `chat` 分支首次推送到 `Gitee` 仓库中：

```bash
git push -u origin chat
```

3. 将本地的 `chat`分支合并到本地的 `master` 主分支，并推送 `master` 分支到 `Gitee` 仓库：

```bash
git checkout master
git merge chat
git push
```

4. 删除本地的 `chat` 子分支：

```bash
git branch -d chat
```

5. 基于 `master` 主分支，新建 `router-ctrl` 分支，准备处理页面权限的控制：

```bash
git checkout -b router-ctrl
```
