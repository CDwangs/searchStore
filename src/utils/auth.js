import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken () {
  return sessionStorage.getItem(TokenKey)
  // return Cookies.get(TokenKey)
}

export function setToken (token) {
  // return Cookies.set(TokenKey, token)
  return sessionStorage.setItem(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

export function pay (billcode) {
  let success = window.location.href.split('#')[0] + '#/orderList'
  JSBridgeFunction.JsJumpPageInfo(2, '{ "BillCode":"' + billcode + '","Url":"' + success + '"}')
}
// 支付后关闭webview
export function payFace (billcode) {
  let params = {
    'iOS': {
      'SBName': 'OrderStoryboard',
      'PageIdentify': 'PayVC',
      'Paras': {
        'billCode/String': billcode
      }
    },
    'Android': {
      'PageName': 'wxapi.WXPayEntryActivity',
      'Paras': {
        'pay-bill-code/String': billcode
      },
      'NeedLogin': true,
      'FinishWebActivity': true
    }
  }
  JSBridgeFunction.JsJumpToPage(JSON.stringify(params))
}
