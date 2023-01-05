<template>
    <div>
        <!-- 办卡及储值需知 -->
        <u-popup :show="showReadPopup" :round="20" @close="showReadPopup = false">
            <div class="w-full">
                <div class="text-gray-333 px-20px pt-20px pb-10px flex justify-between items-center border-l-0 border-t-0 border-r-0 
                    border-b-1px border-gray-100 border-solid text-16 font-semibold ">
                    <span> {{ title }} </span>
                    <span>
                        <u-icon name="close" size="18px" @click="showReadPopup = false"></u-icon>
                    </span>
                </div>
                <scroll-view :refresher-enabled="false" @scrolltolower="onPlaceScrolltolower" scroll-y="true"
                    class="page-container box-border" style="height: 45vh; max-height: 350px;"
                    scroll-into-view="content-wrap">
                    <div id="content-wrap" class="p-15px text-14px text-gray-333 leading-5"
                        style="white-space: pre-line;">
                        <rich-text :nodes="content"></rich-text>
                    </div>
                </scroll-view>
                <div class="pt-10px">
                    <u-button shape="circle" size="normal" :customStyle="{ height: '44px', width: '200px' }"
                        color="linear-gradient(180deg, #FF545C 0%, #FF545C 100%);" :disabled="!isPlaceScrolltolower"
                        :text="isPlaceScrolltolower ? '同意' : '请上滑阅读完成后继续'" @click="toPay()">
                    </u-button>
                </div>
            </div>
        </u-popup>
    </div>
</template>


<script>
export default {
    props: {
        content: String,
        title: {
            type: String,
            default: '办卡及储值需知'
        }
    },
    data() {
        return {
            showReadPopup: false,
            isPlaceScrolltolower: false,
        }
    },
    methods: {
        toPay() {
            this.$emit('success');
        },
        onPlaceScrolltolower() {
            this.isPlaceScrolltolower = true;
        },
        showPayPopup() {
            this.showReadPopup = true;
            this.isPlaceScrolltolower = false;
        },
        hidePayPopup() {
            this.showReadPopup = false;
        }
    },
};
</script>


<style lang="scss" scoped>

</style>