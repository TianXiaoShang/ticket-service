import store from "../store";
import { getStorage, setStorage, removeStorage } from "./storage";

// 获取token, 先取store，再去localStorage
const tokenKey = "TOKEN";
const getToken = function () {
  const storeToken = store.state.token;
  const localToken = getStorage(tokenKey);
  if (storeToken) {
    return storeToken;
  } else {
    store.commit("SET_TOKEN", localToken);
    return localToken;
  }
};

const setToken = function (token) {
  console.log(token, '--------');
  setStorage(tokenKey, token);
  store.commit("SET_TOKEN", token);
};

const clearToken = function () {
  removeStorage(tokenKey);
  store.commit("SET_TOKEN", "");
};

// userInfo 不从本地取，每次登录都会重新获取，之后从store取，写在本地暂时没啥用
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
  let info;
  let statusBarHeight;
  let menuButtonInfo;
  let navBarHeight;
  let contentWidth;

  return function () {
    // 实现函数缓存
    if (!info) {
      // 获取手机系统信息
      info = uni.getSystemInfoSync();
      // 设置状态栏高度（H5顶部无状态栏小程序有状态栏需要撑起高度）
      statusBarHeight = info.statusBarHeight;
      menuButtonInfo = uni.getMenuButtonBoundingClientRect();
      // 胶囊高度 + (胶囊顶部高度 - 状态栏内的高度)【胶囊上方到状态栏到间隙*2，保证上下对称】 * 2 = 导航栏的高度
      navBarHeight =
        menuButtonInfo.height + (menuButtonInfo.top - info.statusBarHeight) * 2;
      contentWidth = menuButtonInfo.left;
    }
    return {
      statusBarHeight,
      navBarHeight,
      contentWidth,
    };
  };
})();

// 拨打电话
const sendCall = (number) => {
  if (!number) {
    uni.showToast({
      title: "无号码",
      icon: "none",
    });
    return;
  }
  uni.makePhoneCall({
    phoneNumber: number,
  });
};
// 打开地图
const openMap = (data) => {
  // 如果is_address为1则使用独立地址，根据影片走，否则用影院的基础配置数据
  const ops = { lat: "", lng: "", address: "" };
  if (data.is_address == 1) {
    ops.lat = data.lat;
    ops.lng = data.lng;
    ops.address = data.address;
  }
  uni.openLocation({
    latitude: Number(ops.lat ? ops.lat : store.state.cinema.lat),
    longitude: Number(ops.lng ? ops.lng : store.state.cinema.lng),
    scale: 15,
    name: store.state.cinema.title,
    address: ops.address ? ops.address : store.state.cinema.address,
  });
};

// 常用富文本解析
const parseRichText = (str) => {
  str = str.replace(/&nbsp;/g, " ");
  str = str.replace(/&quot;/g, "'");
  str = str.replace(/&amp;/g, "&");
  str = str.replace(/&lt;/g, "<");
  str = str.replace(/&gt;/g, ">");
  str = str.replace(/&#8226;/g, "•");
  return str;
};

const getSafeAreaInsets = () => {
  const systemInfo = uni.getSystemInfoSync();
  const safeAreaInsets =
    systemInfo.platform === "ios" || systemInfo.platform === "devtools"
      ? systemInfo.safeAreaInsets.bottom
      : 0;
  return safeAreaInsets;
};

export {
  setToken,
  clearToken,
  getToken,
  setUserInfo,
  clearUserInfo,
  query2Obj,
  options2mid,
  getStatusBarInfo,
  sendCall,
  openMap,
  parseRichText,
  getSafeAreaInsets,
};
