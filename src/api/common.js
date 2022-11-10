/**
 * 注！！！只有重复使用的接口才会在api进行抽离定义，否则会直接写在页面内；
 */

import request from "@/services/request.service";

const getMember = (openid) => {
  return request("member", { openid: openid });
};

const commissionConfig = () => {
  return request("commission.set");
};

export { getMember, commissionConfig };
