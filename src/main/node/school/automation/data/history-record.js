class HistoryRecord {
    /**
     * @param {Object[]} details
     */
    constructor(details) {
        // eslint-disable-next-line no-underscore-dangle
        this._id = null;
        this.entryId = null;
        this.details = details || [];
    }
}

module.exports = HistoryRecord;
