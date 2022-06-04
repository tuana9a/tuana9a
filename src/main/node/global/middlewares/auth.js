class Auth {
    /**
     * check secret header for important request
     * @param {String} yourSecret
     */
    isCorrectSecret(yourSecret) {
        const correctToken = Buffer.from(yourSecret).toString("base64");
        return (req, resp, next) => {
            const { authorization } = req.headers;

            if (authorization !== `Basic ${correctToken}`) {
                resp.status(401).send("Unauthorized");
                return;
            }

            next();
        };
    }
}

module.exports = Auth;
