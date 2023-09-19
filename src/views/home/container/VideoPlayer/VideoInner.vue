<template>
    <div class="video-inner">
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
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useVideo } from './useVideo';
import Timeline from '@/utils/lib/timeline';
import { userMainStore } from '@/store/modules/userMainStore';

const store = userMainStore();

let timeline: any = null;
const videoData = computed(() => store.videoData);

const { video, volume, paused, muted, register, onVolumeChange, onVoiceClick, onChangePlayStatus, setVideoTime } = useVideo();

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
}
/** 播放进度 */
const onTimeupdate = (e: Event) => {
    if (!timeline) return;
    timeline.play(Math.floor((<HTMLVideoElement>e.target).currentTime * 1000));
};
/** 移除视频 */
const onReset = (isCustom = false) => {
    if (timeline) {
        timeline.destory();
        timeline = null;
    }
    paused.value = true;
    video.value = null;
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

watch(() => videoData.value, (val) => {
    paused.value = true;
    video.value = null;
    if (timeline) {
        timeline.destory();
        timeline = null;
    }
})
</script>

<style lang="less">
.video-inner {
    position: relative;
    height: 100%;
    background-color: #000;

    #video {
        max-width: 100%;
        height: 100%;
        margin: 0 auto;
        display: block;
        // max-height: 400px;
    }
}

.control {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: flex-end;
    padding: 16px 32px;
    width: 100%;

    .control-wrap {
        display: flex;
        flex-flow: row nowrap;
        align-items: flex-end;
    }

    .control-button {
        cursor: pointer;
        position: relative;
        display: block;

        &+.control-button {
            margin-left: 16px;
        }

        .voice-line {
            --voice-width: 10%;
            position: absolute;
            width: 100px;
            height: 4px;
            background-color: rgba(255, 255, 255, 0.5);
            left: 150%;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;

            &::after {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                width: var(--voice-width);
                height: 100%;
                background-color: #fff;
            }
        }
    }
}
</style>
