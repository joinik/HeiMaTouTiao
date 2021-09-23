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

```vue
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

## 6.3 实现新增频道的功能

### 6.3.1 初步实现新增频道的功能

### 6.3.2 将频道数据存储到数据库

### 6.3.3 提示用户更新成功

## 6.4 实现删除频道的功能

### 6.4.1 控制删除的状态

### 6.4.2 渲染删除的图标

### 6.4.3 实现删除的功能

### 6.4.4 优化删除的功能

## 6.5 弹出层关闭时重置编辑的状态

## 6.6 实现频道的点击联动效果

## 6.7 分支的合并与提交
