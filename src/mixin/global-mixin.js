import request from "@/services/request.service";
import { mapGetters } from "vuex";
import { BASE_URL } from "@/services/environment.service";
import store from "@/store";

export default {
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          BASE_URL,
          request,
          triggered: true,
          currentPage: 0,
          pageSize: 20,
          totalCount: 0,
          _loading: {
            show(text) {
              store.commit("SHOW_LOADING", text);
            },
            hide() {
              store.commit("HIDE_LOADING");
            },
          },
        };
      },
      computed: {
        ...mapGetters(["userInfo", "loginStatus"]),
      },
      methods: {
        goHome(delay = 800) {
          setTimeout(() => {
            uni.reLaunch({ url: `/pages/index/index` });
          }, delay);
        },
        onRestore() {
          this.triggered = true; // 需要重置
        },
        back(lazy = 0) {
          setTimeout(() => {
            uni.navigateBack();
          }, lazy);
        },
        // 其实只是检测有没有授权用户信息。小程序初始化时已经直接静默登陆了
        checkAuth() {
          return !!this.userInfo.nickname;
        },
        // 等待登陆完成，一般来说登陆一定会成功，除非接口挂了
        waitLogin() {
          return new Promise((resolve, reject) => {
            if (this.loginStatus) {
              resolve();
            }
            uni.$on("onLogin", (value) => {
              if (value) {
                resolve();
              } else {
                reject();
              }
            });
          });
        },
      },
      // 如果使用了waitLogin则需要解除监听，防止重复监听，本质上使用waitLogin方式只是为了等登陆完成，不需要重复执行回调
      onHide() {
        uni.$off("onLogin");
      },
    });
  },
};
