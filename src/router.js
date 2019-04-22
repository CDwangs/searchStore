import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [{
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: '找门店'
    }
  },
  {
    path: '/storeDetail',
    name: 'storeDetail',
    meta: {
      title: '门店详情'
    },
    component: () => import('./views/storeDetail.vue')
  },
  {
    path: '/commodityDetail',
    name: 'commodityDetail',
    meta: {
      title: '商品详情'
    },
    component: () => import('./views/commodityDetail.vue')
  },
  {
    path: '/commodityPreview',
    name: 'commodityPreview',
    meta: {
      title: '商品预览',
      preview: true
    },
    component: () => import('./views/commodityPreview.vue')
  },
  {
    path: '/storeEvaluation',
    name: 'storeEvaluation',
    meta: {
      title: '门店评价'
    },
    component: () => import('./views/storeEvaluation.vue')
  },
  {
    path: '/storeList',
    name: 'storeList',
    meta: {
      title: '找门店'
    },
    component: () => import('./views/storeList.vue')
  },
  {
    path: '/storeMap',
    name: 'storeMap',
    meta: {
      title: '找门店'
    },
    component: () => import('./views/storeMap.vue')
  },
  {
    path: '/orderList',
    name: 'orderList',
    meta: {
      title: '订单列表'
    },
    component: () => import('./views/orderList.vue')
  },
  {
    path: '/orderDetail',
    name: 'orderDetail',
    meta: {
      title: '订单详情'
    },
    component: () => import('./views/orderDetail.vue')
  },
  {
    path: '/evaluate',
    name: 'evaluate',
    meta: {
      title: '订单评价'
    },
    component: () => import('./views/evaluate.vue')
  },
  {
    path: '/payFace',
    name: 'payFace',
    meta: {
      title: '订单支付中'
    },
    component: () => import('./views/payFace.vue')
  }
  ]
})
