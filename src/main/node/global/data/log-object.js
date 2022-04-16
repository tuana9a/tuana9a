class LogObject {
    /**
     * @param {String} type
     * @param {*} data
     */
    constructor(type, data) {
        this.type = type || "INFO";
        this.data = data;
    }
}

module.exports = LogObject;
