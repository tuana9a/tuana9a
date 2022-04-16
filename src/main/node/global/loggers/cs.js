// eslint-disable-next-line no-unused-vars
const LogObject = require("../data/log-object");
const datetimeUtils = require("../utils/datetime.utils");

/**
 * @param {LogObject} object
 */
function log(object) {
    const now = new Date();
    let { data } = object;
    if (typeof data === "object") {
        data = JSON.stringify(data, null, "  ");
    }
    const record = `${datetimeUtils.getFull(now)} [${object.type}] ${data}\n`;
    // eslint-disable-next-line no-console
    console.log(record);
}

module.exports = {
    log,
};
