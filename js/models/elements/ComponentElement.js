import { Element } from '../Element.js';
import { ELEMENT_TYPES } from '../../constants/types.js';
import { GeometryHelper } from '../../utils/GeometryHelper.js';

export class ComponentElement extends Element {
    constructor(id, x, y) {
        super(id, ELEMENT_TYPES.COMPONENT, x, y);
    }

    createShape(svgHelper) {
        const g = svgHelper.createGroup();
        
        const rect = svgHelper.createRect(5, 5, 140, 90, 5, this.getColor(), this.getStroke(), 2);
        const tab1 = svgHelper.createRect(-10, 25, 20, 15, 2, this.getColor(), this.getStroke(), 2);
        const tab2 = svgHelper.createRect(-10, 60, 20, 15, 2, this.getColor(), this.getStroke(), 2);
        
        g.appendChild(rect);
        g.appendChild(tab1);
        g.appendChild(tab2);
        
        return g;
    }

    calculateEdgePoint(center, angle) {
        const normalizedAngle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        
        // Check if coming from left side where tabs are
        if (normalizedAngle > Math.PI / 2 && normalizedAngle < 3 * Math.PI / 2) {
            const tab1Y = this.y + 25;
            const tab2Y = this.y + 60;
            const lineY = center.y + Math.tan(angle) * (this.x - 10 - center.x);
            
            if (lineY >= tab1Y && lineY <= tab1Y + 15) {
                return { x: this.x - 10, y: lineY };
            } else if (lineY >= tab2Y && lineY <= tab2Y + 15) {
                return { x: this.x - 10, y: lineY };
            }
        }
        
        return GeometryHelper.getRectangleEdgePoint(this.x + 5, this.y + 5, 140, 90, center.x, center.y, angle);
    }

    getFacePosition() {
        return 'translate(72, -10)';
    }
}