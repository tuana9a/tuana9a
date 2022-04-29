import BaseComponent from "../../../../global/components/base.component";
import InputComponent from "../../../../global/components/input.component";
import App from "../../../../kernel/components/app.component";
// eslint-disable-next-line no-unused-vars
import LaunchOption from "../../../../kernel/data/launch.option";
import entryApis from "../apis/entry.apis";

export default class FormComponent extends App {
    /**
     * @param {Element} element
     * @param {LaunchOption} launchOption
     */
    constructor(element, launchOption) {
        super(element, launchOption);
        const thiss = this;
        this.getClassList().add("Form");
        this.inputEntryId = new InputComponent();
        this.inputUsername = new InputComponent();
        this.inputPassword = new InputComponent();
        this.inputClassIds = new InputComponent();
        this.inputTimeToStartLabel = new BaseComponent(document.createElement("label"));
        this.inputTimeToStart = new InputComponent();
        this.submitAutoRegisterClassesButton = new BaseComponent(document.createElement("button"));
        this.submitGetStudentTimetableButton = new BaseComponent(document.createElement("button"));
        this.submitCancelButton = new BaseComponent(document.createElement("button"));

        this.inputEntryId.setType("text");
        this.inputUsername.setType("text");
        this.inputPassword.setType("password");
        this.inputClassIds.setType("text");
        this.inputTimeToStart.setType("datetime-local");

        this.inputEntryId.setPlaceHolder("Entry Id");
        this.inputUsername.setPlaceHolder("User Name");
        this.inputPassword.setPlaceHolder("Password");
        this.inputClassIds.setPlaceHolder("Class Ids");
        this.inputTimeToStartLabel.setInnerText("Time To Start:");
        this.submitAutoRegisterClassesButton.setInnerText("Submit Auto Register Classes");
        this.submitGetStudentTimetableButton.setInnerText("Submit Get Student Timetable");
        this.submitCancelButton.setInnerText("Cancel");

        this.submitAutoRegisterClassesButton.addEventListener("click", () => {
            thiss.onSubmitAutoRegisterClasses();
        });
        this.submitGetStudentTimetableButton.addEventListener("click", () => {
            thiss.onSubmitGetStudentTimetable();
        });
        this.submitCancelButton.addEventListener("click", () => {
            thiss.onCancel();
        });

        this.appendChild(this.inputEntryId);
        this.appendChild(this.inputUsername);
        this.appendChild(this.inputPassword);
        this.appendChild(this.inputClassIds);
        this.appendChild(this.inputTimeToStartLabel);
        this.appendChild(this.inputTimeToStart);
        this.appendChild(this.submitAutoRegisterClassesButton);
        this.appendChild(this.submitGetStudentTimetableButton);
        this.appendChild(this.submitCancelButton);
    }

    async onSubmitAutoRegisterClasses() {
        const username = this.inputUsername.value();
        const password = this.inputPassword.value();
        // month start from 0 no need second param
        const timeToStart = new Date(this.inputTimeToStart.value()).getTime();
        const classIds = this.inputClassIds
            .value()
            .trim()
            .split(/\s+/)
            .map((x) => String(x.MaLop));
        const entry = {
            username,
            password,
            classIds,
            timeToStart,
        };
        const response = await entryApis.insertAutoRegisterClasses({ entry });
        // TODO: do somehting with response
        console.log(response);
    }

    async onSubmitGetStudentTimetable() {
        const username = this.inputUsername.value();
        const password = this.inputPassword.value();
        // month start from 0 no need second param
        const timeToStart = new Date(this.inputTimeToStart.value()).getTime();
        const entry = {
            username,
            password,
            timeToStart,
        };
        const response = await entryApis.insertGetStudentTimetable({ entry });
        // TODO: do somehting with response
        console.log(response);
    }

    // eslint-disable-next-line class-methods-use-this
    async onSubmitGetStudentProgram() {
        // TODO:
    }

    async onCancel() {
        const entryId = this.inputEntryId.value();
        const username = this.inputUsername.value();
        const password = this.inputPassword.value();
        const entry = {
            _id: entryId,
            username,
            password,
        };
        const response = await entryApis.cancel({ entryId, entry });
        // TODO: do something with the response
        console.log(response);
    }
}
