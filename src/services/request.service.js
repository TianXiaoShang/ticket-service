import { BASE_URL } from "@/services/environment.service";
import { getToken } from "@/util";
import { login } from "@/util/base";
import store from "@/store";

// TAG-noDirect在旧版有地方用到，之后核对
const request = function (path, data = {}, method = "GET", noDirect = true) {
  return new Promise((resolve, reject) => {
    const token = getToken() || "";
    data.token = token;
    // data.showLoading为false则关闭loading，其他值都为打开
    const showLoading = data.showLoading === false ? false : true;
    if (showLoading === false) {
      delete data.showLoading;
    }
    if (showLoading) {
      store.commit("SHOW_LOADING", "");
    }
    uni.request({
      url: BASE_URL + `${path}`,
      method,
      data,
      header: {
        "content-type":
          method === "GET"
            ? "application/json"
            : "application/x-www-form-urlencoded",
      },
      success: (res) => {
        if (res.statusCode == 200) {
          if (res.data.errno === -1) {
            uni.showModal({
              title: "提示",
              content: res.data.message,
              showCancel: false,
              success: function () {
                if (!noDirect) {
                  res.data.url
                    ? uni.redirectTo({
                        url: res.data.url,
                        fail: () => {
                          uni.switchTab({
                            url: res.data.url,
                          });
                        },
                      })
                    : uni.navigateBack();
                } else {
                  reject(res.data);
                }
              },
            });
          } else if (res.data.errno === 0) {
            uni.showToast({ title: res.data.message, icon: "none" });
          } else if (res.data.errno === 303) {   // 登陆失效
            store.commit("LOGOUT");
            getCurrentPages().length > 1
              ? uni.redirectTo({
                  url: "/pages/auth/auth",
                })
              : uni.navigateTo({
                  url: "/pages/auth/auth",
                });
          } else if (res.data.errno === 404) {
            uni.redirectTo({
              url: "/pages/error/error",
            });
            uni.showToast({ title: "请求错误" });
          } else {
            resolve(res.data.data);
          }
        } else {
          reject(res.data);
        }
      },
      fail: (err) => {
        console.error("接口请求失败:", err);
        reject(err);
      },
      complete: () => {
        if (showLoading) {
          store.commit("HIDE_LOADING");
        }
      },
    });
  });
};

export default request;
