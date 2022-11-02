import Vue from 'vue'
import Vuex from 'vuex'
import { setToken, clearToken } from '@/util/storage';

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        loginStatus: false, // 获取登陆状态
        token: null,
        userInfo: {}, // 储存来自weixin授权的用户信息（头像信息等）
    },
    getters: {
        loginStatus: state => state.loginStatus,
        userInfo: state => state.userInfo,
        token: state => state.token,
    },
    mutations: {
        // 登陆，更新状态
        LOGIN(state, value) {
            state.loginStatus = value;
        },
        // 登出
        LOGOUT(state) {
            state.loginStatus = false;
            state.token = null;
            clearToken();
        },
        SET_TOKEN(state, value){
            state.token = value;
            setToken(value);
        },
        UPDATE_USERINFO(state, value) {
            state.userInfo = value;
        },
    },
})

export default store;