import LOGGER from "../loggers/logger";
import { dce } from "../utils/dom.utils";
import BaseComponent from "./base.component";

export default class InputComponent extends BaseComponent {
    constructor(element = dce("input")) {
        super(element);
        this.binds = [];
        const getValue = this.getValue.bind(this);
        const onChange = this.onChange.bind(this);
        this.addEventListener("input", () => onChange(getValue()));
    }

    setType(type) {
        this.element.type = type;
    }

    setPlaceHolder(placeHolder) {
        this.element.placeholder = placeHolder;
    }

    setMax(max) {
        this.max = max;
        this.element.max = max;
    }

    setMin(min) {
        this.min = min;
        this.element.min = min;
    }

    setStep(step) {
        this.element.step = step;
    }

    /**
     * @deprecated
     * @param {*} value
     */
    value(value) {
        LOGGER.warn("InputComponent.value() is deprecated. Use InputComponent.setValue() instead.");
        if (value) {
            this.element.value = value;
            return this;
        }
        return this.element.value;
    }

    getValue() {
        return this.element.value;
    }

    normalizeValue(value) {
        if (this.max && value > this.max) {
            return this.max;
        }
        if (this.min && value < this.min) {
            return this.min;
        }
        return value;
    }

    setValue(value) {
        this.element.value = value;
        this.onChange(value);
        return this.element.value;
    }

    onChange(value) {
        const normalizedValue = this.normalizeValue(value);
        this.binds.forEach((handler) => handler(normalizedValue));
    }

    watch(handler) {
        this.binds.push(handler);
        return this;
    }

    remove() {
        super.remove();
        this.binds = null;
    }
}
