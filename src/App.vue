<script>
import request from "@/services/request.service";
import { getLocationPos } from '@/util/location';
import { getToken } from '@/util';
import store from '@/store';

export default {
	onLaunch: function () {
		console.log('App Launch');
		// 访问记录
		getToken();
		request("index.visit", {}).then(() => { });
		// 获取影院信息
		request('set').then((res) => {
			store.commit('SET_SETTING', res.set);
		});
		// 获取影院配置信息；
		request('cinema').then((res) => {
			store.commit('SET_CINEMA', res.cinema);
			// 尝试使用户提前授权，在使用位置信息的页面也会通过getLocationPos ｜ getDistance做检查唤起
			getLocationPos().then(res => {
			}, err => { });
		});
	},
	onShow: function () {
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	}
}
</script>

<style>
/*每个页面公共css */
</style>
