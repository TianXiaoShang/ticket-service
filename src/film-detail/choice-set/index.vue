<template>
	<div class="page-box bg-white box-border">
		<loading />
		<!-- 电影信息 -->
		<div class=" bg-white pt-16px px-20px pb-10px flex justify-between items-center relative z-998">
			<div>
				<div class="text-gray-333 text-14px font-semibold">{{ row.film_title }}</div>
				<div class="text-gray-666 text-12px mt-8px">
					{{ row.total_time || 0 }}分钟
					{{ row.entrance_time ? ' | ' + getDetialTime(row.entrance_time) : '' }}
				</div>
			</div>
			<span class="text-12px text-blue" @click="showPopup = true">优惠说明</span>
		</div>

		<!-- 票档分类 -->
		<div class="bg-white relative z-998 overflow-hidden box-border w-full" v-if="partList && partList.length">
			<!-- 票档 -->
			<div class="text-gray-999 h-32px overflow-x-auto px-20px whitespace-nowrap">
				<div v-for="(item, index) in partList" :key="index" @click="tapPart(item, false)"
					:class="{ active: currentPart.id === item.id && !activePartDis, 'mr-10px': index !== partList.length - 1 }"
					style="background-color: #f9faf6; border-color: #ddd"
					class="px-10px h-30px flex rounded-5px overflow-hidden border border-solid bg-bg inline-flex items-center">
					<div class="w-18px h-18px mr-5px" :style="{ background: item.color || '#B4CCBD' }">
						<image class="w-18px h-18px min-w-18px min-h-18px" src="../static/seat.png" mode="aspectFill">
						</image>
					</div>
					<span class="text-14px text-999">¥{{ item.price }}</span>
				</div>
			</div>
		</div>
		<!-- 套票折扣 -->
		<div class="bg-white relative z-998 overflow-hidden box-border w-full py-10px"
			v-if="disPartList && disPartList.length">
			<!-- 票档 -->
			<div class="text-gray-999 h-32px overflow-x-auto px-20px whitespace-nowrap">
				<div v-for="(item, index) in disPartList" :key="index" @click="tapPart(item, true)"
					:class="{ active: currentPart.id === item.id && activePartDis, 'mr-10px': index !== partList.length - 1 }"
					style="background-color: #f9faf6; border-color: #ddd"
					class="pl-10px h-30px flex rounded-5px overflow-hidden border border-solid bg-bg inline-flex items-center ">
					<div class="w-18px h-18px mr-3px" v-for="(el, index) in Number(item.discount_num)" :key="index"
						:style="{ background: item.color || '#B4CCBD' }">
						<image class="w-18px h-18px min-w-18px min-h-18px" src="../static/seat.png" mode="aspectFill">
						</image>
					</div>
					<span class="text-14px text-999">
						{{ currentPart.id === item.id && activePartDis ? item.discount_num + '人套票 ' : '' }}
						¥{{ Number(item.price) * item.discount_num - item.discount_price }}</span>
					<div class="ml-10px h-30px text-white text-9px flex justify-end items-start">
						<div class="h-18px rounded-bl-5px px-5px bg-red flex items-center">
							套票
							<!-- 每{{ item.discount_num }}人票{{ Number(item.price) * item.discount_num - item.discount_price
							}}元 -->
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 选座区域 -->
		<div :style="{ height: `calc(100vh - ${60 + otherHeight + 122}px)` }"
			class="bg-gray-bg box-border overflow-hidden">
			<!-- 选座组件 -->
			<div class="w-full h-full">
				<set-area :isHeight="`calc(100vh - ${60 + otherHeight + 122}px)`" ref="SetArea"
					:hallTitle="row.hall_title" :mapData="map" :maxSelect="maxSelectSet" v-if="map && map.length"
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
		<div class="fixed z-998 bottom-0 h-122px left-0 w-full box-border bg-white"
			style="box-shadow: 0px -2px 6px 0px rgba(51,51,51,0.05);">
			<!-- 已选 -->
			<div class="overflow-hidden h-52px box-border overflow-x-auto pl-10px py-10px" style="white-space: nowrap;">
				<template v-if="selectSeatDataList.length">
					<div class="inline-flex mr-10px items-center bg-gray-bg px-10px py-4px border rounded-5px box-border border-solid border-gray-ddd"
						v-for="(item, index) in selectSeatDataList" :key="index">
						<div class="w-18px h-18px mr-5px"
							:style="{ background: selectSeatDataList.color || '#2BC881' }">
							<image class="w-18px h-18px min-w-18px min-h-18px" src="../static/seat-sel@10.png"
								mode="aspectFill">
							</image>
						</div>
						<span class="text-gray-333 leading-relaxed text-14px">
							{{ item.RowNum + '排' + item.XCoord + '座' }}
						</span>
						<image @click="deleteSeat(item)" class="w-18px h-18px min-w-18px min-h-18px ml-5px"
							src="../static/close.png" mode="aspectFill"></image>
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
						<span class="text-18px font-semibold">{{ totalPrice }}</span>
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
				<scroll-view scroll-y="true" class="text-gray-666 max-h-50vh px-15px box-border mt-15px">
					<div class="mb-25px">
						<div class="text-gray-333 text-14px font-semibold flex justify-between items-center">
							<span>票品信息</span>
							<span>¥{{ totalPrice }}</span>
						</div>
						<div class="mt-15px text-12px text-gray-999">{{ setListStr }}</div>
					</div>
					<div class="mb-25px" v-if="part_discount" :key="item">
						<div class="text-gray-333 text-14px font-semibold flex justify-between items-center">
							<span>套票折扣</span>
							<span class="text-red">-¥{{ part_discount }}</span>
						</div>
						<div class="mt-15px text-12px text-gray-999">套票满减</div>
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
			partList: [],
			showPopup: false,
			global: {},
			row: {},
			map: [],
			dayEnum: ['日', '一', '二', '三', '四', '五', '六'],
			maxSelectSet: 0,
			selectSeatDataList: [],
			totalPrice: 0,
			part_discount: 0, // 套票折扣金额
			currentPart: {},
			disPartList: [],
			activePartDis: false,
			activePartId: '',
			isTapPart: false,
		}
	},
	components: { SetArea },
	onLoad(options) {
		this.id = options.id;
		this.activePartId = options.activePartId || null;
		// 确保已经登录完成
		this.waitLogin().then(() => {
			this.checkAuth();
			this.getData();
		})
	},
	computed: {
		setListStr() {
			const arr = this.selectSeatDataList.map(item => item.RowNum + '排' + item.XCoord + '座')
			return arr.join('、')
		},
		otherHeight() {
			return ((this.partList && this.partList.length) ? 32 : 0) + ((this.disPartList && this.disPartList.length) ? 52 : 0);
		}
	},
	watch: {
		// 分区选择变化
		currentPart: {
			handler() {
				this.$refs.SetArea.changeActivePart(this.currentPart, this.isTapPart);
				// 如果是选择分区，则重置缩放倍数；
				if (this.isTapPart) {
					// 重置后关闭开关
					this.isTapPart = false;
				}
			},
			deep: true
		}
	},
	methods: {
		// 维护当前选中分区
		tapPart(item, activePartDis, isDis) {
			// 如果是同一个分区，只是选了切换了套票和非套票。则切换activePartDis即可。无需改变currentPart；
			if (item.id === this.currentPart.id && this.activePartDis !== activePartDis) {
				this.activePartDis = activePartDis;
				if (activePartDis) {
					this.getPartSeat(item)
				}
				return;
			}
			this.activePartDis = activePartDis;
			if (item.id === this.currentPart.id) {
				this.currentPart = {};
			} else {
				this.currentPart = item;
				if (activePartDis) {
					this.getPartSeat(item)
				}
			}
			// 选择分区要重置缩放倍数
			this.isTapPart = true;
		},
		// 选择套票，获取座位自动选中
		getPartSeat(item) {
			// 如果已经选了座位则不帮用户选
			if (this.selectSeatDataList && this.selectSeatDataList.length) {
				return;
			}
			this.request('order.selPart', {
				part_id: item.id,
				row_id: this.id,
				number: item.discount_num,
				openid: this.userInfo.openid
			}).then(res => {
				if (res && res.seats) {
					res.seats.forEach(el => {
						const row = el.split('_')[0];
						const col = el.split('_')[1];
						this.$refs.SetArea.handleChooseSeat(Number(row) - 1, Number(col))
					})
				}
			})
		},
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
				this.partList = res.row.part_ext || [];
				// 套票优惠
				const arr = this.partList.filter(el => el.is_discount == 1);   // 有套票优惠分区
				this.disPartList = arr;
			});
		},
		initMap(map) {
			const arr = [];
			for (const key in map) {
				if (Object.hasOwnProperty.call(map, key)) {
					const element = map[key];
					const ele = {
						YCoord: Number(element.row),  // 排号
						XCoord: Number(element.col),  // 座号
						RowNum: Number(element.row),   // 行号
						// ColumnNum  这个字段暂时没啥用，RowNum还能用来左侧行号的展示
						seatCode: element.mark,   // 座位唯一code
						status: element.status,   // 状态，-10为非座位，0为未购可选座位，10为当前已选座位, 1为已被他人占用座位
						color: element.color,    // 座位颜色
						links: element.links,   // 是否为情侣座
						originData: element,   // 原始数据
						active: this.activePartId ? this.activePartId === element.part_id : true,   // 高亮展示
						part_id: element.part_id,   // 分区id
					}
					arr.push(ele)
				}
			}
			return arr;
		},
		seatChange(e) {
			this.selectSeatDataList = e;
			if (!e || e.length === 0) {
				this.totalPrice = 0;
				return;
			}
			if (this.partList && this.partList.length) {
				// 最后一个为当前选中的座位
				const curSeat = e[e.length - 1];
				// 比较当前选座是否为当前选中的分区，如果是则保持，如果不是则取消分区选中状态
				const curPart = this.partList.find(el => el.id === curSeat.part_id);
				if (curPart && curPart.id !== this.currentPart.id) {
					this.currentPart = {};
				}
			}
			// 调用接口计算价格
			const ids = this.selectSeatDataList.map(el => el.seatCode)
			this.request('order.seat', {
				row_id: this.id,
				seat: ids.toString(),
				openid: this.userInfo.openid,
				_showLoading: false,
			}).then(res => {
				// 此时用户如果更改到0个座位，反馈的数据已经不正确，直接取0
				if (!this.selectSeatDataList || this.selectSeatDataList.length === 0) {
					this.totalPrice = 0;
					return;
				}
				this.totalPrice = res.price;
				this.part_discount = res.part_discount;
			})
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
			this.request("order", {
				row_id: this.id,
				seat: ids.toString(),
				price: this.totalPrice,
			}).then(res => {
				uni.redirectTo({
					url: '/order/pay/index?id=' + res.order_id,
				})
			})
		}
	}
};
</script>


<style lang="scss" scoped>
.active {
	background-color: #f9faf6 !important;
	// background-color: rgb(251, 234, 236) !important;
	border-color: #FF545C !important;
	color: #FF545C !important;
}
</style>