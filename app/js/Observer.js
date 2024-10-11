///@ts-check

class Observer {
    /**@type {{value: any, callback: any}[]}*/ observers;

    constructor() {
        this.observers = [];
    }
    /**
     * 
     * @param {any} value 
     * @param {function} callback 
     */
    watchValue(value, callback) {
        Object.defineProperty(o, p, attributes)

        let obj = { value: value, callback: callback };
        this.observers.push(obj);
    }
}


class Property {
    /** @type {any}*/ _property

    get property() {
        return this._property;
    }

    set property(value) {
        this._property = value;
        this.executeEvents();
    }

    /** @type {function[]} */ events = [];
    addEventListener(event) {
        this.events.push(event);
    }

    executeEvents() {
        for (let i = 0; i < this.events.length; i++) {
            this.events[i]();
        }
    }

    constructor(value = null) {
        this._property = value;


    }

    get() { return this._property;}
    
    set(value) { this.property = value;}
}