<template>
    <div class="page-box bg-gray-bg box-border">
        <loading />
        <div class="bg-red h-44px flex items-center p-20px box-border">
            <div class="text-0px">
                <image class="w-20px h-20px mr-6px" src="../static/money@2x.png" />
            </div>
            <span class="text-14px text-white">
                累计佣金{{ agentInfo.member.commission_total || 0 }}元
            </span>
        </div>
        <!-- 内容 -->
        <div class="px-20px mt-5px pb-20px">
            <!-- tab -->
            <u-tabs :current="tabIndex" :list="dayList" @click="changeTab" lineColor="#FF545C"
                :itemStyle="{ height: '42px' }"
                :activeStyle="{ color: '#333', fontWeight: 'bold', transform: 'scale(1.05)' }"
                :inactiveStyle="{ color: '#999999', transform: 'scale(1)' }"></u-tabs>
            <!-- 分页滚动 -->
            <scroll-view v-if="listData.length" class="mt-10px" scroll-y="true" @scrolltolower="searchScrollLower"
                :style="{ height: `calc(100vh - ${44 + 42 + 10 + 5 + 20}px)` }">
                <div class="bg-white rounded p-15px mb-10px" v-for="(item, index) in listData" :key="index">
                    <div class="flex justify-between">
                        <div class="text-0px">
                            <image class="w-60px h-80px bg-gray-bg rounded" :src="item.logo" />
                        </div>
                        <div class="ml-15px flex-1 text-14px text-gray-999 h-80px flex flex-col justify-around">
                            <div class="flex justify-between items-center">
                                <div class="text-gray-333 text-16px font-semibold">{{ ext.film_title || '-' }}</div>
                                <div class="text-12px text-gray-666">{{ item.status || '-' }}</div>
                            </div>
                            <div> 申请时间：{{ item.create_time || '-' }} </div>
                            <div> 结算时间：{{ moment(item.finish_time).format('YYYY-MM-DD HH:mm:ss') }} </div>
                        </div>
                    </div>
                    <div class="flex bg-gray-bg mt-10px rounded py-12px justify-around">
                        <div class="flex text-12px text-gray-999 flex-col items-center justify-center">
                            <span>粉丝类型</span>
                            <span class="mt-8px text-gray-333">{{ item.level || '-' }}</span>
                        </div>
                        <!-- TAG - 订单金额跟佣金金额一样？ -->
                        <div class="flex text-12px text-gray-999 flex-col items-center justify-center">
                            <span>订单金额</span>
                            <span class="mt-8px text-gray-333">{{ item.commission || '-' }}</span>
                        </div>
                        <div class="flex text-12px text-gray-999 flex-col items-center justify-center">
                            <span>佣金</span>
                            <span class="mt-8px text-red">{{ item.commission || '-' }}</span>
                        </div>
                    </div>
                    <div class="flex justify-end mt-10px">
                        <div class="w-88px h-26px rounded-13px text-gray-333 text-12px flex justify-center items-center"
                            style="border: 1px solid #333" @click="onCopy(item.order_no)">复制单号</div>
                    </div>
                </div>
                <div v-if="_finish" class="pb-15px text-center text-12px text-gray-999">没有更多啦~</div>
            </scroll-view>
            <u-empty v-else mode="order" text="暂无分销订单数据" icon="http://cdn.uviewui.com/uview/empty/order.png">
            </u-empty>
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
            agentInfo: {},
            listData: [],
        }
    },
    onLoad: function () {
        // 确保已经登录完成
        this.waitLogin().then(() => {
            this.initAgentInfo();
            this.getData();
        });
    },
    methods: {
        // 分销商信息
        initAgentInfo() {
            return this.request("commission.agent").then((res) => {
                this.agentInfo = res;
            })
        },
        getData() {
            this.request("commission.order.get_list", {
                day: this.dayList[this.tabIndex].day,
                page: this._currentPage,
            })
                .then((res) => {
                    const { total, list } = res;
                    this.listData = [...this.listData, ...list];
                    this._currentPage++;
                    this._finish = this.listData.length >= total;
                });
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
    },
};
</script>
