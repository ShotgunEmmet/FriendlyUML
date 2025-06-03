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
        
        this.draggedElement = element;
        const canvasWrapper = document.getElementById('canvasWrapper');
        const scale = this.stateManager.zoomLevel / 100;
        
        const wrapperRect = canvasWrapper.getBoundingClientRect();
        const scrolledX = e.clientX - wrapperRect.left;
        const scrolledY = e.clientY - wrapperRect.top;
        
        const canvasX = scrolledX / scale;
        const canvasY = scrolledY / scale;
        
        this.dragOffset = {
            x: canvasX - element.x,
            y: canvasY - element.y
        };
        
        element.isDragging = true;
        this.stateManager.notifyObservers('elementDragStart', element);
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
            if (this.draggedElement.type === 'package') {
                const deltaX = this.draggedElement.x - oldX;
                const deltaY = this.draggedElement.y - oldY;
                
                this.stateManager.elements.forEach(element => {
                    if (this.draggedElement.isInside && this.draggedElement.isInside(element)) {
                        element.x += deltaX;
                        element.y += deltaY;
                    }
                });
            }
            
            this.stateManager.notifyObservers('elementDragging', this.draggedElement);
            this.canvasManager.render(
                this.stateManager.elements,
                this.stateManager.connections,
                this.stateManager.showFaces,
                this.stateManager.isPresentationMode
            );
        } else if (this.isResizing && this.resizingElement) {
            const scale = this.stateManager.zoomLevel / 100;
            const newWidth = this.resizeStart.width + (e.clientX - this.resizeStart.x) / scale;
            const newHeight = this.resizeStart.height + (e.clientY - this.resizeStart.y) / scale;
            
            this.resizingElement.width = Math.max(100, newWidth);
            this.resizingElement.height = Math.max(80, newHeight);
            
            this.canvasManager.render(
                this.stateManager.elements,
                this.stateManager.connections,
                this.stateManager.showFaces,
                this.stateManager.isPresentationMode
            );
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
        this.isResizing = true;
        this.resizingElement = element;
        this.resizeStart = {
            width: element.width || 200,
            height: element.height || 150,
            x: e.clientX,
            y: e.clientY
        };
    }

    showNameEditor(e, element) {
        const g = document.getElementById(`element-${element.id}`);
        const nameGroup = g.querySelector('.name-group');
        const svgHelper = this.canvasManager.svgHelper;
        
        const namePos = element.getNamePosition(element.name.split('\n'));
        const width = element.type === 'package' ? (element.width || 200) - 20 : 130;
        
        const foreign = svgHelper.createForeignObject(10, namePos.y - 10, width, 50);
        
        const textarea = document.createElement('textarea');
        textarea.className = 'text-area';
        textarea.value = element.name;
        const originalName = element.name;
        
        textarea.addEventListener('blur', () => {
            element.name = textarea.value;
            foreign.remove();
            nameGroup.style.display = 'block';
            if (originalName !== element.name) {
                this.stateManager.saveState();
            }
            this.canvasManager.render(
                this.stateManager.elements,
                this.stateManager.connections,
                this.stateManager.showFaces,
                this.stateManager.isPresentationMode
            );
        });
        
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                element.name += '\n';
                textarea.value = element.name;
            }
        });
        
        foreign.appendChild(textarea);
        g.appendChild(foreign);
        nameGroup.style.display = 'none';
        
        textarea.focus();
        textarea.select();
    }

    showColorPicker(e, element) {
        const g = document.getElementById(`element-${element.id}`);
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
                element.color = color;
                foreign.remove();
                this.stateManager.saveState();
                this.canvasManager.render(
                    this.stateManager.elements,
                    this.stateManager.connections,
                    this.stateManager.showFaces,
                    this.stateManager.isPresentationMode
                );
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
        const g = document.getElementById(`connection-${connection.id}`);
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
        input.value = connection.label || '';
        const originalLabel = connection.label;
        
        input.addEventListener('blur', () => {
            connection.label = input.value;
            foreign.remove();
            if (originalLabel !== connection.label) {
                this.stateManager.saveState();
            }
            this.canvasManager.render(
                this.stateManager.elements,
                this.stateManager.connections,
                this.stateManager.showFaces,
                this.stateManager.isPresentationMode
            );
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