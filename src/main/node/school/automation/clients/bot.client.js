const axios = require("axios").default.create();
const AUTOMATION_CONFIG = require("../configs/config");

class BotClient {
    constructor() {
        this.mapper = new Map();
    }

    getJobId(actionId) {
        return this.mapper.get(actionId);
    }

    setJobId(actionId, jobId) {
        this.mapper.set(actionId, jobId);
    }

    async send(entry) {
        const body = {
            jobId: this.getJobId(entry.actionId),
            data: entry,
        };
        return axios
            .post(AUTOMATION_CONFIG.bot.endpoint, body, {
                headers: {
                    secret: AUTOMATION_CONFIG.bot.secret,
                },
            })
            .then((res) => res.data);
    }
}

const botClient = new BotClient();

module.exports = botClient;
