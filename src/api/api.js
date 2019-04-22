import request from '@/utils/request'

function getCarousel (data) {
  return request({
    url: 'BusinessShop/GetCarousel',
    method: 'get',
    params: data
  })
}

function getNearbyStores (data) {
  return request({
    url: 'BusinessShop/GetNearbyStores',
    method: 'post',
    data: data
  })
}

function searchStore (data) {
  return request({
    url: 'BusinessShop/searchStore',
    method: 'post',
    data: data
  })
}

function getStoreDetail (data) {
  return request({
    url: 'BusinessShop/storeDetail',
    method: 'post',
    data: data
  })
}

function getReviews (data) {
  return request({
    url: 'Products/getReviews',
    method: 'post',
    data: data
  })
}

function commodityDetail (data) {
  return request({
    url: 'Products/CommodityDetail',
    method: 'post',
    data: data
  })
}

function getKind (data) {
  return request({
    url: 'Products/GetKind',
    method: 'post',
    data: data,
    noLoading: true
  })
}

function newGoToPay (data) {
  return request({
    url: 'BusinessOrder/newGoToPay',
    method: 'post',
    data: data
  })
}

function getOrderList (data) {
  return request({
    url: 'BusinessOrder/getOrderList',
    method: 'post',
    data: data
  })
}

function getOrderDetail (data) {
  return request({
    url: 'BusinessOrder/getOrderDetail',
    method: 'post',
    data: data
  })
}

function newGoToPayFace (data) {
  return request({
    url: 'BusinessOrder/newGoToPayFace',
    method: 'post',
    data: data
  })
}

function CustomerBackMoney (data) {
  return request({
    url: 'BusinessOrder/CustomerBackMoney',
    method: 'post',
    data: data
  })
}

function submitReviews (data) {
  return request({
    url: 'Products/submitReviews',
    method: 'post',
    data: data
  })
}

export {
  getCarousel,
  getNearbyStores,
  getStoreDetail,
  getReviews,
  commodityDetail,
  getKind,
  searchStore,
  newGoToPay,
  getOrderList,
  getOrderDetail,
  submitReviews,
  newGoToPayFace,
  CustomerBackMoney
}
