const fs = require("fs");
const CONFIG = require("../configs/config");

// eslint-disable-next-line no-unused-vars
const LogObject = require("../data/log-object");
const datetimeUtils = require("../utils/datetime.utils");

/**
 * @param {LogObject} object
 */
function log(object) {
    const now = new Date();
    const record = `${datetimeUtils.getFull(now)} [${object.type}] ${object.data}\n`;
    const filepath = `${CONFIG.log.dir + datetimeUtils.getDate(now)}.log`;
    fs.appendFileSync(filepath, record);
}

module.exports = {
    log,
};
