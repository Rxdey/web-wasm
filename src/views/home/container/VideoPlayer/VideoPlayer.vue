<template>
    <div class="video-player">
        <div class="video-player__container">
            <Upload v-model="videoData" v-if="!videoData.file" />
            <div class="video-player--video" v-else @click="onChangePlayStatus">

                <video ref="video" id="video" :src="videoData.url" @loadedmetadata="onInit" @timeupdate="onTimeupdate" muted></video>

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
                        <span class="control-button" title="移除" @click="onRemove">
                            <el-icon :size="24">
                                <v-icon icon="mdi:close" />
                            </el-icon>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 工具栏 -->
        <div class="video-player__tool">

        </div>
        <div class="video-player__timeline">
            <div id="timeline"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import Timeline from '@/utils/lib/timeline';
import Upload, { type VideoFile } from '../../components/Upload/Upload.vue';
import { useVideo } from './useVideo';

const { video, volume, paused, muted, register, onVolumeChange, onVoiceClick, onChangePlayStatus, setVideoTime } = useVideo();

let timeline: any = null;
const videoData = ref<VideoFile>({})
const loading = ref(false)

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
    timeline.play(Math.floor((<HTMLVideoElement>e.target).currentTime * 1000));
};
const onRemove = () => {
    videoData.value = {};
    timeline.destory();
    timeline = null;
    paused.value = true;
    video.value = null;
};
const onLoading = (e: boolean) => {
    loading.value = e;
}

onMounted(() => {

});

</script>

<style lang="less">
@import url('./index.less');
</style>
