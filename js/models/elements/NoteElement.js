import { Element } from '../Element.js';
import { ELEMENT_TYPES } from '../../constants/types.js';
import { GeometryHelper } from '../../utils/GeometryHelper.js';

export class NoteElement extends Element {
    constructor(id, x, y) {
        super(id, ELEMENT_TYPES.NOTE, x, y);
    }

    createShape(svgHelper) {
        const g = svgHelper.createGroup();
        const path = svgHelper.createPath(
            'M 5 0 L 125 0 L 145 20 L 145 90 L 5 90 Z M 125 0 L 125 20 L 145 20',
            this.getColor(), this.getStroke(), 2
        );
        g.appendChild(path);
        return g;
    }

    calculateEdgePoint(center, angle) {
        return GeometryHelper.getRectangleEdgePoint(this.x + 5, this.y, 140, 90, center.x, center.y, angle);
    }

    getTypePosition() {
        return { x: 75, y: 13 };
    }

    getNamePosition(nameLines) {
        return { x: 75, y: 50 - (nameLines.length - 1) * 6.5 };
    }

    getDeletePosition() {
        return 'translate(140, 5)';
    }

    getFacePosition() {
        return 'translate(72, -15)';
    }

    static fromObject(obj) {
        const element = new NoteElement(obj.id, obj.x, obj.y);
        element.name = obj.name || '';
        if (obj.color) element.color = obj.color;
        if (obj.stroke) element.stroke = obj.stroke;
        return element;
    }
}