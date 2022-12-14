<template>
    <div class="page-box bg-gray-bg py-20px box-border">
        <loading />
        <view class="w-full mt-10px pb-105px">
            <!-- 轮播海报图 -->
            <swiper class="w-full image-height" :current="currentIndex" @change="onChange" previous-margin="20px"
                next-margin="20px" v-if="poster.length" :indicator-dots="false" :autoplay="false" :interval="2000"
                :duration="500">
                <swiper-item class="image-height w-full" v-for="(item, index) in poster" :key="index">
                    <view class="image-height w-full px-10px box-border">
                        <div class="relative rounded-8px overflow-hidden text-0px">
                            <image :src="item.thumb" class="image-height image-width" />
                            <div @click="toFull(item)"
                                class="absolute flex-col left-1/2 top-1/2 flex justify-center items-center rounded-full w-85px h-85px transform -translate-x-1/2 -translate-y-1/2"
                                style="background: rgba(0,0,0,0.3)">
                                <u-icon name="search" size="35px" class="-mt-8px" color="#fff"></u-icon>
                                <div class="text-14px text-white mt-2px">点击查看</div>
                            </div>
                        </div>
                    </view>
                </swiper-item>
            </swiper>
            <u-empty v-else mode="data" text="暂无数据" icon="http://cdn.uviewui.com/uview/empty/data.png">
            </u-empty>
        </view>

        <!-- 底部按钮 -->
        <div
            class="fixed z-998 bg-gray-bg bottom-0 pb-20px h-105px flex-col flex items-center justify-center px-20px left-0 w-full box-border">
            <u-button shape="circle" size="normal" :customStyle="{ height: '44px', width: '160px', margin: 0 }"
                color="#FF545C" text="保存图片" @click="saveImageToPhotosAlbum">
            </u-button>
            <div class="mt-15px text-gray-666 text-14px">保存至相册</div>
        </div>
    </div>
</template>

<script>
import { downloadImageFileToAlbum } from '@/util/saveImage'
export default {
    data() {
        return {
            currentIndex: 0,
            poster: [],
        }
    },
    onLoad: function () {
        // 确保已经登录完成
        this.waitLogin().then(() => {
            this.initPoster();
        });
    },
    methods: {
        initPoster() {
            this.request("commission.poster").then((res) => {
                Promise.all(
                    res.poster.map((d) =>
                        this.request("commission.poster.getimage", { id: d.id })
                    )
                ).then((res) => {
                    this.poster = res;
                })
            })
        },
        onChange(e) {
            this.currentIndex = e.detail.current;
        },
        toFull() {
            uni.previewImage({
                urls: this.poster.map(el => el.poster),
                current: this.currentIndex,
            });
        },
        saveImageToPhotosAlbum() {
            downloadImageFileToAlbum(this.poster[this.currentIndex].poster)
        }
    },
};
</script>


<style lang="scss" scpoed>
.image-height {
    height: calc((100vw - 40px - 20px) * 1.76); // 1.76为 高/宽比
}

.image-width {
    width: calc(100vw - 40px - 20px);
}
</style>