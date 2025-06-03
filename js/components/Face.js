import { SVGHelper } from '../utils/SVGHelper.js';

export class Face {
    constructor(svgHelper) {
        this.svgHelper = svgHelper;
    }

    create(elementId, type, color, stroke, width = 200) {
        const g = this.svgHelper.createGroup();
        
        if (type === 'package') {
            // Package face (one eye)
            const centerX = width / 2 + 5;
            g.setAttribute('transform', `translate(${centerX}, -10)`);
            
            // Semi-circle
            const path = this.svgHelper.createPath(
                'M -25 15 A 25 25 0 0 1 25 15 Z',
                color, stroke, 2, '10,5'
            );
            g.appendChild(path);
            
            // Central Eye
            const eyeG = this.svgHelper.createGroup({ transform: 'translate(0, 4)' });
            const eyeWhite = this.svgHelper.createCircle(0, 0, 6, 'white', '#666', 1);
            const eyePupil = this.svgHelper.createCircle(0, 0, 2, '#333', null, 0);
            eyePupil.setAttribute('class', 'eye-pupil');
            const eyeBlink = this.svgHelper.createLine(-3, 0, 3, 0, '#666', 2);
            eyeBlink.setAttribute('class', 'eye-blink');
            eyeBlink.style.display = 'none';
            
            eyeG.appendChild(eyeWhite);
            eyeG.appendChild(eyePupil);
            eyeG.appendChild(eyeBlink);
            g.appendChild(eyeG);
        } else {
            // Regular face (two eyes)
            if (type !== 'actor') {
                const path = this.svgHelper.createPath(
                    'M -18 15 A 21.5 25 0 0 1 25 15 Z',
                    color, stroke, 2
                );
                g.appendChild(path);
            }
            
            // Left Eye
            const leftEyeG = this.svgHelper.createGroup({ transform: 'translate(-2, 1)' });
            const leftEyeWhite = this.svgHelper.createCircle(0, 0, 4, 'white', '#666', 1);
            const leftEyePupil = this.svgHelper.createCircle(0, 0, 1.5, '#333', null, 0);
            leftEyePupil.setAttribute('class', 'eye-pupil');
            const leftEyeBlink = this.svgHelper.createLine(-2, 0, 2, 0, '#666', 1);
            leftEyeBlink.setAttribute('class', 'eye-blink');
            leftEyeBlink.style.display = 'none';
            
            leftEyeG.appendChild(leftEyeWhite);
            leftEyeG.appendChild(leftEyePupil);
            leftEyeG.appendChild(leftEyeBlink);
            g.appendChild(leftEyeG);
            
            // Right Eye
            const rightEyeG = this.svgHelper.createGroup({ transform: 'translate(9, 1)' });
            const rightEyeWhite = this.svgHelper.createCircle(0, 0, 4, 'white', '#666', 1);
            const rightEyePupil = this.svgHelper.createCircle(0, 0, 1.5, '#333', null, 0);
            rightEyePupil.setAttribute('class', 'eye-pupil');
            const rightEyeBlink = this.svgHelper.createLine(-2, 0, 2, 0, '#666', 1);
            rightEyeBlink.setAttribute('class', 'eye-blink');
            rightEyeBlink.style.display = 'none';
            
            rightEyeG.appendChild(rightEyeWhite);
            rightEyeG.appendChild(rightEyePupil);
            rightEyeG.appendChild(rightEyeBlink);
            g.appendChild(rightEyeG);
            
            // Mouth
            const mouthG = this.svgHelper.createGroup({ transform: 'translate(3.5, 9)' });
            const mouth = this.svgHelper.createPath(
                'M -5 0 Q 0 3 5 0',
                'none', '#333', 1.5
            );
            mouth.setAttribute('stroke-linecap', 'round');
            mouth.setAttribute('class', 'mouth');
            mouthG.appendChild(mouth);
            g.appendChild(mouthG);
        }
        
        return g;
    }
}