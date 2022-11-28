import request from "@/services/request.service";
import { mapGetters } from "vuex";
import { BASE_URL } from "@/services/environment.service";
import store from "@/store";
import { getMember } from "@/api/common.js";
import { setUserInfo } from "@/util";
import moment from "moment";

export default {
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          BASE_URL,
          moment,
          isWx: false, // 判断微信还是抖音
          request,
          triggered: true,
          currentPage: 0,
          pageSize: 20,
          totalCount: 0,
          pageLoad: false,
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
        ...mapGetters(["userInfo", "loginStatus", "setting", "cinema"]),
        isMovieMode() {
          return this.setting ? this.setting.is_pattern == 0 : true; // 默认影院模式, 剧院模式 is_pattern == 1   /   影院模式 is_pattern == 0
        },
      },
      created() {
        // 微信小程序实现顶部透明
        // #ifdef MP-WEIXIN
        this.isWx = true;
        // #endif
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
        back(delay = 0) {
          setTimeout(() => {
            uni.navigateBack();
          }, delay);
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
            } else {
              uni.$on("onLogin", (value) => {
                if (value) {
                  resolve();
                } else {
                  reject();
                }
              });
            }
          });
        },
        // 等待影院基础配置完成
        waitInitConfig() {
          return new Promise((resolve, reject) => {
            if (this.setting && this.cinema) {
              resolve();
            } else {
              uni.$on("onInitCinemaSetting", (value) => {
                if (value) {
                  resolve();
                } else {
                  reject();
                }
              });
            }
          });
        },
        // 个人详细业务数据，因为要多次获取后进行更新storage和store的全局个人资料，所以封装了一层去调用setUserInfo
        getMember(openid) {
          return new Promise((resolve, reject) => {
            getMember(openid).then(
              (res) => {
                // res.member与login接口返回的数据相同，都是个人基本资料
                setUserInfo(res.member);
                resolve(res);
              },
              () => reject()
            );
          });
        },
        onCopy(value) {
          uni.setClipboardData({
            data: value,
            success: function () {
              console.log("onCopy-success");
            },
          });
        },
      },
      onHide() {
        // 不管是否使用了waitLogin都进行解除监听，防止重复监听onLogin
        // 本质上使用waitLogin方式只是为了等登陆完成，不需要重复执行回调，尽管promise状态不会再次改变
        uni.$off("onLogin");
        // 同上理
        uni.$off("onInitCinemaSetting");
      },
    });
  },
};
