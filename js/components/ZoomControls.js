export class ZoomControls {
    constructor(containerId, initialZoom = 100) {
        this.container = document.getElementById(containerId);
        this.zoomLevel = initialZoom;
        this.onZoomChange = null;
    }

    render() {
        this.container.innerHTML = `
            <span class="zoom-value" id="zoomValue">${this.zoomLevel}%</span>
            <input type="range" class="zoom-slider" id="zoomSlider" 
                   min="25" max="200" value="${this.zoomLevel}" step="5">
        `;

        this.attachEventListeners();
    }

    attachEventListeners() {
        const slider = this.container.querySelector('#zoomSlider');
        const valueDisplay = this.container.querySelector('#zoomValue');

        slider.addEventListener('input', (e) => {
            this.zoomLevel = parseInt(e.target.value);
            valueDisplay.textContent = this.zoomLevel + '%';
            
            if (this.onZoomChange) {
                this.onZoomChange(this.zoomLevel);
            }
        });
    }

    setZoom(zoomLevel) {
        this.zoomLevel = Math.max(25, Math.min(200, zoomLevel));
        const slider = this.container.querySelector('#zoomSlider');
        const valueDisplay = this.container.querySelector('#zoomValue');
        
        if (slider && valueDisplay) {
            slider.value = this.zoomLevel;
            valueDisplay.textContent = this.zoomLevel + '%';
        }
    }
}