export class StateManager {
    constructor() {
        this.elements = [];
        this.connections = [];
        this.nextId = 1;
        this.history = [];
        this.historyIndex = -1;
        this.maxHistorySize = 20;
        this.isConnecting = false;
        this.connectingFrom = null;
        this.selectedConnectionType = 'association';
        this.isPresentationMode = false;
        this.showFaces = true;
        this.zoomLevel = 100;
        this.elementFactory = null; // Will be set by main app
    }

    // State management
    saveState() {
        // Convert elements to plain objects for storage
        const elementsData = this.elements.map(el => {
            if (typeof el.toObject === 'function') {
                return el.toObject();
            }
            // If it's already a plain object
            return {
                id: el.id,
                type: el.type,
                name: el.name,
                x: el.x,
                y: el.y,
                width: el.width,
                height: el.height,
                color: el.color,
                stroke: el.stroke
            };
        });

        this.history.splice(this.historyIndex + 1);
        this.history.push({
            elements: JSON.parse(JSON.stringify(elementsData)),
            connections: JSON.parse(JSON.stringify(this.connections)),
            nextId: this.nextId
        });
        
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }
        
        this.notifyObservers('historyChange');
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.restoreState(this.history[this.historyIndex]);
            this.notifyObservers('stateChange');
            this.notifyObservers('historyChange');
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.restoreState(this.history[this.historyIndex]);
            this.notifyObservers('stateChange');
            this.notifyObservers('historyChange');
        }
    }

    restoreState(state) {
        // Convert plain objects back to Element instances
        if (this.elementFactory) {
            this.elements = state.elements.map(el => 
                this.elementFactory.createFromObject(el)
            );
        } else {
            this.elements = JSON.parse(JSON.stringify(state.elements));
        }
        this.connections = JSON.parse(JSON.stringify(state.connections));
        this.nextId = state.nextId;
    }

    // Element management
    addElement(elementClass, x, y) {
        const element = new elementClass(this.nextId++, x, y);
        this.elements.push(element);
        this.saveState();
        this.notifyObservers('elementAdded', element);
        return element;
    }

    deleteElement(id) {
        this.elements = this.elements.filter(el => el.id !== id);
        this.connections = this.connections.filter(conn => conn.from !== id && conn.to !== id);
        this.saveState();
        this.notifyObservers('elementDeleted', id);
    }

    updateElement(id, updates) {
        const element = this.elements.find(el => el.id === id);
        if (element) {
            Object.assign(element, updates);
            this.notifyObservers('elementUpdated', element);
        }
    }

    // Set elements directly (used when loading from XML)
    setElements(elements) {
        this.elements = elements;
    }

    setConnections(connections) {
        this.connections = connections;
    }

    // Connection management
    addConnection(fromId, toId, type, label = '') {
        const connection = {
            id: this.nextId++,
            from: fromId,
            to: toId,
            type: type,
            label: label
        };
        this.connections.push(connection);
        this.saveState();
        this.notifyObservers('connectionAdded', connection);
        return connection;
    }

    deleteConnection(id) {
        this.connections = this.connections.filter(conn => conn.id !== id);
        this.saveState();
        this.notifyObservers('connectionDeleted', id);
    }

    // Observer pattern
    observers = new Map();

    subscribe(event, callback) {
        if (!this.observers.has(event)) {
            this.observers.set(event, []);
        }
        this.observers.get(event).push(callback);
    }

    notifyObservers(event, data) {
        if (this.observers.has(event)) {
            this.observers.get(event).forEach(callback => callback(data));
        }
    }

    // Getters
    getElementById(id) {
        return this.elements.find(el => el.id === id);
    }

    getConnection(id) {
        return this.connections.find(conn => conn.id === id);
    }

    canUndo() {
        return this.historyIndex > 0;
    }

    canRedo() {
        return this.historyIndex < this.history.length - 1;
    }
}