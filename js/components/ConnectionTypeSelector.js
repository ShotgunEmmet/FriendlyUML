import { CONNECTION_TYPES } from '../constants/types.js';

export class ConnectionTypeSelector {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.selectedType = 'association';
        this.onTypeSelected = null;
    }

    render() {
        this.container.innerHTML = `
            <h4>Connection Type</h4>
            ${this.createConnectionTypes()}
        `;

        this.attachEventListeners();
    }

    createConnectionTypes() {
        const types = [
            { type: 'association', label: 'Association', preview: this.getAssociationPreview() },
            { type: 'dependency', label: 'Dependency', preview: this.getDependencyPreview() },
            { type: 'aggregation', label: 'Aggregation', preview: this.getAggregationPreview() },
            { type: 'composition', label: 'Composition', preview: this.getCompositionPreview() },
            { type: 'inheritance', label: 'Inheritance', preview: this.getInheritancePreview() },
            { type: 'realization', label: 'Realization', preview: this.getRealizationPreview() },
            { type: 'dataflow', label: 'Data Flow', preview: this.getDataflowPreview() },
            { type: 'bidirectional', label: 'Bidirectional', preview: this.getBidirectionalPreview() }
        ];

        return types.map(({type, label, preview}) => `
            <div class="connection-type-item ${type === this.selectedType ? 'active' : ''}" 
                 data-type="${type}">
                ${preview}
                ${label}
            </div>
        `).join('');
    }

    attachEventListeners() {
        this.container.querySelectorAll('.connection-type-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectedType = item.dataset.type;
                
                // Update active state
                this.container.querySelectorAll('.connection-type-item').forEach(i => {
                    i.classList.remove('active');
                });
                item.classList.add('active');
                
                if (this.onTypeSelected) {
                    this.onTypeSelected(this.selectedType);
                }
            });
        });
    }

    setVisible(visible) {
        if (visible) {
            this.container.classList.add('visible');
        } else {
            this.container.classList.remove('visible');
        }
    }

    setPresentationMode(isPresentationMode) {
        if (isPresentationMode) {
            this.container.classList.add('presentation-mode');
        } else {
            this.container.classList.remove('presentation-mode');
        }
    }

    // Preview methods
    getAssociationPreview() {
        return `<svg class="connection-type-preview" viewBox="0 0 40 20">
            <line x1="5" y1="10" x2="35" y2="10" stroke="#4A4A4A" stroke-width="2"/>
        </svg>`;
    }

    getDependencyPreview() {
        return `<svg class="connection-type-preview" viewBox="0 0 40 20">
            <line x1="5" y1="10" x2="30" y2="10" stroke="#4A4A4A" stroke-width="2" stroke-dasharray="3,3"/>
            <polygon points="35,10 30,7 30,13" fill="#4A4A4A"/>
        </svg>`;
    }

    getAggregationPreview() {
        return `<svg class="connection-type-preview" viewBox="0 0 40 20">
            <line x1="15" y1="10" x2="35" y2="10" stroke="#4A4A4A" stroke-width="2"/>
            <polygon points="5,10 10,7 15,10 10,13" fill="white" stroke="#4A4A4A" stroke-width="2"/>
        </svg>`;
    }

    getCompositionPreview() {
        return `<svg class="connection-type-preview" viewBox="0 0 40 20">
            <line x1="15" y1="10" x2="35" y2="10" stroke="#4A4A4A" stroke-width="2"/>
            <polygon points="5,10 10,7 15,10 10,13" fill="#4A4A4A" stroke="#4A4A4A" stroke-width="2"/>
        </svg>`;
    }

    getInheritancePreview() {
        return `<svg class="connection-type-preview" viewBox="0 0 40 20">
            <line x1="5" y1="10" x2="30" y2="10" stroke="#4A4A4A" stroke-width="2"/>
            <polygon points="35,10 30,7 30,13" fill="white" stroke="#4A4A4A" stroke-width="2"/>
        </svg>`;
    }

    getRealizationPreview() {
        return `<svg class="connection-type-preview" viewBox="0 0 40 20">
            <line x1="5" y1="10" x2="30" y2="10" stroke="#4A4A4A" stroke-width="2" stroke-dasharray="3,3"/>
            <polygon points="35,10 30,7 30,13" fill="white" stroke="#4A4A4A" stroke-width="2"/>
        </svg>`;
    }

    getDataflowPreview() {
        return `<svg class="connection-type-preview" viewBox="0 0 40 20">
            <line x1="5" y1="10" x2="30" y2="10" stroke="#4A4A4A" stroke-width="2"/>
            <polygon points="35,10 30,7 30,13" fill="#4A4A4A"/>
        </svg>`;
    }

    getBidirectionalPreview() {
        return `<svg class="connection-type-preview" viewBox="0 0 40 20">
            <line x1="10" y1="10" x2="30" y2="10" stroke="#4A4A4A" stroke-width="2"/>
            <polygon points="5,10 10,7 10,13" fill="#4A4A4A"/>
            <polygon points="35,10 30,7 30,13" fill="#4A4A4A"/>
        </svg>`;
    }
}