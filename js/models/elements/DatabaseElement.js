import { Element } from '../Element.js';
import { ELEMENT_TYPES } from '../../constants/types.js';
import { GeometryHelper } from '../../utils/GeometryHelper.js';

export class DatabaseElement extends Element {
    constructor(id, x, y) {
        super(id, ELEMENT_TYPES.DATABASE, x, y);
    }

    createShape(svgHelper) {
        const g = svgHelper.createGroup();
        const body = svgHelper.createPath(
            'M 15 10 L 15 80 A 50 10 0 0 0 135 80 L 135 10',
            this.getColor(), this.getStroke(), 2
        );
        const top = svgHelper.create('ellipse', {
            cx: 75,
            cy: 10,
            rx: 60,
            ry: 10,
            fill: this.getColor(),
            stroke: this.getStroke(),
            'stroke-width': 2
        });
        
        g.appendChild(body);
        g.appendChild(top);
        return g;
    }

    calculateEdgePoint(center, angle) {
        return GeometryHelper.getRectangleEdgePoint(this.x + 15, this.y, 120, 90, center.x, center.y, angle);
    }

    getTypePosition() {
        return { x: 75, y: 12 };
    }

    getDeletePosition() {
        return 'translate(135, 5)';
    }

    getFacePosition() {
        return 'translate(72, -14)';
    }

    static fromObject(obj) {
        const element = new DatabaseElement(obj.id, obj.x, obj.y);
        element.name = obj.name || '';
        if (obj.color) element.color = obj.color;
        if (obj.stroke) element.stroke = obj.stroke;
        return element;
    }
}