<template>
    <div class="page-box relative">
        <loading />
        <div class="w-full relative">
            <div class="image-filter translate-y-25vw transform scale-130 flex flex-col justify-center items-center">
                <image class="w-full" :src="cinema.logo"></image>
            </div>
            <div
                class="w-full absolute left-1/2 top-18vh transform -translate-x-1/2 flex flex-col justify-center items-center">
                <image class="w-120px h-120px" :src="cinema.logo"></image>
                <div class="text-28px text-gray-111 font-extrabold mt-20px">{{ cinema.title }}</div>
            </div>
        </div>

        <div class="fixed bottom-10vh w-full">
            <div class="flex w-full flex-col items-center justify-center">
                <div class="w-3/5">
                    <u-button shape="circle" :disabled="!loginStatus" class='w-full' @click="getuserInfo"
                        color="#FF545C" type="primary" text="授权登录"></u-button>
                </div>
                <div class="mt-15px w-3/5">
                    <u-button shape="circle" color="#FF545C" class='w-full' @click="back" :plain="true" text="取消登陆">
                    </u-button>
                </div>
            </div>
            <div class="flex mt-25px justify-center items-center text-14 text-gray-333">
                <image v-if="read" @click="onRead(false)" src="@/static/common/agree-sel@2x.png" class="w-15px h-15px">
                </image>
                <div v-if="!read" @click="showPopup = true"
                    class="box-border rounded-full w-15px h-15px border border-solid border-red">
                </div>
                <span class="ml-4px text-blue">我已阅读并同意<span @click="showPopup = true">《用户协议》</span></span>
            </div>
        </div>

        <!-- 服务条款 -->
        <u-popup :show="showPopup" :round="20" @close="showPopup = false">
            <div class="w-full">
                <div class="text-gray-333 px-20px pt-20px pb-10px flex justify-between items-center border-l-0 border-t-0 border-r-0 
                    border-b-1px border-gray-100 border-solid text-16 font-semibold ">
                    <span> 服务条款 </span>
                    <span>
                        <u-icon name="close" size="18px" @click="showPopup = false"></u-icon>
                    </span>
                </div>
                <!-- TAG-服务条款内容待补充 -->
                <scroll-view scroll-y="true" class="text-gray-666 max-h-50vh px-15px box-border mt-15px">
                    <span>出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖</span>
                    <span>出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖</span>
                    <span>出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖</span>
                    <span>出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖</span>
                    <span>出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖出淤泥而不染，濯清涟而不妖</span>
                </scroll-view>
                <div class="py-10px">
                    <u-button shape="circle" size="normal" :customStyle="{ height: '44px', width: '200px' }"
                        color="linear-gradient(180deg, #FF545C 0%, #FF545C 100%);" text="确定"
                        @click.native.stop="onRead(true)">
                    </u-button>
                </div>
            </div>
        </u-popup>
    </div>
</template>

<script>
import { login, getUserProfile } from '@/util/base';

export default {
    data() {
        return {
            read: false,
            showPopup: false,
        }
    },
    onShow() { },
    onLoad(options) {
        // 一般来说接口拦截过来是需要重新登陆，若从页面主动跳转过来授权个人信息则一般是已经登陆，无需再次登陆
        if (options.noLogin !== 'true') {
            login();
        }
    },
    methods: {
        onRead(val) {
            this.showPopup = false;
            this.read = val;
        },
        getuserInfo() {
            if (this.read) {
                // TAG-如果是微信好像啥也不用干
                if (this.isWx) {
                    this.back();
                } else {
                    getUserProfile().then(res => {
                        this.back();
                    })
                }
            } else {
                uni.showToast({
                    title: "请先阅读并同意《用户协议》",
                    icon: 'none'
                })
            }

        },
    }
};
</script>

<style lang="scss" scoped>
.image-filter {
    /* 关键模糊属性  */
    filter: blur(20px);
}
</style>
