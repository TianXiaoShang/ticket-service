<template>
	<view class="page-box bg-gray-bg py-20px box-border">
		<loading />
		<!-- 自定义导航 -->
		<nav-bar v-if="isWx" :title="'个人中心'" :backgroundColor="'transparent'"></nav-bar>
		<!-- 背景 -->
		<div class="fixed h-100vh overflow-hidden left-0 top-0 w-100vw">
			<image src="@/static/self/colorbg@2x.png" mode="widthFix" class="w-full" />
		</div>

		<!-- 内容区域 -->
		<div class="relative z-99">
			<!-- 基本资料 -->
			<div class="flex justify-between items-center px-20px">
				<div class="flex items-center">
					<!-- 头像 -->
					<div v-if="isWx"
						class="relative rounded-full border-solid shadow-lg border-2 border-white box-border overflow-hidden w-60px h-60px">
						<!-- TAG-需添加默认头像 -->
						<image :src="userInfo.avatar" class="w-full h-full" />
						<button class="absolute left-0 right-0 top-0 bottom-0 opacity-0" open-type="chooseAvatar"
							@chooseavatar="chooseavatar"></button>
					</div>
					<!-- TAG-抖音暂时保留原来的授权方式，微信已经不支持getUserProfile方法 -->
					<div v-else @click="getUserInfo"
						class="rounded-full border-solid shadow-lg border-2 border-white box-border overflow-hidden w-60px h-60px">
						<!-- TAG-需添加默认头像 -->
						<image :src="userInfo.avatar" class="w-full h-full" />
					</div>
					<!-- 昵称 -->
					<div class="ml-10px">
						<div @click="getUserInfo" class="text-333 font-semibold text-20">{{ userInfo.nickname || '未登陆'
						}}</div>
						<!-- 手机号 -->
						<div class="text-666 text-12 mt-5px">
							<span class="relative">
								{{ userInfo.mobile || '点击授权手机号' }}
								<button @getphonenumber="getMobile"
									class="opacity-0 absolute left-0 right-0 top-0 bottom-0" openType="getPhoneNumber">
								</button>
							</span>
						</div>
					</div>
				</div>
				<div class="right">
					<u-button @click="toVip" class="h-26px min-w-58px" shape="circle" size="small" color="#FF545C"
						text="VIP">
					</u-button>
				</div>
			</div>
			<!-- vip卡 start -->
			<div class="mt-20px relative text-0px" @click="toVip">
				<image mode="widthFix" src="@/static/self/card.png" class="w-full" />
				<div
					class="absolute left-20px right-20px top-0 bottom-0 flex items-center justify-between px-20px box-border">
					<div class="flex items-center">
						<image mode="aspectFit" src="@/static/self/vipvip.png" class="w-18px h-18px" />
						<span class="ml-5px text-16 font-semibold" style="color: #673F0F">{{ cinema.title }}</span>
					</div>
					<div class="text-16 special-text" v-if="card.id" style="color: #A04A07">
						<span class="text-14">¥</span>
						<span class="text-22px ml-2px">{{ card.balance }}</span>
					</div>
					<div class="text-16" v-else style="color: #A04A07">
						开通会员
					</div>
				</div>
			</div>
			<!-- vip卡 end -->
			<div class="bg-gray-bg content-box px-20px pt-20px">
				<!-- 宫格 -->
				<div class="mb-20px">
					<u-scroll-list class="scroll-list is-scroll" :indicator="false">
						<div class="scroll-list-item flex flex-col justify-center items-center">
							<image mode="aspectFit" src="@/static/self/mine-tickets.png"
								class="w-12vw h-12vw shadow-md rounded-full" />
							<span class="mt-5px text-12 text-gray-333">我的票夹</span>
						</div>
						<div class="scroll-list-item flex flex-col justify-center items-center">
							<image mode="aspectFit" src="@/static/self/mine-order.png"
								class="w-12vw h-12vw shadow-md rounded-full" />
							<span class="mt-5px text-12 text-gray-333">我的订单</span>
						</div>
						<div class="scroll-list-item flex flex-col justify-center items-center">
							<image mode="aspectFit" src="@/static/self/mine-coupon.png"
								class="w-12vw h-12vw shadow-md rounded-full" />
							<span class="mt-5px text-12 text-gray-333">优惠券</span>
						</div>
						<div class="scroll-list-item flex flex-col justify-center items-center">
							<image mode="aspectFit" src="@/static/self/mine-service.png"
								class="w-12vw h-12vw shadow-md rounded-full" />
							<span class="mt-5px text-12 text-gray-333">在线客服</span>
						</div>
					</u-scroll-list>
				</div>
				<!-- 待观看 -->
				<div v-if="neerTicket.ticket" @click="toNeerTicket"
					class="card mt-20px flex justify-between items-center px-20px py-14px text-white rounded">
					<div>
						<div class="text-14">{{ neerTicket.ticket.film_title || '影片名称' }}</div>
						<div class="mt-5px text-12 opacity-50">{{ neerTicket.ticket.entrance_time }}</div>
					</div>
					<div class="text-14 flex items-center">
						<span>待观看</span>
						<u-icon name="arrow-right" class="ml-4px" size="16px" color="#fff"></u-icon>
					</div>
				</div>
				<!-- 功能卡片 -->
				<div class="bar-wrap">
					<div
						class="h-56px mt-10px px-20px box-border py-18px flex items-center justify-between bg-white rounded">
						<div class="flex items-center">
							<image mode="aspectFit" src="@/static/self/gift-16.png" class="w-16px h-16px" />
							<span class="ml-10px text-gray-333 text-14px">领券中心</span>
						</div>
						<u-icon name="arrow-right" class="ml-4px" size="16px" color="#999"></u-icon>
					</div>
					<div
						class="h-56px mt-10px px-20px box-border py-18px flex items-center justify-between bg-white rounded">
						<div class="flex items-center">
							<image mode="aspectFit" src="@/static/self/staff-16.png" class="w-16px h-16px" />
							<span class="ml-10px text-gray-333 text-14px">员工入口</span>
						</div>
						<u-icon name="arrow-right" class="ml-4px" size="16px" color="#999"></u-icon>
					</div>
					<div
						class="h-56px mt-10px px-20px box-border py-18px flex items-center justify-between bg-white rounded">
						<div class="flex items-center">
							<image mode="aspectFit" src="@/static/self/vip-16.png" class="w-16px h-16px" />
							<span class="ml-10px text-gray-333 text-14px">权益卡</span>
						</div>
						<u-icon name="arrow-right" class="ml-4px" size="16px" color="#999"></u-icon>
					</div>
					<div
						class="h-56px mt-10px px-20px box-border py-18px flex items-center justify-between bg-white rounded">
						<div class="flex items-center">
							<image mode="aspectFit" src="@/static/self/distributor-16.png" class="w-16px h-16px" />
							<span class="ml-10px text-gray-333 text-14px">分销中心</span>
						</div>
						<u-icon name="arrow-right" class="ml-4px" size="16px" color="#999"></u-icon>
					</div>
				</div>
			</div>
		</div>
	</view>
</template>

<script>
import NavBar from '@/components/nav-bar';
import { getUserProfile, getPhoneNumber } from '@/util/base';

export default {
	data() {
		return {
			member: {},
			card: {},
			global: 0,
			neerTicket: {},
			loginFlag: false,
			agentUrl: '', // 分销不同状态跳转不同分销页面
		}
	},
	components: { NavBar },
	onShow() {
		if (this.loginFlag) {
			this.getAllData();
		}
	},
	onLoad() {
		// 确保已经登陆完成，再去检查是否有授权
		this.waitLogin().then(() => {
			// 没有授权用户信息则跳转登录页
			if (!this.checkAuth()) {
				uni.navigateTo({
					url: '/pages/auth/index?noLogin=true'
				})
			} else {
				this.getAllData();
				this.loginFlag = true;
			}
		})
	},
	methods: {
		getAllData() {
			this.getMemberDate();
			this.getNearTick();
		},
		// 获取最近待观看影片
		getNearTick: function () {
			this.request("member.near").then((res) => {
				this.neerTicket = res;
			})
		},
		toVip() {
			console.log('toVip');
		},
		toNeerTicket() {
			const url = `/pages/ticket/detail/detail?id=${this.neerTicket.ticket.order_id}`;
			console.log(url, 'toNeerTicket');
		},
		// 个人详细业务数据
		getMemberDate() {
			this.getMember(this.userInfo.openid).then(res => {
				this.member = res.member;
				this.card = res.card;
				this.global = res.global;
				this.initAgent();
			})
		},
		// 分销商信息,根据状态进行跳转
		initAgent() {
			const { is_agent, agent_status } = this.member;
			let url = "/pages/retail-center/apply-form/index";
			if (is_agent === "1" && agent_status === "1") {
				url = "/pages/retail-center/retail/index";
			} else if (is_agent === "0") {
				url = "/pages/retail-center/apply-form/index";
			} else if (agent_status === "0") {
				url = "/pages/retail-center/audit-page/index";
			}
			this.agentUrl = url;
		},
		getUserInfo() {
			getUserProfile().then(res => {
				uni.showToast({
					title: "授权成功",
					icon: "none",
				})
			})
		},
		getMobile(e) {
			getPhoneNumber(e).then(res => { }, () => { })
		},
		// TAG-需要上传文件到服务器接口，返回真实url后updateUserInfo
		chooseavatar(e) {
			console.log(e, '--------');
		}
	}
};
</script>

<style lang="scss" scoped>
.page-box::v-deep .u-scroll-list {
	padding-bottom: 0 !important;
}

.scroll-list-item {
	width: calc((100vw - 40px) / 4);
}

.card {
	background: linear-gradient(166deg, #3D3669 0%, #1B2E57 100%);
}

.special-text {
	transform: scale(1, 1.1);
	transform-origin: 0 0;
}
</style>
