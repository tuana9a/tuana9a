import { dce } from "../utils/dom.utils";
import BaseComponent from "./base.component";

export default class OptionComponent extends BaseComponent {
    constructor(element) {
        super(element || dce("option"));
    }

    update(name, value) {
        this.setInnerText(name);
        this.element.value = value;
        return this;
    }
}
