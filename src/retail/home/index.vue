<template>
    <view class="page-box bg-gray-bg box-border">
        <loading />
        <!-- 自定义导航 -->
        <nav-bar v-if="isWx" showBack :title="'合伙人中心'" :backgroundColor="'transparent'"></nav-bar>
        <!-- 背景 -->
        <div class="fixed h-100vh overflow-hidden left-0 top-0 w-100vw">
            <image src="@/static/self/colorbg@2x.png" mode="widthFix" class="w-full" />
        </div>
        <!-- 内容区域 -->
        <div class="relative z-99 py-20px text-14px">
            <!-- 基本资料 -->
            <div class="flex justify-between items-center px-20px">
                <div class="flex items-center">
                    <!-- 头像 -->
                    <div
                        class="relative rounded-full border-solid shadow-lg border-2 border-white box-border overflow-hidden w-60px h-60px">
                        <image :src="(userInfo.avatar || DEFAULT_AVATAR)" class="w-full h-full" />
                    </div>
                    <!-- 昵称 -->
                    <div class="ml-10px">
                        <div class="text-333 font-semibold text-20">
                            {{ userInfo.nickname }}</div>
                        <!-- 手机号 -->
                        <div class="text-gray-666 text-12px mt-10px">
                            <span class="relative">
                                推荐人：{{ agentInfo.agentname }}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="right flex items-center text-0px">
                    <div>
                        <image class="w-34px h-25px" src="../static/level@2x.png" />
                    </div>
                    <span class="text-gray-333 text-14px ml-5px">{{ agentInfo.levelname }}</span>
                </div>
            </div>
            <!-- vip卡 start -->
            <div class="mt-20px relative text-0px h-23.8vw w-full">
                <!-- TAG - card图要更换 -->
                <image src="@/static/self/card.png" class="w-full h-23.8vw" />
                <div class="absolute left-20px text-white right-20px top-0 bottom-0 px-20px box-border">
                    <div class="flex justify-between items-center mt-16px">
                        <div class="text-12px">佣金余额（{{ configData.texts.yuan }}）</div>
                        <div class="bg-red w-76px h-26px flex justify-center text-12px items-center rounded-13px">佣金提现
                        </div>
                    </div>
                    <div class="text-16 special-text flex items-end justify-between">
                        <div class="text-16 special-text text-22px font-semibold">
                            {{ agentInfo.member.commission_ok || 0 }}
                        </div>
                        <div class="text-10px opacity-50">成功提现佣金：{{ agentInfo.member.commission_pay ||
                                0
                        }}{{ configData.texts.yuan }}</div>
                    </div>
                </div>
            </div>
            <!-- vip卡 end -->
            <div class="bg-gray-bg content-box px-20px pt-20px">
                <!-- 功能卡片 -->
                <div class="bar-wrap">
                    <div @click="toPath('/retail/commission/index')"
                        class="h-56px mt-10px px-20px box-border py-18px flex items-center justify-between bg-white rounded">
                        <div class="flex items-center">
                            <image mode="aspectFit" src="../static/profit-16.png" class="w-16px h-16px" />
                            <span class="ml-10px text-gray-333 text-14px">我的收益</span>
                        </div>
                        <div class="ml-4px flex items-center">
                            <span class="text-gray-999 text-12px mr-8px">{{ agentInfo.member.commission_ok || 0
                            }}元</span>
                            <u-icon name="arrow-right" size="16px" color="#999"></u-icon>
                        </div>
                    </div>
                    <div @click="toPath('/retail/order/index')"
                        class="h-56px mt-10px px-20px box-border py-18px flex items-center justify-between bg-white rounded">
                        <div class="flex items-center">
                            <image mode="aspectFit" src="../static/order-16.png" class="w-16px h-16px" />
                            <span class="ml-10px text-gray-333 text-14px">分销订单</span>
                        </div>
                        <div class="ml-4px flex items-center">
                            <span class="text-gray-999 text-12px mr-8px">{{ agentInfo.member.ordercount0 || 0 }}笔</span>
                            <u-icon name="arrow-right" size="16px" color="#999"></u-icon>
                        </div>
                    </div>
                    <div @click="toPath('/retail/withdraw-detail/index')"
                        class="h-56px mt-10px px-20px box-border py-18px flex items-center justify-between bg-white rounded">
                        <div class="flex items-center">
                            <image mode="aspectFit" src="../static/out-16.png" class="w-16px h-16px" />
                            <span class="ml-10px text-gray-333 text-14px">提现明细</span>
                        </div>
                        <div class="ml-4px flex items-center">
                            <span class="text-gray-999 text-12px mr-8px">{{ agentInfo.member.applycount || 0 }}笔</span>
                            <u-icon name="arrow-right" size="16px" color="#999"></u-icon>
                        </div>
                    </div>
                    <div @click="toPath('/retail/team/index')"
                        class="h-56px mt-10px px-20px box-border py-18px flex items-center justify-between bg-white rounded">
                        <div class="flex items-center">
                            <image mode="aspectFit" src="../static/team-16.png" class="w-16px h-16px" />
                            <span class="ml-10px text-gray-333 text-14px">我的团队</span>
                        </div>
                        <div class="ml-4px flex items-center">
                            <u-icon name="arrow-right" size="16px" color="#999"></u-icon>
                        </div>
                    </div>
                    <div @click="toPath('/retail/poster/index')"
                        class="h-56px mt-10px px-20px box-border py-18px flex items-center justify-between bg-white rounded">
                        <div class="flex items-center">
                            <image mode="aspectFit" src="../static/code-16.png" class="w-16px h-16px" />
                            <span class="ml-10px text-gray-333 text-14px">推广二维码</span>
                        </div>
                        <div class="ml-4px flex items-center">
                            <u-icon name="arrow-right" size="16px" color="#999"></u-icon>
                        </div>
                    </div>
                    <div @click="toPath('/retail/audit-list/index')" v-if="true || agentInfo.level.is_audit == 1"
                        class="h-56px mt-10px px-20px box-border py-18px flex items-center justify-between bg-white rounded">
                        <div class="flex items-center">
                            <image mode="aspectFit" src="../static/code-16.png" class="w-16px h-16px" />
                            <span class="ml-10px text-gray-333 text-14px">申请列表</span>
                        </div>
                        <div class="ml-4px flex items-center">
                            <u-icon name="arrow-right" size="16px" color="#999"></u-icon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </view>
</template>

<script>
// TAG - 列表跳转没对接
import NavBar from '@/components/nav-bar';

export default {
    data() {
        return {
            configData: {},
            agentInfo: {},
        }
    },
    components: { NavBar },
    onShow() {
        this.waitLogin().then(() => {
            this.initConfig();
            this.initAgentInfo();
        })
    },
    onLoad() {

    },
    methods: {
        initConfig() {
            this.request("commission.set").then((res) => {
                const { set } = res
                uni.setNavigationBarTitle({
                    title: set.texts.center,
                })
                this.configData = set;
            })
        },
        // 分销商信息
        initAgentInfo() {
            this.request("commission.agent").then((res) => {
                this.agentInfo = res;
            })
        },
    }
};
</script>
