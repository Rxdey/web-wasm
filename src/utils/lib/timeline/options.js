const defaultOptions = {
    /** 渲染根节点 */
    root: '',
    /** 总时长 */
    totalTime: 60000,
    /** 绘制比例每一格时间(毫秒) */
    zoom: [20, 100, 200, 1000, 2000, 6000, 12 * 1000, 120 * 1000, 360 * 1000, 720 * 1000,],
    /** 默认缩放等级(会自动计算) */
    level: 0,
    /** hover */
    hover: false,
    /** 线段配置 */
    lineStyle: {
        offset: 10,
        height: 5,
        longerHeight: 10,
        gap: 20,
        color: '#6c707e'
    },
    /** 文本配置 */
    fontStyle: {
        color: '#6c707e',
        font: 11
    },
    limit: {
        width: 16,
        start: {
            time: 0,
            left: 0,
            color: 'rgba(244, 81, 16, 1)',
        },
        end: {
            time: 0,
            left: 0,
            color: 'rgba(244, 81, 16, 1)',
        },
        ract: {
            height: 10,
            color: 'rgba(0, 0, 0, .5)'
        }
    },
    onClick: (e, t) => { },
    onLimitUpdate: (e) => { }
};

export default defaultOptions;