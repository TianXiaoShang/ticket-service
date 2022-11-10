import request from "@/services/request.service";
import store from "../store";
import { setToken, setUserInfo } from "./index";

const setInfo = (member) => {
  if (!member) {
    return;
  }
  const token = member.token || "";
  setToken(token);
  setUserInfo(member || {});
};

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
            setInfo(res.member);
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

const getUserProfile = () => {
  return new Promise((resolve, reject) => {
    // #ifdef MP-TOUTIAO
    console.log("getuserInfo-toutiao");
    resolve();
    // #endif

    // #ifdef MP-WEIXIN
    wx.getUserProfile({
      desc: "用于完善会员资料",
      success: (result) => {
        request("member.update", result.userInfo).then(
          (res) => {
            if (res.member) {
              setInfo(res.member);
              resolve(res.member);
            }
          },
          () => {
            reject();
          }
        );
      },
      fail: (err) => {
        console.log(err, "getUserProfile-fail");
        uni.showToast({
          title: "用户拒绝授权", // 用户油盐不进，实在没办法
          icon: "none",
        });
        reject();
      },
    });
    // #endif
  });
};

const getPhoneNumber = (res) => {
  return new Promise((resolve, reject) => {
    if (res.detail.errMsg.includes("fail")) {
      uni.showToast({
        title: "授权失败", // 大概率是拒绝授权，用户油盐不进，实在没办法
        icon: "none",
      });
      reject();
      return;
    }
    const params = {
      iv: res.detail.iv,
      data: res.detail.encryptedData,
    };
    request("member.mobile", params).then(
      (res) => {
        uni.showToast({
          title: "授权成功",
          icon: "none",
        });
        setInfo(res.member);
        resolve(res.member);
      },
      () => reject()
    );
  });
};

const initCinemaConfig = async () => {
  try {
    // 获取影院信息
    const setRes = await request("set");
    store.commit("SET_SETTING", setRes.set);
    const cinemaRes = await request("cinema");
    store.commit("SET_CINEMA", cinemaRes.cinema);
    const obj = { setting: setRes.set, cinema: cinemaRes.cinema };
    uni.$emit("onInitCinemaSetting", obj);
    return obj;
  } catch (error) {
    uni.$emit("onInitCinemaSetting", false);
    return false;
  }
};

export { login, getUserProfile, getPhoneNumber, initCinemaConfig };
