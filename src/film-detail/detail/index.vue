<template>
    <!-- 这里不用page-box, 其中的overflow-x属性影响u-sticky -->
    <div class="w-100vw min-h-100vh py-20px bg-white box-border">
        <!-- 简介 -->
        <div class="px-20px">
            <film-item :showPlay="false" :canTap="false" :showAddress="false" :detail="filmData" :showBuy="false"
                :showPrice="false">
            </film-item>
        </div>
        <!-- 地址栏 -->
        <div v-if="load" class="px-20px flex justify-between mt-20px pb-20px">
            <div class="flex-1">
                <div class="text-gray-333 text-14 font-semibold">{{ filmData.title || '-' }}</div>
                <div class="text-gray-999 text-14 mt-10px">{{ filmData.address || '-' }}</div>
            </div>
            <div class="ml-10px">
                <div class="flex items-center justify-end">
                    <image class="w-22px h-22px" src="@/static/common/call.png" @click="onCall" />
                    <image class="ml-10px w-22px h-22px" src="@/static/common/go.png" @click="onMap" />
                </div>
                <div class="text-gray-999 text-14 mt-10px text-right" v-if="distance">{{ distance }}</div>
            </div>
        </div>
        <div class="my-15px px-20px box-border" v-else>
            <u-skeleton rows="2" :title="false" loading></u-skeleton>
        </div>

        <!-- 分割 -->
        <div class="h-12px bg-gray-bg"></div>
        <!-- 介绍/精彩瞬间 -->
        <div class="py-10px" v-if="(filmData.moments && filmData.moments.length)">
            <div class="px-20px text-gray-333 text-14 font-semibold">介绍/精彩瞬间</div>
            <div class="overflow-x-auto flex flex-nowrap items-center w-full box-border items-center text-0px mt-12px">
                <!-- 视频 -->
                <div class="inline-block h-78px ml-15px" v-if="filmData.video">
                    <!-- 视频封面 -->
                    <div v-if="!curPlayUrl" class="relative" @click="onPlayCurVideo">
                        <!-- logo比例不对，优先用图片列表第一张图，其次用logo -->
                        <!-- h-78px w-135px 为16:9的常规比例 -->
                        <image class="h-78px w-135px rounded"
                            :src="filmData.moments && filmData.moments[0] ? filmData.moments[0] : filmData.logo" />
                        <div
                            class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8px bg-gray-bg rounded-full opacity-70">
                            <span style="position: relative; left: 1px;">
                                <u-icon name="play-right-fill" size="18px" color="#999"></u-icon>
                            </span>
                        </div>
                    </div>
                    <!-- 视频 -->
                    <video class="rounded" v-else autoplay object-fit="contain" style="height: 78px;width: 135px;"
                        :src="filmData.video" />
                </div>
                <!-- 图片 -->
                <div class="inline-block h-78px ml-15px" v-for="(item, index) in filmData.moments" :key="index">
                    <image class="h-78px rounded" :class="{ 'mr-15px': index === filmData.moments.length - 1 }"
                        mode="heightFix" :src="item" />
                </div>
            </div>
        </div>
        <!-- 骨架 -->
        <div class="p-10px" v-if="!load">
            <u-skeleton rows="0" titleWidth="100%" titleHeight="110" title :title="true" loading></u-skeleton>
        </div>
        <div v-if="filmData.moments && filmData.moments.length" class="h-12px bg-gray-bg"></div>
        <!-- tab -->
        <u-sticky bgColor="#fff" v-if="load">
            <u-tabs :current="tabIndex" :list="tabs" @click="changeTab" lineColor="#FF545C"
                :itemStyle="{ width: '33.333%', 'box-sizing': 'border-box', height: '42px' }"
                :activeStyle="{ color: '#333', fontWeight: 'bold', transform: 'scale(1.05)' }"
                :inactiveStyle="{ color: '#999999', transform: 'scale(1)' }"></u-tabs>
        </u-sticky>
        <div class="mt-20px px-20px box-border" v-else>
            <u-skeleton rows="12" :title="true" loading></u-skeleton>
        </div>
        <!-- 内容 -->
        <div class="px-20px pb-64px">
            <div v-show="tabIndex === 0" class="pt-10px">
                <rich-text :nodes="filmData.content"></rich-text>
            </div>
            <div v-show="tabIndex === 1">
                <div class="text-gray-333 text-14 font-semibold my-10px" v-if="global.watch_film">观看须知</div>
                <rich-text :nodes="global.watch_film"></rich-text>
                <div class="text-gray-333 text-14 font-semibold my-10px" v-if="global.astrict_explain">限制购票说明</div>
                <rich-text :nodes="global.astrict_explain"></rich-text>
                <div class="text-gray-333 text-14 font-semibold my-10px" v-if="global.refund_explain">退换政策说明</div>
                <rich-text :nodes="global.refund_explain"></rich-text>
                <div class="text-gray-333 text-14 font-semibold my-10px" v-if="global.entrance_explain">入场方式</div>
                <rich-text :nodes="global.entrance_explain"></rich-text>
            </div>
            <div v-show="tabIndex === 2" class="pt-10px">
                <scroll-view :style="{ height: 'calc(100vh - 64px)' }" scroll-y="true" v-if="hotList && hotList.length"
                    @scrolltolower="searchScrollLower">
                    <div :class="{ 'mb-16px': index !== hotList.length - 1 }" v-for="(item, index) in hotList"
                        :key="index">
                        <film-item :detail="item" @play="onPlay"></film-item>
                    </div>
                    <div v-if="pageFinish" class="py-15px text-center text-12px text-gray-999">没有更多啦~</div>
                </scroll-view>
                <u-empty v-else mode="data" text="暂无推荐内容" icon="http://cdn.uviewui.com/uview/empty/data.png">
                </u-empty>
            </div>
        </div>
        <!-- 选座按钮 -->
        <div class="fixed bottom-0 left-0 w-full p-20px box-border bg-white">
            <u-button shape="circle" size="normal" :customStyle="{ height: '44px', width: '200px' }"
                color="linear-gradient(180deg, #FF545C 0%, #FF545C 100%);" text="选座预约"
                @click.native.stop="toSelectFilm">
            </u-button>
        </div>
        <!-- 视频播放器 -->
        <preview-video :src="playSrc" v-model="showPreviewVideo"></preview-video>
    </div>
</template>

<script>
import FilmItem from '@/components/film-item';
import { getDistance } from '@/util/location';
import { sendCall, openMap, parseRichText } from '@/util';
import PreviewVideo from '@/components/preview-video';

export default {
    data() {
        return {
            tabIndex: 0,
            id: '',
            filmData: {},
            global: {},
            distance: 0,
            tabs: [{
                name: '详情',
            }, {
                name: '须知',
            }, {
                name: '推荐'
            }],
            hotList: [],
            curPlayUrl: '',
            playSrc: '',
            showPreviewVideo: false,
        }
    },
    computed: {
        load() {
            return this.filmData && this.filmData.id;
        }
    },
    components: { FilmItem, PreviewVideo },
    onLoad(options) {
        this.id = options.id;
        this.waitInitConfig().then(() => {
            this.getData();
        })
    },
    onHide() {
        this.showPreviewVideo = false;
        this.playSrc = '';
        this.curPlayUrl = '';
    },
    methods: {
        toSelectFilm() {
            if (this.isMovieMode) {
                this.toPath('/film-detail/choice-movie/index?id=' + this.id)
            } else {
                this.toPath('/film-detail/choice-theater/index?id=' + this.id)
            }
        },
        onPlay(e) {
            this.showPreviewVideo = true;
            this.playSrc = e;
            // 播放弹出视频的时候关闭介绍视频
            this.curPlayUrl = '';
        },
        onPlayCurVideo() {
            this.curPlayUrl = this.filmData.video;
        },
        changeTab(e) {
            this.tabIndex = e.index;
        },
        getData() {
            // 获取距离 
            getDistance().then(res => {
                this.distance = res;
            })
            // 获取详情
            this.request('film', {
                film_id: this.id
            }).then(res => {
                this.filmData = res.film || {};
                this.global = res.global || {};
                this.filmData.content = this.filmData.content ? parseRichText(this.filmData.content) : '';
                this.global.watch_film = this.global.watch_film ? parseRichText(this.global.watch_film) : '';
                this.global.astrict_explain = this.global.astrict_explain ? parseRichText(this.global.astrict_explain) : '';
                this.global.refund_explain = this.global.refund_explain ? parseRichText(this.global.refund_explain) : '';
                this.global.entrance_explain = this.global.entrance_explain ? parseRichText(this.global.entrance_explain) : '';
            })
            this.getRecommend();

        },
        getRecommend() {
            // 获取推荐
            this.request('film.recommend', { page: this.myCurrentPage }).then(res => {
                const { total, list } = res;
                const ticket = list.sort((a, b) => Number(b.sort) - Number(a.sort));
                this.hotList = [...this.hotList, ...ticket];
                this.myCurrentPage++;
                this.pageFinish = this.hotList.length >= Number(total);
            })
        },
        onCall() {
            sendCall(this.cinema.mobile)
        },
        onMap() {
            openMap(this.filmData)
        },
        searchScrollLower() {
            if (this.pageFinish) {
                return;
            }
            this.getRecommend();
        },
    }
};
</script>

<style lang="scss" scoped>

</style>
