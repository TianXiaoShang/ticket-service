import request from "@/services/request.service";
// import { mapGetters } from "vuex";
import { BASE_URL } from "@/services/environment.service";
import { getToken } from "@/util/index";

export default {
  install(Vue: any) {
    Vue.mixin({
      data() {
        return {
          BASE_URL,
          getToken,
          request,
          triggered: true,
          currentPage: 0,
          pageSize: 20,
          totalCount: 0,
          loadDataLoading: false,
          loading: false,
        };
      },
    //   computed: {
    //     ...mapGetters(["userInfo"]),
    //   },
      methods: {
        goHome(delay = 800) {
          setTimeout(() => {
            uni.reLaunch({ url: `/pages/index/index` });
          }, delay);
        },
        onRestore() {
          (this as any).triggered = true; // 需要重置
        },
        back(lazy = 0) {
          setTimeout(() => {
            uni.navigateBack();
          }, lazy);
        },
      },
    });
  },
};
