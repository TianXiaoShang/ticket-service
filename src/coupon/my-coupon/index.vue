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
            <div v-if="!conpupList || !conpupList.length" class="mt-10px">
                <u-empty mode="coupon" text="暂无优惠券" icon="http://cdn.uviewui.com/uview/empty/coupon.png">
                </u-empty>
            </div>
            <!-- 优惠券列表 -->
            <template v-else>
                <scroll-view scroll-y="true" class="pt-10px" style="height: calc(100vh - 42px - 20px - 10px - 44px);">
                    <div v-for="(item, index) in conpupList" :key="index" class="mb-10px">
                        <coupon-item :conpupData="item"></coupon-item>
                    </div>
                </scroll-view>
            </template>
        </div>

        <!-- 底部按钮 -->
        <div class="fixed z-998 bottom-20px h-44px flex items-center justify-center px-20px left-0 w-full box-border">
            <u-button shape="circle" size="normal"
                :customStyle="{ height: '44px', width: 'calc((100vw - 40px) / 2 - 8px)', margin: 0 }"
                color="linear-gradient(180deg, #FF545C 0%, #FF545C 100%);" text="领取更多优惠"
                @click="toPath('/coupon/center/index')">
            </u-button>
        </div>
    </div>
</template>

<script>
import CouponItem from '../components/coupon-item.vue'
export default {
    components: { CouponItem },
    data() {
        return {
            tabIndex: 0,
            statusList: [{ name: '未使用' }, { name: '不可用' }],
            conpupList: [],
        }
    },
    onLoad() {
        // 确保已经登录完成
        this.waitLogin().then(() => {
            this.getData(this.tabIndex + 1);
        });
    },
    methods: {
        changeTab(e) {
            this.tabIndex = e.index;
            this.getData(this.tabIndex + 1)
        },
        getData(status) {
            status == 3 ? status = 11 : '';
            // 接口要改，从三个状态变成两个状态，已过期跟已使用做合并
            this.request("coupon.data", {
                status: status
            }).then(res => {
                this.conpupList = res.list;
            })
        },
    },
};
</script>
