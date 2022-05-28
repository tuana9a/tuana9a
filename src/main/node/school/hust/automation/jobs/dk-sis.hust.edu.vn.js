const {
    gotoLoginPage,
    loginUntilSuccess,
    logout,
    autoRegisterClasses,
    crawlRegisterResult,
} = require("../actions/dk-sis.hust.edu.vn");
const { onServerError, onAccountOrServerError } = require("../breakers/hust.edu.vn");

module.exports = {
    autoRegisterClasses: {
        tasks: [
            { run: gotoLoginPage, breaker: onServerError },
            { run: loginUntilSuccess, breaker: onAccountOrServerError },
            { run: autoRegisterClasses, breaker: onServerError },
            { run: crawlRegisterResult, breaker: onServerError },
            { run: logout },
        ],
    },
};
