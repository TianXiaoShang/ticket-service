<template>
    <div class="page-box relative">
        <loading />
        <div class="w-full relative">
            <div class="image-filter translate-y-25vw transform scale-130 flex flex-col justify-center items-center">
                <image class="w-full" :src="cinema.logo"></image>
                <!-- 比下面的字大一些 -->
                <div class="text-48px text-gray-111 font-extrabold mt-60px">{{ cinema.title }}</div>
            </div>
            <div
                class="w-full absolute left-1/2 top-18vh transform -translate-x-1/2 flex flex-col justify-center items-center">
                <image class="w-120px h-120px" :src="cinema.logo"></image>
                <div class="text-28px text-gray-111 font-extrabold mt-20px">{{ cinema.title }}</div>
            </div>
        </div>

        <div class="fixed bottom-10vh w-full flex flex-col items-center justify-center">
            <div class="flex w-8/10 flex-col items-center justify-center mb-36px">
                <div style="box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.05);"
                    class="w-full h-50px bg-white rounded py-10px px-15px box-border mt-10px flex items-center">
                    <div class="text-gray-666 text-14px mr-10px">头像</div>
                    <div class="flex-1 relative text-0px h-full flex items-center">
                        <image v-if="(user.avatarUrl || DEFAULT_AVATAR)"
                            class="w-35px h-35px rounded-full overflow-hidden" :src="user.avatarUrl"></image>
                        <span v-else class="text-14px text-gray-999">点击授权头像</span>
                        <button class="absolute left-0 right-0 top-0 bottom-0 opacity-0" open-type="chooseAvatar"
                            @chooseavatar="chooseavatar"></button>
                    </div>
                </div>
                <div style="box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.05);"
                    class="w-full h-50px bg-white rounded py-10px px-15px box-border mt-10px flex items-center">
                    <div class="text-gray-666 text-14px mr-10px">昵称</div>
                    <input placeholder-style="color: #999; font-size: 14px; margin-top: 1px;" placeholder="请输入昵称"
                        type="nickname" v-model="user.name" @input="inputName" />
                </div>
                <div style="box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.05);"
                    class="w-full h-50px bg-white rounded py-10px px-15px box-border mt-10px flex items-center">
                    <div class="text-gray-666 text-14px mr-10px">手机</div>
                    <div class="flex-1 relative h-full flex items-center">
                        <input placeholder-style="color: #999; font-size: 14px; margin-top: 1px;" placeholder="授权手机号"
                            v-model="user.phone" />
                        <button @getphonenumber="getMobile" class="opacity-0 absolute z-9 left-0 right-0 top-0 bottom-0"
                            openType="getPhoneNumber">
                        </button>
                    </div>
                </div>
            </div>
            <div class="flex w-full flex-col items-center justify-center">
                <div class="w-3/5">
                    <u-button shape="circle" :disabled="(!loginStatus || disabled)" class='w-full' @click="onSubmit"
                        color="#FF545C" type="primary" text="完成授权"></u-button>
                </div>
            </div>
            <div class="flex mt-25px justify-center items-center text-14 text-gray-333">
                <image v-if="read" @click="onRead(false)" src="@/static/common/agree-sel@2x.png" class="w-15px h-15px">
                </image>
                <div v-if="!read" @click="showPopup = true"
                    class="box-border rounded-full w-15px h-15px border border-solid border-red">
                </div>
                <span class="ml-4px">我已阅读并同意<span class="text-blue" @click="showPopup = true">《服务条款》</span></span>
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
                <scroll-view scroll-y="true" class="text-gray-666 max-h-50vh px-15px box-border mt-15px">
                    <rich-text v-if="login_explain" :nodes="login_explain"></rich-text>
                    <span v-else>暂无服务条款内容</span>
                </scroll-view>
                <div class="pt-10px">
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
import { getUserProfile, updateUserInfo, getPhoneNumber } from '@/util/base';
import { parseRichText } from '@/util';

export default {
    data() {
        return {
            read: false,
            showPopup: false,
            user: {
                avatarUrl: '',
                name: '',
                phone: '',
            },
            disabled: false,
            login_explain: '',
        }
    },
    onShow() { },
    onLoad() {
        this.waitLogin().then(() => {
            this.user.avatarUrl = this.userInfo.avatar;
            this.user.name = this.userInfo.nickname;
            this.user.phone = this.userInfo.mobile;
            this.login_explain = this.setting.login_explain ? parseRichText(this.setting.login_explain) : '';
        })
    },
    methods: {
        onRead(val) {
            this.showPopup = false;
            this.read = val;
        },
        onSubmit() {
            if (this.read) {
                if (this.isWx) {
                    if (!this.user.avatarUrl) {
                        uni.showToast({
                            title: "请授权头像",
                            icon: 'none'
                        })
                        return;
                    }
                    if (!this.user.name) {
                        uni.showToast({
                            title: "请输入昵称",
                            icon: 'none'
                        })
                        return;
                    }
                    this.user.name = this.user.name.trim();
                    if (this.user.name.length > 15 || this.user.name.length <= 0) {
                        uni.showToast({
                            title: "昵称长度应在0-15字符之间",
                            icon: 'none'
                        })
                        return;
                    }
                    if (!this.user.phone) {
                        uni.showToast({
                            title: "请授权手机号",
                            icon: 'none'
                        })
                        return;
                    };
                    this.disabled = true;
                    updateUserInfo({ ...this.userInfo, avatarUrl: this.user.avatarUrl, nickName: this.user.name, mobile: this.user.phone }).then(() => {
                        uni.showToast({
                            title: "授权成功",
                            icon: "none",
                        });
                        this.back(800);
                    }, () => {
                        uni.showToast({
                            title: "授权失败，请重试",
                            icon: "none",
                        });
                        this.disabled = false;
                    })
                } else {  // 抖音用原来的授权方式
                    getUserProfile().then(res => {
                        this.back();
                    })
                }
            } else {
                uni.showToast({
                    title: "请先阅读并同意《服务条款》",
                    icon: 'none'
                })
            }
        },
        inputName(event) {
            this.user.name = event.detail.value;
        },
        chooseavatar(e) {
            uni.uploadFile({
                url: this.BASE_URL + 'upload',
                filePath: e.detail.avatarUrl,
                name: 'file',
                success: (uploadFileRes) => {
                    if (uploadFileRes.data) {
                        const res = JSON.parse(uploadFileRes.data);
                        this.user.avatarUrl = res.data.files.url;
                    }
                }
            });
        },
        getMobile(e) {
            getPhoneNumber(e, true).then(res => {
                this.user.phone = res;
            })
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
