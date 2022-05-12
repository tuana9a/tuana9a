import BaseComponent from "../../../global/components/base.component";
import { dce } from "../../../global/utils/dom.utils";

export default class SuggestEntryComponent extends BaseComponent {
    /**
     * @param {String} value
     */
    constructor(value) {
        super(dce("div"));
        this.value = value || "";
        this.isEnable = false;
        // element
        this.getClassList().add("SuggestEntry", "display-flex", "align-items-center");
        // text element
        this.text = new BaseComponent(dce("span"));
        this.text.getClassList().add("SuggestEntryValue");
        this.text.setInnerText(value);
        this.appendChild(this.text);
    }

    update(value) {
        this.value = value;
    }

    render() {
        this.text.setInnerHTML(this.value.replace(/\s/g, "&nbsp;"));
    }

    choose() {
        return this.value;
    }

    enable() {
        this.element.style.display = null;
        this.isEnable = true;
    }

    disable() {
        this.element.style.display = "none";
        this.isEnable = false;
    }
}
