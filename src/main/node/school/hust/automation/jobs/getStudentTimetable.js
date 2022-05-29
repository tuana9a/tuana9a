const Job = require("../data/job");
const Task = require("../data/task");
const {
    gotoLoginPage,
    loginUntilSuccess,
    crawlTimeTable,
    logout,
} = require("../actions/ctt-sis.hust.edu.vn");
const { onServerError, onAccountOrServerError } = require("../breakers/hust.edu.vn");

module.exports = new Job([
    new Task(gotoLoginPage, onServerError),
    new Task(loginUntilSuccess, onAccountOrServerError),
    new Task(crawlTimeTable, onServerError),
    new Task(logout),
]);
