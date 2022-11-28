<template>
    <div class="page-box bg-gray-bg box-border">
        <loading />
        <!-- 倒计时区域 -->
        <div :style="{
            background: order.status == 2 ? '#2ACB95' :
                order.status == 1 ? '#FF545C' :
                    order.status == 3 ? '#FF9933' :
                        order.status == 4 || order.status == 11 ? '#CCCCCC' : '',
        }" class="p-30px flex flex-col justify-center items-center text-white">
            <div class="text-16 font-semibold">订单{{ orderStatus(order.status) }}</div>
            <div class="text-16 font-semibold" v-if="order.status == 1">剩余支付时间 {{ payTime }}</div>
        </div>

        <!-- 中间内容 -->
        <div class="p-20px pb-20px box-border" :class="{ 'pb-90px': order.status == 1 }" v-if="order.id">
            <!-- 待支付-订单信息 -->
            <div class="bg-white p-20px mb-20px rounded-10px" v-if="order.status == 1">
                <div class="font-semibold text-gray-333 text-16">{{ order.order_no }}</div>
                <div class="mt-10px font-normal text-gray-999 text-14">{{ moment(order.entrance_time *
                        1000).format('YYYY-MM-DD HH:mm')
                }}</div>
                <!-- TAG-独立 没看到地址字段 -->
                <div class="mt-10px font-normal text-gray-999 text-14">独立地址{{ order.address }}</div>
                <u-divider></u-divider>
                <!-- TAG-独立 -->
                <div class="text-gray-333 text-14 font-semibold">{{ order.title }}</div>
                <div class="mt-10px font-normal text-gray-999 text-14">
                    {{ order.film_title }} | {{ order.hall_title }}
                </div>
                <div class="mt-10px font-normal text-gray-999 text-14">
                    {{ order.seats.map(el => el.row + '排' + el.col + '座').join('、') }}
                </div>
            </div>

            <!-- 非待支付-订单信息 -->
            <div class="bg-white p-20px mb-20px rounded-10px" v-if="order.status != 1">
                <!-- 购票信息 -->
                <div class="font-semibold text-gray-333 text-16">购票人</div>
                <div class="mt-10px font-normal text-gray-999 text-14">{{ order.realname }} {{ order.mobile }}</div>

                <div class="font-semibold text-gray-333 text-16 mt-20px">{{ order.film_title }}</div>
                <div class="mt-10px font-normal text-gray-999 text-14">
                    {{ order.hall_title }} {{ moment(order.entrance_time * 1000).format('YYYY-MM-DD HH:mm') }}
                </div>
                <div class="mt-5px font-normal text-gray-999 text-14">
                    {{ order.seats.map(el => el.row + '排' + el.col + '座').join('、') }}
                </div>
            </div>
            <div class="bg-white p-20px pt-10px rounded-10px">
                <!-- 详细信息 -->
                <div v-if="order.is_coupon == 1" class="flex justify-between py-15px items-center text-gray-33 text-14"
                    style="border-bottom: 1px solid #eee;">
                    <span class="font-semibold">优惠券</span>
                    <span class="font-normal">{{ order.coupon_price }}</span>
                </div>
                <div v-if="order.is_level == 1" class="flex justify-between py-15px items-center text-gray-33 text-14"
                    style="border-bottom: 1px solid #eee;">
                    <span class="font-semibold">会员价</span>
                    <span class="font-normal">{{ order.level_discounts }}折</span>
                </div>
                <div v-if="order.part_discount && order.part_discount !== '0.00'"
                    class="flex justify-between py-15px items-center text-gray-33 text-14"
                    style="border-bottom: 1px solid #eee;">
                    <span class="font-semibold">套票折扣</span>
                    <span class="font-normal">-{{ order.part_discount }}元</span>
                </div>
                <div v-if="order.is_level == 2" class="flex justify-between py-15px items-center text-gray-33 text-14"
                    style="border-bottom: 1px solid #eee;">
                    <span class="font-semibold">半价日</span>
                    <span class="font-normal text-red">{{ order.level_discounts }}折</span>
                </div>
                <div v-if="order.charge.charge_open == 1"
                    class="flex justify-between py-15px items-center text-gray-33 text-14"
                    style="border-bottom: 1px solid #eee;">
                    <span class="font-semibold">{{ order.charge.charge_name }}</span>
                    <span class="font-normal">￥{{ order.charge.charge_price }}</span>
                </div>

                <div class="flex justify-between py-15px items-center text-gray-33 text-14"
                    style="border-bottom: 1px solid #eee;">
                    <span class="font-semibold">订单共计</span>
                    <span class="font-normal">{{ order.total }}</span>
                </div>
                <div v-if="order.discount > 0" class="flex justify-between py-15px items-center text-gray-33 text-14"
                    style="border-bottom: 1px solid #eee;">
                    <span class="font-semibold">订单折扣</span>
                    <span class="font-normal">{{ order.discount }}</span>
                </div>
                <div v-if="order.is_pay > 0" class="flex justify-between py-15px items-center text-gray-33 text-14"
                    style="border-bottom: 1px solid #eee;">
                    <span class="font-semibold">实际支付</span>
                    <span class="font-normal">{{ order.pay_price }}</span>
                </div>
                <div v-if="order.is_pay > 0" class="flex justify-between py-15px items-center text-gray-33 text-14"
                    style="border-bottom: 1px solid #eee;">
                    <span class="font-semibold">支付方式</span>
                    <span class="font-normal">{{ order.pay_type_str || '-' }}</span>
                </div>

                <!-- 订单信息 -->
                <div class="font-semibold pt-15px text-gray-333 text-14px" style="border-top: 1px solid #eee;">订单信息
                </div>
                <div class="mt-10px font-normal text-gray-999 text-14px flex items-center justify-between">
                    <span>订单编号：{{ order.order_no }}</span>
                    <span class="text-blue" @click="onCopy(order.order_no)">复制</span>
                </div>
                <div class="mt-10px font-normal text-gray-999 text-14px">创建时间：{{ moment(order.create_time *
                        1000).format('YYYY-MM-DD HH:mm:ss')
                }}</div>
                <div class="h-26px mt-15px w-100px inline-block text-white rounded-13px text-14px font-semibold flex justify-center items-center px-10px"
                    v-if="order.status == 2" style="background: linear-gradient(180deg, #FF545C 0%, #FF545C 100%);"
                    @click="toTicket">
                    查看门票信息</div>
            </div>
        </div>

        <!-- 骨架屏 -->
        <div v-else class="p-20px pb-122px box-border">
            <div class="mt-10px">
                <u-skeleton rows="3" titleWidth="100%" titleHeight="100" title :title="true" loading></u-skeleton>
            </div>
            <div class="mt-10px">
                <u-skeleton rows="5" titleWidth="100%" titleHeight="50" title :title="true" loading></u-skeleton>
            </div>
        </div>


        <!-- 底部按钮 -->
        <div v-if="order.status == 1"
            class="fixed z-9999 pb-20px bottom-0 h-70px flex items-center justify-between px-20px left-0 w-full box-border">
            <u-button shape="circle" size="normal"
                :customStyle="{ height: '44px', width: 'calc((100vw - 40px) / 2 - 8px)', margin: 0, border: '1px solid #FF545C', color: '#FF545C' }"
                color="#fff" text="取消订单" @click="cancelOrder">
            </u-button>
            <u-button shape="circle" size="normal"
                :customStyle="{ height: '44px', width: 'calc((100vw - 40px) / 2 - 8px)', margin: 0 }"
                color="linear-gradient(180deg, #FF545C 0%, #FF545C 100%);" text="提交订单" @click="toPay">
            </u-button>
        </div>
    </div>
</template>

<script>
import { orderStatus } from '../util';
import moment from 'moment';
export default {
    data() {
        return {
            id: '',
            order: {},
            timer: null,
            payTime: '',
            orderStatus
        }
    },
    onLoad(options) {
        this.id = options.id;
        // 确保已经登陆完成
        this.waitLogin().then(() => {
            this.getData();
        });
    },
    methods: {
        cancelOrder() {
            uni.showModal({
                title: '温馨提示',
                content: '是否要取消该订单',
                success: (result) => {
                    if (result.confirm) {
                        this.request("order.cancel", {
                            order_id: this.id
                        }).then(res => {
                            uni.showToast({ title: res.message, icon: 'none' });
                            setTimeout(() => {
                                this.getData()
                            }, 1000);
                        })
                    }
                },
                fail: () => { },
                complete: () => { }
            });
        },
        toPay() {
            uni.navigateTo({
                url: '/order/pay/index?id=' + this.id
            })
        },
        toTicket() {
            uni.navigateTo({
                url: '/order/ticket/index?id=' + this.id
            })
        },
        getData() {
            this.request("order.detail", {
                order_id: this.id
            }).then(res => {
                this.order = res.order;
                // 倒计时
                const time = res.order.expire_time;
                if (time && this.order.status == 1) {
                    this.getExpireTime(time);
                    this.timer = setInterval(() => {
                        this.getExpireTime(time);
                    }, 1000);
                } else {
                    this.timer && clearInterval(this.timer)
                }
            })
        },
        getExpireTime(time) {
            const t = (moment(time * 1000).diff(moment())) / 1000;
            let m = Math.floor(t / 60);
            let s = Math.floor(t % 60);
            if (m < 10) {
                m = '0' + m;
            }
            if (s < 10) {
                s = '0' + s;
            }
            this.payTime = m + ':' + s;
            if (t <= 0) {
                this.getData();
            }
        },
    },
    onUnload() {
        this.timer && clearInterval(this.timer)
    },
};
</script>


<style lang="scss" scoped>

</style>