import BaseComponent from "../../global/components/base.component";

export default class WindowHeaderBar extends BaseComponent {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super(element);
        this.classList().add("HeaderBar", "display-flex", "align-items-center");
        // init
        this.icon = new BaseComponent(document.createElement("img"));
        this.pid = new BaseComponent(document.createElement("span"));
        this.name = new BaseComponent(document.createElement("span"));
        this.close = new BaseComponent(document.createElement("button"));
        // class
        this.pid.classList().add("PID");
        this.name.classList().add("Name");
        this.close.classList().add("CloseButton");
        // text
        this.close.innerText("CLOSE");
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
        // append
        this.appendChild(this.icon);
        this.appendChild(this.pid);
        this.appendChild(this.name);
        this.appendChild(this.close);
    }

    setPID(pid) {
        this.pid.innerText(pid);
        return this;
    }

    setName(name) {
        this.name.innerText(name);
        return this;
    }

    setIconSrcByName(name) {
        this.icon.getElement().src = `https://avatars.dicebear.com/api/identicon/${name}.svg`;
    }
}
