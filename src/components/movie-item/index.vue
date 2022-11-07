<template>
    <view class="flex h-102px mt-16px justify-between items-center">
        <!-- 左侧封面 -->
        <div class="w-76px min-w-76px h-full mr-10px rounded overflow-hidden">
            <image class="w-76px h-full" :src="detail.logo"></image>
        </div>
        <!-- 影院模式 -->
        <div :key="'Movie'" v-if="viewMode === 'Movie'"
            class="movie flex-1 text-gray-666 text-12 h-full flex flex-col justify-between">
            <div class="text-14  truncate w-full font-semibold text-gray-333">
                {{ detail.title }}
            </div>
            <div class="truncate">
                <span>价格：</span>
                <span class="text-red text-16 font-semibold">¥68</span>
            </div>
            <div class="truncate w-full">
                导演：{{ detail.director }}
            </div>
            <div class="truncate w-full">
                主演：{{ detail.author }}
            </div>
            <div class="tags h-16px overflow-x-auto text-0px" style="white-space: nowrap">
                <div class="inline-block mr-4px">
                    <u-tag text="标签" plain shape="circle" size="mini" type="warning"></u-tag>
                </div>
            </div>
        </div>
        <!-- 剧院模式 -->
        <div :key="'Theater'" v-if="viewMode === 'Theater'"
            class="theater flex-1 text-12 h-full flex flex-col justify-between">
            <div>
                <div class="text-14 line-2-ellipsis w-full font-semibold text-gray-333">
                    {{ detail.title }}
                </div>
                <div class="tags mt-4px h-16px overflow-x-auto text-0px" style="white-space: nowrap">
                    <div class="inline-block mr-4px">
                        <u-tag text="标签" borderColor="#999" color="#333" plain shape="circle" size="mini"></u-tag>
                    </div>
                </div>
            </div>
            <div class="text-12 text-gray-666">
                <div class="truncate w-full">
                    2022.10.10-2022.12.12
                </div>
                <div class="w-full flex items-center justify-between">
                    <div class="truncate flex-1">
                        地址啊大家快更好大家快更好的撒娇开个会将卡合适的就更好尬哭很快见到过很快就会大师过
                    </div>
                    <span class="text-red text-16 font-semibold ml-10px">¥68</span>
                </div>
            </div>
        </div>
        <!-- 购票按钮 -->
        <div v-if="viewMode === 'Movie'" class="height-full min-w-52px flex items-center ml-10px">
            <u-button class="h-26px min-w-52px" shape="circle" size="small"
                color="linear-gradient(180deg, #FF545C 0%, #FF545C 100%);" text="购票"></u-button>
        </div>
    </view>
</template>

<script>
export default {
    name: 'Title',
    props: {
        detail: Object,
    },
    data() {
        return {
            viewMode: 'Movie', // Theater 剧院模式 is_pattern == 1   /    Movie 影院模式 is_pattern == 0
        }
    },
    watch: {
        '$store.state.setting': {
            handler(val) {
                if (val.is_pattern == 1) {
                    this.viewMode = 'Theater';
                } else {
                    this.viewMode = 'Movie';
                }
            },
            deep: true,
            immediate: true
        },
    },
    methods: {
        toDetail() {
            console.log('toDetail')
        }
    }
};
</script>

<style lang="scss" scoped>
.tags .u-tag-wrapper {
    margin-right: 4px !important;
}

.theater {
    width: calc(100vw - 40px - 86px);
}

.movie {
    width: calc(100vw - 40px - 86px - 62px);
}
</style>
