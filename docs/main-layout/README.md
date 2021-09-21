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
``
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