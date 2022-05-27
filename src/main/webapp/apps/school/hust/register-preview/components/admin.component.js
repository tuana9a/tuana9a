import InputComponent from "../../../../../global/components/input.component";
import BaseComponent from "../../../../../global/components/base.component";
import classesApis from "../apis/classes.apis";
import LOGGER from "../../../../../global/loggers/logger";
import { dce } from "../../../../../global/utils/dom.utils";
import WindowComponent from "../../../../../kernel/components/window.component";

export default class AdminComponent extends WindowComponent {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super(element);
        this.inputSemester = new InputComponent();
        this.inputFile = new InputComponent();
        this.inputSecret = new InputComponent();
        this.insertClassesButton = new BaseComponent(dce("button"));
        this.deleteClassesButton = new BaseComponent(dce("button"));
        // input type
        this.inputSemester.setType("text");
        this.inputFile.setType("file");
        this.inputSecret.setType("password");
        // place holder
        this.inputSemester.setPlaceHolder("Semester");
        this.inputSecret.setPlaceHolder("Secret");
        // text
        this.insertClassesButton.setInnerText("Insert Classes");
        this.deleteClassesButton.setInnerText("Delete Classes");
        // event listener
        this.insertClassesButton.addEventListener("click", this.insertClasses.bind(this));
        this.deleteClassesButton.addEventListener("click", this.deleteClasses.bind(this));
        // append to parent
        this.body.appendChild(this.inputSemester);
        this.body.appendChild(this.inputFile);
        this.body.appendChild(this.inputSecret);
        this.body.appendChild(this.insertClassesButton);
        this.body.appendChild(this.deleteClassesButton);
    }

    async insertClasses() {
        const semester = this.inputSemester.getValue();
        const file = this.inputFile.getValue();
        const secret = this.inputSecret.getValue();
        const response = await classesApis.insert({ semester, file, secret });
        LOGGER.info(response);
        // TODO: do something with response
    }

    async deleteClasses() {
        const semester = this.inputSemester.getValue();
        const secret = this.inputSecret.getValue();
        const response = await classesApis.delete({ semester, secret });
        LOGGER.info(response);
        // TODO: do somthing with the respone
    }
}
