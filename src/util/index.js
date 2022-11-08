import store from "../store";
import { getStorage, setStorage, removeStorage } from "./storage";

// 获取token, 先取store，再去localStorage
const tokenKey = "TOKEN";
const getToken = function () {
  const storeToken = store.getters.token;
  const localToken = getStorage(tokenKey);
  if (storeToken) {
    return storeToken;
  } else {
    store.commit("SET_TOKEN", localToken);
    return localToken;
  }
};

const setToken = function (token) {
  setStorage(tokenKey, token);
  store.commit("SET_TOKEN", token);
};

const clearToken = function () {
  removeStorage(tokenKey);
  store.commit("SET_TOKEN", "");
};

// userInfo 不从本地取，每次登陆都会重新获取，之后从store取，写在本地暂时没啥用
const userInfoKey = "USER_INFO";
const setUserInfo = function (userInfo) {
  if (!userInfo) {
    return;
  }
  setStorage(userInfoKey, JSON.stringify(userInfo)); // 写在本地暂时没啥用
  store.commit("UPDATE_USERINFO", userInfo);
};

const clearUserInfo = function () {
  removeStorage(userInfoKey);
  store.commit("UPDATE_USERINFO", {});
};

const query2Obj = (str) => {
  if (typeof str != "string") {
    return str;
  }
  if (str.indexOf("=") < 0) {
    return {};
  }
  const oldArr = str.split("&"),
    obj = {};
  oldArr.forEach((item) => {
    if (item.indexOf("=") > -1) {
      const arr = item.split("=");
      obj[arr[0]] = arr[1];
    }
  });
  return obj;
};

const options2mid = (options) => {
  if (!options.query) {
    return "";
  }
  const scene = decodeURIComponent(options.query.scene);
  if (scene) {
    const obj = query2Obj(scene);
    return obj && obj.mid ? obj.mid : "";
  } else {
    return "";
  }
};


// 获取状态栏尺寸，用于自定义顶部导航栏
const getStatusBarInfo = (function () {
  let info
  let statusBarHeight
  let menuButtonInfo
  let navBarHeight
  let contentWidth

  return function () {
    // 实现函数缓存
    if (!info) {
      // 获取手机系统信息
      info = uni.getSystemInfoSync();
      // 设置状态栏高度（H5顶部无状态栏小程序有状态栏需要撑起高度）
      statusBarHeight = info.statusBarHeight;
      menuButtonInfo = uni.getMenuButtonBoundingClientRect();
      // 胶囊高度 + (胶囊顶部高度 - 状态栏内的高度)【胶囊上方到状态栏到间隙*2，保证上下对称】 * 2 = 导航栏的高度
      navBarHeight = menuButtonInfo.height + (menuButtonInfo.top - info.statusBarHeight) * 2 ;
      contentWidth = menuButtonInfo.left;
    }
    return {
      statusBarHeight,
      navBarHeight,
      contentWidth
    }
  }
})()

export {
  setToken,
  clearToken,
  getToken,
  setUserInfo,
  clearUserInfo,
  query2Obj,
  options2mid,
  getStatusBarInfo
};
