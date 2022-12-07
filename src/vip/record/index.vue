<template>
    <div class="page-box bg-gray-bg p-20px pt-0 box-border">
        <loading />
        <!-- 记录列表 -->
        <div class="bg-white rounded box-border mt-10px p-20px overflow-hidden" v-for="(item, index) in records"
            :key="index">
            <template v-if="item.id">
                <div class="text-12px text-gray-999 font-normal flex justify-between items-center">
                    <span>{{ item.code_no }}</span>
                    <span>{{ moment(item.createtime *
                            1000).format('YYYY-MM-DD HH:mm')
                    }}</span>
                </div>
                <div class="text-14 mt-10px font-normal text-gray-333">
                    {{ item.desc }}
                </div>
                <view class="special-text text-22px font-semibold mt-10px"
                    :class="{ 'text-green': getClass(item), 'text-red': !getClass(item) }">{{ item.num }}</view>

            </template>
            <u-skeleton v-else rows="2" title :avatar="false" loading></u-skeleton>
        </div>

        <!-- 空状态 -->
        <div v-if="!records || !records.length" class="mt-20px">
            <u-empty mode="order" text="暂无数据" icon="http://cdn.uviewui.com/uview/empty/order.png">
            </u-empty>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            records: new Array(8).fill({}),
        }
    },
    onShow: function () {
        // 确保已经登录完成
        this.waitLogin().then(() => {
            this.getData();
        });
    },
    methods: {
        getData() {
            this.records = new Array(8).fill({});
            this.request("recharge.record").then(res => {
                this.records = res.records;
            }, () => {
                this.records = [];
            })
        },
        getClass(item) {
            return item.num && item.num.includes('+');
        }
    },

};
</script>
