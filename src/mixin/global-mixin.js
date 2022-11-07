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
        ...mapGetters(["userInfo"]),
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
      },
    });
  },
};
