<template>
    <view class="page-box p-20px">
        <loading />
        <div class="search-wrap bg-gray-100 flex items-center px-15px rounded-5px">
            <u-search :height="33" :bgColor="'#f5f5f5'" placeholder="请输入搜索关键词" clearabled v-model="keyword"
                @custom="doSearch()" @search="doSearch()" :showAction="true" actionText="搜索"
                :animation="true"></u-search>
        </div>

        <!-- 列表数据 -->
        <div class="mt-10px">
            <u-tabs v-if="kindList && kindList.length" :current="tabIndex" :list="kindList" @click="changeTab"
                lineColor="#FF545C" :itemStyle="{ height: '42px' }"
                :activeStyle="{ color: '#333', fontWeight: 'bold', transform: 'scale(1.05)' }"
                :inactiveStyle="{ color: '#999999', transform: 'scale(1)' }"></u-tabs>
        </div>
        <scroll-view class="box-border pt-16px" scroll-y="true"
            :style="{ height: `calc(100vh - ${40 + 35 + 42 + 10}px)` }" @scrolltolower="searchScrollLower">
            <div v-if="listData.length">
                <div class="mt-16px" v-for="(item, index) in listData" :key="index" :class="{ 'mt-0px': index === 0 }">
                    <film-item :detail="item" @play="onPlay"></film-item>
                </div>
                <div v-if="pageFinish" class="py-15px text-center text-12px text-gray-999">没有更多啦~</div>
            </div>
            <div v-else>
                <u-empty mode="search" text="没有找到相关内容" icon="http://cdn.uviewui.com/uview/empty/search.png">
                </u-empty>
            </div>
        </scroll-view>

        <!-- 视频播放器 -->
        <preview-video :src="playSrc" v-model="showPreviewVideo"></preview-video>
    </view>
</template>

<script>
import PreviewVideo from '@/components/preview-video';
import FilmItem from '@/components/film-item';

export default {
    data() {
        return {
            keyword: '',
            tabIndex: 0,
            kindList: [],
            listData: [],
            playSrc: '',
            id: '',
            showPreviewVideo: false
        }
    },
    components: { FilmItem, PreviewVideo },
    onHide() {
        this.showPreviewVideo = false;
        this.playSrc = '';
    },
    onLoad(options) {
        if (options && options.id) {
            this.id = options.id;
        }
        // 确保基础配置加载完成再获取数据
        this.waitInitConfig().then(() => {
            this.getData();
        })

    },
    methods: {
        onPlay(e) {
            this.showPreviewVideo = true;
            this.playSrc = e;
        },
        getData() {
            // 分类
            this.request('film.cateList').then(res => {
                this.kindList = res.list ? res.list.map(el => {
                    return { name: el.title, id: el.id, }
                }) : [];
                this.kindList.unshift({ name: '全部' });
            })
            this.handlerSearch();
        },
        doSearch() {
            const val = this.keyword.trim();
            if (!val) {
                this.keyword = '';
                return;
            }
            this.keyword = val;
            this.tabIndex = 0;
            this.myCurrentPage = 1;
            this.listData = new Array(8).fill({});
            this.handlerSearch();
        },
        changeTab(e) {
            this.tabIndex = e.index;
            this.myCurrentPage = 1;
            this.id = this.kindList[this.tabIndex].id;
            this.listData = new Array(8).fill({});
            this.handlerSearch();
        },
        handlerSearch() {
            this.request('film.search', { keyword: this.keyword, page: this.myCurrentPage, cate_id: this.id || '', }).then(res => {
                const { total, list } = res;
                if (!this.listData[0] || !this.listData[0].id) {
                    this.listData = [];
                }
                this.listData = [...this.listData, ...list];
                this.myCurrentPage++;
                this.pageFinish = this.listData.length >= Number(total);
            }, () => {
                this.listData = [];
            })
        },
        searchScrollLower() {
            if (this.pageFinish) {
                return;
            }
            this.handlerSearch();
        },
    }
};
</script>


<style lang="scss" scoped>
.search-wrap::v-deep .u-search__content {
    padding: 0 !important;
}

.search-wrap::v-deep .u-search__action {
    margin-left: 0 !important;
}
</style>