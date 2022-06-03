import LOGGER from "../../global/loggers/logger";

export default class BaseExec {
    constructor({ os, command }) {
        this.os = os;
        this.command = command;
        this.handlers = new Map();
    }

    // eslint-disable-next-line class-methods-use-this
    execute(command) {
        LOGGER.info(command);
        return command;
    }

    exit() {
        for (const key of this.handlers.keys()) {
            this.handlers.delete(key);
        }
        this.handlers = null;
    }
}
