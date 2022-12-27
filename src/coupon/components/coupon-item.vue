<template>
    <div class="flex justify-between bg-red p-2px rounded border border-red border-solid  overflow-hidden"
        :style="{ opacity: conpupData.status != 1 && conpupData.status != 0 ? '0.5' : '1' }">
        <div class="flex flex-col text-white justify-center items-center bg-red p-15px">
            <div class="font-semibold special-text min-w-84px flex justify-center items-end">
                <span class="text-14px mb-3px" v-if="!(conpupData.deduct === '0.00' || conpupData.deduct == 0)">¥</span>
                <span class="text-28px">{{
        conpupData.deduct === '0.00' || conpupData.deduct == 0 ? '免费券' : conpupData.deduct
}}</span>
            </div>
            <div class="text-10px font-normal mt-5px -mb-5px">
                {{ conpupData.condition }}
            </div>
        </div>
        <div class="flex items-center bg-white relative justify-between p-15px flex-1"
            style="border-radius: 0 10px 10px 0;">
            <div>
                <div class="text-gray-333 text-16px font-semibold">{{ conpupData.name }}</div>
                <div class="text-gray-999 text-12px mt-8px">{{ conpupData.subtract }}</div>
                <div class="text-gray-999 text-10px mt-15px">{{ conpupData.strtime }}</div>
            </div>
            <div class="height-full min-w-52px flex items-center ml-10px">
                <u-button class="min-w-52px" shape="circle" size="small"
                    :plain="(conpupData.status != 1 && conpupData.status != 0)" :color="statusColor[conpupData.status]"
                    :text="statusText[conpupData.status]" @click="toDetail">
                </u-button>
            </div>
            <!-- 圆点 -->
            <div class="absolute top-0 bottom-0 -left-4px flex flex-col justify-between">
                <div class="bg-white rounded-full w-8px h-8px" v-for="el in 7" :key="el">
                </div>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    props: {
        conpupData: Object,
        buttonColor: {
            default: '#FF545C',
            type: String
        },
        buttonText: {
            default: '使用',
            type: String
        }
    },
    data() {
        return {
            statusText: ['领取', '已领取', '已使用', '已过期'],
            statusColor: ['#FF545C', '#FF545C', '', '#999', '#f37b1d'],
        }
    },
    onLoad() {

    },
    methods: {
        toDetail() {
            this.toPath('/coupon/detail/index?id=' + this.conpupData.id);
        },
    },
};
</script>