const HttpStatusCode = require("../configs/http-status-code");

class SafeError extends Error {
    constructor(message, code = HttpStatusCode.BAD_REQUEST) {
        super(message);
        this.code = code;
    }
}

module.exports = SafeError;
