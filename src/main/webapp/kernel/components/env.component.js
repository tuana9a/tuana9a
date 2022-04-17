/* eslint-disable radix */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */

// env chứa các biến ngầm môi trường, có thể chứa file
export default class EnvComponent {
    constructor() {
        this.values = new Map();
        this.listeners = new Map();
    }

    tree() {
        const result = {};
        // eslint-disable-next-line prefer-destructuring
        const values = this.values;
        for (const key in values) {
            result[key] = values[key];
        }
        return result;
    }

    get(name) {
        return this.values.get(name);
    }

    set(name, newValue) {
        const oldValue = this.values.get(name);
        const handlers = this.listeners.get(`set:${name}`);
        if (handlers) {
            // CAUTION:
            // có thể có side effect vì giá trị sẽ chỉ được cập nhật sau handler
            // do vậy các listener phụ thuộc vào giá trị trước sau thì cần để ý chỗ này
            for (const handler of handlers) {
                handler(newValue, oldValue);
            }
        }
        this.values.set(name, newValue);
    }

    addEventListener(name, handler) {
        if (!this.listeners.has(name)) {
            this.listeners.set(name, []);
        }
        this.listeners.get(name).push(handler);
    }

    getSemester() {
        let value = this.get("semester") || this.get("s");
        value = value || "20192";
        return value;
    }

    getWeek() {
        let value = this.get("week") || this.get("w");
        value = parseInt(value);
        value = value || 0;
        return value;
    }

    getUsername() {
        const value = this.get("username") || this.get("u");
        return value;
    }

    getPassword() {
        const value = this.get("password") || this.get("p");
        return value;
    }

    getDate() {
        return new Date(
            this.get("year"),
            this.get("month") - 1, // month start from 0 - 11
            this.get("date"),
            this.get("hour"),
            this.get("minute"),
            this.get("second"),
        );
    }

    getTime() {
        return this.getDate().getTime();
    }

    getEntryId() {
        return this.get("entryId") || this.get("entry-id");
    }

    getSecret() {
        return this.get("secret");
    }

    /**
     * @param {Set} ids
     */
    setClassIds(ids) {
        this.set("classIds", ids);
    }

    /**
     * @returns {Set} ids
     */
    getClassIds() {
        return this.get("classIds");
    }
}
