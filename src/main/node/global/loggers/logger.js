const cs = require("./cs");
const fs = require("./fs");
// eslint-disable-next-line no-unused-vars
const LogObject = require("../data/log-object");

const handlers = new Map();
handlers.set("cs", cs);
handlers.set("fs", fs);

class Logger {
    constructor() {
        this.handler = cs;
    }

    /**
     * @param {String} handlerName
     */
    use(handlerName) {
        this.handler = handlers.get(handlerName);
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
            this.handler.log(object);
        }
    }
}

const LOGGER = new Logger();

module.exports = LOGGER;
