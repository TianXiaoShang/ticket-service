<template>
    <div class="page-box bg-gray-bg p-20px pt-0 box-border">
        <loading />
        <!-- tabs -->
        <u-tabs :current="tabIndex" :list="dateList" @click="changeTab" lineColor="#FF545C"
            :itemStyle="{ height: '42px' }"
            :activeStyle="{ color: '#333', fontWeight: 'bold', transform: 'scale(1.05)' }"
            :inactiveStyle="{ color: '#999999', transform: 'scale(1)' }"></u-tabs>

        <!-- tab内容 -->
        <div class="w-full box-border">
            <div v-if="timeDataList[tabIndex] && timeDataList[tabIndex].row && !timeDataList[tabIndex].row.length"
                class="mt-10px">
                <u-empty mode="order" text="暂无场次数据" icon="http://cdn.uviewui.com/uview/empty/order.png">
                </u-empty>
            </div>
            <!-- 订单列表 -->
            <template
                v-if="(timeDataList[tabIndex] && timeDataList[tabIndex].row && timeDataList[tabIndex].row.length)">
                <scroll-view scroll-y="true" class="pt-10px box-border" style="height: calc(100vh - 42px - 20px);">
                    <div @click="toPath('/staff/check/index?id=' + item.id)"
                        class="bg-white rounded box-border p-20px relative"
                        :class="{ 'mb-10px': index !== timeDataList[tabIndex].row.lenght - 1 }"
                        v-for="(item, index) in timeDataList[tabIndex].row" :key="index">
                        <div class="text-14px font-normal flex justify-between items-center text-gray-999">
                            <div class="flex font-semibold pr-20px text-16px flex-col items-center justify-center text-red"
                                style="border-right: 1px solid #eee;">
                                <div>{{ moment(item.entrance_time * 1000).format('HH:mm') }}</div>
                                <div class="mt-10px min-w-60px max-w-60px text-center text-15px leading-5">{{ item.hall_title }}</div>
                            </div>
                            <div class="flex-1 flex justify-between pl-20px items-center">
                                <div>
                                    <div class="text-gray-333 text-16px font-semibold mb-15px leading-5">
                                        {{ item.film_title }}
                                    </div>
                                    <div>{{ item.type_title || '-' }}</div>
                                    <div class="mt-5px leading-5">{{ item.scan }}</div>
                                </div>
                                <div :class="{ 'text-green': item.state == 2 }" style="min-width: 3em">
                                    {{ status[Number(item.state)] }}
                                </div>
                            </div>
                        </div>
                    </div>
                </scroll-view>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tabIndex: 0,
            dateList: [],
            timeDataList: [],
            status: ['', '未开始', '检票中', '已结束']
        }
    },
    onLoad() {
        // 确保已经登录完成
        this.waitLogin().then(() => {
            this.getData();
        });
    },
    methods: {
        changeTab(e) {
            this.tabIndex = e.index;
        },
        getData() {
            this.timeDataList = [];
            this.request("staff.row").then(res => {
                this.dateList = res.time.map(el => {
                    return {
                        name: el.title.split('年')[1]
                    }
                })
                this.timeDataList = res.time || [];
            })
        },
    },
};
</script>
