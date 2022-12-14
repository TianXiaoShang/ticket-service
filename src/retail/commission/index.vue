<template>
    <div class="page-box bg-gray-bg box-border">
        <loading />
        <div class="bg-red h-74px px-20px box-border flex flex-col justify-center">
            <div class="flex items-center">
                <div class="text-0px">
                    <image class="w-20px h-20px mr-6px" src="../static/money@2x.png" />
                </div>
                <span class="text-14px text-white">
                    {{ configData.texts.commission_ok || '' }}{{ withdrawInfo.member.commission_ok || 0 }}{{
                            configData.texts.yuan || '元'
                    }}
                </span>
            </div>
            <div class="flex items-center mt-10px">
                <div class="text-0px">
                    <image class="w-20px h-20px mr-6px" src="../static/money@2x.png" />
                </div>
                <span class="text-14px text-white">
                    {{ configData.texts.commission_lock || '' }}{{ withdrawInfo.member.commission_lock || 0 }}元
                </span>
            </div>
        </div>
        <!-- 内容 -->
        <div class="px-20px mt-5px pb-20px">
            <!-- tab -->
            <u-tabs v-if="dayList && dayList.length" :current="tabIndex" :list="dayList" @click="changeTab"
                lineColor="#FF545C" :itemStyle="{ height: '42px' }"
                :activeStyle="{ color: '#333', fontWeight: 'bold', transform: 'scale(1.05)' }"
                :inactiveStyle="{ color: '#999999', transform: 'scale(1)' }"></u-tabs>
            <!-- 滚动 -->
            <scroll-view class="mt-10px" scroll-y="true"
                :style="{ height: `calc(100vh - ${74 + 42 + 10 + 5 + 20 + 64}px)` }">
                <div class="bg-white text-14px text-gray-999 font-normal rounded py-20px px-15px mb-10px">
                    <div class="rounded bg-gray-bg py-9px text-12px flex justify-around items-center">
                        <div class="flex flex-col items-center justify-center">
                            <span>订单数</span>
                            <span class="mt-10px font-semibold text-gray-333">{{ statistics.commission || 0 }}</span>
                        </div>
                        <div class="flex flex-col items-center justify-center">
                            <span>总收益</span>
                            <span class="mt-10px font-semibold text-gray-333">{{ statistics.total || 0 }}</span>
                        </div>
                        <div class="flex flex-col items-center justify-center">
                            <span>已结算</span>
                            <span class="mt-10px font-semibold text-gray-333">{{ statistics.have || 0 }}</span>
                        </div>
                    </div>
                    <div class="mt-25px flex justify-around items-center">
                        <div class="flex flex-col items-center justify-center w-1/4">
                            <span>渠&nbsp;&nbsp;道</span>
                        </div>
                        <div class="flex flex-col items-center justify-center w-1/4">
                            <span>订单数</span>
                        </div>
                        <div class="flex flex-col items-center justify-center w-1/4">
                            <span>总收益</span>
                        </div>
                        <div class="flex flex-col items-center justify-center w-1/4">
                            <span>已结算</span>
                        </div>
                    </div>
                    <div class="mt-8px flex justify-around items-center"
                        v-for='(item, index ) in withdrawInfo.statistics' :key="index">
                        <div class="flex flex-col items-center justify-center w-1/4">
                            <span class="mt-10px font-semibold text-gray-333">{{ item.name || '' }}</span>
                        </div>
                        <div class="flex flex-col items-center justify-center w-1/4">
                            <span class="mt-10px font-semibold text-gray-333">{{ statistics.count || 0 }}</span>
                        </div>
                        <div class="flex flex-col items-center justify-center w-1/4">
                            <span class="mt-10px font-semibold text-gray-333">{{ statistics.total || 0 }}</span>
                        </div>
                        <div class="flex flex-col items-center justify-center w-1/4">
                            <span class="mt-10px font-semibold text-gray-333">{{ statistics.have || 0 }}</span>
                        </div>
                    </div>
                </div>
                <!-- 用户须知 -->
                <div class="mt-30px">
                    <div class="font-semibold text-gray-666 text-14px">用户须知</div>
                    <div class="font-normal text-gray-999 text-12px mt-15px">
                        <div>
                            订单完成
                            <div v-if="withdrawInfo.set.settledays">
                                <span class="color-orange"> {{ withdrawInfo.set.settledays }} </span>
                                天
                            </div>
                            后，获得合伙人佣金
                        </div>
                        <div class="mt-10px">
                            注意：可提{{ configData.texts.commission }}满
                            <span class="color-orange">{{ withdrawInfo.set.withdraw }}{{ configData.texts.yuan }}</span>
                            后才能申请提现
                        </div>
                        <div class="mt-10px" v-if="withdrawType.deductionmoney != 0">
                            提现手续费：
                            <span class="color-orange">
                                {{ withdrawType.deductionmoney }} {{ configData.texts.yuan }}
                            </span>
                        </div>
                    </div>
                </div>
            </scroll-view>
        </div>

        <!-- 按钮 -->
        <div class="fixed z-998 bottom-20px h-44px flex items-center justify-center px-20px left-0 w-full box-border">
            <u-button shape="circle" size="normal" :disabled="withdrawInfo.member.commission_ok <= 0"
                :customStyle="{ height: '44px', width: '160px', margin: 0 }" color="#FF545C"
                :text="'立即' + configData.texts.withdraw" @click="handleWithdraw">
            </u-button>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            tabIndex: 0,
            dayList: [
                { name: "今日", day: "0" },
                { name: "昨日", day: "1" },
                { name: "本月", day: "2" },
                { name: "上月", day: "3" },
            ],
            listData: [],
            withdrawInfo: {},
            configData: {},
            withdrawType: {},
            statistics: {},
        }
    },
    onLoad: function () {
        // 确保已经登录完成
        this.waitLogin().then(async () => {
            const configData = await this.request("commission.set");
            this.configData = configData.set;
            uni.setNavigationBarTitle({
                title: this.configData.texts.commission1,
                complete: function () { },
            })
            this.withdrawInfo = await this.request("commission.withdraw");
            this.withdrawType = await this.request("commission.withdraw.apply")
            this.getData();
        });
    },
    methods: {
        getData() {
            return this.request("commission.withdraw.statistics", {
                day: this.dayList[this.tabIndex].day,
            })
                .then((res) => {
                    this.statistics = res;
                })
        },
        handleWithdraw() {
            uni.navigateTo({
                url: "/retail/audit-commission/index",
            })
        },
        changeTab(e) {
            this.listData = [];
            this.tabIndex = e.index;
            this.getData();
        },
    },
};
</script>
