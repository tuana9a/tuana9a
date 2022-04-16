const ResponseEntity = require("../data/response-entity");
const SafeError = require("../exceptions/safe-error");
const LOGGER = require("../loggers/logger");

module.exports = {
    wrapper(handler) {
        const safeHandler = async (req, resp) => {
            try {
                const data = await handler(req, resp);
                resp.setHeader("Content-Type", "application/json; charset=utf-8");
                resp.send(new ResponseEntity(1, "success", data));
            } catch (err) {
                if (err instanceof SafeError) {
                    // do nothing
                } else {
                    // internal server error
                    LOGGER.error(err);
                }
                resp.setHeader("Content-Type", "application/json; charset=utf-8");
                resp.status(500);
                resp.send(new ResponseEntity(0, err.message));
            } finally {
                // error or not
                // just end the connection
                resp.end();
            }
        };
        return safeHandler;
    },
};
