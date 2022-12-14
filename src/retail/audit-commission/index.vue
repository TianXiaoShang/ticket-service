<template>
    <div class="page-box bg-gray-bg box-border">
        <loading />
        <div class="bg-red h-74px px-20px box-border flex flex-col justify-center">
            <div class="flex items-center">
                <div class="text-0px">
                    <image class="w-20px h-20px mr-6px" src="../static/money@2x.png" />
                </div>
                <span class="text-14px text-white">
                    {{ configData.texts.commission_ok || '' }}{{ withdrawInfo.member.commission_ok || 0 }}{{
                            configData.texts.yuan || '元'
                    }}
                </span>
            </div>
            <div class="flex items-center mt-10px">
                <div class="text-0px">
                    <image class="w-20px h-20px mr-6px" src="../static/money@2x.png" />
                </div>
                <span class="text-14px text-white">
                    {{ configData.texts.commission_lock || '' }}{{ withdrawInfo.member.commission_lock || 0 }}元
                </span>
            </div>
        </div>
        <!-- 内容 -->
        <div class="p-20px mt-5px pb-84px text-14px">
            <div class="text-gray-999">提现方式</div>
            <div class="w-full">
                <u-radio-group v-model="type" @change="onRadioChange">
                    <div class="w-full">
                        <!-- 微信 -->
                        <div class="rounded bg-white mt-10px p-20px" v-if="configData.cashweixin == 1">
                            <div class="flex justify-between">
                                <div class="flex items-center">
                                    <image src="../static/pay-wechat@2x.png" class="w-22px h-22px" alt="" />
                                    <div class="ml-10px flex flex-col">
                                        <span class="text-gray-333 font-semibold">提现到微信</span>
                                    </div>
                                </div>
                                <div class="w-22px h-22px">
                                    <u-radio size="22px" activeColor="#FF545C" :label="' '" name="1"></u-radio>
                                </div>
                            </div>
                            <div class="is-input mt-20px" v-if="type === '1'">
                                <div class="flex items-center">
                                    <div class="text-14px font-semibold text-gray-333 w-5em">昵称<span
                                            class="text-red">*</span></div>
                                    <u--input :customStyle="inputCustomStyle" placeholder="请输入微信昵称" border="surround"
                                        v-model="wechat.realname"></u--input>
                                </div>
                            </div>
                        </div>

                        <!-- 支付宝 -->
                        <div class="rounded bg-white mt-10px p-20px"
                            v-if="configData.cashother == 1 && configData.cashalipay == 1">
                            <div class="flex justify-between">
                                <div class="flex items-center">
                                    <image src="../static/pay-zfb@2x.png" class="w-22px h-22px" alt="" />
                                    <div class="ml-10px flex flex-col">
                                        <span class="text-gray-333 font-semibold">提现到支付宝</span>
                                    </div>
                                </div>
                                <div class="w-22px h-22px">
                                    <u-radio size="22px" activeColor="#FF545C" :label="' '" name="2"></u-radio>
                                </div>
                            </div>
                            <div class="is-input mt-20px" v-if="type === '2'">
                                <div class="flex items-center">
                                    <div class="text-14px font-semibold text-gray-333 w-5em">姓名<span
                                            class="text-red">*</span></div>
                                    <u--input :customStyle="inputCustomStyle" placeholder="请输入支付宝姓名" border="surround"
                                        v-model="alipay.realname"></u--input>
                                </div>
                                <div class="mt-10px flex items-center">
                                    <div class="text-14px font-semibold text-gray-333 w-5em">账号<span
                                            class="text-red">*</span></div>
                                    <u--input :customStyle="inputCustomStyle" placeholder="请输入支付宝账号" border="surround"
                                        v-model="alipay.alipay"></u--input>
                                </div>
                                <div class="mt-10px flex items-center">
                                    <div class="text-14px font-semibold text-gray-333 w-5em">确认账号<span
                                            class="text-red">*</span></div>
                                    <u--input :customStyle="inputCustomStyle" placeholder="请再次输入支付宝账号" border="surround"
                                        v-model="alipay.alipay1"></u--input>
                                </div>
                            </div>
                        </div>

                        <!-- 银行卡 -->
                        <div class="rounded bg-white mt-10px p-20px"
                            v-if="configData.cashother == 1 && configData.cashcard == 1">
                            <div class="flex justify-between">
                                <div class="flex items-center">
                                    <image src="../static/pay-card@2x.png" class="w-22px h-22px" alt="" />
                                    <div class="ml-10px flex flex-col">
                                        <span class="text-gray-333 font-semibold">提现到银行卡</span>
                                    </div>
                                </div>
                                <div class="w-22px h-22px">
                                    <u-radio size="22px" activeColor="#FF545C" :label="' '" name="3"></u-radio>
                                </div>
                            </div>
                            <div class="is-input mt-20px" v-if="type === '3'">
                                <div class="flex items-center">
                                    <div class="text-14px font-semibold text-gray-333 w-5em">姓名<span
                                            class="text-red">*</span></div>
                                    <u--input :customStyle="inputCustomStyle" placeholder="请输入姓名" border="surround"
                                        v-model="bank.realname"></u--input>
                                </div>
                                <div class="mt-10px flex items-center">
                                    <div class="text-14px font-semibold text-gray-333 w-5em">银行名称<span
                                            class="text-red">*</span></div>
                                    <u--input :customStyle="inputCustomStyle" placeholder="请输入开户行名称" border="surround"
                                        v-model="bank.bankname"></u--input>
                                </div>
                                <div class="mt-10px flex items-center">
                                    <div class="text-14px font-semibold text-gray-333 w-5em">银行卡号<span
                                            class="text-red">*</span></div>
                                    <u--input type="number" :customStyle="inputCustomStyle" placeholder="请输入银行卡号"
                                        border="surround" v-model="bank.bankcard"></u--input>
                                </div>
                                <div class="mt-10px flex items-center">
                                    <div class="text-14px font-semibold text-gray-333 w-5em">确认卡号<span
                                            class="text-red">*</span></div>
                                    <u--input type="number" :customStyle="inputCustomStyle" placeholder="请再次输入银行卡号"
                                        border="surround" v-model="bank.bankcard1"></u--input>
                                </div>
                            </div>
                        </div>
                    </div>
                </u-radio-group>
            </div>
        </div>
        <!-- 按钮 -->
        <div class="fixed z-998 bottom-20px h-44px flex items-center justify-center px-20px left-0 w-full box-border">
            <u-button shape="circle" size="normal" :disabled="withdrawInfo.member.commission_ok > 0"
                :customStyle="{ height: '44px', width: '160px', margin: 0 }" color="#FF545C" :text="'提交'"
                @click="onSubmit">
            </u-button>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            withdrawInfo: {},
            configData: {},
            withdrawType: {},
            type: '',
            wechat: {
                realname: ''
            },
            alipay: {
                realname: '',
                alipay: '',
                alipay1: '',
            },
            bank: {
                realname: '',
                bankname: '',
                bankcard: '',
                bankcard1: '',
            }
        }
    },
    onLoad: function () {
        // 确保已经登录完成
        this.waitLogin().then(async () => {
            const configData = await this.request("commission.set");
            this.configData = configData.set;
            console.log(this.configData, 'configDataconfigData')
            this.withdrawType = await this.request("commission.withdraw.apply")
            this.withdrawInfo = await this.request("commission.withdraw");

            const idx = [
                configData.cashweixin,
                configData.cashother && configData.cashalipay,
                configData.cashother && configData.cashcard,
            ].findIndex((d) => d == 1)
            this.type = idx + 1;
        });
    },
    methods: {
        onRadioChange(e) {
            const curIndex = Number(e) - 1;
            const keys = ['wechat', 'alipay', 'bank']
            // 遍历除了当前选中方式之外的两个表单对象
            keys.filter((item, index) => index != curIndex).forEach((item) => {
                // 清除填写的值
                for (const key in this[item]) {
                    if (Object.hasOwnProperty.call(this[item], key)) {
                        this[item][key] = '';
                    }
                }
            });
        },
        async onSubmit() {
            this.withdrawInfo = await this.request("commission.withdraw");
            if (!this.withdrawInfo.cansettle) {
                uni.showToast({
                    title: "当前不可提现",
                    icon: "none",
                })
                return;
            }
            const flag = this.validateForm();
            if (flag) {
                let params = { type: this.type };
                if (this.type === '1') {
                    params = { ...params, ...this.wechat };
                }
                if (this.type === '2') {
                    params = { ...params, ...this.alipay };
                }
                if (this.type === '3') {
                    params = { ...params, ...this.bank };
                }
                this.request("commission.withdraw.apply", params, "POST")
                    .then((res) => {
                        if (res.errno !== -1) {
                            uni.showToast({
                                title: "提现申请成功，请等待审核",
                                icon: "success",
                            })
                            this.back(800)
                        }
                    })
            }
        },
        validateForm() {
            if (this.type === '1') {
                const flag1 = !!this.wechat.realname;
                if (!flag1) {
                    uni.showToast({ title: "请输入姓名", icon: "none" });
                    return flag1;
                }
            }
            if (this.type === '2') {
                const flag1 = !!this.alipay.realname;
                if (!flag1) {
                    uni.showToast({ title: "请输入姓名", icon: "none" });
                    return flag1;
                }
                const flag2 = this.alipay.alipay && this.alipay.alipay1;
                if (!flag2) {
                    uni.showToast({ title: `请${this.alipay.alipay && !this.alipay.alipay1 ? '再次' : ''}输入支付宝账号`, icon: "none" });
                    return flag2;
                }
                const flag3 = this.alipay.alipay === this.alipay.alipay1;
                if (!flag3) {
                    uni.showToast({ title: "两次输入支付宝账号不一致", icon: "none" });
                    return flag3;
                }
            }
            if (this.type === '3') {
                const flag1 = !!this.bank.realname;
                if (!flag1) {
                    uni.showToast({ title: "请输入姓名", icon: "none" });
                    return flag1;
                }
                const flag2 = !!this.bank.bankname;
                if (!flag2) {
                    uni.showToast({ title: "请输入开户行名称", icon: "none" });
                    return flag2;
                }
                const flag3 = this.bank.bankcard && this.bank.bankcard1;
                if (!flag3) {
                    uni.showToast({ title: `请${this.bank.bankcard && !this.bank.bankcard1 ? '再次' : ''}输入银行卡号`, icon: "none" });
                    return flag3;
                }
                const flag4 = this.bank.bankcard === this.bank.bankcard1;
                if (!flag4) {
                    uni.showToast({ title: "两次输入银行卡号不一致", icon: "none" });
                    return flag4;
                }
                const flag5 = /^\d+$/.test(this.bank.bankcard) && [16, 17, 19].includes(this.bank.bankcard.length);
                if (!flag5) {
                    uni.showToast({ title: "请输入正确的银行卡号", icon: "none" });
                    return flag5;
                }
            }
            return true;
        }
    },
};
</script>