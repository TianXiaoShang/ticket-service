import { BASE_URL } from "@/services/environment.service";
import { getToken } from "@/util/index";
// import app from "@/main";

type Method =
  | "POST"
  | "OPTIONS"
  | "GET"
  | "HEAD"
  | "PUT"
  | "DELETE"
  | "TRACE"
  | "CONNECT"
  | undefined;

const request = function (
  path: string,
  data: any,
  method: Method = "GET",
  noDirect: boolean = true
) {
  return new Promise((resolve, reject) => {
    let token = getToken() || "";
    let url = BASE_URL + `${path}`;
    // (app as any).$Loading.show();
    uni.request({
      url,
      method,
      data,
      header: {
        cookie: token,
      },
      success: (response) => {
        const res = response as any;
        console.log(res, "rrrrrrrr");
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
            uni.showToast({ title: res.data.message });
          } else if (res.data.errno === 303) {
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
            resolve(res.data);
          }
        } else {
          reject(res);
        }
      },
      fail: (err) => {
        console.error("接口请求失败:", err);
        reject(err);
      },
      complete: () => {
        // (app as any).$Loading.hidden();
      },
    });
  });
};

export default request;
