import BaseComponent from "../../global/components/base.component";
import { dce } from "../../global/utils/dom.utils";
// eslint-disable-next-line no-unused-vars
import LaunchOption from "../data/launch.option";
import WindowBody from "./window-body.component";
import WindowHeaderBar from "./window-header-bar.component";

export default class WindowComponent extends BaseComponent {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super(element);
        this.getClassList().add("Window");
        this.isFocusing = false;
        this.head = new WindowHeaderBar(dce("div"));
        this.body = new WindowBody(dce("div"));
        // event
        this.addNotifyListener("i:bash:execute", (data) => this.notifyParent("i:bash:execute", data));
        this.addNotifyListener("close", () => this.close());
        const resizeBodyWidth = this.resizeBodyWidth.bind(this);
        this.head.resizer.width.input.watch((value) => resizeBodyWidth(value));
        const resizeBodyHeight = this.resizeBodyHeight.bind(this);
        this.head.resizer.height.input.watch((value) => resizeBodyHeight(value));
        this.addEventListener("click", this.onFocus.bind(this));
        this.appendChild(this.head);
        this.appendChild(this.body);
    }

    /**
     * @param {LaunchOption} launchOption
     */
    launch(launchOption) {
        this.head.setPID(this.id);
        this.head.setName(launchOption.name);
        this.head.setIconSrcByName(launchOption.name);
        // this.resizeBody(launchOption.width, launchOption.height);
        this.head.resizer.width.input.setValue(launchOption.width);
        this.head.resizer.height.input.setValue(launchOption.height);
    }

    onFocus() {
        this.isFocusing = true;
    }

    close() {
        this.notifyParent("close", { id: this.id });
    }

    // eslint-disable-next-line class-methods-use-this
    minimize() {
        // TODO
    }

    resizeBody(w, h) {
        this.resizeBodyWidth(w);
        this.resizeBodyHeight(h);
    }

    resizeBodyWidth(w) {
        this.body.style({ width: `${w}px` });
    }

    resizeBodyHeight(h) {
        this.body.style({ height: `${h}px` });
    }

    moveTo(x, y) {
        this.moveToX(x);
        this.moveToY(y);
    }

    moveToX(x) {
        this.style({ left: `${x}px` });
    }

    moveToY(y) {
        this.style({ top: `${y}px` });
    }
}
