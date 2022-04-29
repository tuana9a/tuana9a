import BaseComponent from "../../global/components/base.component";
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
        this.headerBar = new WindowHeaderBar(document.createElement("div"));
        this.body = new WindowBody(document.createElement("div"));
        // event
        const thiss = this;
        this.addNotifyListener("close", () => {
            thiss.close();
        });
        this.headerBar.resizer.width.input.bind((value) => {
            thiss.resizeBodyWidth(value);
        });
        this.headerBar.resizer.height.input.bind((value) => {
            thiss.resizeBodyHeight(value);
        });
        this.addEventListener("click", () => thiss.onFocus());
        this.appendChild(this.headerBar);
        this.appendChild(this.body);
    }

    /**
     * @param {LaunchOption} launchOption
     */
    launch(launchOption) {
        this.headerBar.setPID(this.id);
        this.headerBar.setName(launchOption.name);
        this.headerBar.setIconSrcByName(launchOption.name);
        // this.resizeBody(launchOption.width, launchOption.height);
        this.headerBar.resizer.width.input.setValue(launchOption.width);
        this.headerBar.resizer.height.input.setValue(launchOption.height);
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
