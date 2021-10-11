# 6.频道管理

## 6.1 渲染频道管理的 DOM 结构

> 基于 Vant 提供的 [Popup 弹出层](https://vant-contrib.gitee.io/vant/#/zh-CN/popup)组件，可以方便地实现频道管理的弹出层效果

### 6.1.1 初步渲染频道管理的 DOM 结构

1. 在`/src/views/Home/Home.vue` 组件中，在频道管理的小图标下面，基于 `<van-popup>` 渲染出频道管理的弹出层：

```vue
<!-- 频道管理的小图标 -->
<van-icon name="plus" size="16" class="plus" @click="show = true" />

<!-- 频道管理的弹出层 -->
<van-popup v-model="show">内容</van-popup>
```

2. 在 `Home.vue` 组件的 `data` 中定义布尔值 `show`，用来控制弹出层的显示与隐藏：

```js
data() {
  return {
    // 省略其它数据项...

    // 控制频道管理弹出层的展示与隐藏
    show: false
  }
}
```

3. 在点击频道管理的小图标时，将 `show` 设置为 `true`，从而展示出频道管理的弹出层：

```vue
<!-- 频道管理的小图标 -->
<van-icon name="plus" size="16" class="plus" @click="show = true" />
```

4. 为 `<van-popup>` 组件绑定 `:close-on-click-overlay="false"` 属性，从而防止点击遮罩层时，弹出层自动关闭的效果：

```vue
<!-- 频道管理的弹出层 -->
<van-popup v-model="show" :close-on-click-overlay="false">内容</van-popup>
```

### 6.1.2 实现频道管理的基础布局

1. 在 `Home.vue` 组件中，对 `<van-popup>` 组件的内容节点进行改造，将以下的 DOM 结构替换到 `<van-popup>` 组件的内容节点之中：

```html
<div class="popup-container">
  <!-- 弹出层的头部区域 -->
  <van-nav-bar title="频道管理">
    <template #right>
      <van-icon name="cross" size="14" color="white" @click="show = false" />
    </template>
  </van-nav-bar>

  <!-- 弹出层的主体区域 -->
  <div class="pop-body">
    <!-- 我的频道 -->
    <div class="my-channel-box">
      <div class="channel-title">
        <div>
          <span class="title-bold">已添加频道：</span>
          <span class="title-gray">点击进入频道</span>
        </div>
        <span class="btn-edit">编辑</span>
      </div>
      <!-- 我的频道列表 -->
      <van-row type="flex">
        <van-col span="6" v-for="item in userChannel" :key="item.id">
          <!-- 用户的频道 Item 项 -->
          <div class="channel-item van-hairline--surround">{{item.name}}</div>
        </van-col>
      </van-row>
    </div>

    <!-- 分隔线 -->
    <div class="van-hairline--top sp-line"></div>

    <!-- 更多频道 -->
    <div class="more-channel-box">
      <div class="channel-title">
        <div>
          <span class="title-bold">可添加频道：</span>
          <span class="title-gray">点击添加频道</span>
        </div>
      </div>
      <!-- 更多频道列表 -->
      <van-row type="flex">
        <van-col span="6" v-for="item in userChannel" :key="item.id">
          <div class="channel-item van-hairline--surround">{{item.name}}</div>
        </van-col>
      </van-row>
    </div>
  </div>
</div>
```

2. 对上述的 DOM 布局结构进行样式上的美化：

```css
.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.popup-container {
  display: flex;
  flex-direction: column;
}

.pop-body {
  flex: 1;
  overflow: scroll;
  padding: 8px;
  background-color: white;
}

.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 28px;
    padding: 0 6px;
    .title-bold {
      font-weight: bold;
    }
    .title-gray {
      color: gray;
      font-size: 12px;
    }
  }
}

.btn-edit {
  border: 1px solid #a3a2a2;
  padding: 0 10px;
  line-height: 20px;
  height: 20px;
  border-radius: 6px;
  font-size: 12px;
}

.channel-item {
  font-size: 12px;
  text-align: center;
  line-height: 36px;
  background-color: #fafafa;
  margin: 6px;
}

.cross-badge {
  position: absolute;
  right: -3px;
  top: 0;
  border: none;
}

.sp-line {
  margin: 10px 0 20px 0;
}
```

## 6.2 动态计算更多频道的列表数据

> 后台没有提供直接获取**更多频道**的 API 接口，需要程序员动态地进行计算：
> 更多频道 = 所有频道 - 我的频道
> 此时，需要先获取到所有频道地列表数据，再使用**计算属性**动态地进行筛选即可

### 6.2.1 请求所有频道的列表数据

1. 在 `/src/api/homeAPI.js`模块中，定义名为 `getAllChannelAPI` 的方法，用来请求所有频道列表的数据：

```js
// 获取所有频道数据的 API
export const getAllChannelAPI = () => {
  return request.get('/v1_0/channels')
}
```

2. 在 `Home.vue` 组件中，按需导入 `getAllChannelAPI` 方法：

```js
// 按需导入 API 接口
import { getUserChannelAPI, getAllChannelAPI } from '@/api/homeAPI'
```

3. 在 `Home.vue` 组件中，定义名为 `allChannel` 的数组，用来存放所有频道的列表数据：

```js
data() {
  return {
    // 省略其它的数据项...

    // 所有的频道列表数据
    allChannel: []
  }
}
```

4. 在 `Home.vue` 组件的 `methods` 节点下，声明 `initAllChannel` 方法：

```js
methods: {
  // 获取所有频道的列表数据
  async initAllChannel() {
    const { data: res } = await getAllChannelAPI()
    if (res.message === 'OK') {
      // 将请求到的数据，转存到 allChannel 中
      this.allChannel = res.data.channels
    }
  }
}
```

5. 在 `Home.vue` 组件的 `created` 生命周期函数中，调用 `initAllChannel` 方法：

```js
created() {
  // 请求用户的频道列表数据
  this.initUserChannel()

  // 请求所有的频道列表数据
  this.initAllChannel()
},
```

### 6.2.2 动态计算更多频道的数据

1. 在 Home.vue 组件的 computed 节点下，定义名为 moreChannels 的计算属性：

```js
computed: {
  // 更多频道的数据
  moreChannels() {
    // 1. 对数组进行 filter 过滤，返回的是符合条件的新数组
    return this.allChannel.filter(item => {
      // 判断当前循环项，是否在 “我的频道” 列表之中
      const index = this.userChannel.findIndex(x => x.id === item.id)
      // 如果不在，则 return true，表示需要把这一项存储到返回的新数组之中
      if (index === -1) return true
    })
  }
},
```

2. 修改更多频道列表的数据源：

```vue
<!-- 更多频道列表 -->
<van-row type="flex">
  <van-col span="6" v-for="item in moreChannels" :key="item.id">
    <div class="channel-item van-hairline--surround">{{item.name}}</div>
  </van-col>
</van-row>
```

## 6.3 实现新增频道的功能

### 6.3.1 初步实现新增频道的功能

1. 为“更多频道”下的 `item` 项绑定点击事件处理函数，将当前的频道信息作为参数，传递给 `addChannel` 方法：

```html
<!-- 更多频道列表 -->
<van-row type="flex">
  <van-col span="6" v-for="item in moreChannels" :key="item.id">
    <div class="channel-item van-hairline--surround" @click="addChannel(item)">{{item.name}}</div>
  </van-col>
</van-row>
```

2. 在 `Home.vue` 组件的 `methods` 节点下，声明 `addChannel` 处理函数：

```js
methods: {
  // 新增频道（形参 item 就是当前用户点击的频道信息对象）
  // 格式：{ id, name }
  addChannel(item) {
    // 将用户点击的频道，添加到“用户频道”列表中
    this.userChannel.push(item)
    // TODO：调用 API 接口，将最新的用户频道，存储到后台数据库中
  }
}
```

### 6.3.2 将频道数据存储到数据库

1. 在 `/src/api/homeAPI.js` 模块中，声明如下的 `API` 接口，用来将用户的频道列表数据提交到服务器保存：

```js
// 更新用户频道列表数据的 API
// 注意：形参 channels 是一个数组，格式： [ {id, seq} ]
export const updateUserChannelAPI = channels => {
  return request.put('/v1_0/user/channels', {
    channels
  })
}
```

2. 在 `Home.vue` 组件中，按需导入 `API` 接口：

```js
// 按需导入 API 接口
import { getUserChannelAPI, getAllChannelAPI, updateUserChannelAPI } from '@/api/homeAPI'
```

3. 在 Home.vue 组件的 methods 节点下，声明 updateChannel 方法，用来把最新的用户频道列表数据，提交到后端保存：

```js
methods: {
  // 把用户的频道列表数据提交到后端保存
  async updateChannel(item) {
    // 1. 准备要提交到服务器的数据
    const channels = this.userChannel
      .filter(item => item.name !== '推荐') // 将“推荐”从频道列表中过滤出去
      .map((item, index) => {               // 调用数组的 map 循环，最终返回一个处理好的新数组
        return {
          id: item.id,
          seq: index + 1
        }
      })

    // 2. 调用 API 接口
    const { data: res } = await updateUserChannelAPI(channels)
    if (res.message === 'OK') {
      // TODO：提示用户更新成功
    }
  }
}
```

4. 在 `Home.vue` 组件的 `addChannel` 方法中，调用上一步封装的 `updateChannel` 方法：

```js
methods: {
  // 新增频道（形参 item 就是当前用户点击的频道信息对象）
  // 格式：{ id, name }
  addChannel(item) {
    // 将用户点击的频道，添加到“用户频道”列表中
    this.userChannel.push(item)
    // 调用 updateChannel 方法，把最新的频道列表数据提交到后端保存
    this.updateChannel()
  },
}
```

### 6.3.3 提示用户更新成功

> 基于 Vant 的 [Notify 消息提示](https://vant-contrib.gitee.io/vant/#/zh-CN/notify)组件，可以实现顶部的消息通知

1. 在 `Home.vue` 组件的 `updateChannel` 方法中，调用 `this.$notify()` 方法，即可进行消息的提示：

```js
methods: {
  // 把用户的频道列表数据提交到后端保存
  async updateChannel(item) {
    // 1. 准备要提交到服务器的数据
    const channels = this.userChannel
      .filter(item => item.name !== '推荐') // 将“推荐”从频道列表中过滤出去
      .map((item, index) => {               // 调用数组的 map 循环，最终返回一个处理好的新数组
        return {
          id: item.id,
          seq: index + 1
        }
      })

    // 2. 调用 API 接口
    const { data: res } = await updateUserChannelAPI(channels)
    if (res.message === 'OK') {
      // 3. 通过 notify 弹框提示用户更新成功
      this.$notify({ type: 'success', message: '更新成功', duration: 1000 })
    }
  }
}
```

2. 为什么在 .vue 的组件中可以直接调用到 `this.$notify()` 方法，详情可以参考 Vant 的官方文档：[Notify 消息提示 - 全局方法](https://vant-contrib.gitee.io/vant/#/zh-CN/notify#quan-ju-fang-fa)

## 6.4 实现删除频道的功能

### 6.4.1 控制删除的状态

1. 在 `Home.vue 组件的 `data` 节点下声明布尔值 `isDel`，来控制当前是否处于删除的状态：

```js
data() {
  return {
    // 其它的数据节点...

    // 频道数据是否处于删除的状态
    isDel: false
  }
}
```

2. 点击编辑按钮的时候，切换 `isDel` 的状态：

```html
<span class="btn-edit" @click="isDel = !isDel">编辑</span>
```

3. 根据 `isDel` 的状态，动态渲染按钮的文本和提示的文本：

```html
<div class="channel-title">
  <div>
    <span class="title-bold">已添加频道：</span>
    <!-- 提示的文本 -->
    <span class="title-gray">{{ isDel ? '点击移除频道' : '点击进入频道' }}</span>
  </div>
  <!-- 按钮的文本 -->
  <span class="btn-edit" @click="isDel = !isDel">{{ isDel ? '完成' : '编辑' }}</span>
</div>
```

### 6.4.2 渲染删除的图标

1. 在 `Home.vue` 组件中，在用户的频道中渲染删除的小图标：

```html
<!-- 我的频道列表 -->
<van-row type="flex">
  <van-col span="6" v-for="item in userChannel" :key="item.id">
    <!-- 用户的频道 Item 项 -->
    <div class="channel-item van-hairline--surround">
      {{item.name}}
      <!-- 删除的图标 -->
      <van-badge color="transparent" class="cross-badge">
        <template #content>
          <van-icon name="cross" class="badge-icon" color="#cfcfcf" size="12" />
        </template>
      </van-badge>
    </div>
  </van-col>
</van-row>
```

2. 使用 `v-if` 控制图标的显示与隐藏：

```html
<!-- 删除的图标 -->
<van-badge color="transparent" class="cross-badge" v-if="isDel">
  <!-- 省略其它代码... -->
</van-badge>
```

### 6.4.3 实现删除的功能

::: danger 注意

* “推荐”这个频道不允许被删除
* 用户的频道列表中，至少要包含两个频道
:::

1. 为用户的频道 `Item` 项绑定点击事件处理函数，命名为 `onUserChannelClick`：

```html
<!-- 用户的频道 Item 项 -->
<div class="channel-item van-hairline--surround" @click="onUserChannelClick(item)"></div>
```

2. 在 `methods` 中声明 `onUserChannelClick` 方法：

```js
methods: {
  // 从用户频道列表中，移除指定 id 的频道
  onUserChannelClick(channel) {
    if (this.isDel) {
      // 处于删除状态
      // TODO1：从 userChannel 中移除指定的频道
      // TODO2：将更改过后的用户频道数据，提交到服务器保存
    } else {
      // 不处于删除状态
    }
  }
}
```

3. 实现删除频道的功能：

```js
methods: {
  // 从用户频道列表中，移除指定 id 的频道
  onUserChannelClick(channel) {
    if (this.isDel) {
      // 处于删除状态
      // TODO1：从 userChannel 中移除指定的频道
      this.userChannel = this.userChannel.filter(item => item.id !== channel.id)
      // TODO2：将更改过后的用户频道数据，提交到服务器保存
      this.updateChannel()
    } else {
      // 不处于删除状态
    }
  }
}
```

### 6.4.4 优化删除的功能

1. 如果频道的名字是“推荐”，则不渲染删除的小图标：

```html
<!-- 删除的图标 -->
<van-badge color="transparent" class="cross-badge" v-if="isDel && item.name !== '推荐'">
</van-badge>
```

2. 如果频道的名字是“推荐”，则点击频道的时候不执行删除的操作：

```js
// 从用户频道列表中，移除指定 id 的频道
removeChannel(channel) {
  if (this.isDel) {
    // 处于删除状态
    // 判断用户点击的是否为“推荐”
    if (channel.name === '推荐') return

    // 移除频道
    this.userChannel = this.userChannel.filter(item => item.id !== channel.id)
    this.updateChannel()
  } else {
    // 不处于删除状态
  }
}
```

3. 如果`userChannel`数组中仅剩下两个频道，则不渲染删除的小图标：

```html
<!-- 删除的图标 -->
<van-badge color="transparent" class="cross-badge" v-if="isDel && item.name !== '推荐' && userChannel.length > 2"></van-badge>
```

4. 如果`userChannel`数组中仅剩下两个频道，则点击频道的时候不执行删除的操作：

```js
// 从用户频道列表中，移除指定 id 的频道
removeChannel(channel) {
  if (this.isDel) {
    // 处于删除状态
    // 判断用户点击的是否为“推荐” 或 仅剩下两个频道
    if (channel.name === '推荐' || this.userChannel.length === 2) return

    // 移除频道
    this.userChannel = this.userChannel.filter(item => item.id !== channel.id)
    this.updateChannel()
  } else {
    // 不处于删除状态
  }
}
```

## 6.5 弹出层关闭时重置编辑的状态

1. 监听 `<van-popup>` 弹出层关闭完成时的 `closed` 事件，直接将 `isDel` 设置为 `false` 即可：

```html
<!-- 监听 closed 事件 -->
<van-popup v-model="show" :close-on-click-overlay="false" @closed="isDel = false"></van-popup>
```

## 6.6 实现频道的点击联动效果

1. 在点击用户频道的 `Item` 项时，把索引值传递到点击事件的处理函数中：

```html
<!-- 我的频道列表 -->
<van-row type="flex">
  <!-- 1. 在进行 v-for 循环时，接收索引 index -->
  <van-col span="6" v-for="(item, index) in userChannel" :key="item.id">
    <!-- 2. 点击用户频道的 Item 项时，将索引 index 作为参数，传递给 onUserChannelClick 方法 -->
    <div class="channel-item van-hairline--surround" @click="onUserChannelClick(item, index)">
      {{item.name}}
      <!-- 删除的图标 -->
    </div>
  </van-col>
</van-row>
```

2. 改造 `onUserChannelClick` 方法，通过形参 `index` 接收点击项的索引值：

```js
// 从用户频道列表中，移除指定 id 的频道
onUserChannelClick(channel, index) {
  if (this.isDel) {
    // 处于删除状态

    if (channel.name === '推荐' || this.userChannel.length === 2) return
    // 进行数组的过滤
    this.userChannel = this.userChannel.filter(item => item.id !== channel.id)
    // 将更改过后的用户频道数据，提交到服务器保存
    this.updateChannel()
  } else {
    // 不处于删除状态

    // 1. 修改 Tabs 的激活项的索引值
    this.active = index
    // 2. 关闭 popup 弹出层
    this.show = false
  }
},
```

## 6.7 分支的合并与提交

1. 将修改过后的文件加入暂存区，并进行本地的 `commit` 提交：

```bash
git add .
git commit -m "实现了频道管理"
```

2. 将本地的 channel 分支首次推送到 `Gitee` 仓库中：

```bash
git push -u origin channel
```

3. 将本地的 `channel` 分支合并到本地的 `master` 主分支，并推送 `master` 分支到 `Gitee` 仓库：

```bash
git checkout master
git merge channel
git push
```

4. 删除本地的 `channel` 子分支：

```bash
git branch -d channel
```

5. 基于 `master` 主分支，新建 `search` 分支，准备开发文章搜索相关的功能：

```bash
git checkout -b search
```