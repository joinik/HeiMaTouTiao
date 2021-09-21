# 主页布局

## 3.1 基于路由渲染Main主页组件

1. 在`src/views`目录下新建`Main`文件夹，并在其下新建`Main.vue`主页组件：

```vue
<template>
  <div>Main.vue 主页</div>
</template>

<script>
export default {
  name: 'Main'
}
</script>

<style lang="less" scoped></style>
```

2. 在`/src/router/index.js` 路由模块中，导入 `Main.vue`组件：

```js
import Main from '@/views/Main/Main.vue'
```

3. 在`routes`数组中，创建`Main.vue`组件对应的路由规则：

```js
const routes = [
  // 登录的路由规则
  { path: '/login', component: Login, name: 'login' },
  // 主页的路由规则
  { path: '/', component: Main }
]
```

## 3.2 渲染主页底部的TabBar

> 基于 Vant 的 [Tabbar](https://vant-contrib.gitee.io/vant/#/zh-CN/tabbar) 标签栏组件，可以轻松实现底部 tabbar 的效果

1. 渲染基本的tabbar效果

```vue
<template>
  <div>
    <!-- 底部的 TabBar -->
    <van-tabbar>
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
```

2. 为底部的tabbar开启路由跳转功能

```vue
<template>
  <div>
    <!-- 底部的 TabBar -->
    <!-- route 属性：是否开启路由模式 -->
    <van-tabbar route>
      <!-- to 属性：点击后要跳转到的路由地址 -->
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

```

## 3.3 基于路由渲染 Home 和 User 组件

1. 将资料目录下的`toutiao_logo.png`图片拷贝到项目`/src/assets`资源目录之中。
2. 在`/src/views` 目录下新建Home文件夹，并在其下新建`Home.vue`组件：

```vue
<template>
  <div class="home-container">
    <!-- 头部区域 -->
    <van-nav-bar fixed>
      <!-- 左侧的插槽 -->
      <template #left>
        <img src="../../assets/toutiao_logo.png" alt="logo" class="logo" />
      </template>
      <!-- 右侧的插槽 -->
      <template #right>
        <van-icon name="search" color="white" size="18" />
      </template>
    </van-nav-bar>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style lang="less" scoped>
// 组件外层容器的样式
.home-container {
  padding-top: 46px;
  padding-bottom: 50px;
}
// logo 样式
.logo {
  height: 80%;
}
</style>
```

3. 在`/src/views` 目录下新建 `User` 文件夹，并在其下新建 `User.vue` 组件：

```vue
<template>
  <div>User 页面</div>
</template>

<script>
export default {
  name: 'User'
}
</script>

<style lang="less" scoped></style>
```

4. 在`/src/router/index.js`路由模块中，导入刚才新建的`Home.vue`和`User.vue`组件：

```js
import Home from '@/views/Home/Home.vue'
import User from '@/views/User/User.vue'
```

5. 在`routes`路由规则数组中，找到`主页Main.vue`对应的路由规则，遇到`children`数组声明嵌套的子路由规则：

```js
const routes = [
  // 带有 name 名称的路由规则，叫做“命名路由”
  { path: '/login', component: Login, name: 'login' },
  {
    path: '/',
    component: Main,
    children: [
      // path 为"空字符串"的子路由规则，叫做"默认子路由"
      { path: '', component: Home, name: 'home' },
      { path: '/user', component: User, name: 'user' }
    ]
  }
]
```

6. 在`Main.vue`组件的模板结构中，通过`router-view`声明Home和User的路由占位符：

```vue
<template>
  <div>
    <!-- Home 和 User 的路由占位符 -->
    <router-view></router-view>

    <!-- 底部的 TabBar -->
    <van-tabbar route>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
```

## 3.4 渲染频道列表的基本结构

> 基于 Vant 的[Tab标签页](https://vant-contrib.gitee.io/vant/#/zh-CN/tab)组件，可以方便的渲染出频道列表的基本结构。

### 3.4.1 实现频道列表的基础布局

1. 在`/src/views/Home/Home.vue`组件的模板结构中，声明如下的DOM结构

```vue
<!-- 频道列表的标签页 -->
<van-tabs v-model="active">
  <van-tab title="标签 1">内容 1</van-tab>
  <van-tab title="标签 2">内容 2</van-tab>
  <van-tab title="标签 3">内容 3</van-tab>
  <van-tab title="标签 4">内容 4</van-tab>
  <van-tab title="标签 5">内容 5</van-tab>
  <van-tab title="标签 6">内容 6</van-tab>
  <van-tab title="标签 7">内容 7</van-tab>
  <van-tab title="标签 8">内容 8</van-tab>
</van-tabs>
```

2. 在`Home.vue`组件的data中，声明标签页激活项的索引`active`：

```js
export default {
  name: 'Home',
  data() {
    return {
      // 标签页激活项的索引
      active: 0
    }
  }
}
```

3. 在`/src/cover.less`中，通过主题定制的方式，修改激活项的颜色值：

```js
// Tab
@tabs-bottom-bar-color: @blue;
```

### 3.4.2 实现频道列表的吸顶效果

1. 为 `<van-tabs>` 组件添加 `sticky `属性，即可在页面纵向滚动时，实现频道列表的吸顶效果：

```vue
<van-tabs v-model="active" sticky>
  <!-- 省略其它代码 -->
</van-tabs>
```

2. 为 `<van-tabs>` 组件添加 `offset-top` 属性，即可设置吸顶的距离：

```vue
<van-tabs v-model="active" sticky offset-top="46px">
  <!-- 省略其它代码 -->
</van-tabs>
```

3. 通过翻阅 van-tabs 组件的官方文档，发现 `offset-top` 属性值还支持 rem 的单位。因此，我们可以把 46px 换算成 rem 之后，赋值给` offset-top`。换算的过程如下：

```text
iphone6

375 px = 10 rem
1   px = 10/375  rem
46  px = 460/375 rem
46  px ≈ 1.22666667rem
```

4. 经过换算之后，最终只需将 `offset-top` 的值设置为 1.22666667rem 即可实现不同屏幕的适配：

```vue
<van-tabs v-model="active" sticky offset-top="1.22666667rem">
  <!-- 省略其它代码 -->
</van-tabs>
```

### 3.4.3 渲染频道管理的小图标

1. 审查元素的样式，为 tabs 容器设置右 padding，预留出频道管理小图标的位置：

```css
// 为 tabs 容器设置右 padding
/deep/ .van-tabs__wrap {
  padding-right: 36px;
  background-color: white;
}
```

2. 和 `<van-tabs>` 平级，渲染频道管理的 `<van-icon>` 图标：

```vue
<!-- 频道列表的标签页 -->
<van-tabs v-model="active" sticky offset-top="1.22666667rem"></van-tabs>

<!-- 频道管理的小图标 -->
<van-icon name="plus" size="16" class="plus" />
```

3. 通过自定义的 plus 类名，设置小图标的定位：

```css
// 频道管理小图标的定位
.plus {
  position: fixed;
  top: 58px;
  right: 10px;
  z-index: 999;
}
```