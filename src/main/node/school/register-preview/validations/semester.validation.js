const SafeError = require("../../../global/exceptions/safe-error");

module.exports = {
    check(semester) {
        if (!String(semester).match(/^\d+\w*$/)) {
            throw new SafeError("wrong semester");
        }
    },
};
