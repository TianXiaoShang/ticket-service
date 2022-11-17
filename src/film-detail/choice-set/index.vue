<template>
	<div class="page-box bg-white box-border">
		<loading />
		<!-- 电影信息 -->
		<div class=" bg-white pt-16px px-20px pb-10px flex justify-between items-center">
			<div>
				<div class="text-gray-333 text-14px font-semibold">{{ row.film_title }}</div>
				<div class="text-gray-666 text-12px mt-8px">
					{{ row.total_time || 0 }}分钟
					{{ row.entrance_time ? ' | ' + getDetialTime(row.entrance_time) : '' }}
					<!-- TAG-这里展示影片类型、主演，不如展示时间比较合理 -->
					<!-- {{ row.type_name ? ' | ' + row.type_name : '' }} -->
					<!-- {{ row.author ? ' | ' + row.author : '' }} -->
				</div>
			</div>
			<span class="text-12px" style="color: #33ABF4" @click="showPopup = true">优惠说明</span>
		</div>

		<!-- 票档分类 -->
		<div class="bg-white relative overflow-hidden px-20px pt-10px box-border w-full">
			<!-- 票档 -->
			<div class="text-gray-999 h-62px overflow-y-auto">
				<div v-for="(item, index) in dateList" :key="index"
					:class="{ active: index === 1, 'pr-10px': index !== 2, 'mr-10px': index !== dateList.length - 1 }"
					style="background-color: #F8F8F8; border-color: #ddd"
					class="mb-10px pl-10px h-35px flex rounded-5px overflow-hidden border border-solid bg-bg inline-flex  items-center ">
					<image class="w-22px h-22px mr-3px" src="@/static/detail/reduce.png" />
					<span class="text-14px text-999">280</span>
					<div v-if="index === 2" class="ml-10px h-35px text-white text-9px flex justify-end items-start">
						<div class="h-18px rounded-bl-5px px-5px bg-red flex items-center">每满2张减￥150</div>
					</div>
				</div>
			</div>
			<div class="filter absolute w-full left-0 bottom-0 h-15px"
				style="background-image: linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 80%);">
			</div>
		</div>

		<!-- 选座区域 -->
		<div style="height: calc(100vh - 60px - 62px - 130px)" class="bg-gray-bg py-10px box-border">
			<!-- 选座组件 -->
			<div class="box">
				daaaaaassssssss
			</div>
		</div>

		<!-- 底部已选展示，购买 -->
		<div class="fixed bottom-0 h-130px left-0 w-full box-border bg-white"
			style="box-shadow: 0px -2px 6px 0px rgba(51,51,51,0.05);">
			<!-- 已选 -->
			<div class="flex px-20px overflow-hidden justify-between items-center h-60px">
				<div class="flex items-center">
					<image class="w-22px h-22px" src="@/static/detail/reduce.png" />
					<span class="text-gray-333">6排8座、6排10座</span>
				</div>
			</div>
			<!-- 购买 -->
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
					color="linear-gradient(180deg, #FF545C 0%, #FF545C 100%);" text="去选座"
					@click.native.stop="toSelectFilm">
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
				<!-- TAG-服务条款内容待补充 -->
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
export default {
	data() {
		return {
			id: '',
			isAuto: false,
			// dateList: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
			dateList: [{}, {}, {}],
			showPopup: false,
			global: {},
			row: {},
			map: {},
			dayEnum: ['日', '一', '二', '三', '四', '五', '六']
		}
	},
	onLoad(options) {
		this.id = options.id;
		this.isAuto = options.isAuto == 'true' ? true : false;
		// 确保已经登陆完成
		this.waitLogin().then(() => {
			this.getData();
		})
	},
	methods: {
		getDetialTime(num) {
			let moment = this.moment(Number(num) * 1000);
			const date = moment.format('YYYY-MM-DD');
			const week = moment.day();
			const h = moment.hour() < 10 ? '0' + moment.hour() : moment.hour();
			const m = moment.minute() < 10 ? '0' + moment.minute() : moment.minute();
			return `${date}  周${this.dayEnum[week]}  ${h}:${m}`;
		},
		getData() {
			this.request("seat", { row_id: this.id }).then(res => {
				console.log(res, 'rrrrrrrrrrr');
				this.global = res.global;
				this.row = res.row;
				this.map = res.map;
			});
		},
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