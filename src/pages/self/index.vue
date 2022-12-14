<template>
	<view class="page-box bg-gray-bg box-border">
		<loading />
		<!-- 自定义导航 -->
		<nav-bar v-if="isWx" :title="'个人中心'" :backgroundColor="'transparent'"></nav-bar>
		<!-- 背景 -->
		<div class="fixed h-100vh overflow-hidden left-0 top-0 w-100vw">
			<image src="@/static/self/colorbg@2x.png" mode="widthFix" class="w-full" />
		</div>

		<!-- 内容区域 -->
		<div class="relative z-99 py-20px">
			<!-- 基本资料 -->
			<div class="flex justify-between items-center px-20px">
				<div class="flex items-center">
					<!-- 头像 -->
					<div @click="toPath('/pages/auth-user-info/index')"
						class="relative rounded-full border-solid shadow-lg border-2 border-white box-border overflow-hidden w-60px h-60px">
						<image :src="(userInfo.avatar || DEFAULT_AVATAR)" class="w-full h-full" />
					</div>
					<!-- 昵称 -->
					<div class="ml-10px">
						<div @click="toPath('/pages/auth-user-info/index')" class="text-333 font-semibold text-20">
							{{ userInfo.nickname || '点击登录' }}</div>
						<!-- 手机号 -->
						<div class="text-gray-666 text-12 mt-5px">
							<span class="relative" @click="toPath('/pages/auth-user-info/index')">
								{{ userInfo.mobile || '点击授权手机号' }}
							</span>
						</div>
					</div>
				</div>
				<div class="right">
					<u-button @click="toVip" class="h-26px min-w-58px" shape="circle" size="small"
						:color="card.id ? '#FF545C' : '#bbb'" text="VIP">
					</u-button>
				</div>
			</div>
			<!-- vip卡 start -->
			<div class="mt-20px relative text-0px h-15.76vw w-full" @click="toVip">
				<image src="@/static/self/card.png" class="w-full h-15.76vw" />
				<div
					class="absolute left-20px right-20px top-0 bottom-0 flex items-center justify-between px-20px box-border">
					<div class="flex items-center">
						<image mode="aspectFit" src="@/static/self/vipvip.png" class="w-18px h-18px" />
						<span class="ml-5px text-16 font-semibold" style="color: #673F0F">{{ authFlag ? cinema.title :
								'会员未登录'
						}}</span>
					</div>
					<div class="text-16 special-text" v-if="authFlag && card.id" style="color: #A04A07">
						<span class="text-14">¥</span>
						<span class="text-22px ml-2px">{{ card.balance }}</span>
					</div>
					<div class="text-16" v-if="(authFlag && !card.id)" style="color: #A04A07">
						开通会员
					</div>
				</div>
			</div>
			<!-- vip卡 end -->
			<div class="bg-gray-bg content-box px-20px pt-20px">
				<!-- 宫格 -->
				<div class="mb-20px">
					<u-scroll-list class="scroll-list is-scroll" :indicator="false">
						<div class="scroll-list-item flex flex-col justify-center items-center"
							@click="switchToPath('/pages/ticket/index')">
							<image mode="aspectFit" src="@/static/self/mine-tickets.png"
								class="w-12vw h-12vw shadow-md rounded-full" />
							<span class="mt-5px text-12 text-gray-333">我的票夹</span>
						</div>
						<div class="scroll-list-item flex flex-col justify-center items-center"
							@click="toPath('/order/list/index')">
							<image mode="aspectFit" src="@/static/self/mine-order.png"
								class="w-12vw h-12vw shadow-md rounded-full" />
							<span class="mt-5px text-12 text-gray-333">我的订单</span>
						</div>
						<div class="scroll-list-item flex flex-col justify-center items-center"
							@click="toPath('/coupon/my-coupon/index')">
							<image mode="aspectFit" src="@/static/self/mine-coupon.png"
								class="w-12vw h-12vw shadow-md rounded-full" />
							<span class="mt-5px text-12 text-gray-333">优惠券</span>
						</div>
						<div class="scroll-list-item flex flex-col justify-center items-center relative">
							<image mode="aspectFit" src="@/static/self/mine-service.png"
								class="w-12vw h-12vw shadow-md rounded-full" />
							<span class="mt-5px text-12 text-gray-333">在线客服</span>
							<button slot="title" class="z-9 absolute left-0 right-0 top-0 bottom-0 opacity-0"
								open-type="contact"></button>
						</div>
					</u-scroll-list>
				</div>
				<!-- 待观看 -->
				<div v-if="neerTicket.ticket" @click="toNeerTicket"
					class="card mt-20px flex justify-between items-center px-20px py-14px text-white rounded">
					<div>
						<div class="text-14">{{ neerTicket.ticket.film_title }}</div>
						<div class="mt-5px text-12 opacity-50">{{
								moment(order.ticket.entrance_time * 1000).format('YYYY-MM-DD HH:mm')
						}}</div>
					</div>
					<div class="text-14 flex items-center">
						<span>待观看</span>
						<u-icon name="arrow-right" class="ml-4px" size="16px" color="#fff"></u-icon>
					</div>
				</div>
				<!-- 功能卡片 -->
				<div class="bar-wrap">
					<div @click="toPath('/coupon/center/index')"
						class="h-56px mt-10px px-20px box-border py-18px flex items-center justify-between bg-white rounded">
						<div class="flex items-center">
							<image mode="aspectFit" src="@/static/self/gift-16.png" class="w-16px h-16px" />
							<span class="ml-10px text-gray-333 text-14px">领券中心</span>
						</div>
						<u-icon name="arrow-right" class="ml-4px" size="16px" color="#999"></u-icon>
					</div>
					<div @click="toEmployee"
						class="h-56px mt-10px px-20px box-border py-18px flex items-center justify-between bg-white rounded">
						<div class="flex items-center">
							<image mode="aspectFit" src="@/static/self/staff-16.png" class="w-16px h-16px" />
							<span class="ml-10px text-gray-333 text-14px">员工入口</span>
						</div>
						<u-icon name="arrow-right" class="ml-4px" size="16px" color="#999"></u-icon>
					</div>
					<div @click="toPath('/rights/my-rights/index')"
						class="h-56px mt-10px px-20px box-border py-18px flex items-center justify-between bg-white rounded">
						<div class="flex items-center">
							<image mode="aspectFit" src="@/static/self/vip-16.png" class="w-16px h-16px" />
							<span class="ml-10px text-gray-333 text-14px">权益卡</span>
						</div>
						<u-icon name="arrow-right" class="ml-4px" size="16px" color="#999"></u-icon>
					</div>
					<div @click="toAgent"
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
// TAG - 列表跳转没对接
import NavBar from '@/components/nav-bar';

export default {
	data() {
		return {
			member: {},
			card: {},
			global: 0,
			neerTicket: {},
			loginFlag: false,
			authFlag: false,
			agentUrl: '', // TAG-分销申请的不同状态跳转不同分销页面
		}
	},
	components: { NavBar },
	onShow() {
		if (this.loginFlag) {
			this.getAllData();
		}
	},
	onLoad() {
		// 确保已经登录完成，再去检查是否有授权
		this.waitLogin().then(() => {
			// 检查授权用户信息，在没有授权的情况下引导授权，但不阻塞购买业务
			this.checkAuth();
			this.getAllData();
			this.loginFlag = true;
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
		toNeerTicket() {
			// TAG-要对接路由跳转地址，跳转到订单详情页
			const url = `/order/ticket/index?id=${this.neerTicket.ticket.order_id}`;
			console.log(url, this.neerTicket, 'toNeerTicket');
		},
		// 个人详细业务数据
		getMemberDate() {
			this.checkAuth(true).then(() => {
				this.authFlag = true;
				this.getMember(this.userInfo.openid).then(res => {
					this.member = res.member;
					this.card = res.card;
					this.global = res.global;
					this.initAgent();
				})
			})
		},
		// 分销商信息,根据状态进行跳转
		initAgent() {
			const { is_agent, agent_status } = this.member;
			let url = "/retail/apply/index";
			if (is_agent === "1" && agent_status === "1") {
				url = "/retail/home/index";
			} else if (is_agent === "0") {
				url = "/retail/apply/index";
			} else if (agent_status === "0") {
				url = "/retail/audit-page/index";
			}
			this.agentUrl = url;
		},
		toVip() {
			this.checkAuth(false, false).then(() => {
				this.toPath('/vip/vip/index');
			})
		},
		toAgent() {
			this.checkAuth(false).then(() => {
				this.toPath(this.agentUrl)
			})
		},
		toEmployee() {
			this.checkAuth().then(() => {
				this.toPath('/staff/home/index');
			})
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
</style>
