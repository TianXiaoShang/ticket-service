
<script>
import request from "@/services/request.service";
import { getLocationPos } from '@/util/location';
import { login } from '@/util/login';
import { getToken, options2mid } from '@/util';
import store from '@/store';

export default {
	onLaunch: function (options) {
		console.log('App Launch');
		// 访问记录
		getToken();
		// 获取绑定上级id；
		const mid = options2mid(options);
		login(mid)
		// 添加访问记录
		request("index.visit", {}).then(() => { });
		// 获取影院信息
		request('set').then((res) => {
			store.commit('SET_SETTING', res.set);
		});
		// 获取影院配置信息；
		request('cinema').then((res) => {
			store.commit('SET_CINEMA', res.cinema);
			// 尝试使用户提前授权，若未授权，在使用位置信息的页面也会通过getLocationPos ｜ getDistance做检查并在失败后唤起授权
			getLocationPos().then(res => {
			}, err => { });
		});
	},
	onShow: function (options) {
		console.log('App Show')
		// 有上级id则重新登陆进行绑定
		const mid = options2mid(options);
		if (mid) {
			login(mid);
		}
	},
	onHide: function () {
		console.log('App Hide')
	},
}
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-ui/index.scss";
</style>
