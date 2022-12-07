<template>
    <div class="page-box bg-gray-bg p-20px pt-0 box-border">
        <loading />
        <!-- tabs -->
        <u-tabs :current="tabIndex" :list="statusList" @click="changeTab" lineColor="#FF545C"
            :itemStyle="{ height: '42px' }"
            :activeStyle="{ color: '#333', fontWeight: 'bold', transform: 'scale(1.05)' }"
            :inactiveStyle="{ color: '#999999', transform: 'scale(1)' }"></u-tabs>

        <!-- tab内容 -->
        <div class="w-full box-border">
            <div v-if="!orderList || !orderList.length" class="mt-10px">
                <u-empty mode="order" text="暂无订单数据" icon="http://cdn.uviewui.com/uview/empty/order.png">
                </u-empty>
            </div>
            <!-- 订单列表 -->
            <template v-else>
                <scroll-view scroll-y="true" style="height: calc(100vh - 42px - 20px);">
                    <div @click="toOrderDetail(item)" class="bg-white rounded box-border mt-10px p-20px relative"
                        v-for="(item, index) in orderList" :key="index">
                        <template v-if="item.id">
                            <div class="text-14 font-semibold">{{ item.film_title }}</div>
                            <div class="text-12px text-gray-999 my-10px font-normal flex justify-between items-center">
                                <!-- TAG - 独立 -->
                                <span>{{ item.cinema_title }} {{ item.hall_title }}</span>
                                <span>{{ orderStatus(item.status) }}</span>
                            </div>
                            <div class="text-14 font-normal flex justify-between items-center">
                                <span class="text-gray-333">{{ item.status == 2 || item.status == 3 || item.status ==
                                        4 ? item.price : item.total
                                }}/共{{ item.number }}张</span>
                                <span class="text-12px text-gray-999">{{ moment(item.entrance_time *
                                        1000).format('YYYY-MM-DD HH:mm')
                                }}</span>
                            </div>
                        </template>
                        <u-skeleton v-else rows="2" title :avatar="false" loading></u-skeleton>
                    </div>
                </scroll-view>
            </template>
        </div>
    </div>
</template>

<script>
import { orderStatus } from '../util';
export default {
    data() {
        return {
            tabIndex: 0,
            statusList: [{ name: '全部' }, { name: '待付款' }, { name: '已付款' }, { name: '已取消' }],
            orderList: new Array(8).fill({}),
            orderStatus,
        }
    },
    onLoad() {
    },
    methods: {
        toOrderDetail(item) {
            this.toPath('/order/detail/index?id=' + item.id)
        },
        changeTab(e) {
            this.tabIndex = e.index;
            this.getData(this.tabIndex)
        },
        getData(status) {
            this.orderList = new Array(8).fill({});
            status == 3 ? status = 11 : '';
            this.request("order.lists", {
                status: status
            }).then(res => {
                this.orderList = res.order || [];
            }, () => {
                this.orderList = [];
            })
        },
    },
    onShow: function () {
        // 确保已经登录完成
        this.waitLogin().then(() => {
            this.getData(this.tabIndex);
        });
    },
};
</script>
