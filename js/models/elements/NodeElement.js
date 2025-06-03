import { Element } from '../Element.js';
import { ELEMENT_TYPES } from '../../constants/types.js';
import { GeometryHelper } from '../../utils/GeometryHelper.js';

export class NodeElement extends Element {
    constructor(id, x, y) {
        super(id, ELEMENT_TYPES.NODE, x, y);
    }

    createShape(svgHelper) {
        const g = svgHelper.createGroup();
        const path = svgHelper.createPath(
            'M 25 30 L 145 30 L 164 10 L 44 10 Z M 145 30 L 145 100 L 164 80 L 164 10 M 25 30 L 25 100 L 145 100 L 145 30 Z',
            this.getColor(), this.getStroke(), 2
        );
        g.appendChild(path);
        return g;
    }

    getCenter() {
        return { x: this.x + 95, y: this.y + 55 };
    }

    calculateEdgePoint(center, angle) {
        return GeometryHelper.getRectangleEdgePoint(this.x + 25, this.y + 10, 140, 90, center.x, center.y, angle);
    }

    getTypePosition() {
        return { x: 92, y: 22 };
    }

    getNamePosition(nameLines) {
        return { x: 85, y: 65 - (nameLines.length - 1) * 6.5 };
    }

    getDeletePosition() {
        return 'translate(165, 10)';
    }

    getFacePosition() {
        return 'translate(95, -5)';
    }
}