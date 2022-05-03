import BaseComponent from "../../../global/components/base.component";

export default class ScreenComponent extends BaseComponent {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super(element);
        this.getClassList().add("TerminalScreen");
    }
}
