export class Toolbar {
    constructor(containerId, elementFactory) {
        this.container = document.getElementById(containerId);
        this.elementFactory = elementFactory;
        this.onAddElement = null;
        this.onToggleConnect = null;
        this.onSave = null;
        this.onLoad = null;
        this.isConnecting = false;
    }

    render() {
        this.container.innerHTML = `
            <h1>UML Diagram Maker</h1>
            <div class="toolbar-buttons">
                ${this.createButtons()}
                <hr>
                <button class="btn-save" id="saveBtn">
                    ${this.getSaveIcon()}
                    Save
                </button>
                <button class="btn-load" id="loadBtn">
                    ${this.getLoadIcon()}
                    Load
                </button>
                <input type="file" id="fileInput" accept=".xml" class="hidden">
            </div>
        `;

        this.attachEventListeners();
    }

    createButtons() {
        const types = [
            { type: 'class', label: 'Add Class', icon: this.getClassIcon() },
            { type: 'interface', label: 'Add Interface', icon: this.getInterfaceIcon() },
            { type: 'abstract', label: 'Add Abstract', icon: this.getAbstractIcon() },
            { type: 'enum', label: 'Add Enum', icon: this.getEnumIcon() },
            { type: 'component', label: 'Add Component', icon: this.getComponentIcon() },
            { type: 'node', label: 'Add Node', icon: this.getNodeIcon() },
            { type: 'database', label: 'Add Database', icon: this.getDatabaseIcon() },
            { type: 'actor', label: 'Add Actor', icon: this.getActorIcon() },
            { type: 'note', label: 'Add Note', icon: this.getNoteIcon() },
            { type: 'package', label: 'Add Package', icon: this.getPackageIcon() }
        ];

        return types.map(({type, label, icon}) => `
            <button class="btn-${type}" data-type="${type}">
                ${icon}
                ${label}
            </button>
        `).join('') + `
            <button id="connectBtn" class="btn-connect">
                ${this.getConnectIcon()}
                <span id="connectText">Connect</span>
            </button>
        `;
    }

    attachEventListeners() {
        // Element buttons
        this.container.querySelectorAll('[data-type]').forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.onAddElement) {
                    this.onAddElement(btn.dataset.type);
                }
            });
        });

        // Connect button
        const connectBtn = this.container.querySelector('#connectBtn');
        connectBtn.addEventListener('click', () => {
            if (this.onToggleConnect) {
                this.onToggleConnect();
            }
        });

        // Save button
        const saveBtn = this.container.querySelector('#saveBtn');
        saveBtn.addEventListener('click', () => {
            if (this.onSave) {
                this.onSave();
            }
        });

        // Load button
        const loadBtn = this.container.querySelector('#loadBtn');
        const fileInput = this.container.querySelector('#fileInput');
        
        loadBtn.addEventListener('click', () => {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', (e) => {
            if (this.onLoad) {
                this.onLoad(e);
            }
        });
    }

    updateConnectButton(isConnecting) {
        const btn = this.container.querySelector('#connectBtn');
        const text = this.container.querySelector('#connectText');
        
        if (isConnecting) {
            btn.classList.add('active');
            text.textContent = 'Connecting...';
        } else {
            btn.classList.remove('active');
            text.textContent = 'Connect';
        }
    }

    setPresentationMode(isPresentationMode) {
        if (isPresentationMode) {
            this.container.classList.add('presentation-mode');
        } else {
            this.container.classList.remove('presentation-mode');
        }
    }

    // Icon methods
    getClassIcon() {
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>';
    }

    getInterfaceIcon() {
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>';
    }

    getAbstractIcon() {
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 22 12 12 22 2 12"></polygon></svg>';
    }

    getEnumIcon() {
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 20 8 20 16 12 22 4 16 4 8"></polygon></svg>';
    }

    getComponentIcon() {
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><rect x="7" y="7" width="3" height="3"></rect><rect x="14" y="7" width="3" height="3"></rect><rect x="14" y="14" width="3" height="3"></rect><rect x="7" y="14" width="3" height="3"></rect></svg>';
    }

    getNodeIcon() {
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
    }

    getDatabaseIcon() {
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>';
    }

    getActorIcon() {
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="3"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="11" x2="16" y2="11"></line><line x1="12" y1="16" x2="8" y2="21"></line><line x1="12" y1="16" x2="16" y2="21"></line></svg>';
    }

    getNoteIcon() {
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>';
    }

    getPackageIcon() {
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>';
    }

    getConnectIcon() {
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
    }

    getSaveIcon() {
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>';
    }

    getLoadIcon() {
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>';
    }
}