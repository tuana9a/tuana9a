import { dce } from "../utils/dom.utils";
import BaseComponent from "./base.component";

export default class SpanInputComponent extends BaseComponent {
    constructor(element = dce("span")) {
        super(element);
        this.element.setAttribute("contenteditable", "true");
        this.binds = [];
        const getValue = this.getValue.bind(this);
        const onChange = this.onChange.bind(this);
        this.addEventListener("input", () => onChange(getValue()));
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
        this.binds.push(handler);
        return this;
    }

    remove() {
        super.remove();
        this.binds = null;
    }
}
