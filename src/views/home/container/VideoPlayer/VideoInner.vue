<template>
    <div class="video-inner">
        <div class="video-inner--video">
            <video ref="video" id="video" :src="videoData?.path" @loadedmetadata="onInit" @timeupdate="onTimeupdate" muted @click="onChangePlayStatus"></video>
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
                    <span class="control-button" title="移除" @click="onReset(false)">
                        <el-icon :size="24">
                            <v-icon icon="mdi:close" />
                        </el-icon>
                    </span>
                </div>
            </div>
        </div>
        <div class="video-inner--tool">
            <slot></slot>
        </div>
        <div class="video-inner--timeline">
            <div id="timeline"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useVideo } from './script/useVideo';
import { userMainStore } from '@/store/modules/userMainStore';
import Timeline from '@/utils/lib/timeline';
import { TimeLimit } from './script/types';


const store = userMainStore();
const videoData = computed(() => store.videoData);
const timeline: any = ref(null);
const timeLimit = ref<TimeLimit>({ start: 0, end: 0 });

const { video, volume, paused, muted, register, onVolumeChange, onVoiceClick, onChangePlayStatus, setVideoTime } = useVideo();

const emit = defineEmits(['onLoad', 'timeupdate', 'reset']);


/** 初始化进度条 */
const onInit = () => {
    register();
    if (timeline.value || !video.value || !videoData.value) return;
    const { duration } = video.value;
    store.UPDATE_VIDEO_DATA({
        ...videoData.value,
        duration
    });
    timeline.value = new (<any>Timeline)('#timeline', {
        totalTime: duration * 1000,
        onClick: (str: string, time: number) => {
            // console.log(time);
            // 注意video是time时间单位是秒
            nextTick(() => {
                setVideoTime(time / 1000);
            })
        },
        onLimitUpdate: (e: TimeLimit & { type: string }) => {
            const { type, ...reset } = e;
            timeLimit.value = reset;
        }
    });
    emit('onLoad');
};

/** 播放进度 */
const onTimeupdate = () => {
    // emit('timeupdate', video.value);
    if (!timeline.value || !video.value) return;
    const { start, end } = timeLimit.value;
    if (video.value.currentTime <= start / 1000 || video.value.currentTime >= end / 1000) {
        video.value.currentTime = start / 1000;
    }
    timeline.value.play(Math.floor(video.value.currentTime * 1000));
};
/** 移除视频 */
const onReset = () => {
    paused.value = true;
    video.value = null;
    // emit('reset');
    if (timeline.value) {
        timeline.value.destory();
        timeline.value = null;
    }
    store.UPDATE_VIDEO_DATA(null);
};
/** 全屏 */
const fullscreen = () => {
    if (video.value) video.value.requestFullscreen();
};

onMounted(() => {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.code.toUpperCase() !== 'SPACE') return;
        if (video.value && videoData.value?.path) {
            paused.value = !paused.value;
        }
    })
});

// watch(() => videoData.value, (val) => {
//     onReset();
//     if (val) store.UPDATE_VIDEO_DATA(val);
// })

defineExpose({
    reset: onReset,
    setVideoTime
})


</script>

<style lang="less">
@import url('./index.less');
</style>
