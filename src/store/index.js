import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    loginStatus: false, // 获取登陆状态
    token: null, // token
    userInfo: {}, // 储存来自weixin授权的用户信息（头像信息等）
    globalLoadings: [], // loading组件控制
    globalLoadingText: "", // loading组件文本
    cinema: null, // 影院信息
    setting: null, // 影院配置信息
    userLocation: null, // 用户位置坐标信息
  },
  getters: {
    loginStatus: (state) => state.loginStatus,
    userInfo: (state) => state.userInfo,
    token: (state) => state.token,
    globalLoadingText: (state) => state.globalLoadingText,
    globalLoadings: (state) => state.globalLoadings,
    cinema: (state) => state.cinema,
    setting: (state) => state.setting,
    userLocation: (state) => state.userLocation,
  },
  mutations: {
    SHOW_LOADING(state, value) {
      state.globalLoadings.push("show");
      state.globalLoadingText = value;
    },
    HIDE_LOADING(state) {
      if(state.globalLoadings.length){
        state.globalLoadings.pop();
      }
    },
    // 存储当前影院信息
    SET_CINEMA(state, val) {
      state.cinema = val;
    },
    // 存储当前影院配置信息
    SET_SETTING(state, val) {
      state.setting = val;
    },
    SET_POS(state, val) {
      state.userLocation = val;
    },
    // 登陆，更新状态
    LOGIN(state, value) {
      // 触发全局登陆完成事件
      uni.$emit("onLogin", value);
      state.loginStatus = value;
    },
    // 登出
    LOGOUT(state) {
      state.loginStatus = false;
      state.token = null;
      state.userInfo = {};
    },
    SET_TOKEN(state, value) {
      state.token = value;
    },
    UPDATE_USERINFO(state, value) {
      state.userInfo = value;
    },
  },
});

export default store;
