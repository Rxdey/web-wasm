<template>
  <div class="ToolMenu">
    <!-- <IconBtn title="制作GIF" icon="mdi:gif" @click="createGIF" :disabled="btnLoading" /> -->
    <!-- <IconBtn title="转换格式" icon="mdi:video-switch-outline" :disabled="btnLoading" @click="conversion" /> -->
    <IconBtn title="视频拆分" icon="mdi:view-split-vertical" :disabled="btnLoading" @click="onOperate(OperateType.SPLIT)" :size="20"/>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import IconBtn from '../../components/IconBtn/IconBtn.vue';
import { userMainStore } from '@/store/modules/userMainStore';
import { OperateType } from './script/types';


const emit = defineEmits(['operate']);
const store = userMainStore();
const loading = ref(false);
const videoData = computed(() => store.videoData);
const btnLoading = computed(() => loading.value || !videoData.value?.path);

/** gif */
const createGIF = () => {
}
/** 格式转换 */
const conversion = () => {
}
const onOperate = (type: OperateType) => {
  emit('operate', type);
}

</script>

<style lang="less" scoped>
.ToolMenu {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  position: relative;
}
</style>
