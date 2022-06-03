import BaseComponent from "../../../../../global/components/base.component";
import LabeledInputComponent from "../../../../../global/components/labeled-input.component";
import LOGGER from "../../../../../global/loggers/logger";
import { dce } from "../../../../../global/utils/dom.utils";
import WindowComponent from "../../../../../kernel/components/window.component";
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

export default class RegisterPreviewComponent extends WindowComponent {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super(element);
        this.semester = new LabeledInputComponent(dce("div"));
        this.currentWeek = new LabeledInputComponent(dce("div"));
        this.selectedClassIds = new LabeledInputComponent(dce("div"));
        this.timetable = new TimeTableComponent(dce("div"));
        // set input type
        this.semester.input.setType("text");
        this.currentWeek.input.setType("text");
        this.selectedClassIds.input.setType("text");
        // set place holder
        this.semester.setName("semester=");
        this.currentWeek.setName("week=");
        this.selectedClassIds.setName("selected");
        this.selectedClassIds.input.setPlaceHolder("Eg: 123456 123457");
        // init event listener
        this.semester.input.addEventListener("input", null); // TODO: handle semester change
        this.currentWeek.input.addEventListener("input", this.onweekchange.bind(this));
        this.selectedClassIds.addEventListener("input", this.onselected.bind(this));
        // append to parent
        this.body.appendChild(new BaseComponent(dce("div"))
            .style({ display: "flex" })
            .appendChild(this.semester)
            .appendChild(this.currentWeek)
            .appendChild(this.selectedClassIds));
        this.body.appendChild(this.timetable);
    }

    async onselected() {
        const semester = this.semester.input.getValue();
        const classIds = this.selectedClassIds.input.getValue().trim().split(/\s+/).map((x) => parseInt(x, 10));
        const response = await classesApis.findWithMatch({
            semester,
            classIds,
        });
        const classes = response.data;
        const classesMap = new Map();
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
        this.timetable.clearSchoolClasses();
        for (const schoolClass of classesMap.values()) {
            try {
                this.timetable.addSchoolClass(schoolClass);
            } catch (err) {
                LOGGER.error(err);
            }
        }
        this.timetable.render(this.prepareRenderOpts());
    }

    onweekchange() {
        this.timetable.render(this.prepareRenderOpts());
    }

    prepareRenderOpts() {
        return prepareRenderOpts({ currentWeekPreview: this.currentWeek.input.getValue() });
    }
}
