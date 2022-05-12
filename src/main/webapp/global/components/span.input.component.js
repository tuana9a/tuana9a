import { dce } from "../utils/dom.utils";
import BaseComponent from "./base.component";

export default class SpanInputComponent extends BaseComponent {
    constructor(element = dce("span")) {
        super(element);
        this.element.setAttribute("contenteditable", "true");
        this.binds = [];
    }

    getValue() {
        return this.getInnerText();
    }

    setValue(value) {
        this.setInnerText(value);
        this.onChange(value);
        return this.getValue();
    }

    // eslint-disable-next-line class-methods-use-this
    normalizeValue(value) {
        return String(value).trim();
    }

    onChange(value) {
        const normalizedValue = this.normalizeValue(value);
        this.binds.forEach((handler) => handler(normalizedValue));
    }

    bind(handler) {
        const thiss = this;
        this.binds.push(handler);
        this.addEventListener("input", () => {
            const value = thiss.getValue();
            thiss.setValue(value);
        });
        return this;
    }

    remove() {
        super.remove();
        this.binds = null;
    }
}
