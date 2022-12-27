<template>
    <div class="page-box bg-gray-bg box-border">
        <loading />
        <div class="bg-red h-44px flex items-center p-20px box-border">
            <div class="text-0px">
                <image class="w-20px h-20px mr-6px" src="../static/fans2@2x.png" />
            </div>
            <span class="text-14px text-white">
                {{ subInfo.textdown }} {{ subInfo.total || 0 }}
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
                <div class="bg-white flex justify-between rounded p-20px mb-10px" v-for="(item, index) in listData"
                    :key="index">
                    <div class="text-0px">
                        <image class="w-40px h-40px rounded-full overflow-hidden"
                            :src="item.avatar || DEFAULT_AVATAR" />
                    </div>
                    <div class="flex-1 mx-15px">
                        <div class="text-gray-333 text-14px font-semibold">{{ item.nickname }}</div>
                        <div class="text-gray-999 mt-8px text-12px font-normal">注册时间：{{ item.child_time || '-' }}</div>
                        <div class="text-gray-999 mt-8px text-12px font-normal">收益：<span
                                class="text-red font-semibold">{{ item.commission_total || 0 }}</span></div>
                    </div>
                    <div class="text-0px flex items-start">
                        <u-icon name="account"></u-icon>
                        <span class="ml-5px text-14px mt-1px text-gray-333">
                            <!-- 这里不用down，直接用图标表示 -->
                            <!-- {{ subInfo.down }}  -->
                            {{ item.fanscount || 0 }}</span>
                    </div>
                </div>
                <div v-if="pageFinish" class="pb-15px text-center text-12px text-gray-999">没有更多啦~</div>
            </scroll-view>
            <u-empty v-else mode="comment" text="暂无粉丝" icon="http://cdn.uviewui.com/uview/empty/comment.png">
            </u-empty>
        </div>

    </div>
</template>

<script>
export default {
    data() {
        return {
            tabIndex: 0,
            tabList: [],
            listData: [],
            subInfo: {},
        }
    },
    onLoad: function () {
        // 确保已经登录完成
        this.waitLogin().then(async () => {
            await this.initSub();
            await this.getData();
        });
    },
    methods: {
        // 下级
        initSub() {
            return this.request("commission.down.get_set").then((res) => {
                this.subInfo = res;
                this.tabList = res.levels.map(el => {
                    return { name: el.name + `(${el.total})` }
                });
            })
        },
        getData() {
            return this.request("commission.down.get_list", {
                level: this.subInfo.levels[this.tabIndex].level,
                page: this.myCurrentPage,
            })
                .then((res) => {
                    const { total, list } = res;
                    const tempList = list.map((d) => ({
                        ...d,
                        childTime: this.moment(d.child_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
                    }))
                    this.listData = [...this.listData, ...tempList];
                    this.myCurrentPage++;
                    this.pageFinish = this.listData.length >= Number(total);
                })
        },
        searchScrollLower() {
            if (this.pageFinish) {
                return;
            }
            this.getData();
        },
        changeTab(e) {
            this.listData = [];
            this.tabIndex = e.index;
            this.myCurrentPage = 1;
            this.getData();
        },
    },
};
</script>
