/** 时间格式化 */
export function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const ms = milliseconds % 1000;

  let formattedTime = [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':');

  if (ms > 0) {
    formattedTime += `.${ms.toString().padStart(3, '0')}`;
  }

  return formattedTime;
}
/** 获取传入时间的默认比例 */
export function getDefaultLevel(time, zoom) {
  if (!time) return 0;
  const index = zoom.findIndex(item => (time / 20) <= item);
  if (!index) return zoom.length - 1;
  if (index === 0) return 0;
  return index - 1;
}
/** 获取传入时间的最大比例 */
export function getMaxLevel(time, zoom) {
  if (!time) return 0;
  const index = zoom.findIndex(item => time <= item * 10);
  return index;
}

/** 多层级合并对象 */
export const mergeObjects = (obj1, obj2) => {
  const merged = { ...obj2 };
  for (let key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      if (typeof obj1[key] === 'object' && !Array.isArray(obj1[key]) &&
        typeof obj2[key] === 'object' && !Array.isArray(obj2[key])) {
        merged[key] = mergeObjects(obj1[key], obj2[key]);
      } else {
        merged[key] = obj1[key];
      }
    }
  }

  return merged;
};