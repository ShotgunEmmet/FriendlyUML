import { Element } from '../Element.js';
import { ELEMENT_TYPES } from '../../constants/types.js';
import { GeometryHelper } from '../../utils/GeometryHelper.js';

export class ClassElement extends Element {
    constructor(id, x, y) {
        super(id, ELEMENT_TYPES.CLASS, x, y);
    }

    createShape(svgHelper) {
        return svgHelper.createRect(5, 5, 140, 90, 5, this.getColor(), this.getStroke(), 2);
    }

    calculateEdgePoint(center, angle) {
        return GeometryHelper.getRectangleEdgePoint(this.x + 5, this.y + 5, 140, 90, center.x, center.y, angle);
    }
}