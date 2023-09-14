<template>
  <div class="home">
    <div class="menu-wrap"></div>
    <div class="file-wrap" v-drag.right="{ minWidth: 200, maxWidth: 500 }">

    </div>
    <div class="video-wrap">
      <VideoPlayer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import VideoPlayer from './container/VideoPlayer/VideoPlayer.vue';

</script>

<style lang="less">
@import url('./index.less');
</style>
