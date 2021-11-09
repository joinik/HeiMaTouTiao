import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入Login.vue页面组件
import Login from '@/views/Login/Login.vue'
// 导入Main.vue页面组件
import Main from '@/views/Main/Main.vue'
// 导入Home.vue页面组件
import Home from '@/views/Home/Home.vue'
// 导入User.vue页面组件
import User from '@/views/User/User.vue'
// 导入Search.vue页面组件
import Search from '@/views/Search/Search.vue'
// 导入SearchResult.vue页面组件
import SearchResult from '@/views/SearchResult/SearchResult.vue'
// 导入 articleDetail页面组件
import ArticleDetail from '@/views/ArticleDetail/ArticleDetail.vue'
// 导入 UserEdit 页面组件
import UserEdit from '@/views/UserEdit/UserEdit.vue'

import store from '@/store/index.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login,
    name: 'login'
  },
  {
    path: '/',
    component: Main,
    // 为什么要删除还有子路由的父路由的名字
    // 含有子路由的路由 有默认的路由，不能加命名路由
    // name: 'main',
    children: [
      {
        path: '/',
        component: Home,
        name: 'home'
      },
      {
        path: '/user',
        component: User,
        name: 'user'
      },

      {
        path: '/search',
        component: Search,
        name: 'search'
      },

      { path: '/search/:kw', component: SearchResult, name: 'search-result', props: true }

    ]
  },
  { path: '/article/:id', component: ArticleDetail, name: 'article-detail', props: true },
  { path: '/user/edit', component: UserEdit, name: 'user-edit' }
]

const router = new VueRouter({
  routes
})

const pagePathArr = ['/user', '/user/edit']
// 2. 为路由的实例对象挂载全局前置守卫
router.beforeEach((to, from, next) => {
  if (pagePathArr.indexOf(to.path) !== -1) {
    // 2.1 访问的是有权限的页面，需要判断用户是否登录
    const tokenStr = store.state.tokenInfo.token
    if (tokenStr) {
      next()
    } else {
      next(`/login?pre=${to.fullPath}`)
    }
  } else {
    // 2.2 访问的是没有权限的页面
    console.log('访问不需要权限的页面')
    next()
  }
})
export default router
