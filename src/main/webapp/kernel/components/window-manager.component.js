import BaseComponent from "../../global/components/base.component";

export default class WindowManagerComponent extends BaseComponent {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super(element);
        this.windows = new Map();
        this.getClassList().add("WindowManager");
        this.currentMaxZIndex = 0;
        this.addNotifyListener("close", (data) => this.notifyParent("close", data));
        this.addNotifyListener("i:bash:execute", (data) => this.notifyParent("i:bash:execute", data));
    }
}
