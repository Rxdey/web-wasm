import { PropType } from '@/types';
import { Directive, DirectiveBinding } from 'vue';
import { camelToKebab, getAttr } from './util';

type DragParams = {
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
}
const validDirections = ['left', 'right', 'top', 'bottom'] as const;

type DragDirection = typeof validDirections[number];

/** 创建拖拽块 */
const createDragField = (el: HTMLElement, posiotn: DragDirection, limit: DragParams) => {
    const defaultStyle = {
        backgroundColor: 'transparent',
        position: 'absolute',
    };
    const positonStyle = {
        left: {
            width: '3px',
            height: '100%',
            left: '0',
            top: '0',
            cursor: 'e-resize'
        },
        right: {
            width: '3px',
            height: '100%',
            right: '0',
            top: '0',
            cursor: 'e-resize'
        },
        top: {
            width: '100%',
            height: '3px',
            left: '0',
            top: '0',
            cursor: 'ns-resize'
        },
        bottom: {
            width: '100%',
            height: '3px',
            left: '0',
            bottom: '0',
            cursor: 'ns-resize'
        }
    }
    const field = document.createElement('div');
    field.className = 'drag-field';
    const styles: Record<string, string> = {
        ...defaultStyle,
        ...positonStyle[posiotn]
    }
    Object.keys(styles).forEach((key) => {
        field.style.setProperty(camelToKebab(key), styles[key])
    });
    field.addEventListener('mousedown', (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const { minWidth, maxWidth, minHeight, maxHeight } = limit;
        const currentXY = {
            x: clientX,
            y: clientY,
            width: el.clientWidth,
            height: el.clientHeight
        };

        document.onmousemove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const dx = clientX - currentXY.x;
            const dy = clientY - currentXY.y;
            const width = currentXY.width + dx;
            const height = currentXY.height - dy;
            if (posiotn === 'left' || posiotn === 'right') {
                if (width <= minWidth || width >= maxWidth) return;
                el.style.width = `${width}px`;
            }
            if (posiotn === 'top' || posiotn === 'bottom') {
                if (height <= minHeight || height >= maxHeight) return;
                el.style.height = `${height}px`;
            }
            return false;
        }
        document.onmouseup = (e: MouseEvent) => {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    });

    el.appendChild(field);
}
/**
 * 拖拽改版大小简单版
 * 注意方向，因为没有改变position
 */
const dragDirective: Directive = {
    mounted(el: HTMLElement, binding: DirectiveBinding<DragParams>) {
        const { modifiers, value } = binding;
        const { minWidth = 100, minHeight = 100, maxWidth = window.innerWidth, maxHeight = window.innerHeight } = value;
        Object.keys(modifiers).forEach((item) => {
            if (!validDirections.includes(item as any)) return;
            createDragField(el, item as any, value);
        });

    },
}
export default dragDirective