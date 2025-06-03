import { Face } from '../components/Face.js';

export class ElementRenderer {
    constructor(svgHelper) {
        this.svgHelper = svgHelper;
        this.face = new Face(svgHelper);
    }

    render(element, showFaces, isPresentationMode, animationManager) {
        const g = this.svgHelper.createGroup({
            id: `element-${element.id}`,
            transform: `translate(${element.x}, ${element.y})`,
            style: 'cursor: grab'
        });
        
        // Shape
        const shape = element.createShape(this.svgHelper);
        g.appendChild(shape);
        
        // Face
        if (showFaces) {
            const faceG = this.svgHelper.createGroup();
            
            if (element.type === 'package') {
                const face = this.face.create(element.id, element.type, element.getColor(), 
                    element.getStroke(), element.width || 200);
                faceG.appendChild(face);
            } else {
                faceG.setAttribute('transform', element.getFacePosition());
                const face = this.face.create(element.id, element.type, element.getColor(), 
                    element.getStroke());
                faceG.appendChild(face);
            }
            
            g.appendChild(faceG);
            
            if (animationManager) {
                animationManager.startFaceAnimations(faceG, element.id, element.type);
                animationManager.getElement = (id) => {
                    return { id, isDragging: element.isDragging, isSad: element.isSad };
                };
            }
        }
        
        // Type label
        const typePos = element.getTypePosition();
        const typeLabel = this.svgHelper.createText(typePos.x, typePos.y, `«${element.type}»`, {
            'text-anchor': 'middle',
            'font-size': '10',
            fill: '#666'
        });
        g.appendChild(typeLabel);
        
        // Name
        const nameG = this.svgHelper.createGroup({ class: 'name-group', style: 'cursor: text' });
        const nameLines = element.name.split('\n');
        const namePos = element.getNamePosition(nameLines);
        
        if (element.name.trim() === '' && !isPresentationMode) {
            const placeholderText = this.svgHelper.createText(namePos.x, namePos.y, 
                '{click to add name}', {
                'text-anchor': 'middle',
                'font-size': '12',
                fill: '#666',
                'font-style': 'italic'
            });
            nameG.appendChild(placeholderText);
        } else if (element.name.trim() !== '') {
            nameLines.forEach((line, idx) => {
                const nameText = this.svgHelper.createText(namePos.x, namePos.y + idx * 15, line, {
                    'text-anchor': 'middle',
                    'font-size': '12',
                    'font-weight': 'bold'
                });
                nameG.appendChild(nameText);
            });
        }
        g.appendChild(nameG);
        
        // Color picker for packages
        if (element.type === 'package' && !isPresentationMode) {
            const colorG = this.svgHelper.createGroup({
                transform: 'translate(20, 20)',
                style: 'cursor: pointer',
                class: 'color-picker-btn'
            });
            const colorCircle = this.svgHelper.createCircle(0, 0, 10, element.getColor(), 
                element.getStroke(), 1);
            colorG.appendChild(colorCircle);
            g.appendChild(colorG);
        }
        
        // Delete button
        if (!isPresentationMode) {
            const deletePos = element.getDeletePosition();
            const deleteG = this.svgHelper.createGroup({
                transform: deletePos,
                style: 'cursor: pointer',
                class: 'delete-btn'
            });
            const deleteCircle = this.svgHelper.createCircle(0, 0, 10, '#FF6B6B', null, 0);
            deleteCircle.setAttribute('opacity', '0.7');
            const deleteIcon = this.svgHelper.createPath(
                'M -4 -4 L 4 4 M 4 -4 L -4 4',
                'none', 'white', 2
            );
            deleteIcon.setAttribute('stroke-linecap', 'round');
            deleteG.appendChild(deleteCircle);
            deleteG.appendChild(deleteIcon);
            g.appendChild(deleteG);
            
            // Add hover events for face expression
            deleteG.addEventListener('mouseenter', () => {
                element.isSad = true;
                if (animationManager) {
                    animationManager.updateFaceExpression(element.id, element.isDragging, true);
                }
                deleteCircle.setAttribute('opacity', '1');
            });
            deleteG.addEventListener('mouseleave', () => {
                element.isSad = false;
                if (animationManager) {
                    animationManager.updateFaceExpression(element.id, element.isDragging, false);
                }
                deleteCircle.setAttribute('opacity', '0.7');
            });
        }
        
        return g;
    }
}