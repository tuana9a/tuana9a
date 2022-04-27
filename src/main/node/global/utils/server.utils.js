const ResponseEntity = require("../data/response-entity");
const SafeError = require("../exceptions/safe-error");
const LOGGER = require("../loggers/logger");

module.exports = {
    makeSafeHandler(handler) {
        const safeHandler = async (req, resp, next) => {
            try {
                const data = await handler(req, resp, next);
                resp.setHeader("Content-Type", "application/json; charset=utf-8");
                resp.send(new ResponseEntity(1, "success", data));
            } catch (err) {
                if (err instanceof SafeError) {
                    resp.setHeader("Content-Type", "application/json; charset=utf-8");
                    resp.status(err.code);
                    resp.send(new ResponseEntity(0, err.message));
                } else {
                    // internal server error
                    LOGGER.error(err);
                    resp.setHeader("Content-Type", "application/json; charset=utf-8");
                    resp.status(500);
                    resp.send(new ResponseEntity(0, err.message));
                }
            } finally {
                // error or not
                // just end the connection
                resp.end();
            }
        };
        return safeHandler;
    },
};
