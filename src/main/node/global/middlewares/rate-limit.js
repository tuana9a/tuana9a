const ratelimit = require("express-rate-limit");
const HttpStatusCode = require("../data/http-status-code");

class RateLimit {
    logger;

    CONFIG;

    create({ windowMs, max }) {
        const { logger, CONFIG } = this;
        if (CONFIG.ignoreRateLimit) {
            return ratelimit({
                windowMs: 0,
                max: 0,
            });
        }
        return ratelimit({
            windowMs,
            max,
            handler(req, resp) {
                const message = "Too many requests from this IP, please try again later";
                logger.info(`${req.socket.localAddress} send to many requests`);
                resp.status(HttpStatusCode.TOO_MANY_REQUESTS);
                resp.send(message);
            },
        });
    }
}

module.exports = RateLimit;
