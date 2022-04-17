/* eslint-disable class-methods-use-this */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */

let epoch = 0;

export default class BaseComponent {
    /**
     * @param {Element} element
     */
    constructor(element) {
        this.id = `${epoch}`;
        this.element = element;
        this.notifyListeners = new Map();
        this.eventListeners = new Map();
        this.childComponents = new Map();
        epoch += 1;
    }

    /**
     * @param {String} id
     */
    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    style(style) {
        for (const key in style) {
            this.element.style[key] = style[key];
        }
        return this;
    }

    getElement() {
        return this.element;
    }

    /**
     * @param {BaseComponent} component
     */
    setParentComponent(component) {
        this.parentComponent = component;
    }

    classList() {
        return this.element.classList;
    }

    innerText(text) {
        this.element.innerText = text;
        return this;
    }

    innerHTML(html) {
        this.element.innerHTML = html;
        return this;
    }

    /**
     * @param {BaseComponent[]} components
     */
    appendChild(...components) {
        for (const component of components) {
            component.setParentComponent(this);
            this.element.appendChild(component.getElement());
            this.replaceChildById(component.id, component);
        }
        return this;
    }

    /**
     * @param {String} id
     * @param {BaseComponent} component
     */
    replaceChildById(id, component) {
        if (this.childComponents.has(id)) {
            const existComponent = this.childComponents.get(id);
            existComponent.remove();
        }
        this.childComponents.set(id, component);
    }

    /**
     * @param {BaseComponent} component
     */
    removeChild(component) {
        this.removeChildById(component.id);
    }

    /**
     * @param {String} id
     */
    removeChildById(id) {
        if (this.childComponents.has(id)) {
            const existComponent = this.childComponents.get(id);
            existComponent.remove();
            this.childComponents.delete(id);
        }
    }

    notifyParent(eventName, data) {
        if (this.parentComponent) {
            this.parentComponent.onNotify(eventName, data);
        }
    }

    onNotify(eventName, data) {
        const handlers = this.notifyListeners.get(eventName);
        if (!handlers) {
            // eslint-disable-next-line no-console
            console.warn(`${this}: No handler for event: ${eventName}`);
            return;
        }
        for (const handler of handlers) {
            handler(data);
        }
    }

    // eslint-disable-next-line no-console
    addNotifyListener(eventName, handler = (data) => console.log(data)) {
        if (!this.notifyListeners.has(eventName)) {
            this.notifyListeners.set(eventName, []);
        }
        this.notifyListeners.get(eventName).push(handler);
    }

    removeNotifyListener(eventName) {
        this.notifyListeners.delete(eventName);
    }

    addEventListener(eventName, handler, options) {
        if (!this.eventListeners.has(eventName)) {
            this.eventListeners.set(eventName, []);
        }
        this.element.addEventListener(eventName, handler, options);
        this.eventListeners.get(eventName).push(handler);
    }

    removeEventListener(eventName) {
        const handlers = this.eventListeners.get(eventName);
        if (!handlers) return;
        for (const handler of handlers) {
            this.element.removeEventListener(eventName, handler);
        }
        this.eventListeners.delete(eventName);
    }

    remove() {
        this.parentComponent = null;
        for (const eventName of this.notifyListeners.keys()) {
            this.removeNotifyListener(eventName);
        }
        for (const eventName of this.eventListeners.keys()) {
            this.removeEventListener(eventName);
        }
        for (const id of this.childComponents.keys()) {
            this.removeChildById(id);
        }
        // clear
        this.notifyListeners.clear();
        this.eventListeners.clear();
        this.childComponents.clear();
        // assign null
        this.notifyListeners = null;
        this.eventListeners = null;
        this.childComponents = null;
        // remove element
        this.element.remove();
    }
}
