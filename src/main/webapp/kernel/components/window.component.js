import BaseComponent from "../../global/components/base.component";
// eslint-disable-next-line no-unused-vars
import LaunchOption from "../data/launch.option";
import WindowHeaderBar from "./window-header-bar.component";

export default class WindowComponent extends BaseComponent {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super(element);
        this.headerBar = new WindowHeaderBar(document.createElement("div"));
        this.classList().add("Window");
        const thiss = this;
        this.addNotifyListener("close", () => {
            thiss.close();
        });
        this.appendChild(this.headerBar);
    }

    /**
     * @param {LaunchOption} launchOption
     */
    launch(launchOption) {
        this.headerBar.setName(launchOption.name);
        this.headerBar.setIconSrcByName(launchOption.name);
        this.headerBar.setPID(this.id);
        this.style({ width: `${launchOption.width}px`, height: `${launchOption.height}px` });
    }

    close() {
        this.notifyParent("close", { id: this.id });
    }

    // eslint-disable-next-line class-methods-use-this
    minimize() {
        // TODO
    }

    // eslint-disable-next-line class-methods-use-this
    // eslint-disable-next-line no-unused-vars
    resize(w, h) {
        this.style({ width: `${w}px`, height: `${h}px` });
    }
}
