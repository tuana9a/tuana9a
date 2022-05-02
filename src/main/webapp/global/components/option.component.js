import BaseComponent from "./base.component";

export default class OptionComponent extends BaseComponent {
    constructor(element) {
        super(element || document.createElement("option"));
    }

    update(name, value) {
        this.setInnerText(name);
        this.element.value = value;
        return this;
    }
}
