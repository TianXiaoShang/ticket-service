<template>
    <div class="wrap">
        <view v-if="detail && detail.id" class="flex h-102px justify-between items-center" @click="toFilmDetail">
            <!-- 左侧封面 -->
            <div class="w-76px min-w-76px h-full mr-10px rounded overflow-hidden relative">
                <image class="w-76px h-full" :src="detail.logo"></image>
                <div v-if="detail.video && showPlay" @click.stop="onPlay"
                    class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8px bg-gray-bg rounded-full opacity-70">
                    <span style="position: relative; left: 1px;">
                        <u-icon name="play-right-fill" size="18px" color="#999"></u-icon>
                    </span>
                </div>
            </div>
            <!-- 影院模式 -->
            <div :key="'Movie'" v-if="isMovieMode"
                class="movie flex-1 text-gray-666 text-12 h-full flex flex-col justify-between">
                <div class="text-14 truncate w-full font-semibold text-gray-333">
                    {{ detail.title }}
                </div>
                <!-- 没有tag的时候，顶下空间没，保持title外全部靠下 -->
                <div class="h-16px" v-if="!detail.type_name"></div>
                <div class="h-17px" v-if="!detail.director"></div>
                <div class="h-17px" v-if="!detail.author"></div>
                <div class="truncate">
                    <span v-if="showPrice">价格：</span>
                    <!-- TAG - TAG-A -价格字段待对接 -->
                    <span v-if="showPrice" class="text-red text-16 font-semibold">¥68</span>
                </div>
                <div class="truncate w-full h-17px" v-if="detail.director">
                    <span>导演：{{ detail.director }}</span>
                </div>
                <div class="truncate w-full h-17px" v-if="detail.author">
                    <span>主演：{{ detail.author }}</span>
                </div>
                <div class="tags h-16px overflow-x-auto text-0px" v-if="detail.type_name" style="white-space: nowrap">
                    <!-- TAG - TAG-A -标签列表待对接，应该是数组不是type_name -->
                    <div class="inline-block mr-4px">
                        <u-tag :text="detail.type_name" plain shape="circle" size="mini" type="warning"></u-tag>
                    </div>
                </div>
            </div>
            <!-- 剧院模式 -->
            <div :key="'Theater'" v-if="!isMovieMode"
                class="theater flex-1 text-12 h-full flex flex-col justify-between">
                <div>
                    <div class="text-14 line-2-ellipsis w-full font-semibold text-gray-333">
                        {{ detail.title }}
                    </div>
                    <div class="tags mt-4px h-16px overflow-x-auto text-0px" style="white-space: nowrap">
                        <!-- TAG - TAG-A -标签列表待对接，应该是数组不是type_name -->
                        <div class="inline-block mr-4px">
                            <u-tag v-if="detail.type_name" :text="detail.type_name" borderColor="#999" color="#333"
                                plain shape="circle" size="mini"></u-tag>
                        </div>
                    </div>
                </div>
                <div class="text-12 text-gray-666 w-full flex justify-between items-end">
                    <div class="flex-1 truncate">
                        <div class="truncate">
                            <!-- TAG - TAG-A -待补充时间段字段 -->
                            2022.10.10-2022.12.12
                        </div>
                        <div class="truncate" v-if="showAddress">
                            {{ detail.address }}
                        </div>
                    </div>
                    <!-- TAG - TAG-A -价格字段待对接 -->
                    <span v-if="showPrice" class="text-red text-16 font-semibold ml-10px">¥68</span>
                </div>
            </div>
            <!-- 购票按钮 -->
            <div v-if="isMovieMode && showBuy" class="height-full min-w-52px flex items-center ml-10px">
                <u-button class="min-w-52px" shape="circle" size="small"
                    color="linear-gradient(180deg, #FF545C 0%, #FF545C 100%);" text="购票"
                    @click.native.stop="toSelectFilm">
                </u-button>
            </div>
        </view>
        <u-skeleton avatarShape="square" avatarSize="102" rows="2" title v-else avatar loading></u-skeleton>
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
        showBuy: {    // 是否需要展示购买按钮，在电影详情页使用这个组件只是作为展示复用
            type: Boolean,
            default: true
        },
        showPrice: {
            type: Boolean,
            default: true
        },
        showPlay: {    // 是否需要预览视频，在电影详情页本身下面有“精彩瞬间”可以播放
            type: Boolean,
            default: true
        },
        canTap: {   // 是否需要点击跳转，在电影详情页使用这个组件是不需要点击跳转的，只是作为展示复用
            type: Boolean,
            default: true
        }
    },
    data() {
        return {}
    },
    methods: {
        onPlay() {
            this.$emit('play', this.detail.video)
        },
        toFilmDetail() {
            if (!this.canTap) return;
            this.toPath('/film-detail/detail/index?id=' + this.detail.id)
        },
        toSelectFilm() {
            if (!this.canTap) return;
            this.toPath('/film-detail/choice-movie/index?id=' + this.detail.id)
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
