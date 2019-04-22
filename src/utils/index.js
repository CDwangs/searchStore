// 防抖
function debounce (func, delay) {
  return function (argus) {
    let that = this
    let _args = argus
    clearInterval(func.id)
    func.id = setTimeout(function () {
      func.call(that, _args) // call方法第一个参数确定新的this指向，后面可以有多个参数是一串参数列表
    }, delay)
  }
}

export {
  debounce
}
