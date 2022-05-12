import { dce } from "../utils/dom.utils";
import BaseComponent from "./base.component";
import OptionComponent from "./option.component";

export default class SelectComponent extends BaseComponent {
    constructor(element) {
        super(element || dce("select"));
    }

    getValue() {
        return this.element.value;
    }

    addOption(name, value) {
        const option = new OptionComponent();
        option.update(name, value);
        this.appendChild(option);
        return this;
    }
}
