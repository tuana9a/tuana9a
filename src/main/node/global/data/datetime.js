class DateTime {
    /**
     * @param {Date} date
     */
    constructor(date = new Date()) {
        this.n = date.getTime();
        this.s = date.toString();
    }
}

module.exports = DateTime;
