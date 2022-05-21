const ResponseEntity = require("../data/response-entity");
const SafeError = require("../exceptions/safe-error");

class ServerUtils {
    logger;

    makeSafeHandler(handler, bind = null) {
        const LOGGER = this.logger;
        const safeHandler = async (req, resp, next) => {
            try {
                const data = await handler.call(bind, req, resp, next);
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
    }
}

module.exports = ServerUtils;
