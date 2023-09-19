<template>
    <div class="video-player">
        <div class="video-player__container">
            <div class="video-player--upload" v-if="!videoData">
                <Upload />
            </div>
            <div class="video-player--video" v-else>
                <VideoInner ref="videoRef" />
            </div>
        </div>
        <!-- 工具栏 -->
        <div class="video-player__tool" v-drag.top="{ maxHeight: 500, minHeight: 180 }">
            <div class="video-player--btnwrap">
                <ToolMenu />
            </div>
            <div class="video-player--timeline">
                <div id="timeline"></div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, watch, onMounted } from 'vue';
import Upload from '../../components/Upload/Upload.vue';
import ToolMenu from './ToolMenu.vue';
import VideoInner from './VideoInner.vue';
import { userMainStore } from '@/store/modules/userMainStore';

const store = userMainStore();
const videoData = computed(() => store.videoData);

</script>

<style lang="less">
@import url('./index.less');
</style>
