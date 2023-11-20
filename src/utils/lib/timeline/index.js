import defaultOptions from './options';
import MouseMoveEvent from './Mouse';
import { formatTime, getDefaultLevel, mergeObjects, getMaxLevel } from './util';
import { fabric } from 'fabric';
import arrow from './arrow.png';

const player = {
    /**当前播放位置 */
    currentTime: 0
};

class TimeLine {
    #maxLevel = 0;
    limit = false;
    canvasAttr = {
        offset: 0,
        count: 0,
    };
    constructor(root, options = defaultOptions) {
        if (!root) {
            console.warn('root dom can not be null');
            return;
        }
        this.el = typeof root === 'string' ? document.querySelector(root) : root;
        this.options = mergeObjects(options, defaultOptions);
        this.stage = null;
        this.init();
    }
    init() {
        // 动态监听播放位置
        const objProxy = new Proxy(player, {
            get: (target, key) => {
                return target[key];
            },
            set: (target, key, newValue) => {
                target[key] = newValue;
                this.currentLine.set({
                    left: this.getTimeX(newValue)
                });
                this.currentLine.getObjects()[1].set('text', formatTime(newValue));
                this.currentLine.setCoords();
                this.canvas.requestRenderAll();
                return true;
            }
        });
        this.player = objProxy;

        this.options.level = getDefaultLevel(this.options.totalTime, this.options.zoom);
        this.#maxLevel = getMaxLevel(this.options.totalTime, this.options.zoom);
        const { canvas, ctx } = this.createCanvas(this.el);
        this.canvas = new fabric.Canvas(canvas, {
            width: canvas.width, // 画布宽度
            height: canvas.height, // 画布高度
            selection: false
        });
        // 选框图片的高度
        this.renderHeight = 38 * 2;
        this.options.limit.height = 38;
        this.options.limit.end.time = this.options.totalTime;
        if (this.options.onLimitUpdate) this.options.onLimitUpdate({
            start: this.options.limit.start.time,
            end: this.options.limit.end.time,
            type: 'endChange'
        });
        this.options.limit.end.left = this.getTimeX(this.options.limit.end.time) - this.options.limit.width;
        this.options.limit.start.left = this.getTimeX(this.options.limit.start.time);

        this.mouseEvent = new MouseMoveEvent({
            el: this.canvas,
            mouseMove: (e, mouse) => {
                // if (this.getTimeX(this.options.totalTime) * 2 < this.canvas.width) {
                //     this.mouseEvent.disabled(true);
                // } else {
                //     this.mouseEvent.disabled(false);
                // }
                this.mouse = mouse;
                const { left } = this.canvas._offset;
                this.mouse.hoverLineX = e.clientX - left;
                this.render();
            },
            mouseOut: (e) => { },
            mouseUp: (e, mouse) => {
                // 归位
                const count = Math.floor(mouse.offset / this.options.lineStyle.gap);
                this.mouseEvent.onMouseMove({ e: { clientX: (count * this.options.lineStyle.gap) + mouse.mouseX } });
            }
        });
        this.mouse = this.mouseEvent.mouseEvent;
        this.canvas.on('mouse:wheel', this.onMousewheel.bind(this));
        // 预加载图片
        this.ARROW_IMG = new Image();
        this.ARROW_IMG.src = arrow;
        this.ARROW_IMG.onload = () => {
            this.draw();
        };
        window.addEventListener('resize', () => {
            this.resize();
        });
    }
    resize() {
        this.canvas.setDimensions({
            width: this.el.clientWidth,
            height: this.el.clientHeight
        });
        this.render();
        // this.canvas.renderAll();
    }
    setlimit(data) {
        this.limit = data;
        this.canvas.clear();
        this.draw();
    }
    draw() {
        this.render();
        const nodes = [];
        if (this.limit) {
            this.startBar = this.drawStart();
            this.endBar = this.drawEnd();
            this.rederLimitRact();
            nodes.push(this.startBar, this.endBar);
        }
        this.currentLine = this.drawCurrent();
        nodes.push(this.currentLine);
        this.canvas.add(...nodes);
    }
    // 更新绘制
    render() {
        if (this.background) {
            this.canvas.remove(this.background);
        }
        if (this.totleRact) {
            this.canvas.remove(this.totleRact);
        }
        this.background = this.drawBackground();
        this.totleRact = this.drawTotle();
        this.canvas.add(this.background, this.totleRact);
        this.canvas.sendToBack(this.totleRact);
        this.canvas.sendToBack(this.background);
        if (this.currentLine) {
            this.currentLine.set({
                left: this.getTimeX(this.player.currentTime)
            });
        }
        if (this.startBar && this.endBar) {
            this.startBar.set({
                left: this.getTimeX(this.options.limit.start.time)
            });
            this.endBar.set({
                left: this.getTimeX(this.options.limit.end.time) - this.options.limit.width
            });
            this.startBar.setCoords();
            this.endBar.setCoords();
            this.canvas.requestRenderAll();
            this.rederLimitRact();
        }
    }
    /** 绘制截取起始 */
    drawStart() {
        const { offset } = this.options.lineStyle;
        const ract = new fabric.Image(this.ARROW_IMG, {
            width: this.options.limit.width,
            height: this.options.limit.height,
        });

        const group = new fabric.Group([ract], {
            left: this.options.limit.start.left,
            top: this.background.height + offset,
            hoverCursor: 'pointer',
            lockMovementY: true,
            hasBorders: false,
            hasControls: false,
        });

        group.on('moving', (options) => {
            this.mouseEvent.disabled(true);
            const { pointer } = options;
            if (pointer.x < 0) {
                group.set({
                    left: 0
                });
            }
            if (pointer.x > this.getTimeX(this.options.totalTime) + this.options.limit.width) {
                group.set({
                    left: this.getTimeX(this.options.totalTime)
                });
            }
            if (pointer.x >= this.endBar.left - this.options.lineStyle.gap - this.options.limit.width) {
                group.set({
                    left: this.endBar.left - this.options.lineStyle.gap - this.options.limit.width
                });
            }
            this.options.limit.start.left = this.startBar.left - this.canvasAttr.offset;
            this.options.limit.start.time = this.getCurrentTime(this.startBar.left)[1];
            if (this.options.onLimitUpdate) this.options.onLimitUpdate({
                start: this.options.limit.start.time,
                end: this.options.limit.end.time,
                type: 'startChange'
            });
            this.rederLimitRact();
        });
        return group;
    }
    /** 绘制截取终止 */
    drawEnd() {
        const { offset } = this.options.lineStyle;
        // const ract = new fabric.Rect({
        const ract = new fabric.Image(this.ARROW_IMG, {
            width: this.options.limit.width,
            height: this.options.limit.height,
            // angle: 180,
            selectable: false,
        });
        const group = new fabric.Group([ract], {
            left: this.options.limit.end.left,
            top: this.background.height + offset,
            hoverCursor: 'pointer',
            lockMovementY: true,
            hasBorders: false,
            hasControls: false,
            scaleX: -1,
        });
        group.on('moving', (options) => {
            this.mouseEvent.disabled(true);
            const { pointer } = options;
            if (pointer.x > this.getTimeX(this.options.totalTime) + this.options.limit.width) {
                group.set({
                    left: this.getTimeX(this.options.totalTime) - this.options.limit.width
                });
            }
            if (pointer.x - this.startBar.left - this.options.limit.width <= this.options.lineStyle.gap) {
                group.set({
                    left: this.startBar.left + this.options.lineStyle.gap + this.options.limit.width
                });
            }
            this.options.limit.end.left = this.endBar.left - this.canvasAttr.offset;
            this.options.limit.end.time = this.getCurrentTime(this.endBar.left + this.options.limit.width)[1];
            if (this.options.onLimitUpdate) this.options.onLimitUpdate({
                start: this.options.limit.start.time,
                end: this.options.limit.end.time,
                type: 'endChange'
            });
            this.rederLimitRact();
        });
        return group;
    }
    rederLimitRact() {
        if (this.limitRact) {
            this.canvas.remove(this.limitRact);
        }
        this.limitRact = this.drawLimit();
        this.canvas.add(this.limitRact);
        this.canvas.sendToBack(this.limitRact);
        this.canvas.sendToBack(this.totleRact);
    }
    /** 绘制已选中区间 */
    drawLimit() {
        const { offset } = this.options.lineStyle;
        const ract = new fabric.Rect({
            left: this.getTimeX(this.options.limit.start.time),
            top: this.background.height + offset,
            width: this.endBar.left - this.startBar.left + this.options.limit.width,
            height: this.renderHeight / 2,
            fill: this.options.limit.ract.color,
            selectable: false,
            hoverCursor: 'default',
            evented: false

        });
        ract.on('mousedown', () => {
            this.mouseEvent.disabled(true);
        });
        return ract;
    }
    /** 绘制播放进度 */
    drawCurrent() {
        const width = this.getTimeX(this.player.currentTime);
        const [timeStr] = this.getCurrentTime(width);
        const line = new fabric.Line([
            0, 0,
            0, this.canvas.height
        ], {
            stroke: '#f00', // 笔触颜色
            selectable: false,
            hoverCursor: 'default'
        });
        const text = new fabric.Text(timeStr, {
            // top: this.canvas.height - 24,
            top: this.canvas.height - 18,
            left: 5,
            fontSize: 11,
            fill: '#f00',
            selectable: false
        });
        const group = new fabric.Group([line, text], {
            top: 0,
            left: width,
            selectable: false,
            hoverCursor: 'default',
            evented: false,
            'pointer-events': 'none'
        });
        return group;
    }
    /** 绘制背景  */
    drawBackground() {
        const nodeArr = [];
        const { zoom, level, lineStyle, fontStyle } = this.options;
        const baseLine = new fabric.Line([
            0, 0,
            this.canvas.width, 0
        ], {
            stroke: lineStyle.color, // 笔触颜色
            selectable: false,
            hoverCursor: 'default'
        });
        nodeArr.push(baseLine);
        // 渲染格数(同宽度固定)
        const count = Math.floor(this.canvas.width / lineStyle.gap);
        let offsetCount = 0 - Math.floor((this.mouse.offset + this.mouse.lastOffset) / lineStyle.gap);
        this.canvasAttr.offset = this.mouse.offset + this.mouse.lastOffset;
        this.canvasAttr.count = count;
        // 拖拽到起始点不允许操作
        if (offsetCount <= 0) {
            offsetCount = 0;
            this.mouse.offset = 0;
            this.mouse.lastOffset = 0;
        }
        for (let i = 0; i <= count; i++) {
            const flag = ((i + offsetCount) % 5) === 0;
            const h = flag ? lineStyle.longerHeight : lineStyle.height;
            const x = lineStyle.gap * i;
            const line = new fabric.Line([
                x, 0,
                x, 0 - h
            ], {
                stroke: lineStyle.color, // 笔触颜色
                selectable: false,
                hoverCursor: 'default'
            });
            nodeArr.push(line);
            if (flag) {
                const fontX = lineStyle.gap * i;
                const str = formatTime(((i + offsetCount) * zoom[level]));
                const text = new fabric.Text(str, {
                    top: 0 - (h * 2) - 5,
                    left: fontX,
                    fontSize: fontStyle.font,
                    fill: fontStyle.color,
                    selectable: false,
                    hoverCursor: 'default'
                });
                nodeArr.push(text);
            }
        }
        const group = new fabric.Group(nodeArr, {
            left: 0,
            top: lineStyle.offset,
            selectable: false,
            hoverCursor: 'default'
        });
        return group;

    }
    /** 绘制总长度 */
    drawTotle() {
        const { offset } = this.options.lineStyle;
        const endX = this.getTimeX(this.options.totalTime);
        const ract = new fabric.Rect({
            left: 0,
            top: offset + this.background.height,
            width: endX,
            height: this.renderHeight / 2,
            fill: 'rgba(85, 240, 214, 0.178)',
            selectable: false,
        });
        const text = new fabric.Text(formatTime(this.options.totalTime), {
            top: offset + this.background.height,
            left: endX + 5,
            fontSize: 11,
            fill: 'rgba(119, 245, 69, 1)',
            selectable: false,
        });
        const group = new fabric.Group([ract, text], {
            top: offset + this.background.height,
            left: 0,
            selectable: false,
            hoverCursor: 'default',
            subTargetCheck: true
        });
        ract.on('mousedown', ({ e }) => {
            const { left } = this.canvas._offset;
            this.options.onClick(...this.getCurrentTime(e.clientX - left));
        });
        return group;
    }
    play(time = 0) {
        this.player.currentTime = time;
    }
    createCanvas(el) {
        const { width, height } = el.getBoundingClientRect();
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        el.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        return { canvas, ctx };
    }
    /** 通过时间获取X轴坐标 */
    getTimeX(time = 0) {
        const { offset } = this.canvasAttr;
        const { zoom, level, lineStyle } = this.options;
        const sigleTime = zoom[level];
        const temp = ((time / sigleTime) * lineStyle.gap) - (0 - offset);
        return temp;
    }
    /** 根据偏移量获取时间 */
    getCurrentTime(x = 0) {
        const { offset } = this.canvasAttr;
        const { zoom, level, lineStyle } = this.options;
        // 每一格代表的毫秒数
        const sigleTime = zoom[level];
        // 当前位置的毫秒数
        const current = Math.floor(((x + (0 - offset)) / lineStyle.gap) * sigleTime);
        return [formatTime(current), current];
    }
    /** 鼠标滚轮缩放level */
    onMousewheel({ e }) {
        const scrollCenter = this.getCurrentTime(this.mouse.hoverLineX)[1];
        if (e.wheelDelta > 0) {
            if (this.options.level < (this.#maxLevel || this.options.zoom.length - 1)) {
                this.options.level += 1;
            }
        } else {
            if (this.options.level > 0) {
                this.options.level -= 1;
            }
        }
        this.render();
        // console.log(this.getTimeX(scrollCenter));
        // this.mouseEvent.onMouseMove({ e: { clientX: this.getTimeX(scrollCenter) } });
    }
    destory() {
        this.el.removeChild(document.querySelector('.canvas-container'));
    }
}

export default TimeLine;