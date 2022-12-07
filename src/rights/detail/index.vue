<template>
    <div class="page-box bg-gray-bg p-20px box-border">
        <loading />
        <!-- tab内容 -->
        <rights-item @success="onSuccess" :showDetailBtn="false" :rightsData="cardData"
            :cardType="curType"></rights-item>

        <template v-if="(filmList && filmList.length)">
            <div class="flex my-20px flex-col items-center justify-center">
                <div class="flex items-center">
                    <image class="h-2px w-61px" src="../static/title-line1@2x.png" />
                    <span class="mx-20px text-14px text-gray-333 font-semibold">本卡适用于以下产品</span>
                    <image class="h-2px w-61px" style="transform: rotateY(180deg);"
                        src="../static/title-line1@2x.png" />
                </div>
                <span class="text-12px text-gray-999 mt-8px">使用产品将不定期更新</span>
            </div>

            <div class="p-20px bg-white rounded">
                <div v-for="(item, index) in filmList" :key="index"
                    :class="{ 'mb-15px': index !== filmList.length - 1 }">
                    <film-item @play="onPlay" :detail="item" :showBuy="false" :showPrice="false"></film-item>
                </div>
            </div>
        </template>

        <div class="flex my-20px flex-col items-center justify-center">
            <div class="flex items-center">
                <image class="h-2px w-61px" src="../static/title-line1@2x.png" />
                <span class="mx-20px text-14px text-gray-333 font-semibold">本卡使用说明</span>
                <image class="h-2px w-61px" style="transform: rotateY(180deg);" src="../static/title-line1@2x.png" />
            </div>
        </div>

        <div class="p-20px bg-white rounded">
            <rich-text :nodes="card_content" v-if="cardData.id"></rich-text>
            <u-skeleton v-else rows="6" title :avatar="false" loading></u-skeleton>
        </div>

        <!-- 视频播放器 -->
        <preview-video :src="playSrc" v-model="showPreviewVideo"></preview-video>
    </div>
</template>

<script>
import { parseRichText } from '@/util';
import RightsItem from '../components/rights-item.vue';
import PreviewVideo from '@/components/preview-video';
import FilmItem from '@/components/film-item';
export default {
    components: { RightsItem, PreviewVideo, FilmItem },
    data() {
        return {
            id: '',
            cardData: {},
            isPaid: false,
            curType: '',
            filmList: new Array(1).fill({}),
            showPreviewVideo: false,
            playSrc: '',
            card_content: ''
        }
    },
    onLoad(options) {
        this.id = options.id;
        if (options.isPaid && options.isPaid == 1) {
            this.isPaid = true;
            this.curType = 'canUse';
        } else {
            this.isPaid = false;
            this.curType = 'canPay';
        }
        if (!this.id) return;
        // 确保已经登录完成
        this.waitLogin().then(() => {
            this.getData();
        });
    },
    methods: {
        onSuccess() {
            this.isPaid = true;
            this.curType = 'canUse';
            this.getData();
        },
        onPlay(e) {
            this.showPreviewVideo = true;
            this.playSrc = e;
        },
        getData() {
            this.getFilm();
            this.request("annual.card.detail", { card_id: this.id })
                .then((res) => {
                    // 如果不是已购买，则只取使用说明
                    if (!this.isPaid) {
                        this.cardData = res.card;
                    }
                    this.card_content = parseRichText(res.card.content);
                })
            // 如果已购买的，则去可用列表找
            if (this.isPaid) {
                this.request("annual.card.data", {
                    status: 1,
                    openid: this.userInfo.openid,
                    card_id: this.id,
                })
                    .then((res) => {
                        res.list.forEach(el => {
                            if (el.card_id === this.id) {
                                this.cardData = el;
                            }
                        })
                    })
            }
        },

        getFilm() {
            this.request("annual.card.film", { card_id: this.id })
                .then((res) => {
                    this.filmList = res.film || [];
                }, () => {
                    this.filmList = [];
                })
        },
    },
    onHide() {
        this.showPreviewVideo = false;
        this.playSrc = '';
    },
};
</script>
