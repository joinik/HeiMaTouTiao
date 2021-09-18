# 2.登录功能

## 2.1 使用路由渲染登录组件

1. 在`/src/views`目录之下，创建Login文件夹，并在其下新建Login.vue登录组件，初始化组件的基本结构如下:

```vue
<template>
  <div>登录组件</div>
</template>

<script>
export default {
  // name 是当前组件的名称（建议为每个组件都指定唯一的 name 名称）
  name: 'Login'
}
</script>

<style lang="less" scoped></style>
```

2. 在`/src/router/index.js`路由模块中，导入需要通过路由渲染的login.vue登录组件:

```js
// 导入需要的路由组件
import Login from '@/views/Login/Login.vue'
```

3. 在路由模块的routes数组中，声明登录组件的路由规则如下:

```js
const routes = [
  // 带有 name 名称的路由规则，叫做“命名路由”
  { path: '/login', component: Login, name: 'login' }
]
```

4. 在App.vue根组件中声明路由占位符，当用户访问`http://localhost:8080/#/login`地址的时候，会渲染出登录组件:

```vue
<template>
  <div>
    <!-- 路由占位符 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less" scoped></style>
```

## 2.2 渲染登录组件的头部区域

::: tip
**基于 Vant 的** [NavBar 导航栏](https://vant-contrib.gitee.io/vant/#/zh-CN/nav-bar) **组件，渲染登录组件的头部区域**
:::

1. 渲染登录组件的header头部区域:

```html
<template>
  <div>
    <!-- NavBar 组件：只需提供 title 标题 -->
    <van-nav-bar title="黑马头条 - 登录" />
  </div>
</template>
```

2. 为 `<van-nav-bar>` 组件添加 `fixed`属性，实现顶部固定定位的效果:

```html
<van-nav-bar title="黑马头条 - 登录" fixed />
```

3. 为`Login.vue`组件最外层的`div`元素添加名为`login-container`的类名，防止`<van-nav-bar>`组件遮挡其他元素:

```html
<template>
  <div class="login-container">
    <!-- NavBar 组件：只需提供 title 标题 -->
    <van-nav-bar title="黑马头条 - 登录" fixed />
  </div>
</template>
```

4. 在`Login.vue`组件的`style`节点中声明如下的类名:

```css
.login-container {
  padding-top: 46px;
}
```

## 2.3 覆盖NavBar组件的默认样式

::: tip
3 种实现方案：

 1. 定义**全局样式表**，通过审查元素的方式，找到对应的 class 类名后，进行样式的覆盖操作。
 2. 通过**定制主题**的方式，直接覆盖 vant 组件库中的 less 变量；
 3. 通过**定制主题**的方式，自定义 less 主题文件，基于文件的方式覆盖默认的 less 变量；

 参考地址：[https://vant-contrib.gitee.io/vant/#/zh-CN/theme](https://vant-contrib.gitee.io/vant/#/zh-CN/theme)
:::

### 方案 1：全局样式表 - 普通程序员的万能招式、

1. 在 src 目录下新建 index.less 全局样式表，通过审查元素的方式找到对应的 class 类名，进行样式的覆盖：

```less
// 覆盖 NavBar 组件的默认样式
.van-nav-bar {
  background-color: #007bff;
  .van-nav-bar__title {
    color: white;
    font-size: 16px;
  }
}
```

2. 在 main.js 中导入全局样式表即可：

```js
// 导入 Vant 和 组件的样式表
import Vant from 'vant'
import 'vant/lib/index.css'

// 导入全局样式表
+ import './index.less'

// 注册全局插件
Vue.use(Vant)
```

### 方案 2：定制主题 - 直接覆盖变量

1. 修改`main.js`中导入vant样式的代码，把`.css`的后缀名改为`.less`后缀名:

```js
import Vant from 'vant'

// 这里要把 .css 后缀名改为 .less
import 'vant/lib/index.less'
```

2. 在项目根目录下新建 `vue.config.js` 配置文件:

```js
module.exports = {
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // 直接覆盖变量，注意：变量名之前不需要加 @ 符号
          'nav-bar-background-color': '#007bff',
          'nav-bar-title-text-color': 'white',
          'nav-bar-title-font-size': '14px'
        }
      }
    }
  }
}
```

3. 配置完毕之后，**一定要重启打包的服务器** , 重新加载项目的配置项！

::: tip
直接覆盖变量值的缺点: 每次修改了变量的值， 都需要重新启动打包的服务器， 非常麻烦！ 不推荐大家采用这种方式定制主题
:::

### 方案 3：定制主题 - 基于 less 文件

1. 修改`main.js`中导入vant样式的代码， 把`.css`的后缀名改为`.less`后缀名：

```js
// 导入 Vant 和 组件的样式表
import Vant from 'vant'
// 这里要把 .css 后缀名改为 .less
import 'vant/lib/index.less'
```

2. 在`src`目录下新建`cover.less`主题文件，用来覆盖vant默认主题中的less变量：

```less
@blue: #007bff;
@white: white;
@font-14: 14px;

// NavBar
@nav-bar-background-color: @blue;
@nav-bar-title-text-color: @white;
@nav-bar-title-font-size: @font-14;
```

3. 在项目根目录下新建`vue.config.js`配置文件：

```js
const path = require('path')

// 自定义主题的文件路径
const coverPath = path.join(__dirname, './src/cover.less')

module.exports = {
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // 通过 less 文件覆盖（文件路径为绝对路径）
          hack: `true; @import "${coverPath}";`
        }
      }
    }
  }
}
```

::: warning
注意：初次配置完毕之后，一定要重启打包的服务器！今后，在修改了 cover.less 中的变量后，不再需要重启打包的服务器。
:::

## 2.4 登录功能

### 2.4.1 渲染登录的表单

1. 在`Login.vue`组件的`script`节点中，声明如下的`data`数据：

```js
export default {
  name: 'Login',
  data() {
    return {
      // 登录表单的数据，最终要双向绑定到 form 这个数据对象上
      form: {
        // 用户的手机号
        mobile: '',
        // 登录的密码
        code: ''
      }
    }
  }
}
```

2. 在`Login.vue`组件的模板结构中定义如下的DOM结构:

```js
<!-- 登录的表单 -->
<van-form>
  <van-field v-model="form.mobile" type="tel" label="手机号码" placeholder="请输入手机号码" required></van-field>
  <van-field v-model="form.code" type="password" label="登录密码" placeholder="请输入登录密码" required></van-field>
  <div style="margin: 16px;">
    <van-button round block type="info" native-type="submit">提交</van-button>
  </div>
</van-form>
```

### 2.4.2 添加非空校验规则

### 2.4.3 通过pattern进行正则校验

### 2.4.4 监听表单的提交事件

### 2.4.5 封装登录的API接口

### 2.4.6 调用登录的API接口

### 2.4.7 使用结构赋值

## 2.5 token的存储

## 2.6 axios拦截器

## 2.7 分支的提交和合并