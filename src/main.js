import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// #region 导入并注册所有的Vant组件
// 一次性、完整导入并注册所有vant组件的优缺点:
// 优点: 所有vant组件都进行了全局的注册。在每个组件中，不再需要按需引入并注册组件了
// 缺点: 项目中没有用到的组件也会被打包进来，导致打包体积过大的问题(此问题在项目发布时，可通过cdn加速解决)
import Vant from 'vant'
import 'vant/lib/index.css'
// #endregion

// #region 配置 amfe-flexible
import 'amfe-flexible'

Vue.config.productionTip = false
Vue.use(Vant)
// #endregion

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
