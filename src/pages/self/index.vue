<template>
	<view class="page-box">
		<loading />
		<nav-bar v-if="showNav" :title="'个人中心'" :backgroundColor="'transparent'"></nav-bar>

		<div class="absolute left-0 top-0">
			<image src="http://mallsaasphoto.djlcom.com/images/1/sonCinema/id_4/ggZ9GEaQ4kddVWeCW5jW5GoAJvdGGJ.jpg" />
		</div>
		<div class="mt-30px">aaaaaaaaaaa</div>
	</view>
</template>

<script>
import NavBar from '@/components/nav-bar';
export default {
	data() {
		return {
			showNav: false,
		}
	},
	components: { NavBar },
	onShow() { },
	onLoad() {
		this.waitLogin().then(() => {
			// 没有授权用户信息则跳转登录页
			if (!this.checkAuth()) {
				uni.navigateTo({
					url: '/pages/auth/index?noLogin=true'
				})
			}
		})

		// 微信小程序实现顶部透明
		// #ifdef MP-WEIXIN
		this.showNav = true;
		// #endif
	},
	methods: {
		toSearch() {
			console.log('toSearch')
		}
	}
};
</script>

<style lang="scss" scoped>

</style>
