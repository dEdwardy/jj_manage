import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import API from '../utils/service'

export default createStore({
  state: {
    uinfo: {},
  },
  getters: {
    uinfo: (state) => state.uinfo,
  },
  mutations: {
    SET_USERINFO(state, uinfo) {
      state.uinfo = uinfo
    },
  },
  actions: {
    login({commit },data){
      return API.post('/auth/login',data).then(res => {
        localStorage.setItem('token',res.data.token)
        commit('SET_USERINFO',res.data)
      })
    }
  },
  modules: {},
  plugins: [createPersistedState()],
})
