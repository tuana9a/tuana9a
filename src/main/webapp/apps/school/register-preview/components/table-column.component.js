/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable max-len */
import CONSTANTS from "../configs/constants";
import BaseComponent from "../../../../global/components/base.component";
import SchoolClassComponent from "./school-class.component";
import SchoolClass from "../data/school-class.data";

const defaulColumnOpts = {
    dropHours: new Set(),
    maxSchoolClass: 0,
    rowHeight: 0,
    showHourNumber: false,
    showDowName: false,
    isIndexHourColumn: false,
};

export default class TableColumnComponent extends BaseComponent {
    /**
     * @param {Number} dayOfWeek
     * @param {*} opts
     */
    constructor(dayOfWeek, opts = defaulColumnOpts) {
        super(document.createElement("div"));
        this.dayOfWeek = dayOfWeek;
        this.classList().add("TableColumn", "position-relative", "DayOfWeek");
        if (opts.isIndexHourColumn) this.classList().add("IndexHour");
        else this.classList().add(CONSTANTS.dayOfWeekSwitch.get(dayOfWeek).className);

        this.tableColumnName = new BaseComponent(document.createElement("div"));
        this.tableColumnName
            .classList()
            .add("TableColumnName", "display-flex", "justify-content-center", "align-items-center");
        this.tableColumnName.getElement().style.height = `${opts.rowHeight}px`;
        const columnName = opts.showDowName ? CONSTANTS.dayOfWeekSwitch.get(dayOfWeek).displayName : "&zwnj;";
        this.tableColumnName.innerHTML(`<span>${columnName}</span>`);
        this.appendChild(this.tableColumnName);

        this.hourComponents = [];
        for (let i = 0; i <= 23; i += 1) {
            if (opts.dropHours.has(i)) {
                continue;
            }
            const hourComponent = new BaseComponent(document.createElement("div"));
            hourComponent
                .classList()
                .add("Hour", `_${i}h`, "display-flex", "justify-content-center", "align-items-center");
            if (CONSTANTS.comeHomeHours.has(i)) {
                hourComponent.classList().add("ComeHomeHour");
            }
            if (opts.dropHours.has(i)) {
                hourComponent.getElement().style.display = "none";
            }
            hourComponent.getElement().style.height = `${opts.rowHeight}px`;
            hourComponent.innerHTML(`<span>${opts.showHourNumber ? i : "&zwnj;"}</span>`);
            this.hourComponents.push(hourComponent);
            this.appendChild(hourComponent);
        }
        this.schoolClassComponents = [];
        this.maxSchoolClass = opts.maxSchoolClass;
        for (let i = 0; i < this.maxSchoolClass; i += 1) {
            const schoolClassComponent = new SchoolClassComponent(new SchoolClass());
            schoolClassComponent.disable();
            this.schoolClassComponents.push(schoolClassComponent);
            this.appendChild(schoolClassComponent);
        }
    }

    /**
     * @param {SchoolClass} schoolClass
     * @returns reponse
     */
    addSchoolClass(schoolClass) {
        const response = {
            code: 0,
            message: "",
        };
        // eslint-disable-next-line eqeqeq
        const schoolClassComponentToBeReplaced = this.schoolClassComponents.find((x) => !x.isEnabled || x.schoolClass.MaLop == schoolClass.MaLop);
        // not found any isEnabled = false
        if (!schoolClassComponentToBeReplaced) {
            const message = `maximum classes count: ${this.maxSchoolClass} per day reach on dow: ${this.dayOfWeek}`;
            console.warn(message);
            response.code = 0;
            response.message = message;
            return response;
        }
        // found one just update it
        schoolClassComponentToBeReplaced.update(schoolClass);
        schoolClassComponentToBeReplaced.enable();
        response.code = 1;
        response.message = `add success by add new one to ${this.dayOfWeek}`;
        return response;
    }

    /**
     * @param {Number} MaLop
     */
    deleteSchoolClass(MaLop) {
        // eslint-disable-next-line eqeqeq
        const schoolClassComponent = this.schoolClassComponents.find((x) => x.schoolClass.MaLop == MaLop);
        if (schoolClassComponent) {
            schoolClassComponent.disable();
            return true;
        }
        return false;
    }

    clearSchoolClasses() {
        for (const schoolClassComponent of this.schoolClassComponents) {
            schoolClassComponent.disable();
        }
    }

    scanOverlapTime() {
        // TODO: thuật toán scan tuần từ 0 -> 50
        // chứ scan hiện tại chỉ scan theo tuần
        const overlapHandeledClasses = [];
        const classes = this.schoolClassComponents;
        for (const mainClass of classes) {
            if (overlapHandeledClasses.find((x) => x === mainClass)) {
                continue;
            }
            if (!mainClass.isEnabled) {
                continue;
            }
            let existOverlap = false;
            const overlapClasses = []; // EXPLAIN: array with all class that same with main
            // use after iterate all to alert to speical queue

            // EXPLAIN: main class compare with other class on that day
            // if overlap then existOverlap = true
            for (const otherClass of classes) {
                if (otherClass === mainClass) {
                    continue;
                }
                if (!otherClass.isEnabled) {
                    continue;
                }

                const mainTime = mainClass.schoolClass.time;
                const otherTime = otherClass.schoolClass.time;

                const mainStartTime = mainTime.startHour * 60 + mainTime.startMinute;
                const mainStopTime = mainTime.stopHour * 60 + mainTime.stopMinute;

                const otherStartTime = otherTime.startHour * 60 + otherTime.startMinute;
                const otherStopTime = otherTime.stopHour * 60 + otherTime.stopMinute;

                const notOverlap = mainStartTime > otherStopTime || mainStopTime < otherStartTime;
                if (notOverlap) {
                    continue;
                }
                existOverlap = true;
                overlapHandeledClasses.push(otherClass);
                overlapClasses.push(otherClass);
            }

            // EXPLAIN: if have overlap add mainClass to handled so skip if meet again
            if (existOverlap) {
                overlapHandeledClasses.push(mainClass);
                overlapClasses.push(mainClass);
            }
        }
        return overlapHandeledClasses;
    }

    render(opts) {
        for (const schoolClassComponent of this.schoolClassComponents) {
            schoolClassComponent.render(opts);
        }
    }
}
