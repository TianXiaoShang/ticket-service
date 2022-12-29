<template>
	<view class="page-box p-20px">
		<loading />
		<!-- 页面滚动 -->
		<scroll-view scroll-y="true" @scrolltolower="searchScrollLower" :style="{ height: `calc(100vh - 40px` }">
			<div class="bg-gray-100 flex items-center px-5px rounded-5px" @click="toSearch">
				<u-search :height="33" disabled :bgColor="'#f5f5f5'" placeholder="请输入搜索关键词"
					:showAction="false"></u-search>
			</div>
			<!-- banner -->
			<view class="w-full mt-18px rounded overflow-hidden">
				<swiper class="w-full rounded swiper" v-if="bannerList.length" circular :indicator-dots="true"
					:autoplay="true" :interval="2000" :duration="500">
					<swiper-item class="swiper-item rounded h-0px w-full" v-for="(item, index) in bannerList"
						:key="index" @click="toDetail(item)">
						<view class="swiper-item h-full w-full text-0px">
							<image :src="item.img" class="w-full h-full" />
						</view>
					</swiper-item>
				</swiper>
				<u-skeleton v-else rows="0" titleWidth="100%" titleHeight="100" title :title="true"
					loading></u-skeleton>
			</view>

			<!-- 分类 -->
			<div class="mt-14px">
				<u-scroll-list v-if="kindList.length" class="scroll-list" :indicator="indicator"
					indicatorColor="#fff0f0" indicatorActiveColor="#FF545C">
					<view class="scroll-list-item" v-for="(item, index) in kindList" :key="index"
						@click="toPath(item.home_route)">
						<div class="scroll-list-item flex flex-col justify-center items-center">
							<image mode="aspectFit" :src="item.home_icon" class="w-12vw h-12vw rounded" />
							<span class="mt-5px text-gray-999 text-12">{{ item.home_name }}</span>
						</div>
					</view>
				</u-scroll-list>
				<u-skeleton v-else rows="0" titleWidth="100%" titleHeight="67" title :title="true" loading></u-skeleton>
			</div>

			<more-title :title="'热门'" v-if="recommendList && recommendList.length"></more-title>
			<!-- 热门推荐列表 -->
			<div v-if="recommendList && recommendList.length">
				<div class="mt-16px" v-for="(item, index) in recommendList" :key="index">
					<film-item :detail="item" @play="onPlay"></film-item>
				</div>
			</div>

			<more-title :title="'更多推荐'" v-if="moreRecommendList && moreRecommendList.length"></more-title>
			<!-- 更多推荐列表 -->
			<div v-if="moreRecommendList && moreRecommendList.length">
				<div class="mt-16px" v-for="(item, index) in moreRecommendList" :key="index">
					<film-item :detail="item" @play="onPlay"></film-item>
				</div>
				<div v-if="pageFinish" class="pt-15px text-center text-12px text-gray-999">没有更多啦~</div>
			</div>
		</scroll-view>
		<!-- 视频播放器 -->
		<preview-video :src="playSrc" v-model="showPreviewVideo"></preview-video>
	</view>
</template>

<script>
import MoreTitle from './components/more-title';
import FilmItem from '@/components/film-item';
import PreviewVideo from '@/components/preview-video';
export default {
	data() {
		return {
			title: 'home',
			bannerList: [],
			kindList: [],
			recommendList: [{}, {}, {}, {}, {}],   // 给5个控对象是为了渲染骨架图
			indicator: false,
			getDataFlag: false,
			playSrc: '',
			showPreviewVideo: false,
			moreRecommendList: [{}, {}, {}, {}, {}]
		}
	},
	components: { MoreTitle, FilmItem, PreviewVideo },
	onShow() {
		// 轮播图
		this.request('slideshow').then(res => {
			this.bannerList = res.slideshow;
		});
		// waitInitConfig完成后才onShow更新数据
		if (this.getDataFlag) {
			this.getData();
		}
	},
	onHide() {
		this.showPreviewVideo = false;
		this.playSrc = '';
	},
	onLoad() {
		// 确保基础配置加载完成再获取数据
		this.waitInitConfig().then(() => {
			this.getDataFlag = true;
			uni.setNavigationBarTitle({
				title: this.cinema.title || '首页'
			});
			this.getData();
		})
	},
	methods: {
		onPlay(e) {
			this.showPreviewVideo = true;
			this.playSrc = e;
		},
		toDetail(item) {
			if (!item.route) {
				return;
			}
			this.toPath(item.route)
		},
		// 获取首页数据，依赖基础配置也就是waitInitConfig
		async getData() {
			// 分类
			this.request('set.home').then(res => {
				this.kindList = res.homes;
				if (this.kindList.length > 4) {
					this.indicator = true;
				}
			})
			await this.getRecommend();
			await this.getMoreRecommend();
		},
		getRecommend() {
			return this.request('film.recommend').then(res => {
				const { list } = res;
				const ticket = list.sort((a, b) => Number(b.sort) - Number(a.sort));
				this.recommendList = ticket;
			})
		},
		// 获取推荐
		getMoreRecommend() {
			return this.request('film.all', { page: this.myCurrentPage }).then(res => {
				const { total, list } = res;
				if (!this.moreRecommendList[0] || !this.moreRecommendList[0].id) {
					this.moreRecommendList = [];
				}
				let ticket = list.sort((a, b) => Number(b.sort) - Number(a.sort));
				// 过滤掉已经推荐的
				ticket = ticket.filter(el => !this.recommendList.find(e => e.id === el.id));
				this.moreRecommendList = [...this.moreRecommendList, ...ticket]
				this.myCurrentPage++;
				this.pageFinish = this.moreRecommendList.length >= Number(total);
			})
		},
		searchScrollLower() {
			if (this.pageFinish) {
				return;
			}
			this.getMoreRecommend();
		},
		toSearch() {
			uni.navigateTo({
				url: `/search/search/index`,
				animationType: 'none'
			});
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

.page-box::v-deep .u-scroll-list {
	padding-bottom: 0 !important;
}

.scroll-list-item {
	width: calc((100vw - 40px) / 4);
}
</style>
