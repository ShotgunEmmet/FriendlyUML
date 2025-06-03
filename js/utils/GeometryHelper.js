export class GeometryHelper {
    static getRectangleEdgePoint(x, y, width, height, cx, cy, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const abscos = Math.abs(cos);
        const abssin = Math.abs(sin);
        
        let px, py;
        
        if (width * abssin < height * abscos) {
            px = cos > 0 ? x + width : x;
            py = cy + (px - cx) * sin / cos;
        } else {
            py = sin > 0 ? y + height : y;
            px = cx + (py - cy) * cos / sin;
        }
        
        return { x: px, y: py };
    }

    static getDiamondEdgePoint(cx, cy, halfWidth, halfHeight, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const t = 1 / (Math.abs(cos) / halfWidth + Math.abs(sin) / halfHeight);
        
        return {
            x: cx + t * cos,
            y: cy + t * sin
        };
    }

    static getCircleEdgePoint(cx, cy, radius, angle) {
        return {
            x: cx + Math.cos(angle) * radius,
            y: cy + Math.sin(angle) * radius
        };
    }

    static getFaceEdgePoint(element, center, angle, facePosition) {
        let faceCenterX, faceCenterY, faceRadius;
        
        if (element.type === 'package') {
            faceCenterX = element.x + (element.width || 200) / 2 + 5;
            faceCenterY = element.y - 10 + 15;
            faceRadius = 25;
        } else {
            faceCenterX = element.x + 75;
            faceRadius = 21.5;
            
            // Parse face position transform
            const match = facePosition.match(/translate\(([-\d.]+),\s*([-\d.]+)\)/);
            if (match) {
                const offsetX = parseFloat(match[1]);
                const offsetY = parseFloat(match[2]);
                faceCenterX = element.x + offsetX;
                faceCenterY = element.y + offsetY + 15;
            }
        }
        
        const dx = center.x - faceCenterX;
        const dy = center.y - faceCenterY;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        const a = cos * cos + sin * sin;
        const b = 2 * (dx * cos + dy * sin);
        const c = dx * dx + dy * dy - faceRadius * faceRadius;
        
        const discriminant = b * b - 4 * a * c;
        
        if (discriminant < 0) return null;
        
        const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
        const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);
        
        const checkPoint = (t) => {
            const y = center.y + t * sin;
            return y <= faceCenterY;
        };
        
        let t = null;
        if (t1 > 0 && checkPoint(t1)) {
            t = t1;
        } else if (t2 > 0 && checkPoint(t2)) {
            t = t2;
        }
        
        if (t === null) return null;
        
        return {
            x: center.x + t * cos,
            y: center.y + t * sin
        };
    }
}