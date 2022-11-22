<template>
	<div class="page-box bg-white box-border">
		<loading />
		<!-- 电影信息 -->
		<div class=" bg-white pt-16px px-20px pb-10px flex justify-between items-center relative z-9999">
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
		<div class="bg-white relative z-9999 overflow-hidden px-20px pt-10px box-border w-full">
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
			<div class="absolute w-full left-0 bottom-0 h-15px"
				style="background-image: linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 80%);">
			</div>
		</div>

		<!-- 选座区域 -->
		<div style="height: calc(100vh - 60px - 62px - 10px - 122px)" class="bg-gray-bg box-border">
			<!-- 选座组件 -->
			<div class="w-full h-full">
				<set-area ref="SetArea" :mapData="map" :maxSelect="maxSelectSet" v-if="map && map.length"
					@seatChange="seatChange">
				</set-area>
				<div v-else>
					<u-empty mode="coupon" :text="!pageLoad ? 'loading...' : '暂无座位安排'"
						icon="http://cdn.uviewui.com/uview/empty/comment.png">
					</u-empty>
				</div>
			</div>
		</div>

		<!-- 底部已选展示，购买 -->
		<div class="fixed z-9999 bottom-0 h-122px left-0 w-full box-border bg-white"
			style="box-shadow: 0px -2px 6px 0px rgba(51,51,51,0.05);">
			<!-- 已选 -->
			<div class="overflow-hidden h-52px box-border overflow-x-auto pl-10px py-10px" style="white-space: nowrap;">
				<template v-if="selectSeatDataList.length">
					<div class="inline-flex mr-10px items-center bg-gray-bg px-10px py-4px border rounded-5px box-border border-solid border-gray-ddd"
						v-for="(item, index) in selectSeatDataList" :key="index">
						<div class="w-18px h-18px mr-5px" :style="{ background: item.color || 'green' }">
							<image class="w-18px h-18px min-w-18px min-h-18px" src="../static/seat.png"
								mode="aspectFit">
							</image>
						</div>
						<span class="text-gray-333 leading-relaxed text-14px">{{ item.originData.name }}</span>
						<image @click="deleteSeat(item)" class="w-18px h-18px min-w-18px min-h-18px ml-10px"
							src="../static/close.png" mode="aspectFit"></image>
					</div>
					<div class="absolute w-20px right-0 top-0 h-full"
						style="background-image: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 90%);">
					</div>
				</template>
				<div class="h-full w-full flex items-center justify-center text-gray-999 text-14px" v-else>请选择观影座位</div>
			</div>
			<!-- 购买 -->
			<div
				class="h-60px px-20px border-t border-b-0 pb-9px border-l-0 border-r-0 border-gray-100 border-solid justify-between flex items-center">
				<div class="flex">
					<div class="text-red flex items-center">
						<span class="text-12 ml-3px relative top-2px">¥</span>
						<span class="text-18px font-semibold">{{totalPrice}}</span>
					</div>
					<div class="text-333 text-12 flex items-center ml-5px" @click="showPopup = true">
						<span>价格明细</span>
						<div class="ml-3px">
							<u-icon name="arrow-up-fill" size="10px" color="#333"></u-icon>
						</div>
					</div>
				</div>
				<u-button shape="circle" size="normal" :customStyle="{ height: '44px', width: '160px', margin: 0 }"
					color="linear-gradient(180deg, #FF545C 0%, #FF545C 100%);" text="立即购买" @click="toPay">
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
import SetArea from '../components/set-area.vue';

export default {
	data() {
		return {
			id: '',
			dateList: [{}, {}, {}, {}, {}],   // TAG-票档接口待对接
			showPopup: false,
			global: {},
			row: {},
			map: [],
			dayEnum: ['日', '一', '二', '三', '四', '五', '六'],
			maxSelectSet: 0,
			selectSeatDataList: [],
			totalPrice: 0,
		}
	},
	components: { SetArea },
	onLoad(options) {
		this.id = options.id;
		// 确保已经登陆完成
		this.waitLogin().then(() => {
			this.getData();
		})
	},
	methods: {
		deleteSeat(item) {
			this.$refs.SetArea.deleteSeat(item);
		},
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
				this.global = res.global;
				this.row = res.row;
				this.map = this.initMap(res.map.seat);
				this.pageLoad = true;
				this.maxSelectSet = (res.row.film_astrict || res.row.film_astrict == 0) ? Number(res.row.film_astrict) : 100000;
			});
		},
		initMap(map) {
			const arr = [];
			for (const key in map) {
				if (Object.hasOwnProperty.call(map, key)) {
					const element = map[key];
					const ele = {
						YCoord: Number(element.row),
						XCoord: Number(element.col),
						SeatCode: element.mark,
						Status: element.status,
						color: element.color,
						links: element.links,
						originData: element,
						RowNum: Number(element.row),
						// ColumnNum  这个字段暂时没啥用，RowNum还能用来左侧行号的展示
					}
					arr.push(ele)
				}
			}
			return arr;
		},
		seatChange(e) {
			this.selectSeatDataList = e;
			// TAG-变更后通过接口获取价格及优惠信息
			this.totalPrice = this.selectSeatDataList.length * this.row.price;
		},
		toPay() {
			if (!this.selectSeatDataList || !this.selectSeatDataList.length) {
				uni.showToast({
					title: "请先选择座位",
					icon: 'none'
				})
				return;
			}
			const ids = this.selectSeatDataList.map(el => el.originData.mark);
			console.log(ids.toString(), this.totalPrice, '========');
			return;
			// this.request("order", {
			// 	row_id: this.id,
			// 	seat: ids.toString(),
			// 	price: this.totalPrice,
			// }).then(res => {
			// 	wx.redirectTo({
			// 		url: '/pages/order/pay/pay?id=' + res.data.order_id,
			// 	});
			// })
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