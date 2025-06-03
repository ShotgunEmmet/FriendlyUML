import { SVGHelper } from '../utils/SVGHelper.js';
import { CONNECTION_TYPES } from '../constants/types.js';
import { PASTEL_COLORS } from '../constants/colors.js';
import { ElementRenderer } from '../renderers/ElementRenderer.js';
import { ConnectionRenderer } from '../renderers/ConnectionRenderer.js';

export class CanvasManager {
    constructor(canvasId, stateManager) {
        this.canvas = document.getElementById(canvasId);
        this.stateManager = stateManager;
        this.svgHelper = new SVGHelper();
        this.elementRenderer = new ElementRenderer(this.svgHelper);
        this.connectionRenderer = new ConnectionRenderer(this.svgHelper);
    }

    render(elements, connections, showFaces, isPresentationMode, animationManager) {
        // Clear canvas
        this.canvas.innerHTML = '';
        
        // Update SVG helper mode
        this.svgHelper.isPresentationMode = isPresentationMode;
        
        // Calculate canvas size
        let maxX = 0, maxY = 0;
        elements.forEach(el => {
            maxX = Math.max(maxX, el.x + (el.width || 150) + 50);
            maxY = Math.max(maxY, el.y + (el.height || 120) + 50);
        });
        
        const baseWidth = Math.max(window.innerWidth, maxX + 100);
        const baseHeight = Math.max(window.innerHeight, maxY + 100);
        
        this.canvas.setAttribute('width', baseWidth);
        this.canvas.setAttribute('height', baseHeight);
        this.canvas.style.width = baseWidth + 'px';
        this.canvas.style.height = baseHeight + 'px';
        
        // Sort elements - packages first (largest to smallest)
        const packages = elements.filter(el => el.type === 'package')
            .sort((a, b) => {
                const sizeA = (a.width || 200) * (a.height || 150);
                const sizeB = (b.width || 200) * (b.height || 150);
                return sizeB - sizeA;
            });
        const otherElements = elements.filter(el => el.type !== 'package');
        
        // Render packages first
        packages.forEach(element => {
            const el = this.elementRenderer.render(element, showFaces, isPresentationMode, animationManager);
            this.canvas.appendChild(el);
            this.attachElementEvents(el, element);
        });
        
        // Render connections
        connections.forEach(connection => {
            const fromEl = elements.find(el => el.id === connection.from);
            const toEl = elements.find(el => el.id === connection.to);
            
            if (fromEl && toEl) {
                const connEl = this.connectionRenderer.render(connection, fromEl, toEl, showFaces, isPresentationMode);
                if (connEl) {
                    this.canvas.appendChild(connEl);
                    this.attachConnectionEvents(connEl, connection);
                }
            }
        });
        
        // Render other elements
        otherElements.forEach(element => {
            const el = this.elementRenderer.render(element, showFaces, isPresentationMode, animationManager);
            this.canvas.appendChild(el);
            this.attachElementEvents(el, element);
        });
        
        this.updateCanvasWrapper();
    }

    attachElementEvents(svgElement, element) {
        const nameGroup = svgElement.querySelector('.name-group');
        const deleteBtn = svgElement.querySelector('.delete-btn');
        const colorBtn = svgElement.querySelector('.color-picker-btn');
        const resizeHandle = svgElement.querySelector('.resize-handle');
        
        svgElement.addEventListener('mousedown', (e) => {
            if (this.stateManager.isConnecting) {
                e.stopPropagation();
                this.handleConnect(element);
            } else {
                this.handleElementMouseDown(e, element);
            }
        });
        
        if (nameGroup && !this.stateManager.isPresentationMode) {
            nameGroup.addEventListener('click', (e) => this.handleNameClick(e, element));
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => this.handleDeleteClick(e, element));
        }
        
        if (colorBtn) {
            colorBtn.addEventListener('click', (e) => this.handleColorClick(e, element));
        }
        
        if (resizeHandle) {
            resizeHandle.addEventListener('mousedown', (e) => this.handleResizeMouseDown(e, element));
        }
    }

    attachConnectionEvents(svgElement, connection) {
        const label = svgElement.querySelector('.connection-label');
        const deleteBtn = svgElement.querySelector('.connection-delete');
        
        if (label && !this.stateManager.isPresentationMode) {
            label.addEventListener('click', (e) => this.handleConnectionLabelClick(e, connection));
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.stateManager.deleteConnection(connection.id));
        }
    }

    handleConnect(element) {
        if (element.type === 'package') return;
        
        if (!this.stateManager.connectingFrom) {
            this.stateManager.connectingFrom = element.id;
        } else {
            if (this.stateManager.connectingFrom !== element.id) {
                this.stateManager.addConnection(
                    this.stateManager.connectingFrom,
                    element.id,
                    this.stateManager.selectedConnectionType
                );
            }
            this.stateManager.connectingFrom = null;
            this.stateManager.isConnecting = false;
            this.stateManager.notifyObservers('connectModeChanged', false);
        }
    }

    handleElementMouseDown(e, element) {
        // Handled by EventManager
        this.stateManager.notifyObservers('elementMouseDown', { event: e, element });
    }

    handleNameClick(e, element) {
        e.stopPropagation();
        this.stateManager.notifyObservers('elementNameClick', { event: e, element });
    }

    handleDeleteClick(e, element) {
        e.stopPropagation();
        this.stateManager.deleteElement(element.id);
    }

    handleColorClick(e, element) {
        e.stopPropagation();
        this.stateManager.notifyObservers('elementColorClick', { event: e, element });
    }

    handleResizeMouseDown(e, element) {
        e.stopPropagation();
        this.stateManager.notifyObservers('elementResizeStart', { event: e, element });
    }

    handleConnectionLabelClick(e, connection) {
        e.stopPropagation();
        this.stateManager.notifyObservers('connectionLabelClick', { event: e, connection });
    }

    setZoom(zoomLevel) {
        const scale = zoomLevel / 100;
        this.canvas.style.transform = `scale(${scale})`;
        this.updateCanvasWrapper();
    }

    updateCanvasWrapper() {
        const wrapper = document.getElementById('canvasWrapper');
        const scale = this.stateManager.zoomLevel / 100;
        const width = parseInt(this.canvas.style.width) * scale;
        const height = parseInt(this.canvas.style.height) * scale;
        
        let spacer = wrapper.querySelector('.canvas-spacer');
        if (!spacer) {
            spacer = document.createElement('div');
            spacer.className = 'canvas-spacer';
            spacer.style.position = 'absolute';
            spacer.style.top = '0';
            spacer.style.left = '0';
            spacer.style.pointerEvents = 'none';
            wrapper.appendChild(spacer);
        }
        spacer.style.width = width + 'px';
        spacer.style.height = height + 'px';
    }
}