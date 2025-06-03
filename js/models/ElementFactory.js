import { ELEMENT_TYPES } from '../constants/types.js';
import { ClassElement } from './elements/ClassElement.js';
import { InterfaceElement } from './elements/InterfaceElement.js';
import { AbstractElement } from './elements/AbstractElement.js';
import { EnumElement } from './elements/EnumElement.js';
import { PackageElement } from './elements/PackageElement.js';
import { ComponentElement } from './elements/ComponentElement.js';
import { NodeElement } from './elements/NodeElement.js';
import { DatabaseElement } from './elements/DatabaseElement.js';
import { ActorElement } from './elements/ActorElement.js';
import { NoteElement } from './elements/NoteElement.js';

export class ElementFactory {
    constructor() {
        this.elementClasses = new Map([
            [ELEMENT_TYPES.CLASS, ClassElement],
            [ELEMENT_TYPES.INTERFACE, InterfaceElement],
            [ELEMENT_TYPES.ABSTRACT, AbstractElement],
            [ELEMENT_TYPES.ENUM, EnumElement],
            [ELEMENT_TYPES.PACKAGE, PackageElement],
            [ELEMENT_TYPES.COMPONENT, ComponentElement],
            [ELEMENT_TYPES.NODE, NodeElement],
            [ELEMENT_TYPES.DATABASE, DatabaseElement],
            [ELEMENT_TYPES.ACTOR, ActorElement],
            [ELEMENT_TYPES.NOTE, NoteElement]
        ]);
    }

    getElementClass(type) {
        const ElementClass = this.elementClasses.get(type);
        if (!ElementClass) {
            throw new Error(`Unknown element type: ${type}`);
        }
        return ElementClass;
    }

    createElement(type, id, x, y) {
        const ElementClass = this.getElementClass(type);
        return new ElementClass(id, x, y);
    }

    createFromObject(obj) {
        const ElementClass = this.getElementClass(obj.type);
        return ElementClass.fromObject(obj);
    }
}