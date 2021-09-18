import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const stateStr = localStorage.getItem('state')
// 初始的 state 对象
const initState = {
  tokenInfo: {}
}
if (stateStr) {
  // 加载本地的数据
  initState.tokenInfo = JSON.parse(stateStr)
}

export default new Vuex.Store({
  state: initState,
  mutations: {
    // 更新 tokenInfo 数据的方法
    updateTokenInfo (state, payload) {
      // 把提交过来的 payload 对象， 作为 tokenInfo 的值
      state.tokenInfo = payload
      // 测试 state 中是否有数据
      console.log(state)
      // 如果希望在 Mutation A 中 调用 Mutation B，需要通过 this.commit() 方法来实现
      // this 表示当前的new 出阿里的store实例对象
      this.commit('saveStateToStorage')
    },
    // 将 state 持久化存储到本地
    saveStateToStorage (state) {
      localStorage.setItem('state', JSON.stringify(state))
    }
  },
  actions: {
  },
  modules: {
  }
})
