import { BASE_URL } from "@/services/environment.service";
import { getToken } from "@/util";
import store from "@/store";

// TAG-noDirect在旧版有地方用到，之后核对
const request = function (path, data = {}, method = "GET", noDirect = true) {
  return new Promise((resolve, reject) => {
    const token = getToken() || "";
    data.token = token;
    // data._showLoading为false则关闭loading，其他值都为打开
    const _showLoading = data._showLoading === false ? false : true;
    if (_showLoading === false) {
      delete data._showLoading;
    }
    // data.showToast为ftrue则提示返回的message，其他值都关闭
    const _showToast = data._showToast === true ? true : false;
    if (_showToast === true) {
      delete data._showToast;
    }
    if (_showLoading) {
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
                  reject(res.data);
                } else {
                  reject(res.data);
                }
              },
            });
          } else if (res.data.errno === 0) {
            // 错误信息一般默认展示，特殊情况通过store控制
            if (!store.state.hideErrorMessage) {
              uni.showToast({ title: res.data.message, icon: "none" });
            }
            reject(res.data);
          } else if (res.data.errno === 303) {
            // 登录失效
            store.commit("LOGOUT");
            getCurrentPages().length > 1
              ? uni.redirectTo({
                  url: "/pages/auth/index",
                })
              : uni.navigateTo({
                  url: "/pages/auth/index",
                });
            reject(res.data);
          } else if (res.data.errno === 404) {
            uni.redirectTo({
              url: "/pages/error/error",
            });
            uni.showToast({ title: "请求错误" });
            reject(res.data);
          } else if (res.data.errno === 1) {
            // 请求成功
            if (_showToast) {
              uni.showToast({
                title: res.data.message || "操作成功",
                icon: "none",
              });
            }
            resolve(res.data.data);
          } else {
            reject(res.data);
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
        if (_showLoading) {
          store.commit("HIDE_LOADING");
        }
      },
    });
  });
};

export default request;
