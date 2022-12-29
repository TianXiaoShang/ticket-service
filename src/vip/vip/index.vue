<template>
    <div class="page-box box-border" style="background: #242c4d">
        <loading />
        <!-- 自定义导航 -->
        <nav-bar v-if="isWx" :title="'会员中心'" :theme="'dark'" showBack :backgroundColor="'transparent'"></nav-bar>
        <!-- 背景 -->
        <div class="fixed h-100vh overflow-hidden left-0 top-0 w-100vw">
            <image src="../static/bg-vip@2x.png" mode="widthFix" class="w-full" />
        </div>

        <!-- 内容区域 -->
        <div class="relative z-99 text-14px mt-30px px-20px">
            <div class="flex justify-between items-center">
                <div class="flex items-center">
                    <div
                        class="rounded-full border-solid shadow-lg border-2 border-white box-border overflow-hidden w-50px h-50px">
                        <image :src="(member.avatar || DEFAULT_AVATAR)" class="w-full h-full" />
                    </div>
                    <div class="text-20px text-white font-semibold ml-10px">
                        {{ member.nickname }}
                    </div>
                </div>
                <div>
                    <span class="flex items-center" v-if="member.card_no" @click="toPath('/vip/record/index')">
                        <image class="w-14px h-14px mr-6px" src="../static/findvip@2x.png" />
                        <span class="text-white text-14px">余额记录</span>
                    </span>
                    <span class="flex items-center mt-8px" v-if="!member.card_no" @click="toPath('/vip/find/index')">
                        <image class="w-14px h-14px mr-6px" src="../static/balance-history@3x.png" />
                        <span class="text-white text-14px">找回会员</span>
                    </span>
                    <span class="flex items-center mt-8px" v-if="(member.card_no && !card.name)"
                        @click="toPath('/vip/perfect/index')">
                        <image class="w-14px h-14px mr-6px" src="../static/wszl.png" />
                        <span class="text-white text-14px">完善资料</span>
                    </span>
                </div>
            </div>
            <div class="mt-20px w-full h-31.52vw box-border overflow-hidden" style="border-raidus: 15px 15px 0 0;">
                <div class="h-31.52vw absolute left-0 right-0 px-20px text-0px box-border">
                    <image class="h-full w-full" src="../static/vipcard2@2x.png" />
                </div>
                <div class="relative z-99 px-20px py-16px h-31.52vw box-border w-full">
                    <div class="flex justify-between text-16px font-semibold" style="color: #673F0F">
                        <div class="flex items-center font-semibold">
                            <image src="@/static/self/vipvip.png" class="w-18px h-18px mr-6px" />
                            <!-- TAG - 独立 -->
                            <span>{{ cinema.title }}VIP会员卡</span>
                        </div>
                        <div v-if="member.levelname"
                            class="w-60px h-20px text-10px flex items-center justify-center rounded"
                            style="background: rgba(159,74,7, 0.5); color: #F9F9F9">
                            {{ splitPoint(member.discount) }}折优惠
                        </div>
                    </div>
                    <div class="special-text mt-18px flex justify-between items-end text-22px font-semibold"
                        v-if="(member.card_no)" style="color: #A04A07">
                        <div>
                            <span class="text-14px mr-5px">￥</span>
                            <span>{{ member.credit2 }}</span>
                        </div>
                        <div v-if="(member.card_no)" class="text-12px" style="color: #B56B25">NO: {{ member.card_no }}
                        </div>
                    </div>
                    <div v-else class="text-red mt-30px text-16px font-semibold">VIP卡未激活</div>
                </div>
            </div>
        </div>
        <div class="relative z-100 bg-white p-20px -mt-20px box-border"
            :style="{ height: `calc(100vh - ${isWx ? navBarHeight + statusBarHeight : 0}px - 30px - 50px - 20px - 31.52vw + 20px)` }"
            style="border-radius: 20px 20px 0 0;">
            <div class="flex flex-col items-center justify-center">
                <div class="flex items-center">
                    <image class="h-2px w-61px" src="../static/vip-title-line1@2x.png" />
                    <span class="mx-20px text-14px text-gray-333 font-semibold">专属权益</span>
                    <image class="h-2px w-61px" style="transform: rotateY(180deg);"
                        src="../static/vip-title-line1@2x.png" />
                </div>
                <span class="text-12px text-gray-999 mt-8px">享受对应折扣优惠</span>
            </div>
            <scroll-view scroll-y="true" class="py-10px box-border" style="height: calc(100% - 34px);">
                <div class="w-full flex justify-between flex-wrap">
                    <div v-for="(item, index) in dataList" :key="index" @click="touchVip(item)"
                        class="rounded box-border h-141px py-15px text-gray-333 px-6px mb-18px flex flex-col items-center justify-around"
                        :style="{
                            border: `2px solid ${curCard.id === item.id ? '#FF545C' : '#ddd'}`,
                            width: '31%',
                            background: curCard.id === item.id ? 'rgba(255,84,92, 0.05)' : '#F8F8F8'
                        }">
                        <div class="special-text">
                            <span class="text-14px mr-5px">¥</span>
                            <span class="text-22px font-semibold">{{ splitPoint(item.money) }}</span>
                        </div>
                        <div class="text-9px h-23px w-full">
                            <div v-if="(item.is_give == 1)" class="mb-5px truncate w-full" style="text-align:center">充{{
                                    splitPoint(item.money)
                            }}元送{{ splitPoint(item.give_money) }}元
                            </div>
                            <div v-if="(item.send_coupon === '1' && item.coupon_number && item.coupon_number !== '0')"
                                class="truncate w-full" style="text-align:center">
                                赠{{ item.coupon_number }}张{{ item.coupon_name }}</div>
                            <div v-if="!(item.is_give == 1 || (item.send_coupon === '1' && item.coupon_number && item.coupon_number !== '0'))"
                                class="truncate w-full" style="text-align:center">
                                暂无赠送活动</div>
                        </div>
                        <div class="flex justify-center">
                            <u-button class="min-w-71px h-26px" shape="circle" size="small"
                                v-if="item.is_level == '1' && item.astrict != '1'" color="#FF545C"
                                :text="'成为' + item.levelname" @click="getVip(item)">
                            </u-button>
                            <u-button class="min-w-71px h-26px" shape="circle" size="small"
                                v-if="item.astrict == '1' && item.is_level == '1'" color="#FF545C"
                                :text="item.levelname + '储值'" @click="getVip(item)">
                            </u-button>
                        </div>
                    </div>
                    <div class="h-0px box-border opacity-0" style="width: 31%;"></div>
                </div>
                <div class="text-12px text-gray-999 flex justify-center">升级VIP享折扣优惠</div>
            </scroll-view>
        </div>
        <pay-popup :content="card_explain" @success="onSuccess" ref="isPayPopup"></pay-popup>
    </div>
</template>

<script>
import NavBar from '@/components/nav-bar';
import { getStatusBarInfo } from '@/util/index.js'
import { parseRichText } from '@/util';
import PayPopup from '../components/pay-popup.vue'
export default {
    data() {
        return {
            statusBarHeight: 0,
            navBarHeight: 0,
            card_explain: '',
            dataList: [],
            curCard: {},
            member: {},
            card: {},
            global: {}
        }
    },
    components: { NavBar, PayPopup },
    onShow() {
        const { statusBarHeight, navBarHeight } = getStatusBarInfo();
        this.statusBarHeight = statusBarHeight;
        this.navBarHeight = navBarHeight;
        // 确保已经登录完成，再去检查是否有授权
        this.waitLogin().then(() => {
            this.getMyMember();
            this.getAllData();
        })
    },
    methods: {
        getMyMember() {
            this.getMember(this.userInfo.openid).then(res => {
                this.member = res.member;
                this.card = res.card;
                this.global = res.global;
            })
        },
        getAllData() {
            this.request("recharge.combo").then(res => {
                this.dataList = res.combos.filter(ele => {
                    if (ele.astrict == '1') {
                        if (ele.level_id != this.member.level_id) {
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        return true;
                    }
                })
                if (res.set.card_explain) {
                    this.card_explain = parseRichText(res.set.card_explain)
                }
            })
        },
        touchVip(item) {
            this.curCard = item;
        },
        getVip(item) {
            this.$refs.isPayPopup.showPayPopup();
        },
        onSuccess() {
            const id = this.curCard.id;
            this.$refs.isPayPopup.hidePayPopup();
            this.request("recharge.pays", { type: 'wechat', combo_id: id, mobile: this.member.mobile }).then(result => {
                const logno = result.logno;
                if (this.isWx) {
                    wx.requestPayment({
                        timeStamp: result.wechat.timeStamp,
                        nonceStr: result.wechat.nonceStr,
                        package: result.wechat.package,
                        signType: result.wechat.signType,
                        paySign: result.wechat.paySign,
                        success: () => {
                            uni.showLoading({
                                title: '正在处理...',
                            });
                            this.chargeStatus(logno);
                        },
                        fail: () => {
                            uni.showToast({
                                title: '充值失败',
                                icon: 'none'
                            })
                        },
                    });
                } else {
                    // TAG - 抖音支付还未对接
                    uni.showToast({
                        title: "抖音端支付待开发",
                        icon: "none",
                    })
                }

            });
        },
        // 查询充值状态
        chargeStatus(logno) {
            this.request("recharge.combo", { logno }).then(res => {
                uni.hideLoading();
                uni.showToast({
                    title: '充值成功',
                    icon: 'none'
                })
                this.getMyMember();
            }, () => {
                this.chargeStatus(logno);
            })
        },
        getPerfect() {
            this.toPath('/vip/perfect/perfect')
        },
    }
};
</script>
