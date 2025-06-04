export class EventManager {
    constructor(stateManager, canvasManager) {
        this.stateManager = stateManager;
        this.canvasManager = canvasManager;
        this.draggedElement = null;
        this.dragOffset = null;
        this.isDragging = false;
        this.resizingElement = null;
        this.resizeStart = null;
        this.isResizing = false;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Subscribe to state manager events
        this.stateManager.subscribe('elementMouseDown', (data) => {
            this.handleElementMouseDown(data.event, data.element);
        });
        
        this.stateManager.subscribe('elementNameClick', (data) => {
            this.showNameEditor(data.event, data.element);
        });
        
        this.stateManager.subscribe('elementColorClick', (data) => {
            this.showColorPicker(data.event, data.element);
        });
        
        this.stateManager.subscribe('elementResizeStart', (data) => {
            this.handleResizeStart(data.event, data.element);
        });
        
        this.stateManager.subscribe('connectionLabelClick', (data) => {
            this.showLabelEditor(data.event, data.connection);
        });
        
        // Global mouse events
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    }

    handleElementMouseDown(e, element) {
        if (this.stateManager.isPresentationMode || this.stateManager.isConnecting) return;
        
        // Get the actual element from state manager to ensure we have the correct instance
        const actualElement = this.stateManager.getElementById(element.id);
        if (!actualElement) return;
        
        this.draggedElement = actualElement;
        const canvasWrapper = document.getElementById('canvasWrapper');
        const scale = this.stateManager.zoomLevel / 100;
        
        const wrapperRect = canvasWrapper.getBoundingClientRect();
        const scrolledX = e.clientX - wrapperRect.left;
        const scrolledY = e.clientY - wrapperRect.top;
        
        const canvasX = scrolledX / scale;
        const canvasY = scrolledY / scale;
        
        this.dragOffset = {
            x: canvasX - actualElement.x,
            y: canvasY - actualElement.y
        };
        
        actualElement.isDragging = true;
        this.stateManager.notifyObservers('elementDragStart', actualElement);
    }

    handleMouseMove(e) {
        if (this.draggedElement && this.dragOffset) {
            this.isDragging = true;
            
            const oldX = this.draggedElement.x;
            const oldY = this.draggedElement.y;
            
            const canvasWrapper = document.getElementById('canvasWrapper');
            const scale = this.stateManager.zoomLevel / 100;
            const wrapperRect = canvasWrapper.getBoundingClientRect();
            
            const scrolledX = e.clientX - wrapperRect.left;
            const scrolledY = e.clientY - wrapperRect.top;
            
            this.draggedElement.x = (scrolledX / scale) - this.dragOffset.x;
            this.draggedElement.y = (scrolledY / scale) - this.dragOffset.y;
            
            // Move child elements if dragging a package
            if (this.draggedElement.type === 'package' && typeof this.draggedElement.isInside === 'function') {
                const deltaX = this.draggedElement.x - oldX;
                const deltaY = this.draggedElement.y - oldY;
                
                this.stateManager.elements.forEach(element => {
                    if (this.draggedElement.isInside(element)) {
                        element.x += deltaX;
                        element.y += deltaY;
                    }
                });
            }
            
            this.stateManager.notifyObservers('elementDragging', this.draggedElement);
            this.stateManager.notifyObservers('stateChange'); // Trigger re-render
        } else if (this.isResizing && this.resizingElement) {
            const scale = this.stateManager.zoomLevel / 100;
            const newWidth = this.resizeStart.width + (e.clientX - this.resizeStart.x) / scale;
            const newHeight = this.resizeStart.height + (e.clientY - this.resizeStart.y) / scale;
            
            this.resizingElement.width = Math.max(100, newWidth);
            this.resizingElement.height = Math.max(80, newHeight);
            
            this.stateManager.notifyObservers('stateChange'); // Trigger re-render
        }
    }

    handleMouseUp() {
        if (this.draggedElement) {
            this.draggedElement.isDragging = false;
            this.stateManager.notifyObservers('elementDragEnd', this.draggedElement);
            
            if (this.isDragging) {
                this.stateManager.saveState();
            }
        }
        
        if (this.isResizing && this.resizingElement) {
            this.stateManager.saveState();
        }
        
        this.isDragging = false;
        this.draggedElement = null;
        this.dragOffset = null;
        this.isResizing = false;
        this.resizingElement = null;
        this.resizeStart = null;
    }

    handleResizeStart(e, element) {
        // Get the actual element from state manager
        const actualElement = this.stateManager.getElementById(element.id);
        if (!actualElement) return;
        
        this.isResizing = true;
        this.resizingElement = actualElement;
        this.resizeStart = {
            width: actualElement.width || 200,
            height: actualElement.height || 150,
            x: e.clientX,
            y: e.clientY
        };
    }

    showNameEditor(e, element) {
        // Get the actual element from state manager
        const actualElement = this.stateManager.getElementById(element.id);
        if (!actualElement) return;
        
        const g = document.getElementById(`element-${actualElement.id}`);
        const nameGroup = g.querySelector('.name-group');
        const svgHelper = this.canvasManager.svgHelper;
        
        const namePos = actualElement.getNamePosition(actualElement.name.split('\n'));
        const width = actualElement.type === 'package' ? (actualElement.width || 200) - 20 : 130;
        
        const foreign = svgHelper.createForeignObject(10, namePos.y - 10, width, 50);
        
        const textarea = document.createElement('textarea');
        textarea.className = 'text-area';
        textarea.value = actualElement.name;
        const originalName = actualElement.name;
        
        textarea.addEventListener('blur', () => {
            actualElement.name = textarea.value;
            foreign.remove();
            nameGroup.style.display = 'block';
            if (originalName !== actualElement.name) {
                this.stateManager.saveState();
            }
            this.stateManager.notifyObservers('stateChange');
        });
        
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                actualElement.name += '\n';
                textarea.value = actualElement.name;
            }
        });
        
        foreign.appendChild(textarea);
        g.appendChild(foreign);
        nameGroup.style.display = 'none';
        
        textarea.focus();
        textarea.select();
    }

    showColorPicker(e, element) {
        // Get the actual element from state manager
        const actualElement = this.stateManager.getElementById(element.id);
        if (!actualElement) return;
        
        const g = document.getElementById(`element-${actualElement.id}`);
        const svgHelper = this.canvasManager.svgHelper;
        
        const foreign = svgHelper.createForeignObject(10, 10, 100, 200);
        
        const picker = document.createElement('div');
        picker.className = 'color-picker';
        
        const grid = document.createElement('div');
        grid.className = 'color-grid';
        
        const colors = ['#FFFFFF', '#F0F0F0', '#D0D0D0', '#FFF2EB', '#FFE1E0', 
                       '#FFFFCC', '#DDF6D2', '#CAE8BD', '#B0DB9C', '#CCE5FF', 
                       '#A5BAE5', '#ADB2D4'];
        
        colors.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'color-option';
            colorDiv.style.backgroundColor = color;
            colorDiv.addEventListener('click', () => {
                actualElement.color = color;
                foreign.remove();
                this.stateManager.saveState();
                this.stateManager.notifyObservers('stateChange');
            });
            grid.appendChild(colorDiv);
        });
        
        picker.appendChild(grid);
        foreign.appendChild(picker);
        g.appendChild(foreign);
        
        setTimeout(() => {
            const closeHandler = (e) => {
                if (!foreign.contains(e.target)) {
                    foreign.remove();
                    document.removeEventListener('click', closeHandler);
                }
            };
            document.addEventListener('click', closeHandler);
        }, 100);
    }

    showLabelEditor(e, connection) {
        // Get the actual connection from state manager
        const actualConnection = this.stateManager.getConnection(connection.id);
        if (!actualConnection) return;
        
        const g = document.getElementById(`connection-${actualConnection.id}`);
        const label = g.querySelector('.connection-label');
        const rect = label.getBoundingClientRect();
        const canvasRect = this.canvasManager.canvas.getBoundingClientRect();
        const svgHelper = this.canvasManager.svgHelper;
        
        const foreign = svgHelper.createForeignObject(
            rect.left - canvasRect.left - 75,
            rect.top - canvasRect.top - 10,
            150,
            25
        );
        
        const input = document.createElement('input');
        input.className = 'text-input';
        input.value = actualConnection.label || '';
        const originalLabel = actualConnection.label;
        
        input.addEventListener('blur', () => {
            actualConnection.label = input.value;
            foreign.remove();
            if (originalLabel !== actualConnection.label) {
                this.stateManager.saveState();
            }
            this.stateManager.notifyObservers('stateChange');
        });
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                input.blur();
            }
        });
        
        foreign.appendChild(input);
        this.canvasManager.canvas.appendChild(foreign);
        
        input.focus();
        input.select();
    }
}