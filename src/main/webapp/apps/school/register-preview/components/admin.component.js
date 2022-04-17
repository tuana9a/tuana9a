import App from "../../../../kernel/components/app.component";
import InputComponent from "../../../../global/components/input.component";
import BaseComponent from "../../../../global/components/base.component";
import classesApis from "../apis/classes.apis";

export default class AdminComponent extends App {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super(element);
        const thiss = this;
        this.inputSemester = new InputComponent();
        this.inputFile = new InputComponent();
        this.inputSecret = new InputComponent();
        this.insertClassesButton = new BaseComponent(document.createElement("button"));
        this.deleteClassesButton = new BaseComponent(document.createElement("button"));
        // input type
        this.inputSemester.setType("text");
        this.inputFile.setType("file");
        this.inputSecret.setType("password");
        // place holder
        this.inputSemester.setPlaceHolder("Semester");
        this.inputSecret.setPlaceHolder("Secret");
        // text
        this.insertClassesButton.innerText("Insert Classes");
        this.deleteClassesButton.innerText("Delete Classes");
        // event listener
        this.insertClassesButton.addEventListener("click", () => thiss.insertClasses());
        this.deleteClassesButton.addEventListener("click", () => thiss.deleteClasses());
        // append to parent
        this.appendChild(this.inputSemester);
        this.appendChild(this.inputFile);
        this.appendChild(this.inputSecret);
        this.appendChild(this.insertClassesButton);
        this.appendChild(this.deleteClassesButton);
    }

    async insertClasses() {
        const semester = this.inputSemester.value();
        const file = this.inputFile.value();
        const secret = this.inputSecret.value();
        const response = await classesApis.insert({ semester, file, secret });
        console.log(response);
        // TODO: do something with response
    }

    async deleteClasses() {
        const semester = this.inputSemester.value();
        const secret = this.inputSecret.value();
        const response = await classesApis.delete({ semester, secret });
        console.log(response);
        // TODO: do somthing with the respone
    }
}
