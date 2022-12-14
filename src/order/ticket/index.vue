<template>
    <div class="page-box bg-gray-bg box-border p-20px box-border relative">
        <loading />
        <div class="is-bg"></div>
        <div class="relative z-999" v-if="order.id">
            <!-- 电影 -->
            <div class="p-15px rounded bg-white flex justify-between items-center">
                <!-- TAG - 图片没有 -->
                <div>
                    <image class="w-92px h-126px mr-15px rounded overflow-hidden"
                        src="http://mallsaasphoto.djlcom.com/images/1/sonCinema/id_4/aAYwJjjac4ziJijWJeAcWIjBcA1373.jpg" />
                </div>
                <div class="flex-1">
                    <div class="text-16px text-gray-333 font-semibold">{{ order.film_title }}</div>
                    <div class="text-14px text-gray-999 font-normal mt-15px">{{ moment(order.entrance_time *
                            1000).format('YYYY-MM-DD HH:mm')
                    }}</div>
                    <!-- TAG - 独立 -->
                    <div class="text-14px text-gray-999 font-normal mt-10px">{{ myCinema.title }}</div>
                    <div class="text-14px text-gray-999 font-normal mt-10px">{{ order.hall_title }}</div>
                    <div class="text-14px text-white font-normal mt-10px bg-red rounded-14px w-110px py-5px text-center"
                        @click="toDetail">
                        查看订单详情</div>
                </div>
            </div>
            <!-- 二维码 -->
            <div class="mt-10px p-20px pt-10px rounded bg-white" v-if="tabsDataList && tabsDataList.length">
                <div class="flex is-code justify-center">
                    <u-tabs :current="tabIndex" :list="tabsDataList" @click="changeTab" lineColor="#FF545C"
                        :itemStyle="{ height: '42px' }"
                        :activeStyle="{ color: '#333', fontWeight: 'bold', transform: 'scale(1.05)' }"
                        :inactiveStyle="{ color: '#999999', transform: 'scale(1)' }"></u-tabs>
                </div>
                <!-- 取票 -->
                <div class="" v-if="global.show_ticketscode != 1 && tabIndex === 0">
                    <div class="py-20px relative" style="border-top: 1px solid #eee">
                        <div class="flex justify-center items-center relative">
                            <!-- is_ticket是整体的取票状态，status是单个的扫码入场状态 -->
                            <div :style="{ opacity: order.is_ticket != 1 && order.status <= 1 ? '1' : '0.07' }">
                                <!-- 组件地址 https://ext.dcloud.net.cn/plugin?id=39 -->
                                <tki-qrcode ref="qrcode" :cid="order.dynamic" :val="order.dynamic" :size="150" unit="px"
                                    :background="'#fff'" :foreground="'#000'" :onval="onval" :loadMake="true"
                                    :showLoading="true" />
                            </div>
                            <div
                                class="absolute flex flex-col justify-center items-center left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <image class="w-55px h-55px" :src="`../static/${statusOrder[order.status]}.png`" />
                                <div class="mt-8px text-16px font-semibold" style="color: #63c899">
                                    {{ statusOrderText[order.status] }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col justify-center items-center text-14px mt-10px">
                        <div class="text-gray-999">{{ ticket.length }}张票</div>
                        <div class="flex items-center text-gray-333 font-normal mt-10px">
                            <span :style="{ 'text-decoration': order.is_ticket == 1 ? 'line-through;' : 'none' }">票码：{{
                                    order.dynamic
                            }}</span>
                            <span @click="onCopy(order.dynamic)"
                                class="px-10px h-26px flex items-center justify-center rounded-25px ml-20px border border-solid border-color-333">复制</span>
                        </div>
                    </div>
                </div>
                <!-- 扫码入场 -->
                <div class="" v-if="global.show_ticketscode != 1 ? tabIndex === 1 : tabIndex === 0">
                    <div class="py-20px relative" style="border-top: 1px solid #eee">
                        <swiper v-if="ticket.length" circular :indicator-dots="false" :current="ticketCurrent"
                            @animationfinish="changeFinish" :autoplay="false" :duration="500">
                            <swiper-item v-for="(item, index) in ticket" :key="index">
                                <div class="flex justify-center items-center relative">
                                    <div :style="{ opacity: item.status <= 1 ? '1' : '0.07' }">
                                        <!-- 组件地址 https://ext.dcloud.net.cn/plugin?id=39 -->
                                        <tki-qrcode ref="qrcode" :cid="item.id" :val="item.dynamic" :size="150"
                                            unit="px" :background="'#fff'" :foreground="'#000'" :onval="onval"
                                            :loadMake="true" :showLoading="true" />
                                    </div>
                                    <div
                                        class="absolute flex flex-col justify-center items-center left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <image class="w-55px h-55px"
                                            :src="`../static/${statusSign[item.status]}.png`" />
                                        <div class="mt-8px text-16px font-semibold" style="color: #63c899">
                                            {{ statusSignText[item.status] }}</div>
                                    </div>
                                </div>
                            </swiper-item>
                        </swiper>
                        <div v-if="(ticket.length > 1)"
                            class="absolute left-0 top-1/2 transform -translate-y-1/2 w-25px h-25px" @click="onPrev">
                            <image class="w-full h-full" src="../static/previous-dis@2x.png" />
                        </div>
                        <div v-if="(ticket.length > 1)"
                            class="absolute right-0 top-1/2 transform -translate-y-1/2 w-25px h-25px" @click="onNext">
                            <image class="w-full h-full" src="../static/previous-nor@2x.png" />
                        </div>
                    </div>
                    <div class="flex flex-col justify-center items-center text-14px mt-10px">
                        <div class="text-gray-999">
                            {{ ticket[ticketCurrent].seat_name }}({{ ticketCurrent + 1 + '/' + ticket.length }})
                        </div>
                        <div class="flex items-center text-gray-333 font-normal mt-10px">
                            <span>票码：{{ ticket[ticketCurrent].dynamic }}</span>
                            <span @click="onCopy(ticket[ticketCurrent].dynamic)"
                                class="px-10px h-26px flex items-center justify-center rounded-25px ml-20px border border-solid border-color-333">复制</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 地址 -->
            <div class="rounded flex mt-10px bg-white px-15px py-20px justify-between items-center">
                <div class="text-14px font-semibold">
                    <!-- TAG - 独立 -->
                    <div>{{ myCinema.title }}</div>
                    <!-- TAG - 独立 -->
                    <div class="font-normal mt-10px text-gray-999 leading-6">{{ myCinema.address }}</div>
                </div>
                <!-- TAG - 独立 -->
                <div class="ml-10px w-22px h-22px" @click="onMap">
                    <image class="w-full h-full" src="../static/go@2x.png" />
                </div>
            </div>
            <!-- 观看须知 -->
            <div class="rounded p-20px bg-white mt-10px">
                <div class="text-14px font-semibold text-gray-333 mb-10px">观看须知</div>
                <div>
                    <rich-text :nodes="richText"></rich-text>
                </div>
            </div>
        </div>
        <div v-else class="relative z-999">
            <div class="bg-white p-20px rounded">
                <u-skeleton avatarShape="square" avatarSize="102" rows="2" title avatar loading></u-skeleton>
            </div>
            <div class="bg-white p-20px mt-20px rounded">
                <u-skeleton rows="2" title :avatar="false" loading></u-skeleton>
            </div>
            <div class="bg-white p-20px mt-20px rounded">
                <u-skeleton rows="8" title :avatar="false" loading></u-skeleton>
            </div>
            <div class="bg-white p-20px mt-20px rounded">
                <u-skeleton rows="8" title :avatar="false" loading></u-skeleton>
            </div>
        </div>
    </div>
</template>

<script>
import { parseRichText, openMap } from '@/util';
import tkiQrcode from "tki-qrcode/components/tki-qrcode/tki-qrcode.vue"
export default {
    data() {
        return {
            id: '',
            order: {},
            myCinema: {},
            ticket: [],
            global: {},
            richText: '',
            tabIndex: 0,
            tabsDataList: [],
            ticketCurrent: 0,
            canAnimationFlag: true,
            statusOrder: ['', 'yiqupiao', 'yijieshu', 'yituikuan'],
            statusOrderText: ['', '已取票', '已结束', '已退款'],
            statusSign: ['', '', 'yiqupiao', 'yijieshu', 'yituikuan'],
            statusSignText: ['', '', '已取票', '已结束', '已退款'],
        }
    },
    components: { tkiQrcode },
    onLoad(options) {
        this.id = options.id;
        // 确保已经登录完成
        this.waitLogin().then(() => {
            this.getData();
        });
    },
    methods: {
        changeFinish() {
            this.canAnimationFlag = true;
        },
        onPrev() {
            if (this.ticketCurrent <= 0 || !this.canAnimationFlag) {
                return;
            }
            this.canAnimationFlag = false;
            this.ticketCurrent--;
        },
        onNext() {
            if (this.ticketCurrent >= this.ticket.length - 1 || !this.canAnimationFlag) {
                return;
            }
            this.canAnimationFlag = false;
            this.ticketCurrent++;
        },
        changeTab(e) {
            this.tabIndex = e.index;
        },
        toDetail() {
            this.toPath('/order/detail/index?id=' + this.id)
        },
        getData() {
            this.request("ticket.detail", {
                order_id: this.id
            }).then(res => {
                if (res.watch_film) {
                    this.richText = parseRichText(res.watch_film);
                }
                this.myCinema = res.cinema;
                this.ticket = res.ticket;
                this.order = res.order;
                this.global = res.global;

                if (this.global.show_ticketscode != 1) {
                    this.tabsDataList.push({ name: '取票' })
                }
                if (this.global.show_entrycode != 1) {
                    this.tabsDataList.push({ name: '扫码入场' })
                }
            });
        },
        onMap() {
            openMap(this.myCinema)
        }
    },
};
</script>


<style lang="scss" scoped>
.is-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 120px;
    background: linear-gradient(180deg, #FF545C 0%, #fff 100%);
}

.is-code {
    ::v-deep {
        .u-tabs__wrapper__scroll-view {
            justify-content: center !important;
        }

        .tabs__wrapper__nav {
            display: inline-block !important;
        }
    }
}
</style>