const Job = require("../data/job");
const Task = require("../data/task");
const {
    gotoLoginPage,
    loginUntilSuccess,
    logout,
    autoRegisterClasses,
    crawlRegisterResult,
} = require("../actions/dk-sis.hust.edu.vn");
const { onServerError, onAccountOrServerError } = require("../breakers/hust.edu.vn");

module.exports = new Job([
    new Task(gotoLoginPage, onServerError),
    new Task(loginUntilSuccess, onAccountOrServerError),
    new Task(autoRegisterClasses, onServerError),
    new Task(crawlRegisterResult, onServerError),
    new Task(logout),
]);
