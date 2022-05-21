const ratelimit = require("express-rate-limit");

const submitEntry = ratelimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5, // 5 times
    handler(req, resp) {
        const responseMessage = `${req.socket.localAddress} too many`;
        resp.status(403);
        resp.send(responseMessage);
    },
});

module.exports = {
    submitEntry,
};
