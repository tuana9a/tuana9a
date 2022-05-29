class Task {
    /**
     * @param {Function} run
     * @param {Function} breaker
     * @param {Boolean} needToLog
     */
    constructor(run, breaker = false, needToLog = false) {
        this.run = run;
        this.breaker = breaker;
        this.needToLog = needToLog;
    }
}

module.exports = Task;
