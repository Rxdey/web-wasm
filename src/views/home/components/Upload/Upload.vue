<template>
    <div class="upload" @drop="onDrop" @dragleave="onDragleave" @dragenter="onDragenter" @click="onClick">
        {{ props.label }}
        <input type="file" ref="fileInput" accept="video/*" multiple hidden @change="onFileChange">
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useDrag } from './useDrag';
import { ElMessage } from 'element-plus';
import { userMainStore } from '@/store/modules/userMainStore';

const store = userMainStore();

const props = withDefaults(defineProps<{
    label?: string
}>(), {
    label: 'click/drag to upload',
});

const emit = defineEmits(['change']);
const fileInput = ref<HTMLInputElement | null>(null);
/** 校验文件 */
const vaildFile = (files: FileList | []) => {
    const fileList = Array.from(files);
    if (!fileList.length) return;
    if (fileList.every((item: File) => !/^video/.test(item.type))) {
        ElMessage.error('请不要上传非视频文件');
        return;
    }
    store.UPDATE_VIDEO_DATA({
        path: window.URL.createObjectURL(files[0]),
    })
    emit('change', files[0]);
};
const { uploadLoading, onDrop, onDragleave, onDragenter, onFileChange } = useDrag(vaildFile);

const onClick = () => {
    if (uploadLoading.value || !fileInput.value) return;
    fileInput.value.value = '';
    fileInput.value.click();
};


</script>

<style lang="less" scoped>
.upload {
    font-size: 32px;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #989898;
}
</style>
