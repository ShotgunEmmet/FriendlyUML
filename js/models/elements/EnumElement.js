import { Element } from '../Element.js';
import { ELEMENT_TYPES } from '../../constants/types.js';

export class EnumElement extends Element {
    constructor(id, x, y) {
        super(id, ELEMENT_TYPES.ENUM, x, y);
    }

    createShape(svgHelper) {
        return svgHelper.createPolygon('75,0 130,30 130,75 75,105 20,75 20,30', 
            this.getColor(), this.getStroke(), 2);
    }

    calculateEdgePoint(center, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        // Hexagon vertices
        const vertices = [
            { x: this.x + 75, y: this.y + 0 },
            { x: this.x + 130, y: this.y + 30 },
            { x: this.x + 130, y: this.y + 75 },
            { x: this.x + 75, y: this.y + 105 },
            { x: this.x + 20, y: this.y + 75 },
            { x: this.x + 20, y: this.y + 30 }
        ];
        
        let minDist = Infinity;
        let hexPoint = null;
        
        for (let i = 0; i < 6; i++) {
            const v1 = vertices[i];
            const v2 = vertices[(i + 1) % 6];
            
            const edgeX = v2.x - v1.x;
            const edgeY = v2.y - v1.y;
            const det = -cos * edgeY + sin * edgeX;
            
            if (Math.abs(det) > 0.001) {
                const dx = v1.x - center.x;
                const dy = v1.y - center.y;
                
                const t = (cos * dy - sin * dx) / det;
                const s = (edgeX * dy - edgeY * dx) / det;
                
                if (t >= 0 && t <= 1 && s > 0 && s < minDist) {
                    minDist = s;
                    hexPoint = {
                        x: v1.x + t * edgeX,
                        y: v1.y + t * edgeY
                    };
                }
            }
        }
        
        return hexPoint || center;
    }

    getTypePosition() {
        return { x: 75, y: 22 };
    }

    getDeletePosition() {
        return 'translate(123, 22)';
    }

    getFacePosition() {
        return 'translate(72, -4)';
    }

    static fromObject(obj) {
        const element = new EnumElement(obj.id, obj.x, obj.y);
        element.name = obj.name || '';
        if (obj.color) element.color = obj.color;
        if (obj.stroke) element.stroke = obj.stroke;
        return element;
    }
}