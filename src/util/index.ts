import store from '../store'

// 获取token
const getToken = function () {
  return store.getters.token
}


export {
  getToken,
}
