# Token 续签

> 两种主流方案：
> 只要发现 Token 过期，则强制用户跳转到登录页，并清空本地和 Vuex 中的关键数据！
> 如果发现 Token 过期，则自动基于 refresh_token 无感知地请求一个新 Token 回来。在替换掉旧 Token 的同时，继续上次未完成的请求！

## 13.1 方案1：强制跳转到登录页

### 13.1.1 在响应拦截器中监听 Token 过期的情况

1. 在 `/src/utils/request.js` 模块中，进一步改造 `response` 响应拦截器，当数据请求失败的时候，进行 `status` 状态码的判断：

```js
// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 隐藏 loading 提示效果
    Toast.clear()
    return response
  },
  error => {
    // 在请求失败的时候，关闭 loading 提示效果
    Toast.clear()

    // 如果有响应的结果，并且响应的状态码是 401，则证明 Token 过期了
    if (error.response && error.response.status === 401) {
      console.log('token 过期啦')
      // TODO1：清空 vuex 和 localStorage 中的数据
      // TODO2：强制跳转到登录页，并通过路由的 query 查询参数，把当前用户访问未遂的路由地址带给登录页
    }
    return Promise.reject(error)
  }
)
```

### 13.1.2 Token 过期后清空 vuex 和 localStorage

> 只需要调用 vuex 模块中提供的 cleanState 这个 Mutation 方法，即可清空 vuex 和 localStorage 中的数据

1. 在 `/src/utils/request.js` 模块中，导入 `/src/store/index.js` 模块：

```js
// 导入 store 实例对象（注意：不要重复导入 store 哦~~~）
import store from '@/store/index.js'
```

2. 在 `response` 响应拦截器中，只要监听到 `token` 过期，就立即调用 `store` 中名为 `cleanState` 的 `Mutation` 方法：

```js
// 如果有响应的结果，并且响应的状态码是 401，则证明 Token 过期了
if (error.response && error.response.status === 401) {
  console.log('token 过期啦')
  // TODO1：清空 vuex 和 localStorage 中的数据
  store.commit('cleanState')
  // TODO2：强制跳转到登录页，并通过路由的 query 查询参数，把当前用户访问未遂的路由地址带给登录页
}
```

### 13.1.3 Token 过期后强制跳转到登录页

> 只需要调用 `router` 路由模块提供的 `.push()` 方法，即可跳转到指定的页面

1. 在 `/src/utils/request.js` 模块中，导入 `/src/router/index.js` 模块：

```js
// 导入 router 实例对象
import router from '@/router/index.js'
```

2. 在 `response` 响应拦截器中，只要监听到 `token` 过期，就立即调用 `router` 原型对象上的 `replace()`方法，强制跳转到登录页：

```js
// 如果有响应的结果，并且响应的状态码是 401，则证明 Token 过期了
if (error.response && error.response.status === 401) {
  console.log('token 过期啦')
  // TODO1：清空 vuex 和 localStorage 中的数据
  store.commit('cleanState')
  // TODO2：强制跳转到登录页，并通过路由的 query 查询参数，把当前用户“访问未遂的路由地址”带给登录页
  router.replace('/login?pre=' + router.currentRoute.fullPath)
}
```

## 13.2 方案2：无感知刷新Token

### 13.2.1 无感知刷新 Token 的原理

![13-1.ccdb8ae9](./images/13-1.ccdb8ae9.png)

### 13.2.2 在响应拦截器中监听 Token 过期的情况

1. 在 `/src/utils/request.js` 模块中，导入 `vuex` 的 `store` 模块：

```js
// 导入 store 实例对象（注意：不要重复导入 store 哦~~~）
import store from '@/store/index'
```

2. 在 `/src/utils/request.js` 模块中，进一步改造 `response` 响应拦截器，当数据请求失败的时候，从 `vuex` 中获取 `tokenInfo` 对象：

```js
// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 隐藏 loading 提示效果
    Toast.clear()
    return response
  },
  error => {
    Toast.clear()

    // 1. 从 vuex 中获取 tokenInfo 对象，格式为： { token, refresh_token }
    const tokenInfo = store.state.tokenInfo

    return Promise.reject(error)
  }
)
```

3. 在 `response` 响应拦截器中，当数据请求失败的时候，判断是否为 `token` 过期：

```js
// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 隐藏 loading 提示效果
    Toast.clear()
    return response
  },
  error => {
    Toast.clear()

    // 1. 从 vuex 中获取 tokenInfo 对象，格式为： { token, refresh_token }
    const tokenInfo = store.state.tokenInfo

    // 2. 判断是否为 token 过期
    if (error.response && error.response.status === 401 && tokenInfo.refresh_token) {
      // token 过期
      console.log('token过期啦')

      // 3.1 TODO: 发起请求，根据 refresh_token 重新请求一个有效的新 token
    }

    return Promise.reject(error)
  }
)
```

### 13.2.3 定义请求新 Token 的 API

> 在请求新 Token 时，不要基于 `/src/utils/`request.js 模块中的 instance 发起请求，
> 因为 instance 发起请求时，默认携带的 Authorization 值为 tokenInfo.token 属性！！！

1. 在 `/src/api/userAPI.js` 模块中，导入 `axios`：

```js
import axios from 'axios'
```

2. 在 `/src/api/userAPI.js` 模块中，定义名为 `exchangeTokenAPI` 的方法，用来根据 `refresh_token` 换取新 `token`：

```js
// 换取 Token 的 API（形参中的 refreshToken 用来换取新 token）
export const exchangeTokenAPI = refreshToken => {
  return axios({
    method: 'PUT',
    // 这里必须填写完整的请求 URL 地址
    url: 'http://www.liulongbin.top:8000/v1_0/authorizations',
    headers: {
      // 在请求头中携带 Authorization 身份认证字段
      Authorization: 'Bearer ' + refreshToken
    }
  })
}
```

### 13.2.4 调用换取 token 的 API

1. 在 `/src/utils/request.js` 模块中，按需导入换取 `token` 的 `API`：

```js
// 按需导入换取 token 的 API
import { exchangeTokenAPI } from '@/api/userAPI.js'
```

2. 改造响应拦截器，在 `response` 拦截器中，调用换取 `token` 的 `API` 接口：

```js
// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 隐藏 loading 提示效果
    Toast.clear()
    return response
  },
  async error => {
    Toast.clear()

    // 1. 从 vuex 中获取 tokenInfo 对象，格式为： { token, refresh_token }
    const tokenInfo = store.state.tokenInfo
    // 2. 判断是否为 token 过期
    if (error.response && error.response.status === 401 && tokenInfo.refresh_token) {
      // token 过期
      console.log('token过期啦')

      // 3.1 TODO: 发起请求，根据 refresh_token 重新请求一个有效的新 token
      const { data: res } = await exchangeTokenAPI(tokenInfo.refresh_token)
      console.log(res)

      // 3.2 TODO: 更新 Store 中的 Token
    }

    return Promise.reject(error)
  }
)
```

### 13.2.5 更新 Store 中的 Token

1. 在 `/src/utils/request.js` 模块中，导入 `vuex` 的 `store` 模块：

```js
// 导入 store 实例对象（注意：不要重复导入 store 哦~~~）
import store from '@/store/index'
```

2. 改造响应拦截器，在 `response` 拦截器中，调用 `store.commit()` 方法，触发指定名称的`Mutation` 函数，更新 `vuex` 和本地的 `token` 值：

```js
// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 隐藏 loading 提示效果
    Toast.clear()
    return response
  },
  async error => {
    Toast.clear()

    // 1. 从 vuex 中获取 tokenInfo 对象，格式为： { token, refresh_token }
    const tokenInfo = store.state.tokenInfo
    // 2. 判断是否为 token 过期
    if (error.response && error.response.status === 401 && tokenInfo.refresh_token) {
      // token 过期
      console.log('token过期啦')

      // 3.1 TODO: 发起请求，根据 refresh_token 重新请求一个有效的新 token
      const { data: res } = await exchangeTokenAPI(tokenInfo.refresh_token)
      console.log(res)

      // 3.2 TODO: 更新 Store 中的 Token
      store.commit('updateTokenInfo', { token: res.data.token, refresh_token: tokenInfo.refresh_token })

      // 3.3 重新调用刚才“请求未遂”的接口
    }

    return Promise.reject(error)
  }
)
```

### 13.2.6 重新调用刚才请求未遂的接口

1. 在响应拦截器中，如果 `return` 了一个新的 `Promise` 异步请求，则会把这次请求的结果，当作上次请求的返回值：

```js
// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 隐藏 loading 提示效果
    Toast.clear()
    return response
  },
  async error => {
    Toast.clear()

    // 1. 从 vuex 中获取 tokenInfo 对象，格式为： { token, refresh_token }
    const tokenInfo = store.state.tokenInfo
    // 2. 判断是否为 token 过期
    if (error.response && error.response.status === 401 && tokenInfo.refresh_token) {
      // token 过期
      console.log('token过期啦')

      // 3.1 TODO: 发起请求，根据 refresh_token 重新请求一个有效的新 token
      const { data: res } = await exchangeTokenAPI(tokenInfo.refresh_token)

      // 3.2 TODO: 更新 Store 中的 Token
      store.commit('updateTokenInfo', { token: res.data.token, refresh_token: tokenInfo.refresh_token })

      // 3.3 重新调用刚才“请求未遂”的接口
      // 3.3.1 如果在响应拦截器中 return 一个新的 Promise 异步请求，则会把这次请求的结果，当作上次请求的返回值
      return instance(error.config)
    }
    return Promise.reject(error)
  }
)
```

### 13.2.7 处理 refresh_token 失效的情况

1. 在执行步骤 3.1 时，如果 `tokenInfo.refresh_token` 也失效了，则步骤 3.1 会执行失败，此时可以使用`try...catch` 进行捕获：

```js
// 响应拦截器
instance.interceptors.response.use(response => {
  // 隐藏 loading 效果
  Toast.clear()
  return response
}, async error => {
  // 在请求失败的时候，关闭 loading 提示效果
  Toast.clear()
  // 1.从 vuex 中获取 tokenInfo 对象， 格式为：{token, refresh_token}
  const tokenInfo = store.state.tokenInfo.tokenInfo
  // 2. 判断是否为 token 过期
  if (error.response && error.response.status === 401 || tokenInfo.refresh_token) {

    try {
      // 3.1 TODO: 发起请求，根据 refresh_token 重新请求一个有效的新 token
      const { data: res } = await exchangeTokenAPI(tokenInfo.refresh_token)
      // 3.2 TODO: 更新 Store 中的 Token
      store.commit('updateTokenInfo', { token: res.data.token, refresh_token: tokenInfo.refresh_token })
        // 3.3 重新调用刚才“请求未遂”的接口
        // 3.3.1 如果在响应拦截器中 return 一个新的 Promise 异步请求，则会把这次请求的结果，当作上次请求的返回值
      return instance(error.config)
    } catch {
      // token 和 refresh_token 都失效了

      // 4.1 清空 vuex 和 localStorage
      store.commit('cleanState')
      // 4.2 强制跳转到登录页
      router.replace('/login?pre=' + router.currentRoute.fullPath)
    }
  }
  return Promise.reject(error)
})
```

## 13.3 分支的合并与提交

1. 将修改过后的文件加入暂存区，并进行本地的 `commit` 提交：

```bash
git add .
git commit -m "完成了token续签功能"
```

2. 将本地的 `token` 分支首次推送到 `Gitee` 仓库中：

```bash
git push -u origin token
```

3. 将本地的 `token` 分支合并到本地的 `master` 主分支，并推送 `master` 分支到 `Gitee` 仓库：

```bash
git checkout master
git merge token
git push
```

4. 删除本地的 `token` 子分支：

```bash
git branch -d token
```

5. 基于 `master` 主分支，新建 `optimize` 分支，准备开发项目优化相关的功能：

```bash
git checkout -b optimize
```
