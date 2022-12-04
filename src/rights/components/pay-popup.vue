<template>
    <div>
        <!-- 权益卡兑换须知 -->
        <u-popup :show="showReadPopup" :round="20" @close="showReadPopup = false">
            <div class="w-full">
                <div class="text-gray-333 px-20px pt-20px pb-10px flex justify-between items-center border-l-0 border-t-0 border-r-0 
                    border-b-1px border-gray-100 border-solid text-16 font-semibold ">
                    <span> 兑换需知 </span>
                    <span>
                        <u-icon name="close" size="18px" @click="showReadPopup = false"></u-icon>
                    </span>
                </div>
                <scroll-view :refresher-enabled="false" @scrolltolower="onPlaceScrolltolower" scroll-y="true"
                    class="page-container box-border" style="height: calc(75vh - 50px - 40px);"
                    scroll-into-view="content-wrap">
                    <div id="content-wrap" class="p-15px text-14px text-gray-555 leading-5"
                        style="white-space: pre-line;">
                        {{ rightsData.clause }}
                    </div>
                </scroll-view>
                <div class="pt-10px">
                    <u-button shape="circle" size="normal" :customStyle="{ height: '44px', width: '200px' }"
                        color="linear-gradient(180deg, #FF545C 0%, #FF545C 100%);" :disabled="!isPlaceScrolltolower"
                        :text="isPlaceScrolltolower ? '同意' : '请上滑阅读完成后继续'" @click="toPay()">
                    </u-button>
                </div>
            </div>
        </u-popup>
    </div>
</template>


<script>
export default {
    props: {
        rightsData: Object,
        customEvent: Boolean
    },
    data() {
        return {
            showReadPopup: false,
            isPlaceScrolltolower: false,
        }
    },
    methods: {
        toPay() {
            if (this.customEvent) {
                this.$emit('customEvent');
                return;
            }
            this.request(
                "annual.buy.pays",
                {
                    card_id: this.rightsData.id,
                    openid: this.userInfo.openid,
                    noDirect: true,
                },
                "POST"
            )
                .then(
                    (result) => {
                        if (this.isWx) {
                            const wechat = result.wechat
                            wx.requestPayment({
                                timeStamp: wechat.timeStamp,
                                nonceStr: wechat.nonceStr,
                                package: wechat.package,
                                signType: wechat.signType,
                                paySign: wechat.paySign,
                                success: () => {
                                    this.$emit("success")
                                    uni.showToast({
                                        icon: "success",
                                        title: "支付成功",
                                    })
                                    this.showReadPopup = false;
                                    uni.navigateTo({
                                        url: `/rights/detail/index?isPaid=1&id=${this.rightsData.id}`,
                                    })
                                },
                                fail: () => {
                                    this.showReadPopup = false;
                                    uni.showToast({
                                        title: "支付失败",
                                        icon: "none",
                                    })
                                },
                            })
                        } else {
                            // TAG - 抖音支付还未对接
                            uni.showToast({
                                title: "抖音端支付待开发",
                                icon: "none",
                            })
                        }
                    },
                    () => {
                        this.showReadPopup = false;
                    }
                )
        },
        onPlaceScrolltolower() {
            this.isPlaceScrolltolower = true;
        },
        showPayPopup() {
            this.showReadPopup = true;
            this.isPlaceScrolltolower = false;
        },
        hidePayPopup() {
            this.showReadPopup = false;
        }
    },
};
</script>


<style lang="scss" scoped>

</style>