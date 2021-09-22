import Vue from 'vue'
import dayjs from 'dayjs'

// 导入计算相对时间的插件
import relativeTime from 'dayjs/plugin/relativeTime'

// 导入中文语言包
import zh from 'dayjs/locale/zh-cn'
import App from './App.vue'
import router from './router'
import store from './store'

// #region 导入并注册所有的Vant组件
// 一次性、完整导入并注册所有vant组件的优缺点:
// 优点: 所有vant组件都进行了全局的注册。在每个组件中，不再需要按需引入并注册组件了
// 缺点: 项目中没有用到的组件也会被打包进来，导致打包体积过大的问题(此问题在项目发布时，可通过cdn加速解决)
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.less'
// #endregion

// #region 配置 amfe-flexible
import 'amfe-flexible'

Vue.config.productionTip = false
Vue.use(Vant)
Vue.use(Lazyload)
// #endregion

// #region 配置day.js
// 配置“计算相对时间”的插件
dayjs.extend(relativeTime)

// 配置中文语言包
dayjs.locale(zh)

Vue.filter('dateFormat', dt => {
  // 调用 dayjs() 得到的是当前的时间
  // .to() 方法的返回值，是计算出来的“相对时间”
  return dayjs().to(dt)
})
// #endregion

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
