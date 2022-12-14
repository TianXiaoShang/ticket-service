<template>
    <div class="page-box bg-gray-bg p-20px box-border text-14px text-gray-999">
        <loading />
        <div class="pb-44px">
            <div class="">请完善您的会员信息</div>
            <div class="rounded bg-white p-20px mt-10px is-input">
                <div class="flex items-center">
                    <div class="text-14px font-semibold text-gray-333 w-5em">姓名<span class="text-red ml-2px">*</span>
                    </div>
                    <u--input :customStyle="inputCustomStyle" placeholder="请输入姓名" border="surround"
                        v-model="user.name"></u--input>
                </div>
                <div class="flex mt-10px items-center">
                    <div class="text-14px font-semibold text-gray-333 w-5em">身份证
                    </div>
                    <u--input :customStyle="inputCustomStyle" placeholder="请输入身份证（选填）" border="surround"
                        v-model="user.card"></u--input>
                </div>
                <div class="flex mt-10px items-center">
                    <div class="text-14px font-semibold text-gray-333 w-5em">性别<span class="text-red ml-2px">*</span>
                    </div>
                    <u-radio-group v-model="user.radio">
                        <div class="flex items-center">
                            <div>
                                <u-radio size="22px" activeColor="#FF545C" :label="'男'" name="0">
                                </u-radio>
                            </div>
                            <div class="ml-30px">
                                <u-radio size="22px" activeColor="#FF545C" :label="'女'" name="1">
                                </u-radio>
                            </div>
                        </div>
                    </u-radio-group>
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
import { parseRichText } from '@/util';
export default {
    data() {
        return {
            user: {
                name: '',
                idcard: '',
                radio: '0'
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
            this.getMember().then(res => {
                this.user.radio = res.card.sex || '0';
                this.user.idcard = res.card.id_card;
                this.user.name = res.card.name;
            })
            this.request("recharge.combo").then(res => {
                if (res.set.card_explain) {
                    this.card_explain = parseRichText(res.set.card_explain)
                }
            })
        },
        confirm() {
            if (!this.user.name) {
                uni.showToast({
                    title: "请填写姓名",
                    icon: "none",
                })
                return;
            }
            this.$refs.isPayPopup.showPayPopup();
        },
        onSuccess() {
            this.$refs.isPayPopup.hidePayPopup();
            this.request("recharge.perfect", {
                name: this.user.name,
                mobile: this.userInfo.mobile,
                idcard: this.user.idcard,
                radio: this.user.radio,
                _showToast: true
            }).then(() => {
                this.back(800)
            })
        }
    },
};
</script>