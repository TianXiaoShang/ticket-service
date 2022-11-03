const tokenKey = "TOKEN";

const getToken = function () {
  const token = uni.getStorageSync(tokenKey);
  return token ? token : "";
};

const setToken = function (token) {
  uni.setStorageSync(tokenKey, token);
};

const clearToken = function () {
  uni.removeStorageSync(tokenKey);
};

export { getToken, setToken, clearToken };
