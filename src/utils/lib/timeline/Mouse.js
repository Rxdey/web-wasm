class MouseMoveEvent {
    mouseEvent = {
        isMouseDown: false,
        /** 点击状态，拖拽时不触发点击 */
        isMouseClick: false,
        isMouseOut: true,
        mouseX: 0,
        offset: 0,
        lastOffset: 0,
        hoverLineX: 0,
        disabled: false
    };
    constructor({
        el,
        mouseDown = (e) => { },
        mouseMove = (e) => { },
        mouseUp = (e) => { },
        mouseOut = null,
        // callback = (e) => { },
        onClick = null,
        type = 'canvas',
        upWithOut = true,
        rerender = true
    }) {
        this.el = el;
        this.mouseDown = mouseDown;
        this.mouseMove = mouseMove;
        this.mouseUp = mouseUp;
        this.mouseOut = mouseOut;
        this.onClick = onClick;
        this.upWithOut = upWithOut;
        this.rerender = rerender;
        const events = [
            {
                canvas: 'mouse:down',
                node: 'mousedown',
                fnc: this.onMouseDown
            },
            {
                canvas: 'mouse:move',
                node: 'mousemove',
                fnc: this.onMouseMove
            },
            {
                canvas: 'mouse:out',
                node: 'mouseout',
                fnc: this.onMouseOut
            },
            {
                canvas: 'mouse:up',
                node: 'mouseup',
                fnc: this.onMouseUp
            },
        ];
        events.forEach(e => {
            this.el.on(e[type], e.fnc.bind(this));
        });
    }
    disabled(val = true) {
        this.mouseEvent.disabled = val;
    }
    /** 鼠标按下 */
    onMouseDown({ e, ...reset }) {
        this.mouseEvent.disabled = false;
        if (this.mouseEvent.disabled) return;
        this.mouseEvent.isMouseDown = true;
        this.mouseEvent.isMouseClick = true;
        this.mouseEvent.mouseX = e.clientX;
        this.mouseEvent.lastOffset = this.mouseEvent.offset + this.mouseEvent.lastOffset;
        // 初始化时重置状态
        this.mouseEvent.offset = 0;
        this.mouseDown(e, this.mouseEvent);
    }
    /** 鼠标拖动时间轴 */
    onMouseMove({ e }) {
        if (this.mouseEvent.disabled) return;
        this.mouseEvent.isMouseOut = false;
        this.mouseEvent.isMouseClick = false;
        if (this.mouseEvent.isMouseDown) {
            this.mouseEvent.offset = e.clientX - this.mouseEvent.mouseX;
            if (this.rerender) this.mouseMove(e, this.mouseEvent);
        }
        this.mouseMove(e, this.mouseEvent);
    }

    /** 鼠标松开 通过isMouseClick判断点击*/
    onMouseUp({ e }) {
        this.mouseUp(e, this.mouseEvent);
        if (this.mouseEvent.disabled) return;
        if (this.mouseEvent.isMouseClick && this.onClick) {
            this.onClick(e.clientX);
        }
        if (this.mouseEvent.disabled) return;
        this.mouseEvent.isMouseOut = true;
        if (!this.mouseEvent.isMouseDown) return;
        this.mouseEvent.isMouseDown = false;
    }
    /** 鼠标离开canvas*/
    onMouseOut({ e }) {
        if (!this.mouseOut) return;
        if (this.mouseEvent.disabled) return;
        this.mouseEvent.isMouseOut = true;
        if (!this.mouseEvent.isMouseDown) return;
        this.mouseEvent.isMouseDown = false;
        this.mouseOut(e, this.mouseEvent);
    }
}
export default MouseMoveEvent;