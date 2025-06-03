export class FacesToggle {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.showFaces = true;
        this.onToggle = null;
    }

    render() {
        this.container.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="9" r="1.5"></circle>
                <circle cx="15" cy="9" r="1.5"></circle>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke-width="2"></path>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            </svg>
            <span id="facesText">Hide Faces</span>
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

    update(showFaces) {
        this.showFaces = showFaces;
        const text = this.container.querySelector('#facesText');
        
        if (showFaces) {
            this.container.classList.remove('active');
            text.textContent = 'Hide Faces';
        } else {
            this.container.classList.add('active');
            text.textContent = 'Show Faces';
        }
    }

    setHidden(hidden) {
        if (hidden) {
            this.container.classList.add('hidden');
        } else {
            this.container.classList.remove('hidden');
        }
    }
}