<template>
    <div class="wrap">
        <view v-if="detail && detail.id" class="flex flex-col w-98px justify-center items-center" @click="toFilmDetail">
            <!-- 封面 -->
            <div class="w-98px min-w-98px h-132px rounded overflow-hidden relative">
                <image class="w-98px h-132px" :src="detail.logo"></image>
                <div v-if="detail.video && showPlay" @click.stop="onPlay"
                    class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8px bg-gray-bg rounded-full opacity-70">
                    <span style="position: relative; left: 1px;">
                        <u-icon name="play-right-fill" size="18px" color="#999"></u-icon>
                    </span>
                </div>
            </div>
            <div class="w-full text-gray-666 text-12 mt-8px">
                <div class="text-14px line-2-ellipsis w-full h-40px font-semibold text-gray-333"
                    style="line-height: 20px">
                    {{ detail.title }}
                </div>
                <div class="mt-4px" v-if="detail.price">
                    <span class="text-red text-14px">¥</span>
                    <span class="text-red text-16px font-semibold mx-4px">{{ detail.price }}</span>
                    <span>起</span>
                </div>
            </div>
        </view>
        <u-skeleton rows="2" titleHeight="98px" titleWidth="100%" title v-else loading></u-skeleton>
    </div>
</template>

<script>
export default {
    name: 'Title',
    props: {
        detail: Object,
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
</style>
