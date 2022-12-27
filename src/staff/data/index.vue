<template>
    <div class="page-box bg-gray-bg box-border p-20px box-border relative">
        <loading />
        <div class="relative z-999" v-if="info.id">
            <!-- 电影 -->
            <div class="p-15px rounded bg-white flex justify-between items-center">
                <div>
                    <image class="bg-gray-bg w-76px h-102px mr-15px rounded overflow-hidden" :src="info.ext.film_logo" />
                </div>
                <div class="flex-1">
                    <div class="text-16px text-gray-333 font-semibold">{{ info.ext.film_title }}</div>
                    <div class="text-14px text-gray-999 font-normal mt-25px">{{ moment(info.entrance_time *
                            1000).format('YYYY-MM-DD HH:mm')
                    }}</div>
                    <!-- TAG - 独立 -->
                    <div class="text-14px text-gray-999 font-normal mt-10px">{{ info.ext.hall_title }}</div>
                </div>
            </div>
            <!-- 图表 -->
            <div class="rounded bg-white p-20px mt-20px">
                <template v-if="pageLoad">
                    <qiun-data-charts type="ring" :opts="opts" :chartData="chartData" />
                    <qiun-data-charts type="ring" :opts="opts" :chartData="chartData2" />
                </template>
            </div>
        </div>
        <div v-else class="relative z-999">
            <div class="bg-white p-20px rounded">
                <u-skeleton avatarShape="square" avatarSize="102" rows="2" title avatar loading></u-skeleton>
            </div>
            <div class="bg-white p-20px mt-20px rounded">
                <u-skeleton rows="0" titleWidth="100%" titleHeight="250" title :title="true" loading></u-skeleton>
                <div class="mt-20px">
                    <u-skeleton rows="0" titleWidth="100%" titleHeight="250" title :title="true" loading></u-skeleton>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// 组件文档地址 https://ext.dcloud.net.cn/plugin?id=271
// 组件演示地址 https://www.ucharts.cn/v2/#/demo/index
import QiunDataCharts from '../components/qiun-data-charts/qiun-data-charts.vue'
export default {
    components: { QiunDataCharts },
    data() {
        return {
            id: '',
            info: {},
            opts: {
                rotate: false,
                rotateLock: false,
                color: ["#2ACB95", "#5B8FF9"],
                padding: [5, 5, 5, 5],
                dataLabel: true,
                legend: {
                    show: true,
                    position: "bottom",
                    lineHeight: 25
                },
                extra: {
                    ring: {
                        ringWidth: 25,
                    }
                },
            },
            chartData: {
                series: []
            },
            chartData2: {
                series: []
            },
        }
    },
    onLoad(options) {
        this.id = options.id;
        // 确保已经登录完成
        this.waitLogin().then(() => {
            this.getData();
        });
    },
    methods: {
        getData() {
            this.request("staff.checkTicket", { row_id: this.id }).then(res => {
                this.info = res.row;
            })
            this.request("staff.statistics", { row_id: this.id }).then(res => {
                const data = [
                    { "name": res.sale_count.is_buy.name, "value": res.sale_count.is_buy.data },
                    { "name": res.sale_count.no_buy.name, "value": res.sale_count.no_buy.data }
                ];
                this.chartData = {
                    series: [{
                        data
                    }]
                };

                const data2 = [
                    { "name": res.entrance_count.is_view.name, "value": res.entrance_count.is_view.data },
                    { "name": res.entrance_count.no_view.name, "value": res.entrance_count.no_view.data }
                ];
                this.chartData2 = {
                    series: [{
                        data: data2
                    }]
                };
                this.pageLoad = true;
            })
        },
    },
};
</script>


<style lang="scss" scoped>

</style>