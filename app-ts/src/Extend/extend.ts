export class ExtendedWebSocket extends WebSocket {
    /** @param {Record<string,string>} obj*/
    sendJson(obj) {
        this.send(JSON.stringify(obj));
    }
}

export class ExtendFunction {
    static uuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

}

declare global {
    interface Element {
        getFirstHTMLElementByClassName(className: string): HTMLElement;
        getFirstTextAreaElementByClassName(className: string): HTMLTextAreaElement;
    }
}

Element.prototype.getFirstHTMLElementByClassName = function (className: string): HTMLElement {
    const element = this.getElementsByClassName(className)[0];
    if (!element) {
        throw new Error(`Element with class name ${className} not found`);
    }
    if (!(element instanceof HTMLElement)) {
        throw new Error(`Element with class name ${className} is not an HTMLElement`);
    }
    return element;
};

Element.prototype.getFirstTextAreaElementByClassName = function (className: string): HTMLTextAreaElement {
    const element = this.getElementsByClassName(className)[0];
    if (!element) {
        throw new Error(`Element with class name ${className} not found`);
    }
    if (!(element instanceof HTMLTextAreaElement)) {
        throw new Error(`Element with class name ${className} is not an HTMLTextAreaElement`);
    }
    return element;
};

