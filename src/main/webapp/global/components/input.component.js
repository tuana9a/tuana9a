import BaseComponent from "./base.component";

export default class InputComponent extends BaseComponent {
    constructor(element = document.createElement("input")) {
        super(element);
    }

    setType(type) {
        this.element.type = type;
    }

    setPlaceHolder(placeHolder) {
        this.element.placeholder = placeHolder;
    }

    value(value) {
        if (value) {
            this.element.value = value;
            return this;
        }
        return this.element.value;
    }
}
