<template>
    <div class="page-box bg-gray-bg box-border">
        <loading />
        <div class="bg-red h-44px flex items-center p-20px box-border">
            <div class="text-0px">
                <image class="w-20px h-20px mr-6px" src="../static/money@2x.png" />
            </div>
            <span class="text-14px text-white">
                {{ configData.texts.commission_lock || '' }} {{ withdrawInfo.member.commission_lock || 0 }}元
            </span>
        </div>
        <!-- 内容 -->
        <div class="px-20px mt-5px pb-20px">
            <!-- tab -->
            <u-tabs v-if="tabList && tabList.length" :current="tabIndex" :list="tabList" @click="changeTab"
                lineColor="#FF545C" :itemStyle="{ height: '42px' }"
                :activeStyle="{ color: '#333', fontWeight: 'bold', transform: 'scale(1.05)' }"
                :inactiveStyle="{ color: '#999999', transform: 'scale(1)' }"></u-tabs>
            <!-- 分页滚动 -->
            <scroll-view v-if="listData.length" class="mt-10px" scroll-y="true" @scrolltolower="searchScrollLower"
                :style="{ height: `calc(100vh - ${44 + 42 + 10 + 5 + 20}px)` }">
                <div class="bg-white text-14px text-gray-999 font-normal rounded p-15px mb-10px"
                    v-for="(item, index) in listData" :key="index">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-333 text-16px font-semibold">提现到{{ payMap[item.type] }}</span>
                        <span class="text-gray-666 text-12px">{{ item.statusstr }}</span>
                    </div>
                    <div class="mt-15px mb-10px">
                        {{ item.timeStr }}
                    </div>
                    <div class="rounded bg-gray-bg py-9px text-12px flex justify-around items-center">
                        <div class="flex flex-col items-center justify-center">
                            <span>申请提现</span>
                            <span class="mt-10px font-semibold text-gray-333">{{ item.commission }}</span>
                        </div>
                        <div class="flex flex-col items-center justify-center">
                            <span>实际金额</span>
                            <span class="mt-10px font-semibold text-gray-333">{{ item.realmoney }}</span>
                        </div>
                        <div class="flex flex-col items-center justify-center">
                            <span>提现手续费</span>
                            <span class="mt-10px font-semibold text-gray-333">{{ item.deductionmoney }}</span>
                        </div>
                    </div>
                </div>
                <div v-if="_finish" class="pb-15px text-center text-12px text-gray-999">没有更多啦~</div>
            </scroll-view>
            <u-empty v-else mode="order" text="暂无相关提现" icon="http://cdn.uviewui.com/uview/empty/order.png">
            </u-empty>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            tabIndex: 0,
            tabList: [
                { name: "所有", code: "" },
                { name: "待审核", code: "1" },
                { name: "待打款", code: "2" },
                { name: "已打款", code: "3" },
                { name: "无效", code: "-1" },
            ],
            payMap: {
                1: "微信钱包",
                2: "支付宝",
                3: "银行卡",
            },
            listData: [],
            withdrawInfo: {},
            configData: {},
        }
    },
    onLoad: function () {
        // 确保已经登录完成
        this.waitLogin().then(async () => {
            const configData = await this.request("commission.set");
            this.configData = configData.set;
            this.withdrawInfo = await this.request("commission.withdraw");
            this.getData()
        });
    },
    methods: {
        getData() {
            return this.request("commission.withdraw.get_list", {
                level: this.tabList[this.tabIndex].code,
                page: this._currentPage,
            })
                .then((res) => {
                    const { total, list } = res;
                    const tempList = list.map((d) => {
                        return {
                            ...d,
                            timeStr: this.getTimeStr(d),
                        }
                    })
                    this.listData = [...this.listData, ...tempList];
                    this._currentPage++;
                    this._finish = this.listData.length >= total;
                })
        },
        searchScrollLower() {
            if (this._finish) {
                return;
            }
            this.getData();
        },
        changeTab(e) {
            this.listData = [];
            this.tabIndex = e.index;
            this._currentPage = 1;
            this.getData();
        },
        getTimeStr(row) {
            const {
                status,
                applytime,
                checktime,
                paytime,
                invalidtime,
                refusetime,
            } = row
            switch (status) {
                case "-2":
                    return `拒绝时间：${this.moment(refusetime).format('YYYY-MM-DD HH:mm:ss')}`
                case "-1":
                    return `拒绝时间：${this.moment(invalidtime).format('YYYY-MM-DD HH:mm:ss')}`
                case "0":
                    return ``
                case "1":
                    return `申请时间：${this.moment(applytime).format('YYYY-MM-DD HH:mm:ss')}`
                case "2":
                    return `审核时间：${this.moment(checktime).format('YYYY-MM-DD HH:mm:ss')}`
                case "3":
                    return `支付时间：${this.moment(paytime).format('YYYY-MM-DD HH:mm:ss')}`
            }
        },
    },
};
</script>
