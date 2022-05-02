import BaseComponent from "./base.component";
import InputComponent from "./input.component";

export default class LabeledInputComponent extends BaseComponent {
    constructor(element) {
        super(element);
        this.label = new BaseComponent(document.createElement("label"));
        this.input = new InputComponent();
        this.appendChild(this.label);
        this.appendChild(this.input);
    }

    setName(name) {
        this.label.setInnerText(name);
        return this;
    }
}
