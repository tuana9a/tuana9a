// eslint-disable-next-line max-classes-per-file
import BaseComponent from "../../global/components/base.component";
import InputComponent from "../../global/components/input.component";
import CONFIG from "../configs/config";

class PixcelResizer extends BaseComponent {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super(element);
        this.getClassList().add("PixcelResizer");
        this.name = new BaseComponent(document.createElement("span"));
        this.input = new InputComponent(document.createElement("input"));
        this.input.setType("number");
        this.input.setStep(10);
        this.unit = new BaseComponent(document.createElement("span"));
        this.unit.setInnerText("px");
        this.appendChild(this.name);
        this.appendChild(this.input);
        this.appendChild(this.unit);
    }

    setName(name) {
        this.name.setInnerText(`${name} = `);
    }
}

export default class WindowResizerComponent extends BaseComponent {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super(element);
        this.getClassList().add("Resizer");
        this.width = new PixcelResizer(document.createElement("span"));
        this.width.setName("width");
        this.width.input.setMax(CONFIG.DEFAULT.WINDOW.MAX_WIDTH);
        this.width.input.setMin(CONFIG.DEFAULT.WINDOW.MIN_WIDTH);
        this.height = new PixcelResizer(document.createElement("span"));
        this.height.setName("height");
        this.height.input.setMax(CONFIG.DEFAULT.WINDOW.MAX_HEIGHT);
        this.height.input.setMin(CONFIG.DEFAULT.WINDOW.MIN_HEIGHT);
        this.appendChild(this.width);
        this.appendChild(this.height);
    }
}
