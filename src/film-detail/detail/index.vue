<template>
    <view class="page-box relative">
        <film-item></film-item>

        daaaaaaaaaaaaeee
    </view>
</template>

<script>
import FilmItem from '@/components/film-item';

export default {
    data() {
        return {
            id: ''
        }
    },
    components: { FilmItem },
    onLoad(options) {
        this.id = options.id;
        console.log(this.id, 'dddddddddddddd');
    },
    methods: {

    }
};
</script>

<style lang="scss" scoped>

</style>
