const CONFIG = require("../configs/config");

/**
 * check secret header for important request
 * @param {import("express").Request} req
 * @param {import("express").Response} resp
 * @param {import("express").NextFunction} next
 */
function requireCorrectSecretHeader(req, resp, next) {
    const { secret } = req.headers;
    if (secret && secret === CONFIG.security.secret) {
        next();
        return;
    }
    resp.sendStatus(403);
}

module.exports = {
    requireCorrectSecretHeader,
};
