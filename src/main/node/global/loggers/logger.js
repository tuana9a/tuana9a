const fs = require("fs");
// eslint-disable-next-line no-unused-vars
const LogObject = require("../data/log-object");

class Logger {
    CONFIG;

    datetimeUtils;

    constructor() {
        this.handler = this.csLog;
        this.handlers = new Map();
        this.handlers.set("cs", this.csLog.bind(this));
        this.handlers.set("fs", this.fsLog.bind(this));
    }

    /**
     * @param {LogObject} object
     */
    // eslint-disable-next-line class-methods-use-this
    csLog(object) {
        const now = new Date();
        let { data } = object;
        if (typeof data === "object") {
            data = JSON.stringify(data, null, "  ");
        }
        const record = `${this.datetimeUtils.getFull(now)} [${object.type}] ${data}\n`;
        // eslint-disable-next-line no-console
        console.log(record);
    }

    /**
     * @param {LogObject} object
     */
    fsLog(object) {
        const now = new Date();
        const record = `${this.datetimeUtils.getFull(now)} [${object.type}] ${object.data}\n`;
        const filepath = `${this.CONFIG.log.dir + this.datetimeUtils.getDate(now)}.log`;
        fs.appendFileSync(filepath, record);
    }

    /**
     * @param {String} handlerName
     */
    use(handlerName) {
        this.handler = this.handlers.get(handlerName);
    }

    info(data) {
        this.log({ type: "INFO", data });
    }

    warn(data) {
        this.log({ type: "WARN", data });
    }

    /**
     * @param {Error} err
     */
    error(err) {
        this.log({ type: "ERROR", data: err.stack });
    }

    /**
     * @param {LogObject} object
     */
    log(object) {
        if (this.handler) {
            this.handler(object);
        }
    }
}

module.exports = Logger;
