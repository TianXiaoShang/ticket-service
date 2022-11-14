<template>
    <div class="wrap">
        <view v-if="detail && detail.id" class="flex h-102px justify-between items-center" @click="toFilmDetail">
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
                    <span v-if="showPrice">价格：</span>
                    <span v-if="showPrice" class="text-red text-16 font-semibold">¥68</span>
                </div>
                <div class="truncate w-full h-17px">
                    <span v-if="detail.director">导演：{{ detail.director }}</span>
                </div>
                <div class="truncate w-full h-17px">
                    <span v-if="detail.author">主演：{{ detail.author }}</span>
                </div>
                <div class="tags h-16px overflow-x-auto text-0px" v-if="detail.type_name" style="white-space: nowrap">
                    <div class="inline-block mr-4px">
                        <u-tag :text="detail.type_name" plain shape="circle" size="mini" type="warning"></u-tag>
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
                            <u-tag v-if="detail.type_name" :text="detail.type_name" borderColor="#999" color="#333"
                                plain shape="circle" size="mini"></u-tag>
                        </div>
                    </div>
                </div>
                <div class="text-12 text-gray-666 w-full flex justify-between items-end">
                    <div class="flex-1 truncate">
                        <div class="truncate">
                            <!-- TAG-待补充时间段字段 -->
                            2022.10.10-2022.12.12
                        </div>
                        <div class="truncate" v-if="showAddress">
                            {{ detail.address }}
                        </div>
                    </div>
                    <span v-if="showPrice" class="text-red text-16 font-semibold ml-10px">¥68</span>
                </div>
            </div>
            <!-- 购票按钮 -->
            <div v-if="viewMode === 'Movie' && showBuy" class="height-full min-w-52px flex items-center ml-10px">
                <u-button class="h-26px min-w-52px" shape="circle" size="small"
                    color="linear-gradient(180deg, #FF545C 0%, #FF545C 100%);" text="购票"
                    @click.native.stop="toSelectFilm">
                </u-button>
            </div>
        </view>
        <u-skeleton avatarShape="square" avatarSize="102" rows="3" title v-else avatar loading></u-skeleton>
    </div>
</template>

<script>
export default {
    name: 'Title',
    props: {
        detail: Object,
        showAddress: {
            type: Boolean,
            default: true
        },
        showBuy: {
            type: Boolean,
            default: true
        },
        showPrice: {
            type: Boolean,
            default: true
        },
    },
    data() {
        return {
            viewMode: 'Movie', // Theater 剧院模式 is_pattern == 1   /    Movie 影院模式 is_pattern == 0
        }
    },
    created() {
        this.waitInitConfig().then(() => {
            if (this.setting.is_pattern == 1) {
                this.viewMode = 'Theater';
            } else {
                this.viewMode = 'Movie';
            }
        })
    },
    methods: {
        toFilmDetail() {
            uni.navigateTo({
                url: '/film-detail/detail/index?id=' + this.detail.id
            })
        },
        toSelectFilm() {
            console.log('toSelectFilm');
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
