<template>
	<div class="page-box bg-gray-bg p-20px pt-0 box-border">
		<loading />

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

		<!-- 空状态 -->
		<div v-if="!ticketList || !ticketList.length" class="mt-20px">
			<u-empty mode="order" text="暂无数据" icon="http://cdn.uviewui.com/uview/empty/order.png">
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
			this.ticketList = new Array(8).fill({});
			this.request("ticket").then(res => {
				let ticket = res.ticket;
				const ticket2 = ticket.sort((a, b) => { return b.entrance_time - a.entrance_time });
				this.ticketList = ticket2;
			}, err => {
				this.ticketList = [];
			})
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
