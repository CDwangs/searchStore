import axios from 'axios'
import store from '@/store'
// 创建axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api的base_url
  timeout: 25000 // 请求超时时间
})
// request 拦截器
service.interceptors.request.use(
  config => {
    // loading + 1
    if (!config.noLoading) {
      store.dispatch('SetLoading', true)
    }

    return config
  },
  error => {
    // loading 清 0
    setTimeout(function () {
      store.dispatch('SetLoading', 0)
    }, 300)
    console.log(error)
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // loading - 1
    if (!response.config.noLoading) {
      store.dispatch('SetLoading', false)
    }
    return res
  },
  error => {
    // loading - 1
    console.log(error)
    if (!error.config.noLoading) {
      store.dispatch('SetLoading', false)
    }
    return Promise.reject(error)
  }
)

export default service
