export const camelToKebab = (str = '') => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

export const getAttr = (el: HTMLElement, key: string) => {
  return window.getComputedStyle(el)[key as any];
}