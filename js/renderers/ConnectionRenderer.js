import { CONNECTION_TYPES } from '../constants/types.js';
import { PASTEL_COLORS } from '../constants/colors.js';
import { GeometryHelper } from '../utils/GeometryHelper.js';

export class ConnectionRenderer {
    constructor(svgHelper) {
        this.svgHelper = svgHelper;
    }

    render(connection, fromEl, toEl, showFaces, isPresentationMode) {
        const g = this.svgHelper.createGroup({
            id: `connection-${connection.id}`,
            class: 'connection'
        });
        
        // Get center points
        const fromCenter = fromEl.getCenter();
        const toCenter = toEl.getCenter();
        
        // Calculate edge points
        const fromEdge = this.getEdgePoint(fromEl, fromCenter, toCenter, showFaces);
        const toEdge = this.getEdgePoint(toEl, toCenter, fromCenter, showFaces);
        
        const x1 = fromEdge.x;
        const y1 = fromEdge.y;
        const x2 = toEdge.x;
        const y2 = toEdge.y;
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        
        const type = connection.type || 'association';
        
        // Line style based on type
        const isDashed = type === CONNECTION_TYPES.DEPENDENCY || type === CONNECTION_TYPES.REALIZATION;
        const line = this.svgHelper.createLine(x1, y1, x2, y2, PASTEL_COLORS.connection, 3, 
            isDashed ? '5,5' : null);
        g.appendChild(line);
        
        // Start marker (for aggregation, composition, bidirectional)
        const angle1 = Math.atan2(y1 - y2, x1 - x2) * 180 / Math.PI;
        if (type === CONNECTION_TYPES.AGGREGATION) {
            const diamond = this.svgHelper.createPolygon(
                `${x1},${y1} ${x1-15},${y1-8} ${x1-30},${y1} ${x1-15},${y1+8}`,
                'white', PASTEL_COLORS.connection, 3
            );
            diamond.setAttribute('transform', `rotate(${angle1}, ${x1}, ${y1})`);
            g.appendChild(diamond);
        } else if (type === CONNECTION_TYPES.COMPOSITION) {
            const diamond = this.svgHelper.createPolygon(
                `${x1},${y1} ${x1-15},${y1-8} ${x1-30},${y1} ${x1-15},${y1+8}`,
                PASTEL_COLORS.connection, PASTEL_COLORS.connection, 3
            );
            diamond.setAttribute('transform', `rotate(${angle1}, ${x1}, ${y1})`);
            g.appendChild(diamond);
        } else if (type === CONNECTION_TYPES.BIDIRECTIONAL) {
            const arrow1 = this.svgHelper.createPolygon(
                `${x1},${y1} ${x1-10},${y1-5} ${x1-10},${y1+5}`,
                PASTEL_COLORS.connection, null, 0
            );
            arrow1.setAttribute('transform', `rotate(${angle1}, ${x1}, ${y1})`);
            g.appendChild(arrow1);
        }
        
        // End marker (arrows)
        const angle2 = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        if (type === CONNECTION_TYPES.INHERITANCE || type === CONNECTION_TYPES.REALIZATION) {
            const arrow = this.svgHelper.createPolygon(
                `${x2},${y2} ${x2-15},${y2-8} ${x2-15},${y2+8}`,
                'white', PASTEL_COLORS.connection, 3
            );
            arrow.setAttribute('transform', `rotate(${angle2}, ${x2}, ${y2})`);
            g.appendChild(arrow);
        } else if (type === CONNECTION_TYPES.ASSOCIATION) {
            // No arrow for association
        } else if (type === CONNECTION_TYPES.DEPENDENCY || type === CONNECTION_TYPES.DATAFLOW || 
                   type === CONNECTION_TYPES.BIDIRECTIONAL) {
            const arrow = this.svgHelper.createPolygon(
                `${x2},${y2} ${x2-10},${y2-5} ${x2-10},${y2+5}`,
                PASTEL_COLORS.connection, null, 0
            );
            arrow.setAttribute('transform', `rotate(${angle2}, ${x2}, ${y2})`);
            g.appendChild(arrow);
        }
        
        // Label background
        if (connection.label && (!isPresentationMode || connection.label.trim() !== '')) {
            const labelWidth = Math.max(20, connection.label.length * 7);
            const labelRect = this.svgHelper.createRect(
                midX - labelWidth / 2, midY - 22, labelWidth, 18, 2,
                'white', null, 0
            );
            labelRect.setAttribute('opacity', '0.7');
            g.appendChild(labelRect);
        }
        
        // Label text
        if (!isPresentationMode || connection.label.trim() !== '') {
            const labelText = this.svgHelper.createText(midX, midY - 10, 
                connection.label || (isPresentationMode ? '' : '{click to add label}'), {
                'text-anchor': 'middle',
                'font-size': '12',
                fill: connection.label ? '#333' : '#666',
                style: 'cursor: text',
                class: 'connection-label'
            });
            g.appendChild(labelText);
        }
        
        // Type label
        const typeLabel = this.svgHelper.createText(midX, midY + 15, `«${type}»`, {
            'text-anchor': 'middle',
            'font-size': '10',
            fill: '#666'
        });
        g.appendChild(typeLabel);
        
        // Delete button
        if (!isPresentationMode) {
            const deleteG = this.svgHelper.createGroup({
                transform: `translate(${midX}, ${midY + 30})`,
                style: 'cursor: pointer',
                class: 'connection-delete'
            });
            const deleteCircle = this.svgHelper.createCircle(0, 0, 8, '#FF6B6B', null, 0);
            deleteCircle.setAttribute('opacity', '0.7');
            const deleteIcon = this.svgHelper.createPath(
                'M -3 -3 L 3 3 M 3 -3 L -3 3',
                'none', 'white', 1.5
            );
            deleteIcon.setAttribute('stroke-linecap', 'round');
            deleteG.appendChild(deleteCircle);
            deleteG.appendChild(deleteIcon);
            g.appendChild(deleteG);
            
            deleteG.addEventListener('mouseenter', () => deleteCircle.setAttribute('opacity', '1'));
            deleteG.addEventListener('mouseleave', () => deleteCircle.setAttribute('opacity', '0.7'));
        }
        
        return g;
    }

    getEdgePoint(element, fromCenter, toCenter, showFaces) {
        const angle = Math.atan2(toCenter.y - fromCenter.y, toCenter.x - fromCenter.x);
        
        // If faces are shown, check for face semi-circle intersection
        if (showFaces && element.type !== 'actor') {
            const faceIntersection = GeometryHelper.getFaceEdgePoint(
                element, fromCenter, angle, element.getFacePosition()
            );
            if (faceIntersection) {
                return faceIntersection;
            }
        }
        
        return element.getEdgePoint(fromCenter.x, fromCenter.y, toCenter.x, toCenter.y);
    }
}