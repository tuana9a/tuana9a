import BaseComponent from "../../../../../global/components/base.component";
import LabeledInputComponent from "../../../../../global/components/labeled-input.component";
import LabeledSelectComponent from "../../../../../global/components/labeled-select.component";
import CONFIG from "../configs/config";

export default class EntryFormComponent extends BaseComponent {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super(element);

        this.getClassList().add("Form");
        this.entryId = new LabeledInputComponent(document.createElement("div"));
        this.historyId = new LabeledInputComponent(document.createElement("div"));
        this.username = new LabeledInputComponent(document.createElement("div"));
        this.password = new LabeledInputComponent(document.createElement("div"));
        this.actionId = new LabeledSelectComponent(document.createElement("div"));
        this.classIds = new LabeledInputComponent(document.createElement("div"));
        this.timeToStart = new LabeledInputComponent(document.createElement("div"));

        this.entryId.input.setType("text");
        this.historyId.input.setType("text");
        this.username.input.setType("text");
        this.password.input.setType("password");
        this.classIds.input.setType("text");
        this.timeToStart.input.setType("datetime-local");

        this.entryId.setName("entryId=");
        this.historyId.setName("historyId=");
        this.username.setName("username=");
        this.password.setName("password=");
        this.classIds.setName("classIds=");
        this.actionId.setName("actionId=");
        this.timeToStart.setName("timeToStart=");

        this.actionId.select.addOption("autoRegisterClasses", CONFIG.ACTION_IDS.AUTO_REGISTER_CLASSES);
        this.actionId.select.addOption("getStudentTimetable", CONFIG.ACTION_IDS.GET_STUDENT_TIMETABLE);
        this.actionId.select.addOption("getStudentProgram", CONFIG.ACTION_IDS.GET_STUDENT_PROGRAM);

        this.appendChild(new BaseComponent(document.createElement("div"))
            .style({ display: "flex", flexWrap: "wrap" })
            .appendChild(this.entryId)
            .appendChild(this.historyId)
            .appendChild(this.username)
            .appendChild(this.password)
            .appendChild(this.classIds)
            .appendChild(this.actionId)
            .appendChild(this.timeToStart));
    }
}
