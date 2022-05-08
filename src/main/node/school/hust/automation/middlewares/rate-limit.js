const ratelimit = require("express-rate-limit");

const CONFIG = require("../configs/config");

const submitEntry = ratelimit({
    windowMs: CONFIG.rateLimit.submitEntry.windowMs,
    max: CONFIG.rateLimit.submitEntry.max,
    handler(req, resp) {
        const responseMessage = `${req.socket.localAddress} too many`;
        resp.status(403);
        resp.send(responseMessage);
    },
});

module.exports = {
    submitEntry,
};
