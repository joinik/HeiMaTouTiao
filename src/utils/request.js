// 定义网络请求模块
import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store'
// 调用axios.create()方法，创建 axios 的实例对象
const instance = axios.create({
  //  请求根路径
  baseURL: 'http://geek.itheima.net'
})

// 请求拦截器
// 注意: 在我们的项目中，是基于 instance 实例来发起 ajax 请求的，因此一定要为 instance 实例绑定请求拦截器
instance.interceptors.request.use(config => {
  // 展示 loading 效果
  Toast.loading({
    message: '加载中...', // 文本内容
    duration: 0 // 展示时长(ms)，值为 0 时，toase不会消失
  })
  // 1.获取 token 值
  const tokenStr = store.state.tokenInfo.token
  // 2.判断 tokenStr 的值是否为空
  if (tokenStr) {
    // 3.添加身份认证字段
    config.headers.Authorization = `Bearer ${tokenStr}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 隐藏 loading 效果
    Toast.clear()
    return response
  }, error => {
    return Promise.reject(error)
  }
)
export default instance
