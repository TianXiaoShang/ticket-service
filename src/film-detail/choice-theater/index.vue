<template>
	<div class="page-box bg-white box-border">
		<loading />
		<!-- 微信端，自定义导航 -->
		<nav-bar v-if="isWx" :showBack="true" :title="pageTitle" theme="dark" color="white"
			:backgroundColor="'#FF545C'"></nav-bar>
		<div class=" bg-red relative pt-10px px-20px pb-30px">
			<div class="text-white text-18px font-semibold">【{{ filmData.title }}】</div>
			<div class="text-white text-12px mt-20px opacity-80">{{ filmData.address }}</div>
			<div class="bg-white absolute left-0 bottom-0 w-full overflow-hidden rounded-t-8px h-10px"></div>
		</div>
		<template v-if='dateList && dateList.length && dateList[0].row && dateList[0].row.length'>
			<!-- 选票信息 -->
			<div class="bg-white overflow-hidden p-20px pt-10px box-border w-full" :class="{
				'pb-130px': this.curSession.seat_random == 1,
				'pb-70px': this.curSession.seat_random != 1
			}">
				<!-- 日期 -->
				<div class="text-12px mb-12px">
					<span class="text-gray-333 font-semibold">日期</span>
					<span class="ml-5px text-gray-999">场次时间均为演出当地时间</span>
				</div>
				<div class="mb-20px text-gray-999">
					<div v-for="(item, index) in dateList" :key="index" @click="choiseDate(item)"
						:class="{ active: curDate.title === item.title, 'mr-10px': index !== dateList.length - 1 }"
						style="background-color: #F8F8F8; border-color: #ddd"
						class="w-105px mb-10px h-45px rounded-5px border border-solid bg-bg inline-flex flex-col items-center justify-center">
						<span class="text-10px text-999">{{ item.week }}</span>
						<span class="text-14px text-999 mt-3px">{{ item.title_y }}</span>
					</div>
				</div>
				<!-- 场次 -->
				<template v-if="sessionList && sessionList.length">
					<div class="text-12px mb-12px">
						<span class="text-gray-333 font-semibold">场次</span>
					</div>
					<div class="mb-20px text-gray-999">
						<div v-for="(item, index) in sessionList" :key="index" @click="choiseSession(item)"
							:class="{ active: curSession.id === item.id, 'mr-10px': index !== dateList.length - 1 }"
							style="background-color: #F8F8F8; border-color: #ddd"
							class="mb-10px px-25px h-40px rounded-5px relative overflow-hidden border border-solid bg-bg inline-flex  items-center ">
							<span class="text-14px text-999">
								{{ curDate.title }} {{ moment(Number(item.entrance_time) * 1000).format('HH:mm') }}
							</span>
							<div v-if='item.is_part == 1' class="absolute right-0 top-0 text-white text-9px w-18px rounded-bl-5px
						h-18px flex justify-center items-center bg-red">折</div>
						</div>
					</div>
				</template>
				<template v-if="partList && partList.length">
					<!-- 票档 -->
					<div class="text-12px mb-12px flex justify-between">
						<span class="text-gray-333 font-semibold">票档</span>
						<span class="text-blue" @click="showPopup = true"
							v-if="this.curSession.seat_random == 1">优惠说明</span>
					</div>
					<div class="mb-20px text-gray-999">
						<div v-for="(item, index) in partList" :key="index" @click="choisePart(item)"
							:class="{ active: curPart.id === item.id, 'pr-20px': item.is_discount != 1, 'mr-10px': index !== partList.length - 1 }"
							style="background-color: #F8F8F8; border-color: #ddd"
							class="mb-10px pl-20px h-40px flex rounded-5px overflow-hidden border border-solid bg-bg inline-flex  items-center ">
							<span class="text-14px text-999">{{ item.name }} | {{ item.price }}</span>
							<div v-if="item.is_discount == 1"
								class="ml-10px h-40px text-white text-9px flex justify-end items-start">
								<div class="h-18px rounded-bl-5px px-5px bg-red flex items-center">
									每{{ item.discount_num }}张减{{ item.discount_price }}元
									<!-- {{ item.discount_num }}人套票{{ Number(item.price) * item.discount_num - item.discount_price }}元 -->
								</div>
							</div>
						</div>
					</div>
				</template>
			</div>
			<!-- 底部数量选择，按钮， 不选座模式 -->
			<div class="fixed bottom-0 h-130px left-0 w-full box-border bg-white"
				style="box-shadow: 0px -2px 6px 0px rgba(51,51,51,0.05);" v-if="curSession.seat_random == 1">
				<div class="flex px-20px justify-between items-center h-60px">
					<div class="text-12px">
						<span class="text-gray-333">数量</span>
						<span class="text-gray-999 ml-4px">每笔订单限购{{ maxSelectSet }}张</span>
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
							<span class="text-18px font-semibold">{{ total }}</span>
						</div>
						<div class="text-333 text-12 flex items-center ml-5px" @click="showPopup = true">
							<span>价格明细</span>
							<div class="ml-3px">
								<u-icon name="arrow-up-fill" size="10px" color="#333"></u-icon>
							</div>
						</div>
					</div>
					<u-button shape="circle" size="normal" :customStyle="{ height: '44px', width: '160px', margin: 0 }"
						:disabled="disabledBtn || !curDate.title || !curSession.id || !curPart.id || !number || curSession.is_sell == 1 || curSession.sell != 1"
						color="#FF545C" :text="getBtnStatusText()" @click="toSelectFilm">
					</u-button>
				</div>
			</div>

			<!-- 底部数量选择，按钮  选座模式 -->
			<div class="fixed bottom-0 h-70px left-0 w-full box-border bg-white"
				style="box-shadow: 0px -2px 6px 0px rgba(51,51,51,0.05);" v-if="curSession.seat_random != 1">
				<div
					class="h-60px px-20px border-t border-b-0 pb-9px border-l-0 border-r-0 border-gray-100 border-solid justify-between flex items-center">
					<div class="flex">
						<div class="text-gray-666 text-12 flex items-center ml-5px">
							<span>
								{{ curDate.title }} |
								{{
									curSession.id ? moment(Number(curSession.entrance_time) * 1000).format('HH:mm') :
										'未选择场次'
								}}
								{{ curPart.name ? ' | ' + curPart.name : '' }}
							</span>
						</div>
					</div>
					<u-button shape="circle" size="normal" :customStyle="{ height: '44px', width: '160px', margin: 0 }"
						:disabled="disabledBtn || !curDate.title || !curSession.id || curSession.is_sell == 1 || curSession.sell != 1"
						:color="'#FF545C'" :text="getBtnStatusText()" @click="toSelectFilm">
					</u-button>
				</div>
			</div>

		</template>

		<u-empty v-else mode="data" text="暂无场次安排" icon="http://cdn.uviewui.com/uview/empty/data.png">
		</u-empty>

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
							<span>¥{{ total }}</span>
						</div>
						<div class="mt-15px text-12px text-gray-999">{{ curDate.title }} |
							{{
								curSession.id ? moment(Number(curSession.entrance_time) *
									1000).format('HH:mm') : '未选择场次'
							}} | {{ curPart.name }} | {{ number }}张</div>
					</div>
					<div class="mb-25px">
						<div class="text-gray-333 text-14px font-semibold flex justify-between items-center">
							<span>套票折扣</span>
							<span class="text-red">-¥{{ part_discount }}</span>
						</div>
						<div class="mt-15px text-12px text-gray-999">每{{ curPart.discount_num }}张减{{
							curPart.discount_price
						}}元</div>
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
export default {
	data() {
		return {
			id: '',
			number: 0,
			showPopup: false,
			pageTitle: '',
			maxSelectSet: 0,
			curDate: {},
			curSession: {},
			curPart: {},
			dateList: [],
			sessionList: [],
			partList: [],
			total: 0,
			part_discount: 0,
			disabledBtn: false,
			filmData: {},
		}
	},
	components: { NavBar },
	onLoad(options) {
		this.id = options.id;
		// 确保已经登录完成
		this.waitLogin().then(() => {
			this.getData();
		})
	},
	watch: {
		curDate: {
			handler() {
				if (!this.curDate || !this.curDate.title) {
					return [];
				};
				this.sessionList = this.dateList.find(el => el.title === this.curDate.title).row || [];
				this.partList = [];
				this.curPart = {};
				this.curSession = {};
			},
			deep: true,
		},
		curSession: {
			handler() {
				if (!this.curSession.id) {
					return;
				}
				this.partList = [];
				this.curPart = {};
				this.maxSelectSet = 0;
				// 根据场次获取分区数据
				this.request("seat", { row_id: this.curSession.id }).then(res => {
					this.maxSelectSet = (res.row.film_astrict || res.row.film_astrict == 0) ? Number(res.row.film_astrict) : 100000;
					this.partList = res.row.part_ext || [];
					this.curPart = this.partList[0] || {};
				});
			},
			deep: true
		},
		curPart: {
			handler() {
				this.calculateTotal();
			},
			deep: true
		},
		number() {
			this.calculateTotal();
		}
	},
	methods: {
		getBtnStatusText() {
			if (!this.curSession.id) {
				return '请选择场次';
			}
			return this.curSession.is_sell == 1 ? '已售空' : this.curSession.sell == 1 ? this.curSession.seat_random == 1 ? '去下单' : '去选座' : '未开售'
		},
		toSelectFilm() {
			if (this.curSession.seat_random == 0) {
				this.toPath('/film-detail/choice-set/index?id=' + this.curSession.id + (this.curPart.id ? '&activePartId=' + this.curPart.id : ''));
			} else {
				this.request("order.un_create", {
					row_id: this.curSession.id,
					openid: this.userInfo.openid,
					part_id: this.curPart.id,
					number: this.number,
					price: this.total
				}).then(res => {
					if (res.order_id) {
						uni.redirectTo({
							url: '/order/pay/index?id=' + res.order_id,
						})
					} else {
						uni.showToast({
							title: '下单发生错误',
							icon: 'none'
						})
					}
				})
			}
		},
		choiseDate(item) {
			this.curDate = item;
		},
		choiseSession(item) {
			this.curSession = item;
		},
		choisePart(item) {
			this.curPart = item;
		},
		// 计算价格
		calculateTotal() {
			if (!this.number) {
				this.total = 0;
				this.part_discount = 0;
				return;
			}
			if (!this.curSession.id || !this.curPart.id) {
				return;
			}
			this.request("order.part_seat", {
				row_id: this.curSession.id,
				openid: this.userInfo.openid,
				part_id: this.curPart.id,
				number: this.number,
				_showLoading: false
			}).then(res => {
				this.total = res.price;
				this.part_discount = res.part_discount;
				this.disabledBtn = false;
			}).catch(() => {
				this.disabledBtn = true;
				uni.showToast({
					title: '价格结算出错',
					icon: 'none'
				})
			});
		},
		getData() {
			// 获取影片排期
			this.request("film.lists", { film_id: this.id, openid: this.userInfo.openid }).then(res => {
				// this.isAuto = res.isAuto == 1 ? true : false;
				this.dateList = res.time;
				if (this.dateList && this.dateList.length) {
					this.curDate = this.dateList[0];
					if (this.curDate.row && this.curDate.row.length) {
						this.curSession = this.curDate.row[0];
					}
				}
				// 影片标题等信息
				this.filmData = res.film;
				this.pageTitle = this.filmData.title;
				this.pageTitle = this.pageTitle.length > 15 ? this.pageTitle.substring(0, 12) + '...' : this.pageTitle;
				if (!this.isWx) {
					uni.setNavigationBarTitle({
						title: this.pageTitle
					});
				}
			})
		},
		reduce() {
			if (this.number >= 1) {
				this.number--;
			}
		},
		add() {
			if (this.number < this.maxSelectSet) {
				this.number++;
			} else {
				uni.showToast({
					title: '达到最大可选座位数',
					icon: 'none'
				})
			}
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