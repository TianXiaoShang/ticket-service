<template>
	<view class="page-box p-20px">
		<loading />
		<div class="search-wrap bg-gray-100 flex items-center px-10px py-5px rounded" @click="toSearch">
			<icon class="mr-5px" type="search" size="16" color="#999999" />
			<input placeholder="请输入搜索关键词" disabled placeholder-style="font-size: 13px; color: #999" type="text"
				confirm-type="search" />
		</div>
		<!-- banner -->
		<view class="w-full mt-18px rounded overflow-hidden">
			<swiper class="w-full rounded swiper" v-if="bannerList.length" circular :indicator-dots="true"
				:autoplay="true" :interval="2000" :duration="500">
				<swiper-item class="swiper-item rounded h-0px w-full" v-for="(item, index) in bannerList" :key="index"
					@click="toDetail(item)">
					<view class="swiper-item h-full w-full text-0px">
						<image :src="item.img" class="w-full h-full" />
					</view>
				</swiper-item>
			</swiper>
			<u-skeleton v-else rows="0" titleWidth="100%" titleHeight="100" title :title="true" loading></u-skeleton>
		</view>

		<!-- 分类 -->
		<div class="mt-14px">
			<u-scroll-list v-if="kindList.length" class="scroll-list" :indicator="indicator" indicatorColor="#fff0f0"
				indicatorActiveColor="#FF545C">
				<view class="scroll-list-item" v-for="(item, index) in kindList" :key="index">
					<div class="scroll-list-item flex flex-col justify-center items-center">
						<image mode="aspectFit" :src="item.home_icon" class="w-12vw h-12vw rounded" />
						<span class="mt-5px text-gray-999 text-12">{{ item.home_name }}</span>
					</div>
				</view>
			</u-scroll-list>
			<u-skeleton v-else rows="0" titleWidth="100%" titleHeight="67" title :title="true" loading></u-skeleton>
		</div>

		<more-title :title="'热门'"></more-title>

		<more-title :title="'更多推荐'"></more-title>
		<!-- 推荐列表 -->
		<div class="list">
			<div class="mt-16px" v-for="(item, index) in hotList" :key="index">
				<film-item :detail="item" @play="onPlay"></film-item>
			</div>
		</div>
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
			hotList: [{}, {}, {}, {}, {}],   // 给5个控对象是为了渲染骨架图
			indicator: false,
			getDataFlag: false,
			playSrc: '',
			showPreviewVideo: false
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
			// TAG-跳转到页面后，可能需要解析参数，同分类
			this.toPath(item.route)
		},
		// 获取首页数据，依赖基础配置也就是waitInitConfig
		getData() {
			// 分类
			this.request('set.home').then(res => {
				this.kindList = res.homes;
				if (this.kindList.length > 4) {
					this.indicator = true;
				}
			})
			// 推荐
			// TAG-接口要更换，有添加分页， 推荐影片接口为film.recommend，全部影片接口为film.all
			const hotListApi = this.isMovieMode ? 'recommend' : 'drama.film.recommend';
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

.page-box::v-deep .u-scroll-list {
	padding-bottom: 0 !important;
}

.scroll-list-item {
	width: calc((100vw - 40px) / 4);
}
</style>
