import InputComponent from "../../../../global/components/input.component";
import App from "../../../../kernel/components/app.component";
import classesApis from "../apis/classes.apis";
import CONSTANTS from "../configs/constants";
import TimeTableComponent from "./timetable.component";

function prepareRenderOpts(opts = { rowHeight: 0, currentWeekPreview: 0, offsetHour: 0 }) {
    // eslint-disable-next-line no-param-reassign
    opts.rowHeight = opts.rowHeight || CONSTANTS.defaultRowHeight;
    // eslint-disable-next-line no-param-reassign
    opts.currentWeekPreview = opts.currentWeekPreview || 0;
    // eslint-disable-next-line no-param-reassign
    opts.offsetHour = opts.offsetHour || 0; // -5 for default
    return opts;
}

export default class RegisterPreviewComponent extends App {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super(element);
        const thiss = this;
        this.inputSemester = new InputComponent();
        this.inputWeek = new InputComponent();
        this.inputSearchClassIds = new InputComponent();
        this.selectedClassIds = new InputComponent();
        this.timetable = new TimeTableComponent(document.createElement("div"));
        // set input type
        this.inputSemester.setType("text");
        this.inputWeek.setType("text");
        this.inputSearchClassIds.setType("text");
        this.selectedClassIds.setType("text");
        // set place holder
        this.inputSemester.setPlaceHolder("Semester");
        this.inputWeek.setPlaceHolder("Week");
        this.inputSearchClassIds.setPlaceHolder("Search Class");
        this.selectedClassIds.setPlaceHolder("Selected Class Ids");
        // init event listener
        this.inputSemester.addEventListener("input", () => {
            // TODO: handle semester change
        });
        this.inputWeek.addEventListener("input", () => {
            thiss.onweekchange();
        });
        this.inputSearchClassIds.addEventListener("input", () => {
            thiss.onsearch();
        });
        this.selectedClassIds.addEventListener("input", () => {
            thiss.onselected();
        });
        // append to parent
        this.appendChild(this.inputSemester);
        this.appendChild(this.inputWeek);
        this.appendChild(this.inputSearchClassIds);
        this.appendChild(this.selectedClassIds);
        this.appendChild(this.timetable);
    }

    async onsearch() {
        const semester = this.inputSemester.value();
        const classIds = this.inputSearchClassIds.value().trim().split(/\s+/);
        const response = await classesApis.findByRange({
            semester,
            classIds,
        });
        const classes = response.data;
        classes.forEach((schoolClass) => {
            console.log(schoolClass);
        });
    }

    async onselected() {
        const semester = this.inputSemester.value();
        const classIds = this.selectedClassIds.value().trim().split(/\s+/);
        const response = await classesApis.findWithMatch({
            semester,
            classIds,
        });
        const classes = response.data;
        const classesMap = new Map();
        // eslint-disable-next-line no-restricted-syntax
        for (const schoolClass of classes) {
            const key = `${schoolClass.MaLop}.${schoolClass.BuoiHocSo}`;
            const exist = classesMap.get(key);
            if (exist) {
                if (exist.created < schoolClass.created) {
                    classesMap.set(key, schoolClass);
                }
            } else {
                classesMap.set(key, schoolClass);
            }
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const schoolClass of classesMap.values()) {
            try {
                this.timetable.addSchoolClass(schoolClass);
            } catch (err) {
                console.error(err);
            }
        }
        this.timetable.render(this.prepareRenderOpts());
    }

    onweekchange() {
        this.timetable.render(this.prepareRenderOpts());
    }

    prepareRenderOpts() {
        return prepareRenderOpts({ currentWeekPreview: this.inputWeek.value() });
    }
}
