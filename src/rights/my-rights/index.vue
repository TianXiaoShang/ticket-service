<template>
    <div class="page-box bg-gray-bg p-20px pt-0 box-border">
        <loading />
        <!-- tabs -->
        <u-tabs :current="tabIndex" :list="statusList" @click="changeTab" lineColor="#FF545C"
            :itemStyle="{ height: '42px' }"
            :activeStyle="{ color: '#333', fontWeight: 'bold', transform: 'scale(1.05)' }"
            :inactiveStyle="{ color: '#999999', transform: 'scale(1)' }"></u-tabs>


        <!-- tab内容 -->
        <div class="w-full box-border">
            <div v-if="!rightsList || !rightsList.length" class="mt-10px">
                <u-empty mode="coupon" text="暂无权益卡" icon="http://cdn.uviewui.com/uview/empty/coupon.png">
                </u-empty>
            </div>
            <!-- 优惠券列表 -->
            <template v-else>
                <scroll-view scroll-y="true" class="pt-10px"
                    style="height: calc(100vh - 42px - 20px - 10px - 44px - 10px);">
                    <div v-for="(item, index) in rightsList" :key="index" class="mb-10px">
                        <rights-item @success="getData" :rightsData="item" :cardType="curType"></rights-item>
                    </div>
                </scroll-view>
            </template>
        </div>

        <!-- 底部按钮 -->
        <div class="fixed z-998 bottom-20px h-44px flex items-center justify-center px-20px left-0 w-full box-border">
            <u-button shape="circle" size="normal" :customStyle="{ height: '44px', width: '180px', margin: 0 }"
                color="#FF545C" text="激活码KEY兑换权益卡" @click="(showModal = true)">
            </u-button>
        </div>

        <!-- 兑换码弹窗 -->
        <u-modal :show="showModal" width="580rpx" :title="'兑换权益卡'" showCancelButton :confirmColor="'#FF545C'">
            <view class="py-10px w-full flex items-center justify-between" style="border-bottom: 1px solid #eee">
                <input class="flex-1" placeholder-style="color: #999; font-size: 14px;" placeholder="请输入激活码" type="text"
                    v-model="code" @input="inputCode" />
                <image class="h-24px w-24px ml-10px;" src="../static/scan.png" @click="onScan" />
            </view>
            <div slot="confirmButton" class="flex justify-between">
                <u-button shape="circle" size="normal" plain :customStyle="{ height: '44px', width: '45%', margin: 0 }"
                    color="#999" text="取消" @click="(showModal = false)">
                </u-button>
                <u-button shape="circle" size="normal" :customStyle="{ height: '44px', width: '45%', margin: 0 }"
                    color="#FF545C" text="确认" @click="handleCode">
                </u-button>
            </div>
        </u-modal>

        <!-- 权益卡兑换须知 -->
        <pay-popup :rightsData="cardData" ref="isPayPopup" :customEvent="true"
            @customEvent="handleActivate"></pay-popup>
    </div>
</template>

<script>
import RightsItem from '../components/rights-item.vue';
import PayPopup from '../components/pay-popup.vue'
export default {
    components: { RightsItem, PayPopup },
    data() {
        return {
            tabIndex: 0,
            statusList: [{ name: '可使用' }, { name: '可购买' }, { name: '不可用' }],
            rightsList: [],
            curType: 'canUse',
            showModal: false,
            code: '',
            cardData: {}
        }
    },
    onLoad() {
        // 确保已经登录完成
        this.waitLogin().then(() => {
            this.getData();
        });
    },
    methods: {
        inputCode(event) {
            this.code = event.detail.value;
            setTimeout(() => {
                this.code = this.code.trim();
            });
        },
        onScan() {
            uni.scanCode({
                success: (res) => {
                    console.log('条码类型：' + res.scanType);
                    console.log('条码内容：' + res.result);
                    this.code = res.result;
                }
            });
        },
        changeTab(e) {
            this.tabIndex = e.index;
            this.getData()
        },
        getData() {
            this.rightsList = [];
            switch (this.tabIndex) {
                case 0:
                    this.getMyList(1);
                    this.curType = 'canUse';
                    break;
                case 1:
                    this.getPayList();
                    this.curType = 'canPay';
                    break;
                case 2:
                    this.getMyList(2);
                    this.curType = 'unUse';
                    break;
                default:
                    break;
            }
        },
        getPayList() {
            this.request("annual.card").then((res) => {
                this.rightsList = res.cards;
            })
        },
        getMyList(status) {
            this.request("annual.card.data", { status, openid: this.userInfo.openid })
                .then((res) => {
                    const arr = res.list;
                    arr.sort((a, b) => b.get_time - a.get_time)
                    this.rightsList = arr;
                })
        },
        // 确认兑换
        handleCode() {
            if (!this.code) {
                uni.showToast({
                    title: "请输入激活码",
                    icon: "none",
                })
                return;
            }
            this.request("annual.buy.key", {
                code: this.code,
                openid: this.userInfo.openid,
            })
                .then((res) => {
                    this.cardData = res.card;
                    this.$refs.isPayPopup.showPayPopup();
                    this.showModal = false;
                    this.code = '';
                });
        },
        // 激活
        handleActivate() {
            this.request(
                "annual.buy.activate",
                {
                    code: this.code,
                    openid: this.userInfo.openid,
                },
                "POST"
            )
                .then((res) => {
                    if (res.errno == 1) {
                        this.$refs.isPayPopup.hidePayPopup();
                        uni.showToast({
                            title: "激活成功",
                            icon: "success",
                        })
                        this.getData();
                    }
                })
                .catch(() => {
                    this.$refs.isPayPopup.hidePayPopup();
                })
                .finally(() => {
                    this.$refs.isPayPopup.hidePayPopup();
                })
        }
    },
};
</script>
