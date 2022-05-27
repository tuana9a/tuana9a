import BaseComponent from "../../../global/components/base.component";
import SpanInputComponent from "../../../global/components/span.input.component";
import { dce } from "../../../global/utils/dom.utils";
import WindowComponent from "../../../kernel/components/window.component";

/**
 * Thanks to https://stackoverflow.com/a/16548229/10459230
 * @param {Number} len
 */
function generate(len, opts = {
    number: true, lowercase: true, uppercase: true, special: true,
}) {
    const length = Math.max(Math.min((len) || (10), 20), 8);
    const lowers = "abcdefghijklmnopqrstuvwxyz"; // to upper
    const uppers = lowers.toUpperCase();
    const numerics = "0123456789";
    const specials = "!@#$%^&*()_+~|}{[]:;?><,.-=";
    let password = "";
    let character = "";
    // const crunch = true;
    while (password.length < length) {
        const lowerIdx = Math.ceil(lowers.length * Math.random() * Math.random());
        const upperIdx = Math.ceil(uppers.length * Math.random() * Math.random());
        const numericIdx = Math.ceil(numerics.length * Math.random() * Math.random());
        const specialIdx = Math.ceil(specials.length * Math.random() * Math.random());
        if (opts.lowercase) character += lowers.charAt(lowerIdx);
        if (opts.uppercase) character += uppers.charAt(upperIdx);
        if (opts.number) character += numerics.charAt(numericIdx);
        if (opts.special) character += specials.charAt(specialIdx);
        password = character;
    }
    password = password.split("").sort(() => 0.5 - Math.random()).join("");
    return password.substring(0, len);
}

export default class PasswordGenerator extends WindowComponent {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super(element);
        this.getClassList().add("PasswordGenerator");
        this.value = new BaseComponent(dce("span"));
        this.value.getClassList().add("Value");
        this.value.setInnerText(generate());
        this.lengthLabel = new BaseComponent(dce("label"));
        this.lengthLabel.setInnerText("Length=");
        this.inputLength = new SpanInputComponent();
        this.inputLength.setValue(10);
        this.button = new BaseComponent(dce("button"));
        this.button.addEventListener("click", this.onClick.bind(this));
        this.inputLength.addEventListener("input", this.onClick.bind(this));
        this.button.setInnerText("Generate");
        this.body.appendChild(this.lengthLabel);
        this.body.appendChild(this.inputLength);
        this.body.appendChild(this.button);
        this.body.appendChild(this.value);
    }

    onClick() {
        this.value.setInnerText(generate(this.inputLength.getValue()));
    }
}
