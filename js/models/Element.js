import { PASTEL_COLORS, DARK_PASTEL_COLORS } from '../constants/colors.js';

// Base class for all UML elements
export class Element {
    constructor(id, type, x, y) {
        this.id = id;
        this.type = type;
        this.name = '';
        this.x = x;
        this.y = y;
        this.isDragging = false;
        this.isSad = false;
        this.color = null;
        this.stroke = null;
    }

    // Get the color for this element
    getColor() {
        return this.color || PASTEL_COLORS[this.type];
    }

    // Get the stroke color for this element
    getStroke() {
        return this.stroke || DARK_PASTEL_COLORS[this.type];
    }

    // Get center point of element
    getCenter() {
        return { x: this.x + 75, y: this.y + 50 };
    }

    // Get edge point for connections
    getEdgePoint(fromX, fromY, toX, toY) {
        const center = this.getCenter();
        const angle = Math.atan2(toY - fromY, toX - fromX);
        return this.calculateEdgePoint(center, angle);
    }

    // Calculate specific edge point - to be overridden by subclasses
    calculateEdgePoint(center, angle) {
        return center;
    }

    // Create the shape SVG - to be overridden by subclasses
    createShape(svgHelper) {
        throw new Error('createShape must be implemented by subclass');
    }

    // Get face position - to be overridden by subclasses
    getFacePosition() {
        return 'translate(72, -10)';
    }

    // Get text positions for labels
    getTypePosition() {
        return { x: 75, y: 18 };
    }

    getNamePosition(nameLines) {
        return { x: 75, y: 55 - (nameLines.length - 1) * 6.5 };
    }

    // Get delete button position
    getDeletePosition() {
        return 'translate(145, 5)';
    }

    // Serialize to object for saving
    toObject() {
        const obj = {
            id: this.id,
            type: this.type,
            name: this.name,
            x: this.x,
            y: this.y
        };
        if (this.color) obj.color = this.color;
        if (this.stroke) obj.stroke = this.stroke;
        return obj;
    }

    // Create from object
    static fromObject(obj) {
        // Don't use 'this' for static method - need to instantiate the actual subclass
        throw new Error('fromObject must be implemented by subclass');
    }
}