/** 下载文件 */
export const downLoadFile = (href = '', fileName = '') => {
    if (!href) return;
    const a = document.createElement('a');
    a.href = href;
    a.download = fileName;
    a.click();
};
/** storage */
export const customStorage = {
    setItem(key: string, val: any) {
        window.localStorage.setItem(key, typeof val === 'object' ? JSON.stringify(val) : val);
    },
    getItem(key: string) {
        let val;
        try {
            val = JSON.parse(window.localStorage.getItem(key) as string);
        } catch (e) {
            val = window.localStorage.getItem(key);
        }
        return val;
    },
    remove(key: string | string[]) {
        if (typeof key === 'string') {
            window.localStorage.removeItem(key);
            return;
        }
        if (Object.prototype.toString.call(key) === '[object Array]') {
            key.forEach((item: string) => {
                window.localStorage.removeItem(item);
            });
        }

    }
};
/** 复制指定文本 */
export const copyToClipboard = (txt = '', cb = () => { }) => {
    const node: HTMLTextAreaElement = document.createElement('textarea');
    node.value = txt;
    document.body.appendChild(node);
    node.select();
    document.execCommand('Copy');
    document.body.removeChild(node);
    cb();
};