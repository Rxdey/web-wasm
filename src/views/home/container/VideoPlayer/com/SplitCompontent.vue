<template>
    <div class="video-operate" v-if="videoData && videoData.duration">
        <div class="video-operate--title">平均分割</div>
        <div class="video-operate--body">
            <div class="input-wrap">
                <p class="input-label">分割个数:</p>
                <el-input-number v-model="count" :min="2" :disabled="loading" />
            </div>

            <div class="input-wrap">
                <p class="input-label">总时长:</p>
                <p>{{ secondsToHMS(videoData.duration || 0) }}</p>
            </div>
            <div class="input-wrap">
                <p class="input-label">总大小:</p>
                <p>{{ formatBytes(videoData.size || 0) }}</p>
            </div>

            <div class="input-wrap">
                <p class="input-label">预计结果:</p>
                <el-table :data="tableData" style="width: 100%" :border="true" size="small">
                    <el-table-column type="index" />
                    <el-table-column prop="start" label="开始时间" />
                    <el-table-column prop="end" label="结束时间" />
                    <el-table-column prop="totle" label="总计" />
                    <el-table-column prop="size" label="预估大小" />
                </el-table>
            </div>
        </div>
        <div class="video-operate--footer">
            <div class="btn-group">
                <div class="progress">
                    <el-progress :percentage="progress" :status="status" :stroke-width="10" striped striped-flow v-if="loading"/>
                </div>
                <el-button type="primary" round :loading="loading" @click="onStart">开始转换</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { userMainStore } from '@/store/modules/userMainStore';

const count = ref(2);
const loading = ref(false);
const progress = ref(0);
const status = ref('');

const store = userMainStore();
const videoData = computed(() => store.videoData);
const tableData = computed(() => {
    if (!videoData.value || !videoData.value.duration || !videoData.value.size || !count.value) return [];
    const duration = (videoData.value.duration / count.value);
    const size = Math.floor(videoData.value.size / count.value);
    return [...Array(count.value)].map((item, i) => ({
        start: secondsToHMS((i * duration).toFixed(3)),
        end: secondsToHMS((i * duration + duration).toFixed(3)),
        totle: secondsToHMS((duration).toFixed(3)),
        size: formatBytes(size),
    }))
});

const onStart = () => {
    loading.value = true;
    status.value = ''
    let st = setInterval(() => {
        if (progress.value >= 100) {
            status.value = 'success';
            clearInterval(st);
            setTimeout(() => {
                loading.value = false;
            }, 1000);
            return;
        }
        progress.value += 1;
    }, 30)
}
function formatBytes(bytes: number) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    if (bytes === 0) return '0 Byte';

    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}
const secondsToHMS = (seconds: number | string) => {
    if (typeof seconds === 'string') {
        seconds = parseFloat(seconds);
    }
    let hours: string | number = Math.floor(seconds / 3600);
    let minutes: string | number = Math.floor((seconds % 3600) / 60);
    let remainingSeconds: string | number = Math.floor(seconds % 60);
    // 补零
    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    remainingSeconds = String(remainingSeconds).padStart(2, '0');
    return `${hours}:${minutes}:${remainingSeconds}`;
};

onMounted(() => {
    console.log(videoData.value);
})


</script>

<style lang="less">
.video-operate {
    padding: 24px 12px;
    --el-border-radius-base: 0;
    height: 100%;
    display: flex;
    flex-flow: column;

    &--title {
        font-size: 18px;
        margin-bottom: 40px;
    }

    &--body {
        flex: 1;
        min-height: 1px;
        overflow-y: auto;

        .input-wrap {
            margin-bottom: 16px;
        }

        .input-label {
            margin-bottom: 10px;
            color: rgb(113, 248, 248);
        }
    }

    &--footer {
        padding-top: 32px;
        .btn-group {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            .progress {
                flex: 1;
                min-width: 1px;
            }
        }
    }

    .el-input {
        --el-input-border-radius: 0;
        --el-input-bg-color: var(--color-dark3);
        --el-input-text-color: var(--color-gray1);
        --el-input-border: none;
        --el-input-border-color: transparent;
        --el-input-hover-border: transparent;
        --el-input-focus-border: transparent;
        --el-input-hover-border-color: transparent;
        --el-input-focus-border-color: transparent;
    }
}
</style>
