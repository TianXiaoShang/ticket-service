<template>
	<div class="page-box bg-white box-border">
		<loading />
		<!-- 微信端，自定义导航 -->
		<nav-bar v-if="isWx" :showBack="true" :title="pageTitle" theme="dark" color="white"
			:backgroundColor="'#FF545C'"></nav-bar>
		<div class=" bg-red relative pt-10px px-20px pb-30px">
			<div class="text-white text-18px font-semibold">【听到，知道，悟到，做到】</div>
			<div class="text-white text-12px mt-20px opacity-80">武汉市丨湖北剧院</div>
			<div class="bg-white absolute left-0 bottom-0 w-full overflow-hidden rounded-t-8px h-10px"></div>
		</div>
		<!-- 选票信息 -->
		<div class="bg-white overflow-hidden p-20px pt-10px box-border w-full pb-130px">
			<!-- 日期 -->
			<div class="text-12px mb-12px">
				<span class="text-gray-333 font-semibold">日期</span>
				<span class="ml-5px text-gray-999">场次时间均为演出当地时间</span>
			</div>
			<div class="mb-20px text-gray-999">
				<div v-for="(item, index) in dateList" :key="index"
					:class="{ active: index === 1, 'mr-10px': index !== dateList.length - 1 }"
					style="background-color: #F8F8F8; border-color: #ddd"
					class="w-60px mb-10px h-45px rounded-5px border border-solid bg-bg inline-flex flex-col items-center justify-center">
					<span class="text-10px text-999">周四</span>
					<span class="text-14px text-999 mt-3px">11.11</span>
				</div>
			</div>
			<!-- 场次 -->
			<div class="text-12px mb-12px">
				<span class="text-gray-333 font-semibold">场次</span>
			</div>
			<div class="mb-20px text-gray-999">
				<div v-for="(item, index) in dateList" :key="index"
					:class="{ active: index === 1, 'mr-10px': index !== dateList.length - 1 }"
					style="background-color: #F8F8F8; border-color: #ddd"
					class="mb-10px px-25px h-40px rounded-5px relative overflow-hidden border border-solid bg-bg inline-flex  items-center ">
					<span class="text-14px text-999">上午 12:00</span>
					<div class="absolute right-0 top-0 text-white text-9px w-18px rounded-bl-5px
						h-18px flex justify-center items-center bg-red">折</div>
				</div>
			</div>
			<!-- 票档 -->
			<div class="text-12px mb-12px flex justify-between">
				<span class="text-gray-333 font-semibold">票档</span>
				<span style="color: #33ABF4">优惠说明</span>
			</div>
			<div class="mb-20px text-gray-999">
				<div v-for="(item, index) in dateList" :key="index"
					:class="{ active: index === 1, 'pr-20px': index !== 2, 'mr-10px': index !== dateList.length - 1 }"
					style="background-color: #F8F8F8; border-color: #ddd"
					class="mb-10px pl-20px h-40px flex rounded-5px overflow-hidden border border-solid bg-bg inline-flex  items-center ">
					<span class="text-14px text-999">280</span>
					<div v-if="index === 2" class="ml-10px h-40px text-white text-9px flex justify-end items-start">
						<div class="h-18px rounded-bl-5px px-5px bg-red flex items-center">每满2张减￥150</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 底部数量选择，选座按钮 -->
		<div class="fixed bottom-0 h-130px left-0 w-full box-border bg-white"
			style="box-shadow: 0px -2px 6px 0px rgba(51,51,51,0.05);">
			<div class="flex px-20px justify-between items-center h-60px">
				<div class="text-12px">
					<span class="text-gray-333">数量</span>
					<span class="text-gray-999 ml-4px">每笔订单限购6张</span>
				</div>
				<div style="background: #F4F4F4;" class="h-32px rounded-16px px-3px flex items-center">
					<image class="w-22px h-22px" src="@/static/detail/reduce.png" @click="reduce" />
					<div class="text-333 font-semibold text-14px mx-12px">{{ number }}张</div>
					<image class="w-22px h-22px" src="@/static/detail/add.png" @click="add" />
				</div>
			</div>
			<div
				class="h-60px px-20px border-t border-b-0 pb-9px border-l-0 border-r-0 border-gray-100 border-solid justify-between flex items-center">
				<div class="flex">
					<div class="text-red flex items-center">
						<span class="text-12 ml-3px relative top-2px">¥</span>
						<span class="text-18px font-semibold">168</span>
					</div>
					<div class="text-333 text-12 flex items-center ml-5px" @click="showPopup = true">
						<span>价格明细</span>
						<div class="ml-3px">
							<u-icon name="arrow-up-fill" size="10px" color="#333"></u-icon>
						</div>
					</div>

				</div>
				<u-button shape="circle" size="normal" :customStyle="{ height: '44px', width: '160px', margin: 0 }"
					color="linear-gradient(180deg, #FF545C 0%, #FF545C 100%);" text="去选座" @click="toSelectFilm">
				</u-button>
			</div>
		</div>

		<!-- 优惠明细 -->
		<u-popup :show="showPopup" :closeOnClickOverlay="true" :round="20" @close="showPopup = false">
			<div class="w-full">
				<div class="text-gray-333 px-20px pt-20px pb-10px flex justify-between items-center border-l-0 border-t-0 border-r-0 
                    border-b-1px border-gray-100 border-solid text-16 font-semibold ">
					<span> 费用明细 </span>
					<u-icon name="close" size="18px" @click="showPopup = false"></u-icon>
				</div>
				<!-- TAG-价格明细内容待补充 -->
				<scroll-view scroll-y="true" class="text-gray-666 max-h-50vh px-15px box-border mt-15px">
					<div class="mb-25px">
						<div class="text-gray-333 text-14px font-semibold flex justify-between items-center">
							<span>票品信息</span>
							<span>¥168</span>
						</div>
						<div class="mt-15px text-12px text-gray-999">6排3座位、6排3座位、6排3座位、6排3座位</div>
					</div>
					<div class="mb-25px" v-for="item in 10" :key="item">
						<div class="text-gray-333 text-14px font-semibold flex justify-between items-center">
							<span>会员折扣</span>
							<span class="text-red">-¥23</span>
						</div>
						<div class="mt-15px text-12px text-gray-999">半价日1折，-0.01元</div>
					</div>
				</scroll-view>
				<div class="pt-10px">
					<u-button shape="circle" size="normal" :customStyle="{ height: '44px', width: '200px' }"
						color="linear-gradient(180deg, #FF545C 0%, #FF545C 100%);" text="确定" @click="showPopup = false">
					</u-button>
				</div>
			</div>
		</u-popup>
	</div>
</template>

<script>
import NavBar from '@/components/nav-bar';
// TAG-新接口，还没对接
export default {
	data() {
		return {
			id: '',
			number: 0,
			dateList: [{}, {}, {}, {}, {}, {}, {}],
			showPopup: false,
			pageTitle: '',
		}
	},
	components: { NavBar },
	onLoad(options) {
		this.id = options.id;
		// 确保已经登陆完成
		this.waitLogin().then(() => {
			this.getData();
		})
	},
	methods: {
		toSelectFilm() {
			// TAG-这里要判断是哪种场景，以决定是否需要跳转选座，还有可能不需要选座直接跳转下单页
			console.log('toSelectFilm')
		},
		getData() {
			this.pageTitle = '电影迷概念车放大镜看了感觉的撒开的感觉';
			this.pageTitle = this.pageTitle.length > 15 ? this.pageTitle.substring(0, 12) + '...' : this.pageTitle;
			if (!this.isWx) {
				uni.setNavigationBarTitle({
					title: this.pageTitle
				});
			}
		},
		reduce() {
			if (this.number >= 1) {
				this.number--;
			}
		},
		add() {
			this.number++;
		}
	}
};
</script>


<style lang="scss" scoped>
.active {
	background-color: rgb(251, 234, 236) !important;
	border-color: #FF545C !important;
	color: #FF545C !important;
}
</style>