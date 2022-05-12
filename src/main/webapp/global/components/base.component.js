/* eslint-disable class-methods-use-this */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */

import LOGGER from "../loggers/logger";

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

    /**
     * @deprecated
     */
    classList() {
        LOGGER.warn("BaseComponent.classList() is deprecated. Use BaseComponent.getClassList() instead.");
        return this.element.classList;
    }

    /**
     * @deprecated
     * @param {String} text
     */
    innerText(text) {
        LOGGER.warn("BaseComponent.innerText() is deprecated. Use BaseComponent.setInnerText() instead.");
        this.element.innerText = text;
        return this;
    }

    /**
     * @deprecated
     * @param {String} html
     */
    innerHTML(html) {
        LOGGER.warn("BaseComponent.innerHTML() is deprecated. Use BaseComponent.setInnerHTML() instead.");
        this.element.innerHTML = html;
        return this;
    }

    getClassList() {
        return this.element.classList;
    }

    setInnerText(text) {
        this.element.innerText = text;
        return this;
    }

    setTextContent(text) {
        this.element.textContent = text;
        return this;
    }

    setInnerHTML(html) {
        this.element.innerHTML = html;
        return this;
    }

    getInnerText() {
        return this.element.innerText;
    }

    getTextContent() {
        return this.element.textContent;
    }

    focus() {
        this.element.focus();
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
            return this.parentComponent.onNotify(eventName, data);
        }
        return null;
    }

    onNotify(eventName, data) {
        const handlers = this.notifyListeners.get(eventName);
        if (!handlers) {
            // eslint-disable-next-line no-console
            console.warn(`${this}: No handler for event: ${eventName}`);
            return [];
        }
        const outputs = [];
        for (const handler of handlers) {
            const output = handler(data);
            outputs.push(output);
        }
        return outputs;
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
        this.onNotify("remove");
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
