/**
 * check secret header for important request
 * @param {String} yourSecret
 */
function requireCorrectSecretHeader(yourSecret) {
    return (req, resp, next) => {
        const { secret, Secret, SECRET } = req.headers;
        if (secret && secret === yourSecret) {
            next();
            return;
        }
        if (Secret && Secret === yourSecret) {
            next();
            return;
        }
        if (SECRET && SECRET === yourSecret) {
            next();
            return;
        }
        resp.sendStatus(403);
    };
}

module.exports = requireCorrectSecretHeader;
