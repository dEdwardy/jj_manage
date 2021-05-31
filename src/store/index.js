import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  state: {
    uinfo: {},
  },
  getters: {
    uinfo: (state) => state.uinfo,
  },
  mutations: {
    setUserInfo(state, uinfo) {
      state.uinfo = uinfo
    },
  },
  actions: {},
  modules: {},
  plugins: [createPersistedState()],
})
