import { StateManager } from './managers/StateManager.js';
import { CanvasManager } from './managers/CanvasManager.js';
import { EventManager } from './managers/EventManager.js';
import { AnimationManager } from './managers/AnimationManager.js';
import { Toolbar } from './components/Toolbar.js';
import { ZoomControls } from './components/ZoomControls.js';
import { UndoControls } from './components/UndoControls.js';
import { ConnectionTypeSelector } from './components/ConnectionTypeSelector.js';
import { PresentationToggle } from './components/PresentationToggle.js';
import { FacesToggle } from './components/FacesToggle.js';
import { ElementFactory } from './models/ElementFactory.js';
import { UMLXMLSerializer } from './utils/XMLSerializer.js';

class UMLDiagramApp {
    constructor() {
        // Initialize managers
        this.stateManager = new StateManager();
        this.canvasManager = new CanvasManager('canvas', this.stateManager);
        this.eventManager = new EventManager(this.stateManager, this.canvasManager);
        this.animationManager = new AnimationManager();
        this.elementFactory = new ElementFactory();

        // Initialize UI components
        this.initializeComponents();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initial state
        this.stateManager.saveState();
        this.render();
    }

    initializeComponents() {
        // Toolbar
        this.toolbar = new Toolbar('toolbar', this.elementFactory);
        this.toolbar.onAddElement = (type) => {
            const ElementClass = this.elementFactory.getElementClass(type);
            const x = 300;
            const y = 20 + (this.stateManager.elements.length * 30) % 200;
            this.stateManager.addElement(ElementClass, x, y);
            this.render();
        };
        this.toolbar.onToggleConnect = () => {
            this.stateManager.isConnecting = !this.stateManager.isConnecting;
            this.stateManager.connectingFrom = null;
            this.toolbar.updateConnectButton(this.stateManager.isConnecting);
            this.connectionTypeSelector.setVisible(this.stateManager.isConnecting);
        };
        this.toolbar.onSave = () => this.saveToXML();
        this.toolbar.onLoad = (event) => this.loadFromXML(event);
        this.toolbar.render();

        // Connection Type Selector
        this.connectionTypeSelector = new ConnectionTypeSelector('connectionTypes');
        this.connectionTypeSelector.onTypeSelected = (type) => {
            this.stateManager.selectedConnectionType = type;
        };
        this.connectionTypeSelector.render();

        // Zoom Controls
        this.zoomControls = new ZoomControls('zoomControls', this.stateManager.zoomLevel);
        this.zoomControls.onZoomChange = (zoom) => {
            this.stateManager.zoomLevel = zoom;
            this.canvasManager.setZoom(zoom);
        };
        this.zoomControls.render();

        // Undo/Redo Controls
        this.undoControls = new UndoControls('undoControls');
        this.undoControls.onUndo = () => this.stateManager.undo();
        this.undoControls.onRedo = () => this.stateManager.redo();
        this.undoControls.render();

        // Presentation Toggle
        this.presentationToggle = new PresentationToggle('presentationToggle');
        this.presentationToggle.onToggle = () => {
            this.stateManager.isPresentationMode = !this.stateManager.isPresentationMode;
            this.updatePresentationMode();
        };
        this.presentationToggle.render();

        // Faces Toggle
        this.facesToggle = new FacesToggle('facesToggle');
        this.facesToggle.onToggle = () => {
            this.stateManager.showFaces = !this.stateManager.showFaces;
            this.facesToggle.update(this.stateManager.showFaces);
            this.render();
        };
        this.facesToggle.render();
    }

    setupEventListeners() {
        // State change listeners
        this.stateManager.subscribe('stateChange', () => this.render());
        this.stateManager.subscribe('historyChange', () => {
            this.undoControls.updateButtons(
                this.stateManager.canUndo(),
                this.stateManager.canRedo()
            );
        });
        this.stateManager.subscribe('elementAdded', () => this.render());
        this.stateManager.subscribe('elementDeleted', () => this.render());
        this.stateManager.subscribe('elementUpdated', () => this.render());
        this.stateManager.subscribe('connectionAdded', () => this.render());
        this.stateManager.subscribe('connectionDeleted', () => this.render());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                this.stateManager.undo();
            } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                this.stateManager.redo();
            }
        });

        // Canvas wrapper zoom
        const canvasWrapper = document.getElementById('canvasWrapper');
        canvasWrapper.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -10 : 10;
            const newZoom = Math.max(25, Math.min(200, this.stateManager.zoomLevel + delta));
            this.zoomControls.setZoom(newZoom);
            this.stateManager.zoomLevel = newZoom;
            this.canvasManager.setZoom(newZoom);
        });
    }

    updatePresentationMode() {
        const isPres = this.stateManager.isPresentationMode;
        this.toolbar.setPresentationMode(isPres);
        this.facesToggle.setHidden(isPres);
        this.connectionTypeSelector.setPresentationMode(isPres);
        this.presentationToggle.update(isPres);
        
        if (isPres && this.stateManager.isConnecting) {
            this.toolbar.onToggleConnect();
        }
        
        this.render();
    }

    render() {
        // Convert element objects to proper class instances
        const elements = this.stateManager.elements.map(el => {
            const ElementClass = this.elementFactory.getElementClass(el.type);
            return ElementClass.fromObject(el);
        });
        
        this.canvasManager.render(
            elements,
            this.stateManager.connections,
            this.stateManager.showFaces,
            this.stateManager.isPresentationMode,
            this.animationManager
        );
    }

    saveToXML() {
        const filename = prompt('Enter filename for your UML diagram:', 'uml-diagram');
        if (!filename) return;
        
        const xmlSerializer = new UMLXMLSerializer();
        const xmlString = xmlSerializer.serialize(this.stateManager);
        const blob = new Blob([xmlString], { type: 'text/xml' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.xml`;
        a.click();
        URL.revokeObjectURL(url);
    }

    loadFromXML(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const xmlSerializer = new UMLXMLSerializer();
            xmlSerializer.deserialize(e.target.result, this.stateManager);
            this.stateManager.saveState();
            this.render();
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset input
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new UMLDiagramApp();
});