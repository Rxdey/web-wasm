import { VideoDetail } from '@/server/model/video';
import { defineStore } from 'pinia'
import Server from '@/server';
import { BASE_URL } from '@/server/api.config';

// 遴选部分改为可选值
type CreateDocumentOptions<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type CustomVideoData = CreateDocumentOptions<VideoDetail, 'id' | 'cover'> & {
    /** 时长 */
    duration?: number;
    /** 文件大小 */
    size?: number;
    /** 文件类型 */
    type?: string;
};

interface MainState {
    loading: boolean;
    videoList?: VideoDetail[]|null;
    videoData?: CustomVideoData|null
}

export const userMainStore = defineStore('main', {
    state: (): MainState => ({
        loading: false,
        videoList: null,
        videoData: null
    }),
    actions: {
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
        },
        UPDATE_VIDEO_DATA(data: CustomVideoData|null) {
            this.videoData = data;
        }
    },
    // getters: {
    //     customVideo(state) {
    //         if (!state.videoList) return null;
    //         return state.videoList?.find(item => item.id === state.activeVideoId);
    //     }
    // }
})