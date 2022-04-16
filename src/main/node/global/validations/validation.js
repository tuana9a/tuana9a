const SafeError = require("../exceptions/safe-error");

module.exports = {
    checkNulOrUndefined(input, name) {
        if (!input) {
            throw new SafeError(`${name} is null or undefined`);
        }
    },
};
