<template>
    <div class="video-player">
        <div class="video-player__container">
            <div class="video-player--upload" v-if="!videoData.url">
                <Upload v-model="videoData" />
            </div>
            <div class="video-player--video" v-else>
                <video ref="video" id="video" :src="videoData.url" @loadedmetadata="onInit" @timeupdate="onTimeupdate" muted @click="onChangePlayStatus"></video>

                <div class="control" v-if="!!videoData" @click.stop>
                    <div class="control-wrap">
                        <span class="control-button" @click.stop="onChangePlayStatus">
                            <el-icon :size="60">
                                <v-icon icon="mdi:play" v-if="paused" />
                                <v-icon icon="mdi:pause" v-else />
                            </el-icon>
                        </span>
                        <span class="control-button" @click.stop="onVolumeChange">
                            <el-icon :size="24">
                                <v-icon icon="mdi:volume-off" v-if="muted" />
                                <v-icon icon="mdi:volume-high" v-else />
                            </el-icon>
                            <div class="voice-line" @click.stop="onVoiceClick" :style="`--voice-width: ${volume * 100}%`"></div>
                        </span>
                    </div>

                    <div class="control-wrap">
                        <span class="control-button" title="全屏" @click="fullscreen">
                            <el-icon :size="24">
                                <v-icon icon="mdi:fullscreen" />
                            </el-icon>
                        </span>
                        <span class="control-button" title="移除" @click="onRemove(false)">
                            <el-icon :size="24">
                                <v-icon icon="mdi:close" />
                            </el-icon>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 工具栏 -->
        <div class="video-player__tool" v-drag.top="{ maxHeight: 500, minHeight: 180 }">
            <div class="video-player--btnwrap">
                <ToolMenu :videoData="videoData" />
            </div>
            <div class="video-player--timeline">
                <div id="timeline"></div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, watch, onMounted } from 'vue';
import Timeline from '@/utils/lib/timeline';
import Upload, { type VideoFile } from '../../components/Upload/Upload.vue';
import ToolMenu from './ToolMenu.vue';
import { useVideo } from './useVideo';
import { VideoDetail } from '@/server/model/video';
import { userMainStore } from '@/store/modules/userMainStore';

const store = userMainStore();
const { video, volume, paused, muted, register, onVolumeChange, onVoiceClick, onChangePlayStatus, setVideoTime } = useVideo();

let timeline: any = null;
const videoData = ref<VideoFile>({});
const loading = ref(false);
const customVideo = computed(() => store.customVideo);

const onInit = () => {
    register();
    if (timeline || !video.value) return;
    const { duration } = video.value;
    timeline = new (<any>Timeline)('#timeline', {
        totalTime: duration * 1000,
        onClick: (str: string, time: number) => {
            console.log(time);
            // 注意video是time时间单位是秒
            setVideoTime(time / 1000);
        },
        // onLimitUpdate: (e) => {

        // }
    });
};
/** 播放进度 */
const onTimeupdate = (e: Event) => {
    if (!timeline) return;
    timeline.play(Math.floor((<HTMLVideoElement>e.target).currentTime * 1000));
};
/** 移除视频 */
const onRemove = (isCustom = false) => {
    videoData.value = {};
    if (timeline) {
        timeline.destory();
        timeline = null;
    }
    paused.value = true;
    video.value = null;
    if (!isCustom) store.UPDATE_ACTIVE_VIDEO_ID(null);
};

const fullscreen = () => {
    if (video.value) {
        video.value.requestFullscreen();
    }
}
const onLoading = (e: boolean) => {
    loading.value = e;
}

onMounted(() => {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.code.toUpperCase() !== 'SPACE') return;
        if (video.value && videoData.value.url) {
            paused.value = !paused.value;
        }
    })
});

watch(() => customVideo.value, (val) => {
    if (val) {
        onRemove(true);
        nextTick(() => {
            videoData.value.url = val.path;
        })
    }
});

</script>

<style lang="less">
@import url('./index.less');
</style>
