import router from '@/router'
// import store from '@/store'
import {
  getToken
} from './auth'

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }

  if (getToken()) {
    next()
  } else {
    if (to.meta.preview) { // 商品预览页面
      next()
    } else {
      // eslint-disable-next-line no-inner-declarations
      async function getuser () {
        return JSBridgeFunction.JsGetUserInfo()
      }
      getuser().then(res => {
        next()
      })
    }
  }
})

router.afterEach(() => {
  // NProgress.done() // 结束Progress
})
