<template>
  <div class="home">
    <div class="menu-wrap"></div>
    <div class="file-wrap" v-drag.right="{ minWidth: 60, maxWidth: 500 }">
      <FileList />
    </div>
    <div class="video-wrap">
      <VideoPlayer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import VideoPlayer from './container/VideoPlayer/VideoPlayer.vue';
import FileList from './container/FileList/FileList.vue';
import { userMainStore } from '@/store/modules/userMainStore';

const store = userMainStore();
onMounted(() => {
  store.GET_VIDEO_LIST({ force: false });
})

</script>

<style lang="less">
@import url('./index.less');
</style>