const SafeError = require("../../../../global/exceptions/safe-error");

class SemesterValidation {
    check(semester) {
        if (!String(semester).match(/^\d+\w*$/)) {
            throw new SafeError("wrong semester");
        }
    }
}

module.exports = SemesterValidation;
