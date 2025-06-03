export class AnimationManager {
    constructor() {
        this.faceAnimations = new Map();
    }

    startFaceAnimations(faceGroup, elementId, elementType) {
        // Clear existing animations
        if (this.faceAnimations.has(elementId)) {
            const { moveInterval, blinkInterval } = this.faceAnimations.get(elementId);
            clearInterval(moveInterval);
            clearInterval(blinkInterval);
        }
        
        const pupils = faceGroup.querySelectorAll('.eye-pupil');
        const blinks = faceGroup.querySelectorAll('.eye-blink');
        const mouth = faceGroup.querySelector('.mouth');
        
        // Eye movement
        const moveInterval = setInterval(() => {
            const element = this.getElement(elementId);
            if (element && !element.isDragging && !element.isSad) {
                const x = (Math.random() - 0.5) * (elementType === 'package' ? 3 : 2);
                const y = (Math.random() - 0.5) * 2;
                pupils.forEach(pupil => {
                    pupil.setAttribute('transform', `translate(${x}, ${y})`);
                });
            } else if (element && element.isSad) {
                pupils.forEach(pupil => {
                    pupil.setAttribute('transform', 'translate(0, 1)');
                });
            }
        }, 2000);
        
        // Blinking
        const blinkInterval = setInterval(() => {
            const element = this.getElement(elementId);
            if (element && !element.isSad) {
                pupils.forEach(pupil => pupil.style.display = 'none');
                blinks.forEach(blink => blink.style.display = 'block');
                setTimeout(() => {
                    pupils.forEach(pupil => pupil.style.display = 'block');
                    blinks.forEach(blink => blink.style.display = 'none');
                }, 150);
            }
        }, 4000 + Math.random() * 2000);
        
        this.faceAnimations.set(elementId, { moveInterval, blinkInterval });
    }

    updateFaceExpression(elementId, isDragging, isSad) {
        const element = document.querySelector(`#element-${elementId}`);
        if (!element) return;
        
        const mouthG = element.querySelector('.mouth')?.parentNode;
        if (mouthG) {
            if (isSad) {
                mouthG.innerHTML = '<path d="M -5 2 Q 0 -2 5 2" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round" class="mouth"/>';
            } else if (isDragging) {
                mouthG.innerHTML = '<ellipse rx="4" ry="3" fill="#333" class="mouth-dragging"/>';
            } else {
                mouthG.innerHTML = '<path d="M -5 0 Q 0 3 5 0" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round" class="mouth"/>';
            }
        }
    }

    stopFaceAnimations(elementId) {
        if (this.faceAnimations.has(elementId)) {
            const { moveInterval, blinkInterval } = this.faceAnimations.get(elementId);
            clearInterval(moveInterval);
            clearInterval(blinkInterval);
            this.faceAnimations.delete(elementId);
        }
    }

    stopAllAnimations() {
        this.faceAnimations.forEach(({ moveInterval, blinkInterval }) => {
            clearInterval(moveInterval);
            clearInterval(blinkInterval);
        });
        this.faceAnimations.clear();
    }

    // This should be set by the app to get current element state
    getElement(elementId) {
        // Will be overridden by app
        return null;
    }
}