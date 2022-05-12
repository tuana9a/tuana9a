/* eslint-disable radix */
import randomUtils from "../../../../../global/utils/random.utils";
import BaseComponent from "../../../../../global/components/base.component";
import timeUtils from "../utils/time.utils";
// eslint-disable-next-line no-unused-vars
import SchoolClass from "../data/school-class.data";
import { dce } from "../../../../../global/utils/dom.utils";

export default class SchoolClassComponent extends BaseComponent {
    /**
     * @param {SchoolClass} schoolClass
     */
    constructor(schoolClass) {
        super(dce("div"));
        this.schoolClass = schoolClass;
        // create element bind to this class
        this.getClassList().add("SchoolClassElement", "position-absolute");
        this.detail = new BaseComponent(dce("div"));
        this.detail.getClassList().add("ThongTinLop");
        this.appendChild(this.detail);
        // other info
        this.isEnabled = true;
        this.isShow = true;
    }

    render(opts = { rowHeight: 0, currentWeekPreview: 0, offsetHour: 0 }) {
        if (!this.isEnabled) return;
        // eslint-disable-next-line max-len
        const thoiGianHoc = this.schoolClass.ThoiGianHoc; // EXPLAIN: VD: 1234-5678 -> 12h34p - 56h78p
        const { rowHeight } = opts;

        const time = {};
        time.startHour = parseInt(thoiGianHoc.substring(0, 2));
        time.startMinute = parseInt(thoiGianHoc.substring(2, 5));
        time.stopHour = parseInt(thoiGianHoc.substring(5, 7));
        time.stopMinute = parseInt(thoiGianHoc.substring(7, 9));
        this.schoolClass.time = time;

        // eslint-disable-next-line max-len
        const top = (time.startHour + opts.offsetHour + 1 + time.startMinute / 60) * rowHeight; // +1 for column name
        this.getElement().style.top = `${top}px`;
        // eslint-disable-next-line max-len
        const height = (time.stopHour - time.startHour + (time.stopMinute - time.startMinute) / 60) * rowHeight;
        this.getElement().style.height = `${height}px`;

        this.getElement().style.backgroundColor = randomUtils.color_hex(
            { s: 150, e: 200 },
            { s: 120, e: 200 },
            { s: 100, e: 200 },
        );
        this.getElement().style.zIndex = 15;

        const timeStart = timeUtils.classTimeFormat(time.startHour, time.startMinute);
        const timeStop = timeUtils.classTimeFormat(time.stopHour, time.stopMinute);

        let html = this.schoolClass.MaLop;
        html += " | ";
        html += `${this.schoolClass.LoaiLop}`;
        html += " | ";
        html += `${this.schoolClass.TenHocPhan}`;
        html += " | ";
        html += `<b>${`${timeStart} - ${timeStop}`}</b>`;
        html += " | ";
        html += `${this.schoolClass.PhongHoc}`;
        this.detail.setInnerHTML(html);

        const tuanHoc = this.schoolClass.HocVaoCacTuan;
        if (timeUtils.isContainWeek(tuanHoc, opts.currentWeekPreview)) {
            this.show();
        } else {
            this.fade();
        }
    }

    /**
     * @param {SchoolClass} schoolClass
     */
    update(schoolClass) {
        this.schoolClass = schoolClass;
    }

    fade() {
        this.getElement().style.opacity = 0.5;
        this.isShow = false;
    }

    show() {
        this.getElement().style.opacity = 1;
        this.isShow = true;
    }

    disable() {
        this.getElement().style.display = "none";
        this.isEnabled = false;
    }

    enable() {
        this.getElement().style.display = null;
        this.isEnabled = true;
    }
}
