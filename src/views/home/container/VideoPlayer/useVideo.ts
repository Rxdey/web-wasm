import { ref, watch, onMounted } from 'vue';

export const useVideo = () => {
    const paused = ref(true);
    const volume = ref(0);
    const muted = ref(true);
    const video = ref<HTMLVideoElement|null>(null)

    const onChangePlayStatus = () => {
        if (!video.value) return; 
        if (video.value.paused) {
            video.value.play();
        } else {
            video.value.pause();
            paused.value = true;
        }
    };

    const onVolumeChange = () => {
        if (!video.value) return; 
        muted.value = !muted.value;
        video.value.muted = muted.value;
    };

    const onVoiceClick = (e: MouseEvent) => {
        if (!video.value) return; 
        const ract = (<HTMLElement>e.target).getBoundingClientRect();
        const x = e.clientX - ract.left;
        volume.value = (x / (ract.width / 100)) / 100;
        if (video.value.muted) {
            video.value.muted = false;
            muted.value = false;
        }
    };

    /** 跳转进度 */
    const setVideoTime = (time = 0) => {
        if (!video.value) return; 
        video.value.pause();
        video.value.currentTime = time;
        if (!paused.value) video.value.play();
    };
    const onEnded = () => {
        paused.value = true;
    };
    const onPlay = () => {
        paused.value = false;
    };
    const onPause = () => {
        paused.value = true;
    };
    watch(() => volume.value, (val) => {
        if (video.value) {
            video.value.volume = val;
        }
    });

    const register = () => {
        if (!video.value) return; 
        video.value.addEventListener('ended', onEnded);
        video.value.addEventListener('play', onPlay);
        video.value.addEventListener('pause', onPause);
    };
    return {
        video,
        volume,
        paused,
        muted,
        register,
        onVolumeChange,
        onVoiceClick,
        onChangePlayStatus,
        setVideoTime
    };
};