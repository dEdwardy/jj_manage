import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import API from '../utils/service'

export default createStore({
  state: {
    uinfo: {},
    dict:{ },
    loadingCount:0
  },
  getters: {
    uinfo: (state) => state.uinfo,
    dict: state => state.dict
  },
  mutations: {
    SET_USERINFO(state, uinfo) {
      state.uinfo = uinfo
    },
    SET_DICT(state, dict) {
      state.dict = dict
    },
  },
  actions: {
    login({commit },data){
      return API.post('/auth/login',data).then(res => {
        localStorage.setItem('token',res.data.token)
        commit('SET_USERINFO',res.data)
        return res.data
      })
    },
    getDict({ commit }) {
      return API.get('/user/dict').then(res => {
        commit('SET_DICT',res.data)
        return res.data
      })
    }
  },
  modules: {},
  plugins: [createPersistedState()],
})
