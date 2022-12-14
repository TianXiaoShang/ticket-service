<template>
    <div class="page-box bg-gray-bg box-border">
        <loading />
        <!-- title -->
        <div v-if="pageLoad" class="p-20px bg-red flex justify-between items-center text-white">
            <div class="text-16 font-semibold">
                <div>{{ (info.hall_title + " - " + info.film_title) }}</div>
                <div class="text-14px mt-10px font-normal">
                    {{ moment(info.entrance_time * 1000).format('YYYY-MM-DD HH:mm') }}
                </div>
            </div>
            <div class="w-86px h-30px flex text-white justify-center items-center rounded-15px"
                :style="{ background: 'rgba(255,255,255,0.3)' }">
                {{ statusText[Number(info.state)] }}</div>
        </div>
        <div v-else>
            <u-skeleton rows="0" titleWidth="100%" titleHeight="99" title :title="true" loading></u-skeleton>
        </div>
        <!-- 票务总览 -->
        <div v-if="pageLoad" class="p-20px bg-white items-center text-gray-333">
            <div class="text-16 font-semibold items-center flex justify-between">
                <div>票务总览（{{ total }}张）</div>
                <div class="text-14px text-blue font-normal" @click="toPath('/staff/data/index?id=' + id)">查看详情
                </div>
            </div>
            <div class="flex justify-between items-center mt-15px">
                <div class="flex-1">
                    <u-line-progress :percentage="buyTotal" activeColor="#FF545C"></u-line-progress>
                </div>
                <div class="ml-10px">
                    已售{{ isBuy }}
                </div>
            </div>
        </div>
        <div v-else class="mt-5px">
            <u-skeleton rows="0" titleWidth="100%" titleHeight="86" title :title="true" loading></u-skeleton>
        </div>

        <div v-if="pageLoad">
            <!-- tabs -->
            <div class="px-10px">
                <u-tabs :current="tabIndex" :list="tabList" @click="changeTab" lineColor="#FF545C"
                    :itemStyle="{ height: '42px' }"
                    :activeStyle="{ color: '#333', fontWeight: 'bold', transform: 'scale(1.05)' }"
                    :inactiveStyle="{ color: '#999999', transform: 'scale(1)' }"></u-tabs>
            </div>
            <!-- tab内容 -->
            <div class="w-full px-20px box-border">
                <div v-if="seatList && !seatList.length" class="mt-10px">
                    <u-empty mode="data" text="空空如也" icon="http://cdn.uviewui.com/uview/empty/data.png">
                    </u-empty>
                </div>
                <!-- 座位列表 -->
                <template v-if="(seatList && seatList.length)">
                    <scroll-view scroll-y="true" class="pt-10px pb-5px box-border"
                        style="height: calc(100vh - 42px - 99px - 86px - 70px);">
                        <div class="bg-white rounded box-border flex justify-between items-center px-20px py-10px"
                            :class="{ 'mb-10px': index !== seatList.lenght - 1 }" v-for="(item, index) in seatList"
                            :key="index">
                            <div class="text-14px font-semibold flex justify-between items-center text-gray-333">
                                <div class="w-24px h-24px mr-10px flex justify-center items-center"
                                    :style="{ background: tabIndex == 0 ? '#2BC881' : '#bbb' }">
                                    <image class="w-18px h-18px min-w-18px min-h-18px" src="../static/seat-sel@10.png"
                                        mode="aspectFit">
                                    </image>
                                </div>
                                <span>
                                    {{ item.name }}
                                </span>
                            </div>
                            <div class="text-red text-12px" v-if="(tabIndex !== 2)">
                                {{ item.take_ticket == 1 ?
                                        moment(Number(item.scan_time * 1000)).format('YYYY-MM-DD HH:mm') :
                                        '未入场'
                                }}
                            </div>
                            <!-- 未售 并且 只能是未开始或者检票中， 才会展示 锁座/解锁 按钮 -->
                            <div v-if="(tabIndex == 2 && (info.state == 1 || info.state == 2))"
                                @click="changeLock(item)"
                                class="w-52px text-white text-14px h-24px flex justify-center items-center rounded-15px"
                                :style="{ background: item.lock == 0 ? '#FF545C' : '#2ACB95' }">
                                {{ item.lock == 0 ? '锁座' : '解锁' }}
                            </div>
                        </div>
                    </scroll-view>
                </template>
            </div>
        </div>

        <!-- 骨架屏 -->
        <div class="mt-20px" v-else>
            <u-skeleton rows="15" titleWidth="100%" titleHeight="50" title :title="true" loading></u-skeleton>
        </div>

        <!-- 底部按钮 -->
        <div
            class="fixed z-998 pb-20px bottom-0 h-70px flex items-center justify-between px-20px left-0 w-full box-border">
            <u-button shape="circle" size="normal" @click="onScan"
                :customStyle="{ height: '44px', width: 'calc((100vw - 40px) / 2 - 8px)', margin: 0 }" color="#FF5991"
                text="扫码检票">
            </u-button>
            <u-button shape="circle" size="normal" @click="onShowCheckModal"
                :customStyle="{ height: '44px', width: 'calc((100vw - 40px) / 2 - 8px)', margin: 0 }" color="#FF545C"
                text="手动检票">
            </u-button>
        </div>


        <!-- 核销弹窗 -->
        <u-modal :show="showModal" width="580rpx" :title="'手动检票'" showCancelButton :confirmColor="'#FF545C'">
            <view class="py-10px w-full flex items-center justify-between" style="border-bottom: 1px solid #eee">
                <input class="flex-1" placeholder-style="color: #999; font-size: 14px;" placeholder="请输入票码"
                    type="number" v-model="code" @input="inputCode" />
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
    </div>
</template>

<script>
export default {
    data() {
        return {
            id: '',
            info: {},
            buyTotal: 0,
            isBuy: 0,
            noBuy: 0,
            isEntry: 0,
            noEntry: 0,
            total: 0,
            tabIndex: 0,
            statusText: ['', '未开始', '检票中', '已结束'],
            tabList: [],
            statsNumbers: ['2', '1', '3'],
            seatList: [],
            showModal: false,
            code: '',
        }
    },
    onLoad(options) {
        this.id = options.id;
        // 确保已经登录完成
        this.waitLogin().then(() => {
            this.getData();
        });
    },
    methods: {
        changeTab(e) {
            this.tabIndex = e.index;
            this.getList()
        },
        // 获取场次基本信息
        getData() {
            this.request("staff.checkTicket", { row_id: this.id }).then(res => {
                this.info = res.row;
            })
            // 获取未售长度
            this.request("staff.seat", { row_id: this.id }).then(res => {
                this.unsold = res.seat ? res.seat.length : 0
                this.getStatistics()
            })
            this.getList()
        },
        // 点击锁定/解锁按钮
        changeLock(item) {
            if (item.lock == 0) {
                this.lock(item)
            } else {
                this.unLock(item)
            }
        },
        // 锁定
        lock(e) {
            this.request("staff.lock", { row_id: this.id, mark: e.mark }, 'POST').then(() => {
                this.getList();
            })
        },
        // 解锁
        unLock(e) {
            this.request("staff.unLock", { row_id: this.id, mark: e.mark }, 'POST').then(res => {
                this.getList();
            })
        },
        // 获取统计数据
        getStatistics() {
            this.request("staff.statistics", { row_id: this.id }).then(res => {
                this.total = res.sale_count.total.data;  // 总票数
                this.buyTotal = res.sale_count.is_buy.data / res.sale_count.total.data * 100;   // 售出百分比
                this.isBuy = res.sale_count.is_buy.data;  // 已售出
                this.noBuy = res.sale_count.no_buy.data;  // 未售出
                this.isEntry = res.entrance_count.is_view.data;   // 已入场
                this.noEntry = res.entrance_count.no_view.data;   // 未入场
                this.tabList = [
                    { name: `已入场(${this.isEntry})` },
                    { name: `未入场(${this.noEntry})` },
                    { name: `未售(${this.unsold})` },
                ];
                this.pageLoad = true;
            })
        },
        // 获取对应tab的座位列表
        getList() {
            const status = this.statsNumbers[this.tabIndex];
            if (status == 3) {
                this.request("staff.seat", { row_id: this.id }).then(res => {
                    this.seatList = res.seat || [];
                })
            } else {
                this.request("staff.seatList", { row_id: this.id, status: status }).then(res => {
                    this.seatList = res.seat || [];
                })
            }
        },
        // 扫码核销
        onScan() {
            uni.scanCode({
                onlyFromCamera: false,
                scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
                success: async (result) => {
                    this.code = result.result;
                    const res = await this.affirm()
                    const _nameArr = res.seat.map(item => item.name).join('|');
                    await this.scan()
                    this.succenss(_nameArr)
                }
            });
        },
        // 手动检票
        async handleCode() {
            const res = await this.affirm(this.code);
            const _nameArr = res.seat.map((item) => item.name).join("|");
            uni.showModal({
                title: "确认核销",
                content: _nameArr,
                success: async (res) => {
                    if (res.confirm) {
                        this.showModal = false;
                        await this.scan(this.code)
                        this.succenss(_nameArr);
                    }
                },
            });
        },
        // 核销完成提示弹窗
        succenss(_nameArr) {
            uni.showModal({
                title: "核销成功",
                content: _nameArr,
                showCancel: false,
                success: async () => {
                    this.showModal = false;
                    this.getData();
                },
            });
        },
        onShowCheckModal() {
            this.code = '';
            this.showModal = true;
        },
        inputCode(event) {
            this.code = event.detail.value;
            setTimeout(() => {
                this.code = this.code.trim();
            });
        },
        affirm() {
            return this.request("staff.affirm", { row_id: this.id, dynamic: this.code })
        },
        scan() {
            return this.request("staff.scan", { row_id: this.id, dynamic: this.code, _showToast: true })
        }

    },

};
</script>


<style lang="scss" scoped>

</style>