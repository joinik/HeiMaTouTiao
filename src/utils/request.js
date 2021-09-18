// 定义网络请求模块
import axios from 'axios'

// 调用axios.create()方法，创建 axios 的实例对象
const instance = axios.create({
  //  请求根路径
  baseURL: 'http://www.liulongbin.top:8000'
})

export default instance
