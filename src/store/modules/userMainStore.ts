import { VideoDetail } from '@/server/model/video';
import { defineStore } from 'pinia'
import Server from '@/server';
import { BASE_URL } from '@/server/api.config';

interface MainState {
    loading: boolean;
    videoList?: VideoDetail[] | null;
    activeVideoId?: number | null;
}

export const userMainStore = defineStore('main', {
    state: (): MainState => ({
        loading: false,
        videoList: null,
        activeVideoId: null,
    }),
    actions: {
        UPDATE_ACTIVE_VIDEO_ID(id: number | null) {
            this.activeVideoId = id;
        },
        async GET_VIDEO_LIST({ force = false }) {
            if (this.videoList) return this.videoList;
            const res = await Server.requestVideoList({});
            const { data, success } = res;
            if (!success) return null;
            const list = data?.list.map(item => ({
                ...item,
                cover: item.cover.replace('./download', `${window.location.origin}${BASE_URL}`),
                path: item.path.replace('./download', `${window.location.origin}${BASE_URL}`),
            }));
            this.videoList = list;
            return list;
        }
    },
    getters: {
        customVideo(state) {
            if (!state.videoList) return null;
            return state.videoList?.find(item => item.id === state.activeVideoId);
        }
    }
})