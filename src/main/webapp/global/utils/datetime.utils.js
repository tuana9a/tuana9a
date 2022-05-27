const DAYWEEK_COUNT = 7;

export default {
    dateToStringVn(input = new Date(), splitter = "/") {
        let day = input.getDate();
        let month = input.getMonth() + 1;// EXPLAIN: range: 0-11
        const year = input.getFullYear();
        day = day < 10 ? `0${day}` : day;
        month = month < 10 ? `0${month}` : month;
        return day + splitter + month + splitter + year;
    },
    stringToDateVn(input = "") {
        if (!input.match(/^\d{1,2}(\/|-|\.)\d{1,2}(\/|-|\.)\d+$/)) return new Date();
        try {
            const parts = input.split(/(\/|-|\.)/).filter((e) => !e.match(/^(\/|-|\.)$/));
            const day = parts[0];
            const month = parts[1];
            const year = parts[2];
            return new Date(`${month}/${day}/${year}`);
        } catch (e) {
            return new Date();
        }
    },
    toDayWeekVn(input = 0) {
        switch (input) {
        case 0:
            return 8;
        default:
            return input + 1;
        }
    },
    daysBetween(date1 = new Date(), date2 = new Date()) {
        const delta = date1.getTime() - date2.getTime();
        return Math.abs(delta) / 86_400_000;
    },
    timeBetween(date1 = new Date(), date2 = new Date()) {
        const miliseconds = date2.getTime() - date1.getTime();
        if (miliseconds < 1000) return `${miliseconds}ms ago`;
        const seconds = miliseconds / 1000.0;
        if (seconds < 60) return `${Math.round(seconds)}s ago`;
        const minutes = seconds / 60.0;
        if (minutes < 60) return `${Math.round(minutes)}m ago`;
        const hours = minutes / 60.0;
        if (hours < 24) return `${Math.round(hours)}h ago`;
        const days = hours / 24.0;
        return `${Math.round(days)}d ago`;
    },
    // CAUTION: nếu lệch mất một tuần thì vào đây mà sửa
    weeksFromStartDay(dash = "", firstWeekDay = "") {
        const date1 = this.stringToDateVn(dash);
        const date2 = this.stringToDateVn(firstWeekDay);
        const weeks = this.daysBetween(date1, date2) / 7;
        return Math.floor(weeks) + 1;
        // EXPLAIN: đéo biết giải thích thế nào cái cộng 1, thời gian mệt vlòn
    },
    calcCurrentWeek(firstWeekDay = "") {
        const start = this.stringToDateVn(firstWeekDay);
        const weeks = Math.floor(this.daysBetween(start, new Date()) / DAYWEEK_COUNT);
        return weeks + 1; // EXPLAIN: vd chia đc 0.5 thì là tuần 1, chia đc 1.2 là tuần 2
    },
};
