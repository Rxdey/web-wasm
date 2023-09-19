import request from '../request';
import { ResponseType } from '../responseTypes';

export type VideoDetail = {
    content?: string;
    create_date?: Date;
    id: number;
    is_show?: number;
    origin?: string;
    path: string;
    cover: string;
    preview_img?: null;
    title?: string;
    type?: string;
    uid?: number;
    update_date?: Date;
    created?: Date;
}

type VideoListParams = {

}
type VideoListResponse = {
    list: VideoDetail[]
}
export const requestVideoList = (params: VideoListParams): Promise<ResponseType<VideoListResponse>> => request({
    url: '/video/get?nsfw=1',
    method: 'get'
}, params);