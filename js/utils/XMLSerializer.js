export class UMLXMLSerializer {
    serialize(stateManager) {
        const xmlDoc = document.implementation.createDocument('', '', null);
        const root = xmlDoc.createElement('uml-diagram');
        
        // Save elements
        const elementsNode = xmlDoc.createElement('elements');
        stateManager.elements.forEach(el => {
            const elementNode = xmlDoc.createElement('element');
            elementNode.setAttribute('id', el.id);
            elementNode.setAttribute('type', el.type);
            elementNode.setAttribute('name', el.name);
            elementNode.setAttribute('x', el.x);
            elementNode.setAttribute('y', el.y);
            if (el.width) elementNode.setAttribute('width', el.width);
            if (el.height) elementNode.setAttribute('height', el.height);
            if (el.color) elementNode.setAttribute('color', el.color);
            if (el.stroke) elementNode.setAttribute('stroke', el.stroke);
            elementsNode.appendChild(elementNode);
        });
        root.appendChild(elementsNode);
        
        // Save connections
        const connectionsNode = xmlDoc.createElement('connections');
        stateManager.connections.forEach(conn => {
            const connectionNode = xmlDoc.createElement('connection');
            connectionNode.setAttribute('id', conn.id);
            connectionNode.setAttribute('from', conn.from);
            connectionNode.setAttribute('to', conn.to);
            connectionNode.setAttribute('type', conn.type || 'association');
            if (conn.label) connectionNode.setAttribute('label', conn.label);
            connectionsNode.appendChild(connectionNode);
        });
        root.appendChild(connectionsNode);
        
        // Save metadata
        const metadataNode = xmlDoc.createElement('metadata');
        metadataNode.setAttribute('nextId', stateManager.nextId);
        metadataNode.setAttribute('version', '1.0');
        root.appendChild(metadataNode);
        
        xmlDoc.appendChild(root);
        
        const serializer = new window.XMLSerializer();
        return serializer.serializeToString(xmlDoc);
    }

    deserialize(xmlString, stateManager) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
        
        // Clear existing data
        stateManager.elements = [];
        stateManager.connections = [];
        
        // Load elements
        const elementNodes = xmlDoc.querySelectorAll('element');
        let maxId = 0;
        
        elementNodes.forEach(node => {
            const id = parseInt(node.getAttribute('id'));
            maxId = Math.max(maxId, id);
            
            const element = {
                id,
                type: node.getAttribute('type'),
                name: node.getAttribute('name') || '',
                x: parseFloat(node.getAttribute('x')),
                y: parseFloat(node.getAttribute('y')),
                isDragging: false,
                isSad: false
            };
            
            if (node.hasAttribute('width')) element.width = parseFloat(node.getAttribute('width'));
            if (node.hasAttribute('height')) element.height = parseFloat(node.getAttribute('height'));
            if (node.hasAttribute('color')) element.color = node.getAttribute('color');
            if (node.hasAttribute('stroke')) element.stroke = node.getAttribute('stroke');
            
            stateManager.elements.push(element);
        });
        
        // Load connections
        const connectionNodes = xmlDoc.querySelectorAll('connection');
        connectionNodes.forEach(node => {
            const id = parseInt(node.getAttribute('id'));
            maxId = Math.max(maxId, id);
            
            stateManager.connections.push({
                id,
                from: parseInt(node.getAttribute('from')),
                to: parseInt(node.getAttribute('to')),
                type: node.getAttribute('type') || 'association',
                label: node.getAttribute('label') || ''
            });
        });
        
        // Load metadata
        const metadataNode = xmlDoc.querySelector('metadata');
        if (metadataNode && metadataNode.hasAttribute('nextId')) {
            stateManager.nextId = parseInt(metadataNode.getAttribute('nextId'));
        } else {
            stateManager.nextId = maxId + 1;
        }
    }
}