import BaseComponent from "../../global/components/base.component";
import WindowResizerComponent from "./window-resizer.component";

export default class WindowHeaderBar extends BaseComponent {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super(element);
        this.getClassList().add("HeaderBar", "display-flex", "align-items-center");
        // init
        this.icon = new BaseComponent(document.createElement("img"));
        this.pid = new BaseComponent(document.createElement("span"));
        this.name = new BaseComponent(document.createElement("span"));
        this.resizer = new WindowResizerComponent(document.createElement("div"));
        this.close = new BaseComponent(document.createElement("button"));
        // class
        this.pid.getClassList().add("PID");
        this.name.getClassList().add("Name");
        this.close.getClassList().add("CloseButton");
        // text
        this.close.setInnerText("CLOSE");
        // other
        this.icon.style({ width: "20px", height: "20px", padding: "3px" });
        // event
        const thiss = this;
        this.close.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        // why need mousedown and click
        // mouse down also trigger bringToFrom of makeDragToMove
        // so when close the is a blink of bring to top then close
        // so we just simple prevent mousedown but catch click event
        this.close.addEventListener("click", () => {
            thiss.notifyParent("close");
        });
        this.resizer.addEventListener("mousedown", (e) => {
            e.stopPropagation();
        });
        // append
        this.appendChild(this.icon);
        this.appendChild(this.pid);
        this.appendChild(this.name);
        this.appendChild(this.resizer);
        this.appendChild(this.close);
    }

    setPID(pid) {
        this.pid.setInnerText(`PID = ${pid}`);
        return this;
    }

    setName(name) {
        this.name.setInnerText(`name = ${name}`);
        return this;
    }

    setIconSrcByName(name) {
        this.icon.getElement().src = `https://avatars.dicebear.com/api/identicon/${name}.svg`;
    }
}
