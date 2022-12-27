<template>
    <div class="page-box bg-white box-border">
        <loading />
        <!-- 自定义导航 -->
        <nav-bar v-if="isWx" :title="'申请单'" showBack :backgroundColor="'transparent'"></nav-bar>
        <!-- 背景 -->
        <div class="fixed h-100vh overflow-hidden left-0 top-0 w-100vw">
            <image src="@/static/self/colorbg@2x.png" mode="widthFix" class="w-full" />
        </div>

        <template v-if="pageLoad">
            <div class="relative z-99 text-0px">
                <img class="w-full h-52.26vw" src="../static/joinus.png" alt="">
                <div class="py-20px bg-gray-bg text-14px overflow-y-auto pb-70px box-border"
                    :style="{ height: `calc(100vh - 52.26vw - ${isWx ? navBarHeight + statusBarHeight : 0}px)` }">
                    <template v-if="configData.become == '1'">
                        <div class="px-20px">
                            <div class="text-gray-666 px-10px flex items-center">
                                <span>欢迎加入
                                    <span class="text-gray-333 font-semibold">{{ cinema.title }}</span>
                                    ，请填写申请信息
                                </span>
                            </div>
                            <!-- 表单 -->
                            <div class="rounde mt-20px is-input">
                                <div class="flex items-center bg-white px-20px py-10px rounded">
                                    <div class="text-14px font-semibold text-gray-333 w-4em">邀请人
                                    </div>
                                    <u--input :customStyle="{ background: '#fff' }" readonly border="surround"
                                        :value="(agentBecomeData.member.agent_id > 0 ? agentBecomeData.agent.nickname : '总店') + '(请核对)'"></u--input>
                                </div>
                                <div class="flex items-center bg-white px-20px py-10px rounded mt-10px">
                                    <div class="text-14px font-semibold text-gray-333 w-4em">姓名<span
                                            class="text-red ml-2px">*</span>
                                    </div>
                                    <u--input :customStyle="{ background: '#fff' }" placeholder="请填写真实姓名，用于结算"
                                        border="surround" v-model="user.name"></u--input>
                                </div>
                                <div class="mt-10px flex items-center bg-white px-20px py-10px rounded">
                                    <div class="text-14px font-semibold text-gray-333 w-4em">手机号<span
                                            class="text-red ml-2px">*</span>
                                    </div>
                                    <div class="relative h-40px flex-1">
                                        <u--input :customStyle="{ background: '#fff' }" placeholder="请授权手机号码，方便联系"
                                            border="surround" v-model="user.phone"></u--input>
                                        <button slot="button" @getphonenumber="getMobile"
                                            class="absolute left-0 top-0 right-0 bottom-0 opacity-0 z-999"
                                            openType="getPhoneNumber">
                                        </button>
                                    </div>
                                </div>
                                <!-- 协议 -->
                                <div class="flex mt-20px items-center text-14 text-gray-333">
                                    <image v-if="read" @click="onRead(false)" src="@/static/common/agree-sel@2x.png"
                                        class="w-15px h-15px">
                                    </image>
                                    <div v-if="!read" @click="showPopup = true"
                                        class="box-border rounded-full w-15px h-15px border border-solid border-red">
                                    </div>
                                    <span class="ml-4px">同意<span class="text-blue"
                                            @click="showPopup = true">《服务条款》</span></span>
                                </div>
                            </div>
                        </div>
                        <div class="text-0px mt-10px">
                            <image :src="configData.register_bottom" mode="widthFix" style="width: 100%;" />
                        </div>
                    </template>
                    <template v-else>
                        <div class="px-20px text-gray-666">
                            <div class="px-10px flex items-center">
                                <span>欢迎加入
                                    <span class="text-gray-333 font-semibold">{{ cinema.title }}</span>
                                    ，请完成申请条件
                                </span>
                            </div>
                            <div class="mt-40px">
                                <div class="flex items-end justify-center">
                                    <span>当前</span>
                                    <span class="text-red text-22px font-semibold mx-5px">{{ configData.become == '2' ?
                                            (agentCondition.ordercount || 0) : (agentCondition.moneycount || '0.00')
                                    }}</span>
                                    <span>{{ configData.become == '2' ? '次' : '元' }}</span>
                                </div>
                                <div class="mt-15px px-10px flex items-center justify-between">
                                    <div class="mr-8px text-gray-666">0</div>
                                    <u-line-progress
                                        :percentage="configData.become == '2' ? ((agentCondition.ordercount || 0) / configData.become_ordercount) * 100 : ((agentCondition.moneycount || 0) / configData.become_moneycount) * 100"
                                        :showText="false"></u-line-progress>
                                    <div class="ml-8px text-gray-666">{{ configData.become == '2' ?
                                            configData.become_ordercount :
                                            configData.become_moneycount || 0
                                    }}</div>
                                </div>
                                <div class="mt-15px flex flex-col items-center">
                                    <div>合伙人申请条件 累计消费满
                                        <span class="text-red text-22px font-semibold mx-5px">
                                            {{ configData.become == '2' ? configData.become_ordercount :
                                                    configData.become_moneycount || 0
                                            }}</span>
                                        {{ configData.become == '2' ? '次' : '元' }}
                                    </div>
                                    <div class="mt-10px">
                                        订单{{ configData.become_order == '0' ? '付款' : '完成' }}后生效
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
            <!-- 底部按钮 -->
            <div v-if="configData.become == '1'"
                class="fixed z-998 bottom-20px h-44px flex items-center justify-center px-20px left-0 w-full box-border">
                <u-button shape="circle" size="normal" :customStyle="{ height: '44px', width: '160px', margin: 0 }"
                    color="#FF545C" text="提交申请" @click="confirm">
                </u-button>
            </div>
            <div v-else
                class="fixed z-998 bottom-20px h-44px flex items-center justify-center px-20px left-0 w-full box-border">
                <u-button shape="circle" size="normal" :customStyle="{ height: '44px', width: '160px', margin: 0 }"
                    color="#FF545C" text="我知道了" @click="back">
                </u-button>
            </div>
        </template>

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
                    <rich-text :nodes="applycontent"></rich-text>
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
import NavBar from '@/components/nav-bar';
import { getStatusBarInfo } from '@/util/index.js'
import { parseRichText } from '@/util';
import { getPhoneNumber } from '@/util/base';
import store from '../../store';

export default {
    data() {
        return {
            info: {},
            showPopup: false,
            read: false,
            statusBarHeight: 0,
            navBarHeight: 0,
            applycontent: '',
            configData: {},
            user: {
                phone: '',
                name: '',
            }
        }
    },
    components: { NavBar },
    onLoad() {
        const { statusBarHeight, navBarHeight } = getStatusBarInfo();
        this.statusBarHeight = statusBarHeight;
        this.navBarHeight = navBarHeight;
        this.waitLogin().then(async () => {
            this.agentInfo = await this.request("member").then((res) => {
                return res.member
            })
            this.user.phone = this.agentInfo.mobile || '';
            await this.initConfig();
            await this.initApplyData();
            await this.initCondition();
            this.init();
        })
    },
    methods: {
        initConfig() {
            return this.request("commission.set").then((res) => {
                this.applycontent = parseRichText(res.set.applycontent)
                this.configData = res.set;
                this.pageLoad = true;
            })
        },
        initApplyData() {
            return this.request("commission.agent.become").then((res) => {
                this.agentBecomeData = res;
            })
        },
        // 成为分销商条件
        initCondition() {
            store.commit('UPDATE_HIDE_ERROR_MESSAGE', true)
            return this.request("commission.agent.condition")
                .then((res) => {
                    this.agentCondition = res;
                }).finally(() => {
                    store.commit('UPDATE_HIDE_ERROR_MESSAGE', false)
                })
        },
        init() {
            const { agent_status, is_agent } = this.agentInfo;
            const { become, become_check, become_ordercount, become_moneycount } =
                this.configData;
            const { ordercount, moneycount } = this.agentCondition;
            if (
                become === undefined &&
                become_check === undefined &&
                become_moneycount === undefined &&
                become_ordercount === undefined &&
                ordercount === undefined &&
                moneycount === undefined &&
                is_agent === undefined
            ) {
                return;
            }
            if (
                (become_check === "1" && is_agent > 0) ||
                (become_check === "0" && agent_status === "1" && is_agent > 0)
            ) {
                console.log(1111111111111)
                uni.redirectTo({
                    url: "/retail/retail/index",
                })
                return;
            }
            if (become_check === "0" && agent_status === "0" && is_agent > 0) {
                console.log(1111111111122222)
                uni.redirectTo({
                    url: "/retail/audit-page/index",
                })
                return;
            }
        },
        getMobile(e) {
            getPhoneNumber(e, true).then(res => {
                this.user.phone = res;
            })
        },
        confirm() {
            if (!this.read) {
                uni.showToast({
                    title: '请先阅读并同意《服务条款》',
                    icon: 'none'
                })
                return;
            }
            if (!this.user.name || !this.user.phone) {
                uni.showToast({
                    title: '信息未填写完整',
                    icon: 'none'
                })
                return;
            }
            this.request(
                "commission.agent.become",
                { realname: this.user.name, mobile: this.user.phone, _showToast: true },
                "POST"
            )
                .then(() => {
                    const { become_check } = this.configData;
                    if (become_check === "0") {
                        uni.redirectTo({
                            url: "/retail/audit-page/index",
                        })
                        return;
                    } else {
                        uni.redirectTo({
                            url: "/retail/home/index",
                        })
                    }
                })
        },
        onRead(val) {
            this.showPopup = false;
            this.read = val;
        },
    }
};
</script>