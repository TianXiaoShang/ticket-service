<template>
    <div class="page-box bg-gray-bg box-border">
        <loading />
        <div class="bg-red text-14px text-white h-44px flex items-center p-20px box-border">
            申请提交成功，请耐心等待审核结果
        </div>
        <div class="p-20px pb-0">
            <div class="bg-white rounded p-20px steps-wrap">
                <u-steps current="1" direction="column" activeColor="#2ACB95">
                    <u-steps-item title="提交审核信息" :desc="stepsTime">
                    </u-steps-item>
                    <u-steps-item title="待受理" :desc="stepsTime">
                    </u-steps-item>
                    <u-steps-item title="工作人员审核中"></u-steps-item>
                </u-steps>
            </div>
        </div>
        <div class="fixed z-998 bottom-20px h-44px flex items-center justify-center px-20px left-0 w-full box-border">
            <u-button shape="circle" size="normal" :customStyle="{ height: '44px', width: '160px', margin: 0 }"
                color="#FF545C" text="我知道了" @click="back">
            </u-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            stepsTime: ''
        }
    },
    onLoad: function () {
        // 确保已经登录完成
        this.waitLogin().then(() => {
            this.getData();
        });
    },
    methods: {
        async getData() {
            const agentInfo = await this.request("member").then((res) => {
                return res.member
            })
            const { agent_status, is_agent, applyagent_time } = agentInfo;
            this.stepsTime = this.moment(applyagent_time * 1000).format('YYYY-MM-DD HH:mm:ss');
            if (agent_status === "1" && is_agent > 0) {
                uni.redirectTo({
                    url: "/retail/home/index",
                })
                return;
            }
            if (agent_status != "1" && is_agent == "0") {
                uni.redirectTo({
                    url: "/retail/apply/index",
                })
                return;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.steps-wrap::v-deep .u-steps-item__content {
    flex-direction: row !important;
    margin-top: 0 !important;

    .u-text__value--content {
        font-weight: 600 !important
    }

    .u-text__value--main {
        color: #2ACB95 !important;
    }
}

.steps-wrap::v-deep .u-steps-item__line {
    height: 52px !important;
}

.steps-wrap::v-deep .u-steps-item {
    padding-bottom: 20px !important;
}
</style>
