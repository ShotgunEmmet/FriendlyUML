export class UndoControls {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.onUndo = null;
        this.onRedo = null;
    }

    render() {
        this.container.innerHTML = `
            <button id="undoBtn" disabled>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 10h18"></path>
                    <path d="M8 5L3 10l5 5"></path>
                </svg>
                Undo
            </button>
            <button id="redoBtn" disabled>
                Redo
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10H3"></path>
                    <path d="M16 5l5 5-5 5"></path>
                </svg>
            </button>
        `;

        this.attachEventListeners();
    }

    attachEventListeners() {
        const undoBtn = this.container.querySelector('#undoBtn');
        const redoBtn = this.container.querySelector('#redoBtn');

        undoBtn.addEventListener('click', () => {
            if (this.onUndo) {
                this.onUndo();
            }
        });

        redoBtn.addEventListener('click', () => {
            if (this.onRedo) {
                this.onRedo();
            }
        });
    }

    updateButtons(canUndo, canRedo) {
        const undoBtn = this.container.querySelector('#undoBtn');
        const redoBtn = this.container.querySelector('#redoBtn');

        if (undoBtn) undoBtn.disabled = !canUndo;
        if (redoBtn) redoBtn.disabled = !canRedo;
    }
}