const SafeError = require("../exceptions/safe-error");

class Validation {
    checkNulOrUndefined(input, name) {
        if (!input) {
            throw new SafeError(`${name} is null or undefined`);
        }
    }
}

module.exports = Validation;
