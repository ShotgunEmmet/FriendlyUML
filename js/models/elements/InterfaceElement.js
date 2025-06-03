import { Element } from '../Element.js';
import { ELEMENT_TYPES } from '../../constants/types.js';
import { GeometryHelper } from '../../utils/GeometryHelper.js';

export class InterfaceElement extends Element {
    constructor(id, x, y) {
        super(id, ELEMENT_TYPES.INTERFACE, x, y);
    }

    createShape(svgHelper) {
        return svgHelper.createCircle(75, 50, 45, this.getColor(), this.getStroke(), 2);
    }

    calculateEdgePoint(center, angle) {
        return GeometryHelper.getCircleEdgePoint(center.x, center.y, 45, angle);
    }

    getTypePosition() {
        return { x: 75, y: 22 };
    }

    getDeletePosition() {
        return 'translate(117, 25)';
    }

    getFacePosition() {
        return 'translate(72, -5)';
    }
}