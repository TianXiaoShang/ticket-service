import request from "@/services/request.service";
import store from "../store";
import { setToken, setUserInfo } from "./index";

const login = (mid) => {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    store.commit("LOGIN", false);
    uni.login({
      provider: "weixin", // 使用微信登录
      success: (loginRes) => {
        request(
          "member.login",
          { code: loginRes.code, member_id: mid },
          "POST"
        ).then(
          (res) => {
            const token = res.member.token || "";
            setToken(token);
            setUserInfo(res.member || {});
            store.commit("LOGIN", true);
            resolve();
          },
          () => {
            reject();
            store.commit("LOGIN", false);
          }
        );
      },
      fail: () => {
        // 状态变成完成
        store.commit("LOGIN", false);
        reject();
      },
    });
    // #endif

    // #ifdef MP-TOUTIAO
    resolve();
    store.commit("LOGIN", true);
    // #endif
  });
};

export { login };
