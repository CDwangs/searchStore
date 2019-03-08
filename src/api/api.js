import request from '@/utils/request'

export function getCarousel (data) {
  return request({
    url: 'GetCarousel',
    method: 'get',
    params: data
  })
}
