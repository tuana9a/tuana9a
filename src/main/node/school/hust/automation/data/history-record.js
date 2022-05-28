const DateTime = require("../../../../global/data/datetime");

class HistoryRecord {
    /**
     * @param {Object[]} logs
     */
    constructor(name = "", data = null, logs = []) {
        // eslint-disable-next-line no-underscore-dangle
        this._id = null;
        this.name = name || "";
        this.data = data;
        this.logs = logs || [];
        this.isCompleted = false;
        this.created = new DateTime();
    }
}

module.exports = HistoryRecord;
