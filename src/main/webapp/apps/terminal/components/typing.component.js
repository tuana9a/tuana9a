import BaseComponent from "../../../global/components/base.component";
import SpanInputComponent from "../../../global/components/span.input.component";
import { dce } from "../../../global/utils/dom.utils";
import SuggestComponent from "./suggest.component";

export default class TypingComponent extends BaseComponent {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super(element);
        this.getClassList().add("Typing", "display-flex", "align-items-center", "position-relative");

        this.username = new BaseComponent(dce("span")).setInnerText("root");
        this.hostname = new BaseComponent(dce("span")).setInnerText("localhost");
        this.cwd = new BaseComponent(dce("span")).setInnerText("~");
        this.commandSign = new BaseComponent(dce("span")).setInnerText("$");
        this.prefixContainer = new BaseComponent(dce("div"));
        this.prefixContainer.getClassList().add("PrefixContainer");

        this.input = new SpanInputComponent();
        const thiss = this;
        this.suggest = new SuggestComponent({
            maxEntryCount: 20,
            onchoose(value) {
                thiss.setValue(value);
            },
        });
        this.inputContainer = new BaseComponent(dce("div"));
        this.inputContainer.getClassList().add("InputContainer");
        this.input.getClassList().add("InputCommand");
        this.input.getElement().autocomplete = "off";

        this.prefixContainer.appendChild(
            this.username,
            new BaseComponent(dce("span")).setInnerText("@"),
            this.hostname,
            new BaseComponent(dce("span")).setInnerText(":"),
            this.cwd,
            this.commandSign,
        );
        this.inputContainer.appendChild(this.input);
        this.appendChild(this.prefixContainer);
        this.appendChild(this.inputContainer);
        this.appendChild(this.suggest);
    }

    setValue(value = "") {
        this.input.setValue(value);
    }

    getValue() {
        // eslint-disable-next-line prefer-destructuring
        const value = this.input.getValue();
        return value;
    }
}
