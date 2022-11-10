
<script>
import request from "@/services/request.service";
import { getLocationPos } from '@/util/location';
import { login, initCinemaConfig } from '@/util/base';
import { options2mid } from '@/util';

export default {
	onLaunch: function (options) {
		console.log('App Launch');
		// 获取绑定上级id；
		const mid = options2mid(options);
		login(mid).then(() => {
			// 添加访问记录
			request("index.visit", {}).then(() => { });
			// 初始化影院信息及影院配置
			initCinemaConfig().then(res => {
				// 尝试使用户提前授权，若未授权，在使用位置信息的页面也会通过getLocationPos ｜ getDistance做检查并在失败后唤起授权
				getLocationPos().then(res => {
				}, err => { });
			})
		})
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
