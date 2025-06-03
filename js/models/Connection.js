export class Connection {
    constructor(id, from, to, type = 'association', label = '') {
        this.id = id;
        this.from = from;
        this.to = to;
        this.type = type;
        this.label = label;
    }

    toObject() {
        return {
            id: this.id,
            from: this.from,
            to: this.to,
            type: this.type,
            label: this.label
        };
    }

    static fromObject(obj) {
        return new Connection(obj.id, obj.from, obj.to, obj.type, obj.label);
    }
}