/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const DateTime = require("../../../../global/data/datetime");
const HistoryRecord = require("../data/history-record");

class JobRunner {
    jobValidation;

    puppeteerManager;

    logger;

    CONFIG;

    /**
     * chạy một job đã có
     * @param {*} data
    */
    async run(job, data) {
        // đảm bảo là có job, nếu không thì lỗi chưa check ở tiền xử lý
        if (!this.jobValidation.isValidJob(job)) {
            throw new Error("invalid job");
        }
        // prepare opt
        const ctx = {
            data,
            page: await this.puppeteerManager.getPageByIndex(0),
            fs: require("fs"),
            axios: require("axios"),
            FormData: require("form-data"),
            getCaptchaToTextEndpointsUrl: this.CONFIG.automation.getCaptchaToTextEndpointsUrl,
        };
        const result = new HistoryRecord("result", data);
        result.isCompleted = true;
        // eslint-disable-next-line no-restricted-syntax
        for (const task of job.tasks) {
            let output = { messages: [] };
            let logRecord = {};
            try {
                // eslint-disable-next-line no-await-in-loop
                output = await task.run(ctx);
            } catch (err) {
                this.logger.error(err);
                output.isServerError = true;
                output.messages.push({
                    name: err.name,
                    message: err.message,
                    stack: err.stack.split("\n"),
                });
            }
            logRecord = {
                task: task.run.name,
                output,
                at: new DateTime(),
            };
            result.logs.push(logRecord);
            // check xem có cần add lịch sử không
            if (task.needToLog) {
                this.logger.info(`output: ${JSON.stringify(logRecord, null, 2)}`);
            }
            // check xem có break không ?
            if (task.breaker) {
                if (task.breaker(output)) {
                    logRecord.breaker = { name: task.breaker.name, isBreak: true };
                    result.isCompleted = false;
                    break;
                }
            }
        }
        return result;
    }
}

module.exports = JobRunner;
