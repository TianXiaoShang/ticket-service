<template>
    <div class="page-box bg-gray-bg box-border">
        <loading />
        <!-- 倒计时区域 -->
        <div style="background: linear-gradient(180deg, #FF545C 0%, #FF545C 100%);"
            class="p-30px flex flex-col justify-center items-center text-white">
            <div class="text-16 font-semibold">剩余支付时间 {{ payTime }}</div>
        </div>
        <div class="p-20px pb-122px box-border" v-if="order.id">
            <!-- 订单信息 -->
            <div class="bg-white p-20px rounded-10px">
                <div class="font-semibold text-gray-333 text-16">{{ order.order_no }}</div>
                <div class="mt-10px font-normal text-gray-999 text-14">
                    {{ moment(order.entrance_time * 1000).format('YYYY-MM-DD HH:mm') }}
                </div>
                <!-- TAG-独立 -->
                <div class="mt-10px font-normal text-gray-999 text-14">{{ myCinema.address }}</div>
                <u-divider></u-divider>
                <!-- TAG-独立 -->
                <div class="text-gray-333 text-14 font-semibold">{{ myCinema.title }}</div>
                <div class="mt-10px font-normal text-gray-999 text-14">{{ order.film_title }} | {{ order.hall_title }} |
                    {{ order.seats.map(el => el.row + '排' + el.col + '座').join('、') }}
                </div>
            </div>

            <!-- 进场方式 -->
            <div class="bg-white mt-10px p-20px rounded-10px">
                <div class="font-semibold text-gray-333 flex justify-between items-center text-14">
                    <span>{{ set.detail_enter }}</span>
                    <span class="text-blue font-normal">{{ set.detail_enter_desc }}</span>
                </div>
                <div class="mt-10px font-normal text-gray-999 text-14">{{ set.detail_replace }}</div>
            </div>

            <!-- 联系人 -->
            <div class="bg-white mt-10px p-20px rounded-10px is-input">
                <div class="text-gray-999 flex justify-between items-center text-14">联系人</div>
                <div class="mt-10px flex items-center">
                    <div class="text-14px font-semibold text-gray-333 w-5em">姓名<span class="text-red">*</span></div>
                    <u--input :customStyle="inputCustomStyle" placeholder="请输入姓名" border="surround"
                        v-model="user.name"></u--input>
                </div>
                <div class="mt-10px flex items-center">
                    <div class="text-14px font-semibold text-gray-333 w-5em">手机号<span class="text-red">*</span></div>
                    <div class="relative h-40px flex-1">
                        <u--input :customStyle="inputCustomStyle" placeholder="点击获取手机号" border="surround"
                            v-model="user.phone"></u--input>
                        <button slot="button" @getphonenumber="getMobile"
                            class="absolute left-0 top-0 right-0 bottom-0 opacity-0 z-999" openType="getPhoneNumber">
                        </button>
                    </div>
                </div>
                <!-- 自定义表单 -->
                <template v-if="diyform.diyform_set && diyform.fields && diyform.fields.length">
                    <div class="mt-10px flex items-center" v-for="(item, index) in diyform.fields" :key="index">
                        <div class="text-14px font-semibold text-gray-333 w-5em">{{ item.tp_name }}<span
                                v-if="item.tp_must == 1" class="text-red">*</span></div>

                        <u--input v-if="item.data_type == 1" :customStyle="inputCustomStyle"
                            :placeholder="item.placeholder || ''" border="surround"
                            v-model="diyformData[item.diy_type]">
                        </u--input>

                        <picker v-if="item.data_type == 2" @change="bindPickerChange($event, item)" class="flex-1"
                            :value="diyformData[item.diy_type]" :range="item.tp_text">
                            <view
                                class="rounded-10px text-14px text-gray-333 px-9px box-border h-40px w-full flex items-center"
                                style="background:#F2F3F5">
                                {{ item.tp_text[diyformData[item.diy_type]] || item.placeholder }}
                            </view>
                        </picker>
                    </div>
                </template>
            </div>

            <!-- 优惠券 -->
            <div class="bg-white mt-10px p-20px rounded-10px" v-if="!pay.offline && payType !== 'annual'"
                @click="onShowCoupon">
                <div class="font-semibold text-gray-333 flex justify-between items-center text-14">
                    <span>优惠券</span>
                    <span class="text-gray-999 font-normal flex items-center">
                        <span class="mr-4px">{{ hasEnbalCoupon? showCouponName: '暂无可用优惠券' }}</span>
                        <u-icon color="#999" name="arrow-right"></u-icon>
                    </span>
                </div>
            </div>

            <!-- 增值服务 -->
            <div class="bg-white mt-10px p-20px rounded-10px is-input"
                v-if="order.charge.charge_price > 0 && order.charge.charge_open == 1">
                <div class="">
                    <u-checkbox-group v-model="charge_radio" shape="circle">
                        <div class="w-full">
                            <div class="flex justify-between items-center">
                                <div class="flex">
                                    <div class="flex flex-col">
                                        <span class="text-14 text-gray-333 font-semibold">
                                            {{ order.charge.charge_name }}
                                        </span>
                                        <span class="font-normal text-12px mt-4px text-blue"
                                            @click="showChargePopup = true">查看详情</span>
                                    </div>
                                </div>
                                <div class="flex">
                                    <div class="text-gray-999 text-14 mr-8px"> ￥{{ order.charge.charge_price }} </div>
                                    <div class="w-22px h-22px">
                                        <u-checkbox size="22px" activeColor="#FF545C" :label="' '" name="true">
                                        </u-checkbox>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </u-checkbox-group>
                </div>
            </div>

            <!-- 支付方式 -->
            <div class="bg-white mt-10px p-20px rounded-10px is-input">
                <div class="text-gray-999 flex justify-between items-center text-14">支付方式</div>
                <div class="mt-10px">
                    <u-radio-group v-model="payType">
                        <div class="w-full">
                            <div class="flex justify-between" v-if="pay.wechat && money !== 0">
                                <div class="flex">
                                    <image src="../static/wechat@2x.png" class="w-22px h-22px" alt="" />
                                    <div class="ml-10px flex flex-col">
                                        <span class="text-gray-333 font-semibold">微信支付</span>
                                        <span class="font-normal text-10px mt-4px text-yellow">
                                            {{ pay.wechat.desc || '' }}</span>
                                    </div>
                                </div>
                                <div class="w-22px h-22px">
                                    <u-radio size="22px" activeColor="#FF545C" :label="' '"
                                        :disabled="!pay.wechat.enable" name="wechat"></u-radio>
                                </div>
                            </div>
                            <div class="flex justify-between mt-20px" v-if="pay.card && money !== 0">
                                <div class="flex">
                                    <image src="../static/balance@2x.png" class="w-22px h-22px" alt="" />
                                    <div class="ml-10px flex flex-col">
                                        <span class="text-gray-333 font-semibold">
                                            余额支付
                                            <span class="text-12px ml-8px">¥{{ userInfo.credit2 }}</span>
                                        </span>
                                        <span class="font-normal text-10px mt-4px text-yellow">
                                            {{ pay.card.desc || '' }}</span>
                                    </div>
                                </div>
                                <div class="w-22px h-22px">
                                    <u-radio size="22px" activeColor="#FF545C" :label="' '" :disabled="!pay.card.enable"
                                        name="card"></u-radio>
                                </div>
                            </div>
                            <div class="flex justify-between mt-20px" v-if="pay.annual && money !== 0">
                                <div class="flex">
                                    <image src="../static/vip@2x.png" class="w-22px h-22px" alt="" />
                                    <div class="ml-10px flex flex-col">
                                        <span class="text-gray-333 font-semibold">
                                            权益卡兑换 (使用情况：{{ canAnnualTotal || '-' }}/{{ annualTotal || '-' }})
                                        </span>
                                        <span class="font-normal text-10px mt-4px text-yellow">
                                            {{ pay.annual.desc || '' }}</span>
                                    </div>
                                </div>
                                <div class="w-22px h-22px">
                                    <u-radio size="22px" activeColor="#FF545C" :label="' '"
                                        :disabled="!pay.annual.enable" name="annual"></u-radio>
                                </div>
                            </div>
                            <div class="flex justify-between mt-20px" v-if="money === 0">
                                <div class="flex">
                                    <image src="../static/free@2x.png" class="w-22px h-22px" alt="" />
                                    <div class="ml-10px flex flex-col">
                                        <span class="text-gray-333 font-semibold">免费购票 (￥0)</span>
                                    </div>
                                </div>
                                <div class="w-22px h-22px">
                                    <u-radio size="22px" activeColor="#FF545C" :label="' '" name="offline"></u-radio>
                                </div>
                            </div>
                        </div>
                    </u-radio-group>
                </div>
            </div>
        </div>
        <!-- 骨架屏 -->
        <div v-else class="p-20px pb-122px box-border">
            <div class="mt-10px">
                <u-skeleton rows="3" titleWidth="100%" titleHeight="100" title :title="true" loading></u-skeleton>
            </div>
            <div class="mt-10px">
                <u-skeleton rows="0" titleWidth="100%" titleHeight="100" title :title="true" loading></u-skeleton>
            </div>
            <div class="mt-10px">
                <u-skeleton rows="0" titleWidth="100%" titleHeight="100" title :title="true" loading></u-skeleton>
            </div>
            <div class="mt-10px">
                <u-skeleton rows="0" titleWidth="100%" titleHeight="100" title :title="true" loading></u-skeleton>
            </div>
            <div class="mt-10px">
                <u-skeleton rows="2" titleWidth="100%" titleHeight="100" title :title="false" loading></u-skeleton>
            </div>
        </div>


        <!-- 底部已选展示，购买 -->
        <div class="fixed z-998 bottom-0 h-100px left-0 w-full box-border bg-white">
            <!-- 《服务条款》 -->
            <div class="h-40px pt-15px text-14px box-border px-20px flex items-center">
                <image v-if="read" @click="onRead(false)" src="@/static/common/agree-sel@2x.png" class="w-15px h-15px">
                </image>
                <div v-if="!read" @click="showReadPopup = true"
                    class="box-border rounded-full w-15px h-15px border border-solid border-red">
                </div>
                <span class="ml-4px text-gray-333">同意<span class="text-blue"
                        @click="showReadPopup = true">《服务条款》</span></span>
            </div>
            <!-- 购买 -->
            <div class="h-60px px-20px justify-between flex items-center">
                <div class="flex">
                    <div class="text-red flex items-center">
                        <span class="text-12 ml-3px relative top-2px">¥</span>
                        <span class="text-18px font-semibold">{{ money }}</span>
                    </div>
                    <div class="text-333 text-12 flex items-center ml-5px" @click="showPopup = true">
                        <span>价格明细</span>
                        <div class="ml-3px">
                            <u-icon name="arrow-up-fill" size="10px" color="#333"></u-icon>
                        </div>
                    </div>
                </div>
                <u-button shape="circle" size="normal" :customStyle="{ height: '44px', width: '160px', margin: 0 }"
                    color="linear-gradient(180deg, #FF545C 0%, #FF545C 100%);" text="提交订单" @click="toPay">
                </u-button>
            </div>
        </div>

        <!-- 优惠券 -->
        <u-popup :show="showCouponPopup" :round="20" @close="showCouponPopup = false">
            <div class="w-full">
                <div class="text-gray-333 px-20px pt-20px pb-10px flex justify-between items-center border-l-0 border-t-0 border-r-0 
                    border-b-1px border-gray-100 border-solid text-16 font-semibold ">
                    <span> 优惠券 </span>
                    <span>
                        <u-icon name="close" size="18px" @click="showCouponPopup = false"></u-icon>
                    </span>
                </div>
                <div class="text-gray-666 px-15px box-border mt-15px">
                    <u-radio-group v-model="curCoupon">
                        <div class="w-full">
                            <div class="flex justify-between items-center w-full">
                                <span class="text-14 font-semibold text-gray-333">
                                    不使用优惠券
                                </span>
                                <div class="w-22px h-22px">
                                    <u-radio size="22px" activeColor="#FF545C" :label="' '" :name="'none'">
                                    </u-radio>
                                </div>
                            </div>
                            <scroll-view scroll-y="true" class="max-h-50vh box-border mt-15px">
                                <div class="flex mb-10px justify-between bg-red p-2px rounded border border-red border-solid  overflow-hidden"
                                    v-for="(item, index) in couponList" :key="index">
                                    <div class="flex flex-col text-white justify-center items-center bg-red p-15px">
                                        <div class="font-semibold special-text">
                                            <span class="text-14px">¥</span>
                                            <span class="text-28px">
                                                {{ item.is_viewing == 1 ? '观影券' : item.deduct }}
                                            </span>
                                        </div>
                                        <div class="text-10px font-normal mt-5px -mb-5px">
                                            {{ item.condition }}
                                        </div>
                                    </div>
                                    <div class="flex items-center relative justify-between px-20px py-15px flex-1"
                                        :class="{ 'bg-white': curCoupon !== item.id, 'bg-red-100': curCoupon === item.id }"
                                        style="border-radius: 0 10px 10px 0;">
                                        <div>
                                            <div class="text-gray-333 text-16px font-semibold">{{ item.name }}</div>
                                            <div class="text-gray-999 text-12px mt-8px">{{ item.subtract }}</div>
                                            <div class="text-gray-999 text-10px mt-15px">{{ item.strtime }}</div>
                                        </div>
                                        <div class="w-22px h-22px min-w-22px">
                                            <u-radio :disabled="item.disabled" size="22px" activeColor="#FF545C"
                                                :label="' '" :name="item.id">
                                            </u-radio>
                                        </div>
                                        <div class="absolute top-0 bottom-0 -left-4px flex flex-col justify-between">
                                            <div :class="{ 'bg-white': curCoupon !== item.id, 'bg-red-100': curCoupon === item.id }"
                                                class="rounded-full w-8px h-8px" v-for="el in 7" :key="el">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </scroll-view>
                        </div>
                    </u-radio-group>
                </div>
                <div class="pt-10px">
                    <u-button shape="circle" size="normal" :customStyle="{ height: '44px', width: '200px' }"
                        color="linear-gradient(180deg, #FF545C 0%, #FF545C 100%);" text="确定" @click="onSelectCoupon()">
                    </u-button>
                </div>
            </div>
        </u-popup>

        <u-popup :show="showPopup" :closeOnClickOverlay="true" :round="20" @close="showPopup = false">
            <div class="w-full">
                <div class="text-gray-333 px-20px pt-20px pb-10px flex justify-between items-center border-l-0 border-t-0 border-r-0 
                    border-b-1px border-gray-100 border-solid text-16 font-semibold ">
                    <span> 费用明细 </span>
                    <u-icon name="close" size="18px" @click="showPopup = false"></u-icon>
                </div>
                <scroll-view scroll-y="true" class="text-gray-666 max-h-50vh px-15px box-border mt-15px">
                    <div class="mb-25px">
                        <div class="text-gray-333 text-14px font-semibold flex justify-between items-center">
                            <span>票品信息</span>
                            <span>¥{{ money }}</span>
                        </div>
                        <div class="mt-15px text-12px text-gray-999" v-if="order.seats && order.seats.length">
                            {{ order.seats.map(el => el.row + '排' + el.col + '座').join('、') }}
                        </div>
                    </div>
                    <!-- 有增值费，且打开了增值收费，且勾选了增值收费 -->
                    <template
                        v-if="order.charge.charge_price > 0 && order.charge.charge_open == 1 && charge_radio && charge_radio.length">
                        <div class="text-gray-999 pb-10px text-12px flex justify-center items-center">
                            <div class="h-0 w-1/3" style="border-top: 1px solid #eee"></div>
                            <span class='mx-10px'> 增值项 </span>
                            <div class="h-0 w-1/3" style="border-top: 1px solid #eee"></div>
                        </div>
                        <!-- 增值收费 -->
                        <div class="mb-25px">
                            <div class="text-gray-333 text-14px font-semibold flex justify-between items-center">
                                <span>{{ order.charge.charge_name }}</span>
                                <span class="text-blue">+¥{{ order.charge.charge_price }}</span>
                            </div>
                            <div class="mt-15px text-12px text-blue" @click="showPopup = false; showChargePopup = true">
                                增值收费说明</div>
                        </div>
                    </template>

                    <!-- 有任意优惠项目 -->
                    <template v-if="disInfo.is_level || disInfo.is_coupon == 1 || pay.part_discount">
                        <div class="text-gray-999 pb-10px text-12px flex justify-center items-center">
                            <div class="h-0 w-1/3" style="border-top: 1px solid #eee"></div>
                            <span class='mx-10px'> 优惠项 </span>
                            <div class="h-0 w-1/3" style="border-top: 1px solid #eee"></div>
                        </div>
                        <!-- 折扣信息 -->
                        <div class="mb-25px" v-if="disInfo.is_level">
                            <div class="text-gray-333 text-14px font-semibold flex justify-between items-center">
                                <span>{{ disEnum[disInfo.is_level] }}</span>
                                <span class="text-red" v-if="disInfo.is_level !== 6">-¥{{ disInfo.discount }}</span>
                            </div>
                            <div class="mt-15px text-12px text-gray-999">{{ Number(disInfo.level_discounts) }}折</div>
                        </div>
                        <!-- 优惠券信息 -->
                        <div class="mb-25px" v-if="disInfo.is_coupon == 1">
                            <div class="text-gray-333 text-14px font-semibold flex justify-between items-center">
                                <span>优惠券</span>
                                <span class="text-red">-¥{{ disInfo.coupon_price }}</span>
                            </div>
                            <div class="mt-15px text-12px text-gray-999">{{ disInfo.coupon_name }}</div>
                        </div>
                        <!-- 套票折扣 -->
                        <div class="mb-25px" v-if="pay.part_discount">
                            <div class="text-gray-333 text-14px font-semibold flex justify-between items-center">
                                <span>套票折扣</span>
                                <span class="text-red">-¥{{ pay.part_discount }}</span>
                            </div>
                            <div class="mt-15px text-12px text-gray-999">套票满减</div>
                        </div>
                    </template>
                </scroll-view>
                <div class="pt-10px">
                    <u-button shape="circle" size="normal" :customStyle="{ height: '44px', width: '200px' }"
                        color="linear-gradient(180deg, #FF545C 0%, #FF545C 100%);" text="确定" @click="showPopup = false">
                    </u-button>
                </div>
            </div>
        </u-popup>

        <!-- 增值费用 -->
        <u-popup :show="showChargePopup" :round="20" @close="showChargePopup = false">
            <div class="w-full">
                <div class="text-gray-333 px-20px pt-20px pb-10px flex justify-between items-center border-l-0 border-t-0 border-r-0 
                    border-b-1px border-gray-100 border-solid text-16 font-semibold ">
                    <span> 增值收费说明 </span>
                    <span>
                        <u-icon name="close" size="18px" @click="showChargePopup = false"></u-icon>
                    </span>
                </div>
                <scroll-view scroll-y="true"
                    class="text-gray-666 text-14px max-h-50vh px-15px box-border mt-15px min-h-10vh">
                    {{ order.charge.charge_desc }}
                </scroll-view>
                <div class="pt-10px">
                    <u-button shape="circle" size="normal" :customStyle="{ height: '44px', width: '200px' }"
                        color="linear-gradient(180deg, #FF545C 0%, #FF545C 100%);" text="确定"
                        @click="showChargePopup = false">
                    </u-button>
                </div>
            </div>
        </u-popup>

        <!-- 服务条款 -->
        <u-popup :show="showReadPopup" :round="20" @close="showReadPopup = false">
            <div class="w-full">
                <div class="text-gray-333 px-20px pt-20px pb-10px flex justify-between items-center border-l-0 border-t-0 border-r-0 
                    border-b-1px border-gray-100 border-solid text-16 font-semibold ">
                    <span> 服务条款 </span>
                    <span>
                        <u-icon name="close" size="18px" @click="showReadPopup = false"></u-icon>
                    </span>
                </div>
                <scroll-view scroll-y="true" class="text-gray-666 max-h-50vh px-15px box-border mt-15px">
                    <rich-text :nodes="global.buy_text"></rich-text>
                </scroll-view>
                <div class="pt-10px">
                    <u-button shape="circle" size="normal" :customStyle="{ height: '44px', width: '200px' }"
                        color="linear-gradient(180deg, #FF545C 0%, #FF545C 100%);" text="确定" @click="onRead(true)">
                    </u-button>
                </div>
            </div>
        </u-popup>
    </div>
</template>

<script>
import { getPhoneNumber } from '@/util/base';
import { parseRichText } from '@/util';
import moment from 'moment';
export default {
    data() {
        return {
            id: '',
            order: {},
            user: {
                name: '',
                phone: ''
            },
            payType: 'wechat',
            showPopup: false,
            showReadPopup: false,
            showCouponPopup: false,
            showChargePopup: false,
            read: false,

            money: 0,
            myCinema: {},
            order: {},
            global: {},
            set: {},
            member: {},
            pay: {},
            payTime: '',   // 支付剩余时间
            total: 0,  // 订单金额
            canAnnualTotal: 0,
            annualTotal: 0,
            timer: null,  // 计时器
            couponList: [], // 优惠券列表
            hasEnbalCoupon: false, // 是否有可用优惠券
            curCoupon: 'none',
            showCouponName: '',
            diyform: {},
            diyformData: {},
            charge_radio: '', // 增值服务
            disInfo: {},
            disEnum: ['', '会员价', '半价日', '特殊人群', '兑换观影优惠券', '自定义优惠', '0元购票', '影片会员折扣', '权益卡消费'],
        }
    },
    watch: {
        curCoupon() {
            if (this.curCoupon && this.curCoupon !== 'none') {
                this.showCouponName = this.couponList.find(el => el.id === this.curCoupon).name;
            } else {
                this.showCouponName = '';
            }
            this.getCalculate();
        },
        payType() {
            this.getCalculate();
        },
        charge_radio: {
            handler() {
                this.getCalculate();
            },
            deep: true
        }
    },
    onUnload() {
        this.timer && clearInterval(this.timer)
    },
    onLoad(options) {
        this.id = options.id;
        // 确保已经登录完成
        this.waitLogin().then(() => {
            this.getData();
            if (this.userInfo.mobile) {
                this.user.phone = this.userInfo.mobile;
                const name = uni.getStorageSync('payName')
                this.user.name = name || '';
            }
        });
    },
    methods: {
        bindPickerChange(e, item) {
            this.diyformData[item.diy_type] = Number(e.detail.value);
        },
        onShowCoupon() {
            if (this.couponList.length) {
                this.showCouponPopup = true;
            }
        },
        // 选择优惠券
        onSelectCoupon() {
            this.showCouponPopup = false;
        },
        async getData() {
            await this.getOrderPayment();
            await this.getCouponList();
            await this.getDiyForm();
            this.getCalculate();
        },
        getOrderPayment() {
            return this.request("order.new_payment", {
                order_id: this.id
            }).then(res => {
                // 改成计算接口
                // let money = res.pay.money;
                // // 如果有增值服务
                // if (res.order.charge.charge_open == 1) {
                //     money = parseFloat(money) + parseFloat(res.order.charge.charge_price);
                // }
                // this.money = money;
                this.pay = res.pay;
                this.myCinema = res.cinema;
                this.order = res.order;
                this.global = res.global;
                this.set = res.set;
                this.member = res.member;
                this.total = res.order.total;
                this.charge_radio = res.order.charge.charge_open == 1 ? ['true'] : [];
                this.payType = this.pay.default;

                // 服务条款
                if (this.global.buy_text) {
                    this.global.buy_text = parseRichText(this.global.buy_text)
                }
                // 倒计时
                const time = res.order.expire_time;
                this.getExpireTime(time);
                this.timer = setInterval(() => {
                    this.getExpireTime(time);
                }, 1000);
            })
        },
        getDiyForm() {
            // 自定义表单
            return this.request("order.payDiyForm").then(res => {
                if (res.fields && res.fields.length) {
                    res.fields.forEach(el => {
                        if (el.data_type == 1) {
                            this.diyformData[el.diy_type] = '';
                        } else if (el.data_type == 2) {
                            this.diyformData[el.diy_type] = res.f_data[el.diy_type][0] || 0;
                        }
                    })
                }
                this.diyform = res;
            })
        },
        getCouponList() {
            // 获取优惠券
            return this.request("coupon.used", {
                order_id: this.id
            }).then(res => {
                // let flag = false;
                this.couponList = res.list;
                res.list.forEach((ele, i) => {
                    // 是否有可用优惠券
                    if (ele.status == 1) {
                        this.hasEnbalCoupon = true;
                    }
                    // // 默认选中一个可用优惠券
                    // if (!flag && parseFloat(this.total) >= parseFloat(ele.enough) && ele.status == 1) {
                    //     this.curCoupon = ele.id;
                    //     this.showCouponName = ele.name;
                    //     flag = true;
                    // }
                    if (parseFloat(this.total) < parseFloat(ele.enough) || ele.status != 1) {
                        // 没到满减条件或状态为非可用状态1
                        ele.disabled = true;
                    }
                })
            })
        },
        getExpireTime(time) {
            // 等待支付时间结束，清除定时器，重新获取数据,发现超时会重定向到订单状态页order/detail/index去
            if (moment(time * 1000).isBefore(moment())) {
                this.timer && clearInterval(this.timer);
                this.getData();
                return;
            }
            const t = (moment(time * 1000).diff(moment())) / 1000;
            let m = Math.floor(t / 60);
            let s = Math.floor(t % 60);
            if (m < 10) {
                m = '0' + m;
            }
            if (s < 10) {
                s = '0' + s;
            }
            this.payTime = m + ':' + s;
        },
        getCalculate() {
            const params = {
                order_id: this.id,
                type: this.payType,
                realname: this.user.name,
                mobile: this.user.phone,
                form_id: this.diyform.form_id,
                coupon_id: this.curCoupon === 'none' ? '' : this.curCoupon,
                charge_radio: this.charge_radio && this.charge_radio.length ? 1 : '',   // 多选框有值则1，否则空
                _showLoading: false,
            }
            this.request('order.calculate', params).then(res => {
                this.money = res ? res.total || res.price : 0;
                this.disInfo = res;
                if (this.money === 0) {
                    this.payType = 'offline';
                } else {
                    this.payType = this.payType === 'offline' ? this.pay.default : this.payType;
                }
            })
        },
        toPay() {
            if (!this.read) {
                uni.showToast({ title: "请勾选同意服务条款", icon: 'none' })
                return;
            }
            if (!this.user.name) {
                uni.showToast({ title: "请填写姓名", icon: 'none' })
                return;
            }
            if (!this.user.phone) {
                uni.showToast({ title: '请授权手机号', icon: 'none' })
                return;
            }
            // 微信的话要做订阅消息
            if (this.isWx && this.global.is_user_inform == 1) {
                wx.requestSubscribeMessage({
                    tmplIds: [this.global.user_buy_id],
                    success: () => {
                        this.startPay();
                    },
                    fail: () => {
                        this.startPay();
                    }
                })
            } else {
                this.startPay();
            }
        },
        startPay() {
            // 整理自定义表单数据
            const _diyFormData = { ...this.diyformData };
            for (const key in _diyFormData) {
                if (Object.hasOwnProperty.call(_diyFormData, key)) {
                    let ele = _diyFormData[key];
                    const curDiy = this.diyform.fields.find(el => el.diy_type === key);
                    if (curDiy.data_type == 2) {
                        _diyFormData[key] = [ele + '', curDiy.tp_text[ele]];
                    }

                    if (curDiy.tp_must == 1 && !_diyFormData[key]) {
                        uni.showToast({ title: curDiy.placeholder, icon: 'none' });
                        return;
                    }
                }
            }

            const params = {
                order_id: this.id,
                type: this.payType,
                realname: this.user.name,
                mobile: this.user.phone,
                price: this.money,
                diydata: _diyFormData,
                form_id: this.diyform.form_id,
                coupon_id: this.curCoupon === 'none' ? '' : this.curCoupon,
                charge_radio: this.charge_radio && this.charge_radio.length ? 1 : '',   // 多选框有值则1，否则空
                _showToast: true
            }
            uni.setStorageSync('payName', this.user.name);
            // 免费购买
            if (this.payType === 'offline') {
                this.request("order.pays", params).then(res => {
                    this.toOrderDetail();
                })
            }
            // 余额支付
            if (this.payType === 'card') {
                if (!this.pay.card.enable) {
                    uni.showToast({ title: '不支持余额支付，请选择其他支付方式！', icon: 'none' })
                    return;
                }
                if (Number(this.userInfo.credit2) < this.money) {
                    uni.showToast({ title: '余额不足', icon: 'none' })
                    return;
                }
                uni.showModal({
                    title: '余额支付',
                    content: '确定使用余额支付吗？',
                    success: (res) => {
                        if (res.confirm) {
                            this.request("order.pays", params).then(res => {
                                this.toOrderDetail();
                            })
                        } else if (res.cancel) {
                            uni.showToast({ title: '取消支付', icon: 'none' })
                        }
                    }
                });
                return;
            }

            // 微信支付
            if (this.payType == 'wechat') {
                if (this.isWx) {
                    this.request("order.pays", params).then(res => {
                        wx.requestPayment({
                            timeStamp: res.wechat.timeStamp,
                            nonceStr: res.wechat.nonceStr,
                            package: res.wechat.package,
                            signType: res.wechat.signType,
                            paySign: res.wechat.paySign,
                            success: () => {
                                uni.showToast({
                                    title: '支付成功',
                                    icon: 'none'
                                })
                                this.toOrderDetail();
                            }
                        });
                    })
                } else {
                    // TAG - 抖音端支付未实现
                    uni.showToast({
                        title: '抖音端支付未实现',
                        icon: 'none'
                    })
                }
                return;
            }
            // 权益卡支付
            if (this.payType == 'annual') {
                params.price = 0;
                params.coupon_id = '';
                this.request("order.pays", params).then(res => {
                    this.toOrderDetail();
                })
                return;
            }
        },
        toOrderDetail() {
            setTimeout(() => {
                uni.redirectTo({
                    url: '/order/detail/index?id=' + this.id,
                });
            }, 1000);
        },
        onRead(val) {
            this.read = val;
            this.showReadPopup = false;
        },
        getMobile(e) {
            getPhoneNumber(e, true).then(res => {
                this.user.phone = res;
            }, () => { })
        },
    }
};
</script>