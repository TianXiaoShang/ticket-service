<template>
	<view class="page-box p-20px">
		<loading />
		<div class="search-wrap bg-gray-100 flex items-center px-10px py-5px rounded" @click="toSearch">
			<icon class="mr-5px" type="search" size="16" color="#999999" />
			<input placeholder="请输入搜索关键词" disabled placeholder-style="font-size: 13px; color: #999" type="text"
				confirm-type="search" />
		</div>
		<view class="w-full mt-18px rounded overflow-hidden" v-if="bannerList.length">
			<swiper class="w-full rounded swiper" circular :indicator-dots="true" :autoplay="true" :interval="2000"
				:duration="500">
				<swiper-item class="swiper-item rounded h-0px w-full" v-for="(item, index) in bannerList" :key="index"
					@click="toDetail(item)">
					<view class="swiper-item h-full w-full font-0px">
						<image :src="item.img" class="w-full h-full" />
					</view>
				</swiper-item>
			</swiper>
		</view>
		<div class="mt-14px">
			<u-scroll-list class="scroll-list" :indicator="indicator" indicatorColor="#fff0f0"
				indicatorActiveColor="#FF545C">
				<view class="scroll-list-item" v-for="(item, index) in kindList" :key="index">
					<div class="scroll-list-item flex flex-col justify-center items-center">
						<image mode="aspectFit" :src="item.icon" class="w-12vw h-12vw" />
						<span class="mt-5px text-gray-999 text-12">{{ item.title }}</span>
					</div>
				</view>
			</u-scroll-list>
		</div>

		<more-title :title="'热门'"></more-title>

		<more-title :title="'更多推荐'"></more-title>
		<div class="list">
			<movie-item :detail="item" v-for="(item, index) in hotList" :key="index"></movie-item>
		</div>
	</view>
</template>

<script>
import { mapGetters } from "vuex";
import MoreTitle from './components/more-title';
import MovieItem from '@/components/movie-item';
export default {
	data() {
		return {
			title: 'home',
			bannerList: [],
			kindList: [],
			hotList: [],
			indicator: false,
		}
	},
	components: { MoreTitle, MovieItem },
	computed: {
		...mapGetters(["setting"]),
	},
	watch: {
		'$store.state.cinema': {
			handler(val) {
				if (!val) return;
				uni.setNavigationBarTitle({
					title: val.title || '首页'
				});
			},
			deep: true,
			immediate: true
		},
		'$store.state.setting': {
			handler() {
				this.getData();
			},
			deep: true,
			immediate: true
		},
	},
	onShow() {
		// 轮播图
		this.request('slideshow').then(res => {
			this.bannerList = res.slideshow;
		});
		this.getData();
	},
	onLoad() {
	},
	methods: {
		toDetail(item) {
			if (!item.route) {
				return;
			}
			uni.navigateTo({
				url: item.route,
			});
		},
		getData() {
			if (!this.setting) {
				return;
			}
			// 剧院模式 1 / 影院模式 0
			// 分类
			const typesApi = this.setting.is_pattern == 1 ? 'drama.film.types' : 'types';
			this.request(typesApi).then(res => {
				this.kindList = res.types;
				if (this.kindList.length > 4) {
					this.indicator = true;
				}
			})
			// 推荐
			const hotListApi = this.setting.is_pattern === '1' ? 'drama.film.recommend' : 'recommend';
			this.request(hotListApi).then(res => {
				this.hotList = res.films.sort((a, b) => Number(b.sort) - Number(a.sort));
			})
		},
		toSearch() {
			console.log('toSearch')
		}
	}
};
</script>

<style lang="scss" scoped>
.swiper,
.swiper-item {
	overflow: hidden;
	height: calc((100vw - 40px) * 0.298);
}

.scroll-list {
	padding-bottom: 0 !important;
}

.scroll-list-item {
	width: calc((100vw - 40px) / 4);
}
</style>
