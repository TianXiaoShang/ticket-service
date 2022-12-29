<template>
	<div class="page-box bg-gray-bg p-20px pt-0 box-border">
		<loading />
		<scroll-view v-if="ticketList.length" :style="{ height: 'calc(100vh - 20px)' }" scroll-y="true"
			@scrolltolower="searchScrollLower">
			<!-- 票夹列表 -->
			<div @click="toSelect(item)" class="bg-white rounded box-border mt-20px p-20px relative overflow-hidden"
				v-for="(item, index) in ticketList" :key="index">
				<template v-if="item.id">
					<div class="text-14 font-semibold">{{ item.film_title }}</div>
					<div class="text-12px text-gray-999 my-10px font-normal flex justify-between items-center">
						<!-- TAG - 独立 -->
						<span>{{ item.cinema_title }}</span>
						<span class="text-red text-14">{{ moment(item.entrance_time *
								1000).format('YYYY-MM-DD HH:mm')
						}}</span>
					</div>

					<div class="text-14 font-normal flex justify-between items-center">
						<span class="text-gray-333">{{ item.hall_title }}</span>
						<span class="text-12px text-blue">查看详情</span>
					</div>

					<!-- 状态 -->
					<div class="absolute right-0 top-0 text-12px px-8px py-5px"
						:style="{ 'border-radius': '0 10px 0 10px', background: statusBgColor[item.status], color: statusTextColor[item.status] }">
						{{ statusSign[item.status] }}
					</div>
				</template>
				<u-skeleton v-else rows="2" title :avatar="false" loading></u-skeleton>
			</div>
			<div v-if="pageFinish" class="py-15px text-center text-12px text-gray-999">没有更多啦~</div>
		</scroll-view>
		<!-- 空状态 -->
		<div v-if="!ticketList || !ticketList.length" class="mt-20px">
			<u-empty mode="order" text="你的票夹空空哒" icon="http://cdn.uviewui.com/uview/empty/order.png">
			</u-empty>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			ticketList: new Array(8).fill({}),
			statusSign: ['', '待观影', '已取票', '已结束', '已退款'],
			statusBgColor: ['', '#FF545C', '#EEEEEE', '#EEEEEE', '#EEEEEE'],
			statusTextColor: ['', '#fff', '#333', '#333', '#333'],
		}
	},
	methods: {
		toSelect(item) {
			this.toPath('/order/ticket/index?id=' + item.id)
		},
		getData() {
			this.request("ticket.lists", {
				page: this.myCurrentPage,
			}).then(res => {
				const { total, list } = res;
				const ticket = list.sort((a, b) => { return b.entrance_time - a.entrance_time });
				if (this.ticketList[0] && !this.ticketList[0].id) {
					this.ticketList = [];
				}
				this.ticketList = [...this.ticketList, ...ticket];
				this.myCurrentPage++;
				this.pageFinish = this.ticketList.length >= Number(total);
			}, () => {
				this.ticketList = [];
			})
		},
		searchScrollLower() {
			if (this.pageFinish) {
				return;
			}
			this.getData();
		},
	},
	onShow: function () {
		// 确保已经登录完成
		this.waitLogin().then(() => {
			this.getData();
		});
	},
};
</script>
