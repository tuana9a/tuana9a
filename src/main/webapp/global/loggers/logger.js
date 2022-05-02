import cs from "./cs";

class Logger {
    constructor(handler) {
        this.handler = handler || cs;
    }

    setHandler(handler) {
        this.handler = handler;
    }

    log(message) {
        this.handler.log(message);
    }

    error(error) {
        this.handler.error(error);
    }

    warn(message) {
        this.handler.warn(message);
    }

    info(message) {
        this.handler.info(message);
    }

    debug(message) {
        this.handler.debug(message);
    }
}

const LOGGER = new Logger();

export default LOGGER;
