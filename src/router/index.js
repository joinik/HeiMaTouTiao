import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/Login'
import Main from '@/views/Main'

Vue.use(VueRouter)

const routes = [
  // 登录的路由规则
  {
    path: '/login',
    component: Login,
    name: 'login'
  },
  // 主页的路由规则
  {
    path: '/',
    component: Main,
    name: 'main'
  }
]

const router = new VueRouter({
  routes
})

export default router
