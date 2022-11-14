<template>
    <!-- 这里不用page-box, 其中的overflow-x属性影响u-sticky -->
    <div class="w-100vw min-h-100vh py-20px bg-white box-border">
        <!-- 简介 -->
        <div class="px-20px">
            <film-item showDistance :showAddress="false" :detail="filmData" :showBuy="false" :showPrice="false">
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
        <!-- tab -->
        <u-sticky bgColor="#fff" v-if="load">
            <u-tabs :current="tabIndex" :list="tabs" @click="changeTab" lineColor="#FF545C"
                :itemStyle="{ width: '33.333%', 'box-sizing': 'border-box', height: '42px' }"
                :activeStyle="{ color: '#333', fontWeight: 'bold', transform: 'scale(1.05)' }"
                :inactiveStyle="{ color: '#999999', transform: 'scale(1)' }"></u-tabs>
        </u-sticky>
        <div class="mt-20px px-20px box-border" v-else>
            <u-skeleton rows="6" :title="true" loading></u-skeleton>
        </div>
        <!-- 内容 -->
        <div class="px-20px">
            <div v-if="tabIndex === 0" class="pt-10px">
                <rich-text :nodes="filmData.content"></rich-text>
            </div>
            <div v-if="tabIndex === 1">
                <div class="text-gray-333 text-14 font-semibold my-10px" v-if="global.watch_film">观看须知</div>
                <rich-text :nodes="global.watch_film"></rich-text>
                <div class="text-gray-333 text-14 font-semibold my-10px" v-if="global.astrict_explain">限制购票说明</div>
                <rich-text :nodes="global.astrict_explain"></rich-text>
                <div class="text-gray-333 text-14 font-semibold my-10px" v-if="global.refund_explain">退换政策说明</div>
                <rich-text :nodes="global.refund_explain"></rich-text>
                <div class="text-gray-333 text-14 font-semibold my-10px" v-if="global.entrance_explain">入场方式</div>
                <rich-text :nodes="global.entrance_explain"></rich-text>
            </div>
            <div v-if="tabIndex === 2" class="pt-10px">
                <rich-text :nodes="global.watch_film"></rich-text>
            </div>
        </div>
    </div>
</template>

<script>
import FilmItem from '@/components/film-item';
import { getDistance } from '@/util/location';
import { sendCall, openMap, parseRichText } from '@/util';

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
            }]
        }
    },
    computed: {
        load() {
            return this.filmData && this.filmData.id;
        }
    },
    components: { FilmItem },
    onLoad(options) {
        this.id = options.id;
        this.waitInitConfig().then(() => {
            this.getData();
        })
    },
    methods: {
        changeTab(e) {
            this.tabIndex = e.index;
        },
        getData() {
            getDistance().then(res => {
                this.distance = res;
            })
            let api = '';
            if (this.setting.is_pattern == 1) {
                api = 'drama.film';
            } else {
                api = 'film';
            }
            this.request(api, {
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
        },
        onCall() {
            sendCall(this.cinema.mobile)
        },
        onMap() {
            openMap(this.filmData)
        }
    }
};
</script>

<style lang="scss" scoped>

</style>
