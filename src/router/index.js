import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/Login/Login.vue'
import Main from '@/views/Main/Main.vue'
import Home from '@/views/Home/Home.vue'
import User from '@/views/User/User.vue'
import Search from '@/views/Search/Search.vue'
import SearchResult from '@/views/SearchResult/SearchResult.vue'
// 导入文章详情组件
import ArticleDetail from '@/views/ArticleDetail/ArticleDetail.vue'

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
    // name: 'main',
    children: [
      // path 为"空字符串"的子路由规则，叫做"默认子路由"
      { path: '', component: Home, name: 'home' },
      // 用户
      { path: '/user', component: User, name: 'user' },
      // 搜索组件的路由规则
      { path: '/search', component: Search, name: 'search' }
    ]
  },
  // 搜索结果页
  { path: '/search/:kw', component: SearchResult, name: 'search-result', props: true },
  // 文章详情的路由规则
  { path: '/article/:id', component: ArticleDetail, name: 'art-detail', props: true }
]

const router = new VueRouter({
  routes
})

export default router
