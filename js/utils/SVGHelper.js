export class SVGHelper {
    constructor(isPresentationMode = false) {
        this.isPresentationMode = isPresentationMode;
    }

    create(tag, attrs = {}) {
        const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
        Object.entries(attrs).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        return element;
    }

    createGroup(attrs = {}) {
        return this.create('g', attrs);
    }

    createRect(x, y, width, height, rx, fill, stroke, strokeWidth, strokeDasharray = null) {
        const attrs = { x, y, width, height, rx, fill, stroke, 'stroke-width': strokeWidth };
        if (strokeDasharray) attrs['stroke-dasharray'] = strokeDasharray;
        return this.create('rect', attrs);
    }

    createCircle(cx, cy, r, fill, stroke, strokeWidth) {
        return this.create('circle', { cx, cy, r, fill, stroke, 'stroke-width': strokeWidth });
    }

    createPolygon(points, fill, stroke, strokeWidth) {
        return this.create('polygon', { points, fill, stroke, 'stroke-width': strokeWidth });
    }

    createPath(d, fill, stroke, strokeWidth, strokeDasharray = null) {
        const attrs = { d, fill, stroke, 'stroke-width': strokeWidth };
        if (strokeDasharray) attrs['stroke-dasharray'] = strokeDasharray;
        return this.create('path', attrs);
    }

    createLine(x1, y1, x2, y2, stroke, strokeWidth, strokeDasharray = null) {
        const attrs = { x1, y1, x2, y2, stroke, 'stroke-width': strokeWidth };
        if (strokeDasharray) attrs['stroke-dasharray'] = strokeDasharray;
        return this.create('line', attrs);
    }

    createText(x, y, text, attrs = {}) {
        const element = this.create('text', { x, y, ...attrs });
        element.textContent = text;
        return element;
    }

    createForeignObject(x, y, width, height) {
        return this.create('foreignObject', { x, y, width, height });
    }

    // Geometry calculations
    getRectangleEdgePoint(x, y, width, height, cx, cy, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const abscos = Math.abs(cos);
        const abssin = Math.abs(sin);
        
        let px, py;
        
        if (width * abssin < height * abscos) {
            px = cos > 0 ? x + width : x;
            py = cy + (px - cx) * sin / cos;
        } else {
            py = sin > 0 ? y + height : y;
            px = cx + (py - cy) * cos / sin;
        }
        
        return { x: px, y: py };
    }

    getDiamondEdgePoint(cx, cy, halfWidth, halfHeight, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const t = 1 / (Math.abs(cos) / halfWidth + Math.abs(sin) / halfHeight);
        
        return {
            x: cx + t * cos,
            y: cy + t * sin
        };
    }

    getCircleEdgePoint(cx, cy, radius, angle) {
        return {
            x: cx + Math.cos(angle) * radius,
            y: cy + Math.sin(angle) * radius
        };
    }
}