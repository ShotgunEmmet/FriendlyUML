import { Element } from '../Element.js';
import { ELEMENT_TYPES } from '../../constants/types.js';

export class ActorElement extends Element {
    constructor(id, x, y) {
        super(id, ELEMENT_TYPES.ACTOR, x, y);
    }

    createShape(svgHelper) {
        const g = svgHelper.createGroup();
        
        const head = svgHelper.createCircle(75, 25, 15, this.getColor(), this.getStroke(), 3);
        const body = svgHelper.createLine(75, 40, 75, 65, this.getStroke(), 3);
        const arms = svgHelper.createLine(55, 50, 95, 50, this.getStroke(), 3);
        const leg1 = svgHelper.createLine(75, 65, 60, 85, this.getStroke(), 3);
        const leg2 = svgHelper.createLine(75, 65, 90, 85, this.getStroke(), 3);
        
        g.appendChild(head);
        g.appendChild(body);
        g.appendChild(arms);
        g.appendChild(leg1);
        g.appendChild(leg2);
        
        return g;
    }

    calculateEdgePoint(center, angle) {
        return { x: this.x + 75, y: this.y + 50 };
    }

    getTypePosition() {
        return { x: 75, y: 5 };
    }

    getNamePosition(nameLines) {
        return { x: 75, y: 95 - (nameLines.length - 1) * 6.5 };
    }

    getDeletePosition() {
        return 'translate(100, 50)';
    }

    getFacePosition() {
        return 'translate(72, 21)';
    }

    static fromObject(obj) {
        const element = new ActorElement(obj.id, obj.x, obj.y);
        element.name = obj.name || '';
        if (obj.color) element.color = obj.color;
        if (obj.stroke) element.stroke = obj.stroke;
        return element;
    }
}