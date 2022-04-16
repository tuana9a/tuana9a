const ratelimit = require("express-rate-limit");

const HARDCODE = require("../../../global/configs/hardcode");

const submitEntry = ratelimit({
    windowMs: HARDCODE.rateLimit.automation.windowMs,
    max: HARDCODE.rateLimit.automation.max,
    handler(req, resp) {
        const responseMessage = `${req.socket.localAddress} too many`;
        resp.status(403);
        resp.send(responseMessage);
    },
});

module.exports = {
    submitEntry,
};
