<template>
    <div class="page-box bg-gray-bg p-20px box-border">
        <loading />
        <div v-if="conpupData.id"
            class="w-full bg-red px-20px py-30px box-border flex justify-center items-center flex-col text-white relative"
            style="border-radius: 10px 10px 0 0">
            <div v-if='(conpupData.is_viewing == 1)'>免费券</div>
            <div v-else>
                <span class="text-20px">¥</span>
                <span class="text-42px special-text font-semibold">{{ conpupData.deduct }}</span>
            </div>
            <span class="text-gray-bg mt-15px text-14px">
                <span>{{ conpupData.name }}</span>
                <span class="ml-10px">{{ conpupData.strtime }}</span>
            </span>
            <!-- 圆点 -->
            <div class="absolute left-0 -bottom-4px flex items-center justify-between">
                <!-- 60颗，足够宽 -->
                <div class="bg-white mr-4px rounded-full w-8px h-8px" v-for="el in 60" :key="el">
                </div>
            </div>
        </div>

        <!-- 内容 -->
        <div class="bg-white rounded p-25px w-full box-border text-14px">
            <div class="text-gray-333 font-semibold">使用说明</div>
            <div class="text-gray-999 text-12px mt-15px">{{ conpupData.desc }}</div>
            <div class="text-gray-333 font-semibold mt-25px">领取限制</div>
            <div class="text-gray-999 text-12px mt-15px">限领{{ conpupData.getmax }}张</div>
            <div class="text-gray-333 font-semibold mt-25px">有效期限</div>
            <div class="text-gray-999 text-12px mt-15px">{{ conpupData.strtime }}</div>
            <div class="text-gray-333 font-semibold mt-25px">使用限制</div>
            <div class="text-gray-999 text-12px mt-15px">{{ conpupData.condition }}</div>
        </div>

        <!-- 底部按钮 -->
        <div class="fixed z-998 bottom-20px h-44px flex items-center justify-center px-20px left-0 w-full box-border">
            <u-button shape="circle" size="normal" v-if="(state != 1)"
                :customStyle="{ height: '44px', width: 'calc((100vw - 40px) / 2 - 8px)', margin: 0 }"
                color="linear-gradient(180deg, #FF545C 0%, #FF545C 100%);" text="立即领取" @click="getCoupon()">
            </u-button>
            <u-button shape="circle" size="normal" v-if="(state == 1)" :plain="true"
                :customStyle="{ height: '44px', width: 'calc((100vw - 40px) / 2 - 8px)', margin: 0, background: 'transparent' }"
                color="#999" text="已领取">
            </u-button>
        </div>
    </div>
</template>

<script>
import CouponItem from '../components/coupon-item.vue'
import { query2Obj } from '@/util'
export default {
    components: { CouponItem },
    data() {
        return {
            id: '',
            conpupData: {},
            state: 0,
            flag: false,
        }
    },
    onLoad(options) {
        this.id = options.id;
        // 分享过来的
        if (options.scene) {
            const scene = decodeURIComponent(options.scene);
            const sceneObj = query2Obj(scene);
            this.id = sceneObj.id ? sceneObj.id : this.id;
            this.flag = true;
        }
        // 确保已经登陆完成
        this.waitLogin().then(() => {
            this.getData();
        });
    },
    methods: {
        getCoupon() {
            this.request("coupon.get", { coupon_id: this.id }).then((res) => {
                uni.showToast({
                    title: "领取成功",
                    icon: 'none'
                })
                // 如果分享来的则跳回首页
                if (this.falg) {
                    this.switchToPath('/pages/index/index', 800)
                } else {
                    this.back(800);
                }
            });
        },
        getData() {
            this.request("coupon.detail", {
                coupon_id: this.id
            }).then(res => {
                this.conpupData = res.coupon;
                this.state = res.state;
            })
        },
    },
};
</script>


<style lang="scss" scoped>
.special-text {
    transform: scale(1, 1.1);
    transform-origin: 0 0;
}
</style>