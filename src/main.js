import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/icons'
import '@/utils/permission'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import '@/style/reset.css'
import '@/style/mintTheme.scss'
import 'lib-flexible'
import VueAMap from 'vue-amap'
// 图片轮播
import gallery from 'img-vuer'

VueAMap.initAMapApiLoader({
  key: '5a8a624002fa4383a91eff00b2eabcd1',
  plugin: ['AMap.Geolocation', 'AMap.Driving'],
  uiVersion: '1.0'
})
Vue.use(VueAMap)
Vue.use(gallery, {
  swipeThreshold: 150 // default 100 ,new in 0.12.0
})
Vue.config.productionTip = false
Vue.use(MintUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
