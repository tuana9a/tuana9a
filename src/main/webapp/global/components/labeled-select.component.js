import BaseComponent from "./base.component";
import SelectComponent from "./select.component";

export default class LabeledSelectComponent extends BaseComponent {
    constructor(element) {
        super(element);
        this.label = new BaseComponent(document.createElement("label"));
        this.select = new SelectComponent();
        this.appendChild(this.label);
        this.appendChild(this.select);
    }

    setName(name) {
        this.label.setInnerText(name);
    }
}
