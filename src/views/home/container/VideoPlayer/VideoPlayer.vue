<template>
    <div class="video-player">
        <div class="video-player--upload" v-if="!videoData">
            <Upload />
        </div>
        <template v-else>
            <div class="video-player--video">
                <VideoInner ref="videoRef" @onLoad="onVideoLoaded">
                    <ToolMenu @operate="onOperate" />
                </VideoInner>
            </div>
            <div class="video-player--operate">
                <component :is="comActions[ativeComponents]" v-if="ativeComponents"></component>
                <div class="tip" v-else>选择时间轴上方操作按钮</div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, watch, onMounted } from 'vue';
import Upload from '../../components/Upload/Upload.vue';
import ToolMenu from './ToolMenu.vue';
import VideoInner from './VideoInner.vue';
import { userMainStore } from '@/store/modules/userMainStore';
import { OperateType } from './script/types';
import Split from './com/SplitCompontent.vue';

const comActions: Record<string, any> = {
    'split': Split
};
const store = userMainStore();
const videoData = computed(() => store.videoData);
const videoRef = ref<InstanceType<typeof VideoInner> | null>(null);
const ativeComponents = ref<OperateType | null>(null);

const onOperate = (type: OperateType) => {
    if (ativeComponents.value === type) return;
    ativeComponents.value = type;
};
/** 视频加载后取时长，不用单独获取一遍，所以手动触发操作 */
const onVideoLoaded = () => {
    onOperate(OperateType.SPLIT);
}



</script>

<style lang="less">
@import url('./index.less');
</style>
