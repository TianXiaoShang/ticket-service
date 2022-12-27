<template>
    <view class="page-box p-20px">
        <loading />
        <div class="search-wrap bg-gray-100 flex items-center px-15px rounded-5px">
            <u-search :height="33" :bgColor="'#f5f5f5'" placeholder="请输入搜索关键词" clearabled v-model="keyword"
                @custom="onCustom" @search="doSearch()" @change="onChange" :showAction="true" actionText="搜索"
                :animation="true"></u-search>
        </div>

        <template v-if="isSearch">
            <!-- 历史 -->
            <div class="mt-20px" v-if="historyList.length">
                <div class="flex justify-between items-center">
                    <span class="text-gray-333 text-14px font-semibold">搜索历史</span>
                    <u-icon name="trash" @click="clear"></u-icon>
                </div>
                <div>
                    <div class="inline-block mr-10px mt-10px rounded-10px px-15px py-8px bg-gray-bg text-12px text-gray-222"
                        v-for="(item, index) in historyList" :key="index" @click="doSearch(item)">{{ item }}</div>
                </div>
            </div>

            <!-- 推荐 -->
            <div class="mt-20px" v-if="hotList.length">
                <span class="text-gray-333 text-14px font-semibold">热门推荐</span>
                <div>
                    <div class="inline-block mr-10px mt-10px rounded-10px px-15px py-8px bg-gray-bg text-12px text-gray-222"
                        v-for="(item, index) in hotList" :key="index" @click="doSearch(item.title)">{{ item.title }}
                    </div>
                </div>
            </div>

            <!-- 无 - 历史 -->
            <div class="mt-20px" v-if="!historyList.length">
                <div class="flex justify-between items-center">
                    <span class="text-gray-333 text-14px font-semibold">搜索历史</span>
                </div>
                <div>
                    <u-empty mode="search" text="暂无搜索历史" icon="http://cdn.uviewui.com/uview/empty/search.png">
                    </u-empty>
                </div>
            </div>
        </template>

        <!-- 搜索出数据 -->
        <template v-else>
            <div class="mt-10px">
                <u-tabs v-if="kindList && kindList.length" :current="tabIndex" :list="kindList" @click="changeTab"
                    lineColor="#FF545C" :itemStyle="{ height: '42px' }"
                    :activeStyle="{ color: '#333', fontWeight: 'bold', transform: 'scale(1.05)' }"
                    :inactiveStyle="{ color: '#999999', transform: 'scale(1)' }"></u-tabs>
            </div>
            <scroll-view class="box-border pt-16px" scroll-y="true"
                :style="{ height: `calc(100vh - ${40 + 35 + 42 + 10}px)` }" @scrolltolower="searchScrollLower">
                <div v-if="listData.length">
                    <div class="mt-16px" v-for="(item, index) in listData" :key="index"
                        :class="{ 'mt-0px': index === 0 }">
                        <film-item :detail="item" @play="onPlay"></film-item>
                    </div>
                    <div v-if="pageFinish" class="py-15px text-center text-12px text-gray-999">没有更多啦~</div>
                </div>
                <div v-else>
                    <u-empty mode="search" text="没有找到相关内容" icon="http://cdn.uviewui.com/uview/empty/search.png">
                    </u-empty>
                </div>
            </scroll-view>
        </template>

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
            historyList: [],
            hotList: [],
            isSearch: true,
            kindList: [],
            listData: [],
            playSrc: '',
            showPreviewVideo: false
        }
    },
    components: { FilmItem, PreviewVideo },
    onHide() {
        this.showPreviewVideo = false;
        this.playSrc = '';
    },
    onLoad() {
        let curSearchStorageList = uni.getStorageSync('searchHistory');
        this.historyList = curSearchStorageList ? JSON.parse(curSearchStorageList) : [];
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
            // 推荐, 没传分页参数，这里最多就默认推荐20个
            this.request('film.recommend').then(res => {
                this.hotList = res.list.sort((a, b) => Number(b.sort) - Number(a.sort));
            })
            // 分类
            this.request('film.cateList').then(res => {
                this.kindList = res.list ? res.list.map(el => {
                    return { name: el.title, id: el.id, }
                }) : [];
                this.kindList.unshift({ name: '全部' });
            })
        },
        onCustom() {
            this.doSearch();
        },
        onChange() {
            const val = this.keyword.trim();
            if (!val) {
                this.isSearch = true;
            }
        },
        doSearch(item) {
            const val = (item ? item : this.keyword.trim()).trim();
            if (!val) {
                this.keyword = '';
                return;
            }
            this.keyword = val;
            this.isSearch = false;
            this.tabIndex = 0;
            this.myCurrentPage = 1;
            this.listData = new Array(8).fill({});
            this.handlerSearch();
            // 本地缓存
            let curSearchStorageList = uni.getStorageSync('searchHistory');
            curSearchStorageList = curSearchStorageList ? JSON.parse(curSearchStorageList) : [];
            curSearchStorageList.unshift(val);
            // 最多记录20条
            if (curSearchStorageList.length > 20) {
                curSearchStorageList = curSearchStorageList.splice(0, 20)
            }
            curSearchStorageList = Array.from(new Set(curSearchStorageList));
            uni.setStorageSync('searchHistory', JSON.stringify(curSearchStorageList))
            this.historyList = curSearchStorageList;
        },
        clear() {
            uni.clearStorageSync('searchHistory');
            this.historyList = [];
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