<template>
    <div>
        <div v-if="rightsData.id" class="w-full box-border rounded overflow-hidden text-white bg-no-repeat bg-center"
            :style="{ 'background-image': `url(../static/card.png)`, 'background-size': '100% 100%', opacity: cardType !== 'unUse' ? '1' : '0.5' }">
            <!-- 可购买 -->
            <template v-if="cardType === 'canPay'">
                <div class="px-20px py-16px">
                    <div class="text-14px flex justify-between items-center">
                        <span class="font-semibold">{{ rightsData.title }}</span>
                        <span class="rounded-15px flex justify-center items-center px-10px h-26px" @click="toDetail"
                            style="background: rgba(255,255,255, 0.3)" v-if="showDetailBtn">查看详情</span>
                    </div>

                    <div class="text-gray-999 text-10px mt-10px flex">
                        <div>有效期内兑换{{ rightsData.number }}次</div> ·
                        <div v-if="rightsData.timelimit == 0">购卡后起{{ rightsData.timedays }}天有效</div>
                        <div v-else>
                            购卡后至{{ moment(rightsData.timeend * 1000).format('YYYY-MM-DD') }}日前有效
                        </div>
                    </div>

                    <div class="text-14px flex justify-between items-center mt-40px">
                        <div>
                            <span>¥</span>
                            <span class="font-semibold ml-5px text-18px special-text">{{ rightsData.price }}</span>
                        </div>
                        <span class="rounded-15px flex justify-center items-center px-10px h-26px bg-red"
                            @click="onShowPayPopup">立即购买</span>
                    </div>
                </div>
            </template>

            <!-- 不可用 -->
            <template v-if="(cardType === 'unUse' || cardType === 'canUse')">
                <div class="p-20px">
                    <div class="text-14px flex justify-between items-center">
                        <span class="font-semibold">{{ rightsData.name }}</span>
                        <span class="rounded-15px flex justify-center items-center px-10px h-26px" @click="toDetail"
                            style="background: rgba(255,255,255, 0.3)" v-if="showDetailBtn">
                            {{ cardType === 'canUse' ? '查看详情' : rightsData.status == 2 ? '已用光' : '已过期' }}</span>
                    </div>

                    <div class="text-gray-999 text-10px mt-10px">
                        <div>手机：{{ rightsData.mobile }}</div>
                        <div class="mt-5px">卡号：{{ rightsData.order_no }}</div>
                    </div>

                    <div class="text-14px flex justify-between items-center mt-18px">
                        <div class="text-10px">
                            <div class="mb-5px">请在有效期内使用，过期将失效</div>
                            <div class="text-gray-999" v-if="rightsData.timelimit == 0">购卡后起{{ rightsData.timedays }}天有效
                            </div>
                            <div class="text-gray-999" v-else>
                                有效期截止{{ moment(rightsData.timeend * 1000).format('YYYY-MM-DD') }}
                            </div>
                        </div>
                        <div class="flex items-center">
                            <span class="mt-3px mr-5px">剩余次数</span>
                            <span class="font-semibold text-18px special-text">{{ ((rightsData.num || 0) -
                                    (rightsData.use_num
                                        || 0))
                                    || 0
                            }}/{{ rightsData.num }}</span>
                        </div>
                    </div>
                </div>
            </template>
            <!-- 权益卡兑换须知 -->
            <pay-popup :rightsData="rightsData" @success="$emit('success')" ref="isPayPopup"></pay-popup>
        </div>
        <u-skeleton v-else rows="0" titleWidth="100%" titleHeight="144" title :title="true" loading></u-skeleton>
    </div>
</template>


<script>
import PayPopup from './pay-popup.vue'
export default {
    components: { PayPopup },
    props: {
        rightsData: Object,
        cardType: {
            type: String,
            default: 'canPay'
        },
        showDetailBtn: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
        }
    },
    methods: {
        toDetail() {
            if (this.cardType === 'canUse' || this.cardType === 'canPay') {
                const id = this.cardType === 'canUse' ? this.rightsData.card_id : this.rightsData.id;
                // 已购买的isPaid传1，还没买的传0，详情页查询接口不一样
                const isPaid = this.cardType === 'canUse' ? '1' : '0';
                this.toPath('/rights/detail/index?id=' + id + '&isPaid=' + isPaid);
            }
        },
        onShowPayPopup() {
            this.$refs.isPayPopup.showPayPopup();
        }
    },
};
</script>


<style lang="scss" scoped>
.special-text {
    transform: scale(1, 1.1);
    transform-origin: 0 0;
}
</style>