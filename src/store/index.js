import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用来存储token信息的对象，将来这个对象中会包含两个属性 {token, refresh_token}
    tokenInfo: {}
  },
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
