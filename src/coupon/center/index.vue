<template>
    <div class="page-box box-border">
        <loading />
        <div class="text-0px">
            <image class="w-full h-28.75vw" src="../static/getCoupon@2x.png" />
        </div>
        <!-- tab内容 -->
        <div style="height: calc(100vh - 28.75vw + 15px);border-radius: 10px 10px 0 0"
            class="w-full box-border bg-gray-bg p-20px -mt-15px z-999 relative overflow-hidden">
            <div v-if="!conpupList || !conpupList.length" class="mt-10px">
                <u-empty mode="coupon" text="暂无优惠券" icon="http://cdn.uviewui.com/uview/empty/coupon.png">
                </u-empty>
            </div>
            <!-- 优惠券列表 -->
            <template v-else>
                <scroll-view scroll-y="true" style="height: calc(100vh - 40px - 28.75vw + 15px);">
                    <div v-for="(item, index) in conpupList" :key="index" class="mb-10px">
                        <coupon-item :conpupData="item"></coupon-item>
                    </div>
                </scroll-view>
            </template>
        </div>
    </div>
</template>

<script>
import CouponItem from '../components/coupon-item.vue'
export default {
    components: { CouponItem },
    data() {
        return {
            conpupList: [],
        }
    },
    onLoad() {
        // 确保已经登录完成
        this.waitLogin().then(() => {
            this.getData();
        });
    },
    methods: {
        toDetail(item) {
            this.toPath('/order/detail/index?id=' + item.id)
        },
        getData() {
            this.request("coupon", { openid: this.userInfo.openid }).then(res => {
                this.conpupList = res.coupons;
            })
        },
    },
};
</script>
