export class PresentationToggle {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isActive = false;
        this.onToggle = null;
    }

    render() {
        this.container.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            <span id="presentationText">Presentation</span>
        `;

        this.attachEventListeners();
    }

    attachEventListeners() {
        this.container.addEventListener('click', () => {
            if (this.onToggle) {
                this.onToggle();
            }
        });
    }

    update(isActive) {
        this.isActive = isActive;
        const text = this.container.querySelector('#presentationText');
        
        if (isActive) {
            this.container.classList.add('active');
            text.textContent = 'Exit Presentation';
        } else {
            this.container.classList.remove('active');
            text.textContent = 'Presentation';
        }
    }
}