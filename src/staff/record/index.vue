<template>
    <div class="page-box bg-gray-bg p-20px box-border">
        <loading />
        <!-- tab内容 -->
        <div class="w-full box-border">
            <div v-if="!dataList || !dataList.length" class="mt-10px">
                <u-empty mode="order" text="暂无检票记录" icon="http://cdn.uviewui.com/uview/empty/order.png">
                </u-empty>
            </div>
            <!-- 订单列表 -->
            <template v-else>
                <div class="bg-white rounded box-border p-20px relative"
                    :class="{ 'mb-10px': index !== dataList.lenght - 1 }" v-for="(item, index) in dataList"
                    :key="index">
                    <div class="text-14px font-normal flex justify-between items-center text-gray-999">
                        <div class="flex font-semibold pr-20px text-16px flex-col items-center justify-center text-red"
                            style="border-right: 1px solid #eee;">
                            <div>{{ moment(item.entrance_time * 1000).format('HH:mm') }}</div>
                            <div class="mt-10px min-w-60px max-w-60px leading-5 flex justify-center">{{ item.hall_title
                            }}</div>
                        </div>
                        <div class="flex-1 flex justify-between pl-20px items-center">
                            <div>
                                <div class="text-gray-333 text-16px font-semibold mb-15px leading-5">
                                    {{ item.film_title }}
                                </div>
                                <div>{{ item.type_title || '-' }}</div>
                            </div>
                            <div @click="toPath('/staff/check/index?id=' + item.id)"
                                class="w-70px text-12px min-w-70px h-26px flex text-white justify-center items-center rounded-15px bg-red">
                                查看详情</div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dataList: [],
        }
    },
    onLoad() {
        // 确保已经登录完成
        this.waitLogin().then(() => {
            this.getData();
        });
    },
    methods: {
        getData() {
            this.dataList = [];
            this.request("staff.endRow").then(res => {
                // TAG - 数据量太大，要做分页
                this.dataList = res.row && res.row.length ? res.row.splice(0, 40) : [];
            })
        },
    },
};
</script>
