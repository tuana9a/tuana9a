// eslint-disable-next-line no-unused-vars
const Task = require("./task");

class Job {
    /**
     * @param {Task[]} tasks
     */
    constructor(tasks) {
        this.tasks = tasks;
    }
}

module.exports = Job;
