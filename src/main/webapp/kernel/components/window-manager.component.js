import BaseComponent from "../../global/components/base.component";

export default class WindowManagerComponent extends BaseComponent {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super(element);
        this.windows = new Map();
        this.getClassList().add("WindowManager");
        const thiss = this;
        this.addNotifyListener("close", ({ id }) => {
            thiss.removeChildById(id);
        });
    }
}
