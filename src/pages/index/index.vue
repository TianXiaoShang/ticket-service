<template>
	<view class="page-box p-10px">
		<loading />
		<div class="search-wrap bg-gray-100 flex items-center px-10px py-5px rounded" @click="toSearch">
			<icon class="mr-5px" type="search" size="16" color="#999999" />
			<input placeholder="请输入搜索关键词" disabled placeholder-style="font-size: 13px; color: #999" type="text"
				confirm-type="search" />
		</div>
		<view class="w-full">
			<swiper class="swiper" circular :indicator-dots="true" :autoplay="true" :interval="2000" :duration="500">
				<swiper-item>
					<view class="swiper-item uni-bg-red">{{ title }}</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item uni-bg-green">B</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item uni-bg-blue">C</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
import { mapGetters } from "vuex";
export default {
	data() {
		return {
			title: 'home',
			bannerList: [],
			kindList: [],
			hotList: []
		}
	},
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
		getData() {
			if (!this.setting) {
				return;
			}
			// 剧院模式 1 / 影院模式 0
			// 分类
			const typesApi = this.setting.is_pattern == 1 ? 'drama.film.types' : 'types';
			this.request(typesApi).then(res => {
				this.kindList = res.types;
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

<style lang="less" scoped>

</style>
