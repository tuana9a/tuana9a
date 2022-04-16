const fs = require("fs");

const HARDCODE = require("../configs/hardcode");
// eslint-disable-next-line no-unused-vars
const LogObject = require("../data/log-object");
const datetimeUtils = require("../utils/datetime.utils");

/**
 * @param {LogObject} object
 */
function log(object) {
    const now = new Date();
    const record = `${datetimeUtils.getFull(now)} [${object.type}] ${object.data}\n`;
    const filepath = `${HARDCODE.logsDir + datetimeUtils.getDate(now)}.log`;
    fs.appendFileSync(filepath, record);
}

module.exports = {
    log,
};
