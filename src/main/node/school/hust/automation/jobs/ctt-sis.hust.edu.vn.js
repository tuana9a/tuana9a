const {
    gotoLoginPage,
    loginUntilSuccess,
    logout,
    crawlStudentProgram,
    crawlTimeTable,
} = require("../actions/ctt-sis.hust.edu.vn");
const { onServerError, onAccountOrServerError } = require("../breakers/hust.edu.vn");

module.exports = {
    checkAccount: {
        tasks: [
            { run: gotoLoginPage, breaker: onServerError },
            { run: loginUntilSuccess, breaker: onServerError },
            { run: logout },
        ],
    },
    getStudentProgram: {
        tasks: [
            { run: gotoLoginPage, breaker: onServerError },
            { run: loginUntilSuccess, breaker: onAccountOrServerError },
            { run: crawlStudentProgram, breaker: onServerError },
            { run: logout },
        ],
    },
    getStudentTimetable: {
        tasks: [
            { run: gotoLoginPage, break: onServerError },
            { run: loginUntilSuccess, breaker: onAccountOrServerError },
            { run: crawlTimeTable, breaker: onServerError },
            { run: logout },
        ],
    },
};
