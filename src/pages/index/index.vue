<template>
	<view class="page-box p-10px">
		<loading :loadingStatus="true" :loadingText="'hahhahhahhahhahhahhahhah'" />
		<div class="search-wrap bg-gray-100 flex items-center px-10px py-5px rounded" @click="toSearch">
			<icon class="mr-5px" type="search" size="16" color="#999999" />
			<input placeholder="请输入搜索关键词" disabled placeholder-style="font-size: 13px; color: #999" type="text"
				confirm-type="search" />
		</div>
		<view class="w-full">
			<swiper class="swiper" circular :indicator-dots="true" :autoplay="true" :interval="2000"
				:duration="500">
				<swiper-item>
					<view class="swiper-item uni-bg-red">{{title}}</view>
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

<script lang="ts">
import { mapGetters } from "vuex";
import Vue from 'vue';

export default Vue.extend({
	data() {
		return {
			title: 'home',
		}
	},
	computed: {
        ...mapGetters(["userInfo"]),
      },
	onLoad() {
		(this as any).request('index').then((res:any) =>{
			console.log(res,getCurrentPages(),'sssssssssssssss')
			
		})
		console.log(mapGetters, 'mapGetters')
	},
	methods: {
		toSearch() {
			console.log('toSearch')
		}
	}
});
</script>

<style lang="less" scoped>

</style>
