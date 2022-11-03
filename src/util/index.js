import store from "../store";
import {
  getToken as _getToken,
  setToken as _setToken,
  clearToken as _clearToken,
} from "./storage";

// 获取token, 先取store，再去localStorage
const getToken = function () {
  const storeToken = store.getters.token;
  const localToken = _getToken();
  if (storeToken) {
    return storeToken;
  } else {
    store.commit("SET_TOKEN", localToken);
    return localToken;
  }
};

const setToken = function (token) {
  _setToken(token);
  store.commit("SET_TOKEN", token);
};

const clearToken = function () {
  _clearToken(tokenKey);
  store.commit("SET_TOKEN", "");
};

export { setToken, clearToken, getToken };
