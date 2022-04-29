import BaseComponent from "./base.component";

export default class InputComponent extends BaseComponent {
    constructor(element = document.createElement("input")) {
        super(element);
        this.binds = [];
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
