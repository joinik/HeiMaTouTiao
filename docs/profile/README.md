# 10. 个人中心

## 10.1 渲染个人中心的基础布局

1. 在 `/src/views/User/User.vue` 组件中，声明如下的模板结构：

```html
<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img src="" alt="" class="avatar">
        </template>
        <template #title>
          <span class="username">用户名</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>0</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>0</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>0</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell icon="edit" title="编辑资料" is-link />
      <van-cell icon="chat-o" title="小思同学" is-link />
      <van-cell icon="warning-o" title="退出登录" is-link />
    </van-cell-group>
  </div>
</template>
```

2. 在 `User.vue` 组件的 `<style>` 节点下声明如下的样式：

```css
.user-container {
  .user-card {
    background-color: #007bff;
    color: white;
    padding-top: 20px;
    .van-cell {
      background: #007bff;
      color: white;
      &::after {
        display: none;
      }
      .avatar {
        width: 60px;
        height: 60px;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 10px;
      }
      .username {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .user-data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;
    .user-data-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
    }
  }
}
```

## 10.2 用户的基本信息

### 10.2.1 在 vuex 中请求用户的基本信息

1. 在 `/src/api/userAPI.js` 模块中，定义请求用户基本信息的 `API` 方法：

```js
// 请求用户基本信息的 API
export const getUserInfoAPI = () => {
  return request.get('/v1_0/user')
}
```

2. 在 `/src/store/index.js` 对应的 `vuex` 模块中，按需导入请求用户基本信息的 `API` 方法：

```js
// 按需导入 API 方法
import { getUserInfoAPI } from '@/api/userAPI.js'
```

3. 在 `vuex 模块的 actions` 节点下，定义名为 `initUserInfo` 的 `Action` 方法：

```js
actions: {
  // 初始化用户的基本信息
  async initUserInfo(ctx) {
    // 调用 API 接口
    const { data: res } = await getUserInfoAPI()
    if (res.message === 'OK') {
      // TODO：把数据转交给 Mutation 方法   ctx.commit('Mutation方法名')
    }
  }
}
```

### 10.2.2 把请求到的数据转存到 state

1. 在 `vuex` 模块中，在 `initState` 对象中新增 `userInfo` 数据节点，用来全局存储用户的基本信息：

```js
// 初始的 state 对象
let initState = {
  // token 的信息对象
  tokenInfo: {},
  // 用户的基本信息
  userInfo: {}
}
```

2. 在 `vuex` 模块中的 `mutations` 节点下，定义名为 `updateUserInfo` 的 `Mutation` 方法，负责把 `Action` 请求到的数据转存到 `state` 中：

```js
// 更新 userInfo 的方法
updateUserInfo(state, payload) {
  // 1. 把用户信息转存到 state 中
  state.userInfo = payload
  // 2. 将最新的 state 对象持久化存储到本地
  this.commit('saveStateToStorage')
}
```

3. 在名为 `initUserInfo` 的 `Action` 方法中，通过 `ctx.commit()` 触发指定名称的 `Mutation` 方法：

```js
// 初始化用户的基本信息
async initUserInfo(ctx) {
  // 调用 API 接口
  const { data: res } = await getUserInfoAPI()
  if (res.message === 'OK') {
    // TODO：把数据转交给 Mutation 方法   ctx.commit('Mutation方法名')
    ctx.commit('updateUserInfo', res.data)
  }
}
```

### 10.2.3 在组件中使用 Action 方法

1. 在 `User.vue` 组件中，从 `vuex` 中按需导入 `mapActions` 辅助函数：

```js
// 按需导入辅助函数
import { mapActions } from 'vuex'
```

2. 在 `User.vue` 组件的 `methods` 节点下调用 `mapActions` 辅助函数，将需要的 `Action` 方法映射到当前组件中使用：

```js
export default {
  name: 'User',
  methods: {
    // 从 vuex 中把指定名称的 Action 方法映射到组件中使用
    ...mapActions(['initUserInfo'])
  }
}
```

3. 在 `User.vue` 组件的 `created` 生命周期函数中调用映射过来的 `initUserInfo` 方法：

```js
created() {
  this.initUserInfo()
},
```

### 10.2.4 在组件中使用 state 数据

1. 在 `User.vue` 组件中，从 `vuex` 中按需导入 `mapState` 辅助函数：

```js
// 按需导入辅助函数
import { mapActions, mapState } from 'vuex'
```

2. 在 `User.vue` 组件的 `computed` 节点下调用 `mapState` 辅助函数，将需要的 `State` 数据映射到当前组件中使用：

```js
computed: {
  // 从 vuex 中把指定名称的 State 数据映射到组件中使用
  ...mapState(['userInfo'])
}
```

3. 把映射过来的数据，渲染到 `User.vue` 组件的模板结构中：

```html
<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img :src="userInfo.photo" alt="" class="avatar">
        </template>
        <template #title>
          <span class="username">{{userInfo.name}}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{userInfo.art_count}}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{userInfo.follow_count}}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{userInfo.fans_count}}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell icon="edit" title="编辑资料" is-link />
      <van-cell icon="chat-o" title="小思同学" is-link />
      <van-cell icon="warning-o" title="退出登录" is-link />
    </van-cell-group>
  </div>
</template>
```

## 10.3 退出登录

### 10.3.1 渲染退出登录的确认提示框

1. 在 `User.vue` 组件中，为退出登录的 `<van-cell>` 组件绑定点击事件处理函数：

```html
<van-cell icon="warning-o" title="退出登录" is-link @click="logout" />
```

2. 在 `User.vue` 组件的 `methods` 节点下，定义 `logout` 方法：

```js
// 点击了退出登录
logout() {
  // 展示确认的提示框
  const confirmResult = this.$dialog.confirm({
    title: '提示',
    message: '确认退出登录吗？'
  })

  // 经过打印输出，发现 confirmResult 是一个 Promise 对象
  console.log(confirmResult)
}
```

3. 基于 `async/await` 简化 `Promise` 的调用：

```js
// 点击了退出登录
async logout() {
  // 展示确认的提示框
  const confirmResult = await this.$dialog.confirm({
    title: '提示',
    message: '确认退出登录吗？'
  })

  // 经过打印输出，发现 confirmResult 是一个 string 字符串
  console.log(confirmResult, typeof confirmResult)
}
```

4. 基于 `.catch()` 方法捕获 `Promise` 中产生的错误：

```js
// 点击了退出登录
async logout() {
  // 展示确认的提示框
  const confirmResult = await this.$dialog
    .confirm({
      title: '提示',
      message: '确认退出登录吗？'
    })
    .catch(err => {
      // err 是错误的结果
      console.log(err)
      // 这里把 err return 给了 confirmResult
      return err
    })

  // 经过打印输出发现：
  // 点击“确认”按钮时，confirmResult 的值为字符串 confirm
  // 点击“取消”按钮时，confirmResult 的值为字符串 cancel
  console.log(confirmResult)
}
```

5. 判断用户点击了确认还是取消按钮：

```js
// 点击了退出登录
async logout() {
  // 展示确认的提示框
  const confirmResult = await this.$dialog
    .confirm({
      title: '提示',
      message: '确认退出登录吗？'
    })
    .catch(err => {
      // err 是错误的结果
      console.log(err)
      // 这里把 err return 给了 confirmResult
      return err
    })

  // 如果点击了取消，则不执行后续的操作
  if (confirmResult === 'cancel') return

  // TODO：实现退出的登录操作：
  // 1. 清空 vuex 中的数据
  // 2. 清空本地的数据
  // 3. 跳转到登录页
}
```

### 10.3.2 实现退出登录的功能

1. 在 `vuex` 中定义名为 `cleanState` 的 `Mutation` 方法：

```js
// 清空 vuex 和本地的数据
cleanState(state) {
  // 1. 清空 vuex 中的数据
  state.tokenInfo = {}
  state.userInfo = {}

  // 2. 将清空后的 state 存储到本地
  this.commit('saveStateToStorage')
}

```

2. 在 `User.vue` 组件中按需导入 `mapMutations` 辅助函数：

```js
// 按需导入辅助函数
import { mapActions, mapState, mapMutations } from 'vuex'
```

3. 结合 `methods` 节点调用 `mapMutations` 辅助函数，把 `cleanState` 映射到 `User.vue` 组件中使用：

```js
methods: {
  ...mapMutations(['cleanState']),
}
```

4. 在 `User.vue` 组件的 `logout` 方法中，调用映射过来的 `cleanState` 方法，并通过 `this.$router.push()` 方法跳转到登录页：

```js
// 点击了退出登录
async logout() {
  // 展示确认的提示框
  const confirmResult = await this.$dialog
    .confirm({
      title: '提示',
      message: '确认退出登录吗？'
    })
    .catch(err => {
      // err 是错误的结果
      console.log(err)
      // 这里把 err return 给了 confirmResult
      return err
    })

  // 如果点击了取消，则不执行后续的操作
  if (confirmResult === 'cancel') return

  // TODO：实现退出的登录操作：
  // 1. 清空 vuex 中的数据
  // 2. 清空本地的数据
  this.cleanState()
  // 3. 跳转到登录页
  this.$router.push('/login')
}
```

## 10.4 编辑用户资料

### 10.4.1 导航到编辑用户资料页面

1. 在 `/src/views/` 目录下新建 `UserEdit` 文件夹，并在其下新建同名的 `UserEdit.vue` 组件：

```html
<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image round class="avatar" src="https://img01.yzcdn.cn/vant/cat.jpeg" />
        </template>
      </van-cell>
      <van-cell title="名称" is-link value="张三" />
      <van-cell title="生日" is-link value="2012-12-12" />
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: 'UserEdit'
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
}

.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
</style>
```

2. 在路由模块中导入 `UserEdit.vue` 组件：

```js
import UserEdit from '@/views/UserEdit/UserEdit.vue'
```

3. 在路由模块的 `routes` 数组中声明 `UserEdit.vue` 组件的路由规则：

```js
const routes = [
  // 编辑用户资料的路由规则
  { path: '/user/edit', component: UserEdit, name: 'user-edit' }
]
```

4. 在 `User.vue` 组件中，为编辑资料的 `<van-cell>` 绑定点击事件处理函数：

```js
<!-- 通过命名路由实现导航跳转 -->
<van-cell icon="edit" title="编辑资料" is-link @click="$router.push({name: 'user-edit'})" />
```

### 10.4.2 请求用户的简介信息

1. 在 `/src/api/userAPI.js` 模块中，定义请求用户简介信息的 `API` 接口：

```js
// 请求用户简介信息的 API
export const getUserProfileAPI = () => {
  return request.get('/v1_0/user/profile')
}
```

2. 在 `/src/store/index.js` 模块中，按需导入请求用户简介信息的`API` 接口：

```js
// 按需导入 API 方法
import { getUserInfoAPI, getUserProfileAPI } from '@/api/userAPI.js'
```

3. 在 `vuex` 模块的 `actions` 节点下，定义名为 `initUserProfile` 的 `Action` 方法：

```js
// 初始化用户的简介信息
async initUserProfile(ctx) {
  // 调用 API 接口
  const { data: res } = await getUserProfileAPI()
  if (res.message === 'OK') {
    // TODO：把请求到的数据转交给 Mutation 方法   ctx.commit('Mutation方法名')
  }
}
```

### 10.4.3 把请求到的数据转存到 state

1. 在 `vuex` 模块中，在 `initState` 对象中新增 `userProfile` 数据节点，用来全局存储用户的简介信息：

```js
// 初始的 state 对象
let initState = {
  // token 的信息对象
  tokenInfo: {},
  // 用户的基本信息
  userInfo: {},
  // 用户的简介信息
  userProfile: {}
}
```

2. 在 `vuex` 模块中的 `mutations` 节点下，定义名为 `updateUserProfile` 的 `Mutation` 方法，负责把 `Action` 请求到的数据转存到 `state` 中：

```js
// 更新 userProfile 的方法
updateUserProfile(state, payload) {
  state.userProfile = payload
  this.commit('saveStateToStorage')
},
```

3. 在名为 `initUserProfile` 的 `Action` 方法中，通过 `ctx.commit()` 触发指定名称的 `Mutation` 方法：

```js
// 初始化用户的简介信息
async initUserProfile(ctx) {
  // 调用 API 接口
  const { data: res } = await getUserProfileAPI()
  if (res.message === 'OK') {
    // TODO：把请求到的数据转交给 Mutation 方法   ctx.commit('Mutation方法名')
    ctx.commit('updateUserProfile', res.data)
  }
}
```

4. 改造 `vuex` 模块中的 `cleanState` 函数，当用户退出登录时清空 `state.userProfile`：

```js
// 清空 vuex 和本地的数据
cleanState(state) {
  // 1. 清空 vuex 中的数据
  state.tokenInfo = {}
  state.userInfo = {}
  state.userProfile = {}

  // 2. 将清空后的 state 存储到本地
  this.commit('saveStateToStorage')
}
```

### 10.4.4 在组件中使用 Action 方法

1. 在 `UserEdit.vue` 组件中，从 `vuex` 中按需导入 `mapActions` 辅助函数：

```js
// 按需导入辅助函数
import { mapActions } from 'vuex'
```

2. 在 `UserEdit.vue` 组件的 `methods` 节点下调用 `mapActions` 辅助函数，将需要的 `Action` 方法映射到当前组件中使用：

```js
export default {
  name: 'UserEdit',
  methods: {
    // 从 vuex 中把指定名称的 Action 方法映射到组件中使用
    ...mapActions(['initUserProfile'])
  }
}
```

3. 在 `UserEdit.vue` 组件的 `created` 生命周期函数中调用映射过来的 `initUserProfile` 方法：

```js
created() {
  this.initUserProfile()
}
```

### 10.4.5 在组件中使用 state 数据

1. 在 `UserEdit.vue` 组件中，从 `vuex` 中按需导入 `mapState` 辅助函数：

```js
// 按需导入辅助函数
import { mapActions, mapState } from 'vuex'
```

2. 在 `UserEdit.vue` 组件的 `computed` 节点下调用 `mapState` 辅助函数，将需要的 `State` 数据映射到当前组件中使用：

```js
computed: {
  // 从 vuex 中把指定名称的 State 数据映射到组件中使用
  ...mapState(['userProfile'])
}
```

3. 把映射过来的数据，渲染到 `UserEdit.vue` 组件的模板结构中：

```html
<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image round class="avatar" :src="userProfile.photo" />
        </template>
      </van-cell>
      <van-cell title="名称" is-link :value="userProfile.name" />
      <van-cell title="生日" is-link :value="userProfile.birthday" />
    </van-cell-group>
  </div>
</template>
```

## 10.5 修改用户名称

> 基于 Vant 的 [Dialog 弹出框组件](https://vant-contrib.gitee.io/vant/#/zh-CN/dialog)，可以方便的实现修改用户姓名的弹出框效果

### 10.5.1 实现修改姓名的弹出框效果

1. 在 `UserEdit.vue` 组件的 `data` 中定义如下的两个数据项：

```js
data() {
  return {
    // 是否展示修改姓名的对话框
    showNameDialog: false,
    // 用户填写的姓名
    name: ''
  }
},
```

2. 和用户资料平级，在用户资料的下面，基于 `<van-dialog>` 组件渲染修改名称的弹出框组件：

```html
<!-- 修改用户名称的对话框 -->
<van-dialog v-model="showNameDialog" title="修改名称" show-cancel-button>
  xxx
</van-dialog>
```

3. 点击名称的 `<van-cell>` 时展示修改名称的对话框：

```html
<van-cell title="名称" is-link :value="userProfile.name" @click="onNameCellClick" />
```

4. 在 `UserEdit.vue` 的 `methods` 中声明 `onNameCellClick` 方法：

```js
// 点击了修改名称的 cell
onNameCellClick() {
  this.showNameDialog = true
}
```

### 10.5.2 渲染修改名称的表单项

1. 基于 Vant 的 <van-field> 组件可以在 Dialog 对话框组件内部渲染名称的表单项：

```html
<!-- 修改用户名称的对话框 -->
<van-dialog v-model="showNameDialog" title="修改名称" show-cancel-button>
  <!-- input-align 文本横向的对其方式 -->
  <van-field v-model.trim="name" placeholder="请输入用户名" input-align="center" maxlength="7" />
</van-dialog>
```

2. 在 UserEdit.vue 组件中修改 methods 中的 onNameCellClick 方法：

```js
// 点击了修改名称的 cell
onNameCellClick() {
  // 把用户的名称赋值给 data 中的 name
  this.name = this.userProfile.name
  // 展示对话框
  this.showNameDialog = true
}
```

### 10.5.3 文本框自动获得焦点

1. 为名称的 `<van-field>` 组件添加 `ref` 引用名称：

```html
<van-field v-model.trim="name" placeholder="请输入用户名" input-align="center" maxlength="7" ref="nameRef" />
```

2. 改造 `UserEdit.vue` 组件中的 `onNameCellClick` 方法：

```js
// 点击了修改名称的 cell
onNameCellClick() {
  // 把用户的名称赋值给 data 中的 name
  this.name = this.userProfile.name
  // 展示对话框
  this.showNameDialog = true
  // DOM 更新完毕之后，让文本框自动获得焦点
  this.$nextTick(() => {
    this.$refs.nameRef.focus()
  })
}
```

### 10.5.4 自定义 Dialog 关闭时的行为

1. 为 `<van-dialog>` 组件绑定 `before-close` 属性，并指定对应的处理函数：

```html
<!-- 修改用户名称的对话框 -->
<van-dialog v-model="showNameDialog" title="修改名称" show-cancel-button :before-close="beforeClose"></van-dialog>
```

2. 在 `UserEdit.vue` 组件的 `methods` 中定义 `beforeClose` 函数，用来自定义 `Dialog` 关闭时的行为：

```js
// Dialog 关闭前的处理函数
beforeClose(action, done) {
  // action 可能的值有两个：cancel 和 confirm
  console.log(action)

  // 调用 done() 时会关闭对话框；调用 done(false) 时会阻止对话框关闭
  done()
}
```

3. 在 `beforeClose` 中自定义 `Dialog` 关闭时的行为：

```js
// Dialog 关闭前的处理函数
beforeClose(action, done) {
  // 点击了“取消”按钮
  if (action === 'cancel') return done()

  // 判断名称的长度是否不合法
  if (this.name === '' || this.name.length > 7) {
    // 1. 提示用户“名称的长度为1-7个字符”
    this.$notify({ type: 'warning', message: '名称的长度为1-7个字符', duration: 2000 })
    // 2. 让文本框持续获得焦点
    this.$refs.nameRef.focus()
    // 3. 阻止对话框关闭
    return done(false)
  }

  // TODO：发起修改名称的请求：
  // A. 如果请求成功，则调用 done() 关闭对话框
  // B. 如果请求失败，则提示用户失败的信息，并调用 done(false) 阻止对话框关闭
}
```

### 10.5.5 实现修改名称的功能

1. 在 `userAPI.js` 模块中，定义修改用户简介信息的 `API` 接口：

```js
// 修改用户简介信息的 API（形参中的 obj 是对象格式的简介信息）
// 可能的格式有以下两种：
// { name: 'xxx' } 或 { birthday: '2012-12-12' }
export const updateUserProfileAPI = obj => {
  return request.patch('/v1_0/user/profile', obj)
}
```

2. 在 `UserEdit.vue` 组件中按需导入 `API` 方法：

```js
// 按需导入 API 接口
import { updateUserProfileAPI } from '@/api/userAPI.js'
```

3. 改造 `UserEdit.vue` 组件中的 `beforeClose` 方法，在最后调用 `this.updateName(done)` 方法更新用户的名称：

```js
// Dialog 关闭前的处理函数
beforeClose(action, done) {
  // 点击了“取消”按钮
  if (action === 'cancel') return done()

  // 判断名称的长度是否不合法
  if (this.name === '' || this.name.length > 7) {
    // 1. 提示用户“名称的长度为1-7个字符”
    this.$notify({ type: 'warning', message: '名称的长度为1-7个字符', duration: 2000 })
    // 2. 让文本框持续获得焦点
    this.$refs.nameRef.focus()
    // 3. 阻止对话框关闭
    return done(false)
  }

  // TODO：发起修改名称的请求：
  // A. 如果请求成功，则调用 done() 关闭对话框
  // B. 如果请求失败，则提示用户失败的信息，并调用 done(false) 阻止对话框关闭
  this.updateName(done)
},
```

4. 在 `UserEdit.vue` 组件中，定义 `updateName` 方法，实现更新名称的功能：

```js
// 更新用户的简介信息
async updateName(done) {
  const { data: res } = await updateUserProfileAPI({ name: this.name })
  if (res.message === 'OK') {
    // 1. 关闭对话框
    done()
    // 2. 重新请求用户的简介信息
    this.initUserProfile()
    // 3. 提示用户更新成功
    this.$notify({ type: 'success', message: '名称更新成功！', duration: 2000 })
  }
}
```

5. 如果请求接口失败，且报错的消息是`409 (CONFLICT)`，则证明当前提交的名称被占用了，需要进行 `try...catch` 的处理：

```js
// 更新用户的简介信息
async updateName(done) {
  try {
    const { data: res } = await updateUserProfileAPI({ name: this.name })
    if (res.message === 'OK') {
      // 关闭对话框
      done()
      // 重新请求用户的简介信息
      this.initUserProfile()
      // 提示用户更新成功
      this.$notify({ type: 'success', message: '名称更新成功！', duration: 2000 })
    }
  } catch (e) {
    if (e.response.status === 409) {
      // 提示用户名称被占用
      this.$notify({ type: 'warning', message: '名称被占用，请更换后重试！', duration: 2000 })
      // 阻止关闭对话框
      done(false)
      // 让文本框持续获得焦点
      this.$refs.nameRef.focus()
    } else {
      // 关闭对话框
      done()
      // 提示用户名称被占用
      this.$notify({ type: 'danger', message: '名称更新失败！', duration: 2000 })
    }
  }
}
```

## 10.6 修改用户生日

### 10.6.1 渲染修改生日的动作面板

1. 在 `UserEdit.vue` 组件的 `data` 中定义名为 `showBirthSheet` 的布尔值，用来控制动作面板的显示与隐藏：

```js
data() {
  return {
    // 省略其它数据项...

    // 是否展示修改生日的对话框
    showBirthSheet: false,
  }
}
```

2. 在 `UserEdit.vue` 组件的模板结构中，和修改用户名称的对话框平级，在它的后面声明修改生日的动作面板：

```html
<!-- 修改生日的动作面板 -->
<van-action-sheet v-model="showBirthSheet">
  xxx
</van-action-sheet>
```

3. 在 `UserEdit.vue` 组件中，为生日的 `<van-cell>` 绑定点击事件处理函数：

```html
<van-cell title="生日" is-link :value="userProfile.birthday" @click="onBirthCellClick" />
```

4. 在 `UserEdit.vue` 组件的 `methods` 中定义名为 `onBirthCellClick` 的方法：

```js
// 点击了修改生日的 cell
onBirthCellClick() {
  this.showBirthSheet = true
}
```

### 10.6.2 渲染 DatetimePicker 组件

1. 在 UserEdit.vue 组件的 data 节点下定义如下 3 个数据项：

```js
data() {
  return {
    // 省略其它数据项...

    // 最小可选日期（0 表示 1月份）
    minDate: new Date(1900, 0, 1),
    // 最大可选日期（11 表示 12月份）
    maxDate: new Date(2050, 11, 31),
    // 当前日期
    currentDate: new Date()
  }
}
```

2. 在生日的动作面板中，基于 Vant 的 [DatetimePicker 时间选择](https://vant-contrib.gitee.io/vant/#/zh-CN/datetime-picker#xuan-ze-nian-yue-ri)组件，快速渲染选择年月日的事件选择器组件：

```html
data() {
  return {
    // 省略其它数据项...

    // 最小可选日期（0 表示 1月份）
    minDate: new Date(1900, 0, 1),
    // 最大可选日期（11 表示 12月份）
    maxDate: new Date(2050, 11, 31),
    // 当前日期
    currentDate: new Date()
  }
}
```

3. 在展示选择生日的动作面板之前，为 data 中的 currentDate 赋初始值：

```js
// 点击了修改生日的 cell
onBirthCellClick() {
  // 如果用户生日的值存在，则初始值为用户的生日；否则为当前日期
  this.currentDate = this.userProfile.birthday ? new Date(this.userProfile.birthday) : new Date()

  // 展示动作面板
  this.showBirthSheet = true
}
```

4. 点击取消按钮时，关闭选择生日的动作面板：

```html
<!-- 修改生日的动作面板 -->
<van-action-sheet v-model="showBirthSheet">
  <van-datetime-picker v-model="currentDate" type="date" title="选择出生日期" :min-date="minDate" :max-date="maxDate" @cancel="showBirthSheet = false" />
</van-action-sheet>
```

5. 点击确认按钮时，会触发日期组件的 confirm 事件：

```html
<!-- 修改生日的动作面板 -->
<van-action-sheet v-model="showBirthSheet">
  <van-datetime-picker v-model="currentDate" type="date" title="选择出生日期" :min-date="minDate" :max-date="maxDate" @cancel="showBirthSheet = false" @confirm="updateBirthday" />
</van-action-sheet>
```

6. 在 confirm 的事件处理函数中，关闭选择生日的动作面板，并打印用户选择的日期：

```js
// 更新用户的生日
updateBirthday(value) {
  // 关闭动作面板
  this.showBirthSheet = false

  // 打印用户选择的日期
  console.log(value)
}
```

### 10.6.3 基于 dayjs 对时间进行格式化

> 基于 dayjs 提供的 [format](https://dayjs.fenxianglu.cn/category/display.html#格式化) 方法可以快速对时间进行格式化

1. 在 `UserEdit.vue` 组件中，导入 `dayjs` 模块：

```js
// 导入 dayjs
import dayjs from 'dayjs'
```

2. 在 `updateBirthday` 方法中，调用 `dayjs` 提供的 `.format()` 方法对时间进行格式化处理：

```js
// 更新用户的生日
updateBirthday(value) {
  // 关闭动作面板
  this.showBirthSheet = false

  // 调用 .format() 方法对时间进行格式化
  const dateStr = dayjs(value).format('YYYY-MM-DD')
  // 打印用户选择的日期
  console.log(dateStr)
}
```

### 10.6.4 实现修改生日的功能

1. 在 `updateBirthday` 方法中，调用修改用户简介信息的 `API` 接口：

```js
// 更新用户的生日
async updateBirthday(value) {
  // 关闭动作面板
  this.showBirthSheet = false

  // 调用 .format() 方法对时间进行格式化
  const dateStr = dayjs(value).format('YYYY-MM-DD')

  // 调用 API 接口，修改用户的生日
  const { data: res } = await updateUserProfileAPI({ birthday: dateStr })

  if (res.message === 'OK') {
    // 重新获取用户的简介信息
    this.initUserProfile()
    // 提示用户更新成功
    this.$notify({ type: 'success', message: '生日修改成功！', duration: 2000 })
  }
}
```

## 10.7 修改用户头像

> 借助于 `<input type="file" />` 文件选择框来实现选取照片的功能

### 10.7.1 实现选择图片的功能

1. 在 `class="avatar"` 的 `<van-image>` 之后，渲染图片的文件选择框：

```html
<van-cell title="头像" is-link center>
  <template #default>
    <!-- 用户的头像 -->
    <van-image round class="avatar" :src="userProfile.photo" />
    <!-- 文件选择框 -->
    <input type="file" accept="image/*" @change="onFileChange" />
  </template>
</van-cell>
```

2. 在 `UserEdit.vue` 组件的 `methods` 中定义 `onFileChange` 方法，从 `e.currentTarget` 中获取用户选择的文件：

```js
// 选中的文件发生了变化
onFileChange(e) {
  // 获取到用户选择的文件列表
  const files = e.currentTarget.files
  // 如果没有选择任何文件，则不执行后续的业务逻辑
  if (files.length === 0) return

  // 打印用户选择的第一个文件
  console.log(files[0])
}
```

### 10.7.2 点击头像时展示文件选择框

1. 基于 `v-show` 指令隐藏选择头像的文件选择框：

```html
<!-- 文件选择框 -->
<input type="file" accept="image/*" @change="onFileChange" v-show="false" />
```

2. 为文件选择框添加 `ref`引用名称：

```html
<!-- 文件选择框 -->
<input type="file" accept="image/*" @change="onFileChange" v-show="false" ref="fileRef" />
```

3. 当点击 `<van-image>` 组件时，获取到文件选择框的 `ref` 引用，并模拟原生 `DOM` 元素的点击事件：

```html
<!-- 用户的头像 -->
<van-image round class="avatar" :src="userProfile.photo" @click="$refs.fileRef.click()" />
```

### 10.7.3 实现修改头像的功能

1. 在 `userAPI.js` 模块中，定义名为 `updateUserAvatarAPI` 的接口，用来更新用户的头像：

```js
// 修改头像的 API（形参中的 fd 表示 FormData 格式的表单数据）
export const updateUserAvatarAPI = fd => {
  return request.patch('/v1_0/user/photo', fd)
}
```

2. 在 `UserEdit.vue` 组件中，按需导入更新头像的 `API` 接口：

```js
// 按需导入 API 接口
import { updateUserProfileAPI, updateUserAvatarAPI } from '@/api/userAPI.js'
```

3. 修改 `UserEdit.vue` 组件 `methods` 节点下的 `onFileChange` 方法，创建 `FormData` 对象并调用更新头像的 `API` 接口：

```js
// 选中的文件发生了变化
async onFileChange(e) {
  // 获取到用户选择的文件列表
  const files = e.currentTarget.files
  // 如果没有选择任何文件，则不执行后续的业务逻辑
  if (files.length === 0) return

  // 1.1 创建 FormData 的对象
  const fd = new FormData()
  // 1.2 向 fd 中追加数据项
  fd.append('photo', files[0])

  // 2. 调用 API 接口，更新头像
  const { data: res } = await updateUserAvatarAPI(fd)
  if (res.message === 'OK') {
    // 2.1 更新用户的简介信息
    this.initUserProfile()
    // 2.2 提示用户更新成功
    this.$notify({ type: 'success', message: '更新头像成功！', duration: 2000 })
  }
}
```

## 10.8 分支的合并和提交

1. 将修改过后的文件加入暂存区，并进行本地的 `commit` 提交：

```bash
git add .
git commit -m "完成了个人中心的功能"
```

2. 将本地的 `user` 分支首次推送到 `Gitee` 仓库中：

```bash
git push -u origin user
```

3. 将本地的 `user` 分支合并到本地的 `master` 主分支，并推送 `master` 分支到 `Gitee` 仓库：

```bash
git checkout master
git merge user
git push
```

4. 删除本地的 `user` 子分支：

```bash
git branch -d user
```

5. 基于 `master` 主分支，新建 `chat` 分支，准备开发小思同学相关的功能：

```bash
git checkout -b chat
```
