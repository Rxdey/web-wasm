import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { downLoadFile } from '@/utils';
import { ProgressEvent } from 'node_modules/@ffmpeg/ffmpeg/dist/esm/types';

const ffmpeg = new FFmpeg();

/**
 * 加载ffmpeg
 */
export const loadFFmpeg = async ({ onLog = (message: string) => { }, onProgress = (e: ProgressEvent) => { } }) => {
    // const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/esm';
    const baseURL = `${window.location.origin}/@ffmpeg/core-mt@0.12.3/dist/esm`;
    ffmpeg.on('log', ({ message }) => {
        if (onLog) onLog(message);
    });
    ffmpeg.on('progress', (e) => {
        if (onProgress) onProgress(e);
    });
    try {
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
        });
    } catch (error) {
        console.log(error);
        throw new Error('ffmpeg load error');
    }
};
type ConversionParams = {
    /** 临时文件名 */
    name: string;
    /** 文件地址 */
    path: string;
    /** 输出文件名 */
    outName: string;
    /** 输出文件类型video/mp4 */
    type: string;
};
export const conversionVideo = async ({ name, path, outName, type = 'video/mp4' }: ConversionParams) => {
    try {
        await ffmpeg.writeFile(name, await fetchFile(path));
        await ffmpeg.exec(['-i', name, '-preset', 'ultrafast', outName]);
        await ffmpeg.deleteFile(name);
        const data: any = await ffmpeg.readFile(outName);
        const res = URL.createObjectURL(new Blob([data.buffer], { type }));
        const tempName = name.split('.');
        tempName.splice(tempName.length, 1);
        await ffmpeg.deleteFile(outName);
        const newName = type.replace('video/', '');
        downLoadFile(res, `${tempName.join('.')}.${newName}`);
    } catch (error) {

    }
}

// const onToGif = async () => {
//     if (loading.value) return;
//     setLoading(true);
//     try {
//         await ffmpeg.writeFile(props.videoData.file.name, await fetchFile(props.videoData.url));
//         // ffmpeg -ss 10 -t 3 -i ./469818777-1-208.mp4 -f gif ./gif/output.gif
//         // 注: 参数要传字符串
//         await ffmpeg.exec([
//             '-ss', '00:00:10.100', '-to', '00:00:15.250', '-i',
//             props.videoData.file.name,
//             '-vf', 'fps=15,scale=1280:-1',
//             'output.gif'
//         ]);
//         const data = await ffmpeg.readFile('output.gif');
//         const res = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
//         const name = props.videoData.file.name.split('.');
//         name.splice(name.length, 1);
//         // downLoadFile(res, `${name.join('.')}.jpg`);
//         window.open(res, '_blank');
//     } catch (error) {
//         console.log(error);
//     }
//     setLoading(false);
// };