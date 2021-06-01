import axios from 'axios'
import { useStore } from 'vuex'

const instance = axios.create({
  baseURL: 'http://localhost:3000'
})
instance.interceptors.request.use(config => {
  // const { state } = useStore()
  const token = localStorage.getItem('token')
  if(token){
    config.headers.token = `Bear ${token}`
  }
  return config
},err =>{
  return Promise.reject(err)
})
instance.interceptors.response.use(res => {
  return res.data
},err => {
  return Promise.reject(err)
})
export default instance
