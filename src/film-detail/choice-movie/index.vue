<template>
	<div class="page-box bg-white box-border">
		<loading />
		<!-- 轮播 -->
		<div class="w-full mt-10px" v-if="movieList.length">
			<swiper class="w-full h-49vw" :indicator-dots="false" :autoplay="false" :display-multiple-items="3"
				@change="changeSwiper" :current="currentIndex">
				<swiper-item @click="tapSwiperItem(index)" :class="{ active: bigItem.id === item.id }"
					v-for="(item, index) in movieList" :key="index"
					class="swiper-item text-0 flex items-end justify-center">
					<image class="w-25vw rounded-10px overflow-hidden h-39vw" :src="item.logo" mode="scaleToFill" />
				</swiper-item>
			</swiper>
		</div>
		<div class="p-20px flex flex-col justify-center items-center" v-if="bigItem">
			<div class="text-16px text-gray-333 align-center font-semibold">{{ bigItem.title }}</div>
			<div class="text-12px text-gray-666 align-center mt-10px">
				<!-- TAG-时长字段total_time不知道对不对 -->
				{{ bigItem.total_time ? bigItem.total_time + '分钟' : '' }}
				{{ bigItem.type_name ? ' | ' + bigItem.type_name : '' }}
				{{ bigItem.author ? ' | ' + bigItem.author : '' }}
			</div>
		</div>
		<!-- tabs -->
		<!-- 如果只有一个就通过tabs-wrap样式将这个tab放中间，多个的情况没法支持 -->
		<div v-if="tabsDataList.length" :class="{ 'tabs-wrap': tabsDataList.length === 1 }">
			<u-tabs :current="tabIndex" :list="tabsDataList" @click="changeTab" lineColor="#FF545C"
				:itemStyle="{ height: '42px' }"
				:activeStyle="{ color: '#333', fontWeight: 'bold', transform: 'scale(1.05)' }"
				:inactiveStyle="{ color: '#999999', transform: 'scale(1)' }"></u-tabs>
			<!-- tab内容 -->
			<div style="border-top: 1px solid #eee" class="pb-20px w-full">
				<div v-if="!tabsDataList[tabIndex].row || !tabsDataList[tabIndex].row.length" class="mt-30px">
					<u-empty mode="coupon" text="暂无场次安排" icon="http://cdn.uviewui.com/uview/empty/coupon.png">
					</u-empty>
				</div>
				<!-- 时间场次 -->
				<template v-else>
					<div class="px-20px box-border w-100vw flex justify-between py-12px"
						v-for="(item, index) in tabsDataList[tabIndex].row" :key="index"
						style="border-bottom: 1px solid #eee">
						<!-- 左侧 -->
						<div class="flex flex-col flex-1">
							<div class="flex">
								<div class="mr-20px">
									<div class="text-gray-333 text-18px font-semibold">
										{{ getHourAndMinute(item.entrance_time) }}</div>
									<div class="text-gray-999 text-10px mt-4px">{{ getHourAndMinute(item.end_time) }}散场
									</div>
								</div>
								<div>
									<div class="text-gray-333 mt-1px text-14px">{{ item.language }}{{ is_pattern != 1 ?
											item.filmtype : ''
									}} {{ item.total_time }}分钟</div>
									<div class="text-gray-999 text-10px mt-6px">{{ item.ext.hall_title }}</div>
								</div>
							</div>
							<!-- TAG-标签列表待对接,tags是随便写的 -->
							<div v-if="(item.tags && item.tags.length) || item.is_annual == 1"
								class="max-w-50vw tags mt-10px h-16px overflow-x-auto text-0px"
								style="white-space: nowrap">
								<div v-if="item.is_annual == 1" class="inline-block mr-4px">
									<u-tag :text="'权益卡套票'" plain shape="circle" size="mini" type="warning"></u-tag>
								</div>
								<div class="inline-block mr-4px" v-for="(el, i) in item.tags" :key="i">
									<u-tag :text="'标签'" plain shape="circle" size="mini" type="warning"></u-tag>
								</div>
							</div>
						</div>
						<!-- 右侧 -->
						<div class="flex items-center">
							<div class="mr-10px flex flex-col justify-end items-end">
								<div class="text-red text-18px">
									<span class="text-12px mr-2px">¥</span>
									<span>{{ item.price }}</span>
								</div>
								<div class="text-10px mt-5px" v-if="item.level_price"
									style="color: #FF8F1F;white-space: nowrap;">
									VIP{{ item.level_price }}元起
								</div>
							</div>
							<!-- 按钮 -->
							<!-- TAG-不确定状态sell与is_sell判定是否正确 -->
							<u-button class="min-w-64px" v-if="item.sell == 1 && item.is_sell == 0" shape="circle"
								size="small" color="linear-gradient(180deg, #FF545C 0%, #FF545C 100%);"
								:text="getBtnStatusText(item)" @click="toSelectSet(item)">
							</u-button>
							<u-button v-else class="min-w-64px" :customStyle="{ color: '#999' }" shape="circle"
								size="small" color="#EEEEEE" :text="getBtnStatusText(item)">
							</u-button>
						</div>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			id: '',
			movieList: [],
			bigItem: null,
			tabIndex: 0,
			isAuto: false, // 是否为自动选座  TAG-这里关于自动选座的逻辑，isAuto字段可能会调整。
			tabsDataList: [],
			currentIndex: 0,
		}
	},
	onLoad(options) {
		this.id = options.id;
		// 确保已经登陆完成
		this.waitLogin().then(() => {
			this.getData();
		});
	},
	methods: {
		getBtnStatusText(item) {
			return item.is_sell == 1 ? '已售空' : item.sell == 1 ? this.isAuto ? '去预约' : '去选座' : '未开售'
		},
		toSelectSet(item) {
			// TAG-这里要判断是哪种场景，以决定是否需要跳转选座，还有可能不需要选座直接跳转下单页
			uni.navigateTo({
				url: '/film-detail/choice-set/index?id=' + item.id
			})
		},
		changeTab(e) {
			this.tabIndex = e.index;
		},
		getData() {
			this.request('film.all').then(res => {
				if (!res.list) {
					return;
				}
				// 注意，虽然轮播前后加了一个空白，但是current还是从movieList的数据开始，也就是这俩空白不算currentIndex，不解
				res.list.push({});
				res.list.unshift({});
				// 如果带了id，则把这条数据放到前面，只能默认放大第一个
				if (this.id) {
					const i = res.list.findIndex(el => el.id === this.id);
					const obj = res.list.splice(i, 1);
					res.list.splice(1, 0, obj[0]);
				}
				this.movieList = res.list;
				this.bigItem = this.movieList[1];
				// 刚开始不会出发change，拿当前选中的获取排期数据
				this.getDataForId(this.bigItem.id);
			})
		},
		// 点击影片
		tapSwiperItem(index) {
			// 前后空白的不能点
			if (index === 0 || index === this.movieList.length - 1) {
				return;
			}
			// 当前选中的不能点
			if (index === this.currentIndex + 1) {
				return;
			}
			this.currentIndex = index - 1;
		},
		// 滑动切换影片
		changeSwiper(e) {
			const i = e.detail.current + 1;
			this.bigItem = this.movieList[i];
			const id = this.movieList[i].id;
			if (id) {
				this.getDataForId(id);
			}
		},
		// 切换影片后获取数据
		getDataForId(id) {
			this.tabsDataList = [];
			this.request("film.lists", { film_id: id, openid: this.userInfo.openid }).then(res => {
				this.isAuto = res.isAuto == 1 ? true : false;
				res.time.forEach(el => {
					el.name = el.title;
					if (el.name.includes('-')) {
						const arr = el.name.split('-');
						el.name = arr[0] + '月' + arr[1] + '日 ' + el.week
					}
				});
				this.tabsDataList = res.time;
			})
		}
	}
};
</script>


<style lang="scss" scoped>
.swiper-item {
	image {
		transition: all 0.2s;
	}

	&.active image {
		width: 31vw !important;
		height: 49vw !important;
	}
}

.tabs-wrap::v-deep .u-tabs__wrapper__nav {
	justify-content: center;
}

.tabs-wrap::v-deep .u-tabs__wrapper__nav__line {
	transform: none !important;
}

.tags .u-tag-wrapper {
	margin-right: 4px !important;
}
</style>