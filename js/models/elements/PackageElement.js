import { Element } from '../Element.js';
import { ELEMENT_TYPES } from '../../constants/types.js';
import { GeometryHelper } from '../../utils/GeometryHelper.js';

export class PackageElement extends Element {
    constructor(id, x, y) {
        super(id, ELEMENT_TYPES.PACKAGE, x, y);
        this.width = 200;
        this.height = 150;
    }

    createShape(svgHelper) {
        const g = svgHelper.createGroup();
        
        const rect = svgHelper.createRect(5, 5, this.width, this.height, 5, 
            this.getColor(), this.getStroke(), 2, '10,5');
        g.appendChild(rect);
        
        if (!svgHelper.isPresentationMode) {
            const resizeHandle = svgHelper.create('rect', {
                x: this.width - 5,
                y: this.height - 5,
                width: 10,
                height: 10,
                fill: '#666',
                opacity: 0.5,
                style: 'cursor: nwse-resize',
                class: 'resize-handle'
            });
            g.appendChild(resizeHandle);
        }
        
        return g;
    }

    getCenter() {
        return { x: this.x + this.width / 2 + 5, y: this.y + this.height / 2 + 5 };
    }

    calculateEdgePoint(center, angle) {
        return GeometryHelper.getRectangleEdgePoint(this.x + 5, this.y + 5, this.width, this.height, center.x, center.y, angle);
    }

    getTypePosition() {
        return { x: this.width / 2 + 5, y: 20 };
    }

    getNamePosition(nameLines) {
        return { x: this.width / 2 + 5, y: 40 };
    }

    getDeletePosition() {
        return `translate(${this.width - 10}, 20)`;
    }

    getFacePosition() {
        return ''; // Package has special face handling
    }

    isInside(element) {
        if (element.id === this.id) return false;
        
        const pkgLeft = this.x + 5;
        const pkgTop = this.y + 5;
        const pkgRight = this.x + 5 + this.width;
        const pkgBottom = this.y + 5 + this.height;
        
        let elemLeft = element.x + 5;
        let elemTop = element.y + 5;
        let elemRight = element.x + 145;
        let elemBottom = element.y + 95;
        
        if (element.type === ELEMENT_TYPES.PACKAGE) {
            elemRight = element.x + 5 + (element.width || 200);
            elemBottom = element.y + 5 + (element.height || 150);
        }
        
        return elemLeft >= pkgLeft && elemTop >= pkgTop && 
               elemRight <= pkgRight && elemBottom <= pkgBottom;
    }

    toObject() {
        const obj = super.toObject();
        obj.width = this.width;
        obj.height = this.height;
        return obj;
    }

    static fromObject(obj) {
        const element = new PackageElement(obj.id, obj.x, obj.y);
        element.name = obj.name || '';
        element.width = obj.width || 200;
        element.height = obj.height || 150;
        if (obj.color) element.color = obj.color;
        if (obj.stroke) element.stroke = obj.stroke;
        return element;
    }
}