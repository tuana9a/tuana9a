import BaseComponent from "../../../global/components/base.component";
import SuggestComponent from "./suggest.component";

export default class TypingComponent extends BaseComponent {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super(element);
        this.getClassList().add("TypingCommand", "display-flex", "align-items-center");

        this.container = new BaseComponent(document.createElement("div"));
        this.container.getClassList().add("TypingCommandContainer", "position-relative");
        this.appendChild(this.container);

        this.input = new BaseComponent(document.createElement("input"));
        this.input.getClassList().add("TypingCommandValue", "position-relative");
        this.input.element.autocomplete = "off";
        this.input.element.type = "text";
        this.input.element.placeholder = "type here";

        this.container.appendChild(this.input);
        const thiss = this;
        this.suggest = new SuggestComponent({
            maxEntryCount: 20,
            onchoose(value) {
                thiss.set(value);
            },
        });
        this.container.appendChild(this.suggest);
    }

    set(value = "") {
        this.input.element.value = value;
    }

    value() {
        // eslint-disable-next-line prefer-destructuring
        const value = this.input.element.value;
        return value;
    }
}
