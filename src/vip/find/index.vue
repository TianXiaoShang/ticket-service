<template>
    <div class="page-box bg-gray-bg p-20px box-border text-14px text-gray-999">
        <loading />
        <div class="pb-44px">
            <div class="">请输入以下信息（务必与原卡信息一致）</div>
            <div class="rounded bg-white p-20px mt-10px is-input">
                <div class="flex items-center">
                    <div class="text-14px font-semibold text-gray-333 w-5em">姓名<span class="text-red ml-2px">*</span>
                    </div>
                    <u--input :customStyle="inputCustomStyle" placeholder="请输入姓名" border="surround"
                        v-model="user.name"></u--input>
                </div>
                <div class="mt-10px flex items-center">
                    <div class="text-14px font-semibold text-gray-333 w-5em">手机号<span class="text-red ml-2px">*</span>
                    </div>
                    <div class="relative h-40px flex-1">
                        <u--input :customStyle="inputCustomStyle" placeholder="点击获取手机号" border="surround"
                            v-model="user.phone"></u--input>
                        <button slot="button" @getphonenumber="getMobile"
                            class="absolute left-0 top-0 right-0 bottom-0 opacity-0 z-999" openType="getPhoneNumber">
                        </button>
                    </div>
                </div>
                <!-- <div class="mt-10px flex items-center">
                    <div class="text-14px font-semibold text-gray-333 w-5em">编号<span class="text-red ml-2px">*</span>
                    </div>
                    <u--input :customStyle="inputCustomStyle" placeholder="请输入编号" border="surround"
                        v-model="user.code"></u--input>
                </div> -->
            </div>

            <div class="mt-20px">重新设置您的会员卡密码</div>
            <div class="rounded bg-white p-20px mt-10px is-input">
                <div class="flex items-center">
                    <div class="text-14px font-semibold text-gray-333 w-5em">密码<span class="text-red ml-2px">*</span>
                    </div>
                    <u--input type="password" :customStyle="inputCustomStyle" placeholder="请输入密码"
                        border="surround" v-model="user.password"></u--input>
                </div>
                <div class="mt-10px flex items-center">
                    <div class="text-14px font-semibold text-gray-333 w-5em">确认密码<span class="text-red ml-2px">*</span>
                    </div>
                    <u--input type="password" :customStyle="inputCustomStyle" placeholder="请再次输入密码"
                        border="surround" v-model="user.password2"></u--input>
                </div>
            </div>
        </div>

        <!-- 底部按钮 -->
        <div class="fixed z-998 bottom-20px h-44px flex items-center justify-center px-20px left-0 w-full box-border">
            <u-button shape="circle" size="normal" :customStyle="{ height: '44px', width: '160px', margin: 0 }"
                color="#FF545C" text="确定" @click="confirm">
            </u-button>
        </div>
        <pay-popup :content="card_explain" @success="onSuccess" ref="isPayPopup"></pay-popup>
    </div>
</template>

<script>
import PayPopup from '../components/pay-popup.vue'
import { getPhoneNumber } from '@/util/base';
import { parseRichText } from '@/util';
export default {
    data() {
        return {
            user: {
                name: '',
                phone: '',
                // code: '',
                password: '',
                password2: ''
            },
            card_explain: ''
        }
    },
    components: { PayPopup },
    onShow: function () {
        // 确保已经登录完成
        this.waitLogin().then(() => {
            this.getData();
        });
    },
    methods: {
        getData() {
            this.request("recharge.combo").then(res => {
                if (res.set.card_explain) {
                    this.card_explain = parseRichText(res.set.card_explain)
                }
            })
        },
        confirm() {
            for (const key in this.user) {
                if (Object.hasOwnProperty.call(this.user, key)) {
                    this.user[key] = this.user[key].trim();
                    const element = this.user[key];
                    if (!element) {
                        uni.showToast({
                            title: "信息未填写完整",
                            icon: "none",
                        })
                        return;
                    }
                }
            }
            if (this.user.password !== this.user.password2) {
                uni.showToast({
                    title: "两次密码输入不一致",
                    icon: "none",
                })
                return;
            }
            if (this.user.password.length < 6 || this.user.password.length > 18) {
                uni.showToast({
                    title: "密码长度须为6-18位",
                    icon: "none",
                })
                return;
            }
            this.$refs.isPayPopup.showPayPopup();
        },
        getMobile(e) {
            getPhoneNumber(e, true).then(res => {
                this.user.phone = res;
            }, () => { })
        },
        onSuccess() {
            this.request(
                "member.binding",
                {
                    mobile: this.user.phone,
                    name: this.user.username,
                    password: this.user.password,
                }, "POST").then((res) => {
                    uni.showToast({
                        title: res.message || "绑定成功",
                        icon: "none",
                    });
                    this.back(800);
                }).finally(() => {
                    this.$refs.isPayPopup.hidePayPopup();
                });
        }

    },

};
</script>