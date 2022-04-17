import BaseComponent from "../../../global/components/base.component";

export default class SuggestEntryComponent extends BaseComponent {
    /**
     * @param {String} value
     */
    constructor(value) {
        super(document.createElement("div"));
        this.value = value || "";
        this.isEnable = false;
        // element
        this.classList().add("SuggestEntry", "display-flex", "align-items-center");
        // text element
        this.text = new BaseComponent(document.createElement("span"));
        this.text.classList().add("SuggestEntryValue");
        this.text.innerText(value);
        this.appendChild(this.text);
    }

    update(value) {
        this.value = value;
    }

    render() {
        this.text.innerHTML(this.value.replace(/\s/g, "&nbsp;"));
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
