<template>
    <div class="file-list" >
        <div class="file-list__title" v-if="isShowName">线上视频列表</div>
        <template v-if="videoList">
            <div class="file-list__item" :class="{ active: activeVideoId === video.id }" v-for="video in videoList" :key="video.id" :title="video.content" @click="selectFile(video)">
            <div class="file-cover">
                <img :src="video.cover" alt="cover">
            </div>
            <div class="file-info" v-if="isShowName">
                <div class="file-name ov-1">{{ video.content }}</div>
            </div>
        </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { VideoDetail } from '@/server/model/video';
import { userMainStore } from '@/store/modules/userMainStore';

const store = userMainStore();

const isShowName = ref(true);

const videoList = computed(() => store.videoList);
const activeVideoId = computed(() => store.videoData?.id);

const selectFile = (video: VideoDetail) => {
    store.UPDATE_VIDEO_DATA(video)
};

onMounted(() => {
    const resizeObserver = new ResizeObserver((e) => {
        isShowName.value = e[0].contentRect.width > 130;
    });
    const el = document.querySelector('.file-wrap');
    if (!el) return;
    resizeObserver.observe(el)
})

</script>

<style lang="less" scoped>
.file-list {
    &__title {
        font-size: 16px;
        padding: 12px 0;
        text-align: center;
        color: #989898;
        border-bottom: 2px solid rgb(54,85,181);
    }
    &__item {
        padding: 8px;
        // background-color: rgb(80,80,80);
        cursor: pointer;
        color: #989898;
        font-size: 14px;
        word-break: break-all;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        display: flex;
        flex-flow: row nowrap;

        &:hover,
        &.active {
            background-color: rgb(80, 80, 80);
        }

        .file-cover {
            width: 80px;
            height: 50px;
            max-width: 100%;
            border-radius: 8px;
            overflow: hidden;
            background-color: #989898;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        .file-info {
            flex: 1;
            min-width: 1px;
            padding: 4px 0 4px 8px;
        }
    }
}
</style>
