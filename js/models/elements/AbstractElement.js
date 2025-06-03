import { Element } from '../Element.js';
import { ELEMENT_TYPES } from '../../constants/types.js';
import { GeometryHelper } from '../../utils/GeometryHelper.js';

export class AbstractElement extends Element {
    constructor(id, x, y) {
        super(id, ELEMENT_TYPES.ABSTRACT, x, y);
    }

    createShape(svgHelper) {
        return svgHelper.createPolygon('75,5 145,50 75,95 5,50', this.getColor(), this.getStroke(), 2);
    }

    calculateEdgePoint(center, angle) {
        return GeometryHelper.getDiamondEdgePoint(center.x, center.y, 70, 45, angle);
    }

    getTypePosition() {
        return { x: 75, y: 30 };
    }

    getDeletePosition() {
        return 'translate(120, 30)';
    }

    getFacePosition() {
        return 'translate(72, 3)';
    }

    static fromObject(obj) {
        const element = new AbstractElement(obj.id, obj.x, obj.y);
        element.name = obj.name || '';
        if (obj.color) element.color = obj.color;
        if (obj.stroke) element.stroke = obj.stroke;
        return element;
    }
}