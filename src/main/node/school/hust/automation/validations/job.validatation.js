class JobValidation {
    isValidJob(job) {
        if (!job) {
            return false;
        }
        if (!job.tasks) {
            return false;
        }
        if (!Array.isArray(job.tasks)) {
            return false;
        }
        if (job.tasks.length === 0) {
            return false;
        }
        if (!job.tasks.every((task) => this.isValidTask(task))) {
            return false;
        }
        return true;
    }

    // eslint-disable-next-line class-methods-use-this
    isValidTask(task) {
        if (!task) {
            return false;
        }
        if (!task.run) {
            return false;
        }
        return true;
    }
}

module.exports = JobValidation;
