/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import CONSTANTS from "../configs/constants";
// eslint-disable-next-line no-unused-vars
import SchoolClass from "../data/school-class.data";
import BaseComponent from "../../../../global/components/base.component";
import TableColumnComponent from "./table-column.component";

export default class TimeTableComponent extends BaseComponent {
    /**
     * @param {Element} element
     */
    constructor(element, opts = { rowHeight: 30, dropHours: new Set(), maxSchoolClass: 5 }) {
        super(element);
        // TODO: make timetable reactive with opts by adding setter getter
        this.opts = opts;
        this.classList().add("RenderContainer");
        this.table = new BaseComponent(document.createElement("div"));
        this.table.classList().add("RenderTable", "position-relative", "display-flex", "text-align-center");
        this.appendChild(this.table);
        this.tableColumnMapper = new Map();
        // init index column
        const indexHourOpts = {
            dropHours: this.opts.dropHours,
            isIndexHourColumn: true,
            maxSchoolClass: 0,
            rowHeight: this.opts.rowHeight,
            showDowName: false,
            showHourNumber: true,
        };
        const indexHourColumn = new TableColumnComponent(null, indexHourOpts);
        this.tableColumnMapper.set("indexHour", indexHourColumn);
        this.table.appendChild(indexHourColumn);
        // init 7 days column left
        const dowColumnOpts = {
            dropHours: this.opts.dropHours,
            isIndexHourColumn: false,
            maxSchoolClass: this.opts.maxSchoolClass,
            rowHeight: this.opts.rowHeight,
            showDowName: true,
            showHourNumber: false,
        };
        for (const dow of CONSTANTS.dayOfWeekInNumbers) {
            const tableColumn = new TableColumnComponent(dow, dowColumnOpts);
            this.tableColumnMapper.set(dow, tableColumn);
            this.table.appendChild(tableColumn);
        }
    }

    /**
     * @param {SchoolClass} schoolClass
     * @returns response
     */
    addSchoolClass(schoolClass) {
        const tuanHoc = schoolClass.HocVaoCacTuan;
        let response = {
            code: 0,
            message: "",
        };
        if (!tuanHoc || tuanHoc.match(/null/i)) {
            response.code = 0;
            const temp = `<b class="color-red">${schoolClass.MaLop}</b> ${schoolClass.TenHocPhan}`;
            response.message = `Lớp ${temp} <b class="color-red">không</b> thời gian học`;
            return response;
        }
        const dow = schoolClass.HocVaoThu;
        const tableColumn = this.tableColumnMapper.get(dow);
        response = tableColumn.addSchoolClass(schoolClass);
        return response;
    }

    /**
     * @param {Number} MaLop
     */
    deleteSchoolClass(MaLop) {
        let isSuccess = false;
        for (const dow of CONSTANTS.dayOfWeekInNumbers) {
            const tableColumn = this.tableColumnMapper.get(dow);
            isSuccess = tableColumn.deleteSchoolClass(MaLop);
        }
        return isSuccess;
    }

    clearSchoolClasses() {
        for (const dow of CONSTANTS.dayOfWeekInNumbers) {
            const tableColumn = this.tableColumnMapper.get(dow);
            tableColumn.clearSchoolClasses();
        }
    }

    scanOverlapTime() {
        // EXPLAIN: iterate every dayweek
        const result = {};
        for (const dow of this.tableColumnMapper.keys()) {
            const tableColumn = this.tableColumnMapper.get(dow);
            const overlapClasses = tableColumn.scanOverlapTime();
            result[dow] = overlapClasses;
        }
        return result;
    }

    getSchoolClasses() {
        const classes = [];
        for (const dow of CONSTANTS.dayOfWeekInNumbers) {
            const tableColumn = this.tableColumnMapper.get(dow);
            for (const schoolClassComponent of tableColumn.schoolClassComponents) {
                if (!schoolClassComponent.isEnabled) {
                    continue;
                }
                classes.push(schoolClassComponent.schoolClass);
            }
        }
        return classes;
    }

    render(opts) {
        for (const dow of CONSTANTS.dayOfWeekInNumbers) {
            const tableColumn = this.tableColumnMapper.get(dow);
            tableColumn.render(opts);
        }
    }
}
