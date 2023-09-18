<template>
  <div class="ToolMenu">
    <IconBtn title="制作GIF" icon="mdi:gif" @click="createGIF" :disabled="loading || !videoData.url" />
    <IconBtn title="转换格式" icon="mdi:video-switch-outline" :disabled="loading || !videoData.url" @click="conversion" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import IconBtn from '../../components/IconBtn/IconBtn.vue';
import { type VideoFile } from '../../components/Upload/Upload.vue';

const props = withDefaults(defineProps<{
  videoData?: VideoFile,
}>(), {
  videoData: () => ({})
});

const loading = ref(false);

/** gif */
const createGIF = () => {

}
/** 格式转换 */
const conversion = () => {

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
